"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockNetWorthData = [
  { month: 'Jan', value: 110000 },
  { month: 'Feb', value: 115000 },
  { month: 'Mar', value: 112000 },
  { month: 'Apr', value: 118000 },
  { month: 'May', value: 121000 },
  { month: 'Jun', value: 125430 },
];

export function FinanceHub() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold uppercase tracking-widest">Finance Hub</h2>
        <p className="text-gray-400 mt-2">Track your net worth, cash flow, and portfolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-transparent border-white/20 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Total Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">$125,430</p>
            <p className="text-sm text-green-400 mt-1">+3.6% this month</p>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-white/20 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Liquid Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">$15,000</p>
            <p className="text-sm text-gray-400 mt-1">Checking & Savings</p>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-white/20 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">$110,430</p>
            <p className="text-sm text-green-400 mt-1">Stocks, Crypto, ETFs</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-transparent border-white/20 text-white">
        <CardHeader>
          <CardTitle className="uppercase tracking-widest">Net Worth Growth</CardTitle>
          <CardDescription className="text-gray-400">Your financial trajectory over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockNetWorthData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `$${val/1000}k`}
                  domain={['dataMin - 5000', 'dataMax + 5000']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#ffffff20', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Net Worth']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
