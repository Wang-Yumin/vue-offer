<template>
  <div class="index_container">
    <!-- 页面顶部信息 -->
    <Header />
    <!-- 报价单 -->
    <section class="w jeweller_price">
      <el-container>
        <el-header>报价单</el-header>
        <el-main>
          <!-- 表头 -->
          <FormHeader />
          <!-- 表身 -->
          <section class="form_body">
            <el-main>
              <el-tabs
                v-model="activeName"
                type="border-card"
                :tab-position="tabPosition"
                style="height: 200px;"
                @tab-click="handleClick"
              >
                <!-- 材料 -->
                <el-tab-pane name="show" label="材料">
                  <Material />
                </el-tab-pane>
                <!-- 工艺 -->
                <el-tab-pane label="工艺">
                  <Craft />
                </el-tab-pane>
                <!-- 工费 -->
                <el-tab-pane label="工费">
                  <LaborCost />
                </el-tab-pane>
                <!-- 包装 -->
                <el-tab-pane label="包装">
                  <Package />
                </el-tab-pane>
                <!-- 运输 -->
                <el-tab-pane label="运输">
                  <el-form @submit.native.prevent ref="form" :model="formInfo" size="mini">运输</el-form>
                </el-tab-pane>
              </el-tabs>
            </el-main>
            <!-- 信息 -->
            <el-form :model="formInfo">
              <div class="form_info">
                <el-form-item>
                  <el-button size="mini" type="primary">系数</el-button>
                  <el-input size="mini" v-model="orderInfo.modulus" placeholder="百分比" type="number"></el-input>
                  <el-button size="mini" type="primary">汇率</el-button>
                  <el-input v-model="orderInfo.exchange" placeholder="输入" type="number" size="mini"></el-input>
                  <el-button size="mini" type="info">最终合计</el-button>
                  <el-input disabled v-model="formInfo.total_price" size="mini"></el-input>
                  <el-button size="mini" type="info">最终单价</el-button>
                  <el-input disabled v-model="formInfo.unit_price" size="mini"></el-input>
                </el-form-item>
              </div>
              <div class="form_complete">
                <el-form-item>
                  <el-button size="mini" type="primary" round @click="openMask">历史报价</el-button>
                  <!-- 生成报价单 -->
                  <!-- <router-link to='/pdf'> -->
                  <el-button @click="openPdf" size="mini" :plain="true" type="primary" round>生成报价单</el-button>
                  <!-- </router-link> -->
                  <el-button :plain="true" size="large" type="success" round @click="complete">报价完成</el-button>
                </el-form-item>
              </div>
            </el-form>
          </section>
        </el-main>
      </el-container>
    </section>
    <!-- 测试 -->
    <router-link to="/test">Test</router-link>
    <router-link to="/test1">Test1</router-link>
    <router-link target="_blank" to="/test2">Test2</router-link>
    <router-link to="/test007">Test007</router-link>
    <router-link to="/test008">Test008</router-link>
    <!-- 历史报价弹窗 -->
    <Dialog
      ref="dialog"
      v-model="sendVal"
      type="empty"
      title="历史报价"
      v-on:cancel="clickCancel()"
      @danger="clickDanger()"
      @confirm="clickConfirm()"
      @empty="clickEmpty()"
      dangerText="Delete"
    ></Dialog>
  </div>
</template>

<script>
import Dialog from "../../components/Dialog/Dialog.vue";

import Header from "../../components/Header/Header.vue";
import FormHeader from "../../components/FormHeader/FormHeader.vue";
import Material from "../../components/Material/Material.vue";
import Package from "../../components/Package/Package.vue";
import LaborCost from "../../components/LaborCost/LaborCost.vue";
import Craft from "../../components/Craft/Craft.vue";
import { mapGetters, mapState } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      sendVal: false, //弹出框(搜索))
      activeName: "show", //工艺页面默认显示第几页
      tabPosition: "left", //详细信息靠左
      input1: "",
      input2: "",
      formData: {
        modulus: "",
        exchange: ""
      }
    };
  },
  created() {},
  computed: {
    ...mapState(["userInfo", "allTotalPrice", "searchList", "orderInfo"]),
    ...mapGetters(["formInfo"]),
    // 侦听所有合计价格变动
    listen_Material_price() {
      return this.$store.state.allTotalPrice.Material_price;
    },
    listen_CraftPrint_price() {
      return this.$store.state.allTotalPrice.CraftPrint_price;
    },
    listen_CraftPi_price() {
      return this.$store.state.allTotalPrice.CraftPi_price;
    },
    listen_CraftGilding_price() {
      return this.$store.state.allTotalPrice.CraftGilding_price;
    },
    listen_CraftConvex_price() {
      return this.$store.state.allTotalPrice.CraftConvex_price;
    },
    listen_CraftSilk_price() {
      return this.$store.state.allTotalPrice.CraftSilk_price;
    },
    listen_CraftV_price() {
      return this.$store.state.allTotalPrice.CraftV_price;
    },
    listen_CraftUV_price() {
      return this.$store.state.allTotalPrice.CraftUV_price;
    },
    listen_LaborCost_price() {
      return this.$store.state.allTotalPrice.LaborCost_price;
    },
    listen_InsidePackage_price() {
      return this.$store.state.allTotalPrice.InsidePackage_price;
    },
    listen_OutsidePackage_price() {
      return this.$store.state.allTotalPrice.OutsidePackage_price;
    },
    listenClean() {
      return this.$store.state.orderInfo.clean_date;
    }
  },
  watch: {
    listen_Material_price() {
      this.all_price();
    },
    listen_CraftPrint_price() {
      this.all_price();
    },
    listen_CraftPi_price() {
      this.all_price();
    },
    listen_CraftGilding_price() {
      this.all_price();
    },
    listen_CraftConvex_price() {
      this.all_price();
    },
    listen_CraftSilk_price() {
      this.all_price();
    },
    listen_CraftV_price() {
      this.all_price();
    },
    listen_CraftUV_price() {
      this.all_price();
    },
    listen_LaborCost_price() {
      this.all_price();
    },
    listen_InsidePackage_price() {
      this.all_price();
    },
    listen_OutsidePackage_price() {
      this.all_price();
    },
    listenClean(newCount, oldCount) {
      const { formInfo, orderInfo, allTotalPrice } = this;
      orderInfo.modulus = "";
      orderInfo.exchange = "";
      formInfo.boxing = "";
      formInfo.offer_method = "";
      formInfo.completed_date = "";
      allTotalPrice.price_unit = " ￥";
      allTotalPrice.all_unit_price = "";
      allTotalPrice.priceUnit = "";
      allTotalPrice.Material_price = 0;
      allTotalPrice.Material_submit = false;
      allTotalPrice.CraftPrint_price = 0;
      allTotalPrice.CraftPrint_submit = false;
      allTotalPrice.CraftPi_price = 0;
      allTotalPrice.CraftPi_submit = false;
      allTotalPrice.CraftGilding_price = 0;
      allTotalPrice.CraftGilding_submit = false;
      allTotalPrice.CraftConvex_price = 0;
      allTotalPrice.CraftConvex_submit = false;
      allTotalPrice.CraftSilk_price = 0;
      allTotalPrice.CraftSilk_submit = false;
      allTotalPrice.CraftV_price = 0;
      allTotalPrice.CraftV_submit = false;
      allTotalPrice.CraftUV_price = 0;
      allTotalPrice.CraftUV_submit = false;
      allTotalPrice.LaborCost_price = 0;
      allTotalPrice.LaborCost_submit = false;
      allTotalPrice.InsidePackage_price = 0;
      allTotalPrice.InsidePackage_submit = false;
      allTotalPrice.OutsidePackage_price = 0;
      allTotalPrice.OutsidePackage_submit = false;
    }
  },
  methods: {
    // 切换tab(材料 工艺 ...)时触发的事件
    handleClick(tab, event) {
      const { orderInfo, formInfo, allTotalPrice } = this;
      if (orderInfo.offerNumber) {
        if (tab._uid === 176 && !allTotalPrice.Material_submit) {
          this.$message({
            message: "注意提交材料表单",
            type: "warning"
          });
          return;
        }
      }
    },
    // 点击弹出历史报价(并触发子组件方法))
    openMask(index) {
      this.sendVal = true;
      this.$refs.dialog.historyList();
    },
    // 点击生成报价单
    openPdf() {
      const { orderInfo, allTotalPrice } = this;
      if (allTotalPrice.all_unit_price) {
        // 确认跳转
        this.$confirm("确认生成报价单 ?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push({
              name: "Pdf",
              params: { offer: orderInfo.offerNumber }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消生成报价单"
            });
          });
        return;
      } else {
        this.$message({
          message: "未报价完成 !",
          type: "warning"
        });
      }
    },
    clickCancel() {
      console.log("点击了取消");
    },
    clickDanger() {
      console.log("这里是danger回调");
    },
    clickConfirm() {
      console.log("点击了confirm");
    },
    clickEmpty() {
      console.log("清空搜索结果");
    },
    // 百分比转换小数(且+1,如1+0.3)
    toPoint(percent) {
      let str = percent.replace("%", "");
      str = 1 + str / 100;
      return str;
    },
    all_price() {
      const { formInfo, allTotalPrice } = this;
      formInfo.total_price = 0;
      // 全部合计总价
      formInfo.total_price = (
        parseFloat(allTotalPrice.Material_price) +
        parseFloat(allTotalPrice.CraftPrint_price) +
        parseFloat(allTotalPrice.CraftPi_price) +
        parseFloat(allTotalPrice.CraftGilding_price) +
        parseFloat(allTotalPrice.CraftConvex_price) +
        parseFloat(allTotalPrice.CraftSilk_price) +
        parseFloat(allTotalPrice.CraftV_price) +
        parseFloat(allTotalPrice.CraftUV_price) +
        parseFloat(allTotalPrice.LaborCost_price) +
        parseFloat(allTotalPrice.InsidePackage_price) +
        parseFloat(allTotalPrice.OutsidePackage_price)
      ).toFixed(2);
      formInfo.unit_price = (formInfo.total_price / formInfo.qty).toFixed(3);
      return;
    },
    // 报价完成
    complete() {
      const { formInfo, orderInfo, allTotalPrice } = this;
      let modulus;
      let exchange;
      // 判断是否填写了系数
      if (orderInfo.modulus) {
        modulus = this.toPoint(orderInfo.modulus); //系数
      } else {
        modulus = 1;
      }
      // 判断是否填写了汇率
      if (orderInfo.exchange) {
        exchange = orderInfo.exchange; //汇率
      } else {
        exchange = 1;
      }
      this.all_price();
      if (orderInfo.offerNumber) {
        if (
          allTotalPrice.Material_price != 0 &&
          !allTotalPrice.Material_submit
        ) {
          this.$message({
            message: "材料表单已填写但未提交!",
            type: "warning"
          });
          return;
        }
        if (
          allTotalPrice.CraftPrint_price != 0 &&
          !allTotalPrice.CraftPrint_submit
        ) {
          this.$message({
            message: "印刷表单已填写但未提交!",
            type: "warning"
          });
          return;
        }
        if (allTotalPrice.CraftPi_price != 0 && !allTotalPrice.CraftPi_submit) {
          this.$message({
            message: "啤表单已填写但未提交!",
            type: "warning"
          });
          return;
        }
        if (
          allTotalPrice.CraftGilding_price != 0 &&
          !allTotalPrice.CraftGilding_submit
        ) {
          this.$message({
            message: "烫金表单已填写但未提交!",
            type: "warning"
          });
          return;
        }
        if (
          allTotalPrice.CraftConvex_price != 0 &&
          !allTotalPrice.CraftConvex_submit
        ) {
          this.$message({
            message: "激凸表单已填写但未提交!",
            type: "warning"
          });
          return;
        }
        if (
          allTotalPrice.CraftSilk_price != 0 &&
          !allTotalPrice.CraftSilk_submit
        ) {
          this.$message({
            message: "丝印表单已填写但未提交!",
            type: "warning"
          });
          return;
        }
        if (allTotalPrice.CraftV_price != 0 && !allTotalPrice.CraftV_submit) {
          this.$message({
            message: "V槽表单已填写但未提交!",
            type: "warning"
          });
          return;
        }
        if (allTotalPrice.CraftUV_price != 0 && !allTotalPrice.CraftUV_submit) {
          this.$message({
            message: "UV表单已填写但未提交!",
            type: "warning"
          });
          return;
        }
        if (
          allTotalPrice.LaborCost_price != 0 &&
          !allTotalPrice.LaborCost_submit
        ) {
          this.$message({
            message: "工费表单已填写但未提交!",
            type: "warning"
          });
          return;
        }
        if (
          allTotalPrice.InsidePackage_price != 0 &&
          !allTotalPrice.InsidePackage_submit
        ) {
          this.$message({
            message: "内纸箱表单已填写但未提交!",
            type: "warning"
          });
          return;
        }
        if (
          allTotalPrice.OutsidePackage_price != 0 &&
          !allTotalPrice.OutsidePackage_submit
        ) {
          this.$message({
            message: "外纸箱表单已填写但未提交!",
            type: "warning"
          });
          return;
        }
        // 最后确认提交
        this.$confirm("确认生成报价单?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 报价价格=(最终总价*系数)/总数量/汇率
            // 报价价格=(最终单价*系数)/汇率
            allTotalPrice.all_unit_price =
              ((formInfo.unit_price * modulus) / exchange).toFixed(3) + "";
            // 价格+单位
            allTotalPrice.priceUnit =
              allTotalPrice.all_unit_price + allTotalPrice.price_unit;
            let datas = {
              TotalPrice: allTotalPrice.all_unit_price, //发送后台经过计算的单价
              update_date: this.nowTimes()
            };
            let json = JSON.stringify(datas);
            axios({
              method: "post",
              url:
                "/Order/UpdateOrder?orderno=" +
                this.$store.state.orderInfo.offerNumber,
              data: json,
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(res => {
                if (res.data.rows !== null) {
                  this.$message({
                    showClose: true,
                    message: "提交成功!",
                    type: "success"
                  });
                }
              })
              .catch(error => {
                this.$message({
                  showClose: true,
                  message: "提交信息错误!",
                  type: "warning"
                });
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else {
        this.$message.error("未生成订单号!");
      }
    },
    // 创建报价时间
    nowTimes() {
      let now = new Date();
      let year = now.getFullYear(); //得到年份
      let month = now.getMonth(); //得到月份
      let date = now.getDate(); //得到日期
      let day = now.getDay(); //得到周几
      let hour = now.getHours(); //得到小时
      let minu = now.getMinutes(); //得到分钟
      let sec = now.getSeconds(); //得到秒
      let week;
      month = month + 1;
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      if (hour < 10) hour = "0" + hour;
      if (minu < 10) minu = "0" + minu;
      if (sec < 10) sec = "0" + sec;
      let time = "";
      time = year + "-" + month + "-" + date + " " + hour + ":" + minu;
      return time;
    }
  },
  components: {
    Header,
    Material,
    Package,
    LaborCost,
    Craft,
    Dialog,
    FormHeader
  },
  props: {}
};
</script>
<style lang="scss" scoped>
/* 公共样式 */
// @import '../../assets/style/reset.css';
.w {
  min-width: 1550px;
  margin: auto;
}
.index_container {
  .jeweller_price {
    .el-container.is-vertical {
      flex-direction: column;
      height: 930px;
    }
    .el-main {
      background-color: #fff !important;
      color: #333;
      text-align: center;
      line-height: 160px;
      padding: 0;
    }
    .form_body {
      /deep/ .el-tabs--border-card > .el-tabs__content {
        padding: 0;
      }
      /deep/.el-tabs--border-card > .el-tabs__header {
        background-color: #efeff1;
        border-bottom: 1px solid #e4e7ed;
        margin: 0;
      }
      // height: 500px;
      border: 1px solid #409eff;
      position: relative;
      .form_info {
        padding-left: 70px;
        width: 800px;
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 999;
        .el-input {
          width: 15%;
        }
        .el-input__inner {
          background-color: #fff;
          background-image: none;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          box-sizing: border-box;
          color: #606266;
          display: inline-block;
          height: 28px;
          line-height: 28px;
          outline: 0;
          // padding: 0px;
          width: 100%;
        }
      }
      .form_complete {
        position: absolute;
        bottom: 0;
        right: 24%;
      }
      .el-main {
        .el-tabs--left,
        .el-tabs--right {
          height: 470px !important;
          overflow: hidden;
          .el-tabs__content {
            height: 450px;
          }
        }
      }
    }

    .el-header,
    .el-footer {
      background-color: #409eff;
      color: #fff;
      text-align: center;
      height: 30px !important;
      line-height: 30px;
    }

    .el-aside {
      background-color: #d3dce6;
      color: #333;
      text-align: center;
      line-height: 200px;
    }

    body > .el-container {
      margin-bottom: 40px;
    }
  }
}
</style>
