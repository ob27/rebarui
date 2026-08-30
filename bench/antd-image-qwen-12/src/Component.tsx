import React, { useState } from "react";
import { Alert, Checkbox, Button, Typography, Space } from "antd";
import { CloseOutlined, ReloadOutlined, InfoCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const checklistItems = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented",
];

export const PreviewPanel: React.FC = () => {
  const [checked, setChecked] = useState<boolean[]>(new Array(checklistItems.length).fill(false));

  const handleCheck = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleReset = () => {
    setChecked(new Array(checklistItems.length).fill(false));
  };

  return (
    <div style={{ padding: 24, maxWidth: 720, background: "#fff" }}>
      {/* Title bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Preview
        </Title>
        <Button type="text" icon={<CloseOutlined />} onClick={() => {}} />
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
      <Title level={4} style={{ marginBottom: 16 }}>
        Checklist
      </Title>

      {/* Checklist items */}
      <Space direction="vertical" style={{ width: "100%" }} size={12}>
        {checklistItems.map((label, index) => (
          <div
            key={label}
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 6,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Checkbox checked={checked[index]} onChange={() => handleCheck(index)} />
            <Text>{label}</Text>
          </div>
        ))}
      </Space>

      {/* Warning callout */}
      <div
        style={{
          marginTop: 16,
          border: "1px solid #ffe58f",
          borderRadius: 6,
          padding: "16px 20px",
          background: "#fffbe6",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <ClockCircleOutlined style={{ color: "#d48806", fontSize: 20, marginTop: 2 }} />
        <div>
          <Text strong style={{ fontSize: 15 }}>
            DPK can now move to Post-fab In Progress
          </Text>
          <div>
            <Text type="secondary">Some required items in this section are still incomplete.</Text>
          </div>
        </div>
      </div>
    </div>
  );
};