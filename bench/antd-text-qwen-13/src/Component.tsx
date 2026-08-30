import React from 'react';
import { Alert, Button, Checkbox, Typography } from 'antd';
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
    <div style={{ maxWidth: 600 }}>
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Preview
        </Title>
        <Button type="text" icon={<CloseOutlined />} aria-label="Close" />
      </div>

      {/* Info banner */}
      <div style={{ padding: '12px 16px' }}>
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          message={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Preview — nothing entered here is saved.</span>
              <Button
                type="link"
                size="small"
                icon={<ReloadOutlined />}
                style={{ padding: 0, marginLeft: 8 }}
              >
                Reset
              </Button>
            </div>
          }
        />
      </div>

      {/* Checklist */}
      <div style={{ padding: '0 16px 16px' }}>
        <Title level={5} style={{ marginBottom: 12 }}>
          Checklist
        </Title>
        <div style={{ border: '1px solid #d9d9d9', borderRadius: 8 }}>
          {checklistItems.map((item, index) => (
            <div
              key={item}
              style={{
                padding: '10px 16px',
                borderBottom:
                  index < checklistItems.length - 1
                    ? '1px solid #f0f0f0'
                    : undefined,
              }}
            >
              <Checkbox>
                <Text>{item}</Text>
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      {/* Warning callout */}
      <div style={{ padding: '0 16px 16px' }}>
        <Alert
          type="warning"
          showIcon
          icon={<ClockCircleOutlined />}
          message={
            <Text strong>DPK can now move to Post-fab In Progress</Text>
          }
          description="Some required items in this section are still incomplete."
        />
      </div>
    </div>
  );
};

export default PreviewPanel;