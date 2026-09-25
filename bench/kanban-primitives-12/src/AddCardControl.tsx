import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Button, Input } from "rebar-ui";

interface AddCardControlProps {
  disabled: boolean;
  onAdd: (title: string) => void;
}

export function AddCardControl({ disabled, onAdd }: AddCardControlProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const commit = () => {
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    setValue("");
    setOpen(false);
  };

  const cancel = () => {
    setValue("");
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  if (!open) {
    return (
      <Button variant="tertiary" size="sm" disabled={disabled} onClick={() => setOpen(true)}>
        + Add card
      </Button>
    );
  }

  return (
    <Input
      autoFocus
      size="sm"
      placeholder="Card title"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={cancel}
      aria-label="New card title"
    />
  );
}
