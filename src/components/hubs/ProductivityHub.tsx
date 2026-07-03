"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw } from "lucide-react";

export function ProductivityHub() {
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    async function fetchHabits() {
      try {
        const res = await fetch('/api/habits');
        if (res.ok) {
          const data = await res.json();
          setHabits(data);
        }
      } catch (error) {
        console.error("Failed to fetch habits:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHabits();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Could play a sound here
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleHabit = async (id: string) => {
    // Optimistic UI update
    const updatedHabits = habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h);
    setHabits(updatedHabits);
    
    const habitToUpdate = updatedHabits.find(h => h.id === id);
    if (habitToUpdate) {
      try {
        await fetch('/api/habits', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, completed: habitToUpdate.completed })
        });
      } catch (error) {
        console.error("Failed to update habit:", error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold uppercase tracking-widest">Productivity Hub</h2>
        <p className="text-gray-400 mt-2">Execution-focused daily planner and habit tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Focus Timer */}
        <Card className="bg-transparent border-white/20 text-white">
          <CardHeader>
            <CardTitle className="uppercase tracking-widest text-center">Focus Timer</CardTitle>
            <CardDescription className="text-gray-400 text-center">Pomodoro Technique (25m)</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6 py-8">
            <div className="text-7xl font-bold font-mono tracking-tighter">
              {formatTime(timeLeft)}
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={toggleTimer} 
                className="bg-white text-black hover:bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center"
              >
                {isActive ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              </Button>
              <Button 
                onClick={resetTimer}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Habit Tracker */}
        <Card className="bg-transparent border-white/20 text-white">
          <CardHeader>
            <CardTitle className="uppercase tracking-widest">Daily Habits</CardTitle>
            <CardDescription className="text-gray-400">Your non-negotiables.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habits.map((habit) => (
                <div key={habit.id} className="flex items-center space-x-3 bg-white/5 p-4 rounded-lg border border-white/10">
                  <Checkbox 
                    id={`habit-${habit.id}`} 
                    checked={habit.completed}
                    onCheckedChange={() => toggleHabit(habit.id)}
                    className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black h-5 w-5" 
                  />
                  <label 
                    htmlFor={`habit-${habit.id}`} 
                    className={`text-base font-medium leading-none cursor-pointer ${habit.completed ? 'line-through text-gray-500' : 'text-white'}`}
                  >
                    {habit.name}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
              <p className="text-sm text-gray-400 uppercase">Completion Rate</p>
              <p className="font-bold text-lg text-white">
                {Math.round((habits.filter(h => h.completed).length / habits.length) * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
