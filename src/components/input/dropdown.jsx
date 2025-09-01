import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "../ui/label";
import { ChevronDown } from "lucide-react";

export default function DropdownInput({
  options,
  label,
  selected,
  setSelected,
}) {
  return (
    <div className="space-y-2 flex flex-col min-w-32">
      <Label>{label}</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between gap-2"
          >
            <span>{selected?.label ?? "Select an option"}</span>
            <ChevronDown className="w-4 h-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-fit" align="start">
          {label && (
            <DropdownMenuLabel className="opacity-70">
              {label}
            </DropdownMenuLabel>
          )}

          {options.map((item) => (
            <DropdownMenuItem
              key={item.value ?? item.label}
              onClick={() => setSelected(item)}
              className={`cursor-pointer ${
                selected?.value === item.value
                  ? "bg-accent text-accent-foreground"
                  : ""
              }`}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
