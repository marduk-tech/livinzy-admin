import { EditOutlined } from "@ant-design/icons";
import { App as AntApp, Button, Flex, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useHandleError } from "../../../hooks/use-handle-error";
import {
  useCreateSpaceMeta,
  useUpdateSpaceMeta,
} from "../../../hooks/use-meta";
import { queryKeys } from "../../../libs/react-query/constants";
import { queryClient } from "../../../libs/react-query/query-client";

export const SpaceMetaEditModal = ({
  record,
  action,
}: {
  record?: any;
  action: "EDIT" | "ADD";
}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { notification } = AntApp.useApp();

  const { handleError } = useHandleError();

  const updateMetaMutation = useUpdateSpaceMeta();

  const createMetaMutation = useCreateSpaceMeta();

  useEffect(() => {
    if (record && action === "EDIT") {
      form.setFieldsValue({
        ...record,
        spaceType: record.spaceType,
        description: record.description,
      });
    }
  }, [record, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      console.log(values);

      if (action === "EDIT") {
        await updateMetaMutation.mutateAsync(
          { spaceMetaId: record._id, data: values },
          {
            onError: (error: unknown) => {
              handleError(error);
            },
          }
        );
      } else {
        await createMetaMutation.mutateAsync(
          { data: values },
          {
            onError: (error: unknown) => {
              handleError(error);
            },
          }
        );
      }

      notification.success({
        message: `Space meta  ${
          action === "ADD" ? "created" : "updated"
        }  successfully!`,
      });

      await queryClient.invalidateQueries({
        queryKey: [queryKeys.getSpaceMeta],
      });

      setOpen(false);
      form.resetFields();
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
        title={action === "EDIT" ? "Edit Space Meta" : "Create Space Meta"}
        open={open}
        onOk={handleOk}
        confirmLoading={
          updateMetaMutation.isPending || createMetaMutation.isPending
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
              name={"spaceType"}
              label="Space Type"
              rules={[
                { required: true, message: "Please enter the space type" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name={"description"}
              label="Description"
              rules={[
                { required: true, message: "Please enter the description" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};
