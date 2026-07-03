"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Target } from "lucide-react";
import { toast } from "sonner";

export function CommandCenter() {
  const [netWorth, setNetWorth] = useState(0);
  const [cashAvailable, setCashAvailable] = useState(0);
  const [todayRiskBudget, setTodayRiskBudget] = useState(0);
  
  const [habitsCompleted, setHabitsCompleted] = useState(0);
  const [totalHabits, setTotalHabits] = useState(0);
  
  const [currentStreak, setCurrentStreak] = useState(0);

  const [priorities, setPriorities] = useState<any[]>([]);
  const [newPriorityLabel, setNewPriorityLabel] = useState("");
  const [isAddingPriority, setIsAddingPriority] = useState(false);

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
            setTodayRiskBudget((latest.totalValue || 0) * 0.01);
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

        // Fetch Priorities
        const pRes = await fetch('/api/priorities');
        if (pRes.ok) {
          const pData = await pRes.json();
          setPriorities(pData);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    }
    loadDashboardData();
  }, []);

  const handleTogglePriority = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setPriorities(prev => prev.map(p => p.id === id ? { ...p, done: !currentStatus } : p));
    try {
      await fetch('/api/priorities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, done: !currentStatus })
      });
      toast.success(currentStatus ? "Priority uncompleted" : "Priority completed!");
    } catch (error) {
      console.error("Failed to toggle priority", error);
      toast.error("Failed to update priority.");
      // Revert on error
      setPriorities(prev => prev.map(p => p.id === id ? { ...p, done: currentStatus } : p));
    }
  };

  const handleAddPriority = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPriorityLabel.trim()) return;
    setIsAddingPriority(true);
    try {
      const res = await fetch('/api/priorities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newPriorityLabel })
      });
      if (res.ok) {
        const newP = await res.json();
        setPriorities(prev => [...prev, newP]);
        setNewPriorityLabel("");
        toast.success("Priority added!");
      } else {
        toast.error("Failed to add priority.");
      }
    } catch (error) {
      console.error("Failed to add priority", error);
      toast.error("Failed to add priority.");
    } finally {
      setIsAddingPriority(false);
    }
  };

  const handleDeletePriority = async (id: string) => {
    setPriorities(prev => prev.filter(p => p.id !== id));
    try {
      const res = await fetch(`/api/priorities?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Priority deleted!");
      } else {
        toast.error("Failed to delete priority.");
      }
    } catch (error) {
      console.error("Failed to delete priority", error);
      toast.error("Failed to delete priority.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="mb-6">
        <div>
          <h2 className="text-4xl font-bold uppercase tracking-tight">Good Morning</h2>
          <p className="text-gray-400 mt-2">Here is your daily overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Priorities / To-Do */}
        <div className="col-span-12 md:col-span-4 space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-widest border-b border-white/20 pb-2">Today's Priorities</h3>
          <div className="space-y-3">
            {priorities.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10 group">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id={`todo-${p.id}`} 
                    checked={p.done} 
                    onCheckedChange={() => handleTogglePriority(p.id, p.done)}
                    className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black" 
                  />
                  <label 
                    htmlFor={`todo-${p.id}`} 
                    className={`text-sm font-medium leading-none cursor-pointer ${p.done ? 'line-through text-gray-500' : 'text-white'}`}
                  >
                    {p.label}
                  </label>
                </div>
                <button 
                  onClick={() => handleDeletePriority(p.id)} 
                  className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            ))}
            <form onSubmit={handleAddPriority} className="flex items-center gap-2 mt-4">
              <input
                type="text"
                placeholder="Add a new priority..."
                value={newPriorityLabel}
                onChange={e => setNewPriorityLabel(e.target.value)}
                className="flex-1 bg-transparent border-b border-white/20 px-2 py-1 text-sm focus:outline-none focus:border-white text-white placeholder:text-gray-600"
              />
              <button 
                type="submit" 
                disabled={isAddingPriority || !newPriorityLabel.trim()} 
                className="text-xs uppercase font-bold tracking-widest text-gray-400 hover:text-white disabled:opacity-50"
              >
                Add
              </button>
            </form>
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
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
