import React from 'react';
import { Card, Form, Input, Checkbox, Button, Typography, Alert } from 'antd';

const { TextArea } = Input;

const { Title } = Typography;

export const AccountSettings = () => {
  const [form] = Form.useForm();

  return (
    <Card style={{ maxWidth: 480 }}>
      <Title level={3}>Account Settings</Title>
      <Alert
        type="info"
        showIcon
        message="Before you begin"
        description="Manage how we contact you and what updates you receive."
        style={{ marginBottom: 24 }}
      />
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          displayName: '',
          email: '',
          phoneNumber: '',
          companyName: '',
          productUpdates: false,
          securityAlerts: false,
          newFeatures: false,
          billingAlerts: false,
          weeklyDigest: false,
        }}
        onFinish={(values) => {
          console.log('Account settings saved', values);
        }}
      >
        <Form.Item label="Phone number" name="phoneNumber">
          <Input placeholder="e.g. (555) 123-4567" />
        </Form.Item>

        <Form.Item label="Display name" name="displayName">
          <Input placeholder="e.g. Jane Doe" />
        </Form.Item>

        <Form.Item label="Billing email address" name="email">
          <Input placeholder="billing@yourcompany.com" />
        </Form.Item>

        <Form.Item label="Company name" name="companyName">
          <Input placeholder="e.g. Acme Corp" />
        </Form.Item>

        <Alert
          type="info"
          showIcon
          message="Notification preferences"
          description="Changes to the checkboxes below take effect immediately after saving and apply to future emails only."
          style={{ marginBottom: 24 }}
        />

        <Form.Item name="productUpdates" valuePropName="checked">
          <Checkbox>Email me about product updates</Checkbox>
        </Form.Item>

        <Form.Item name="securityAlerts" valuePropName="checked">
          <Checkbox>Email me about security alerts and login attempts</Checkbox>
        </Form.Item>

        <Form.Item name="newFeatures" valuePropName="checked">
          <Checkbox>Email me about new features</Checkbox>
        </Form.Item>

        <Form.Item name="billingAlerts" valuePropName="checked">
          <Checkbox>Email me about billing and invoice updates</Checkbox>
        </Form.Item>

        <Form.Item name="weeklyDigest" valuePropName="checked">
          <Checkbox>Send me a weekly summary of my account activity</Checkbox>
        </Form.Item>

        <Alert
          type="info"
          showIcon
          message="Note"
          description="Security alerts cannot be fully disabled and may still be sent for critical account activity."
          style={{ marginBottom: 24 }}
        />

        <Form.Item label="Any billing disputes we should know about?" name="additionalNotes">
          <TextArea />
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
