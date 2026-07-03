"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Folder, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PRESET_CATEGORIES = [
  "Trading Playbooks",
  "Investment Research",
  "Company Notes",
  "Market Thesis",
  "Book Notes",
  "Templates & Checklists"
];

export function KnowledgeHub() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/knowledge');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, content: "" })
      });

      if (res.ok) {
        setTitle("");
        setCategory(PRESET_CATEGORIES[0]);
        setIsDialogOpen(false);
        fetchDocuments(); // Refresh list
      }
    } catch (error) {
      console.error("Failed to create document:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group documents by category
  const categoryCounts = PRESET_CATEGORIES.map(catName => ({
    name: catName,
    count: documents.filter(doc => doc.category === catName).length
  }));

  // Also include any custom categories that might have been added via DB manually
  documents.forEach(doc => {
    if (!PRESET_CATEGORIES.includes(doc.category)) {
      const existing = categoryCounts.find(c => c.name === doc.category);
      if (existing) {
        existing.count++;
      } else {
        categoryCounts.push({ name: doc.category, count: 1 });
      }
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-widest">Knowledge Hub</h2>
          <p className="text-gray-400 mt-2">Your second brain. Store information that supports better decisions.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="bg-white text-black hover:bg-gray-200 uppercase font-bold flex items-center gap-2 h-10 px-4 py-2 rounded-md">
            <Plus className="w-4 h-4" /> New Document
          </DialogTrigger>
          <DialogContent className="bg-black border border-white/20 text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="uppercase tracking-widest text-xl">Create Document</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new note or playbook to your second brain.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDocument} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs uppercase tracking-widest text-gray-400">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-transparent border-white/20 text-white"
                  placeholder="e.g. Q3 Earnings Playbook"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs uppercase tracking-widest text-gray-400">Folder</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-md p-2 text-white text-sm focus:outline-none focus:border-white"
                  required
                >
                  {PRESET_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-black hover:bg-gray-200 uppercase font-bold mt-2">
                {isSubmitting ? "Creating..." : "Save Document"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categoryCounts.map((cat, idx) => (
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
          {loading ? (
             <div className="p-4 text-center text-gray-500 italic">Loading documents...</div>
          ) : documents.length === 0 ? (
             <div className="p-4 text-center text-gray-500 italic bg-white/5 rounded-lg border border-white/10">Your second brain is empty. Create a document to start.</div>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-bold">{doc.title}</p>
                    <p className="text-xs text-gray-400">
                      Updated {new Date(doc.updatedAt).toLocaleDateString()} • {doc.category}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" className="text-gray-400 hover:text-white">Edit</Button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
