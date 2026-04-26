import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, SlidersHorizontal, ChevronDown, Check, LayoutGrid, ListFilter } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  selectedTech: string[];
  onTechChange: (tech: string[]) => void;
  technologies: string[];
  className?: string;
  placeholder?: string;
}

export function SearchFilter({
  searchTerm = '',
  onSearchChange,
  selectedCategory = 'All',
  onCategoryChange,
  categories = [],
  selectedTech = [],
  onTechChange,
  technologies = [],
  className = '',
  placeholder = 'Search projects...'
}: SearchFilterProps) {
  const [isFocused, setIsFocused] = useState(false);

  const toggleTechnology = (tech: string) => {
    if (selectedTech.includes(tech)) {
      onTechChange(selectedTech.filter(t => t !== tech));
    } else {
      onTechChange([...selectedTech, tech]);
    }
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoryChange('All');
    onTechChange([]);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'All' || selectedTech.length > 0;

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Main Search and Filter Row */}
      <div className="flex flex-col md:flex-row gap-4" role="search" aria-label="Project and blog filters">
        <div className={`relative flex-1 group transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/20 scale-[1.01]' : ''}`}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2" aria-hidden="true">
            <Search className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label={placeholder}
            className="h-10 pl-10 pr-10 text-sm rounded-xl border-none bg-card shadow-lg shadow-black/[0.03] dark:shadow-white/[0.02] placeholder:font-light focus-visible:ring-0"
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-muted"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          {/* Enhanced Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                aria-label={`Filter by category. Current: ${selectedCategory}`}
                className={`h-10 px-4 rounded-xl border-none bg-card shadow-lg shadow-black/[0.03] dark:shadow-white/[0.02] gap-2 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${selectedCategory !== 'All' ? 'text-primary' : ''}`}
              >
                <ListFilter className="w-4 h-4" />
                <span className="hidden sm:inline">Category:</span> {selectedCategory}
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${selectedCategory !== 'All' ? 'rotate-180' : ''}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2 rounded-xl border-none shadow-2xl" align="end">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-3 py-2">
                Filter by Category
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="opacity-50" />
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  aria-selected={selectedCategory === category}
                  className={`rounded-xl px-3 py-2.5 my-0.5 cursor-pointer transition-colors ${selectedCategory === category ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    {category}
                    {selectedCategory === category && <Check className="w-4 h-4" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Enhanced Technology Multi-Select */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                aria-label={`Filter by technology. ${selectedTech.length} selected`}
                className={`h-10 px-4 rounded-xl border-none bg-card shadow-lg shadow-black/[0.03] dark:shadow-white/[0.02] gap-2 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${selectedTech.length > 0 ? 'text-primary' : ''}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Tech</span>
                {selectedTech.length > 0 && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary rounded-lg px-1.5 py-0.5 text-[10px] border-none">
                    {selectedTech.length}
                  </Badge>
                )}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2 rounded-xl border-none shadow-2xl" align="end">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                  Select Technologies
                </span>
                {selectedTech.length > 0 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onTechChange([]); }}
                    aria-label="Reset technology filters"
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
                  >
                    Reset
                  </button>
                )}
              </div>
              <DropdownMenuSeparator className="mb-3 opacity-50" />
              <div className="grid grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar" role="listbox" aria-label="Technologies">
                {technologies.map((tech) => (
                  <button
                    key={tech}
                    role="option"
                    aria-selected={selectedTech.includes(tech)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleTechnology(tech);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedTech.includes(tech)
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <span className="truncate">{tech}</span>
                    {selectedTech.includes(tech) && <Check className="w-3 h-3 flex-shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Access Pills & Active Filters Display */}
      <AnimatePresence mode="popLayout">
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap items-center gap-2 pt-2"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mr-2">
              Active:
            </span>
            
            {searchTerm && (
              <FilterPill label={`"${searchTerm}"`} onRemove={() => onSearchChange('')} />
            )}
            
            {selectedCategory !== 'All' && (
              <FilterPill label={selectedCategory} onRemove={() => onCategoryChange('All')} />
            )}
            
            {selectedTech.map((tech) => (
              <FilterPill key={tech} label={tech} onRemove={() => toggleTechnology(tech)} />
            ))}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/10 transition-colors ml-auto"
            >
              Clear All
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest"
    >
      {label}
      <button 
        onClick={onRemove}
        className="hover:bg-primary/10 rounded-full p-0.5 transition-colors"
        aria-label={`Remove filter: ${label}`}
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
