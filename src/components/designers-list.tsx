import { Table, Tag } from "antd";
import React, { useState } from "react";
import { useGetDesigners, useSaveDesigner } from "../hooks/use-designers";
import { ColumnSearch } from "./column-search";

// Define column configuration for table
const columns = [
  {
    title: "Designer Name",
    dataIndex: "designerName",
    key: "designerName",
    ...ColumnSearch("designerName"),
  },
  {
    title: "Website",
    dataIndex: "websiteUrl",
    key: "websiteUrl",
    render: (websiteUrl: string) => <a href={websiteUrl}>{websiteUrl}</a>,
    ...ColumnSearch("websiteUrl"),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    ...ColumnSearch("email"),
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
    key: "mobile",
    ...ColumnSearch("mobile"),
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
