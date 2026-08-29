import {
  CloseOutlined,
  InfoCircleFilled,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Alert, Button, Checkbox, Typography } from "antd";

const { Title, Text } = Typography;

const checklistItems: string[] = [
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
        <Button
          type="text"
          icon={<CloseOutlined />}
          aria-label="Close"
          style={{ color: "rgba(0, 0, 0, 0.45)" }}
        />
      </div>

      <Alert
        type="info"
        showIcon
        icon={<InfoCircleFilled />}
        message="Preview — nothing entered here is saved."
        action={
          <Button icon={<ReloadOutlined />} size="middle">
            Reset
          </Button>
        }
        style={{
          alignItems: "center",
          marginBottom: 24,
        }}
      />

      <Title level={5} style={{ marginBottom: 12 }}>
        Checklist
      </Title>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        {checklistItems.map((label) => (
          <div
            key={label}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "14px 16px",
            }}
          >
            <Checkbox>{label}</Checkbox>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          background: "#fffbe6",
          border: "1px solid #ffe58f",
          borderRadius: 8,
          padding: "16px 20px",
        }}
      >
        <ClockCircleOutlined style={{ color: "#d48806", fontSize: 20, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, color: "rgba(0, 0, 0, 0.88)" }}>
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
