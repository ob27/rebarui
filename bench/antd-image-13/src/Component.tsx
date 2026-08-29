import { Alert, Button, Checkbox, Typography } from "antd";
import {
  CloseOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

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
        />
      </div>

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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {CHECKLIST_ITEMS.map((item) => (
          <div
            key={item}
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              padding: "16px 20px",
            }}
          >
            <Checkbox>{item}</Checkbox>
          </div>
        ))}
      </div>

      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={
          <span style={{ fontWeight: 600 }}>
            DPK can now move to Post-fab In Progress
          </span>
        }
        description="Some required items in this section are still incomplete."
        style={{ borderRadius: 8 }}
      />
    </div>
  );
}
