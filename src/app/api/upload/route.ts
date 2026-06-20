import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client if credentials exist in the environment
const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseUrl = rawSupabaseUrl.trim().replace(/\/rest\/v1\/?$/, "");
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename to avoid collision
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;

    // --- SUPABASE STORAGE (Production Mode) ---
    if (supabase) {
      const { data, error } = await supabase.storage
        .from("chlonestone-media")
        .upload(uniqueFileName, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Retrieve the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from("chlonestone-media")
        .getPublicUrl(uniqueFileName);

      return NextResponse.json({ url: publicUrl });
    }

    // --- LOCAL DISK FALLBACK (Development Mode) ---
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "File uploads are only supported with Supabase Storage. Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
        { status: 503 }
      );
    }

    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const filePath = join(uploadsDir, uniqueFileName);

    // Save to disk
    await writeFile(filePath, buffer);

    // Return the public asset URL
    const fileUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
