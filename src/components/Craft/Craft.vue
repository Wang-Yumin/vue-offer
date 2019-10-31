<template>
  <div class="craft_container">
    <el-form @submit.native.prevent ref="form" :model="Form" size="mini">
      <!-- <el-form-item> -->
      <!-- stretch 这个属性是让标签页居中的 -->
      <el-tabs stretch type="border-card">
        <!-- 印刷 -->
        <el-tab-pane label="印刷">
          <CraftPrint />
        </el-tab-pane>
        <!-- 啤 -->
        <el-tab-pane label="啤">
          <CraftPi />
        </el-tab-pane>
        <!-- 烫金 -->
        <el-tab-pane label="烫金">
          <CraftGilding />
        </el-tab-pane>
        <!-- 激凸 -->
        <el-tab-pane label="激凸">
          <CraftConvex />
        </el-tab-pane>
        <!-- 丝印 -->
        <el-tab-pane label="丝印">
          <CraftSilk />
        </el-tab-pane>
        <!-- V槽 -->
        <el-tab-pane label="V槽">
          <CraftV />
        </el-tab-pane>
        <!-- UV -->
        <el-tab-pane label="UV">
          <CraftUV />
        </el-tab-pane>
        <!-- 其它 -->
        <el-tab-pane label="其它">其它</el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import CraftPrint from "../Craft/CraftPrint.vue";
import CraftPi from "../Craft/CraftPi.vue";
import CraftGilding from "../Craft/CraftGilding.vue";
import CraftConvex from "../Craft/CraftConvex.vue";
import CraftSilk from "../Craft/CraftSilk.vue";
import CraftV from "../Craft/CraftV.vue";
import CraftUV from "../Craft/CraftUV.vue";
export default {
  data() {
    return {
      Form: {}
    };
  },
  methods: {},
  components: {
    CraftPrint,
    CraftPi,
    CraftGilding,
    CraftConvex,
    CraftSilk,
    CraftV,
    CraftUV
  }
};
</script>

<style lang="scss" scope>
</style>