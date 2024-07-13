import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  App as AntApp,
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  UploadFile,
} from "antd";
import { useEffect, useState } from "react";
import { useHandleError } from "../../../hooks/use-handle-error";
import { useFetchMaterialsMeta } from "../../../hooks/use-materials";
import {
  useCreateFixtureMeta,
  useUpdateFixtureMeta,
} from "../../../hooks/use-meta";
import { MaterialsMeta } from "../../../interfaces/Materials";
import { FixtureMeta } from "../../../interfaces/Meta";
import { baseApiUrl } from "../../../libs/constants";
import { queryKeys } from "../../../libs/react-query/constants";
import { queryClient } from "../../../libs/react-query/query-client";
import { Loader } from "../../loader";

function getExistingMaterials(
  record: FixtureMeta,
  materialsMeta: MaterialsMeta[]
) {
  return record.materials.map((material) => {
    const foundMaterial = materialsMeta.find((m) => m._id === material._id);

    if (!foundMaterial) {
      return null;
    }

    return {
      label: foundMaterial.name,
      value: foundMaterial._id,
    };
  });
}

export const FixtureMetaEditModal = ({
  record,
  action,
}: {
  record?: FixtureMeta;
  action: "EDIT" | "ADD";
}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { notification } = AntApp.useApp();

  const [imageList, setImageList] = useState<UploadFile[]>([]);

  const { handleError } = useHandleError();

  const materialsMeta = useFetchMaterialsMeta();

  const updateMetaMutation = useUpdateFixtureMeta();
  const createMetaMutation = useCreateFixtureMeta();

  useEffect(() => {
    if (record && action === "EDIT" && materialsMeta.data) {
      form.setFieldsValue({
        ...record,
        fixtureType: record.fixtureType,
        description: record.description,
        materials: getExistingMaterials(record, materialsMeta.data),
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
    } else {
      form.resetFields();
    }
  }, [record, form, materialsMeta.data]);

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

      if (action === "EDIT" && record) {
        await updateMetaMutation.mutateAsync(
          {
            fixtureMetaId: record._id,
            data: values,
          },
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
        message: `Fixture meta  ${
          action === "ADD" ? "created" : "updated"
        }  successfully!`,
      });

      await queryClient.invalidateQueries({
        queryKey: [queryKeys.getFixtureMeta],
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
            action === "EDIT" ? "Edit Fixture Meta" : "Create Fixture Meta"
          }
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
                name={"fixtureType"}
                label="Fixture Type"
                rules={[
                  { required: true, message: "Please enter the space type" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={"materials"}
                label="Material"
                rules={[{ required: true, message: "Please select materials" }]}
              >
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Materials"
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
                />
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
  }
};
