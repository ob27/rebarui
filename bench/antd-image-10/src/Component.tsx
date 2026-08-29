import { Alert, Button, Checkbox, Flex, Typography } from "antd";
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
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
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
        action={
          <Button icon={<ReloadOutlined />} size="small">
            Reset
          </Button>
        }
        style={{ marginBottom: 24, alignItems: "center" }}
      />

      <Title level={5} style={{ marginBottom: 16 }}>
        Checklist
      </Title>

      <Flex vertical gap={12} style={{ marginBottom: 16 }}>
        {CHECKLIST_ITEMS.map((item) => (
          <div
            key={item}
            style={{
              border: "1px solid rgba(5, 5, 5, 0.06)",
              borderRadius: 8,
              padding: "12px 16px",
            }}
          >
            <Checkbox>{item}</Checkbox>
          </div>
        ))}
      </Flex>

      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={
          <Text strong>DPK can now move to Post-fab In Progress</Text>
        }
        description={
          <Text type="secondary">
            Some required items in this section are still incomplete.
          </Text>
        }
      />
    </div>
  );
}
