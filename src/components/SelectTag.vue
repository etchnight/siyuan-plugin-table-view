<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    :placeholder="'输入查询，选择确认'"
    @select="handleSelect"
    :disabled="selected"
  >
  </el-autocomplete>
  <!--<el-icon class="is-loading" v-if="loading"><Loading /></el-icon>-->
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { searchTag } from "../../lib/siyuanPlugin-common/siyuan-api/search";
//import { Loading } from "@element-plus/icons-vue";
export interface TagSelectedItem {
  tag: AutocompleteItem;
  children: AutocompleteItem[];
}

const state = ref("");
const selected = ref(false);
const emit = defineEmits<{
  (e: "update", item: TagSelectedItem);
}>();
//const tagsRef = ref([]);
let tags: AutocompleteItem[] = [];
/**
 * @description 由于autocomplete组件的原因，返回值必须含有value字段
 */
export interface AutocompleteItem {
  value: string;
}

const querySearchAsync = async (
  queryString: string,
  cb: (arg: any) => void
) => {
  tags = [];
  const res = await searchTag(queryString);
  for (let html of res.tags) {
    tags.push({
      value: html.replace(/<mark>(.*?)<\/mark>/g, "$1"),
    });
  }
  cb(tags);
};

const handleSelect = (item: AutocompleteItem) => {
  //disableInput.value = true;
  let children = tags.filter((tag) => {
    return tag.value.indexOf(item.value + "/") === 0;
  });
  emit("update", {
    tag: item,
    children: children,
  });
  selected.value = true;
};

const reSelect = () => {
  selected.value = false;
  state.value = null;
  emit("update", null);
};
defineExpose({
  reSelect,
});
</script>
