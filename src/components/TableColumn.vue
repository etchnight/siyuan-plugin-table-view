<template>
  <el-table-column
    :prop="props.child.value"
    :label="props.child.label"
    resizable="true"
    header-align="center"
    v-if="props.child.children.length == 0"
  >
    <template #default="scope">
      <div v-if="scope.row[props.child.value]">
        <el-link
          type="info"
          :href="`siyuan://blocks/` + scope.row[props.child.value]"
          :icon="Link"
        />
      </div>
      <protyle :id="scope.row[props.child.value]"></protyle>
    </template>
  </el-table-column>
  <el-table-column
    v-else
    :prop="props.child.value"
    :label="props.child.label"
    resizable="true"
    header-align="center"
  >
    <TableColumn
      v-for="descendant of props.child.children"
      :child="descendant"
    ></TableColumn>
  </el-table-column>
</template>
<script lang="ts" setup>
import protyle from "./protyle.vue";
import { Link } from "@element-plus/icons-vue";
import { Head } from "./Table.vue";
import { onMounted } from "vue";
const props = defineProps<{
  child: Head;
}>();
onMounted(() => {
  console.log(props.child);
});
</script>
