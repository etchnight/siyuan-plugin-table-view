<template>
  <el-row>
    <el-col :span="24">
      <SelectTag
        @tagSelected="
          (tag, tagChildren) => {
            selectedTag = tag;
            selectedTagChildren = tagChildren;
          }
        "
      />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <TableData_Tag
        :tag="selectedTag.value"
        :tagChildren="selectedTagChildren"
      />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24"> <div id="protyle"></div> </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SelectTag from "./components/SelectTag.vue";
import TableData_Tag from "./components/TableData_Tag.vue";

const selectedTag = ref({ value: "没有标签" });
const selectedTagChildren = ref([]);
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
