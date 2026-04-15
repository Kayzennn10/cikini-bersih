import { NextResponse } from "next/server";
import { s3Client } from "../../../lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "../../../lib/db";

// Force biar Next.js tahu ini API dinamis
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!file) {
      return NextResponse.json({ error: "File foto tidak ada" }, { status: 400 });
    }

    // 1. Upload ke S3
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    }));

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // 2. Simpan ke RDS
    await db.execute(
      "INSERT INTO reports (title, description, image_url) VALUES (?, ?, ?)",
      [title, description, imageUrl]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Detail Error:", error);
    return NextResponse.json({ error: error.message || "Gagal kirim" }, { status: 500 });
  }
}