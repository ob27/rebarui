import React from 'react';
import { Alert, Button, Card, Checkbox, Typography, theme } from 'antd';
import {
  ClockCircleOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const CHECKLIST_ITEMS: string[] = [
  'Pre-Fab Checkprint comments resolved',
  'Pre-Fab Attribute Matrix comments resolved',
  'Pre-Fab Data Release form comments resolved',
  'As Built model data supplied by DE',
  'No blocking quality items',
  'All anticipated Post-fab decisions documented',
];

export const PreviewPanel: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Card
      title="Preview"
      extra={
        <Button type="text" icon={<CloseOutlined />} aria-label="Close preview" />
      }
      style={{ maxWidth: 640 }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: token.margin,
        }}
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
        />

        <div>
          <Typography.Title level={5} style={{ marginBottom: token.marginSM }}>
            Checklist
          </Typography.Title>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: token.marginSM,
            }}
          >
            {CHECKLIST_ITEMS.map((item) => (
              <div
                key={item}
                style={{
                  padding: `${token.paddingSM}px ${token.padding}px`,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: token.borderRadius,
                }}
              >
                <Checkbox>{item}</Checkbox>
              </div>
            ))}
          </div>
        </div>

        <Alert
          type="warning"
          showIcon
          icon={<ClockCircleOutlined />}
          message={
            <Typography.Text strong>
              DPK can now move to Post-fab In Progress
            </Typography.Text>
          }
          description="Some required items in this section are still incomplete."
        />
      </div>
    </Card>
  );
};