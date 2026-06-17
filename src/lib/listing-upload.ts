import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";

const MAX_FILE_BYTES = 8 * 1024 * 1024;

export async function saveListingImages(listingId: string, files: File[]) {
  const valid = files.filter((f) => f instanceof File && f.size > 0);
  if (valid.length === 0) return [];

  for (const file of valid) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Faqat rasm fayllarini yuklash mumkin");
    }
    if (file.size > MAX_FILE_BYTES) {
      throw new Error("Rasm hajmi 8MB dan oshmasligi kerak");
    }
  }

  const dir = path.join(process.cwd(), "public", "uploads", "listings", listingId);
  await mkdir(dir, { recursive: true });

  const paths: string[] = [];
  for (const file of valid) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const filename = `${crypto.randomUUID()}${ext}`;
    await writeFile(path.join(dir, filename), buffer);
    paths.push(`/uploads/listings/${listingId}/${filename}`);
  }
  return paths;
}

export async function deleteListingImageFiles(listingId: string) {
  const dir = path.join(process.cwd(), "public", "uploads", "listings", listingId);
  await rm(dir, { recursive: true, force: true });
}
