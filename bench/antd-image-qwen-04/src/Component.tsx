import React, { useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Card,
  Typography,
  Space,
} from "antd";
import {
  CloseOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const checklistItems = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented",
];

export function PreviewPanel() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const handleReset = () => {
    setChecked({});
  };

  const allChecked = checklistItems.every((item) => checked[item]);

  return (
    <div style={{ padding: 24, maxWidth: 720, fontFamily: "inherit" }}>
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
        type="info"
        icon={<InfoCircleOutlined />}
        message="Preview — nothing entered here is saved"
        action={
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            Reset
          </Button>
        }
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* Checklist heading */}
      <Title level={5} style={{ marginBottom: 16 }}>
        Checklist
      </Title>

      {/* Checklist items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {checklistItems.map((item) => (
          <Card
            key={item}
            size="small"
            style={{
              borderRadius: 8,
              borderColor: "#e8e8e8",
            }}
            bodyStyle={{ padding: "12px 16px" }}
          >
            <Checkbox
              checked={!!checked[item]}
              onChange={(e) =>
                setChecked((prev) => ({
                  ...prev,
                  [item]: e.target.checked,
                }))
              }
            >
              {item}
            </Checkbox>
          </Card>
        ))}
      </div>

      {/* Warning callout */}
      <div style={{ marginTop: 12 }}>
        <Card
          size="small"
          style={{
            borderRadius: 8,
            borderColor: "#ffe58f",
            backgroundColor: "#fffbe6",
          }}
          bodyStyle={{ padding: "16px 20px" }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <ClockCircleOutlined
              style={{
                fontSize: 22,
                color: "#d4a017",
                marginTop: 2,
                flexShrink: 0,
              }}
            />
            <div>
              <Text strong style={{ fontSize: 15, display: "block" }}>
                DPK can now move to Post-fab In Progress
              </Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Some required items in this section are still incomplete.
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}