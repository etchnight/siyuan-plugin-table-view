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
  <el-button style="margin-top: 12px" @click="previoStep">上一步</el-button>
  <el-button style="margin-top: 12px" @click="nextStep">{{
    nextText
  }}</el-button>
  <el-form :inline="true" v-if="!step">
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
      <TableData_Tag :tags="tagDomains" ref="TableData_Tag_Ref" />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Delete, Plus } from "@element-plus/icons-vue";
import SelectTag from "./components/SelectTag.vue";
import TableData_Tag, { TagSelectedItem } from "./components/TableData_Tag.vue";
//*步骤条
const step = ref(0);
const nextText = ref("下一步");
const nextStep = () => {
  if (step.value == 0) {
    step.value++;
    nextText.value = "生成";
  } else {
    submit();
    console.log(tagDomains.value);
    step.value = 2;
  }
};
const previoStep = () => {
  if (step.value > 0) {
    step.value = 0;
    nextText.value = "下一步";
  }
};
const TableData_Tag_Ref = ref<InstanceType<typeof TableData_Tag>>();
const submit = () => {
  console.log("ok", TableData_Tag_Ref.value);
  TableData_Tag_Ref.value?.submit();
};

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
