import { EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  App as AntApp,
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Upload,
  UploadFile,
} from "antd";
import { useEffect, useState } from "react";
import { useHandleError } from "../../../hooks/use-handle-error";
import { useCreateHomeMeta, useUpdateHomeMeta } from "../../../hooks/use-meta";
import { baseApiUrl } from "../../../libs/constants";
import { queryKeys } from "../../../libs/react-query/constants";
import { queryClient } from "../../../libs/react-query/query-client";

export const HomeMetaEditModal = ({
  record,
  action,
}: {
  record?: any;
  action: "EDIT" | "ADD";
}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const [imageList, setImageList] = useState<UploadFile[]>([]);

  const { notification } = AntApp.useApp();

  const { handleError } = useHandleError();

  const updateMetaMutation = useUpdateHomeMeta();

  const createHomeMetaMutation = useCreateHomeMeta();

  useEffect(() => {
    if (record && action === "EDIT") {
      form.setFieldsValue({
        ...record,
        homeType: record.homeType,
        description: record.description,
      });

      if (record.icon) {
        setImageList([
          {
            uid: `0`,
            name: `image0`,
            status: "done",
            url: record.icon,
          },
        ]);
      }
    }
  }, [record, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!values.icon) {
        values.icon = values?.icon;
      } else {
        if (values.icon.fileList.length > 0) {
          values.icon = values.icon.fileList.map((file: any) => {
            if (file.response) {
              return file.response.data.Location;
            }

            if (file.status !== "removed") {
              return file.url;
            }

            return "";
          })[0];
        } else {
          values.icon = "";
        }
      }

      if (action === "EDIT") {
        await updateMetaMutation.mutateAsync(
          { homeMetaId: record._id, data: values },
          {
            onError: (error: unknown) => {
              handleError(error);
            },
          }
        );
      } else {
        await createHomeMetaMutation.mutateAsync(
          { data: values },
          {
            onError: (error: unknown) => {
              handleError(error);
            },
          }
        );
      }

      notification.success({
        message: `Home Meta  ${
          action === "ADD" ? "created" : "updated"
        }  successfully!`,
      });

      await queryClient.invalidateQueries({
        queryKey: [queryKeys.getHomeMeta],
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
        title={action === "EDIT" ? "Edit Home Meta" : "Create Home Meta"}
        open={open}
        onOk={handleOk}
        confirmLoading={
          updateMetaMutation.isPending || createHomeMetaMutation.isPending
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
              name={"homeType"}
              label="Home Type"
              rules={[
                { required: true, message: "Please enter the apartment type" },
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

            <Form.Item label="Icon" name="icon">
              <Upload
                multiple={false}
                maxCount={1}
                name="image"
                action={`${baseApiUrl}upload/single`}
                listType="picture-card"
                fileList={imageList}
                onChange={({ fileList: newImageList }) =>
                  setImageList(newImageList)
                }
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};
