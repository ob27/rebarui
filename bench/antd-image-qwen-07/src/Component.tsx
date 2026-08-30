import React from "react";
import { Alert, Checkbox, Button, Typography, Space } from "antd";
import {
  CloseOutlined,
  InfoCircleOutlined,
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

export const PreviewPanel: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
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
          aria-label="Close"
        />
      </div>

      {/* Info banner */}
      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        message="Preview — nothing entered here is saved."
        action={
          <Button size="small" icon={<ReloadOutlined />}>
            Reset
          </Button>
        }
        style={{ marginBottom: 24 }}
      />

      {/* Checklist heading */}
      <Title level={5} style={{ marginBottom: 16 }}>
        Checklist
      </Title>

      {/* Checklist items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {checklistItems.map((item) => (
          <div
            key={item}
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Checkbox />
            <Text>{item}</Text>
          </div>
        ))}
      </div>

      {/* Warning callout */}
      <div
        style={{
          marginTop: 12,
          border: "1px solid #ffe58f",
          borderRadius: 8,
          padding: "20px 24px",
          backgroundColor: "#fffbe6",
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <ClockCircleOutlined
          style={{ fontSize: 24, color: "#d48806", marginTop: 2 }}
        />
        <div>
          <Text strong style={{ fontSize: 16, display: "block" }}>
            DPK can now move to Post-fab In Progress
          </Text>
          <Text type="secondary">
            Some required items in this section are still incomplete.
          </Text>
        </div>
      </div>
    </div>
  );
};