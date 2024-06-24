import {
  ExclamationCircleFilled,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Dropdown, Modal, Popconfirm } from "antd";
import { COLORS } from "../styles/colors";

const { confirm } = Modal;

export function UserDropDown() {
  const { logout } = useAuth0();

  const showConfirm = () => {
    confirm({
      title: "Logout",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to logout ?",
      okText: "Logout",
      okType: "danger",
      cancelButtonProps: {
        type: "default",
        shape: "default",
      },
      onOk() {
        logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
      },
    });
  };

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "1",
            label: (
              <Button
                icon={<LogoutOutlined />}
                type="link"
                onClick={showConfirm}
                style={{
                  color: COLORS.textColorDark,
                  padding: 0,
                  height: 32,
                  width: 150,
                  textAlign: "left",
                }}
              >
                Logout
              </Button>
            ),
          },
        ],
      }}
      placement="bottomRight"
    >
      <Button
        shape="circle"
        size="small"
        icon={<UserOutlined />}
        style={{
          marginRight: 16,
          marginLeft: "auto",
        }}
      ></Button>
    </Dropdown>
  );
}
