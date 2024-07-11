import { DeleteOutlined } from "@ant-design/icons";
import {
  App as AntApp,
  Button,
  Col,
  Flex,
  Row,
  Table,
  TableColumnType,
  Typography,
} from "antd";
import React from "react";
import { useHandleError } from "../../../hooks/use-handle-error";
import {
  useDeleteMaterialMeta,
  useFetchMaterialsMeta,
} from "../../../hooks/use-materials";
import { MaterialsMeta } from "../../../interfaces/Materials";
import { useDevice } from "../../../libs/device";
import { queryKeys } from "../../../libs/react-query/constants";
import { queryClient } from "../../../libs/react-query/query-client";
import { ColumnSearch } from "../../column-search";
import { DeletePopconfirm } from "../../delete-popconfirm";
import { Loader } from "../../loader";
import { MaterialEditModal } from "../modals/materials-edit-modal";

const MaterialsList: React.FC = () => {
  const { isMobile } = useDevice();
  const { isLoading, isError, data } = useFetchMaterialsMeta();

  const { notification } = AntApp.useApp();
  const deleteMetaMutation = useDeleteMaterialMeta();
  const { handleError } = useHandleError();

  const handleDelete = async ({ id }: { id: string }) => {
    await deleteMetaMutation.mutateAsync(
      { materialMetaId: id },
      {
        onError: (error: unknown) => {
          handleError(error);
        },
      }
    );

    notification.success({
      message: `Material meta removed successfully!`,
    });

    await queryClient.invalidateQueries({
      queryKey: [queryKeys.getMaterialsMeta],
    });
  };

  const columns: TableColumnType<MaterialsMeta>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...ColumnSearch("name"),
    },
    {
      title: "Cost Score",
      dataIndex: "costScore",
      key: "costScore",
      ...ColumnSearch("costScore"),
    },
    {
      title: "Benefit",
      dataIndex: "benefit",
      key: "benefit",
      ...ColumnSearch("benefit"),
    },
    {
      title: "Drawback",
      dataIndex: "drawback",
      key: "drawback",
      ...ColumnSearch("drawback"),
    },
    {
      title: "",
      align: "right",
      dataIndex: "_id",
      key: "_id",

      render: (id: string, record) => {
        return (
          <Flex gap={isMobile ? 5 : 15} justify="end">
            <MaterialEditModal record={record} action="EDIT" />

            <DeletePopconfirm
              handleOk={() => handleDelete({ id })}
              isLoading={deleteMetaMutation.isPending}
              title="Delete"
              description="Are you sure you want to delete this material meta"
            >
              <Button
                type="default"
                shape="default"
                icon={<DeleteOutlined />}
              ></Button>
            </DeletePopconfirm>
          </Flex>
        );
      },
    },
  ];

  if (isLoading) return <Loader />;
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
            Materials
          </Typography.Title>
        </Col>
        <Col>
          <MaterialEditModal action="ADD" />
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

export default MaterialsList;
