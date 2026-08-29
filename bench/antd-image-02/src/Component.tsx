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
    <Flex vertical gap={16} style={{ padding: 24 }}>
      <Flex align="center" justify="space-between">
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
      />

      <Flex vertical gap={8}>
        <Title level={5} style={{ margin: 0 }}>
          Checklist
        </Title>

        {CHECKLIST_ITEMS.map((label) => (
          <div
            key={label}
            style={{
              border: "1px solid var(--ant-color-border-secondary, #f0f0f0)",
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
        showIcon
        icon={<ClockCircleOutlined />}
        message={<Text strong>DPK can now move to Post-fab In Progress</Text>}
        description="Some required items in this section are still incomplete."
      />
    </Flex>
  );
}
