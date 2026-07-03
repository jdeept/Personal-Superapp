import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { NetWorthSnapshot } from '@/models/NetWorthSnapshot';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all snapshots, sorted by date ascending
    const snapshots = await NetWorthSnapshot.find({}).sort({ date: 1 }).lean();
    
    const formattedSnapshots = snapshots.map((snapshot: any) => ({
      id: snapshot._id.toString(),
      date: snapshot.date,
      totalValue: snapshot.totalValue,
      liquidCash: snapshot.liquidCash,
      investments: snapshot.investments,
    }));

    return NextResponse.json(formattedSnapshots);
  } catch (error) {
    console.error("Failed to fetch net worth snapshots:", error);
    return NextResponse.json({ error: "Failed to fetch net worth snapshots" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const newSnapshot = await NetWorthSnapshot.create({
      date: body.date,
      totalValue: Number(body.totalValue),
      liquidCash: Number(body.liquidCash),
      investments: Number(body.investments)
    });

    return NextResponse.json(newSnapshot, { status: 201 });
  } catch (error) {
    console.error("Failed to create snapshot:", error);
    return NextResponse.json({ error: "Failed to create snapshot" }, { status: 500 });
  }
}
