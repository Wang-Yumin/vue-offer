<template>
  <div class="material_container">
    <el-form @submit.native.prevent ref="form" :model="Form" size="mini">
      <!-- stretch 这个属性是让标签页居中的 -->
      <el-tabs stretch type="border-card">
        <!-- 印刷 -->
        <el-tab-pane label="平装片材">
          <List1 />
        </el-tab-pane>
        <el-tab-pane label="卷装片材">
          <span>暂无</span>
        </el-tab-pane>
        <el-tab-pane label="卷装带材">
          <span>暂无</span>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import List1 from "../Material/List1.vue";
export default {
  data() {
    return {
      Form: {}
    };
  },
  methods: {},
  components: {
    List1
  }
};
</script>

<style lang="scss" scope>
</style>