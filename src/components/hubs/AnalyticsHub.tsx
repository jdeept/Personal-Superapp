"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const crossData = [
  { week: 'W1', focusHours: 20, pnl: 450, habits: 85 },
  { week: 'W2', focusHours: 15, pnl: -200, habits: 60 },
  { week: 'W3', focusHours: 25, pnl: 800, habits: 95 },
  { week: 'W4', focusHours: 22, pnl: 350, habits: 88 },
];

export function AnalyticsHub() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold uppercase tracking-widest">Analytics Hub</h2>
        <p className="text-gray-400 mt-2">Find correlations between your habits and your results.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <p className="text-lg font-bold text-white mb-2">💡 OS Insight</p>
        <p className="text-gray-300">
          "Weeks with <strong className="text-white">90%+ habit completion</strong> coincided with your <strong className="text-green-400">best trading performance</strong>."
        </p>
      </div>

      <Card className="bg-transparent border-white/20 text-white">
        <CardHeader>
          <CardTitle className="uppercase tracking-widest">Habits vs. Trading P&L</CardTitle>
          <CardDescription className="text-gray-400">Cross-referencing execution with financial results.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={crossData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
                <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#ffffff20', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: '#ffffff10'}}
                />
                <Bar yAxisId="left" dataKey="pnl" name="Trading P&L ($)" fill="#ffffff" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="habits" name="Habits (%)" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
