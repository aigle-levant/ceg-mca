import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ClassMode } from "@/types/schedule";

interface ClassModeToggleProps {
  mode: ClassMode;
  onModeChange: (mode: ClassMode) => void;
}

export function ClassModeToggle({
  mode,
  onModeChange,
}: ClassModeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => {
        if (value) {
          onModeChange(value as ClassMode);
        }
      }}
      className="rounded-full border bg-muted/50 p-1"
    >
      <ToggleGroupItem
        value="regular"
        className="rounded-full px-5 data-[state=on]:bg-background data-[state=on]:shadow-sm"
      >
        Regular
      </ToggleGroupItem>

      <ToggleGroupItem
        value="ss"
        className="rounded-full px-5 data-[state=on]:bg-background data-[state=on]:shadow-sm"
      >
        SS
      </ToggleGroupItem>
    </ToggleGroup>
  );
}