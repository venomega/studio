"use client";

import type { FC } from 'react';
import type { Transaction } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: FC<TransactionListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No transactions yet.
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className={cn(
            "transition-all duration-300 ease-in-out hover:shadow-lg",
            transaction.type === 'income' ? 'border-green-500/50 hover:border-green-500' : 'border-red-500/50 hover:border-red-500'
          )}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className={cn(
                  "text-2xl",
                  transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                )}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </CardTitle>
                <CardDescription className="text-xs">
                  {new Date(transaction.date).toLocaleDateString()}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{transaction.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TransactionList;
