<template>
  <el-form>
    <el-form-item>
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        :placeholder="placeholderText"
        @select="handleSelect"
        :disabled="disableInput"
      >
      </el-autocomplete>
      <el-icon class="is-loading" v-if="loading"><Loading /></el-icon>
      <el-button :icon="Delete" type="info" circle @click="clearInput" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { searchTag } from "../../lib/siyuanPlugin-common/siyuan-api/search";
import { Delete, Loading } from "@element-plus/icons-vue";

const state = ref("");
const disableInput = ref(false);
const loading = ref(true);
//let tags = [];
const tagsRef = ref([]);
const emit = defineEmits(["tagSelected"]);
const placeholderText = ref("正在加载标签");

interface TagItem {
  value: string;
}
const clearInput = () => {
  state.value = "";
  disableInput.value = false;
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

const loadAll = async () => {
  placeholderText.value = "正在加载标签";
  disableInput.value = true;
  const res = await searchTag("");
  let tags = [];
  for (let tag of res.tags) {
    tags.push({
      value: tag,
    });
  }
  loading.value = false;
  disableInput.value = false;
  placeholderText.value = "请输入标签";
  return tags;
};

onMounted(async () => {
  tagsRef.value = await loadAll();
});
</script>
