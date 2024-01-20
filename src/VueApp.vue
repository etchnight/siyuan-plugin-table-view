<template>
  <el-form :inline="true">
    <el-form-item v-for="(domain, index) in tagDomains">
      <SelectTag v-model="tagDomains[index]" />
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
  <el-row>
    <el-col :span="24">
      <TableData_Tag :tags="tagDomains" />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Delete, Plus } from "@element-plus/icons-vue";
import SelectTag from "./components/SelectTag.vue";
import TableData_Tag, { TagSelectedItem } from "./components/TableData_Tag.vue";
const tagDomains = ref<TagSelectedItem[]>([
  {
    tag: {
      value: "",
    },
    children: [],
  },
]);

const addTagDomain = () => {
  tagDomains.value.push({
    tag: {
      value: "",
    },
    children: [],
  });
};
const removeTagDomain = (index: number) => {
  tagDomains.value.splice(index, 1);
};
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
