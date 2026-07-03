"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function TradingAnalytics() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrades() {
      try {
        const res = await fetch('/api/trades');
        if (res.ok) {
          const data = await res.json();
          // reverse because api returns newest first, but chart wants oldest first
          setTrades(data.reverse());
        }
      } catch (error) {
        console.error("Failed to fetch trades:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrades();
  }, []);

  // Compute metrics
  let totalTrades = trades.length;
  let winningTrades = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  
  let currentBalance = 10000; // Starting baseline
  const equityCurve = trades.map((t, idx) => {
    const pnl = Number(t.pnl);
    if (pnl > 0) {
      winningTrades++;
      grossProfit += pnl;
    } else {
      grossLoss += Math.abs(pnl);
    }
    currentBalance += pnl;
    return {
      tradeIndex: idx + 1,
      balance: currentBalance,
      pnl: pnl
    };
  });

  // Calculate Win Rate and Profit Factor
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : (grossProfit > 0 ? 99 : 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-gray-400 font-normal uppercase tracking-wider text-sm">Win Rate</CardTitle>
            <div className="text-4xl font-bold">{winRate.toFixed(1)}%</div>
          </CardHeader>
        </Card>
        <Card className="bg-black border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-gray-400 font-normal uppercase tracking-wider text-sm">Profit Factor</CardTitle>
            <div className="text-4xl font-bold">{profitFactor.toFixed(2)}</div>
          </CardHeader>
        </Card>
        <Card className="bg-black border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-gray-400 font-normal uppercase tracking-wider text-sm">Total Trades</CardTitle>
            <div className="text-4xl font-bold">{totalTrades}</div>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-black border-white/10 text-white">
        <CardHeader>
          <CardTitle>Equity Curve</CardTitle>
          <CardDescription className="text-gray-400">Cumulative performance over {totalTrades} trades (Base: $10,000).</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="h-[400px] flex items-center justify-center text-gray-500">Loading trades...</div>
          ) : trades.length === 0 ? (
             <div className="h-[400px] flex items-center justify-center text-gray-500">No trades imported yet.</div>
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={equityCurve}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="tradeIndex" 
                    stroke="#ffffff50" 
                    tick={{ fill: '#ffffff50', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    stroke="#ffffff50" 
                    tick={{ fill: '#ffffff50', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val: number) => `$${val}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderColor: '#ffffff20', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Balance']}
                    labelFormatter={(label) => `Trade #${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#fff" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
