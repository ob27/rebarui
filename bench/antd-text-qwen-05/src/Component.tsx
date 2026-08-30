import React from 'react';
import { Alert, Button, Card, Checkbox, List, Typography } from 'antd';
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
      extra={<Button type="text" icon={<CloseOutlined />} />}
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
      />

      <Typography.Title level={5} style={{ marginTop: 16 }}>
        Checklist
      </Typography.Title>

      <List
        bordered
        dataSource={checklistItems}
        renderItem={(item) => (
          <List.Item>
            <Checkbox>{item}</Checkbox>
          </List.Item>
        )}
      />

      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={<Text strong>DPK can now move to Post-fab In Progress</Text>}
        description="Some required items in this section are still incomplete."
        style={{ marginTop: 16 }}
      />
    </Card>
  );
};