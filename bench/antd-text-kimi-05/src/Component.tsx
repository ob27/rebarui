import React from 'react';
import { Alert, Button, Card, Checkbox, Flex, Typography, theme } from 'antd';
import {
  ClockCircleOutlined,
  CloseOutlined,
  InfoCircleOutlined,
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
    <Card>
      <Flex vertical gap="middle">
        {/* Title bar */}
        <Flex align="center" justify="space-between">
          <Title level={4} style={{ margin: 0 }}>
            Preview
          </Title>
          <Button type="text" icon={<CloseOutlined />} aria-label="Close" />
        </Flex>

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
        />

        {/* Checklist */}
        <div>
          <Title level={5} style={{ marginTop: 0 }}>
            Checklist
          </Title>
          <Flex vertical gap="small">
            {CHECKLIST_ITEMS.map((label) => (
              <div
                key={label}
                style={{
                  padding: `${token.paddingXS}px ${token.paddingSM}px`,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: token.borderRadius,
                }}
              >
                <Checkbox>{label}</Checkbox>
              </div>
            ))}
          </Flex>
        </div>

        {/* Warning callout */}
        <Alert
          type="warning"
          showIcon
          icon={<ClockCircleOutlined />}
          message={
            <Text strong>DPK can now move to Post-fab In Progress</Text>
          }
          description="Some required items in this section are still incomplete."
        />
      </Flex>
    </Card>
  );
};

export default PreviewPanel;