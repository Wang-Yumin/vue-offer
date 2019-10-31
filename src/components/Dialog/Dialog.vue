<template>
  <div class="dialog" v-show="showMask">
    <div class="dialog-background" @click="showMask=false"></div>
    <div class="dialog-container">
      <div class="dialog-title">{{title}}</div>
      <div class="content">
        <!-- 搜索框 -->
        <form class="search_form" @submit.prevent="search">
          <input type="search" placeholder="请输入搜索内容" class="search_input" v-model="keyword" />
          <input type="submit" class="search_submit" value="搜索" />
        </form>
        <!-- 搜索结果 -->
        <el-form @submit.native.prevent ref="form" size="mini">
          <el-form-item>
            <el-table empty-text="无搜索结果" border height="500" style="width: 100%" :data="searchInfo">
              <!-- 客户名称 -->
              <el-table-column label="客户名称" align="center" prop="customer_name">
                <template slot-scope="scope">
                  <span>{{scope.row.customer_name}}</span>
                </template>
              </el-table-column>
              <!-- 报价单号 -->
              <el-table-column label="报价单号" align="center" prop="offerNumber">
                <template slot-scope="scope">
                  <span>{{scope.row.offerNumber}}</span>
                </template>
              </el-table-column>
              <!-- 产品名 -->
              <el-table-column label="产品名" align="center" prop="item_name">
                <template slot-scope="scope">
                  <span>{{scope.row.item_name}}</span>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column label="数量" align="center" prop="qty">
                <template slot-scope="scope">
                  <span>{{scope.row.qty}}</span>
                </template>
              </el-table-column>
              <!-- 报价 -->
              <el-table-column label="报价" align="center" prop="total_price">
                <template slot-scope="scope">
                  <span>{{scope.row.total_price}}</span>
                  <!-- <a href="https://www.baidu.com/">百度</a> -->
                </template>
              </el-table-column>
              <!-- 时间 -->
              <el-table-column label="时间" align="center" prop="total_price">
                <template slot-scope="scope">
                  <span>{{scope.row.create_date}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <div class="btns">
        <div v-if="type != 'empty'" class="default-btn" @click="closeBtn">{{cancelText}}</div>
        <div v-if="type == 'danger'" class="danger-btn" @click="dangerBtn">{{dangerText}}</div>
        <div v-if="type == 'confirm'" class="confirm-btn" @click="confirmBtn">{{confirmText}}</div>
        <div v-if="type == 'empty'" class="empty-btn" @click="emptyBtn">{{emptyText}}</div>
      </div>
      <div class="close-btn" @click="closeMask">
        <!-- <i class="iconfont icon-close">X</i> -->
        <i class="iconfont el-icon-close"></i>
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
    emptyText: {
      type: String,
      default: "清空"
    }
  },
  data() {
    return {
      showMask: false,
      keyword: "", // 用户填写的搜索内容
      searchInfo: []
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
    emptyBtn() {
      this.$emit("empty");
      this.clearList();
    },
    // 清空列表
    clearList() {
      this.searchInfo = [];
      this.keyword = "";
    },
    // 默认显示历史报价(父组件点击弹窗时触发))
    historyList() {
      axios({
        method: "get",
        url: "/Order/GetHistoricalOffer",
        params: {
          userId: this.$store.state.userInfo.Id
        }
      })
        .then(res => {
          if (res.data.rows !== null) {
            let item = JSON.parse(res.data.rows);
            let array = [];
            for (let i = 0; i < item.length; i++) {
              let obj = {
                customer_name: item[i].customer_name, //客户名
                offerNumber: item[i].order_no, //报价单号
                item_name: item[i].item_name, //产品名
                qty: item[i].qty, //数量
                total_price: item[i].TotalPrice, //报价
                create_date: item[i].create_date.replace("T", " ") //创建时间(去掉t)
              };
              array.push(obj);
            }
            this.searchInfo = array;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 搜索
    search() {
      // 获取搜索关键字并trim()去空
      const keyword = this.keyword.trim();

      axios({
        method: "get",
        url: "/Order/GetByItemNmae",
        params: {
          itemNmae: keyword,
          creator: this.$store.state.userInfo.Id
        }
      })
        .then(res => {
          if (res.data.rows !== null) {
            let item = JSON.parse(res.data.rows);
            let array = [];
            for (let i = 0; i < item.length; i++) {
              let obj = {
                customer_name: item[i].customer_name, //客户名
                offerNumber: item[i].order_no, //报价单号
                item_name: item[i].item_name, //产品名
                qty: item[i].qty, //数量
                total_price: item[i].TotalPrice, //报价
                create_date: item[i].create_date.replace("T", " ") //创建时间(去掉t)
              };
              array.push(obj);
            }
            this.searchInfo = array;
          }
        })
        .catch(error => {
          console.log(error);
        });
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
    width: 1000px;
    height: 700px;
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
      .empty-btn {
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
  /deep/.el-table td {
    padding: 8px 0;
  }
}
</style>