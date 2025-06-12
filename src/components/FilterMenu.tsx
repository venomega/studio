"use client";

import type { FC } from 'react';
import type { FilterOption } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";

interface FilterMenuProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filterLabels: Record<FilterOption, string> = {
  all: "All Entries",
  monthly_expenses: "Monthly Expenses",
  monthly_income: "Monthly Income",
  annual_balance: "Annual Transactions (Current Year)",
};

const FilterMenu: FC<FilterMenuProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" />
          {filterLabels[activeFilter]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter Transactions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(filterLabels) as FilterOption[]).map((filterKey) => (
          <DropdownMenuItem
            key={filterKey}
            onSelect={() => onFilterChange(filterKey)}
            className={activeFilter === filterKey ? "bg-accent" : ""}
          >
            {filterLabels[filterKey]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterMenu;
