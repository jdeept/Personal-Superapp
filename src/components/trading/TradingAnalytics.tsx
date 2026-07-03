"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const mockEquityData = [
  { date: 'Oct 01', balance: 100000 },
  { date: 'Oct 08', balance: 102000 },
  { date: 'Oct 15', balance: 101500 },
  { date: 'Oct 22', balance: 105000 },
  { date: 'Oct 29', balance: 104200 },
  { date: 'Nov 05', balance: 108000 },
  { date: 'Nov 12', balance: 112000 },
];

export function TradingAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold uppercase tracking-widest">Performance Analytics</h2>
        <p className="text-gray-400 mt-2">Your real-time scoreboard and equity curves.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-transparent border-white/20 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-400">68%</p>
            <p className="text-sm text-gray-400 mt-1">Last 30 Days</p>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-white/20 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Profit Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">2.4</p>
            <p className="text-sm text-gray-400 mt-1">Gross Gains / Gross Losses</p>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-white/20 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Top Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">#VWAP_Bounce</p>
            <p className="text-sm text-green-400 mt-1">+ $4,200 P&L</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-transparent border-white/20 text-white">
        <CardHeader>
          <CardTitle className="uppercase tracking-widest">Equity Curve</CardTitle>
          <CardDescription className="text-gray-400">Account balance progression over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockEquityData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value/1000}k`}
                  domain={['dataMin - 2000', 'dataMax + 2000']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#ffffff20', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
