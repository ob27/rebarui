import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, type InputRef } from "antd";
import { useRef, useState } from "react";

interface AddCardFormProps {
  disabled: boolean;
  onAdd: (title: string) => void;
}

export default function AddCardForm({ disabled, onAdd }: AddCardFormProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  function close() {
    setOpen(false);
    setValue("");
  }

  function submit() {
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    // Clear and keep the input open for rapid entry of several cards in a row.
    setValue("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  if (!open) {
    return (
      <Button
        type="dashed"
        block
        icon={<PlusOutlined />}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        Add card
      </Button>
    );
  }

  return (
    <Input
      ref={inputRef}
      autoFocus
      placeholder="Card title"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onPressEnter={submit}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
        }
      }}
      onBlur={close}
    />
  );
}
