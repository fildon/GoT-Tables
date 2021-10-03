import React from "react";
import { paginationBar } from "./paginationBar.module.css";

interface PaginationBarProps {
  currentPageNumber: number;
  setCurrentPageNumber: (newPage: number) => void;
  isLoading: boolean;
  canNextPage: boolean;
  canPreviousPage: boolean;
  totalPages: number;
}

export const PaginationBar = ({
  currentPageNumber,
  setCurrentPageNumber,
  isLoading,
  canNextPage,
  canPreviousPage,
  totalPages,
}: PaginationBarProps) => {
  return (
    <div className={paginationBar}>
      <button
        onClick={() => setCurrentPageNumber(currentPageNumber - 1)}
        disabled={isLoading || !canPreviousPage}
      >
        Previous page
      </button>
      <span>
        Page {currentPageNumber} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPageNumber(currentPageNumber + 1)}
        disabled={isLoading || !canNextPage}
      >
        Next page
      </button>
    </div>
  );
};
