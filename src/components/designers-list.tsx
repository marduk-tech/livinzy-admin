import React, { useState } from "react";
import { Button, Table, Tag, message } from "antd";
import { useGetDesigners, useSaveDesigner } from "../hooks/use-designers";
import { queryKeys } from "../libs/react-query/constants";
import { queryClient } from "../libs/react-query/query-client";

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

  const handleAdd = () => {
    setIsAddDialogVisible(true);
  };

  const handleCancelAdd = () => {
    setIsAddDialogVisible(false);
  };
  const handleSaveDesigner = (values: any) => {
    saveDesigner.mutate(values, {
      onSuccess: async () => {
        message.success("Designer saved successfully");
        await queryClient.invalidateQueries({
          queryKey: [queryKeys.getDesigners],
        });

        setIsAddDialogVisible(false);
      },
      onError: (error) => {
        message.error("Error saving designer");
        console.error("Error saving designer:", error);
        // Handle error
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <>
      {" "}
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add
      </Button>
      <Table dataSource={data} columns={columns} rowKey="id" />{" "}
    </>
  );
};

export default DesignersList;
