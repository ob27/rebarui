import { Alert, Checkbox, Button, Typography, Card } from 'antd';
import { CloseOutlined, InfoCircleOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export function PreviewPanel() {
  return (
    <div style={{ padding: 24 }}>
      {/* Title bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Preview</Title>
        <Button type="text" icon={<CloseOutlined />} />
      </div>

      {/* Info banner */}
      <Alert
        message="Preview — nothing entered here is saved."
        type="info"
        icon={<InfoCircleOutlined />}
        action={
          <Button size="small" icon={<ReloadOutlined />}>
            Reset
          </Button>
        }
        style={{ marginBottom: 24 }}
      />

      {/* Checklist */}
      <Card title="Checklist" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
            <Checkbox>Pre-Fab Checkprint comments resolved</Checkbox>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
            <Checkbox>Pre-Fab Attribute Matrix comments resolved</Checkbox>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
            <Checkbox>Pre-Fab Data Release form comments resolved</Checkbox>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
            <Checkbox>As Built model data supplied by DE</Checkbox>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
            <Checkbox>No blocking quality items</Checkbox>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
            <Checkbox>All anticipated Post-fab decisions documented</Checkbox>
          </div>
        </div>
      </Card>

      {/* Warning callout */}
      <Alert
        message={<Text strong>DPK can now move to Post-fab In Progress</Text>}
        description="Some required items in this section are still incomplete."
        type="warning"
        icon={<ClockCircleOutlined />}
        showIcon
      />
    </div>
  );
}
