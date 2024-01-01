<template>
  <el-row>
    <el-col :span="6">
      <SelectTag
        @tagSelected="
          (item, children) => {
            selectedTag = item;
            columnProps = children;
          }
        "
      />
    </el-col>
    <el-col :span="6">
      {{ selectedTag.value }}
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <Table :tag="selectedTag.value" :columnProps="columnProps" />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24"> <div id="protyle"></div> </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SelectTag from "./components/SelectTag.vue";
import Table from "./components/Table.vue";

const selectedTag = ref({ value: "没有标签" });
const columnProps = ref([]);
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
