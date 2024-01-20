<template>
  <el-autocomplete
    v-model="model.tag.value"
    :fetch-suggestions="querySearchAsync"
    :placeholder="placeholderText"
    @select="handleSelect"
    :disabled="model.tag.value !== '' || loading"
  >
  </el-autocomplete>
  <el-icon class="is-loading" v-if="loading"><Loading /></el-icon>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { searchTag } from "../../lib/siyuanPlugin-common/siyuan-api/search";
import { Loading } from "@element-plus/icons-vue";

const model = defineModel<{
  tag: TagItem;
  children: TagItem[];
}>();
const loading = ref(true);
const tagsRef = ref([]);
/*const emit = defineEmits<{
  tagSelected: [tag: TagItem, children: TagItem[]]; // 具名元组语法
}>();*/
const placeholderText = ref("正在加载标签");

export interface TagItem {
  value: string; //由于autocomplete组件的原因，返回值必须含有value字段
}

/**
 * @description 由于autocomplete组件的原因，返回值必须含有value字段
 * @param queryString
 * @param cb
 */
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString
    ? tagsRef.value.filter(createFilter(queryString))
    : tagsRef.value;
  cb(results);
};
const createFilter = (queryString: string) => {
  return (tag: TagItem) => {
    return tag.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};

const handleSelect = (item: TagItem) => {
  //disableInput.value = true;
  let children = tagsRef.value.filter((tag) => {
    return tag.value.indexOf(item.value) === 0 && tag.value !== item.value;
  });
  //emit("tagSelected", item, children);
  model.value = {
    tag: item,
    children: children,
  };
};
//加载标签
onMounted(async () => {
  placeholderText.value = "正在加载标签";
  loading.value = true;
  let tags = [];
  if (model.value.tag.value === "") {
    const res = await searchTag("");
    for (let tag of res.tags) {
      tags.push({
        value: tag,
      });
    }
    tagsRef.value = tags;
  }
  loading.value = false;
  placeholderText.value = "请输入标签";
});
</script>
