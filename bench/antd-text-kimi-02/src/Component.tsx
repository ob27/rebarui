import React from 'react';
import { Alert, Button, Card, Checkbox, List, Space, Typography } from 'antd';
import {
  ClockCircleOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const CHECKLIST_ITEMS: string[] = [
  'Pre-Fab Checkprint comments resolved',
  'Pre-Fab Attribute Matrix comments resolved',
  'Pre-Fab Data Release form comments resolved',
  'As Built model data supplied by DE',
  'No blocking quality items',
  'All anticipated Post-fab decisions documented',
];

export const PreviewPanel: React.FC = () => (
  <Card
    title="Preview"
    extra={
      <Button
        type="text"
        shape="circle"
        icon={<CloseOutlined />}
        aria-label="Close preview"
      />
    }
  >
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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

      <div>
        <Title level={5}>Checklist</Title>
        <List
          bordered
          dataSource={CHECKLIST_ITEMS}
          rowKey={(item) => item}
          renderItem={(item) => (
            <List.Item>
              <Checkbox>{item}</Checkbox>
            </List.Item>
          )}
        />
      </div>

      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={<Text strong>DPK can now move to Post-fab In Progress</Text>}
        description="Some required items in this section are still incomplete."
      />
    </Space>
  </Card>
);