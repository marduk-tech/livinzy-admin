import { Col, Row, Tabs } from "antd";
import React from "react";
import DesignersList from "../components/designers-list";

import { MetaTab } from "../components/meta-tab/meta-tab";
import ProjectsList from "../components/projects-list";

const { TabPane } = Tabs;

const HomePage: React.FC = () => {
  const callback = (key: string) => {};

  return (
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="Designers" key="1">
        <DesignersList></DesignersList>
      </TabPane>
      <TabPane tab="Projects" key="2">
        <ProjectsList></ProjectsList>
      </TabPane>
      <TabPane tab="Meta" key="3">
        <MetaTab />
      </TabPane>
    </Tabs>
  );
};

export default HomePage;
