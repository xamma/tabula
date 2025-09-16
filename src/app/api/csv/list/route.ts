import { NextResponse } from "next/server";
import fs from "fs/promises";

const CSV_DIRS = [
  "/data/csv",       // mounted via ConfigMap
  "public/csv",      // public CSVs
  "src/data/csv",    // local dev CSVs
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
    } catch {
      // ignore missing dirs
    }
  }

  return NextResponse.json(files);
}