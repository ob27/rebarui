import React from 'react';
import { Button, Form, Input, Modal, Select, Space, Tag, Typography } from 'antd';

type Status = 'Active' | 'Archived';

interface Project {
  name: string;
  status: Status;
}

const projects: Project[] = [
  { name: 'Marketing Site Redesign', status: 'Active' },
  { name: 'Q3 Budget Review', status: 'Active' },
  { name: 'Legacy API Migration', status: 'Archived' },
  { name: 'Customer Portal Beta', status: 'Active' },
];

const statusColor: Record<Status, string> = {
  Active: 'green',
  Archived: 'default',
};

const statusOptions = [
  { value: 'All', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Archived', label: 'Archived' },
];

export const ProjectsList: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 24, width: '100%' }} wrap>
        <Input placeholder="Search projects…" style={{ width: 240 }} allowClear />
        <Select
          defaultValue="All"
          options={statusOptions}
          style={{ width: 140 }}
        />
        <Button type="primary">New Project</Button>
      </Space>

      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {projects.map((project) => (
          <div
            key={project.name}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography.Text>{project.name}</Typography.Text>
            <Tag color={statusColor[project.status]}>{project.status}</Tag>
          </div>
        ))}
      </Space>

      <Modal
        title="New Project"
        open
        footer={[
          <Button key="cancel">Cancel</Button>,
          <Button key="create" type="primary">
            Create
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item
            label="Project name"
            validateStatus="error"
            help="Project name is required"
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