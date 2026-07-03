"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const PRE_MARKET_CHECKLIST = [
  "Checked economic news times?",
  "Slept 7+ hours?",
  "Mentally detached from yesterday's results?",
  "Reviewed today's trading plan?"
];

export function PreMarketGuard() {
  const [isOpen, setIsOpen] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  
  // Only run on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const allChecked = PRE_MARKET_CHECKLIST.every((_, idx) => checkedItems[idx]);

  const handleUnlock = () => {
    if (allChecked) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-black text-white border-white/20 select-none pointer-events-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold uppercase tracking-wider text-center">Discipline Gatekeeper</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            You must complete your pre-market protocol before unlocking the app.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-6">
          {PRE_MARKET_CHECKLIST.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <Checkbox 
                id={`check-${idx}`} 
                checked={checkedItems[idx] || false}
                onCheckedChange={(checked) => setCheckedItems(prev => ({ ...prev, [idx]: !!checked }))}
                className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black h-5 w-5 rounded-sm"
              />
              <label 
                htmlFor={`check-${idx}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {item}
              </label>
            </div>
          ))}
        </div>

        <Button 
          disabled={!allChecked} 
          onClick={handleUnlock}
          className="w-full bg-white text-black hover:bg-gray-200 uppercase font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {allChecked ? "Unlock App" : "Complete Checklist"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
