"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import MinMaxFilter from "./MinMaxFilter";
import { filterOptions } from "../dummyData/filterOptions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Define types for selected filters
interface SelectedFilter {
  id: number;
  name: string;
  category: string;
  categoryId: number;
}

const CategoryFilter = () => {
  // Create an object to store the seeMore state for each filter
  const [seeMoreState, setSeeMoreState] = useState<Record<number, boolean>>({});
  // Track selected filters
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);
  // Track expanded filter sections (for mobile only)
  const [expandedFilters, setExpandedFilters] = useState<
    Record<number, boolean>
  >({});
  // Track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleSeeMoreClick = (filterIndex: number) => {
    // Toggle the state for the specific filter index
    setSeeMoreState((prevState) => ({
      ...prevState,
      [filterIndex]: !prevState[filterIndex], // Toggle the visibility
    }));
  };

  const toggleFilterExpand = (filterIndex: number) => {
    if (isMobile) {
      setExpandedFilters((prevState) => ({
        ...prevState,
        [filterIndex]: !prevState[filterIndex],
      }));
    }
  };

  const handleFilterSelect = (
    option: { id: number; name: string },
    filterIndex: number,
    filterName: string,
    isChecked: boolean
  ) => {
    if (isChecked) {
      // Add to selected filters
      setSelectedFilters((prev) => [
        ...prev,
        {
          id: option.id,
          name: option.name,
          category: filterName,
          categoryId: filterIndex,
        },
      ]);
    } else {
      // Remove from selected filters
      setSelectedFilters((prev) =>
        prev.filter(
          (filter) =>
            !(filter.id === option.id && filter.categoryId === filterIndex)
        )
      );
    }
  };

  const removeFilter = (filterId: number, categoryId: number) => {
    setSelectedFilters((prev) =>
      prev.filter(
        (filter) =>
          !(filter.id === filterId && filter.categoryId === categoryId)
      )
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  // Check if a filter is selected
  const isFilterSelected = (optionId: number, filterIndex: number) => {
    return selectedFilters.some(
      (filter) => filter.id === optionId && filter.categoryId === filterIndex
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="py-2.5">
        <h4 className="mb-4 md:mb-6 text-base md:text-xl leading-6 md:leading-[30px] font-medium text-muted-800">
          Filters
        </h4>

        {/* Selected Filters for Mobile */}
        {isMobile && selectedFilters.length > 0 && (
          <div className="mb-2.5">
            {/* <div className="flex justify-between items-center mb-2">
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary"
              >
                Clear All
              </button>
            </div> */}
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter) => (
                <div
                  key={`${filter.categoryId}-${filter.id}`}
                  className="flex items-center gap-1.5 text-[10px] leading-[13px] text-muted-600 px-2 py-[3.5px] rounded-sm bg-muted-100"
                >
                  {filter.name}
                  <X
                    size={10}
                    className="cursor-pointer text-destructive"
                    onClick={() => removeFilter(filter.id, filter.categoryId)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button className="text-sm leading-5 text-muted-400 underline">Clear all</button>
            </div>
          </div>
        )}

        <MinMaxFilter />

        <div className="mt-4 md:mt-6 border-t border-border md:border-none">
          {filterOptions?.map((filter, i) => (
            <div
              className="py-3 md:py-0 border-b border-border md:border-none  md:mb-6"
              key={i}
            >
              {/* Filter Title - Clickable on Mobile */}
              <div
                className={cn(
                  "flex justify-between items-center  md:mb-2.5",
                  isMobile && `${expandedFilters[i] && "mb-2.5"} cursor-pointer`
                )}
                onClick={() => toggleFilterExpand(i)}
              >
                <h6 className="text-sm leading-5 font-medium text-muted-600 md:text-muted-800">
                  {filter?.name}
                </h6>
                {isMobile &&
                  (expandedFilters[i] ? (
                    <ChevronUp className="text-muted-600" size={16} />
                  ) : (
                    <ChevronDown className="text-muted-600" size={16} />
                  ))}
              </div>

              {/* Filter Options - Collapsible on Mobile */}
              <div
                className={cn(
                  isMobile && !expandedFilters[i] && "hidden",
                  "md:block"
                )}
              >
                {filter?.options
                  ?.slice(0, seeMoreState[i] ? filter?.options?.length : 6)
                  .map((option, optionIndex) => (
                    <div className="mb-1.5" key={optionIndex}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          className="text-muted-600 w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]"
                          id={`${i}-${option?.id?.toString()}`}
                          checked={isFilterSelected(option.id, i)}
                          onCheckedChange={(checked) =>
                            handleFilterSelect(
                              option,
                              i,
                              filter.name,
                              checked === true
                            )
                          }
                        />
                        <label
                          htmlFor={`${i}-${option?.id?.toString()}`}
                          className="text-xs sm:text-sm leading-5 text-muted-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option?.name}
                        </label>
                      </div>
                    </div>
                  ))}
                {filter?.options?.length > 6 && (
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSeeMoreClick(i);
                    }}
                    className="cursor-pointer text-[10px] leading-[13px] text-primary"
                  >
                    {seeMoreState[i] ? "See less" : "See more"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button className="px-[22px] py-4 md:hidden w-full">
          Show{" "}
          {selectedFilters.length > 0
            ? `${selectedFilters.length} Selected Items`
            : "10000+ Result"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CategoryFilter;
