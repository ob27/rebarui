import React from 'react';
import { Alert, Button, Card, Checkbox, Flex, Typography, theme } from 'antd';
import {
  ClockCircleOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

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
    <Card style={{ maxWidth: 520 }}>
      <Flex vertical gap="middle">
        {/* Title bar */}
        <Flex justify="space-between" align="center">
          <Title level={4} style={{ margin: 0 }}>
            Preview
          </Title>
          <Button type="text" icon={<CloseOutlined />} aria-label="Close" />
        </Flex>

        {/* Info banner */}
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

        {/* Checklist */}
        <Title level={5} style={{ margin: 0 }}>
          Checklist
        </Title>
        <Flex vertical gap="small">
          {CHECKLIST_ITEMS.map((item) => (
            <div
              key={item}
              style={{
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: token.borderRadius,
                padding: `${token.paddingSM}px ${token.padding}px`,
              }}
            >
              <Checkbox>{item}</Checkbox>
            </div>
          ))}
        </Flex>

        {/* Warning callout */}
        <Alert
          type="warning"
          showIcon
          icon={<ClockCircleOutlined />}
          message={<Text strong>DPK can now move to Post-fab In Progress</Text>}
          description="Some required items in this section are still incomplete."
        />
      </Flex>
    </Card>
  );
};