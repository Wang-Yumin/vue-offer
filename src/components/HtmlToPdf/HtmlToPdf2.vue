<template>
  <div class="dialog" v-show="showMask">
    <div class="dialog-background" @click="showMask=false"></div>
    <div class="dialog-container">
      <div class="row" id="pdfDom">
        <div class="dialog-title">{{title}}</div>
        <div class="content">
          <!-- 报价单信息 -->
          <div class="table">
            <el-table :data="packData" ref="table" tooltip-effect="dark" border>
              <el-table-column label="材料" align="center" prop="pack_name"></el-table-column>
              <el-table-column label="长mm" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.pack_length"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="宽mm" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.pack_width"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="高mm" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.pack_height"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table">
            <el-table :data="packData" ref="table" tooltip-effect="dark" border>
              <el-table-column label="装箱数量" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.pack_num"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="纸箱材料" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.pack_material"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="损耗率" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.pack_lost"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="单价" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.pack_price"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- <button type="button" class="btn btn-primary" v-on:click="getPdf()">导出PDF</button> -->
          <button @click="handleDown">jsPDF方式下载</button>
          <button @click="handleWindowPrint( '#pdfDom', '电子合同' )">浏览器方式下载</button>
        </div>
        <div class="btns">
          <div v-if="type != 'empty'" class="default-btn" @click="closeBtn">{{cancelText}}</div>
          <div v-if="type == 'danger'" class="danger-btn" @click="dangerBtn">{{dangerText}}</div>
          <div v-if="type == 'confirm'" class="confirm-btn" @click="confirmBtn">{{confirmText}}</div>
        </div>
        <div class="close-btn" @click="closeMask">
          <!-- <i class="iconfont icon-close">X</i> -->
          <i class="iconfont el-icon-close"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { mapState, mapGetters } from "vuex";
import htmlToPdf from "../../unit/htmlToPdf.js";
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
    emptyText: {
      type: String,
      default: "清空"
    }
  },
  data() {
    return {
      showMask: false,
      htmlTitle: "页面导出PDF文件名",
      packData: []
    };
  },
  computed: {
    ...mapGetters(["searchList"])
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
    handleDown() {
      htmlToPdf.downloadPDF(document.querySelector("#pdfDom"), "我的合同");
    },
    handleWindowPrint(ele, fileName) {
      //留存原来的 html
      // let bdHtml = window.document.body.innerHTML;
      // let bdHtml = document.querySelector('#app').innerHTML;

      //要打印的 内容 html
      // document.body.innerHTML =  document.querySelector('#demo').innerHTML;
      // document.body.innerHTML =  document.querySelector('#demo').outerHTML;
      // document.querySelector('#app').innerHTML =  document.querySelector('#demo').outerHTML;
      // document.querySelector('#main').innerHTML =  document.querySelector('#demo').outerHTML;
      console.log(666);
      //去除页面不必要的 head 标签内  内容， 避免影响打印页 ， title 为保存为 pdf 的文件时的 文件名
      // document.head.innerHTML =
      //   '<meta charset="utf-8">\n' +
      //   " <title> " +
      //   fileName +
      //   "</title>\n" +
      //   ' <link rel="shortcut icon" href="http://192.168.29.50:8081/favicon.ico" type="image/x-icon" />\n' +
      //   ' <meta name="format-detection" content="telephone=no">\n' +
      //   ' <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\n' +
      //   ' <meta name="viewport" content="width=device-width,initial-scale=1.0">\n' +
      //   ' <link rel="stylesheet" href="./static/css/contract.css"/>'; //生成pdf的外部css样式
      // // document.body.innerHTML =  document.querySelector('#demo').outerHTML;
      // // document.querySelector('#main').innerHTML =  document.querySelector('#demo').outerHTML;
      // // document.body.innerHTML =  document.querySelector('#demo').outerHTML;
      // document.body.innerHTML = document.querySelector(ele).outerHTML;

      // window.print();

      //转异步 等待dom元素渲染（样式）完毕在打印
      setTimeout(() => {
        //打印
        window.print();
        //刷新页面
        window.location.reload();
      }, 20);

      //重新设会当前页面
      // window.document.body.innerHTML = bdHtml;
      // document.querySelector('#app').innerHTML =  bdHtml;
      //刷新页面
      // window.location.reload();
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
.dialog {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  .dialog-container {
    width: 610px;
    height: 900px;
    background: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    position: relative;
    .dialog-title {
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
      .search_form {
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        padding: 12px 8px;
        input {
          height: 35px;
          padding: 0 4px;
          border-radius: 2px;
          font-weight: bold;
          outline: none;
          margin: 0;
          &.search_input {
            width: 79%;
            border: 4px solid #f2f2f2;
            font-size: 14px;
            color: #333;
            background-color: #f2f2f2;
            text-align: left;
          }
          &.search_submit {
            width: 18%;
            border: 4px solid #509ee3;
            font-size: 16px;
            color: #fff;
            background-color: #509ee3;
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
  }
  .dialog-background {
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