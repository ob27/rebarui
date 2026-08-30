import React, { useState } from "react";
import { Alert, Button, Checkbox, Typography } from "antd";
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

  const handleToggle = (index: number, value: boolean) => {
    setChecked((prev) => ({ ...prev, [index]: value }));
  };

  const handleReset = () => {
    setChecked({});
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Preview
        </Title>
        <Button
          type="text"
          icon={<CloseOutlined />}
          aria-label="Close preview"
        />
      </div>

      {/* Info banner */}
      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        message={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <Text>Preview — nothing entered here is saved.</Text>
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        }
      />

      {/* Checklist heading */}
      <Title level={5} style={{ margin: 0 }}>
        Checklist
      </Title>

      {/* Checklist rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid #d9d9d9",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {CHECKLIST_ITEMS.map((label, index) => (
          <div
            key={label}
            style={{
              padding: "12px 16px",
              borderBottom:
                index < CHECKLIST_ITEMS.length - 1
                  ? "1px solid #d9d9d9"
                  : undefined,
            }}
          >
            <Checkbox
              checked={!!checked[index]}
              onChange={(e) => handleToggle(index, e.target.checked)}
            >
              {label}
            </Checkbox>
          </div>
        ))}
      </div>

      {/* Warning callout */}
      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={
          <Text strong>DPK can now move to Post-fab In Progress</Text>
        }
        description={
          <Text type="secondary">
            Some required items in this section are still incomplete.
          </Text>
        }
      />
    </div>
  );
};

export default PreviewPanel;