"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Target, Calendar } from "lucide-react";

export function CommandCenter() {
  const [netWorth, setNetWorth] = useState(0);
  const [cashAvailable, setCashAvailable] = useState(0);
  const [todayRiskBudget, setTodayRiskBudget] = useState(0);
  
  const [habitsCompleted, setHabitsCompleted] = useState(0);
  const [totalHabits, setTotalHabits] = useState(0);
  
  const [currentStreak, setCurrentStreak] = useState(0);

  const priorities = [
    { id: '1', label: "Review watchlist", done: false },
    { id: '2', label: "Client meeting", done: false },
    { id: '3', label: "Workout", done: true },
    { id: '4', label: "Journal yesterday's trades", done: false },
  ];

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Fetch Net Worth
        const nwRes = await fetch('/api/networth');
        if (nwRes.ok) {
          const nwData = await nwRes.json();
          if (nwData.length > 0) {
            const latest = nwData[nwData.length - 1];
            setNetWorth(latest.totalValue || 0);
            setCashAvailable(latest.liquidCash || 0);
            setTodayRiskBudget((latest.totalValue || 0) * 0.01); // 1% risk budget rule
          }
        }

        // Fetch Habits
        const hRes = await fetch('/api/habits');
        if (hRes.ok) {
          const hData = await hRes.json();
          setTotalHabits(hData.length);
          setHabitsCompleted(hData.filter((h: any) => h.completed).length);
        }

        // Fetch Trades for Streak
        const tRes = await fetch('/api/trades');
        if (tRes.ok) {
          const tData = await tRes.json();
          let streak = 0;
          for (let i = 0; i < tData.length; i++) {
            if (Number(tData[i].pnl) > 0) {
              streak++;
            } else {
              break;
            }
          }
          setCurrentStreak(streak);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold uppercase tracking-tight">Good Morning</h2>
          <p className="text-gray-400 mt-2">Here is your daily overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 uppercase tracking-widest">Market Status</p>
          <p className="text-xl font-bold flex items-center justify-end gap-2 text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Opens in 1h 15m
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Priorities / To-Do */}
        <div className="col-span-12 md:col-span-4 space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-widest border-b border-white/20 pb-2">Today's Priorities</h3>
          <div className="space-y-3">
            {priorities.map((p) => (
              <div key={p.id} className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-white/10">
                <Checkbox id={`todo-${p.id}`} checked={p.done} className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black" />
                <label 
                  htmlFor={`todo-${p.id}`} 
                  className={`text-sm font-medium leading-none cursor-pointer ${p.done ? 'line-through text-gray-500' : 'text-white'}`}
                >
                  {p.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Snapshots */}
        <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Finance Snapshot */}
          <Card className="bg-transparent border-white/20 text-white rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Finance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Net Worth</p>
                <p className="text-2xl font-bold">${netWorth.toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Cash Available</p>
                  <p className="font-semibold">${cashAvailable.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase">Risk Budget (1%)</p>
                  <p className="font-semibold text-red-400">${todayRiskBudget.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Snapshot */}
          <Card className="bg-transparent border-white/20 text-white rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Trading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Current Win Streak</p>
                <p className="text-2xl font-bold text-green-400">{currentStreak} Trades</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Economic Events</p>
                <p className="font-semibold text-gray-500 italic">Integration Pending...</p>
              </div>
            </CardContent>
          </Card>

          {/* Productivity Snapshot */}
          <Card className="bg-transparent border-white/20 text-white rounded-lg md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Productivity
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 uppercase">Focus Time Today</p>
                <p className="text-xl font-bold text-gray-500 italic">Integration Pending...</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Habits</p>
                  <p className="font-semibold">{habitsCompleted}/{totalHabits} Completed</p>
                </div>
                <div className="h-10 w-px bg-white/20 mx-2"></div>
                <div className="flex items-center gap-2 text-gray-500 italic">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <p className="font-semibold">Integration Pending...</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
