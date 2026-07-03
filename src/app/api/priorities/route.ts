import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Priority } from '@/models/Priority';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all priorities, sorted by creation date ascending
    const priorities = await Priority.find({}).sort({ createdAt: 1 }).lean();
    
    const formattedPriorities = priorities.map((doc: any) => ({
      id: doc._id.toString(),
      label: doc.label,
      done: doc.done,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return NextResponse.json(formattedPriorities);
  } catch (error) {
    console.error("Failed to fetch priorities:", error);
    return NextResponse.json({ error: "Failed to fetch priorities" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.label) {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }

    const newPriority = await Priority.create({
      label: body.label,
      done: false,
    });

    return NextResponse.json({
      id: newPriority._id.toString(),
      label: newPriority.label,
      done: newPriority.done,
      createdAt: newPriority.createdAt,
      updatedAt: newPriority.updatedAt,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create priority:", error);
    return NextResponse.json({ error: "Failed to create priority" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.id || typeof body.done !== 'boolean') {
      return NextResponse.json({ error: "ID and done status are required" }, { status: 400 });
    }

    const updatedPriority = await Priority.findByIdAndUpdate(
      body.id,
      { done: body.done, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedPriority) {
      return NextResponse.json({ error: "Priority not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPriority);
  } catch (error) {
    console.error("Failed to update priority:", error);
    return NextResponse.json({ error: "Failed to update priority" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedPriority = await Priority.findByIdAndDelete(id);

    if (!deletedPriority) {
      return NextResponse.json({ error: "Priority not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete priority:", error);
    return NextResponse.json({ error: "Failed to delete priority" }, { status: 500 });
  }
}
