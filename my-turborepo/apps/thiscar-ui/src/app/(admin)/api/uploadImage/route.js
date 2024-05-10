import { NextResponse } from "next/server";
import { storage } from "@/services/firebase-admin";

export async function POST(req, res) {
    const formData = await req.formData();

    const file = formData.get("file");
    const uploadFileName = formData.get("fileName");
    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        const blob = storage.file(uploadFileName);

        await blob.save(buffer);

        // this is to ensure the photo is public and available for download.
        await blob.makePublic();

        const imageUrl = blob.publicUrl();
        return NextResponse.json({ Message: "Success", publicUrl: imageUrl, status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
}
