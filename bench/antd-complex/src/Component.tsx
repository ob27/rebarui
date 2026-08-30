import React from 'react';
import { Tabs, Table, Form, Input, Select, Modal, Button, Typography } from 'antd';
import type { TabsProps } from 'antd';

const { Title, Text } = Typography;

interface TeamRow {
  key: string;
  team: string;
  openPositions: number;
  lead: string;
}

const teamData: TeamRow[] = [
  { key: '1', team: 'Engineering', openPositions: 4, lead: 'Priya Shah' },
  { key: '2', team: 'Design', openPositions: 2, lead: 'Marcus Webb' },
  { key: '3', team: 'Sales', openPositions: 6, lead: 'Elena Torres' },
];

export const OnboardingWizard: React.FC = () => {
  const columns = [
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
      render: () => <Button size="small">Select</Button>,
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'team',
      label: 'Team',
      children: <Table columns={columns} dataSource={teamData} pagination={false} />,
    },
    {
      key: 'details',
      label: 'Details',
      children: (
        <Form layout="vertical" style={{ maxWidth: 480 }}>
          <Form.Item label="Full name" name="fullName">
            <Input />
          </Form.Item>
          <Form.Item label="Start date" name="startDate">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Select
              options={[
                { value: 'ic', label: 'Individual Contributor' },
                { value: 'lead', label: 'Team Lead' },
                { value: 'manager', label: 'Manager' },
              ]}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'review',
      label: 'Review',
      children: (
        <div>
          <Title level={4}>Ready to submit</Title>
          <Text type="secondary">Review your details above.</Text>
          <Modal
            title="Confirm onboarding"
            open={true}
            footer={[
              <Button key="cancel">Cancel</Button>,
              <Button key="confirm" type="primary">
                Confirm
              </Button>,
            ]}
            closable={false}
            mask={true}
            getContainer={false}
          >
            <p>Are you sure you want to onboard this employee to the selected team?</p>
          </Modal>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs defaultActiveKey="details" items={items} />
    </div>
  );
};
