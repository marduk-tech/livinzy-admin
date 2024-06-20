import React, { useState } from "react";
import { Table, Tag } from "antd";
import { useGetDesigners, useSaveDesigner } from "../hooks/use-designers";

// Define column configuration for table
const columns = [
  {
    title: "Designer Name",
    dataIndex: "designerName",
    key: "designerName",
  },
  {
    title: "Website",
    dataIndex: "websiteUrl",
    key: "websiteUrl",
    render: (websiteUrl: string) => <a href={websiteUrl}>{websiteUrl}</a>,
  },
  {
    title: "Profile Status",
    dataIndex: "profileStatus",
    key: "profileStatus",
    render: (profileStatus: string) => (
      <Tag color={profileStatus === "ACTIVE" ? "green" : "red"}>
        {profileStatus}
      </Tag>
    ),
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
    key: "mobile",
  },
];

const DesignersList: React.FC = () => {
  // Fetch data using custom hook
  const { isLoading, isError, data } = useGetDesigners();
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const saveDesigner = useSaveDesigner();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <>
      {" "}
      <Table dataSource={data} columns={columns} rowKey="id" />{" "}
    </>
  );
};

export default DesignersList;
