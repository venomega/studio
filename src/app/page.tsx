"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Transaction, FilterOption } from '@/types';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import NumericInputDisplay from '@/components/NumericInputDisplay';
import TransactionList from '@/components/TransactionList';
import FilterMenu from '@/components/FilterMenu';
import { v4 as uuidv4 } from 'uuid';


export default function CosmicBalancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isExpenseMode, setIsExpenseMode] = useState<boolean>(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const { toast } = useToast();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (showDescriptionModal) return;

    const { key } = event;

    if (/\d/.test(key)) {
      event.preventDefault();
      setCurrentInput(prev => {
        if (prev === "0" && key === "0") return prev; // Prevent multiple leading zeros like "00"
        if (prev === "0" && key !== "0") return key; // Replace "0" with new digit
        const newValue = prev + key;
        if (newValue.length > 15) return prev; 
        const parts = newValue.split('.');
        if (parts.length > 1 && parts[1].length > 2) return prev;
        return newValue;
      });
    } else if (key === '.') {
      event.preventDefault();
      setCurrentInput(prev => (prev.includes('.') || prev === "") ? prev : prev + '.');
    } else if (key === '-') {
      event.preventDefault();
      setIsExpenseMode(prev => !prev);
    } else if (key === 'Backspace') {
      event.preventDefault();
      setCurrentInput(prev => prev.length > 0 ? prev.slice(0, -1) : "");
       if (currentInput.length === 1 && currentInput === "-") { 
         setCurrentInput("");
         setIsExpenseMode(false);
      } else if (currentInput === "") { // Handles case when input becomes empty
         setIsExpenseMode(false);
      }
    } else if (key === 'Enter') {
      event.preventDefault();
      if (currentInput === "" || currentInput === "0" || currentInput === "." || parseFloat(currentInput) === 0) {
        toast({ title: "Invalid Amount", description: "Please enter a valid non-zero amount.", variant: "destructive" });
        return;
      }
      // Regex to validate format like 123 or 123.45 (positive numbers)
      const amountRegex = /^\d+(\.\d{1,2})?$/;
      if (!amountRegex.test(currentInput)) {
        toast({ title: "Invalid Amount Format", description: "Amount must be a number, e.g., 123 or 123.45.", variant: "destructive" });
        return;
      }
      const amount = parseFloat(currentInput);
      if (isNaN(amount) || amount <= 0) {
         toast({ title: "Invalid Amount", description: "Amount must be a positive number.", variant: "destructive" });
        return;
      }
      setShowDescriptionModal(true);
    }
  }, [currentInput, showDescriptionModal, toast]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  

  const handleSaveTransaction = () => {
    if (description.trim() === "") {
      toast({ title: "Missing Description", description: "Please enter a description for the transaction.", variant: "destructive" });
      return;
    }
    const amount = parseFloat(currentInput);
     if (isNaN(amount) || amount <= 0) { 
      toast({ title: "Invalid Amount", description: "An error occurred with the amount.", variant: "destructive" });
      return;
    }

    const newTransaction: Transaction = {
      id: uuidv4(),
      type: isExpenseMode ? 'expense' : 'income',
      amount: amount,
      date: new Date().toISOString(),
      description: description.trim(),
    };

    setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({ title: "Transaction Saved", description: `${isExpenseMode ? 'Expense' : 'Income'} of $${amount.toFixed(2)} recorded.` });

    setCurrentInput("");
    setIsExpenseMode(false);
    setDescription("");
    setShowDescriptionModal(false);
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let result: Transaction[];
    switch (activeFilter) {
      case 'monthly_expenses':
        result = transactions.filter(t =>
          t.type === 'expense' &&
          new Date(t.date).getMonth() === currentMonth &&
          new Date(t.date).getFullYear() === currentYear
        );
        break;
      case 'monthly_income':
        result = transactions.filter(t =>
          t.type === 'income' &&
          new Date(t.date).getMonth() === currentMonth &&
          new Date(t.date).getFullYear() === currentYear
        );
        break;
      case 'annual_balance': 
        result = transactions.filter(t => new Date(t.date).getFullYear() === currentYear);
        break;
      case 'all':
      default:
        result = transactions;
    }
    return result.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, activeFilter]);

  const summaryText = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    let total: number;

    switch (activeFilter) {
      case 'monthly_expenses':
        total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
        return `Total Expenses (${now.toLocaleString('default', { month: 'long' })}): $${total.toFixed(2)}`;
      case 'monthly_income':
        total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
        return `Total Income (${now.toLocaleString('default', { month: 'long' })}): $${total.toFixed(2)}`;
      case 'annual_balance':
        const currentYearTransactions = transactions.filter(t => new Date(t.date).getFullYear() === currentYear);
        const income = currentYearTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expenses = currentYearTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return `Annual Balance (${currentYear}): $${(income - expenses).toFixed(2)} (Income: $${income.toFixed(2)}, Expenses: $${expenses.toFixed(2)})`;
      default:
        return null;
    }
  }, [activeFilter, transactions, filteredTransactions]);


  return (
    <div className="relative flex flex-col h-screen overflow-hidden font-body">
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="Cosmic background of Earth from the Moon"
        fill
        className="-z-10 object-cover"
        priority
        data-ai-hint="earth moon"
      />

      <div className="relative z-10 flex flex-col h-full p-4 md:p-6 text-foreground">
        <div className="flex-shrink-0 mb-2">
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-headline font-bold">Cosmic Balance</h1>
            <FilterMenu activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </header>
          {summaryText && <div className="mt-2 text-center text-md text-muted-foreground italic">{summaryText}</div>}
        </div>

        <div className="flex-grow flex items-center justify-center py-4">
          <NumericInputDisplay value={currentInput || "0"} isExpense={isExpenseMode} />
        </div>

        <div className="flex-shrink-0 h-[55vh] sm:h-[60vh] md:h-[65vh] bg-card/70 backdrop-blur-sm rounded-lg p-2 md:p-4 shadow-xl border border-border">
          <TransactionList transactions={filteredTransactions} />
        </div>
      </div>

      <Dialog open={showDescriptionModal} onOpenChange={setShowDescriptionModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transaction Description</DialogTitle>
            <DialogDescription>
              Enter a description for this {isExpenseMode ? 'expense' : 'income'} of ${parseFloat(currentInput || "0").toFixed(2)}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right col-span-1">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                onKeyDown={(e) => { 
                  if (e.key === 'Enter' && description.trim() !== "") { 
                    e.preventDefault(); 
                    e.stopPropagation();
                    handleSaveTransaction();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDescriptionModal(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSaveTransaction} disabled={description.trim() === ""}>Save Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
