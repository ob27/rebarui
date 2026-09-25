import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Button, Input } from "rebar-ui";

export interface AddCardInlineProps {
  onAdd: (title: string) => void;
  disabled: boolean;
}

export function AddCardInline({ onAdd, disabled }: AddCardInlineProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setOpen(false);
    setValue("");
  };

  const submit = () => {
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    close();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  if (!open) {
    return (
      <Button
        variant="tertiary"
        size="sm"
        disabled={disabled}
        onClick={() => setOpen(true)}
        style={{ width: "100%" }}
      >
        + Add card
      </Button>
    );
  }

  return (
    <Input
      ref={inputRef}
      autoFocus
      size="sm"
      placeholder="Card title"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={close}
    />
  );
}
