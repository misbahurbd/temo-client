"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";

interface SelectFilterProps {
  options: {
    label: string;
    value: string;
  }[];
  label: string;
  queryKey: string;
  placeholder: string;
}

export const SelectFilter = ({
  options,
  label,
  queryKey,
  placeholder,
}: SelectFilterProps) => {
  const params = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = (value: string) => {
    const searchParams = new URLSearchParams(params);
    if (value && value !== "all") {
      searchParams.set(queryKey, value);
    } else {
      searchParams.delete(queryKey);
    }
    replace(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <Select
      defaultValue={params.get(queryKey) || "all"}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-52 truncate rounded-full relative overflow-visible">
        <span className="absolute left-2 top-0 -translate-y-1/2 text-xs text-muted-foreground px-1 bg-white font-semibold">
          {label}
        </span>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
