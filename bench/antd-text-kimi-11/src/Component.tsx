import React from 'react';
import { Alert, Button, Card, Checkbox, Space, Typography, theme } from 'antd';
import {
  ClockCircleOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

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
      size="small"
      title="Preview"
      extra={
        <Button
          type="text"
          size="small"
          shape="circle"
          icon={<CloseOutlined />}
          aria-label="Close preview"
        />
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
          <Title level={5} style={{ marginTop: 0 }}>
            Checklist
          </Title>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {CHECKLIST_ITEMS.map((label) => (
              <div
                key={label}
                style={{
                  padding: `${token.paddingXS}px ${token.paddingSM}px`,
                  border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
                  borderRadius: token.borderRadiusLG,
                  background: token.colorBgContainer,
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
      </Space>
    </Card>
  );
};