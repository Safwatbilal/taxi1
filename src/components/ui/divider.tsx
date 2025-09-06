import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function Divider({ className, label, ...props }: DividerProps) {
  return label ? (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <div className="h-px flex-1 bg-muted" />
      <span>{label}</span>
      <div className="h-px flex-1 bg-muted" />
    </div>
  ) : (
    <div className={cn("w-full h-px bg-muted", className)} {...props} />
  );
}
