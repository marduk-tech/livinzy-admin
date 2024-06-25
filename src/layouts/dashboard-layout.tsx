import { useAuth0 } from "@auth0/auth0-react";
import { Flex, Image, Layout } from "antd";
import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Loader } from "../components/loader";
import { UserDropDown } from "../components/user-dropdown";

const { Header, Content } = Layout;

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <Loader size="large" />;
  }

  if (isAuthenticated) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Header style={{ padding: "8px 24px", background: "transparent" }}>
            <Flex align="center" justify="space-between">
              <Image
                src="../../logo-name.png"
                style={{ height: 35, width: "auto" }}
              ></Image>

              <UserDropDown />
            </Flex>
          </Header>
          <Content style={{ margin: "60px 60px" }}>
            {/* <Menu mode="horizontal" items={menuItems} /> */}
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    );
  }
};
