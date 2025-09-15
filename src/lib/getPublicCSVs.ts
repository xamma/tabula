import fs from "fs";
import path from "path";

export function getPublicCSVs() {
  const csvDir = path.join(process.cwd(), "public", "csv");
  if (!fs.existsSync(csvDir)) return [];

  return fs
    .readdirSync(csvDir)
    .filter((file) => file.endsWith(".csv"))
    .map((file) => ({
      name: file,
      url: `/csv/${file}`,
    }));
}
