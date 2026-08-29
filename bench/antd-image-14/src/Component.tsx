import { Alert, Button, Checkbox, Typography } from "antd";
import {
  CloseOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const checklistItems = [
  "Pre-Fab Checkprint comments resolved",
  "Pre-Fab Attribute Matrix comments resolved",
  "Pre-Fab Data Release form comments resolved",
  "As Built model data supplied by DE",
  "No blocking quality items",
  "All anticipated Post-fab decisions documented",
];

export function PreviewPanel() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
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
        <Button type="text" icon={<CloseOutlined />} />
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
        style={{ alignItems: "center", marginBottom: 24 }}
      />

      <Title level={5} style={{ marginBottom: 12 }}>
        Checklist
      </Title>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
        {checklistItems.map((item) => (
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
      </div>

      <div
        style={{
          border: "1px solid #ffe7ba",
          borderRadius: 8,
          padding: "16px 20px",
          background: "#fffbe6",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <ClockCircleOutlined style={{ color: "#faad14", fontSize: 20, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>
            DPK can now move to Post-fab In Progress
          </div>
          <Text type="secondary">
            Some required items in this section are still incomplete.
          </Text>
        </div>
      </div>
    </div>
  );
}
