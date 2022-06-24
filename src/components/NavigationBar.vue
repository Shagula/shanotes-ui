<template>
  <div id="main">
    <el-menu :default-active="$route.path" class="el-menu-demo" :ellipsis="false" router mode="horizontal">
      <el-menu-item :route="{path:'/home/notes'}">日记本</el-menu-item>
      <el-menu-item index="2">图床</el-menu-item>
      <el-menu-item index="3">小工具</el-menu-item>
      <div class="flex-grow" />
      <el-sub-menu index="4">
        <template #title>用户</template>
        <el-menu-item index="4-0">个人主页</el-menu-item>
        <el-menu-item index="4-1">退出登录</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>
<script>

export default {

}

</script>

<style scoped>
#main {
  margin: 0 auto;
  margin-left: 250px;
  margin-right: 200px;
}
.flex-grow {
  flex-grow: 1;
}
</style>