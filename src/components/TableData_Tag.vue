<template>
  <Table
    :loading="loading"
    :tableData="tableDataRef"
    :columnProps="tableHead.children"
  ></Table>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import {
  queryBlocksByTag,
  queryDescendantBlocks,
} from "../../lib/siyuanPlugin-common/siyuan-api/query";
//import { getParentNextChildID } from "../../lib/siyuanPlugin-common/siyuan-api/block";
import { Block } from "../../lib/siyuanPlugin-common/types/siyuan-api";
import { Data, Head } from "./Table.vue";
import Table from "./Table.vue";

const props = defineProps<{
  tag: string;
  tagChildren: { value: string }[];
}>();

//let tableDate = [];
const tableDataRef = ref([]);
const loading = ref(false);
const tableHead = ref<Head>({
  value: "",
  label: "",
  children: [],
});

const recurList2Tree = (parent: Head, list: { value: string }[]) => {
  let children: Head[] = [];
  const parentLevel = parent.value.split("/").length;
  for (let item of list) {
    let itemPath = item.value.split("/");
    if (
      itemPath.length == parentLevel + 1 &&
      item.value.indexOf(parent.value) == 0
    ) {
      children.push({
        value: item.value,
        label: itemPath[itemPath.length - 1],
        children: [],
      });
    }
  }
  parent.children = children;
  for (let child of parent.children) {
    recurList2Tree(child, list);
  }
};

//?是否可以不用watch
//主程序入口
watch(props, async (newProps) => {
  loading.value = true;
  const tag = newProps.tag;
  const columnProps = newProps.tagChildren;
  /*构建表头*/
  let tagTree: Head = {
    value: tag,
    label: tag,
    children: [],
  };
  recurList2Tree(tagTree, columnProps);
  tableHead.value = tagTree;
  /*构建表格主体
  第一列为名称，值为tag所在block的content
  其余列根据tag表示的属性，分别从后代block中查找*/
  const nameBlocks = await queryBlocksByTag(tag);
  tableDataRef.value = await Promise.all(
    nameBlocks.map(async (block: Block) => {
      let data: Data = {
        //todo 简单去除方法，未考虑行内代码等包含标签关键字情况
        name: block.content.replace("#" + tag + "#", ""),
      };
      const childBlocks = await queryDescendantBlocks(block);
      //const childBlocksReverse = childBlocks.toReversed();
      for (let prop of columnProps) {
        /*查找到的block需满足以下条件
       - 如果不是段落，直接满足
       - 如果是段落，则必须是父级的第一个子块，并且父级content是含有标签的块
       */
        let propBlock = childBlocks.find((e) => {
          return e.fcontent.indexOf(prop.value) > -1 && e.type !== "l";
        });
        if (!propBlock) {
          propBlock = childBlocks.find((e) => {
            return e.content.indexOf(prop.value) > -1 && e.type == "p";
          });
        }
        if (propBlock) {
          data[prop.value] = propBlock.id;
        }
      }

      return data;
    })
  );
  loading.value = false;
});
</script>
