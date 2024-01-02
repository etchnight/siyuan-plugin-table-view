import { Plugin, showMessage, openTab, Protyle, type IModel } from "siyuan";
import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
//import "element-plus/dist/index.css";
import "./index.css";

const STORAGE_NAME = "menu-config";
const TAB_TYPE = "custom_tab";
const DOCK_TYPE = "dock_tab";

export default class PluginTableView extends Plugin {
  private customTab: () => IModel;
  onload() {
    this.addIcons(`<symbol id="iconTableView" viewBox="0 0 32 32">
      <path style="stroke:none;fill-rule:nonzero;" d="M 29 1.4375 L 3 1.4375 C 1.34375 1.4375 0 2.78125 0 4.4375 L 0 26.4375 C 0 28.09375 1.34375 29.4375 3 29.4375 L 29 29.4375 C 30.65625 29.4375 32 28.09375 32 26.4375 L 32 4.4375 C 32 2.78125 30.65625 1.4375 29 1.4375 Z M 14 25.4375 L 4 25.4375 L 4 19.4375 L 14 19.4375 Z M 14 15.4375 L 4 15.4375 L 4 9.4375 L 14 9.4375 Z M 28 25.4375 L 18 25.4375 L 18 19.4375 L 28 19.4375 Z M 28 15.4375 L 18 15.4375 L 18 9.4375 L 28 9.4375 Z M 28 15.4375 "/>
       </symbol>`);//fill:rgb(60%,60%,60%);fill-opacity:1;
    const vueApp = createApp(App);
    vueApp.use(ElementPlus);
    this.customTab = this.addTab({
      type: TAB_TYPE,
      init() {
        this.element.innerHTML = `<div id="plugin-table-view-app">/div>`;
        vueApp.mount("#plugin-table-view-app");
      },
      beforeDestroy() {
        vueApp.unmount();
        console.log("before destroy tab:", TAB_TYPE);
      },
      destroy() {
        console.log("destroy tab:", TAB_TYPE);
      },
    });
    console.log(this.i18n.helloPlugin);
  }

  async onLayoutReady() {
    const topBarElement = this.addTopBar({
      icon: "iconTableView",
      title: "表格展示",
      position: "right",
      callback: async () => {
        const tab = await openTab({
          app: this.app,
          custom: {
            icon: "iconTableView",
            title: "表格展示",
            data: {},
            id: this.name + TAB_TYPE,
          },
        });
        /*
        //todo 可行，但是如何在表格中实现
        let protyle = new Protyle(
          window.siyuan.ws.app,
          tab.panelElement.querySelector("#protyle") as HTMLElement,
          {
            blockId: "20230404125830-hdzwshd",
            mode: "wysiwyg",
            render: {
              title: false,
              gutter: false,
              breadcrumb: false,
              breadcrumbDocName: false,
            },
            after: (protyle) => {//禁止编辑
              let blockEles = protyle.protyle.contentElement?.querySelectorAll(
                "[contenteditable='true']"
              );
              if (blockEles) {
                for (let ele of blockEles) {
                  ele.setAttribute("contenteditable", "false");
                }
              }
            },
          }
        );*/
      },
    });
  }

  async onunload() {
    console.log(this.i18n.byePlugin);
    showMessage("Goodbye SiYuan Plugin");
    console.log("onunload");
  }
}
