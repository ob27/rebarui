import React, { useState } from 'react';
import { Alert, Button, Card, Checkbox, Typography } from 'antd';
import {
  CloseOutlined,
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
      title="Preview"
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          aria-label="Close"
        />
      }
    >
      <Alert
        type="info"
        showIcon
        message="Preview — nothing entered here is saved."
        action={
          <Button size="small" icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        }
        style={{ marginBottom: 16 }}
      />

      <Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
        Checklist
      </Title>

      <div
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          marginBottom: 16,
          overflow: 'hidden',
        }}
      >
        {CHECKLIST_ITEMS.map((label, idx) => (
          <div
            key={label}
            style={{
              padding: '12px 16px',
              borderBottom:
                idx < CHECKLIST_ITEMS.length - 1
                  ? '1px solid #f0f0f0'
                  : undefined,
            }}
          >
            <Checkbox
              checked={!!checked[idx]}
              onChange={(e) => handleToggle(idx, e.target.checked)}
            >
              {label}
            </Checkbox>
          </div>
        ))}
      </div>

      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={
          <Text strong>DPK can now move to Post-fab In Progress</Text>
        }
        description="Some required items in this section are still incomplete."
      />
    </Card>
  );
};