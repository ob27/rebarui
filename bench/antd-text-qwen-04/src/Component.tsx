import React, { useState } from 'react';
import { Alert, Button, Card, Checkbox, Typography } from 'antd';
import {
  CloseOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
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

export const PreviewPanel: React.FC = () => {
  const [checked, setChecked] = useState<boolean[]>(
    () => CHECKLIST_ITEMS.map(() => false),
  );

  const handleToggle = (index: number, value: boolean): void => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleReset = (): void => {
    setChecked(CHECKLIST_ITEMS.map(() => false));
  };

  return (
    <Card>
      {/* ── Title bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Preview
        </Title>
        <Button type="text" icon={<CloseOutlined />} aria-label="Close" />
      </div>

      {/* ── Info banner ── */}
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
        message={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text>Preview — nothing entered here is saved.</Text>
            <Button
              type="link"
              size="small"
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        }
      />

      {/* ── Checklist heading ── */}
      <Title level={5} style={{ marginBottom: 12 }}>
        Checklist
      </Title>

      {/* ── Checklist rows ── */}
      <div
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          marginBottom: 24,
          overflow: 'hidden',
        }}
      >
        {CHECKLIST_ITEMS.map((label, index) => (
          <div
            key={label}
            style={{
              padding: '10px 16px',
              borderBottom:
                index < CHECKLIST_ITEMS.length - 1
                  ? '1px solid #d9d9d9'
                  : undefined,
            }}
          >
            <Checkbox
              checked={checked[index]}
              onChange={(e) => handleToggle(index, e.target.checked)}
            >
              {label}
            </Checkbox>
          </div>
        ))}
      </div>

      {/* ── Warning callout ── */}
      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={
          <Text strong>
            DPK can now move to Post-fab In Progress
          </Text>
        }
        description="Some required items in this section are still incomplete."
      />
    </Card>
  );
};