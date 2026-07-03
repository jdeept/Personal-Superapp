import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Habit } from '@/models/Habit';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    // Default to fetching today's habits
    const url = new URL(req.url);
    let dateStr = url.searchParams.get('date');
    if (!dateStr) {
      dateStr = new Date().toISOString().split('T')[0];
    }
    
    let habits = await Habit.find({ date: dateStr }).lean();
    
    // If no habits exist for today, initialize them based on standard template
    if (habits.length === 0) {
      const template = [
        { date: dateStr, name: 'Morning Review', completed: false },
        { date: dateStr, name: 'Workout', completed: false },
        { date: dateStr, name: 'Read 20 pages', completed: false },
        { date: dateStr, name: 'Evening Reflection', completed: false },
      ];
      await Habit.insertMany(template);
      habits = await Habit.find({ date: dateStr }).lean();
    }
    
    const formattedHabits = habits.map((habit: any) => ({
      id: habit._id.toString(),
      name: habit.name,
      completed: habit.completed,
      date: habit.date
    }));

    return NextResponse.json(formattedHabits);
  } catch (error) {
    console.error("Failed to fetch habits:", error);
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, completed } = body;

    const updatedHabit = await Habit.findByIdAndUpdate(
      id, 
      { completed },
      { new: true }
    );

    return NextResponse.json(updatedHabit);
  } catch (error) {
    console.error("Failed to update habit:", error);
    return NextResponse.json({ error: "Failed to update habit" }, { status: 500 });
  }
}
