import { Table } from "antd";
import React from "react";
import { useFetchProjects } from "../hooks/use-projects";

// Define column configuration for table
const columns = [
  {
    title: "Community Name",
    dataIndex: ["homeDetails", "communityName"],
    key: "communityName",
  },
  {
    title: "Size",
    dataIndex: ["homeDetails", "size"],
    key: "size",
  },
  {
    title: "Home type",
    dataIndex: ["homeDetails", "homeType", "homeType"],
    key: "homeType",
  },
];

const ProjectsList: React.FC = () => {
  // Fetch data using custom hook
  const { isLoading, isError, data } = useFetchProjects();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  console.log(data);

  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        loading={isLoading}
        rowKey="_id"
      />
    </>
  );
};

export default ProjectsList;
