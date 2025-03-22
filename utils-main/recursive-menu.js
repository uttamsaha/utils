"use client";
import { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";

const CategoryItem = ({ category, level = 0 }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      className="relative bg-white h-full"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <div className="flex items-center cursor-pointer h-full bg-white">
        <p
          className={`mr-4 font-light text-sm pl-${level * 4} ${
            category?.childrens && "text-orange-600"
          }`}
        >
          {category.title}
        </p>
        {category.childrens && (
          <MdArrowForwardIos className="text-orange-600" />
        )}
      </div>
      <div className="bg-white h-full">
        {isActive && category.childrens && (
          <div
            className={`absolute top-0 left-full w-48  bg-white shadow-lg z-10 duration-300`}
          >
            {category.childrens.map((subCategory, index) => (
              <CategoryItem
                key={index}
                category={subCategory}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItem;
