import { cn } from "@/utils/utils";

const Categories = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  setCurrentPage,
}: {
  categories: {
    id: string;
    label: string;
    subcategories?: { id: string; label: string }[];
  }[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string) => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (subcategory: string | null) => void;
  setCurrentPage: (page: number) => void;
}) => {
  const activeCategory = categories?.find((c) => c.id === selectedCategory);
  const hasSubcategories =
    activeCategory &&
    activeCategory?.subcategories &&
    activeCategory?.subcategories?.length > 0;

  return (
    <div
      className="space-y-3 mb-6 animate-slide-up"
      style={{ animationDelay: "200ms" }}
    >
      <div className="flex flex-wrap gap-2">
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setCurrentPage(1);
              setSelectedCategory(category.id);
              setSelectedSubcategory(null);
            }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Subcategory Tabs */}
      {hasSubcategories && (
        <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-primary/30">
          <button
            onClick={() => {
              setCurrentPage(1);
              setSelectedSubcategory(null);
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
              selectedSubcategory === null
                ? "bg-primary/20 text-primary border border-primary/40"
                : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            All {activeCategory.label}
          </button>
          {/* {activeCategory.subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubcategory(sub.id);
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                selectedSubcategory === sub.id
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {sub.label}
            </button>
          ))} */}
        </div>
      )}
    </div>
  );
};

export default Categories;
