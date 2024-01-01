<template>
  <div v-html="html"></div>
</template>
<script lang="ts" setup>
import { onUnmounted, ref } from "Vue";
import { Protyle } from "siyuan";

const props = defineProps<{
  id: string;
}>();
const html = ref("");
let protyle: Protyle;
const buildHtml = (blockId) => {
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
      //禁止编辑
      let blockEles = protyle.protyle.contentElement?.querySelectorAll(
        "[contenteditable='true']"
      );
      if (blockEles) {
        for (let ele of blockEles) {
          ele.setAttribute("contenteditable", "false");
        }
      }
      //按道理讲 protyle 已经加载完成，但是加载符号仍然存在，这里等待一点时间
      await sleep(500);
      html.value = protyle.protyle.element.outerHTML;
    },
  });
};

function sleep(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
buildHtml(props.id);

onUnmounted(() => {
  protyle.destroy();
});
</script>

