import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface AddCardFormProps {
  disabled: boolean;
  onAdd: (title: string) => void;
}

/** The "+ Add card" control: collapsed to a button, expands to an inline text
 * input on click. Enter submits (title required), Escape cancels back to the
 * button. Disabled outright once the column is at its cap. */
export function AddCardForm({ disabled, onAdd }: AddCardFormProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");

  const cancel = () => {
    setEditing(false);
    setValue("");
  };

  const submit = () => {
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    setValue("");
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  if (!editing) {
    return (
      <Button
        type="text"
        block
        icon={<PlusOutlined />}
        disabled={disabled}
        onClick={() => setEditing(true)}
        style={{ textAlign: "left", color: disabled ? undefined : "#6b7fd7" }}
      >
        Add card
      </Button>
    );
  }

  return (
    <Input
      autoFocus
      placeholder="Card title…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
}
