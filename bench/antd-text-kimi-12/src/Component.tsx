import { Alert, Button, Card, Checkbox, theme, Typography } from 'antd';
import {
  ClockCircleOutlined,
  CloseOutlined,
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
  const { token } = theme.useToken();

  return (
    <Card style={{ maxWidth: 560 }}>
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: token.margin,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Preview
        </Title>
        <Button
          type="text"
          icon={<CloseOutlined />}
          aria-label="Close preview"
        />
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
        style={{ marginBottom: token.marginLG }}
      />

      {/* Checklist */}
      <Title level={5} style={{ marginTop: 0 }}>
        Checklist
      </Title>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: token.marginSM,
          marginBottom: token.marginLG,
        }}
      >
        {CHECKLIST_ITEMS.map((label) => (
          <div
            key={label}
            style={{
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadius,
              padding: `${token.paddingSM}px ${token.padding}px`,
            }}
          >
            <Checkbox>{label}</Checkbox>
          </div>
        ))}
      </div>

      {/* Status callout */}
      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={<Text strong>DPK can now move to Post-fab In Progress</Text>}
        description="Some required items in this section are still incomplete."
      />
    </Card>
  );
}