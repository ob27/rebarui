import React from 'react';
import {
  Input,
  Select,
  Button,
  Tag,
  Modal,
  Form,
  Typography,
  Space,
  List,
  Alert,
} from 'antd';

const { Title } = Typography;
const { TextArea } = Input;

interface Project {
  name: string;
  status: 'Active' | 'Archived' | 'Draft';
}

const projects: Project[] = [
  { name: 'Marketing Site Redesign', status: 'Active' },
  { name: 'Customer Portal Beta', status: 'Active' },
  { name: 'Internal Tools Revamp — Auth Module', status: 'Active' },
  { name: 'Legacy API Migration', status: 'Archived' },
  { name: 'Q3 Budget Review', status: 'Active' },
  { name: 'Vendor Onboarding Flow — Background Check Step', status: 'Draft' },
  { name: 'Mobile App Analytics', status: 'Active' },
  { name: 'Employee Handbook Refresh', status: 'Draft' },
];

export function ProjectsList() {
  return (
    <div style={{ padding: 24 }}>
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
        wrap
      >
        <Space>
          <Input.Search placeholder="Search projects…" style={{ width: 240 }} allowClear />
          <Select
            defaultValue="All"
            style={{ width: 140 }}
            options={[
              { value: 'All', label: 'All' },
              { value: 'Active', label: 'Active' },
              { value: 'Archived', label: 'Archived' },
              { value: 'Draft', label: 'Draft' },
            ]}
          />
        </Space>
        <Button type="primary">New Project</Button>
      </Space>

      <Alert
        type="info"
        showIcon
        message="Heads up"
        description="Archived projects are read-only."
        style={{ marginBottom: 16 }}
      />

      <Alert
        type="info"
        showIcon
        message="Tip"
        description="Use the search box or status filter above to narrow this list — results update instantly as you type."
        style={{ marginBottom: 16 }}
      />

      <List
        bordered
        dataSource={projects}
        renderItem={(project) => (
          <List.Item>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <span>{project.name}</span>
              <Tag color={project.status === 'Active' ? 'green' : 'default'}>
                {project.status}
              </Tag>
            </Space>
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
        <Alert
          type="info"
          showIcon
          message="You can change these details later from the project's settings page."
          style={{ marginBottom: 16 }}
        />
        <Form layout="vertical">
          <Form.Item
            label="Project name"
            validateStatus="error"
            help="Project name is required"
            required
          >
            <Input placeholder="Required" />
          </Form.Item>
          <Form.Item label="Owner">
            <Input placeholder="Optional" />
          </Form.Item>
          <Form.Item label="Description">
            <TextArea placeholder="Optional" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
