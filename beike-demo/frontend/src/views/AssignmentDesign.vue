<template>
  <div class="placeholder-view">
    <el-result
      icon="info"
      title="开发中"
      sub-title="该模块正在开发中，敬请期待"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/')"
          >返回首页</el-button
        >
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.placeholder-view {
  padding: 48px;
}
</style>
