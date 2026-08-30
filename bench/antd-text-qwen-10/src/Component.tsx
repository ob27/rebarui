import React from 'react';
import { Alert, Button, Card, Checkbox, Typography } from 'antd';
import { CloseOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

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
    <Card
      title="Preview"
      extra={<Button type="text" icon={<CloseOutlined />} aria-label="Close" />}
    >
      <Alert
        type="info"
        showIcon
        message="Preview — nothing entered here is saved."
        action={
          <Button size="small" icon={<ReloadOutlined />}>
            Reset
          </Button>
        }
        style={{ marginBottom: 24 }}
      />

      <Text strong style={{ display: 'block', fontSize: 16, marginBottom: 12 }}>
        Checklist
      </Text>

      <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, marginBottom: 24 }}>
        {checklistItems.map((item, index) => (
          <div
            key={item}
            style={{
              padding: '12px 16px',
              borderBottom:
                index < checklistItems.length - 1 ? '1px solid #f0f0f0' : undefined,
            }}
          >
            <Checkbox>{item}</Checkbox>
          </div>
        ))}
      </div>

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