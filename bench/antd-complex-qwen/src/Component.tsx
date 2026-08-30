import React from 'react';
import { Tabs, Table, Form, Input, Select, Modal, Button, Typography } from 'antd';
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
  { key: '2', team: 'Design', openPositions: 2, lead: 'Marcus Webb' },
  { key: '3', team: 'Sales', openPositions: 6, lead: 'Elena Torres' },
];

const teamColumns: ColumnsType<TeamRow> = [
  { title: 'Team', dataIndex: 'team', key: 'team' },
  { title: 'Open positions', dataIndex: 'openPositions', key: 'openPositions' },
  { title: 'Lead', dataIndex: 'lead', key: 'lead' },
  {
    title: '',
    key: 'action',
    render: () => <Button>Select</Button>,
  },
];

export const OnboardingWizard: React.FC = () => {
  return (
    <Tabs
      defaultActiveKey="details"
      items={[
        {
          key: 'team',
          label: 'Team',
          children: <Table columns={teamColumns} dataSource={teamData} />,
        },
        {
          key: 'details',
          label: 'Details',
          children: (
            <Form layout="vertical">
              <Form.Item label="Full name">
                <Input />
              </Form.Item>
              <Form.Item label="Start date">
                <Input />
              </Form.Item>
              <Form.Item label="Role">
                <Select
                  options={[
                    { value: 'individual-contributor', label: 'Individual Contributor' },
                    { value: 'team-lead', label: 'Team Lead' },
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
            <>
              <Title level={3}>Ready to submit</Title>
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
              >
                Are you sure you want to onboard this employee to the selected team?
              </Modal>
            </>
          ),
        },
      ]}
    />
  );
};