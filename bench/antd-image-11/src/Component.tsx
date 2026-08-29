import { Alert, Button, Checkbox, Typography } from "antd";
import { CloseOutlined, ReloadOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

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
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Preview
        </Title>
        <Button type="text" icon={<CloseOutlined />} />
      </div>

      <Alert
        type="info"
        showIcon
        message="Preview — nothing entered here is saved."
        action={
          <Button icon={<ReloadOutlined />}>Reset</Button>
        }
        style={{ marginBottom: 24, alignItems: "center" }}
      />

      <Title level={5} style={{ marginBottom: 12 }}>
        Checklist
      </Title>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
        {checklistItems.map((label) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              border: "1px solid #f0f0f0",
              borderRadius: 8,
            }}
          >
            <Checkbox />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <Alert
        type="warning"
        showIcon
        icon={<ClockCircleOutlined />}
        message={<strong>DPK can now move to Post-fab In Progress</strong>}
        description="Some required items in this section are still incomplete."
      />
    </div>
  );
}
