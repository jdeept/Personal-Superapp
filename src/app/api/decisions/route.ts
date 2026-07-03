import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Decision } from '@/models/Decision';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all decisions, sorted by creation date descending
    const decisions = await Decision.find({}).sort({ createdAt: -1 }).lean();
    
    const formattedDecisions = decisions.map((doc: any) => ({
      id: doc._id.toString(),
      title: doc.title,
      rationale: doc.rationale,
      expectedOutcome: doc.expectedOutcome,
      risks: doc.risks,
      alternatives: doc.alternatives,
      reviewDate: doc.reviewDate,
      outcomeReview: doc.outcomeReview,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return NextResponse.json(formattedDecisions);
  } catch (error) {
    console.error("Failed to fetch decisions:", error);
    return NextResponse.json({ error: "Failed to fetch decisions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.title || !body.rationale || !body.expectedOutcome || !body.reviewDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newDecision = await Decision.create({
      title: body.title,
      rationale: body.rationale,
      expectedOutcome: body.expectedOutcome,
      risks: body.risks || "",
      alternatives: body.alternatives || "",
      reviewDate: new Date(body.reviewDate),
    });

    return NextResponse.json(newDecision, { status: 201 });
  } catch (error) {
    console.error("Failed to create decision:", error);
    return NextResponse.json({ error: "Failed to create decision" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.id || !body.outcomeReview) {
      return NextResponse.json({ error: "ID and outcomeReview are required" }, { status: 400 });
    }

    const updatedDecision = await Decision.findByIdAndUpdate(
      body.id,
      {
        outcomeReview: body.outcomeReview,
        status: 'REVIEWED',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedDecision) {
      return NextResponse.json({ error: "Decision not found" }, { status: 404 });
    }

    return NextResponse.json(updatedDecision);
  } catch (error) {
    console.error("Failed to update decision:", error);
    return NextResponse.json({ error: "Failed to update decision" }, { status: 500 });
  }
}
