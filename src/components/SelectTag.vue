<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    :placeholder="'输入查询，选择确认'"
    @select="handleSelect"
    :disabled="model.tag.value !== ''"
  >
  </el-autocomplete>
  <!--<el-icon class="is-loading" v-if="loading"><Loading /></el-icon>-->
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { searchTag } from "../../lib/siyuanPlugin-common/siyuan-api/search";
//import { Loading } from "@element-plus/icons-vue";

const state = ref("");
const model = defineModel<{
  tag: TagItem;
  children: TagItem[];
}>();
//const tagsRef = ref([]);
let tags: TagItem[] = [];

export interface TagItem {
  value: string; //由于autocomplete组件的原因，返回值必须含有value字段
}

/**
 * @description 由于autocomplete组件的原因，返回值必须含有value字段
 */
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

const handleSelect = (item: TagItem) => {
  //disableInput.value = true;
  let children = tags.filter((tag) => {
    return tag.value.indexOf(item.value) === 0 && tag.value !== item.value;
  });
  //emit("tagSelected", item, children);
  model.value = {
    tag: item,
    children: children,
  };
};
</script>
