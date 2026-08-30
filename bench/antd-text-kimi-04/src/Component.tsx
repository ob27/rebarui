import React from "react";
import { Alert, Button, Card, Checkbox, Space, Typography } from "antd";
import {
  ClockCircleFilled,
  CloseOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const CHECKLIST_ITEMS: string[] = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented",
];

export const PreviewPanel: React.FC = () => {
  return (
    <Card
      title="Preview"
      extra={<Button type="text" aria-label="Close preview" icon={<CloseOutlined />} />}
    >
      <Alert
        type="info"
        showIcon
        message="Preview — nothing entered here is saved."
        action={
          <Button size="small" icon={<ReloadOutlined />}>
            Reset
          </Button>
        }
        style={{ marginBottom: 24 }}
      />

      <Title level={5}>Checklist</Title>

      <Space
        direction="vertical"
        size={8}
        style={{ width: "100%", marginBottom: 24 }}
      >
        {CHECKLIST_ITEMS.map((label) => (
          <div
            key={label}
            style={{
              padding: "8px 12px",
              border: "1px solid #d9d9d9",
              borderRadius: 6,
            }}
          >
            <Checkbox>{label}</Checkbox>
          </div>
        ))}
      </Space>

      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleFilled />}
        message={<Text strong>DPK can now move to Post-fab In Progress</Text>}
        description="Some required items in this section are still incomplete."
      />
    </Card>
  );
};