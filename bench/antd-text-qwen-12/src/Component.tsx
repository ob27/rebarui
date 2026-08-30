// src/Component.tsx
import React, { useState } from "react";
import { Alert, Button, Checkbox, Typography, Card } from "antd";
import {
  CloseOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const checklistItems: string[] = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented",
];

export const PreviewPanel: React.FC = () => {
  const [checked, setChecked] = useState<boolean[]>(
    checklistItems.map(() => false)
  );

  const handleReset = (): void => {
    setChecked(checklistItems.map(() => false));
  };

  const handleCheckChange =
    (index: number) =>
    (e: { target: { checked: boolean } }): void => {
      setChecked((prev) => {
        const next = [...prev];
        next[index] = e.target.checked;
        return next;
      });
    };

  return (
    <Card
      title="Preview"
      extra={
        <Button type="text" icon={<CloseOutlined />} aria-label="Close" />
      }
    >
      <Alert
        type="info"
        showIcon
        message={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Preview — nothing entered here is saved.</span>
            <Button
              type="link"
              size="small"
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        }
        style={{ marginBottom: 24 }}
      />

      <Title level={5} style={{ marginBottom: 12 }}>
        Checklist
      </Title>

      <div
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: 6,
          marginBottom: 24,
        }}
      >
        {checklistItems.map((item, index) => (
          <div
            key={item}
            style={{
              padding: "10px 12px",
              borderBottom:
                index < checklistItems.length - 1
                  ? "1px solid #f0f0f0"
                  : undefined,
            }}
          >
            <Checkbox
              checked={checked[index]}
              onChange={handleCheckChange(index)}
            >
              {item}
            </Checkbox>
          </div>
        ))}
      </div>

      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={<strong>DPK can now move to Post-fab In Progress</strong>}
        description="Some required items in this section are still incomplete."
      />
    </Card>
  );
};