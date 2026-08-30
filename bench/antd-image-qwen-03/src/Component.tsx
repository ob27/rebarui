import React, { useState } from 'react';
import { Alert, Checkbox, Button, Typography, Space } from 'antd';
import { CloseOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';

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

  const handleCheckboxChange = (label: string, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [label]: checked }));
  };

  const handleReset = () => {
    setCheckedItems({});
  };

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      {/* Title Bar */}
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
        <Button
          type="text"
          icon={<CloseOutlined />}
          size="large"
          style={{ fontSize: 18 }}
        />
      </div>

      {/* Info Banner */}
      <Alert
        type="info"
        message="Preview — nothing entered here is saved."
        action={
          <Button size="small" icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        }
        showIcon
        style={{ marginBottom: 24, borderRadius: 6 }}
      />

      {/* Checklist Heading */}
      <Title level={5} style={{ marginBottom: 16 }}>
        Checklist
      </Title>

      {/* Checklist Items */}
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        {checklistItems.map((item) => (
          <div
            key={item}
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Checkbox
              checked={checkedItems[item] || false}
              onChange={(e) => handleCheckboxChange(item, e.target.checked)}
            />
            <Text>{item}</Text>
          </div>
        ))}
      </Space>

      {/* Warning Callout */}
      <div
        style={{
          marginTop: 20,
          border: '1px solid #ffe58f',
          borderRadius: 6,
          padding: '20px 24px',
          backgroundColor: '#fffbe6',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        <ClockCircleOutlined
          style={{ fontSize: 24, color: '#d48806', marginTop: 2 }}
        />
        <div>
          <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>
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