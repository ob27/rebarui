import React, { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Flex,
  Space,
  Typography,
} from 'antd';
import {
  CloseOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
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
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const handleToggle = (index: number, value: boolean) => {
    setChecked((prev) => ({ ...prev, [index]: value }));
  };

  const handleReset = () => {
    setChecked({});
  };

  return (
    <Card
      styles={{ body: { padding: 16, display: 'flex', flexDirection: 'column', gap: 16 } }}
    >
      {/* Title bar */}
      <Flex align="center" justify="space-between">
        <Title level={4} style={{ margin: 0 }}>
          Preview
        </Title>
        <Button
          type="text"
          icon={<CloseOutlined />}
          aria-label="Close preview"
        />
      </Flex>

      {/* Info banner */}
      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        message={
          <Flex align="center" justify="space-between" gap={12}>
            <Text>Preview — nothing entered here is saved.</Text>
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Flex>
        }
      />

      {/* Checklist */}
      <div>
        <Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
          Checklist
        </Title>
        <Flex vertical>
          {CHECKLIST_ITEMS.map((label, index) => (
            <div
              key={label}
              style={{
                padding: '10px 12px',
                border: '1px solid #d9d9d9',
                borderTop: index === 0 ? '1px solid #d9d9d9' : 'none',
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
        </Flex>
      </div>

      {/* Warning callout */}
      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={
          <Space direction="vertical" size={0}>
            <Text strong>DPK can now move to Post-fab In Progress</Text>
            <Text type="secondary">
              Some required items in this section are still incomplete.
            </Text>
          </Space>
        }
      />
    </Card>
  );
};

export default PreviewPanel;