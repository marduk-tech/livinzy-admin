import { DeleteOutlined } from "@ant-design/icons";
import {
  App as AntApp,
  Button,
  Col,
  Row,
  Table,
  TableColumnType,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useHandleError } from "../../../hooks/use-handle-error";
import { useDeleteHomeMeta, useFetchHomeMeta } from "../../../hooks/use-meta";
import { HomeMeta } from "../../../interfaces/Meta";
import { queryKeys } from "../../../libs/react-query/constants";
import { queryClient } from "../../../libs/react-query/query-client";
import { DeletePopconfirm } from "../../delete-popconfirm";
import { HomeMetaEditModal } from "../modals/homemeta-edit-modal";

const HomeMetaList: React.FC = () => {
  const { isLoading, isError, data } = useFetchHomeMeta();
  const { notification } = AntApp.useApp();
  const deleteMetaMutation = useDeleteHomeMeta();
  const { handleError } = useHandleError();

  const handleDelete = async ({ id }: { id: string }) => {
    await deleteMetaMutation.mutateAsync(
      { homeMetaId: id },
      {
        onError: (error: unknown) => {
          handleError(error);
        },
      }
    );

    notification.success({
      message: `Home meta removed successfully!`,
    });

    await queryClient.invalidateQueries({
      queryKey: [queryKeys.getHomeMeta],
    });
  };

  const columns: TableColumnType<HomeMeta>[] = [
    {
      title: "Home Type",
      dataIndex: "homeType",
      key: "homeType",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "",
      align: "right",
      dataIndex: "_id",
      key: "_id",

      render: (id: string, record) => {
        return (
          <>
            <HomeMetaEditModal record={record} action="EDIT" />

            <DeletePopconfirm
              handleOk={() => handleDelete({ id })}
              isLoading={deleteMetaMutation.isPending}
              title="Delete"
              description="Are you sure you want to delete this home meta"
            >
              <Button
                style={{ marginLeft: "15px" }}
                type="default"
                shape="default"
                icon={<DeleteOutlined />}
              ></Button>
            </DeletePopconfirm>
          </>
        );
      },
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 20, padding: "0 10px" }}
      >
        <Col>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Home Meta
          </Typography.Title>
        </Col>
        <Col>
          <HomeMetaEditModal action="ADD" />
        </Col>
      </Row>

      <Table
        dataSource={data}
        columns={columns}
        loading={isLoading}
        rowKey="_id"
      />
    </>
  );
};

export default HomeMetaList;
