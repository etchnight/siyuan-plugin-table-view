<template>
  <!--<el-button type="primary" @click="submit">生成</el-button>-->
  <Table
    :loading="loading"
    :tableData="tableDataRef"
    :columnProps="tableHeadRef.children"
  ></Table>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import {
  queryBlocksByTag,
  queryDescendantBlocks,
} from "../../lib/siyuanPlugin-common/siyuan-api/query";
//import { getParentNextChildID } from "../../lib/siyuanPlugin-common/siyuan-api/block";
import { Block } from "../../lib/siyuanPlugin-common/types/siyuan-api";
import { Data, Head } from "./Table.vue";
import Table from "./Table.vue";
import { AutocompleteItem } from "./SelectTag.vue";

const props = defineProps<{ tags: TagSelectedItem[] }>();
export interface TagSelectedItem {
  tag: AutocompleteItem;
  children: AutocompleteItem[];
}
//let tableDate = [];
const tableDataRef = ref([]);
const loading = ref(false);
const tableHeadRef = ref<Head>({
  value: "",
  label: "",
  children: [],
  path: [],
});

const recurList2Tree = (parent: Head, list: { value: string }[]) => {
  let children: Head[] = [];
  for (let item of list) {
    let itemPath = item.value.split("/");
    let isChild = true;
    if (itemPath.length !== parent.path.length + 1) {
      isChild = false;
    } else {
      for (let i = 0; i < parent.path.length; i++) {
        if (itemPath[i] !== parent.path[i]) {
          isChild = false;
          break;
        }
      }
    }

    if (isChild) {
      children.push({
        value: item.value,
        label: itemPath[itemPath.length - 1],
        children: [],
        path: itemPath,
      });
    }
  }
  parent.children = parent.children.concat(children);
  for (let child of parent.children) {
    recurList2Tree(child, list);
  }
};
const buildHead = (props: TagSelectedItem[]) => {
  /*构建表头*/
  tableHeadRef.value.children = [];
  tableHeadRef.value.label = "";
  for (const item of props) {
    tableHeadRef.value.value = item.tag.value;
    tableHeadRef.value.path = item.tag.value.split("/");
    recurList2Tree(tableHeadRef.value, item.children);
  }
};
//主程序入口
const submit = async () => {
  //console.log(props.tags);
  loading.value = true;
  //去重
  let tags: string[] = [];
  let propDeduplication: TagSelectedItem[] = [];
  for (let item of props.tags) {
    if (item.tag.value === "") {
      continue;
    }
    if (tags.indexOf(item.tag.value) !== -1) {
      continue;
    }
    tags.push(item.tag.value);
    propDeduplication.push(item);
  }
  buildHead(propDeduplication);
  //console.log(tableHeadRef.value);
  //构建表格主体
  //查找后代块
  const dataSourceGroup = await Promise.all(
    propDeduplication.map(async (item) => {
      const tag = item.tag.value;
      const nameBlocks = await queryBlocksByTag(tag);
      let children = await Promise.all(
        nameBlocks.map(async (block: Block) => {
          const childBlocks = await queryDescendantBlocks(block);
          return {
            tag: tag,
            columnProps: item.children,
            childBlocks: childBlocks,
            nameBlock: block,
          };
        })
      );
      return children;
    })
  );
  /*
  第一列为名称，值为tag所在block的content
  其余列根据tag表示的属性，分别从后代block中查找*/
  tableDataRef.value = [];
  for (const itemGroup of dataSourceGroup) {
    for (const item of itemGroup) {
      let data: Data = {
        //todo 简单去除方法，未考虑行内代码等包含标签关键字情况
        name: item.nameBlock.content.replace("#" + item.tag + "#", ""),
      };
      //const childBlocksReverse = childBlocks.toReversed();
      for (let prop of item.columnProps) {
        /*查找到的block需满足以下条件
       - 如果不是段落，直接满足
       - 如果是段落，则必须是父级的第一个子块，并且父级content是含有标签的块
       */
        let propBlock = item.childBlocks.find((e) => {
          return e.fcontent.indexOf(prop.value) > -1 && e.type !== "l";
        });
        if (!propBlock) {
          propBlock = item.childBlocks.find((e) => {
            return e.content.indexOf(prop.value) > -1 && e.type == "p";
          });
        }
        if (propBlock) {
          data[prop.value] = propBlock.id;
        }
      }

      tableDataRef.value.push(data);
    }
  }
  //console.log(tableDataRef.value);
  loading.value = false;
};
defineExpose({
  submit,
});
</script>
