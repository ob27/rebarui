import { Alert, Button, Card, Checkbox, Space, Typography, theme } from 'antd';
import {
  ClockCircleOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
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

export const PreviewPanel = () => {
  const { token } = theme.useToken();

  return (
    <Card
      title="Preview"
      extra={<Button type="text" icon={<CloseOutlined />} aria-label="Close" />}
      style={{ maxWidth: 640, width: '100%' }}
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

        <div>
          <Title level={5} style={{ marginTop: 0 }}>
            Checklist
          </Title>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {checklistItems.map((item) => (
              <div
                key={item}
                style={{
                  padding: `${token.paddingXS}px ${token.paddingSM}px`,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: token.borderRadius,
                }}
              >
                <Checkbox>{item}</Checkbox>
              </div>
            ))}
          </Space>
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
};