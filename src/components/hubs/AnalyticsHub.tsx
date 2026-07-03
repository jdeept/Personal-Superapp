"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AnalyticsHub() {
  const [crossData, setCrossData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState("Analyzing your performance...");

  useEffect(() => {
    async function fetchData() {
      try {
        const [tradesRes] = await Promise.all([
          fetch('/api/trades')
        ]);

        const tradesData = await tradesRes.json();
        
        const last7Days = Array.from({length: 7}).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const dailyData = await Promise.all(last7Days.map(async (date) => {
          // Fetch habits for this specific date
          const hRes = await fetch(`/api/habits?date=${date}`);
          const hData = await hRes.json();
          
          const completed = hData.filter((h: any) => h.completed).length;
          const total = hData.length;
          const habitScore = total > 0 ? Math.round((completed / total) * 100) : 0;

          // Filter trades for this date
          const dayTrades = tradesData.filter((t: any) => t.date === date);
          const dailyPnl = dayTrades.reduce((sum: number, t: any) => sum + Number(t.pnl), 0);

          return {
            date: date.substring(5), // MM-DD
            pnl: dailyPnl,
            habits: habitScore
          };
        }));

        setCrossData(dailyData);

        // Simple insight generation
        const highHabitDays = dailyData.filter(d => d.habits >= 80);
        const lowHabitDays = dailyData.filter(d => d.habits < 80);
        
        const highHabitPnl = highHabitDays.reduce((sum, d) => sum + d.pnl, 0);
        const lowHabitPnl = lowHabitDays.reduce((sum, d) => sum + d.pnl, 0);

        if (highHabitDays.length > 0 && highHabitPnl > lowHabitPnl) {
          setInsight(`"Days with 80%+ habit completion generated $${highHabitPnl.toFixed(2)} in profit."`);
        } else {
          setInsight("Keep logging data to unlock cross-referenced behavioral insights.");
        }

      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold uppercase tracking-widest">Analytics Hub</h2>
        <p className="text-gray-400 mt-2">Find correlations between your habits and your results.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <p className="text-lg font-bold text-white mb-2">💡 OS Insight</p>
        <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: insight.replace(/\$(\d+(\.\d+)?)/, '<strong className="text-green-400">$$$1</strong>').replace(/80%\+ habit completion/, '<strong className="text-white">80%+ habit completion</strong>') }} />
      </div>

      <Card className="bg-transparent border-white/20 text-white">
        <CardHeader>
          <CardTitle className="uppercase tracking-widest">Habits vs. Trading P&L (Last 7 Days)</CardTitle>
          <CardDescription className="text-gray-400">Cross-referencing execution with financial results.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="h-[400px] flex items-center justify-center text-gray-500">Computing cross-references...</div>
          ) : (
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={crossData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" orientation="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val: number) => `$${val}`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val: number) => `${val}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderColor: '#ffffff20', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{fill: '#ffffff10'}}
                  />
                  <Bar yAxisId="left" dataKey="pnl" name="Trading P&L" fill="#ffffff" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="habits" name="Habit Completion" fill="#4ade80" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
