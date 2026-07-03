"use client";

import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PreFlightRiskMatrix() {
  const { netWorth } = useAppStore();
  
  const [accountBalance, setAccountBalance] = useState<string>(netWorth.toString());
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [riskPercent, setRiskPercent] = useState<string>("1");
  
  const balance = parseFloat(accountBalance) || 0;
  const entry = parseFloat(entryPrice) || 0;
  const sl = parseFloat(stopLoss) || 0;
  const risk = parseFloat(riskPercent) || 0;

  const riskAmount = (balance * (risk / 100));
  let positionSize = 0;
  
  if (entry > 0 && sl > 0 && entry !== sl) {
    const riskPerShare = Math.abs(entry - sl);
    positionSize = Math.floor(riskAmount / riskPerShare);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold uppercase tracking-widest">Pre-Flight Risk Matrix</h2>
        <p className="text-gray-400 mt-2">Your dynamic operational calculator.</p>
      </div>

      <Card className="bg-transparent border-white/20 text-white">
        <CardHeader>
          <CardTitle className="uppercase tracking-widest">Position Sizer</CardTitle>
          <CardDescription className="text-gray-400">Calculate your exact max size based on risk.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Account Balance ($)</Label>
              <Input 
                type="number" 
                value={accountBalance} 
                onChange={(e) => setAccountBalance(e.target.value)}
                className="bg-black border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label>Risk %</Label>
              <Input 
                type="number" 
                value={riskPercent} 
                onChange={(e) => setRiskPercent(e.target.value)}
                className="bg-black border-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Entry Price ($)</Label>
              <Input 
                type="number" 
                value={entryPrice} 
                onChange={(e) => setEntryPrice(e.target.value)}
                className="bg-black border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label>Stop Loss ($)</Label>
              <Input 
                type="number" 
                value={stopLoss} 
                onChange={(e) => setStopLoss(e.target.value)}
                className="bg-black border-white/20"
              />
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center space-y-2 mt-6">
            <p className="text-sm text-gray-400 uppercase tracking-widest">Maximum Position Size</p>
            <p className="text-5xl font-bold text-white">{positionSize}</p>
            <p className="text-sm text-red-400 pt-2">Risking ${riskAmount.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
