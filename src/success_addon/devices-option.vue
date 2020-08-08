<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      test: "",
    }
  },
  methods: {
    dis() {
      layer.confirm(
        "确认下线吗?",
        { icon: 3, title: "下线确认", shadeClose: true },
        (index) => {
          layer.msg("设备已下线", { icon: 1, time: 400 })
          layer.close(index)
        }
      )
    },
  },
}
</script>

<style>
</style>