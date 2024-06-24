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
import React from "react";
import { useHandleError } from "../../../hooks/use-handle-error";
import { useDeleteSpaceMeta, useFetchSpaceMeta } from "../../../hooks/use-meta";
import { SpaceMeta } from "../../../interfaces/Meta";
import { queryKeys } from "../../../libs/react-query/constants";
import { queryClient } from "../../../libs/react-query/query-client";
import { DeletePopconfirm } from "../../delete-popconfirm";
import { SpaceMetaEditModal } from "../modals/spacemeta-edit-modal";

const SpaceMetaList: React.FC = () => {
  // Fetch data using custom hook
  const { isLoading, isError, data } = useFetchSpaceMeta();
  const { notification } = AntApp.useApp();
  const deleteMetaMutation = useDeleteSpaceMeta();
  const { handleError } = useHandleError();

  const handleDelete = async ({ id }: { id: string }) => {
    await deleteMetaMutation.mutateAsync(
      { spaceMetaId: id },
      {
        onError: (error: unknown) => {
          handleError(error);
        },
      }
    );

    notification.success({
      message: `Spacemeta removed successfully!`,
    });

    await queryClient.invalidateQueries({
      queryKey: [queryKeys.getSpaceMeta],
    });
  };

  // Define column configuration for table
  const columns: TableColumnType<SpaceMeta>[] = [
    {
      title: "Space Type",
      dataIndex: "spaceType",
      key: "spaceType",
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

      render: (id: string, record: SpaceMeta) => {
        return (
          <>
            <SpaceMetaEditModal record={record} action="EDIT" />

            <DeletePopconfirm
              handleOk={() => handleDelete({ id })}
              isLoading={deleteMetaMutation.isPending}
              title="Delete"
              description="Are you sure you want to delete this space meta"
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
            Space Meta
          </Typography.Title>
        </Col>
        <Col>
          <SpaceMetaEditModal action="ADD" />
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

export default SpaceMetaList;
