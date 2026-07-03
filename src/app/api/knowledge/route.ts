import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { KnowledgeDocument } from '@/models/KnowledgeDocument';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all documents, sorted by updatedAt descending
    const documents = await KnowledgeDocument.find({}).sort({ updatedAt: -1 }).lean();
    
    const formattedDocs = documents.map((doc: any) => ({
      id: doc._id.toString(),
      title: doc.title,
      category: doc.category,
      content: doc.content,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,
    }));

    return NextResponse.json(formattedDocs);
  } catch (error) {
    console.error("Failed to fetch knowledge documents:", error);
    return NextResponse.json({ error: "Failed to fetch knowledge documents" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.title || !body.category) {
      return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
    }

    const newDoc = await KnowledgeDocument.create({
      title: body.title,
      category: body.category,
      content: body.content || "",
    });

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("Failed to create document:", error);
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
