<template>
  <div>
    <div :title="'剩余'+remain+'('+percentage+')'" class="mapl-liuliang-d-background">
      <div class="mapl-liuliang-d-front" :style="{width: percentage}"></div>
    </div>
    <div class="mapl-liuliang-d-tip" v-if="isShowTip">{{remain}}可用</div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            isShowTip: false
        }
    },
    props: {
        remain: String,
        percentage: String
    }
}
</script>

<style>
.mapl-liuliang-d-background {
  width: 100px;
  background-color: rgba(255, 255, 255, 0.3);
  height: 14px;
  display: inline-block;
  border-style: solid;
  border-width: 1px;
  background-image: linear-gradient;
  position: relative;
}
.mapl-liuliang-d-front {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.51);
}
.mapl-liuliang-d-tip {
  font-size: 12px;
}
</style>