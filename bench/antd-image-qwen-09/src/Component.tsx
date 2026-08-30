import React, { useState } from 'react';
import { Alert, Checkbox, Button, Typography } from 'antd';
import {
  CloseOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const checklistItems = [
  'Pre-Fab Checkprint comments resolved',
  'Pre-Fab Attribute Matrix comments resolved',
  'Pre-Fab Data Release form comments resolved',
  'As Built model data supplied by DE',
  'No blocking quality items',
  'All anticipated Post-fab decisions documented',
];

export const PreviewPanel: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleCheck = (item: string, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [item]: checked }));
  };

  const handleReset = () => {
    setCheckedItems({});
  };

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Preview
        </Title>
        <Button type="text" icon={<CloseOutlined />} size="large" />
      </div>

      {/* Info banner */}
      <Alert
        message="Preview — nothing entered here is saved"
        type="info"
        showIcon
        action={
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        }
        style={{ marginBottom: 24 }}
      />

      {/* Checklist heading */}
      <Title level={5} style={{ marginBottom: 16 }}>
        Checklist
      </Title>

      {/* Checklist items */}
      {checklistItems.map((item) => (
        <div
          key={item}
          style={{
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Checkbox
            checked={checkedItems[item] || false}
            onChange={(e) => handleCheck(item, e.target.checked)}
          >
            {item}
          </Checkbox>
        </div>
      ))}

      {/* Warning callout */}
      <div
        style={{
          border: '1px solid #ffe58f',
          borderRadius: 8,
          padding: '16px 20px',
          backgroundColor: '#fffbe6',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <ClockCircleOutlined
          style={{ fontSize: 22, color: '#d48806', marginTop: 2 }}
        />
        <div>
          <Text
            strong
            style={{ fontSize: 15, display: 'block', marginBottom: 4 }}
          >
            DPK can now move to Post-fab In Progress
          </Text>
          <Text type="secondary">
            Some required items in this section are still incomplete.
          </Text>
        </div>
      </div>
    </div>
  );
};