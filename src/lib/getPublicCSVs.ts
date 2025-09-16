import fs from "fs";
import path from "path";

export function getPublicCSVs() {
  const dirs = [
    path.join(process.cwd(), "public", "csv"),
    path.join(process.cwd(), "src", "data", "csv"),
    "/data/csv", // only works if running in container
  ];

  const files: { name: string; url: string }[] = [];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith(".csv")) {
        files.push({ name: file, url: `/files/${file}` });
      }
    }
  }

  return files;
}
