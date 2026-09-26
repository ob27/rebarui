import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Button, Input } from "rebar-ui";

interface AddCardControlProps {
  disabled: boolean;
  onAdd: (title: string) => void;
}

export function AddCardControl({ disabled, onAdd }: AddCardControlProps) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");

  const cancel = () => {
    setAdding(false);
    setValue("");
  };

  const commit = () => {
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    setValue("");
    setAdding(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  };

  if (!adding) {
    return (
      <Button
        variant="tertiary"
        size="sm"
        disabled={disabled}
        onClick={() => setAdding(true)}
        style={{ width: "100%" }}
      >
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
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={cancel}
      style={{ width: "100%" }}
    />
  );
}
