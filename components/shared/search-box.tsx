"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDebounceValue } from "@/hooks/use-debounce-value";
import { Button } from "../ui/button";
import { useTeamModel } from "@/features/teams/stores/use-team-model";

export const SearchBox = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const { setIsOpen } = useTeamModel();
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("search", term);
      } else {
        params.delete("search");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, replace]
  );

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (currentSearch !== debouncedSearchTerm) {
      const params = new URLSearchParams(searchParams);
      if (debouncedSearchTerm) {
        params.set("search", debouncedSearchTerm);
      } else {
        params.delete("search");
      }
      replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearchTerm, searchParams, pathname, replace]);

  return (
    <div className="w-full flex items-center gap-4">
      <InputGroup className="w-full max-w-xs rounded-full">
        <InputGroupInput
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchTerm);
            }
          }}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="size-4" />
        </InputGroupAddon>
      </InputGroup>

      <Button
        className="rounded-full cursor-pointer ml-auto"
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon className="size-4" />
        Add Team
      </Button>
    </div>
  );
};
