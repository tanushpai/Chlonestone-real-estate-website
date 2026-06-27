import { createClient } from "@supabase/supabase-js";
import { unlink } from "fs/promises";
import { join } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

/**
 * Deletes an uploaded file either from local disk (development) or Supabase Storage (production).
 */
export async function deleteFile(fileUrl: string | null | undefined) {
  if (!fileUrl) return;

  try {
    // 1. Handle Local Disk files (Development fallback)
    if (fileUrl.startsWith("/uploads/")) {
      const filePath = join(process.cwd(), "public", fileUrl);
      await unlink(filePath).catch((err) => {
        // Ignore if file doesn't exist (ENOENT)
        if (err.code !== "ENOENT") {
          console.error(`Failed to delete local file: ${filePath}`, err);
        }
      });
      return;
    }

    // 2. Handle Supabase Storage files
    if (supabase && fileUrl.includes(".supabase.co/storage/v1/object/public/chlonestone-media/")) {
      const parts = fileUrl.split("/chlonestone-media/");
      if (parts.length > 1) {
        const fileName = parts[1];
        const { error } = await supabase.storage.from("chlonestone-media").remove([fileName]);
        if (error) {
          console.error(`Failed to delete Supabase storage file: ${fileName}`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Error deleting file: ${fileUrl}`, error);
  }
}
