"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Scale, ShieldAlert, BookOpen, Lightbulb, CheckCircle2, Circle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DecisionHub() {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Decision Form State
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [rationale, setRationale] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [risks, setRisks] = useState("");
  const [alternatives, setAlternatives] = useState("");
  // Default to 3 months from now
  const [reviewDate, setReviewDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Evaluate Decision Form State
  const [isEvalDialogOpen, setIsEvalDialogOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<any>(null);
  const [outcomeReview, setOutcomeReview] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  const fetchDecisions = async () => {
    try {
      const res = await fetch('/api/decisions');
      if (res.ok) {
        const data = await res.json();
        setDecisions(data);
      }
    } catch (error) {
      console.error("Failed to fetch decisions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const handleCreateDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rationale || !expectedOutcome || !reviewDate) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, rationale, expectedOutcome, risks, alternatives, reviewDate })
      });

      if (res.ok) {
        setTitle("");
        setRationale("");
        setExpectedOutcome("");
        setRisks("");
        setAlternatives("");
        setIsNewDialogOpen(false);
        fetchDecisions();
      }
    } catch (error) {
      console.error("Failed to create decision:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEvaluateDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDecision || !outcomeReview) return;
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/decisions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedDecision.id, outcomeReview })
      });

      if (res.ok) {
        setOutcomeReview("");
        setSelectedDecision(null);
        setIsEvalDialogOpen(false);
        fetchDecisions();
      }
    } catch (error) {
      console.error("Failed to evaluate decision:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const openDecisions = decisions.filter(d => d.status === 'OPEN').length;
  const reviewedPastMonth = decisions.filter(d => {
    if (d.status !== 'REVIEWED') return false;
    const reviewTime = new Date(d.updatedAt).getTime();
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return reviewTime > oneMonthAgo;
  }).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h2 className="text-3xl font-bold uppercase tracking-widest">Decision Hub</h2>
        <p className="text-gray-400 mt-2">Think before you act. Calibrate your judgment over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Decision Journal Card */}
        <Card className="bg-transparent border-white/20 text-white hover:border-white/50 transition-colors">
          <CardHeader>
            <CardTitle className="uppercase tracking-widest flex items-center gap-3 text-lg">
              <Scale className="w-6 h-6 text-gray-400" />
              Decision Journal
            </CardTitle>
            <CardDescription className="text-gray-400">Pros/Cons frameworks and outcome tracking.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mt-4 border-t border-white/10 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Open Decisions</span>
                <span className="font-bold">{openDecisions}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Reviewed Past Month</span>
                <span className="font-bold">{reviewedPastMonth}</span>
              </div>
            </div>
            
            <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
              <DialogTrigger className="w-full mt-6 bg-white text-black hover:bg-gray-200 uppercase font-bold h-10 px-4 py-2 rounded-md flex items-center justify-center">
                Log New Decision
              </DialogTrigger>
              <DialogContent className="bg-black border border-white/20 text-white sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="uppercase tracking-widest text-xl">Log Decision</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Document your thought process before making a significant choice.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateDecision} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs uppercase tracking-widest text-gray-400">Decision Summary</Label>
                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} className="bg-transparent border-white/20 text-white" placeholder="e.g. Pivot startup to B2B" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rationale" className="text-xs uppercase tracking-widest text-gray-400">Why am I doing this?</Label>
                    <Textarea id="rationale" value={rationale} onChange={e => setRationale(e.target.value)} className="bg-transparent border-white/20 text-white min-h-[80px]" placeholder="Core reasoning..." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedOutcome" className="text-xs uppercase tracking-widest text-gray-400">Expected Outcome</Label>
                    <Textarea id="expectedOutcome" value={expectedOutcome} onChange={e => setExpectedOutcome(e.target.value)} className="bg-transparent border-white/20 text-white min-h-[80px]" placeholder="What do I expect to happen?" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="risks" className="text-xs uppercase tracking-widest text-gray-400">Risks</Label>
                    <Textarea id="risks" value={risks} onChange={e => setRisks(e.target.value)} className="bg-transparent border-white/20 text-white min-h-[80px]" placeholder="What could go wrong?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternatives" className="text-xs uppercase tracking-widest text-gray-400">Alternatives</Label>
                    <Textarea id="alternatives" value={alternatives} onChange={e => setAlternatives(e.target.value)} className="bg-transparent border-white/20 text-white min-h-[80px]" placeholder="What else could I do?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reviewDate" className="text-xs uppercase tracking-widest text-gray-400">Target Review Date</Label>
                    <Input type="date" id="reviewDate" value={reviewDate} onChange={e => setReviewDate(e.target.value)} className="bg-transparent border-white/20 text-white" required />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-black hover:bg-gray-200 uppercase font-bold mt-2">
                    {isSubmitting ? "Logging..." : "Commit Decision"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Keeping placeholders for future features */}
        <Card className="bg-transparent border-white/20 text-white opacity-50 cursor-not-allowed">
          <CardHeader>
            <CardTitle className="uppercase tracking-widest flex items-center gap-3 text-lg">
              <ShieldAlert className="w-6 h-6 text-gray-400" />
              Risk Matrix
            </CardTitle>
            <CardDescription className="text-gray-400">Evaluate impact vs probability.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm italic text-gray-500 mt-8 text-center">Integration Pending...</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Decision Log</h3>
        
        {loading ? (
          <div className="text-gray-500 italic">Loading decisions...</div>
        ) : decisions.length === 0 ? (
          <div className="text-gray-500 italic p-6 bg-white/5 border border-white/10 rounded-lg text-center">
            No decisions logged yet. Start by logging a new decision above.
          </div>
        ) : (
          <div className="space-y-6">
            {decisions.map(decision => (
              <Card key={decision.id} className="bg-transparent border-white/20 text-white">
                <CardHeader className="pb-3 border-b border-white/10 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">{decision.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Logged: {new Date(decision.createdAt).toLocaleDateString()}</span>
                      <span>Target Review: {new Date(decision.reviewDate).toLocaleDateString()}</span>
                      <span className={`flex items-center gap-1 ${decision.status === 'REVIEWED' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {decision.status === 'REVIEWED' ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                        {decision.status}
                      </span>
                    </div>
                  </div>
                  
                  {decision.status === 'OPEN' && (
                    <Button 
                      variant="outline" 
                      className="border-white/20 bg-transparent hover:bg-white hover:text-black uppercase text-xs tracking-widest"
                      onClick={() => {
                        setSelectedDecision(decision);
                        setIsEvalDialogOpen(true);
                      }}
                    >
                      Evaluate Outcome
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-4 space-y-6 text-sm">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Why am I doing this?</h4>
                      <p className="text-gray-300">{decision.rationale}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Expected Outcome</h4>
                      <p className="text-gray-300">{decision.expectedOutcome}</p>
                    </div>
                    {decision.risks && (
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Risks</h4>
                        <p className="text-gray-300">{decision.risks}</p>
                      </div>
                    )}
                    {decision.alternatives && (
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Alternatives Considered</h4>
                        <p className="text-gray-300">{decision.alternatives}</p>
                      </div>
                    )}
                  </div>

                  {decision.status === 'REVIEWED' && decision.outcomeReview && (
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-md space-y-2">
                      <h4 className="text-xs uppercase tracking-widest text-green-400 font-bold">Review & Reality</h4>
                      <p className="text-gray-200">{decision.outcomeReview}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Evaluate Dialog */}
      <Dialog open={isEvalDialogOpen} onOpenChange={setIsEvalDialogOpen}>
        <DialogContent className="bg-black border border-white/20 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-widest text-xl">Evaluate Decision</DialogTitle>
            <DialogDescription className="text-gray-400">
              Look back at your initial thoughts. Was the outcome what you expected? Were you right?
            </DialogDescription>
          </DialogHeader>
          {selectedDecision && (
            <form onSubmit={handleEvaluateDecision} className="space-y-4 pt-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-md mb-4 text-sm space-y-2">
                <p><span className="text-gray-500 font-bold">Expected:</span> {selectedDecision.expectedOutcome}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="outcomeReview" className="text-xs uppercase tracking-widest text-gray-400">Reality vs Expectation</Label>
                <Textarea 
                  id="outcomeReview" 
                  value={outcomeReview} 
                  onChange={e => setOutcomeReview(e.target.value)} 
                  className="bg-transparent border-white/20 text-white min-h-[100px]" 
                  placeholder="What actually happened? What did you learn?" 
                  required 
                />
              </div>
              <Button type="submit" disabled={isEvaluating} className="w-full bg-green-500 hover:bg-green-600 text-white uppercase font-bold mt-2">
                {isEvaluating ? "Saving..." : "Save Review"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
