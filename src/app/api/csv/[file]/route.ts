import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ file: string }> }
) {

  const { file: rawFile } = await params;
  const filename = decodeURIComponent(rawFile);

  const filePath = path.join(process.cwd(), "public/csv", filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  return new NextResponse(content, {
    headers: { "Content-Type": "text/csv" },
  });
}
