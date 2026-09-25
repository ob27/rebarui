import { useState } from "react";
import { Button, Input } from "rebar-ui";

interface AddCardFormProps {
  disabled: boolean;
  onAdd: (title: string) => void;
}

export default function AddCardForm({ disabled, onAdd }: AddCardFormProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  if (!open) {
    return (
      <Button
        variant="tertiary"
        size="sm"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        + Add card
      </Button>
    );
  }

  const submit = () => {
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

  return (
    <Input
      autoFocus
      placeholder="Card title"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        } else if (e.key === "Escape") {
          e.preventDefault();
          cancel();
        }
      }}
      onBlur={cancel}
    />
  );
}
