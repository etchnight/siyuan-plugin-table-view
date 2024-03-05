<template>
  <el-table-column
    :prop="props.child.value"
    :label="props.child.label"
    resizable="true"
    header-align="center"
    v-if="props.child.children.length == 0"
  >
    <!--单元格内容-->
    <template #default="scope">
      <div v-if="scope.row[props.child.value]">
        <el-link
          type="info"
          :href="`siyuan://blocks/` + scope.row[props.child.value]"
          :icon="Link"
        />
        <protyle
          :id="scope.row[props.child.value]"
          :removeContent="props.child"
        ></protyle>
      </div>
    </template>
  </el-table-column>
  <el-table-column
    v-else
    :prop="props.child.value"
    :label="props.child.label"
    resizable="true"
    header-align="center"
  >
    <!--树形结构-->
    <TableColumn
      v-for="descendant of props.child.children"
      :child="descendant"
    ></TableColumn>
  </el-table-column>
</template>
<script lang="ts" setup>
import protyle from "./protyle.vue";
//import { ref } from "vue";
//import { TreeTools } from "../../lib/js-utility-function/src/tree";
import { Link } from "@element-plus/icons-vue";
import { Head } from "./Table.vue";
const props = defineProps<{
  child: Head;
}>();

</script>
