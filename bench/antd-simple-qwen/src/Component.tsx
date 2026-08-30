import { Button, Card, Checkbox, Form, Input, Typography } from "antd";

const { Title } = Typography;

export const AccountSettings: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: {
    displayName?: string;
    email?: string;
    productUpdates?: boolean;
    securityAlerts?: boolean;
  }) => {
    // Submission handler placeholder.
    // eslint-disable-next-line no-console
    console.log("Account settings saved:", values);
  };

  return (
    <Card>
      <Title level={3} style={{ marginTop: 0 }}>
        Account Settings
      </Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          productUpdates: false,
          securityAlerts: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Display name"
          name="displayName"
        >
          <Input placeholder="e.g. Jane Doe" />
        </Form.Item>

        <Form.Item
          label="Email address"
          name="email"
        >
          <Input placeholder="you@example.com" />
        </Form.Item>

        <Form.Item name="productUpdates" valuePropName="checked">
          <Checkbox>Email me about product updates</Checkbox>
        </Form.Item>

        <Form.Item name="securityAlerts" valuePropName="checked">
          <Checkbox>Email me about security alerts</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AccountSettings;