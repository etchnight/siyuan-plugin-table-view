<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    border="true"
  >
    <el-table-column
      prop="name"
      label="名称"
      resizable="true"
      fixed="left"
      align="center"
    />
    <TableColumn v-for="prop in props.columnProps" :child="prop"> </TableColumn>
  </el-table>
</template>
<script lang="ts" setup>
import TableColumn from "./TableColumn.vue";
const props = defineProps<{
  tableData: Data[];
  columnProps: Head[];
  loading: boolean;
}>();
/**
 * @param children 预留，树形数据（子行）
 * @param prop-任意字段 prop表示标签名，值为id
 */
export interface Data {
  name: string;
  children?: Data[];//
  [prop: string]: string | Data[]; 
}
export interface Head {
  value: string; //用来跟body部分进行匹配
  label: string; //显示的名称
  children: Head[];
  path: string[];
}
</script>
