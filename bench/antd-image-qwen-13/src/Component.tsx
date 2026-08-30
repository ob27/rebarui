import React from 'react';
import { Alert, Checkbox, Button, Typography, Space } from 'antd';
import {
  CloseOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
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

const rowStyle: React.CSSProperties = {
  border: '1px solid #e8e8e8',
  borderRadius: 8,
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  backgroundColor: '#fff',
};

export const PreviewPanel: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 820, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
          Preview
        </Title>
        <Button type="text" icon={<CloseOutlined style={{ fontSize: 18 }} />} />
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
      <Title level={5} style={{ marginBottom: 16, fontWeight: 700 }}>
        Checklist
      </Title>

      {/* Checklist items */}
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        {checklistItems.map((item, index) => (
          <div key={index} style={rowStyle}>
            <Checkbox />
            <Text style={{ fontSize: 15 }}>{item}</Text>
          </div>
        ))}

        {/* Warning callout */}
        <div
          style={{
            border: '1px solid #e8e8e8',
            borderRadius: 8,
            padding: 4,
            backgroundColor: '#fff',
          }}
        >
          <div
            style={{
              border: '1px solid #ffe58f',
              borderRadius: 6,
              padding: '20px 24px',
              backgroundColor: '#fffbe6',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
            }}
          >
            <ClockCircleOutlined
              style={{ fontSize: 22, color: '#d48806', marginTop: 2, flexShrink: 0 }}
            />
            <div>
              <Text strong style={{ display: 'block', fontSize: 16, marginBottom: 4 }}>
                DPK can now move to Post-fab In Progress
              </Text>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Some required items in this section are still incomplete.
              </Text>
            </div>
          </div>
        </div>
      </Space>
    </div>
  );
};