"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";

export function FinanceHub() {
  const [netWorthData, setNetWorthData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [liquidCash, setLiquidCash] = useState("");
  const [investments, setInvestments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNetWorth = async () => {
    try {
      const res = await fetch('/api/networth');
      if (res.ok) {
        const data = await res.json();
        setNetWorthData(data);
      }
    } catch (error) {
      console.error("Failed to fetch net worth data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetWorth();
  }, []);

  const handleLogSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liquidCash || !investments || !date) return;
    setIsSubmitting(true);
    
    const totalValue = Number(liquidCash) + Number(investments);

    try {
      const res = await fetch('/api/networth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          totalValue,
          liquidCash: Number(liquidCash),
          investments: Number(investments)
        })
      });

      if (res.ok) {
        setLiquidCash("");
        setInvestments("");
        fetchNetWorth(); // Refresh chart
      }
    } catch (error) {
      console.error("Failed to log snapshot:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentNetWorth = netWorthData.length > 0 ? netWorthData[netWorthData.length - 1].totalValue : 0;
  const currentLiquid = netWorthData.length > 0 ? netWorthData[netWorthData.length - 1].liquidCash : 0;
  const currentInvested = netWorthData.length > 0 ? netWorthData[netWorthData.length - 1].investments : 0;

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
            <p className="text-4xl font-bold text-white">${currentNetWorth.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-white/20 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Liquid Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">${currentLiquid.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-white/20 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">${currentInvested.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-transparent border-white/20 text-white lg:col-span-2">
          <CardHeader>
            <CardTitle className="uppercase tracking-widest">Net Worth Velocity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500">Loading chart...</div>
            ) : netWorthData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500">Log a snapshot to see your chart</div>
            ) : (
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={netWorthData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#ffffff50" 
                      tick={{ fill: '#ffffff50', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#ffffff50" 
                      tick={{ fill: '#ffffff50', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', borderColor: '#ffffff20', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Net Worth']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="totalValue" 
                      stroke="#fff" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-transparent border-white/20 text-white">
          <CardHeader>
            <CardTitle className="uppercase tracking-widest">Log Snapshot</CardTitle>
            <CardDescription className="text-gray-400">Save your current balances.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogSnapshot} className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 uppercase tracking-widest">Month (YYYY-MM)</label>
                <input 
                  type="month" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-md p-2 text-white focus:outline-none focus:border-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 uppercase tracking-widest">Liquid Cash ($)</label>
                <input 
                  type="number" 
                  value={liquidCash}
                  onChange={(e) => setLiquidCash(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-md p-2 text-white focus:outline-none focus:border-white"
                  placeholder="e.g. 15000"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 uppercase tracking-widest">Investments ($)</label>
                <input 
                  type="number" 
                  value={investments}
                  onChange={(e) => setInvestments(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-md p-2 text-white focus:outline-none focus:border-white"
                  placeholder="e.g. 50000"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-gray-200 uppercase font-bold py-6 text-lg mt-4"
              >
                {isSubmitting ? "Saving..." : "Save Snapshot"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
