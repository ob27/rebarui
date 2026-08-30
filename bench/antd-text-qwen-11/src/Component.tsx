import { Alert, Button, Card, Checkbox, List, Typography } from 'antd';
import { CloseOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const checklistItems = [
  'Pre-Fab Checkprint comments resolved',
  'Pre-Fab Attribute Matrix comments resolved',
  'Pre-Fab Data Release form comments resolved',
  'As Built model data supplied by DE',
  'No blocking quality items',
  'All anticipated Post-fab decisions documented',
];

export const PreviewPanel = () => (
  <Card
    title="Preview"
    extra={<Button type="text" icon={<CloseOutlined />} aria-label="Close" />}
  >
    <Alert
      type="info"
      showIcon
      message="Preview — nothing entered here is saved."
      action={
        <Button type="link" size="small" icon={<ReloadOutlined />}>
          Reset
        </Button>
      }
      style={{ marginBottom: 16 }}
    />

    <Title level={5}>Checklist</Title>

    <List
      bordered
      dataSource={checklistItems}
      renderItem={(item) => (
        <List.Item>
          <Checkbox>{item}</Checkbox>
        </List.Item>
      )}
      style={{ marginBottom: 16 }}
    />

    <Alert
      type="warning"
      showIcon
      icon={<ClockCircleOutlined />}
      message={<Text strong>DPK can now move to Post-fab In Progress</Text>}
      description="Some required items in this section are still incomplete."
    />
  </Card>
);