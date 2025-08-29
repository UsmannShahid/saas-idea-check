export function CategoryBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-fg">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div 
          className="h-2 rounded-full bg-primary/80 transition-all duration-500 ease-out" 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}
