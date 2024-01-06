<template>
  <el-table
    v-loading="loading"
    :data="tableDataRef"
    style="width: 100%"
    border="true"
  >
    <el-table-column prop="name" label="名称" resizable="true" />
    <el-table-column
      v-for="prop in props.columnProps"
      :prop="prop.value"
      :label="prop.value.replace(tag + '/', '')"
      resizable="true"
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
import { ref, watch } from "vue";
import protyle from "./protyle.vue";
import { Link } from "@element-plus/icons-vue";
import {
  queryBlocksByTag,
  queryDescendantBlocks,
} from "../../lib/siyuanPlugin-common/siyuan-api/query";
import { Block } from "../../lib/siyuanPlugin-common/types/siyuan-api";
//import { Timer } from '@element-plus/icons-vue'

const props = defineProps<{
  tag: string;
  columnProps: any[];
}>();

interface Data {
  name: string;
  [prop: string]: string; //prop表示标签名，值为id
}

//let tableDate = [];
const tableDataRef = ref([]);
const loading = ref(false);

//?是否可以不用watch
//主程序入口
watch(props, async (newProps) => {
  loading.value = true;
  let tag = newProps.tag;
  let columnProps = newProps.columnProps;
  const nameBlocks = await queryBlocksByTag(tag);
  /*构建表格主体
  第一列为名称，值为tag所在block的content
  其余列根据tag表示的属性，分别从后代block中查找*/
  tableDataRef.value = await Promise.all(
    nameBlocks.map(async (block: Block) => {
      let data: Data = {
        //todo 简单去除方法，未考虑行内代码等包含标签关键字情况
        name: block.content.replace("#" + tag + "#", ""),
      };
      const childBlocks = await queryDescendantBlocks(block);
      for (let prop of columnProps) {
        let propBlock = childBlocks.find((e) => {
          return (
            e.content.indexOf(prop.value) > -1 && e.layer !== 0 && e.type != "l"
          );
        });
        if (propBlock) {
          data[prop.value] = propBlock.id;
        }
      }
      return data;
    })
  );
  loading.value = false;
});
</script>
