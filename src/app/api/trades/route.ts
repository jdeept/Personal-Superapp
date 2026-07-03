import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Trade } from '@/models/Trade';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all trades, sorted by date (newest first)
    const trades = await Trade.find({}).sort({ date: -1 }).lean();
    
    // Convert _id to id for frontend compatibility
    const formattedTrades = trades.map((trade: any) => ({
      id: trade._id.toString(),
      date: trade.date,
      ticker: trade.ticker,
      type: trade.type,
      entry: trade.entry,
      exit: trade.exit,
      pnl: trade.pnl,
      tags: trade.tags,
    }));

    return NextResponse.json(formattedTrades);
  } catch (error) {
    console.error("Failed to fetch trades:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Check if it's an array (bulk import) or a single object
    if (Array.isArray(body)) {
      const insertedTrades = await Trade.insertMany(body);
      return NextResponse.json({ message: `Successfully imported ${insertedTrades.length} trades` }, { status: 201 });
    } else {
      const newTrade = await Trade.create(body);
      return NextResponse.json(newTrade, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to create trade(s):", error);
    return NextResponse.json({ error: "Failed to create trade(s)" }, { status: 500 });
  }
}
