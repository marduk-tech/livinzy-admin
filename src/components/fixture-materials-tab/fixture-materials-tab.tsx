import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useDevice } from "../../libs/device";
import MaterialFinishesList from "./materials-lists/material-finishes-list";
import MaterialVariationsList from "./materials-lists/material-variations-list";
import MaterialsList from "./materials-lists/materials-list";

export function FixtureMaterialsTab() {
  const { isMobile } = useDevice();

  return (
    <Tabs
      defaultActiveKey="1"
      tabPosition={isMobile ? "top" : "left"}
      style={{ marginTop: 20 }}
    >
      <TabPane tab="Materials" key="1">
        <MaterialsList />
      </TabPane>
      <TabPane tab="Material Variations" key="2">
        <MaterialVariationsList />
      </TabPane>
      <TabPane tab="Material Finishes" key="3">
        <MaterialFinishesList />
      </TabPane>
    </Tabs>
  );
}
