import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Box, Button, Input } from "rebar-ui";

export interface AddCardFormProps {
  disabled: boolean;
  onAdd: (title: string) => void;
}

/** The inline "+ Add card" control: a button that reveals a text input (title required, Enter to
 * add, Escape to cancel) — collapses back to the button after a successful add or a cancel. */
export function AddCardForm({ disabled, onAdd }: AddCardFormProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  if (!open) {
    return (
      <Button variant="tertiary" size="sm" disabled={disabled} onClick={() => setOpen(true)}>
        + Add card
      </Button>
    );
  }

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

  return (
    <Box>
      <Input
        autoFocus
        size="sm"
        placeholder="Card title"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="New card title"
      />
    </Box>
  );
}
