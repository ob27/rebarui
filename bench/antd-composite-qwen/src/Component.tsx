import React from 'react';
import { Input, Select, Button, Tag, Modal, Form, Typography, Space } from 'antd';

const { Title } = Typography;

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

const statusColor: Record<string, string> = {
  Active: 'green',
  Archived: 'default',
};

export const ProjectsList: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Projects</Title>

      {/* Filter bar */}
      <Space style={{ marginBottom: 24 }} wrap>
        <Input.Search
          placeholder="Search projects…"
          style={{ width: 240 }}
        />
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

      {/* Project list */}
      <div>
        {projects.map((project) => (
          <div
            key={project.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <span>{project.name}</span>
            <Tag color={statusColor[project.status]}>{project.status}</Tag>
          </div>
        ))}
      </div>

      {/* New Project modal — rendered open */}
      <Modal
        title="New Project"
        open={true}
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
            <Input.TextArea placeholder="Optional" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};