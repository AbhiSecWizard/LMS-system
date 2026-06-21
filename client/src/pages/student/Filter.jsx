import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const categoriesList = [
  { id: "nextjs", label: "Next JS" },
  { id: "data science", label: "Data Science" },
  { id: "frontend development", label: "Frontend Development" },
  { id: "fullstack development", label: "Fullstack Development" },
  { id: "mern stack development", label: "MERN Stack Development" },
  { id: "backend development", label: "Backend Development" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "html", label: "HTML" },
];

const Filter = ({ selectedCategories, setSelectedCategories, sortByPrice, setSortByPrice }) => {
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCat) =>
      prevCat.includes(categoryId)
        ? prevCat.filter((id) => id !== categoryId)
        : [...prevCat, categoryId]
    );
  };

  return (
    <div className="w-full md:w-[25%] space-y-4 shrink-0">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-semibold text-lg md:text-xl whitespace-nowrap">
          Filter Options
        </h1>
        <Select value={sortByPrice} onValueChange={setSortByPrice}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select By Price</SelectLabel>
              <SelectItem value="low">Low To High</SelectItem>
              <SelectItem value="high">High To Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4" />

      <div>
        <h2 className="font-semibold mb-3 text-sm text-gray-700">Categories</h2>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {categoriesList.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2 py-1">
              <Checkbox 
                id={cat.id} 
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => handleCategoryChange(cat.id)}
              />
              <Label 
                htmlFor={cat.id} 
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {cat.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;