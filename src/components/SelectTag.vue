<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    placeholder="输入标签"
    @select="handleSelect"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { searchTag } from "../../lib/siyuanPlugin-common/siyuan-api/search";

const state = ref("");
//let tags = [];
const tagsRef = ref([]);
const emit = defineEmits(["tagSelected"]);

interface TagItem {
  value: string;
}
const loadAll = async () => {
  const res = await searchTag("");
  let tags = [];
  for (let tag of res.tags) {
    tags.push({
      value: tag,
    });
  }
  return tags;
};

//let timeout: ReturnType<typeof setTimeout>;
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

const handleSelect = (item: Record<string, any>) => {
  let children = tagsRef.value.filter((tag) => {
    return tag.value.indexOf(item.value) === 0 && tag.value !== item.value;
  });
  emit("tagSelected", item, children);
};

onMounted(async () => {
  tagsRef.value = await loadAll();
});
</script>
