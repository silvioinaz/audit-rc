import { Input } from "@/components/ui/input";
import { useCallback } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
};

function formatNumber(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

export default function CurrencyInput({ value, onChange, placeholder, prefix = "$", suffix }: Props) {
  const displayValue = (() => {
    const num = formatNumber(value);
    if (!num) return "";
    const parts: string[] = [];
    if (prefix) parts.push(prefix);
    parts.push(num);
    if (suffix) parts.push(suffix);
    return parts.join("");
  })();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      onChange(raw);
    },
    [onChange]
  );

  return (
    <Input
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      inputMode="numeric"
    />
  );
}
