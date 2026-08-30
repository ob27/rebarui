import { Alert, Button, Card, Checkbox, Space, Typography, theme } from 'antd';
import {
  ClockCircleOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const CHECKLIST_ITEMS: string[] = [
  'Pre-Fab Checkprint comments resolved',
  'Pre-Fab Attribute Matrix comments resolved',
  'Pre-Fab Data Release form comments resolved',
  'As Built model data supplied by DE',
  'No blocking quality items',
  'All anticipated Post-fab decisions documented',
];

export function PreviewPanel() {
  const { token } = theme.useToken();

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
          message="Preview — nothing entered here is saved."
          action={
            <Button size="small" icon={<ReloadOutlined />}>
              Reset
            </Button>
          }
        />

        <Typography.Title level={5} style={{ margin: 0 }}>
          Checklist
        </Typography.Title>

        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {CHECKLIST_ITEMS.map((label) => (
            <div
              key={label}
              style={{
                padding: `${token.paddingSM}px ${token.padding}px`,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: token.borderRadius,
              }}
            >
              <Checkbox>{label}</Checkbox>
            </div>
          ))}
        </Space>

        <Alert
          type="warning"
          showIcon
          icon={<ClockCircleOutlined />}
          message={
            <Typography.Text strong>
              DPK can now move to Post-fab In Progress
            </Typography.Text>
          }
          description={
            <Typography.Text type="secondary">
              Some required items in this section are still incomplete.
            </Typography.Text>
          }
        />
      </Space>
    </Card>
  );
}