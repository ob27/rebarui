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
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Preview
        </Title>
        <Button
          type="text"
          icon={<CloseOutlined />}
          aria-label="Close"
          style={{ color: "rgba(0, 0, 0, 0.45)" }}
        />
      </Flex>

      <Alert
        type="info"
        showIcon
        message={
          <Flex align="center" justify="space-between">
            <Text>Preview — nothing entered here is saved.</Text>
            <Button icon={<ReloadOutlined />}>Reset</Button>
          </Flex>
        }
        style={{ marginBottom: 24 }}
      />

      <Title level={5} style={{ marginBottom: 12 }}>
        Checklist
      </Title>

      <Flex vertical gap={12} style={{ marginBottom: 16 }}>
        {CHECKLIST_ITEMS.map((item) => (
          <div
            key={item}
            style={{
              border: "1px solid #f0f0f0",
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
        style={{ padding: 16 }}
        message={
          <Flex gap={12} align="flex-start">
            <ClockCircleOutlined
              style={{ fontSize: 20, color: "#faad14", marginTop: 2 }}
            />
            <Flex vertical gap={4}>
              <Text strong style={{ fontSize: 16 }}>
                DPK can now move to Post-fab In Progress
              </Text>
              <Text type="secondary">
                Some required items in this section are still incomplete.
              </Text>
            </Flex>
          </Flex>
        }
      />
    </div>
  );
}
