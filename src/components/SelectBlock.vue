<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    :placeholder="'输入查询，选择确认'"
    @select="handleSelect"
    popper-class="protyle-hint b3-list b3-list--background block-autocomplete"
  >
    <template #default="{ item }">
      <SearchRefBlockItem :item="item" />
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SearchRefBlockItem from "./SearchRefBlockItem.vue";
import {
  fullTextSearchBlock,
  ESearchMethod,
  ISearchTypes,
  ESearchGroupBy,
  ESearchOrderBy,
  FullTextSearchBlockResult,
} from "../../lib/siyuanPlugin-common/siyuan-api/search";
const state = ref("");
const model = defineModel<{
  block: BlockAC;
}>();
//const tagsRef = ref([]);
let blocks: BlockAC[] = [];

export interface TagItem {
  value: string; //由于autocomplete组件的原因，返回值必须含有value字段
}
export type BlockAC = FullTextSearchBlockResult & TagItem;
model.value?.block?.hPath;

/**
 * @description 由于autocomplete组件的原因，返回值必须含有value字段
 */
const querySearchAsync = async (
  queryString: string,
  cb: (arg: any) => void
) => {
  blocks = [];
  let types: ISearchTypes = {
    blockquote: false,
    codeBlock: false,
    document: true,
    embedBlock: false,
    heading: true,
    htmlBlock: false,
    list: false,
    listItem: false,
    mathBlock: false,
    paragraph: true,
    superBlock: false,
    table: false,
  };
  const res = await fullTextSearchBlock(
    queryString,
    ESearchMethod.keyword,
    types,
    [],
    ESearchOrderBy.按相关度降序,
    ESearchGroupBy.不分组
  );
  for (let block of res.blocks) {
    blocks.push({
      ...block,
      value: block.id,
    });
  }
  cb(blocks);
};

const handleSelect = (item: BlockAC) => {
  model.value = {
    block: item,
  };
};
</script>

<style>
.block-autocomplete.b3-list.protyle-hint.el-popper {
  width: 50% !important; /**todo 计算方式 */
}
</style>
