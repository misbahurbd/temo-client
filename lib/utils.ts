import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const generatePageSerial = (
  currentPage: number,
  totalPage: number,
  numberOfButton: number
): {
  pageSerial: number[];
  startEllipsis: boolean;
  endEllipsis: boolean;
} => {
  if (totalPage <= numberOfButton) {
    return {
      pageSerial: Array.from({ length: totalPage }, (_, i) => i + 1),
      startEllipsis: false,
      endEllipsis: false,
    };
  }

  const halfButtons = Math.floor(numberOfButton / 2);
  let startPage: number;
  let endPage: number;

  if (currentPage <= halfButtons + 1) {
    startPage = 1;
    endPage = numberOfButton;
  } else if (currentPage >= totalPage - halfButtons) {
    startPage = totalPage - numberOfButton + 1;
    endPage = totalPage;
  } else {
    startPage = currentPage - halfButtons;
    endPage = currentPage + halfButtons;
  }

  const pageSerial = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const startEllipsis = startPage > 1;
  const endEllipsis = endPage < totalPage;

  return {
    pageSerial,
    startEllipsis,
    endEllipsis,
  };
};
