import { UseFormRegister, FieldValues, Path } from "react-hook-form";

export function RadioCard<TFieldValues extends FieldValues = FieldValues>({
  name,
  value,
  register,
  labelTop,
  labelBottom,
}: {
  name: Path<TFieldValues>;
  value: number;
  register: UseFormRegister<TFieldValues>;
  labelTop: string;      // the big number or label
  labelBottom?: string;  // Low/Med/High helper
}) {
  return (
    <label className="group relative flex-1 cursor-pointer rounded-2xl border border-border p-3 text-center transition
                      hover:bg-muted focus-within:ring-2 focus-within:ring-primary/40">
      <input
        type="radio"
        value={value}
        {...register(name)}
        className="peer sr-only"
      />
      <span className="block text-base font-semibold transition
                       peer-checked:text-primary group-hover:text-primary">
        {labelTop}
      </span>
      {labelBottom && (
        <span className="mt-1 block text-[11px] text-muted-fg">{labelBottom}</span>
      )}
      {/* Selected outline background */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl transition
                        peer-checked:shadow-soft peer-checked:ring-1 peer-checked:ring-primary/40 peer-checked:bg-primary/5" />
    </label>
  );
}