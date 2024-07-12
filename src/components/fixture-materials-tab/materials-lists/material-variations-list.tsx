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
  useDeleteMaterialVariationMeta,
  useFetchMaterialVariationsMeta,
} from "../../../hooks/use-materials";
import { MaterialVariations } from "../../../interfaces/Materials";
import { useDevice } from "../../../libs/device";
import { queryKeys } from "../../../libs/react-query/constants";
import { queryClient } from "../../../libs/react-query/query-client";
import { ColumnSearch } from "../../column-search";
import { DeletePopconfirm } from "../../delete-popconfirm";
import { Loader } from "../../loader";
import { MaterialVariationsEditModal } from "../modals/material-variations-edit-modal";

const MaterialVariationsList: React.FC = () => {
  const { isMobile } = useDevice();
  const { isLoading, isError, data } = useFetchMaterialVariationsMeta();

  const { notification } = AntApp.useApp();
  const deleteMetaMutation = useDeleteMaterialVariationMeta();
  const { handleError } = useHandleError();

  const handleDelete = async ({ id }: { id: string }) => {
    await deleteMetaMutation.mutateAsync(
      { id: id },
      {
        onError: (error: unknown) => {
          handleError(error);
        },
      }
    );

    notification.success({
      message: `Material variation removed successfully!`,
    });

    await queryClient.invalidateQueries({
      queryKey: [queryKeys.getMaterialsVariationsMeta],
    });
  };

  const columns: TableColumnType<MaterialVariations>[] = [
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
            <MaterialVariationsEditModal record={record} action="EDIT" />

            <DeletePopconfirm
              handleOk={() => handleDelete({ id })}
              isLoading={deleteMetaMutation.isPending}
              title="Delete"
              description="Are you sure you want to delete this material variation"
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
            Material Variations
          </Typography.Title>
        </Col>
        <Col>
          <MaterialVariationsEditModal action="ADD" />
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

export default MaterialVariationsList;
