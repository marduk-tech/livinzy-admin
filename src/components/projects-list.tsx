import { LinkOutlined } from "@ant-design/icons";
import { Button, Table, TableColumnType } from "antd";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { useFetchProjects } from "../hooks/use-projects";
import { Project } from "../interfaces/Project";
import { partnerAppUrl } from "../libs/constants";
import { ColumnSearch } from "./column-search";

const ProjectsList: React.FC = () => {
  // Fetch data using custom hook
  const { isLoading, isError, data } = useFetchProjects();

  // Define column configuration for table
  const columns: TableColumnType<Project>[] = [
    {
      title: "Project Name",
      dataIndex: ["name"],
      key: "name",
      ...ColumnSearch("name"),
    },
    {
      title: "Size",
      dataIndex: ["homeDetails", "size"],
      key: "size",
      ...ColumnSearch(["homeDetails", "size"]),
    },
    {
      title: "Home type",
      dataIndex: ["homeDetails", "homeType", "homeType"],
      key: "homeType",
      ...ColumnSearch(["homeDetails", "homeType", "homeType"]),
    },
    {
      title: "Designer Name",
      dataIndex: ["designerId", "designerName"],
      key: "designerName",
      ...ColumnSearch(["designerId", "designerName"]),
    },
    {
      title: "Community Name",
      dataIndex: ["homeDetails", "communityName"],
      key: "communityName",
      ...ColumnSearch(["homeDetails", "communityName"]),
    },
    {
      title: "Last updated",
      dataIndex: ["updatedAt"],
      key: "updatedAt",
      render: (updatedAt: string) => {
        const date = dayjs(updatedAt);
        return `${date.format("YYYY-MM-DD")} - ${date.format("HH:mm")}`;
      },
    },
    {
      title: "",
      align: "right",
      dataIndex: "_id",
      key: "_id",
      render: (id: string, record: Project) => (
        <Link to={`${partnerAppUrl}projects/details/${id}`} target="_blank">
          <Button type="default" shape="default" icon={<LinkOutlined />} />
        </Link>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <>
      <Table
        dataSource={data.sort(
          (a: Project, b: Project) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )}
        columns={columns}
        loading={isLoading}
        rowKey="_id"
      />
    </>
  );
};

export default ProjectsList;
