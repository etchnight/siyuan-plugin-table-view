<template>
  <el-table :data="tableDataRef" style="width: 100%">
    <el-table-column prop="name" label="名称" />
    <el-table-column
      v-for="child in props.columnProps"
      :prop="child.value"
      :label="child.value.replace(tag + '/', '')"
      width="180"
    />
  </el-table>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, watch } from "vue";

//import { Timer } from '@element-plus/icons-vue'

const props = defineProps<{
  tag: string;
  columnProps: any[];
}>();

interface Data {
  name: string;
  [prop: string]: string;
}

//let tableDate = [];
const tableDataRef = ref([]);

watch(props, async (newProps, oldProps) => {
  let tag = newProps.tag;
  let columnProps = newProps.columnProps;
  const nameBlocks = await getNameBlocks(tag);
  tableDataRef.value = await Promise.all(
    nameBlocks.map(async (block: Block) => {
      let data: Data = {
        name: block.markdown,
      };
      const childBlocks = await getChildBlocks(block);
      for (let prop of columnProps) {
        //todo 处理列表情形
        let propBlock = childBlocks.find((e) => {
          return e.markdown.indexOf(prop.value) > -1 && e.layer !== 0;
        });
        data[prop.value] = propBlock.markdown;
      }
      return data;
    })
  );
  console.log(tableDataRef);
});

const getChildBlocks = async (block: Block): Promise<Block[]> => {
  let id = "";
  if (block.type == "p") {
    id = block.parent_id;
  } else {
    id = block.id;
  }
  const res2 = await axios.post("/api/query/sql", {
    stmt: `WITH RECURSIVE
  child_of(id,parent_id,root_id,hash,box,path,hpath,name,alias,memo,tag,content,fcontent,markdown,length,type,subtype,ial,sort,created,updated,layer) AS(
    SELECT blocks.*,0  FROM blocks WHERE blocks.id='${id}'
    UNION
    SELECT blocks.*,child_of.layer+1 FROM blocks,child_of WHERE blocks.parent_id=child_of.id LIMIT 1000
    )
  SELECT * FROM child_of ORDER BY layer`,
  });
  if (res2.statusText !== "OK") {
    return [];
  }
  const blocks = res2.data.data;
  return blocks;
};

const getParentNextChildID = async (id: BlockId): Promise<BlockId> => {
  const res2 = await axios.post("/api/block/getParentNextChildID", {
    id: id,
  });
  if (res2.statusText !== "OK") {
    return "";
  }
  return res2.data.data.id;
};

const getNameBlocks = async (tag) => {
  const res = await axios.post("/api/query/sql", {
    stmt: `SELECT * FROM blocks WHERE blocks.id IN
    (SELECT spans.block_id FROM spans WHERE spans.type LIKE '%tag%' AND content='${tag}')`,
  });
  if (res.statusText !== "OK") {
    return [];
  }
  const nameBlocks = res.data.data;
  return nameBlocks;
};

type Block = {
  id: BlockId;
  parent_id?: BlockId;
  root_id: DocumentId;
  hash: string;
  box: string;
  path: string;
  hpath: string;
  name: string;
  alias: string;
  memo: string;
  tag: string;
  content: string;
  fcontent?: string;
  markdown: string;
  length: number;
  type: BlockType;
  subtype: BlockSubType;
  ial?: { [key: string]: string };
  sort: number;
  created: string;
  updated: string;
};
type BlockType =
  | "d"
  | "s"
  | "h"
  | "t"
  | "i"
  | "p"
  | "f"
  | "audio"
  | "video"
  | "other";

type BlockSubType =
  | "d1"
  | "d2"
  | "s1"
  | "s2"
  | "s3"
  | "t1"
  | "t2"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "table"
  | "task"
  | "toggle"
  | "latex"
  | "quote"
  | "html"
  | "code"
  | "footnote"
  | "cite"
  | "collection"
  | "bookmark"
  | "attachment"
  | "comment"
  | "mindmap"
  | "spreadsheet"
  | "calendar"
  | "image"
  | "audio"
  | "video"
  | "other";
type DocumentId = string;
type BlockId = string;
</script>
