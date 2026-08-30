import React, { useState } from "react";
import { Alert, Checkbox, Button, Typography, Space } from "antd";
import {
  CloseOutlined,
  InfoCircleFilled,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const checklistItems = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented",
];

export function PreviewPanel() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const allChecked = checklistItems.every((_, i) => checked[i]);

  const handleReset = () => {
    setChecked({});
  };

  const handleChange = (index: number, isChecked: boolean) => {
    setChecked((prev) => ({ ...prev, [index]: isChecked }));
  };

  return (
    <div style={{ maxWidth: 720, padding: 24 }}>
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
        <Button
          type="text"
          icon={<CloseOutlined />}
          size="large"
          style={{ fontSize: 18, color: "#999" }}
        />
      </div>

      {/* Info banner */}
      <Alert
        message={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Space>
              <InfoCircleFilled style={{ color: "#1677ff", fontSize: 16 }} />
              <span>Preview — nothing entered here is saved</span>
            </Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
              style={{ marginLeft: 16 }}
            >
              Reset
            </Button>
          </div>
        }
        type="info"
        showIcon={false}
        style={{ marginBottom: 24 }}
      />

      {/* Checklist heading */}
      <Title level={4} style={{ marginBottom: 16 }}>
        Checklist
      </Title>

      {/* Checklist items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {checklistItems.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              backgroundColor: "#fff",
            }}
          >
            <Checkbox
              checked={!!checked[index]}
              onChange={(e) => handleChange(index, e.target.checked)}
            />
            <Text style={{ fontSize: 15 }}>{item}</Text>
          </div>
        ))}
      </div>

      {/* Warning callout */}
      <div
        style={{
          marginTop: 16,
          border: "1px solid #ffe58f",
          borderRadius: 8,
          padding: "16px 20px",
          backgroundColor: "#fffbe6",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <ClockCircleOutlined
          style={{ color: "#d48806", fontSize: 20, marginTop: 2 }}
        />
        <div>
          <Text strong style={{ fontSize: 15, display: "block" }}>
            DPK can now move to Post-fab In Progress
          </Text>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Some required items in this section are still incomplete.
          </Text>
        </div>
      </div>
    </div>
  );
}