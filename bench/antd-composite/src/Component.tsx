import React from "react";
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
} from "antd";

const { Text } = Typography;
const { TextArea } = Input;

interface Project {
  name: string;
  status: "Active" | "Archived";
}

const projects: Project[] = [
  { name: "Marketing Site Redesign", status: "Active" },
  { name: "Q3 Budget Review", status: "Active" },
  { name: "Legacy API Migration", status: "Archived" },
  { name: "Customer Portal Beta", status: "Active" },
];

export function ProjectsList() {
  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input placeholder="Search projects…" style={{ width: 240 }} />
        <Select
          defaultValue="All"
          style={{ width: 140 }}
          options={[
            { value: "All", label: "All" },
            { value: "Active", label: "Active" },
            { value: "Archived", label: "Archived" },
          ]}
        />
        <Button type="primary">New Project</Button>
      </Space>

      <List
        bordered
        dataSource={projects}
        renderItem={(item) => (
          <List.Item>
            <Space
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Text>{item.name}</Text>
              <Tag color={item.status === "Active" ? "green" : "default"}>
                {item.status}
              </Tag>
            </Space>
          </List.Item>
        )}
      />

      <Modal
        title="New Project"
        open={true}
        okText="Create"
        cancelText="Cancel"
        footer={
          <Space>
            <Button>Cancel</Button>
            <Button type="primary">Create</Button>
          </Space>
        }
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
            <TextArea placeholder="Optional" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
