import React from 'react';
import { Input, Select, Button, Tag, Modal, Form, Typography, Space, List } from 'antd';

const { Title, Text } = Typography;

interface Project {
  name: string;
  status: 'Active' | 'Archived';
}

const projects: Project[] = [
  { name: 'Marketing Site Redesign', status: 'Active' },
  { name: 'Q3 Budget Review', status: 'Active' },
  { name: 'Legacy API Migration', status: 'Archived' },
  { name: 'Customer Portal Beta', status: 'Active' },
];

export const ProjectsList: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        Projects
      </Title>

      <Space style={{ marginBottom: 16, width: '100%' }} wrap>
        <Input placeholder="Search projects…" style={{ width: 240 }} />
        <Select
          defaultValue="All"
          style={{ width: 140 }}
          options={[
            { value: 'All', label: 'All' },
            { value: 'Active', label: 'Active' },
            { value: 'Archived', label: 'Archived' },
          ]}
        />
        <Button type="primary">New Project</Button>
      </Space>

      <List
        bordered
        dataSource={projects}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Tag color={item.status === 'Active' ? 'green' : 'default'} key="status">
                {item.status}
              </Tag>,
            ]}
          >
            <Text>{item.name}</Text>
          </List.Item>
        )}
      />

      <Modal
        title="New Project"
        open={true}
        footer={[
          <Button key="cancel">Cancel</Button>,
          <Button key="create" type="primary">
            Create
          </Button>,
        ]}
        closable={false}
        maskClosable={false}
      >
        <Form layout="vertical">
          <Form.Item
            label="Project name"
            validateStatus="error"
            help="Project name is required"
            required
          >
            <Input placeholder="Required" />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea placeholder="Optional" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
