import { HomeOutlined, PoundOutlined, TeamOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Image, Layout, theme } from "antd";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

const { Header, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Company", "sub1", <HomeOutlined />, [
    getItem("Products/Services", "1"),
    getItem("Promotion", "2"),
    getItem("Settings", "3")
  ]),
  getItem("Stores", "sub2", <PoundOutlined />, [
    getItem("Orders", "4"),
    getItem("Staff", "5"),
    getItem("Settings", "6")
  ]),
  getItem("Customers", "sub3", <TeamOutlined />, [
    getItem("Customer Data", "7"),
    getItem("Wallet Recharge", "8")
  ])
];

// const menuItems: MenuProps["items"] = [
//   {
//     label: "Mother Category",
//     key: "Mother-Category"
//   },

//   {
//     label: "Category",
//     key: "Category"
//   },

//   {
//     label: "Sub Category",
//     key: "Sub-Category"
//   },

//   {
//     label: "Items",
//     key: "Items"
//   }
// ];

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
      >
        <Flex style={{ height: "64px" }} align="center" justify="center">
          <Typography.Text
            style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}
          >
            {collapsed ? "U" : "PROJECT ULTRON"}
          </Typography.Text>
        </Flex>

        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider> */}
      <Layout>
        <Header style={{ padding: "8px 24px", background: "transparent" }}>
          <Image
            src="../../logo-name.png"
            style={{ height: 35, width: "auto" }}
          ></Image>
        </Header>
        <Content style={{ margin: "60px 60px" }}>
          {/* <Menu mode="horizontal" items={menuItems} /> */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
