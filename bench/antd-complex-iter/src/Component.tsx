import React, { useState } from 'react';
import { Tabs, Table, Form, Input, Select, Modal, Button, Typography, DatePicker, Alert } from 'antd';
import type { TabsProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface TeamRow {
  key: string;
  team: string;
  openPositions: number;
  lead: string;
}

const teamData: TeamRow[] = [
  { key: '1', team: 'Engineering', openPositions: 4, lead: 'Priya Shah' },
  { key: '2', team: 'Design', openPositions: 2, lead: 'Marcus Webb (Sr. UX Researcher)' },
  { key: '3', team: 'Sales', openPositions: 6, lead: 'Elena Torres' },
  { key: '4', team: 'Support', openPositions: 3, lead: 'Diego Fernandez' },
  { key: '5', team: 'Marketing', openPositions: 1, lead: 'Naomi Clarke' },
  { key: '6', team: 'Finance', openPositions: 2, lead: 'Oliver Bennett' },
];

export const OnboardingWizard: React.FC = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(true);

  const columns: ColumnsType<TeamRow> = [
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team',
    },
    {
      title: 'Open positions',
      dataIndex: 'openPositions',
      key: 'openPositions',
    },
    {
      title: 'Lead',
      dataIndex: 'lead',
      key: 'lead',
    },
    {
      title: '',
      key: 'action',
      render: () => <Button>Select</Button>,
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'team',
      label: 'Team',
      children: (
        <div>
          <Alert
            type="info"
            showIcon
            message="Before you assign a team"
            description="Each team can only be assigned once per onboarding."
            style={{ marginBottom: 16 }}
          />
          <Table columns={columns} dataSource={teamData} pagination={false} />
        </div>
      ),
    },
    {
      key: 'review',
      label: 'Review',
      children: (
        <div>
          <Title level={4}>Ready to submit</Title>
          <Text type="secondary">Review your details above.</Text>
        </div>
      ),
    },
    {
      key: 'details',
      label: 'Details',
      children: (
        <Form layout="vertical" style={{ maxWidth: 480 }}>
          <Alert
            type="info"
            showIcon
            message="Double-check the details below"
            description="This information will be used to set up payroll and system access, so accuracy matters."
            style={{ marginBottom: 16 }}
          />
          <Form.Item label="Full name" name="fullName">
            <Input placeholder="Full name" />
          </Form.Item>
          <Form.Item label="Start date" name="startDate">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Select
              options={[
                { value: 'ic', label: 'Individual Contributor' },
                { value: 'lead', label: 'Team Lead' },
                { value: 'manager', label: 'Manager' },
                { value: 'contractor', label: 'Contractor' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Team" name="team">
            <Select
              options={[
                { value: 'engineering', label: 'Engineering' },
                { value: 'design', label: 'Design' },
                { value: 'sales', label: 'Sales' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Work email" name="workEmail">
            <Input placeholder="name@company.com" />
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="details" items={items} />
      <Modal
        title="Confirm onboarding"
        open={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsConfirmOpen(false)}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" onClick={() => setIsConfirmOpen(false)}>
            Confirm
          </Button>,
        ]}
      >
        <p>Are you sure you want to onboard this employee to the selected team?</p>
      </Modal>
    </div>
  );
};
