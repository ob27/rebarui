import React from "react";
import { Alert, Button, Checkbox, Typography } from "antd";
import {
  CloseOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

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
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
        style={{ marginBottom: 24 }}
        message={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Preview — nothing entered here is saved.</span>
            <Button
              type="link"
              size="small"
              icon={<ReloadOutlined />}
              style={{ padding: 0 }}
            >
              Reset
            </Button>
          </div>
        }
      />

      {/* Checklist heading */}
      <Title level={5} style={{ marginBottom: 12 }}>
        Checklist
      </Title>

      {/* Checklist rows */}
      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        {checklistItems.map((label, index) => (
          <div
            key={label}
            style={{
              padding: "12px 16px",
              borderBottom:
                index < checklistItems.length - 1
                  ? "1px solid #f0f0f0"
                  : undefined,
            }}
          >
            <Checkbox>{label}</Checkbox>
          </div>
        ))}
      </div>

      {/* Warning callout */}
      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={
          <strong>DPK can now move to Post-fab In Progress</strong>
        }
        description="Some required items in this section are still incomplete."
      />
    </div>
  );
};