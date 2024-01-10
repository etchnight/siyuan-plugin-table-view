<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    style="width: 100%"
    border="true"
  >
    <el-table-column
      prop="name"
      label="名称"
      resizable="true"
      fixed="left"
      align="center"
    />
    <TableColumn v-for="prop in props.columnProps" :child="prop">
    </TableColumn>
  </el-table>
</template>
<script lang="ts" setup>
import TableColumn from "./TableColumn.vue"
const props = defineProps<{
  tableData: Data[];
  columnProps: Head[];
  loading: boolean;
}>();

export interface Data {
  name: string;
  children?: Data[];
  [prop: string]: string | Data[]; //prop表示标签名，值为id
}

export interface Head {
  value: string;
  label: string;
  children: Head[];
}
</script>
