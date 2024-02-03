<template>
  <!--复制自行内引用查询-->
  <button
    style="width: calc(100% - 16px)"
    class="b3-list-item b3-list-item--two"
  >
    <!--!注意以下属性已修改（多行显示）-->
    <div class="b3-list-item__first">
      <svg
        class="b3-list-item__graphic popover__block"
        :data-id="props.item.id"
        style="position: absolute; margin-top: 8px; top: 0px"
      >
        <use
          :xlink:href="'#' + getIconByType(props.item.type, props.item.subType)"
        ></use>
      </svg>
      <span
        class="b3-list-item__text"
        v-html="item.content"
        style="display: block; white-space: normal; margin-left: 20px"
      ></span>
    </div>
    <!--↑↑↑注意属性已修改（多行显示）↑↑↑-->
    <!--!注意将命名等移动至了底端-->
    <div
      class="fn__flex b3-list-item__meta b3-list-item__showall"
      v-if="props.item.name || props.item.alias || props.item.memo"
    >
      <span class="fn__flex" v-if="props.item.name">
        <svg class="b3-list-item__hinticon">
          <use xlink:href="#iconN"></use>
        </svg>
        <span v-html="props.item.name"></span>
      </span>
      <span class="fn__space"></span>
      <span class="fn__flex" v-if="props.item.alias">
        <svg class="b3-list-item__hinticon">
          <use xlink:href="#iconA"></use>
        </svg>
        <span v-html="props.item.alias"></span>
      </span>
      <span class="fn__space"></span>
      <span class="fn__flex" v-if="props.item.memo">
        <svg class="b3-list-item__hinticon">
          <use xlink:href="#iconM"></use>
        </svg>
        <span v-html="props.item.memo"></span>
      </span>
    </div>
    <div class="b3-list-item__meta b3-list-item__showall">
      {{ props.item.hPath }}
    </div>
  </button>
</template>
<script setup lang="ts">
import { getIconByType } from "../../lib/siyuanPlugin-common/common";
import { FullTextSearchBlockResult } from "../../lib/siyuanPlugin-common/siyuan-api/search";

const props = defineProps<{
  item: FullTextSearchBlockResult;
}>();
</script>
