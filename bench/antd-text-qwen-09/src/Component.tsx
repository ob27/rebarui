import React from "react";
import { Alert, Button, Card, Checkbox, List, Typography } from "antd";
import {
  CloseOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

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
    <Card
      title="Preview"
      extra={
        <Button type="text" icon={<CloseOutlined />} aria-label="Close" />
      }
    >
      {/* Info banner */}
      <Alert
        type="info"
        showIcon
        message={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Preview — nothing entered here is saved.</span>
            <Button type="link" icon={<ReloadOutlined />}>
              Reset
            </Button>
          </div>
        }
        style={{ marginBottom: 24 }}
      />

      {/* Checklist heading */}
      <Typography.Title level={5}>Checklist</Typography.Title>

      {/* Checklist rows */}
      <List
        bordered
        dataSource={checklistItems}
        renderItem={(item) => (
          <List.Item>
            <Checkbox>
              <Text>{item}</Text>
            </Checkbox>
          </List.Item>
        )}
        style={{ marginBottom: 24 }}
      />

      {/* Warning callout */}
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