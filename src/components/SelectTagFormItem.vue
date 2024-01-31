<template>
  <!--* 由于历史原因，该文件名未更改，因使用插槽，不限于tag输入框使用-->
  <el-form :inline="true">
    <el-form-item>
      <template v-for="(domain, index) in domains">
        <slot :item="domain" :index="index"></slot>
        <el-button
          :icon="Delete"
          type="info"
          circle
          @click.prevent="removeTagDomain(index)"
        />
      </template>
    </el-form-item>
    <el-form-item>
      <el-button :icon="Plus" type="info" circle @click="addTagDomain" />
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { Delete, Plus } from "@element-plus/icons-vue";
import { BlockAC } from "./SelectBlock.vue";
import { TagSelectedItem } from "./SelectTag.vue";

const domains = defineModel<(BlockAC | TagSelectedItem)[]>();

const addTagDomain = () => {
  domains.value.push(null);
};
const removeTagDomain = (index: number) => {
  domains.value.splice(index, 1);
};
</script>
