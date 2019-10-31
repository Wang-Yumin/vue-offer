<template>
  <div class="dialog1" v-show="showMask">
    <div class="dialog1-background" @click="showMask=false"></div>
    <div class="dialog1-container">
      <div id="pdfDom" class="cloudTableAuto">
        <div class="dialog1-title">{{title}}</div>
        <div class="content">
          <!-- 报价单信息 -->
          <table class="cloudTable_header cloudTable" style="table-layout:fixed">
            <tr>
              <td>客户名</td>
              <td>{{price_list.customer_name}}</td>
              <td>公司名</td>
              <td>{{price_list.CompanyName}}</td>
            </tr>
            <tr>
              <td>联系人</td>
              <td>{{price_list.Contacts}}</td>
              <td>联系人</td>
              <td>{{price_list.RealName}}</td>
            </tr>
            <tr>
              <td>电话</td>
              <td>{{price_list.customer_phone}}</td>
              <td>电话</td>
              <td>{{price_list.Tel}}</td>
            </tr>
            <tr>
              <td>邮箱</td>
              <td>{{price_list.Email}}</td>
              <td>邮箱</td>
              <td>{{price_list.userEmail}}</td>
            </tr>
          </table>
          <!-- 产品信息 -->
          <table border="1">
            <tr>
              <td width="20%">品名</td>
              <td width="30%">{{price_list.item_name}}</td>
              <td rowspan="7">
                <img :src="image_url" />
              </td>
            </tr>
            <tr>
              <td>规格</td>
              <td>{{price_list.item_spec}}</td>
            </tr>
            <tr>
              <td>数量</td>
              <td>{{price_list.qty}}</td>
            </tr>
            <tr>
              <td>装箱</td>
              <td>{{price_list.Boxing}}</td>
            </tr>
            <tr>
              <td>价格</td>
              <td>{{price_list.TotalPrice}}</td>
            </tr>
            <tr>
              <td>生产周期</td>
              <td>
                <input type="text" />
              </td>
            </tr>
            <tr>
              <td>样板费</td>
              <td>
                <input type="text" />
              </td>
            </tr>
            <tr>
              <td rowspan="4">描述</td>
              <td style="text-align: left;" colspan="3">所有物料:{{Text}}</td>
            </tr>
            <tr>
              <td style="text-align: left;" colspan="3">印刷:</td>
            </tr>
            <tr>
              <td style="text-align: left;" colspan="3">烫金:</td>
            </tr>
            <tr>
              <td style="text-align: left;" colspan="3">过胶:{{glue}}</td>
            </tr>
            <tr>
              <td colspan="7"></td>
            </tr>
            <tr>
              <td colspan="3">
                <label>报价日期:{{Time}}</label>
                <label>报价单号 :{{price_list.orderno}}</label>
                <label>报价员:{{price_list.bjy}}</label>
              </td>
            </tr>
          </table>
          <button @click="handleWindowPrint( '#pdfDom', '电子合同' )">导出</button>
        </div>
        <div class="btns">
          <div v-if="type != 'empty'" class="default-btn" @click="closeBtn">{{cancelText}}</div>
          <div v-if="type == 'danger'" class="danger-btn" @click="dangerBtn">{{dangerText}}</div>
          <div v-if="type == 'confirm'" class="confirm-btn" @click="confirmBtn">{{confirmText}}</div>
        </div>
        <div class="close-btn" @click="closeMask">
          <i class="iconfont el-icon-close"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapGetters } from "vuex";
export default {
  props: {
    value: {},
    // 类型包括 defalut 默认， danger 危险， confirm 确认，
    type: {
      type: String,
      default: "default"
    },
    content: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    dangerText: {
      type: String,
      default: "删除"
    },
    confirmText: {
      type: String,
      default: "确认"
    },
    image_url: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showMask: false,
      htmlTitle: "页面导出PDF文件名",
      packData: [],
      price_list: {},
      Time: "",
      Text: "",
      glue: ""
    };
  },
  computed: {
    ...mapState(["formInfo", "orderInfo"])
  },
  methods: {
    // 关闭窗口
    closeMask() {
      this.showMask = false;
    },
    closeBtn() {
      this.$emit("cancel");
      this.closeMask();
    },
    dangerBtn() {
      this.$emit("danger");
      this.closeMask();
    },
    confirmBtn() {
      this.$emit("confirm");
      this.closeMask();
    },
    // 生成报价单信息
    priceList() {
      const { orderInfo } = this;
      if (orderInfo.offerNumber) {
        axios({
          method: "get",
          url: "/Order/GetExport",
          params: {
            orderno: orderInfo.offerNumber
          }
        }).then(res => {
          if (res.data.rows !== null) {
            let item = JSON.parse(res.data.rows);
            console.log(item)
            this.price_list = item;
            this.Time = this.price_list.create_date.replace("T", " ");
            this.Text = this.price_list.bom.substring(
              0,
              this.price_list.bom.length - 1
            );
            this.glue = this.price_list.glue.substring(
              0,
              this.price_list.glue.length - 1
            );
          }
        });
      }
    },
    //浏览器方式打印
    handleWindowPrint(ele, fileName) {
      window.print();
    }
  },
  mounted() {
    this.showMask = this.value;
  },
  watch: {
    value(newVal, oldVal) {
      this.showMask = newVal;
    },
    showMask(val) {
      this.$emit("input", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog1 {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  .dialog1-container {
    width: 610px;
    height: 900px;
    background: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    position: relative;
    .dialog1-title {
      width: 100%;
      height: 60px;
      line-height: 60px;
      font-size: 18px;
      color: #696969;
      font-weight: 600;
      padding: 10px;
      text-align: center;
      box-sizing: border-box;
    }
    .content {
      color: #797979;
      line-height: 26px;
      padding: 0 20px;
      box-sizing: border-box;
      table {
        width: 100%;
        height: 100%;
        // text-align: center;
        input {
          border: 0;
          width: 80%;
        }
        tr,
        td {
          vertical-align: middle;
          border: 1px solid #ccc;
          text-align: center;
          height: 20px;
          label {
            padding: 0 10px;
          }
        }
      }
    }
    .inp {
      margin: 10px 0 0 20px;
      width: 200px;
      height: 40px;
      padding-left: 4px;
      border-radius: 4px;
      border: none;
      background: #efefef;
      outline: none;
      &:focus {
        border: 1px solid #509ee3;
      }
    }
    .btns {
      width: 100%;
      height: 60px;
      // line-height: 60px;
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: right;
      padding: 0 16px;
      box-sizing: border-box;
      & > div {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        padding: 0 14px;
        color: #ffffff;
        background: #f1f1f1;
        border-radius: 8px;
        margin-right: 12px;
        cursor: pointer;
      }
      .default-btn {
        color: #787878;
        &:hover {
          color: #509ee3;
        }
      }
      .danger-btn {
        background: #ef8c8c;
        &:hover {
          background: rgb(224, 135, 135);
        }
        &:active {
          background: #ef8c8c;
        }
      }
      .confirm-btn {
        color: #ffffff;
        background: #509ee3;
        &:hover {
          background: #6fb0eb;
        }
      }
    }
    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 18px;
      cursor: pointer;
      &:hover {
        font-weight: 600;
      }
    }
    .cloudTableAuto {
      .cloudTable_header {
        tr {
          border-bottom: 1px solid #e0e6ed;
        }
        tr td {
          // height: 80px;
          // font-family: "Lato", "Helvetica Neue", Arial, Helvetica, sans-serif;
          box-sizing: border-box;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
          border: 0;
          // border-bottom: 1px solid #e0e6ed;
          border-right: 1px solid #e0e6ed;
        }
        input {
          width: 85px;
          height: 30px;
          outline: none;
          border: none;
        }
        // .avatar {
        //   width: 178px;
        //   height: 178px;
        //   display: block;
        //   margin: 0 auto;
        // }
      }
    }
  }
  .dialog1-background {
    position: fixed;
    width: 100%;
    height: 100%;
  }
  // 表格样式
  // /deep/.el-table td {
  //   padding: 8px 0;
  // }
}
</style>