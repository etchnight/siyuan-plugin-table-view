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
    <el-table-column
      v-for="prop in props.columnProps"
      :prop="prop.value"
      :label="prop.label"
      resizable="true"
      header-align="center"
    >
      <template #default="scope">
        <div v-if="scope.row[prop.value]">
          <el-link
            type="info"
            :href="`siyuan://blocks/` + scope.row[prop.value]"
            :icon="Link"
          />
        </div>
        <protyle :id="scope.row[prop.value]"></protyle>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import protyle from "./protyle.vue";
import { Link } from "@element-plus/icons-vue";

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
