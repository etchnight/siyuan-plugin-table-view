<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    :placeholder="'输入查询，选择确认'"
    @select="handleSelect"
    popper-class="protyle-hint b3-list b3-list--background block-autocomplete"
    :disabled="selected"
    value-key="contentCleared"
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
import { AutocompleteItem } from "./SelectTag.vue";
const state = ref("");
const selected = ref(false);
const emit = defineEmits<{
  (e: "update", block: BlockAC): void;
}>();
//const tagsRef = ref([]);
let blocks: BlockAC[] = [];

export type BlockAC = FullTextSearchBlockResult &
  AutocompleteItem & {
    contentCleared: string;
  };

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
    ESearchOrderBy.类型,
    ESearchGroupBy.不分组
  );
  const sortSubTypeList = ["h1", "h2", "h3", "h4", "h5", "h6"];
  const sortFun = (e: string) => {
    return sortSubTypeList.indexOf(e) < 0
      ? sortSubTypeList.length + 1
      : sortSubTypeList.indexOf(e);
  };
  res.blocks.sort((a, b) => {
    return sortFun(a.subType) - sortFun(b.subType);
  });
  for (let block of res.blocks) {
    blocks.push({
      ...block,
      value: block.id,
      contentCleared: block.content.replace(/<mark>(.*?)<\/mark>/, "$1"),
    });
  }
  cb(blocks);
};

const handleSelect = (item: BlockAC) => {
  emit("update", item);
  selected.value = true;
};
</script>

<style>
.block-autocomplete.b3-list.protyle-hint.el-popper {
  width: 50% !important; /**todo 计算方式 */
}
</style>
