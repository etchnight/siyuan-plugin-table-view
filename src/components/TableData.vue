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
import { TreeTools } from "../../lib/js-utility-function/src/tree";
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
  filterTag: TagSelectedItem;
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
const treeTools = new TreeTools({
  id: "id",
  pid: "parentID",
  children: "childrem",
});
/**
 * - 查找标签时，仅在该列表类型的content中搜索
 * - fcontent搜索不受影响
 */
const blockType_FindIn = ["p", "h"];
const buildPropNameTree = (parent: Head, list: { value: string }[]) => {
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
    buildPropNameTree(child, list);
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
const buildHead = (props: TagSelectedItem[], splitFlag?: string) => {
  splitFlag = splitFlag || "/";
  for (const item of props) {
    let head: Head = {
      children: [],
      value: item.tag.value,
      label: item.tag.value,
      path: item.tag.value.split(splitFlag),
    };
    buildPropNameTree(head, item.children);
    tableHeadRef.value.children.push(head);
  }
};
/**
 * @param props.tag_concept
 * @param props.blocks
 */
const getNameBlocks = async () => {
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

type DescendantBlockGroup = {
  children: (Block & {
    layer: number;
  })[];
  nameBlock: Block;
};
const getDescendantBlocks = async (
  blocks: Block[]
): Promise<DescendantBlockGroup[]> => {
  return await Promise.all(
    blocks.map(async (block: Block) => {
      const childBlocks = await queryDescendantBlocks(block);
      return {
        children: childBlocks,
        nameBlock: block,
      };
    })
  );
};
/**
 * @description 查找到的block需满足以下条件
        - 自上向下查询，排除列表块
        - 容器块优先：第一个子块包含属性标签
        - 未找到符合条件容器块，使用段落块
 * @param block
 * @param prop
 */
const getPropBlock = (block: DescendantBlockGroup, prop: string) => {
  /*
   */
  let propBlock = block.children.find((e) => {
    return e.fcontent.indexOf(prop) > -1 && e.type !== "l";
  });
  if (!propBlock) {
    propBlock = block.children.find((e) => {
      return e.content.indexOf(prop) > -1 && blockType_FindIn.includes(e.type);
    });
  }
  return propBlock;
};
type DescendantBlockTree = {
  nameBlock: Block;
  children: DescendantBlockTree[];
};

/**
 * @param parent 通过迭代修改
 * 经过精简，仅含有带有属性的块
 */
const buildDescendantBlockTree = (
  blocks: (Block & {
    layer: number;
  })[],
  parent: DescendantBlockTree,
  splitFlag?: string
) => {
  //childBlocks
  let childBlocks = blocks.filter((e) => {
    return (
      (e.fcontent.indexOf(splitFlag) > 0 ||
        (e.content.indexOf(splitFlag) > 0 &&
          blockType_FindIn.includes(e.type)) ||
        !splitFlag) && //无分隔符号直接满足
      e.parent_id === parent.nameBlock.id &&
      e.content !== parent.nameBlock.fcontent //排除第一个子块（其父级是属性块）,一个内容只算一次
    );
  });
  parent.children = childBlocks.map((e) => {
    return {
      nameBlock: e,
      children: [],
    };
  });
  for (let block of parent.children) {
    buildDescendantBlockTree(blocks, block, splitFlag);
  }
};
/**
 * @description 剔除列表块，将其子项全部挂到列表块的父级
 * @param blocks
 */
const rebuildChildrenBlockList = (
  blocks: (Block & {
    layer: number;
  })[]
) => {
  let newBlocks: (Block & {
    layer: number;
  })[] = [];
  for (let block of blocks) {
    if (block.type === "l") {
      continue;
    }
    let parent = blocks.find((p) => {
      return p.id === block.parent_id;
    });
    let blockClone = JSON.parse(JSON.stringify(block)) as Block & {
      layer: number;
    };

    if (parent?.type === "l") {
      blockClone.parent_id = parent.parent_id;
    }
    newBlocks.push(blockClone);
  }
  return newBlocks;
};

/**
 * @param parentHead Head类型
 *  - 通过迭代更改
 *  - 应将最终结果的children与tableHeadRef合并
 *  - 根对象是虚拟的，对应的是概念块（而非属性块）
 * @param props.splitFlag 隐含变量
 * @param data blockTree.nameBlock所在行，通过迭代更改
 */
const desBlockTree2TDataAndHead = (
  blockTree: DescendantBlockTree,
  parentHead: Head,
  data: Data
) => {
  for (let block of blockTree.children) {
    const reg = new RegExp(`(${props.splitFlag}).*`);
    let prop = block.nameBlock.content.replace(reg, "");
    let propValue = parentHead.value + prop + props.splitFlag;
    let child: Head = {
      value: propValue,
      label: prop,
      path: parentHead.path.concat(prop),
      children: [],
    };
    if (
      !parentHead.children.find((e) => {
        return e.value === propValue;
      })
    ) {
      parentHead.children.push(child);
    }
    data[propValue] = block.nameBlock.id;
    desBlockTree2TDataAndHead(block, child, data);
  }
};

type Tree = {
  [key: string]: any;
  children: Tree[];
};
function findInTree(tree: Tree, callback: (e: Tree) => boolean) {
  if (callback(tree)) {
    return tree;
  }
  let result: Tree;
  for (let child of tree.children) {
    result = findInTree(child, callback);
    if (result) {
      break;
    }
  }
  return result;
}
/**
 * @param blockData 通过迭代修改
 */
const dataFilter = (
  desBlockTree: DescendantBlockTree,
  blockData: Data,
  filterTag: TagSelectedItem
) => {
  for (let prop in blockData) {
    if (prop === "name") {
      continue;
    }
    const blockInTree = findInTree(desBlockTree, (e: DescendantBlockTree) => {
      return e.nameBlock.id === blockData[prop];
    }) as DescendantBlockTree;
    const newBlock = blockInTree.children.find((e) => {
      return e.nameBlock.content.indexOf(filterTag.tag.value) > -1;
    });
    if (newBlock) {
      blockData[prop] = newBlock.nameBlock.id;
    }
  }
};
/**
 * @description 主程序入口
 */
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

  //构建行
  const nameBlocks = await getNameBlocks();
  const nameAndChildBlocks = await getDescendantBlocks(nameBlocks);

  //构建表头（列）
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
  /*构建主体，行列对应
  - 第一列为名称，值为概念标识所在block的content
  其余列根据tag表示的属性，分别从后代block中查找*/
  /**
   * 分隔符号属性树全局只有一个；
   * 分隔符号概念数量与概念块数量相同
   */
  let propRoot: Head = {
    value: "",
    label: "",
    path: [],
    children: [],
  };
  for (const nameBlockObj of nameAndChildBlocks) {
    let data: Data = {
      name: nameBlockObj.nameBlock.content,
    };
    for (let prop of propList) {
      let propBlock = getPropBlock(nameBlockObj, prop.value);
      if (propBlock) {
        data[prop.value] = propBlock.id;
      }
    }

    //tableDataRef.value.push(data);
    let childBlocks: (Block & {
      layer: number;
    })[];
    if (props.splitFlag || props.filterTag) {
      childBlocks = rebuildChildrenBlockList(nameBlockObj.children);
    }
    //*分隔符号属性
    if (props.splitFlag) {
      let blockRoot: DescendantBlockTree = {
        nameBlock: nameBlockObj.nameBlock,
        children: [],
      };
      buildDescendantBlockTree(childBlocks, blockRoot, props.splitFlag);
      console.log(blockRoot);
      desBlockTree2TDataAndHead(blockRoot, propRoot, data);
    }

    //*数据后筛选
    if (props.filterTag) {
      let blockRoot: DescendantBlockTree = {
        nameBlock: nameBlockObj.nameBlock,
        children: [],
      };
      buildDescendantBlockTree(childBlocks, blockRoot);
      dataFilter(blockRoot, data, props.filterTag);
    }

    tableDataRef.value.push(data);
  }
  tableHeadRef.value.children = tableHeadRef.value.children.concat(
    propRoot.children
  );
  console.log("tableDataRef", tableDataRef);
  console.log("tableHeadRef", tableHeadRef);
  loading.value = false;
};
defineExpose({
  submit,
});
</script>
