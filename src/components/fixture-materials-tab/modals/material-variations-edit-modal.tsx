import { EditOutlined } from "@ant-design/icons";
import {
  App as AntApp,
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { useHandleError } from "../../../hooks/use-handle-error";
import {
  useCreateMaterialVariationMeta,
  useFetchMaterialsMeta,
  useUpdateMaterialVariationMeta,
} from "../../../hooks/use-materials";
import {
  MaterialsMeta,
  MaterialVariations,
} from "../../../interfaces/Materials";

import { queryKeys } from "../../../libs/react-query/constants";
import { queryClient } from "../../../libs/react-query/query-client";
import { Loader } from "../../loader";

export const MaterialVariationsEditModal = ({
  record,
  action,
}: {
  record?: MaterialVariations;
  action: "EDIT" | "ADD";
}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { notification } = AntApp.useApp();

  const { handleError } = useHandleError();

  const materialsMeta = useFetchMaterialsMeta();

  const updateVariationMutation = useUpdateMaterialVariationMeta();
  const createVariationMutation = useCreateMaterialVariationMeta();

  useEffect(() => {
    if (record && action === "EDIT") {
      form.setFieldsValue({
        ...record,
        materialId: record.materialId,
        name: record.name,
        costScore: record.costScore,
        benefit: record.benefit,
        drawback: record.drawback,
      });
    } else {
      form.resetFields();
    }
  }, [record, form, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (action === "EDIT") {
        await updateVariationMutation.mutateAsync(
          { id: record?._id!, data: values },
          {
            onError: (error: unknown) => {
              handleError(error);
            },
          }
        );
      } else {
        await createVariationMutation.mutateAsync(
          { data: values },
          {
            onError: (error: unknown) => {
              handleError(error);
            },
          }
        );
      }

      notification.success({
        message: `Material variation  ${
          action === "ADD" ? "created" : "updated"
        }  successfully!`,
      });

      await queryClient.invalidateQueries({
        queryKey: [queryKeys.getMaterialsVariationsMeta],
      });

      setOpen(false);
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  if (materialsMeta.isLoading) {
    return <Loader />;
  }

  if (materialsMeta.isError) {
    setOpen(false);
    return;
  }

  if (materialsMeta.data) {
    return (
      <>
        {action === "EDIT" ? (
          <Button
            onClick={showModal}
            type="default"
            shape="default"
            icon={<EditOutlined />}
          ></Button>
        ) : (
          <Button type="primary" size="middle" onClick={showModal}>
            Add
          </Button>
        )}

        <Modal
          title={
            action === "EDIT"
              ? "Edit Material variation"
              : "Create Material variation"
          }
          open={open}
          onOk={handleOk}
          confirmLoading={
            updateVariationMutation.isPending ||
            createVariationMutation.isPending
          }
          onCancel={handleCancel}
          okText="Confirm"
        >
          <Form
            form={form}
            layout="vertical"
            style={{ marginTop: 20 }}
            onFinish={handleOk}
          >
            <Flex vertical>
              <Form.Item
                name="materialId"
                label="Material"
                rules={[
                  { required: true, message: "Please select a material" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a material"
                  optionFilterProp="children"
                  filterOption={(input, option: any) => {
                    return (
                      option?.label
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  options={materialsMeta.data
                    .filter(
                      (item: MaterialsMeta, index: number, self: any) =>
                        index ===
                        self.findIndex((t: MaterialsMeta) => t._id === item._id)
                    )
                    .map((m: MaterialsMeta) => {
                      return {
                        label: m.name,
                        value: m._id,
                      };
                    })}
                ></Select>
              </Form.Item>

              <Form.Item
                name={"name"}
                label="Name"
                rules={[{ required: true, message: "Please enter name" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name={"costScore"} label="Cost Score">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name={"benefit"} label="Benefit">
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item name={"drawback"} label="Drawback">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Flex>
          </Form>
        </Modal>
      </>
    );
  }
};
