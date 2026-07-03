"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Mock data
const mockTrades = [
  { id: '1', date: '2023-10-25', ticker: 'AAPL', type: 'Long', entry: 170.50, exit: 175.00, pnl: 450.00, tags: ['#VWAP_Bounce', '#Flawless_Execution'] },
  { id: '2', date: '2023-10-26', ticker: 'TSLA', type: 'Short', entry: 210.00, exit: 215.50, pnl: -550.00, tags: ['#Breakout_Failure', '#FOMO_Entry'] },
  { id: '3', date: '2023-10-27', ticker: 'SPY', type: 'Long', entry: 410.20, exit: 412.80, pnl: 260.00, tags: ['#Support_Long'] },
];

export function TradeJournal() {
  const [trades, setTrades] = useState(mockTrades);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold uppercase tracking-widest">Trade Journal</h2>
        <p className="text-gray-400 mt-2">Your interactive ledger and self-audit tool.</p>
      </div>

      <div className="border border-white/20 rounded-md bg-black">
        <Table>
          <TableCaption className="text-gray-500 pb-4">A list of your recent trades.</TableCaption>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/20 hover:bg-transparent">
              <TableHead className="w-[120px] text-gray-400 font-bold uppercase tracking-widest">Date</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase tracking-widest">Ticker</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase tracking-widest">Type</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase tracking-widest">Entry</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase tracking-widest">Exit</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase tracking-widest text-right">P&L</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase tracking-widest max-w-[300px]">Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.id} className="border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                <TableCell className="font-medium text-gray-300">{trade.date}</TableCell>
                <TableCell className="font-bold">{trade.ticker}</TableCell>
                <TableCell>{trade.type}</TableCell>
                <TableCell>${trade.entry.toFixed(2)}</TableCell>
                <TableCell>${trade.exit.toFixed(2)}</TableCell>
                <TableCell className={`text-right font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                </TableCell>
                <TableCell className="flex flex-wrap gap-1">
                  {trade.tags.map(tag => (
                    <span 
                      key={tag} 
                      className={`text-xs px-2 py-1 rounded-sm border ${
                        tag.includes('FOMO') || tag.includes('Chasing') || tag.includes('Impatient') 
                          ? 'border-red-500/50 text-red-400 bg-red-950/30' 
                          : 'border-white/20 text-gray-300 bg-white/5'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
