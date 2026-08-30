import React from 'react';
import { Alert, Checkbox, Button, Typography, Space } from 'antd';
import { CloseOutlined, InfoCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const PreviewPanel: React.FC = () => {
  const checklistItems = [
    'Pre-Fab Checkprint comments resolved',
    'Pre-Fab Attribute Matrix comments resolved',
    'Pre-Fab Data Release form comments resolved',
    'As Built model data supplied by DE',
    'No blocking quality items',
    'All anticipated Post-fab decisions documented',
  ];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Preview</Title>
        <Button type="text" icon={<CloseOutlined />} />
      </div>

      <Alert
        message={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Preview — nothing entered here is saved.</span>
            <Button type="link" icon={<SyncOutlined />} size="small">Reset</Button>
          </div>
        }
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 24 }}
      />

      <Title level={5} style={{ marginBottom: 16 }}>Checklist</Title>

      <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }} size={0}>
        {checklistItems.map((item, index) => (
          <div
            key={index}
            style={{
              padding: '12px 16px',
              border: '1px solid #f0f0f0',
              borderBottom: index < checklistItems.length - 1 ? 'none' : '1px solid #f0f0f0',
            }}
          >
            <Checkbox>{item}</Checkbox>
          </div>
        ))}
      </Space>

      <Alert
        message={<Text strong>DPK can now move to Post-fab In Progress</Text>}
        description="Some required items in this section are still incomplete."
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
      />
    </div>
  );
};