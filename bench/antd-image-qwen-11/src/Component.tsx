import React from 'react';
import { Alert, Checkbox, Button, Typography } from 'antd';
import { CloseOutlined, ReloadOutlined, InfoCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

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
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
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
        <Button
          type="text"
          icon={<CloseOutlined style={{ fontSize: 20 }} />}
          size="large"
          style={{ color: '#999' }}
        />
      </div>

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
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      {/* Checklist heading */}
      <Title level={4} style={{ marginBottom: 16 }}>
        Checklist
      </Title>

      {/* Checklist items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {checklistItems.map((item, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: 8,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              backgroundColor: '#fff',
            }}
          >
            <Checkbox />
            <Text style={{ fontSize: 15 }}>{item}</Text>
          </div>
        ))}
      </div>

      {/* Warning callout */}
      <div
        style={{
          marginTop: 12,
          border: '1px solid #ffe58f',
          borderRadius: 8,
          backgroundColor: '#fffbe6',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <ClockCircleOutlined
          style={{ fontSize: 22, color: '#d48806', marginTop: 2, flexShrink: 0 }}
        />
        <div>
          <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 4 }}>
            DPK can now move to Post-fab In Progress
          </Text>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Some required items in this section are still incomplete.
          </Text>
        </div>
      </div>
    </div>
  );
};