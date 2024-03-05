<template>
  <div v-html="html"></div>
</template>
<script lang="ts" setup>
import { onUnmounted, ref } from "vue";
import { Protyle } from "siyuan";
import { TreeTools } from "../../lib/js-utility-function/src/tree";
import { Head } from "./Table.vue";

const props = defineProps<{
  id: string;
  removeContent: Head;
}>();
const html = ref("");
let protyle: Protyle;
const buildHtml = (blockId: string) => {
  let tempDiv = document.createElement("div");
  protyle = new Protyle(window.siyuan.ws.app, tempDiv, {
    blockId: blockId,
    mode: "wysiwyg",
    render: {
      title: false,
      gutter: false,
      breadcrumb: false,
      breadcrumbDocName: false,
    },
    after: async (protyle) => {
      const content = protyle.protyle.contentElement.cloneNode(
        true
      ) as HTMLElement;
      if (!content) {
        return;
      }
      let blockEles = content.querySelectorAll("[contenteditable='true']");
      /*禁止编辑
      if (blockEles) {
        for (let ele of blockEles) {
          ele.setAttribute("contenteditable", "false");
        }
      }*/
      //按道理讲 protyle 已经加载完成，但是加载符号仍然存在，这里等待一点时间
      await sleep(500);
      //删除属性标志文本
      const treeTools = new TreeTools();
      if (props.removeContent.splitFlag === "/") {
        const matchReg = props.removeContent.value;
        treeTools.forEach([...blockEles], (e) => {
          if (
            e.getAttribute("data-type") === "tag" &&
            e.textContent.match(matchReg)
          ) {
            e.remove();
          }
        });
      } else {
        const tempList = props.removeContent.value.split(
          props.removeContent.splitFlag
        );
        const matchReg =
          tempList[tempList.length - 2] + props.removeContent.splitFlag;
        treeTools.forEach([...blockEles], (e) => {
          if (e.childElementCount === 0) {
            e.textContent = e.textContent.replace(matchReg, "");
          }
        });
      }

      html.value = content.outerHTML;
    },
  });
};

function sleep(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
buildHtml(props.id);

onUnmounted(() => {
  protyle.destroy();
});
</script>
