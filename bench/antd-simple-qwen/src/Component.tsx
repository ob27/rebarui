import React from "react";
import { Form, Input, Checkbox, Button, Typography, Card } from "antd";

const { Title } = Typography;

export const AccountSettings: React.FC = () => {
  return (
    <Card>
      <Title level={2}>Account Settings</Title>
      <Form
        layout="vertical"
        initialValues={{
          productUpdates: false,
          securityAlerts: true,
        }}
      >
        <Form.Item label="Display name" name="displayName">
          <Input placeholder="e.g. Jane Doe" />
        </Form.Item>

        <Form.Item label="Email address" name="email">
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