import { Alert, Button, Checkbox, Flex, Typography } from "antd";
import {
  ClockCircleOutlined,
  CloseOutlined,
  ReloadOutlined,
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
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Preview
        </Title>
        <Button type="text" icon={<CloseOutlined />} aria-label="Close" />
      </Flex>

      <Alert
        type="info"
        showIcon
        message="Preview — nothing entered here is saved."
        style={{ marginBottom: 24 }}
        action={
          <Button icon={<ReloadOutlined />} size="small">
            Reset
          </Button>
        }
      />

      <Title level={5} style={{ marginBottom: 16 }}>
        Checklist
      </Title>

      <Flex vertical gap={12} style={{ marginBottom: 24 }}>
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
      </Flex>

      <Alert
        type="warning"
        style={{ padding: 16 }}
        icon={<ClockCircleOutlined style={{ fontSize: 20 }} />}
        showIcon
        message={
          <Text strong style={{ fontSize: 16 }}>
            DPK can now move to Post-fab In Progress
          </Text>
        }
        description="Some required items in this section are still incomplete."
      />
    </div>
  );
}
