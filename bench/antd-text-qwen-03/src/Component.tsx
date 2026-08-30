// src/Component.tsx
import React from 'react';
import { Alert, Checkbox, Button, Typography, Card } from 'antd';
import {
  CloseOutlined,
  InfoCircleOutlined,
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
  return (
    <Card>
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
        <Button type="text" icon={<CloseOutlined />} aria-label="Close" />
      </div>

      {/* Info banner */}
      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 24 }}
        message={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Preview — nothing entered here is saved.</span>
            <Button
              type="link"
              size="small"
              icon={<ReloadOutlined />}
            >
              Reset
            </Button>
          </div>
        }
      />

      {/* Checklist heading */}
      <Title level={5}>Checklist</Title>

      {/* Checklist rows */}
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
        {checklistItems.map((item, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #d9d9d9',
              padding: '12px 16px',
              marginTop: index > 0 ? -1 : 0,
              borderRadius:
                index === 0
                  ? '8px 8px 0 0'
                  : index === checklistItems.length - 1
                  ? '0 0 8px 8px'
                  : 0,
            }}
          >
            <Checkbox>{item}</Checkbox>
          </div>
        ))}
      </div>

      {/* Warning callout */}
      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={<Text strong>DPK can now move to Post-fab In Progress</Text>}
        description="Some required items in this section are still incomplete."
      />
    </Card>
  );
};