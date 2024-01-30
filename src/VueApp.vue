<template>
  <el-steps
    :active="step"
    finish-status="success"
    simple
    style="margin-top: 20px"
  >
    <el-step title="查找概念" />
    <el-step title="查找属性" />
  </el-steps>
  <!--step 0 查找概念-->
  <el-form v-if="!step">
    <SelectTagFormItem v-model="tag_concept" :label="'含有右侧标签的块'" />
    <el-form-item label="右侧指定块">
      <SelectBlock v-model="block" />
    </el-form-item>
  </el-form>
  <!--step 1 查找属性-->
  <el-form v-if="step">
    <el-form-item label="上一步选定标签的子标签">
      <el-switch v-model="isContainsTagChild" />
    </el-form-item>
    <el-form-item>
      <SelectTagFormItem v-model="tag_property" :label="'含有右侧标签的块'" />
    </el-form-item>
    <el-form-item label="使用右侧分隔符号">
      <el-col :span="2">
        <el-input v-model="splitFlag" />
      </el-col>
    </el-form-item>
  </el-form>
  <!--步骤按钮-->
  <el-row>
    <el-col :span="12">
      <el-button style="margin-top: 12px" @click="previoStep">上一步</el-button>
      <el-button style="margin-top: 12px" @click="nextStep">{{
        nextText
      }}</el-button>
    </el-col>
  </el-row>
  <!--展示区域-->
  <el-row>
    <el-col :span="24">
      <TableData :tags="tag_concept" ref="TableData_Tag_Ref" />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SelectTagFormItem from "./components/SelectTagFormItem.vue";
import SelectBlock, { BlockAC } from "./components/SelectBlock.vue";
import TableData, { TagSelectedItem } from "./components/TableData.vue";
//*步骤条
const step = ref(0);
const nextText = ref("下一步");
const nextStep = () => {
  if (step.value == 0) {
    step.value++;
    nextText.value = "生成";
  } else {
    submit();
    step.value = 2;
  }
};
const previoStep = () => {
  if (step.value > 0) {
    step.value = 0;
    nextText.value = "下一步";
  }
};
const TableData_Tag_Ref = ref<InstanceType<typeof TableData>>();
const submit = () => {
  TableData_Tag_Ref.value?.submit();
};

//*step 0 查找概念
const tag_concept = ref<TagSelectedItem[]>([]);
const block = ref<{ block: BlockAC }>();
//*step 1 查找属性
const tag_property = ref<TagSelectedItem[]>([]);
const isContainsTagChild = ref(true);
const splitFlag = ref("：");
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
