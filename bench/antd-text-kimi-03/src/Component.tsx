// src/Component.tsx
import type { FC } from 'react';
import { Alert, Button, Card, Checkbox, Typography, theme } from 'antd';
import {
  ClockCircleOutlined,
  CloseOutlined,
  InfoCircleOutlined,
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

export const PreviewPanel: FC = () => {
  const { token } = theme.useToken();

  return (
    <Card
      title="Preview"
      extra={
        <Button type="text" aria-label="Close preview" icon={<CloseOutlined />} />
      }
    >
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

      <Title level={5} style={{ marginTop: token.marginLG }}>
        Checklist
      </Title>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: token.marginXS,
        }}
      >
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
      </div>

      <Alert
        style={{ marginTop: token.marginLG }}
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={<Text strong>DPK can now move to Post-fab In Progress</Text>}
        description="Some required items in this section are still incomplete."
      />
    </Card>
  );
};