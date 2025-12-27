"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/ui/input";

export function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-background max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 items-end mb-3">
      <div className="w-full">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Procura
        </label>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Procure por uma loja e pressione Enter para pesquisar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="w-full flex items-center">
        <div className="text-sm font-medium text-foreground">
          Condições de filtro:
        </div>
        <div className="flex gap-2 ml-2">
          <button className="px-3 py-1 rounded-full text-sm border border-border hover:bg-muted bg-muted">
            Últimos 30 dias
          </button>
        </div>
      </div>
    </div>
  );
}
