import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils"; // if you use className merging utility
import React from "react";

export default function BouncyArrowButton({ onClick, className }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 animate-bounce-slow",
        className
      )}
    >
      <ChevronDown className="h-6 w-6" />
    </Button>
  );
}
