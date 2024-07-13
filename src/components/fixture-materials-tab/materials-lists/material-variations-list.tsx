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
  useFetchMaterialsMeta,
  useFetchMaterialVariationsMeta,
} from "../../../hooks/use-materials";
import {
  MaterialsMeta,
  MaterialVariations,
} from "../../../interfaces/Materials";
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

  const materialsMeta = useFetchMaterialsMeta();

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
      title: "Material",
      dataIndex: "_id",
      key: "_id",
      render: (id: string, record) => {
        // Find the material that matches the record's materialId
        const material = materialsMeta.data.find(
          (item: MaterialsMeta) => item._id === record.materialId
        );

        // Check if the material was found
        const materialName = material ? material.name : "Unknown Material";

        return materialName;
      },
      filters: materialsMeta.data
        .filter(
          (item: MaterialsMeta, index: number, self: any) =>
            index === self.findIndex((t: MaterialsMeta) => t._id === item._id)
        )
        .map((m: MaterialsMeta) => {
          return {
            text: m.name,
            value: m._id,
          };
        }),
      filterSearch: true,
      onFilter: (value, record) => {
        return record.materialId.startsWith(value as string);
      },
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
        loading={isLoading || materialsMeta.isLoading}
        rowKey="_id"
      />
    </>
  );
};

export default MaterialVariationsList;
