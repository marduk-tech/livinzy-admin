import { EditOutlined } from "@ant-design/icons";
import {
  App as AntApp,
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { useHandleError } from "../../../hooks/use-handle-error";
import {
  useCreateMaterialMeta,
  useUpdateMaterialMeta,
} from "../../../hooks/use-materials";

import { MaterialsMeta } from "../../../interfaces/Materials";

import { queryKeys } from "../../../libs/react-query/constants";
import { queryClient } from "../../../libs/react-query/query-client";

export const MaterialEditModal = ({
  record,
  action,
}: {
  record?: MaterialsMeta;
  action: "EDIT" | "ADD";
}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { notification } = AntApp.useApp();

  const { handleError } = useHandleError();

  const updateMaterialMetaMutation = useUpdateMaterialMeta();
  const createMaterialMetaMutation = useCreateMaterialMeta();

  useEffect(() => {
    if (record && action === "EDIT") {
      form.setFieldsValue({
        ...record,
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
        await updateMaterialMetaMutation.mutateAsync(
          { materialMetaId: record?._id!, data: values },
          {
            onError: (error: unknown) => {
              handleError(error);
            },
          }
        );
      } else {
        await createMaterialMetaMutation.mutateAsync(
          { data: values },
          {
            onError: (error: unknown) => {
              handleError(error);
            },
          }
        );
      }

      notification.success({
        message: `Material Meta  ${
          action === "ADD" ? "created" : "updated"
        }  successfully!`,
      });

      await queryClient.invalidateQueries({
        queryKey: [queryKeys.getMaterialsMeta],
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
          action === "EDIT" ? "Edit Material Meta" : "Create Material Meta"
        }
        open={open}
        onOk={handleOk}
        confirmLoading={
          updateMaterialMetaMutation.isPending ||
          createMaterialMetaMutation.isPending
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
              name={"name"}
              label="Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name={"costScore"}
              label="Cost Score"
              rules={[
                { required: true, message: "Please enter the cost score" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name={"benefit"}
              label="Benefit"
              rules={[{ required: true, message: "Please enter the benefit" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name={"drawback"}
              label="Drawback"
              rules={[{ required: true, message: "Please enter the drawback" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};
