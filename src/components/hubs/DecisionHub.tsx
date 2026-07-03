"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, ShieldAlert, BookOpen, Lightbulb } from "lucide-react";

export function DecisionHub() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold uppercase tracking-widest">Decision Hub</h2>
        <p className="text-gray-400 mt-2">Think before you act. Mental models and frameworks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Card className="bg-transparent border-white/20 text-white hover:border-white/50 transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="uppercase tracking-widest flex items-center gap-3 text-lg">
              <Scale className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              Decision Journal
            </CardTitle>
            <CardDescription className="text-gray-400">Pros/Cons frameworks and outcome tracking.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mt-4 border-t border-white/10 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Open Decisions</span>
                <span className="font-bold">3</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Reviewed Past Month</span>
                <span className="font-bold">12</span>
              </div>
            </div>
            <Button className="w-full mt-6 bg-white text-black hover:bg-gray-200">Log New Decision</Button>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-white/20 text-white hover:border-white/50 transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="uppercase tracking-widest flex items-center gap-3 text-lg">
              <ShieldAlert className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              Risk Matrix
            </CardTitle>
            <CardDescription className="text-gray-400">Evaluate impact vs probability.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mt-4 border-t border-white/10 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">High Risk Active</span>
                <span className="font-bold text-red-400">1</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Mitigations</span>
                <span className="font-bold">Active</span>
              </div>
            </div>
            <Button className="w-full mt-6 bg-transparent text-white border border-white/20 hover:bg-white/10">Evaluate Risk</Button>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-white/20 text-white hover:border-white/50 transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="uppercase tracking-widest flex items-center gap-3 text-lg">
              <Lightbulb className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              Idea Inbox
            </CardTitle>
            <CardDescription className="text-gray-400">Capture thoughts before they vanish.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mt-4 border-t border-white/10 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Unprocessed</span>
                <span className="font-bold text-yellow-400">8</span>
              </div>
            </div>
            <Button className="w-full mt-6 bg-transparent text-white border border-white/20 hover:bg-white/10">Capture Idea</Button>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-white/20 text-white hover:border-white/50 transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="uppercase tracking-widest flex items-center gap-3 text-lg">
              <BookOpen className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              Lessons Learned
            </CardTitle>
            <CardDescription className="text-gray-400">Post-mortems and distilled wisdom.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mt-4 border-t border-white/10 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total Entries</span>
                <span className="font-bold">45</span>
              </div>
            </div>
            <Button className="w-full mt-6 bg-transparent text-white border border-white/20 hover:bg-white/10">Browse Archive</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
