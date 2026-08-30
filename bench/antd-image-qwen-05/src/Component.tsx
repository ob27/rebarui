import React, { useState } from "react";
import { Alert, Checkbox, Button, Typography, Space } from "antd";
import {
  CloseOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const CHECKLIST_ITEMS = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented",
];

export const PreviewPanel: React.FC = () => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const handleCheck = (index: number, isChecked: boolean) => {
    setChecked((prev) => ({ ...prev, [index]: isChecked }));
  };

  const handleReset = () => {
    setChecked({});
  };

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Preview
        </Title>
        <Button type="text" icon={<CloseOutlined />} />
      </div>

      {/* Info banner */}
      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        message="Preview — nothing entered here is saved"
        action={
          <Button size="small" icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        }
        style={{ marginBottom: 24 }}
      />

      {/* Checklist heading */}
      <Title level={5} style={{ marginBottom: 12 }}>
        Checklist
      </Title>

      {/* Checklist items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CHECKLIST_ITEMS.map((label, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 6,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Checkbox
              checked={checked[index] ?? false}
              onChange={(e) => handleCheck(index, e.target.checked)}
            />
            <Text>{label}</Text>
          </div>
        ))}
      </div>

      {/* Warning callout */}
      <div
        style={{
          marginTop: 16,
          border: "1px solid #ffe58f",
          borderRadius: 6,
          padding: "16px 20px",
          backgroundColor: "#fffbe6",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <ClockCircleOutlined
          style={{ fontSize: 20, color: "#d48806", marginTop: 2 }}
        />
        <div>
          <Text strong style={{ display: "block", fontSize: 15 }}>
            DPK can now move to Post-fab In Progress
          </Text>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Some required items in this section are still incomplete.
          </Text>
        </div>
      </div>
    </div>
  );
};