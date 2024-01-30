<template>
  <el-form :inline="true">
    <el-form-item label="含有右侧标签的块"> </el-form-item>
    <el-form-item v-for="(domain, index) in tagDomain">
      <SelectTag v-model="tagDomain[index]" />
      <el-button
        :icon="Delete"
        type="info"
        circle
        @click.prevent="removeTagDomain(index)"
      />
    </el-form-item>
    <el-form-item>
      <el-button :icon="Plus" type="info" circle @click="addTagDomain" />
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { Delete, Plus } from "@element-plus/icons-vue";
import SelectTag from "./SelectTag.vue";
import { TagSelectedItem } from "./TableData.vue";

const tagDomain = defineModel<TagSelectedItem[]>();

const addTagDomain = () => {
  tagDomain.value.push({
    tag: {
      value: "",
    },
    children: [],
  });
};
const removeTagDomain = (index: number) => {
  tagDomain.value.splice(index, 1);
};
</script>
