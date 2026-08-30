// src/Component.tsx
import React from 'react';
import { Alert, Button, Checkbox, Typography, Card } from 'antd';
import { CloseOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

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
    <div>
      {/* Title bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Preview</Title>
        <Button type="text" icon={<CloseOutlined />} />
      </div>

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
        style={{ marginBottom: 16 }}
      />

      {/* Checklist */}
      <Card title="Checklist" style={{ marginBottom: 16 }}>
        {checklistItems.map((item, index) => (
          <div
            key={index}
            style={{
              padding: '10px 0',
              borderBottom: index < checklistItems.length - 1 ? '1px solid #f0f0f0' : undefined,
            }}
          >
            <Checkbox>{item}</Checkbox>
          </div>
        ))}
      </Card>

      {/* Warning callout */}
      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={<strong>DPK can now move to Post-fab In Progress</strong>}
        description="Some required items in this section are still incomplete."
      />
    </div>
  );
};