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
  queryBlockById,
  queryBlocksByTag,
  queryDescendantBlocks,
} from "../../lib/siyuanPlugin-common/siyuan-api/query";
//import { getParentNextChildID } from "../../lib/siyuanPlugin-common/siyuan-api/block";
import { Block } from "../../lib/siyuanPlugin-common/types/siyuan-api";
import { Data, Head } from "./Table.vue";
import Table from "./Table.vue";
import { BlockAC } from "./SelectBlock.vue";
import { AutocompleteItem, TagSelectedItem } from "./SelectTag.vue";

const props = defineProps<{
  tag_concept: TagSelectedItem[];
  blocks: BlockAC[];
  tag_property: TagSelectedItem[];
  isContainsTagChild: boolean;
  splitFlag: string;
}>();

//let tableDate = [];
const tableDataRef = ref<Data[]>([]);
const loading = ref(false);
const tableHeadRef = ref<Head>({
  value: "",
  label: "",
  children: [],
  path: [],
});

const recurList2Tree = (parent: Head, list: { value: string }[]) => {
  for (let item of list) {
    let itemPath = item.value.split("/");
    if (!isChild(itemPath, parent.path)) {
      continue;
    }
    if (
      parent.children.find((e) => {
        return e.value === item.value;
      })
    ) {
      continue;
    }
    parent.children.push({
      value: item.value,
      label: itemPath[itemPath.length - 1],
      children: [],
      path: itemPath,
    });
  }
  for (let child of parent.children) {
    recurList2Tree(child, list);
  }
  function isChild(itemPath: string[], parentPath: string[]) {
    let isChild = true;
    if (itemPath.length !== parentPath.length + 1) {
      isChild = false;
    } else {
      for (let i = 0; i < parentPath.length; i++) {
        if (itemPath[i] !== parentPath[i]) {
          isChild = false;
          break;
        }
      }
    }
    return isChild;
  }
};
/**
 * @description 构建表头
 * @returns columnProps="tableHeadRef.children"
 */
const buildHead = (props: TagSelectedItem[]) => {
  for (const item of props) {
    let head: Head = {
      children: [],
      value: item.tag.value,
      label: item.tag.value,
      path: item.tag.value.split("/"),
    };
    recurList2Tree(head, item.children);
    tableHeadRef.value.children.push(head);
  }
};
/**
 * @param props.tag_concept
 * @param props.blocks
 */
const getblocks = async () => {
  const blocksGroup = await Promise.all([
    await Promise.all(
      props.tag_concept.map(async (item) => {
        const tag = item.tag.value;
        return await queryBlocksByTag(tag);
      })
    ),
    await Promise.all(
      props.blocks.map(async (item) => {
        return await queryBlockById(item.id);
      })
    ),
  ]);
  return flatten(blocksGroup) as Block[];
};
function flatten(arr: any[]): any[] {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
  }, []);
}

const getDescendantBlocks = async (blocks: Block[]) => {
  return await Promise.all(
    blocks.map(async (block: Block) => {
      const childBlocks = await queryDescendantBlocks(block);
      return {
        childBlocks: childBlocks,
        nameBlock: block,
      };
    })
  );
};
//主程序入口
const submit = async () => {
  loading.value = true;
  //清空
  tableHeadRef.value = {
    value: "",
    label: "",
    children: [],
    path: [],
  };
  tableDataRef.value = [];

  console.log(props);
  //构建表头
  /*
  //去重
  let tags: string[] = [];
  let propDeduplication: TagSelectedItem[] = [];
  for (let item of props.tag_concept) {
    if (item.tag.value === "") {
      continue;
    }
    if (tags.indexOf(item.tag.value) !== -1) {
      continue;
    }
    tags.push(item.tag.value);
    propDeduplication.push(item);
  }*/
  let propList: AutocompleteItem[] = [];
  if (props.isContainsTagChild) {
    buildHead(props.tag_concept);
    for (let tag of props.tag_concept) {
      propList = propList.concat(tag.children);
    }
  }
  buildHead(props.tag_property);
  for (let tag of props.tag_property) {
    propList.push(tag.tag);
    propList = propList.concat(tag.children);
  }
  console.log("propList", propList);
  //构建表格主体
  const nameBlocks = await getblocks();
  const childBlocks = await getDescendantBlocks(nameBlocks);
  /*
  第一列为名称，值为tag所在block的content
  其余列根据tag表示的属性，分别从后代block中查找*/
  for (const block of childBlocks) {
    let data: Data = {
      name: block.nameBlock.content,
    };
    for (let prop of propList) {
      /*查找到的block需满足以下条件
        - 自上向下查询，排除列表块
        - 容器块优先：第一个子块包含属性标签
        - 未找到符合条件容器块，使用段落块
       */
      let propBlock = block.childBlocks.find((e) => {
        return e.fcontent.indexOf(prop.value) > -1 && e.type !== "l";
      });
      if (!propBlock) {
        propBlock = block.childBlocks.find((e) => {
          return e.content.indexOf(prop.value) > -1 && e.type == "p";
        });
      }
      if (propBlock) {
        data[prop.value] = propBlock.id;
      }
    }
    tableDataRef.value.push(data);
  }

  console.log(tableDataRef.value);
  loading.value = false;
};
defineExpose({
  submit,
});
</script>
