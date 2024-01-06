<template>
  <el-form>
    <el-form-item>
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        placeholder="输入标签"
        @select="handleSelect"
        :disabled="disableInput"
      >
      </el-autocomplete>
      <el-icon class="is-loading" :style="{ visibility: loading }"
        ><Loading
      /></el-icon>
      <el-button :icon="Delete" type="info" plain @click="clearInput" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { searchTag } from "../../lib/siyuanPlugin-common/siyuan-api/search";
import { Delete, Loading } from "@element-plus/icons-vue";

const state = ref("");
const disableInput = ref(false);
const loading = ref("visible");
//let tags = [];
const tagsRef = ref([]);
const emit = defineEmits(["tagSelected"]);

interface TagItem {
  value: string;
}
const clearInput = () => {
  state.value = "";
  disableInput.value = false;
};
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
  disableInput.value = true;
  let children = tagsRef.value.filter((tag) => {
    return tag.value.indexOf(item.value) === 0 && tag.value !== item.value;
  });
  emit("tagSelected", item, children);
};

onMounted(async () => {
  disableInput.value = true;
  tagsRef.value = await loadAll();
  loading.value = "hidden";
  disableInput.value = false;
});
</script>
