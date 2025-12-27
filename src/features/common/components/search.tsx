"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/ui/input";
import { useDebounce } from "@/src/features/common/hooks/useDebounce";
import { searchStores, searchProducts } from "@/src/app/actions/search";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string | number;
  name: string;
  revenue?: string | number;
}

export function Search({ page }: { page: "stores" | "products" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearch) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        let results = [];
        if (page === "stores") {
          results = await searchStores(debouncedSearch);
        } else {
          results = await searchProducts(debouncedSearch);
        }
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch, page]);

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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="pl-10 pr-10"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-muted-foreground"></div>
            </div>
          )}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover text-popover-foreground rounded-md border shadow-md z-50 max-h-[300px] overflow-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  className="w-full text-left px-4 py-2 hover:bg-muted/50 text-sm transition-colors flex items-center justify-between"
                  onClick={() => {
                    setSearchQuery(result.name);
                    setShowResults(false);
                    router.push(`/${page}/${result.id}`);
                  }}
                >
                  <span className="font-medium">{result.name}</span>
                  {result.revenue && (
                    <span className="text-xs text-muted-foreground">
                      {result.revenue}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
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
