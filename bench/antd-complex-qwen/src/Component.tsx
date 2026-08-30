// src/Component.tsx
import {
  Tabs,
  Table,
  Form,
  Input,
  Select,
  Modal,
  Button,
  Typography,
  DatePicker,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface TeamRow {
  key: string;
  team: string;
  openPositions: number;
  lead: string;
}

const teamData: TeamRow[] = [
  { key: 'engineering', team: 'Engineering', openPositions: 4, lead: 'Priya Shah' },
  { key: 'design', team: 'Design', openPositions: 2, lead: 'Marcus Webb' },
  { key: 'sales', team: 'Sales', openPositions: 6, lead: 'Elena Torres' },
];

export const OnboardingWizard = () => {
  const columns: ColumnsType<TeamRow> = [
    { title: 'Team', dataIndex: 'team', key: 'team' },
    { title: 'Open positions', dataIndex: 'openPositions', key: 'openPositions' },
    { title: 'Lead', dataIndex: 'lead', key: 'lead' },
    {
      key: 'action',
      render: () => <Button>Select</Button>,
    },
  ];

  const items = [
    {
      key: 'team',
      label: 'Team',
      children: (
        <Table<TeamRow>
          columns={columns}
          dataSource={teamData}
          pagination={false}
        />
      ),
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
            <DatePicker style={{ width: '100%' }} />
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
      forceRender: true,
      children: (
        <>
          <Title level={3} style={{ marginTop: 0 }}>Ready to submit</Title>
          <Text type="secondary">Review your details above.</Text>
          <Modal
            title="Confirm onboarding"
            open={true}
            footer={[
              <Button key="cancel">Cancel</Button>,
              <Button key="confirm" type="primary">Confirm</Button>,
            ]}
          >
            Are you sure you want to onboard this employee to the selected team?
          </Modal>
        </>
      ),
    },
  ];

  return <Tabs defaultActiveKey="details" items={items} />;
};