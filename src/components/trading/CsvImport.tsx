"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { UploadCloud, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CsvImport() {
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log("Parsed CSV Data:", results.data);
        setParsedData(results.data);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      }
    });
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        handleFileUpload(file);
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!parsedData) return;
    
    setIsImporting(true);
    try {
      // Map PapaParse output to match Trade schema
      const formattedTrades = parsedData.map((row) => ({
        date: row.Date || row.date,
        ticker: row.Ticker || row.ticker || row.Symbol || row.symbol,
        type: row.Type || row.type || row.Action || 'Long',
        entry: parseFloat(row.Entry || row.entry || row.Price || 0),
        exit: parseFloat(row.Exit || row.exit || row.Price || 0),
        pnl: parseFloat(row.PnL || row.pnl || row.Net || 0),
        tags: [] // Default empty tags for imported trades
      }));

      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedTrades)
      });

      if (res.ok) {
        alert(`Successfully imported ${formattedTrades.length} trades!`);
        setParsedData(null);
      } else {
        alert("Failed to import trades.");
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Error importing trades.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold uppercase tracking-widest">CSV Import</h2>
        <p className="text-gray-400 mt-2">Bulk-import your historical trades from your broker.</p>
      </div>

      <Card className="bg-transparent border-white/20 text-white">
        <CardHeader>
          <CardTitle className="uppercase tracking-widest">The Parser Engine</CardTitle>
          <CardDescription className="text-gray-400">Drag and drop your broker's CSV export here.</CardDescription>
        </CardHeader>
        <CardContent>
          
          {!parsedData ? (
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                isDragging ? "border-white bg-white/10" : "border-white/20 hover:bg-white/5 hover:border-white/50"
              }`}
            >
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                id="csv-upload" 
                onChange={handleFileInput}
              />
              <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-4">
                <UploadCloud className="w-12 h-12 text-gray-400" />
                <div>
                  <p className="text-lg font-bold">Drag & drop your CSV here</p>
                  <p className="text-sm text-gray-400 mt-1">or click to browse files</p>
                </div>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="font-bold text-lg">CSV Parsed Successfully</p>
                    <p className="text-sm text-gray-400">Found {parsedData.length} rows to import.</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setParsedData(null)}
                  className="bg-transparent text-white border-white/20 hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>

              <Button 
                onClick={handleImport}
                disabled={isImporting}
                className="w-full bg-white text-black hover:bg-gray-200 uppercase font-bold py-6 text-lg transition-all"
              >
                {isImporting ? 'Importing...' : `Import ${parsedData.length} Trades to Journal`}
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
