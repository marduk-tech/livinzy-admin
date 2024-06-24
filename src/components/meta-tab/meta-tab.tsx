import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useDevice } from "../../libs/device";
import FixtureMetaList from "./meta-lists/fixturemeta-list";
import HomeMetaList from "./meta-lists/homemeta-list";
import SpaceMetaList from "./meta-lists/spacemeta-list";

export function MetaTab() {
  const { isMobile } = useDevice();

  return (
    <Tabs
      defaultActiveKey="1"
      tabPosition={isMobile ? "top" : "left"}
      style={{ marginTop: 0 }}
    >
      <TabPane tab="Home Meta" key="1">
        <HomeMetaList />
      </TabPane>
      <TabPane tab="Space Meta" key="2">
        <SpaceMetaList />
      </TabPane>
      <TabPane tab="Fixture Meta" key="3">
        <FixtureMetaList />
      </TabPane>
    </Tabs>
  );
}
