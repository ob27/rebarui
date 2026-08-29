import { Alert, Button, Checkbox, Typography } from "antd";
import {
  CloseOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const CHECKLIST_ITEMS = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented",
];

export function PreviewPanel() {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Preview
        </Title>
        <Button type="text" icon={<CloseOutlined />} aria-label="Close" />
      </div>

      <Alert
        type="info"
        showIcon
        message="Preview — nothing entered here is saved."
        action={
          <Button icon={<ReloadOutlined />} size="small">
            Reset
          </Button>
        }
        style={{ marginBottom: 24, alignItems: "center" }}
      />

      <Title level={5} style={{ marginBottom: 12 }}>
        Checklist
      </Title>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {CHECKLIST_ITEMS.map((label) => (
          <div
            key={label}
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              padding: "12px 16px",
            }}
          >
            <Checkbox>{label}</Checkbox>
          </div>
        ))}
      </div>

      <Alert
        type="warning"
        style={{ padding: 16 }}
        message={
          <Text strong style={{ fontSize: 16 }}>
            DPK can now move to Post-fab In Progress
          </Text>
        }
        description="Some required items in this section are still incomplete."
        icon={<ClockCircleOutlined style={{ fontSize: 20 }} />}
        showIcon
      />
    </div>
  );
}
