"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Folder, Plus } from "lucide-react";

export function KnowledgeHub() {
  const categories = [
    { name: "Trading Playbooks", count: 4 },
    { name: "Investment Research", count: 12 },
    { name: "Company Notes", count: 8 },
    { name: "Market Thesis", count: 2 },
    { name: "Book Notes", count: 15 },
    { name: "Templates & Checklists", count: 6 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-widest">Knowledge Hub</h2>
          <p className="text-gray-400 mt-2">Your second brain. Store information that supports better decisions.</p>
        </div>
        <Button className="bg-white text-black hover:bg-gray-200 uppercase font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {categories.map((cat, idx) => (
          <Card key={idx} className="bg-transparent border-white/20 text-white hover:border-white/50 transition-colors cursor-pointer group">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="uppercase tracking-widest flex items-center gap-2 text-sm">
                <Folder className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                {cat.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mt-2">{cat.count}</p>
              <p className="text-xs text-gray-500 uppercase mt-1">Documents</p>
            </CardContent>
          </Card>
        ))}

      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Recent Documents</h3>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-bold">Playbook: Opening Range Breakout</p>
                  <p className="text-xs text-gray-400">Updated 2 days ago • Trading Playbooks</p>
                </div>
              </div>
              <Button variant="ghost" className="text-gray-400 hover:text-white">Edit</Button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
