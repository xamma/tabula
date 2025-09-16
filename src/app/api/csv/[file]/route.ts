import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  req: Request,
  context: { params: Promise<{ file: string }> }
) {
  try {
    const { file: rawFile } = await context.params;
    const filename = decodeURIComponent(rawFile);
    console.log("Requested file:", filename);

    let filePath = path.join(process.cwd(), "public/csv", filename);
    console.log("Trying public path:", filePath);

    try {
      await fs.access(filePath);
      console.log("Found file in public/csv");
    } catch {
      filePath = path.join(process.cwd(), "src/data/csv", filename);
      console.log("Trying src/data path:", filePath);

      try {
        await fs.access(filePath);
        console.log("Found file in src/data/csv");
      } catch {
        filePath = path.join("/data/csv", filename);
        console.log("Trying mounted path:", filePath);

        try {
          await fs.access(filePath);
          console.log("Found file in /data/csv");
        } catch {
          console.warn("File not found anywhere");
          return NextResponse.json({ error: "File not found" }, { status: 404 });
        }
      }
    }

    const content = await fs.readFile(filePath, "utf-8");
    console.log("Returning file content, size:", content.length);

    return new NextResponse(content, {
      headers: { "Content-Type": "text/csv" },
    });
  } catch (err) {
    console.error("Error serving CSV:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
