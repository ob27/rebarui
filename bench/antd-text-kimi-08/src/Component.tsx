import { Alert, Button, Card, Checkbox, List, Space, Typography } from 'antd';
import {
  ClockCircleOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

const CHECKLIST_ITEMS: string[] = [
  'Pre-Fab Checkprint comments resolved',
  'Pre-Fab Attribute Matrix comments resolved',
  'Pre-Fab Data Release form comments resolved',
  'As Built model data supplied by DE',
  'No blocking quality items',
  'All anticipated Post-fab decisions documented',
];

export function PreviewPanel() {
  return (
    <Card
      title="Preview"
      extra={
        <Button type="text" icon={<CloseOutlined />} aria-label="Close preview" />
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
        />

        <Title level={5} style={{ marginBottom: 0 }}>
          Checklist
        </Title>

        <List
          size="small"
          bordered
          dataSource={CHECKLIST_ITEMS}
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
        />
      </Space>
    </Card>
  );
}