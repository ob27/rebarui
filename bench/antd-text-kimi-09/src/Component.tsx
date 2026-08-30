import React from "react";
import { Alert, Button, Card, Checkbox, Space, Typography, theme } from "antd";
import {
  ClockCircleFilled,
  CloseOutlined,
  InfoCircleFilled,
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
  const { token } = theme.useToken();

  return (
    <Card
      title="Preview"
      extra={
        <Button
          type="text"
          shape="circle"
          icon={<CloseOutlined />}
          aria-label="Close preview"
        />
      }
      style={{ maxWidth: 720 }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleFilled />}
          message="Preview — nothing entered here is saved."
          action={
            <Button size="small" icon={<ReloadOutlined />}>
              Reset
            </Button>
          }
        />

        <div>
          <Title level={5} style={{ marginTop: 0, marginBottom: token.marginSM }}>
            Checklist
          </Title>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            {CHECKLIST_ITEMS.map((label) => (
              <div
                key={label}
                style={{
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: token.borderRadius,
                  padding: `${token.paddingSM}px ${token.padding}px`,
                }}
              >
                <Checkbox>{label}</Checkbox>
              </div>
            ))}
          </Space>
        </div>

        <Alert
          type="warning"
          showIcon
          icon={<ClockCircleFilled />}
          message={<Text strong>DPK can now move to Post-fab In Progress</Text>}
          description="Some required items in this section are still incomplete."
        />
      </Space>
    </Card>
  );
};