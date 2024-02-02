<template>
  <el-steps
    :active="step"
    finish-status="success"
    simple
    style="margin-top: 20px"
  >
    <el-step title="查找概念" />
    <el-step title="查找属性" />
    <el-step title="附加项" />
  </el-steps>
  <!--step 0 查找概念-->
  <el-form v-if="step === 0" label-width="150px">
    <el-form-item label="含有右侧标签的块">
      <SelectTagFormItem v-model="tag_concept" #default="{ item, index }">
        <selectTag
          :item="(item as TagSelectedItem)"
          :index="index"
          @update="
            (item) => {
              tag_concept[index] = item;
            }
          "
        ></selectTag>
      </SelectTagFormItem>
    </el-form-item>
    <el-form-item label="右侧指定块">
      <SelectTagFormItem
        v-model="(blocks as BlockAC[])"
        #default="{ item, index }"
      >
        <SelectBlock
          :item="item"
          :index="index"
          @update="
            (item) => {
              blocks[index] = item;
            }
          "
        ></SelectBlock>
      </SelectTagFormItem>
    </el-form-item>
  </el-form>
  <!--step 1 查找属性-->
  <el-form v-if="step === 1" label-width="200px">
    <el-form-item label="上一步选定标签的子标签">
      <el-switch v-model="isContainsTagChild" />
    </el-form-item>
    <el-form-item label="含有右侧标签及其子标签的块">
      <SelectTagFormItem v-model="tag_property" #default="{ item, index }">
        <selectTag
          :item="(item as TagSelectedItem)"
          :index="index"
          @update="
            (item) => {
              tag_property[index] = item;
            }
          "
        ></selectTag>
      </SelectTagFormItem>
    </el-form-item>
    <el-form-item label="使用右侧分隔符号">
      <el-col :span="2">
        <el-input v-model="splitFlag" />
      </el-col>
    </el-form-item>
  </el-form>
  <el-form v-if="step > 1">
    <el-form-item label="仅在单元格中显示带有右侧标签的块">
      <selectTag
        ref="filterTag_Comp"
        :item="filterTag"
        @update="
          (item) => {
            filterTag = item;
          }
        "
      >
      </selectTag>
      <el-button
        v-if="filterTag_Comp"
        :icon="RefreshRight"
        type="info"
        circle
        @click="filterTag_Comp.reSelect"
      />
    </el-form-item>
  </el-form>
  <!--步骤按钮-->
  <el-row>
    <el-col :span="12">
      <el-button style="margin-top: 12px" @click="previoStep" v-if="step">
        上一步
      </el-button>
      <el-button style="margin-top: 12px" @click="nextStep">{{
        nextText
      }}</el-button>
    </el-col>
  </el-row>
  <!--展示区域-->
  <el-row>
    <el-col :span="24">
      <TableData
        ref="TableData_Tag_Ref"
        :tag_concept="tag_concept"
        :blocks="(blocks as BlockAC[])/** todo 提示类型不同，未知错误 */"
        :tag_property="tag_property"
        :isContainsTagChild="isContainsTagChild"
        :splitFlag="splitFlag"
        :filterTag="filterTag"
      />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SelectTagFormItem from "./components/SelectTagFormItem.vue";
import selectTag, { TagSelectedItem } from "./components/SelectTag.vue";
import SelectBlock, { BlockAC } from "./components/SelectBlock.vue";
import TableData from "./components/TableData.vue";
import { RefreshRight } from "@element-plus/icons-vue";

//*步骤条
const step = ref(0);
const nextText = ref("下一步");
const nextStep = () => {
  switch (step.value) {
    case 0:
      step.value++;
      break;
    case 1:
      step.value++;
      nextText.value = "生成";
      break;
    case 2:
      step.value++;
      TableData_Tag_Ref.value?.submit();
      break;
    case 3:
      TableData_Tag_Ref.value?.submit();
  }
};
const previoStep = () => {
  switch (step.value) {
    case 1:
      step.value--;
      break;
    case 2:
      step.value--;
      break;
    case 3:
      step.value--;
      step.value--;
      nextText.value = "下一步";
  }
  step.value > 1 ? step.value-- : null;
  step.value === 3 ? step.value-- : null; //是的，再减一次
  nextText.value = "下一步";
};

//*提交
const TableData_Tag_Ref = ref<InstanceType<typeof TableData>>();

//*step 0 查找概念
const tag_concept = ref<TagSelectedItem[]>([]);
const blocks = ref<BlockAC[]>([]);
//*step 1 查找属性
const tag_property = ref<TagSelectedItem[]>([]);
const isContainsTagChild = ref(true);
const splitFlag = ref("：：");
//*step 2 附加项
const filterTag = ref<TagSelectedItem>();
const filterTag_Comp = ref<InstanceType<typeof selectTag>>();
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
