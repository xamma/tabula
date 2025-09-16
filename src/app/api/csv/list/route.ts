import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CSV_DIRS = [
  path.join(process.cwd(), "public/csv"),  // public CSVs
  path.join(process.cwd(), "src/data/csv"), // dev CSVs
  "/data/csv",                              // mounted via ConfigMap
];

export async function GET() {
  const files: { name: string }[] = [];

  for (const dir of CSV_DIRS) {
    try {
      const dirFiles = await fs.readdir(dir);
      for (const file of dirFiles) {
        if (file.endsWith(".csv")) {
          files.push({ name: file });
        }
      }
    } catch (err: unknown) {
      // ignore missing dirs
      console.warn(`Could not read dir ${dir}:`, String(err));
    }
  }

  return NextResponse.json(files);
}
