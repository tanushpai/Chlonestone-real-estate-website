# Media Uploads — S3 Signed URLs

Direct browser → S3. API server never proxies bytes. Used by property photos, agent avatars, customer documents, brochures.

## Flow

1. Client requests signed PUT: `POST /api/media/upload { kind, contentType, sizeBytes }`
2. Server validates kind + content-type + size; generates S3 key; returns `{ url, key, headers }` valid 5 min.
3. Client `PUT` file directly to S3 with returned URL and `Content-Type` header.
4. Client registers the asset: `POST /api/properties/[id]/images { key, sortOrder }` (or equivalent for the resource).
5. Background job (Inngest) processes: virus scan → generate variants → update DB.

## Server: signing handler

```ts
// app/api/media/upload/route.ts
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

export const runtime = "nodejs";

const MAX_BYTES_BY_KIND = {
  property_image: 15 * 1024 * 1024,   // 15 MB
  agent_avatar:    5 * 1024 * 1024,
  customer_doc:   25 * 1024 * 1024,
  brochure:      100 * 1024 * 1024,
} as const;

const ALLOWED_TYPES = {
  property_image: ["image/jpeg","image/png","image/webp","image/avif","image/heic"],
  agent_avatar:   ["image/jpeg","image/png","image/webp"],
  customer_doc:   ["application/pdf","image/jpeg","image/png"],
  brochure:       ["application/pdf"],
} as const;

export const POST = withApi({
  body: z.object({
    kind: z.enum(["property_image","agent_avatar","customer_doc","brochure"]),
    contentType: z.string(),
    sizeBytes: z.number().int().positive(),
  }),
  auth: { roles: ["agent","agency_admin","admin","client"] },
})(async ({ data, session }) => {
  if (!ALLOWED_TYPES[data.kind].includes(data.contentType as any)) throw new HttpError(400, "bad_type");
  if (data.sizeBytes > MAX_BYTES_BY_KIND[data.kind]) throw new HttpError(400, "too_large");

  const key = `${data.kind}/${session.user.agencyId}/${crypto.randomUUID()}`;
  const { url, fields } = await createPresignedPost(s3, {
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Conditions: [
      ["content-length-range", 0, data.sizeBytes],
      ["eq", "$Content-Type", data.contentType],
    ],
    Fields: { "Content-Type": data.contentType },
    Expires: 300,
  });
  return { json: { url, fields, key } };
});
```

## Client: upload

```ts
async function upload(file: File, kind: Kind) {
  const { url, fields, key } = await fetch("/api/media/upload", {
    method: "POST",
    body: JSON.stringify({ kind, contentType: file.type, sizeBytes: file.size }),
  }).then(r => r.json());
  const form = new FormData();
  for (const [k,v] of Object.entries(fields)) form.append(k, v as string);
  form.append("file", file);
  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) throw new Error("upload failed");
  return key;
}
```

## Bucket setup

- **Private bucket**, no public ACLs.
- Block public access at account level.
- Server-side encryption (SSE-S3 default; SSE-KMS for `customer_doc`/`brochure`).
- Lifecycle: `tmp/*` → delete after 24h; `customer_doc/*` → Glacier after 90d (legal retention).
- CORS: only `PUT` from app origins.

## Serving images

- **Public images** (property photos, agent avatars): served via CloudFront with origin = S3. Image URLs returned by API are CloudFront URLs.
- **Private documents** (IDs, contracts): generate short-lived signed GET URLs on demand; never store the signed URL.

## Optimization

Background job after upload:
- Generate AVIF + WebP variants at widths 400 / 800 / 1200 / 1920.
- Strip EXIF (privacy + size).
- Write variants back to S3 under same key prefix.
- DB stores base key; render layer composes `${cloudfront}/${key}?w=800&fmt=avif` (CloudFront Functions or Image Optimizer).

## Virus scanning

- ClamAV on Lambda triggered by S3 `ObjectCreated`. On infected → move to quarantine bucket, mark DB record `scanStatus = "infected"`, notify uploader.
- Don't expose unscanned files publicly; gate `images.publicUrl` on `scanStatus === "clean"`.

## Anti-patterns

- ❌ Uploading via your API server (memory + bandwidth + cost)
- ❌ Public-write S3 bucket (account compromise)
- ❌ Storing signed URLs in DB (they expire)
- ❌ Skipping content-type and size checks on signing
- ❌ Trusting client-reported size (S3 condition enforces it server-side)
- ❌ Serving private docs without auth check on the signed GET request
- ❌ Keeping EXIF GPS data on property photos (leaks owner location)
