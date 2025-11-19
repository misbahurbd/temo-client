"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "../ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { generatePageSerial } from "@/lib/utils";

export const TablePagination = ({
  page,
  totalPage,
}: {
  page: number;
  totalPage: number;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { pageSerial, startEllipsis, endEllipsis } = generatePageSerial(
    page,
    totalPage,
    5
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 0 && page !== 1 && page <= totalPage) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Pagination className="flex justify-end">
      <PaginationContent>
        <PaginationItem>
          <Button
            size="icon-sm"
            variant={page === 1 ? "ghost" : "outline"}
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            <ChevronLeftIcon />
          </Button>
        </PaginationItem>

        {startEllipsis && (
          <PaginationItem>
            <PaginationEllipsis className="text-sm text-muted-foreground" />
          </PaginationItem>
        )}

        {pageSerial.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <Button
              size="icon-sm"
              variant={page === pageNumber ? "ghost" : "outline"}
              disabled={page === pageNumber}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          </PaginationItem>
        ))}

        {endEllipsis && (
          <PaginationItem>
            <PaginationEllipsis className="text-sm text-muted-foreground" />
          </PaginationItem>
        )}

        <PaginationItem>
          <Button
            size="icon-sm"
            variant={page === totalPage ? "ghost" : "outline"}
            disabled={page === totalPage}
            onClick={() => handlePageChange(page + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
