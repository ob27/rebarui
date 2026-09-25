import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface AddCardControlProps {
  disabled: boolean;
  onAdd: (title: string) => void;
}

export default function AddCardControl({ disabled, onAdd }: AddCardControlProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");

  function commit() {
    const title = value.trim();
    if (title) {
      onAdd(title);
    }
    setValue("");
    setEditing(false);
  }

  function cancel() {
    setValue("");
    setEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      commit();
    } else if (event.key === "Escape") {
      cancel();
    }
  }

  if (!editing) {
    return (
      <Button
        type="text"
        block
        icon={<PlusOutlined />}
        disabled={disabled}
        onClick={() => setEditing(true)}
        style={{ textAlign: "left" }}
      >
        Add card
      </Button>
    );
  }

  return (
    <Input
      autoFocus
      placeholder="Card title"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={cancel}
    />
  );
}
