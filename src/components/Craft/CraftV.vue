<template>
  <div class="CraftPrint_container">
    <el-form-item>
      <el-table empty-text="点击+号,添加数据" border height="320" style="width: 100%" :data="CraftV">
        <!-- 部件数 -->
        <el-table-column label="部件数" align="center" prop="item_number">
          <template slot-scope="scope">
            <el-input
              type="number"
              ref="item_number"
              @change="getPrice(scope.$index)"
              size="mini"
              v-model="scope.row.item_number"
            ></el-input>
          </template>
        </el-table-column>
        <!-- 单价 -->
        <el-table-column label="单价" align="center" prop="unit_price">
          <template slot-scope="scope">
            <el-input disabled size="mini" v-model="scope.row.unit_price"></el-input>
          </template>
        </el-table-column>
        <!-- 合计 -->
        <el-table-column label="合计" align="center" prop="total_price">
          <template slot-scope="scope">
            <el-input disabled size="mini" v-model="scope.row.total_price"></el-input>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="50px" align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRowCraftV(scope.$index, CraftV)"
              type="danger"
              size="small"
            >
              <i class="el-icon-close"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="addRowCraftV(CraftV)">
        <i class="el-icon-plus"></i>
      </el-button>
    </el-form-item>
    <!-- 表单提交按钮 -->
    <div class="form-submit">
      <el-form-item size="mini">
        <div class="total_unit">
          <div>
            <el-button type="info" ref="totalPrice">V槽总价</el-button>
            <el-input disabled v-model="allTotalPrice.CraftV_price"></el-input>
          </div>
          <div>
            <el-button type="info" ref="totalPrice">V槽单价</el-button>
            <el-input disabled v-model="all_unit_price"></el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item size="large">
        <el-button :plain="true" type="primary" @click="onSubmit">{{submitText}}</el-button>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  data() {
    return {
      submitText: "提交",
      // 工艺-V槽
      CraftV: [
        {
          item_number: "", //V槽数量
          unit_price: "", //单价
          total_price: "" //合计
        }
      ],
      all_unit_price: 0
    };
  },
  mounted() {},
  computed: {
    ...mapState(["formInfo", "allTotalPrice", "orderInfo"]),
    listenPrice() {
      return this.$store.state.allTotalPrice.CraftV_price;
    },
    listenOffer() {
      // 侦听表单提交成功的更新时间
      return this.$store.state.orderInfo.update_date;
    },
    listenClean() {
      return this.$store.state.orderInfo.clean_date;
    }
  },
  watch: {
    listenOffer: function(newCount, oldCount) {
      this.submitText = "提交";
      this.$store.state.allTotalPrice.CraftV_submit = false;
      if (
        this.$store.state.formInfo.qty &&
        this.$store.state.allTotalPrice.CraftV_price !== 0
      ) {
        let array = this.CraftV;
        for (let i = 0; i < array.length; i++) {
          this.getPrice(i);
        }
      }
    },
    listenPrice(newCount, oldCount) {
      this.submitText = "提交";
      this.$store.state.allTotalPrice.CraftV_submit = false;
    },
    listenClean(newCount, oldCount) {
      this.all_unit_price = 0;
      return (this.CraftV = [
        {
          item_number: "",
          unit_price: "",
          total_price: ""
        }
      ]);
    }
  },
  methods: {
    // 获取V槽单价(并计算总价)
    getPrice(index) {
      if (this.CraftV[index].item_number) {
        axios({
          method: "get",
          url: "/Technology/GetVgroove",
          params: {
            Number: this.CraftV[index].item_number, //输入的部件数
            ordernum: this.$store.state.formInfo.qty, //订单数量
            name: "V槽" //工艺名字
          }
        }).then(res => {
          if (res.data.rows !== null) {
            this.CraftV[index].unit_price = res.data.rows;
            // 合计=单价*数量
            this.CraftV[index].total_price = (
              this.$store.state.formInfo.qty * this.CraftV[index].unit_price
            ).toFixed(2);
            this.computer();
          }
        });
      }
    },
    // 计算合计总价
    computer() {
      const { allTotalPrice, CraftV, formInfo } = this;
      // 先归零,不然不会累积
      allTotalPrice.CraftV_price = 0;
      let array = 0;
      CraftV.forEach(item => {
        array += parseFloat(item.total_price);
      });
      allTotalPrice.CraftV_price = array.toFixed(2);
      this.all_unit_price = (array / formInfo.qty).toFixed(3);
    },
    // V槽单信息提交
    onSubmit() {
      const { CraftV, allTotalPrice } = this;
      // 每次点击提交就先将文字变成默认的
      this.submitText = "提交";
      allTotalPrice.CraftV_submit = false;
      const grooves = [];
      // 遍历表单,获取需要提交的数据
      for (let i = 0; i < CraftV.length; i++) {
        let obj = {
          order_no: this.$store.state.orderInfo.offerNumber, //订单号
          item_no: CraftV[i].item_number,
          totalPrice: CraftV[i].total_price
        };
        grooves.push(obj);
      }
      let json = { grooves };
      let datas = JSON.stringify(json);
      // console.log(json);
      axios({
        method: "post",
        url: "/Order/AddGrooveOrder",
        data: datas,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.data.rows !== null) {
            this.submitText = "√ 已提交";
            allTotalPrice.CraftV_submit = true;
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
            message: "提交信息错误,或有空项",
            type: "warning"
          });
        });
    },
    // V槽
    deleteRowCraftV(index, rows) {
      rows.splice(index, 1);
      this.computer();
    },
    addRowCraftV(CraftV, event) {
      CraftV.push({
        row_id: "",
        item_number: "", //V槽数量
        unit_price: "", //单价
        total_price: "" //合计
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.CraftPrint_container {
  position: relative;
  .form-submit {
    .total_unit {
      margin-top: -10px;
    }
    display: flex;
    justify-content: flex-end;
    /deep/ .el-input {
      width: 40%;
    }
  }
  /deep/.el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
    text-align: center;
  }
  /deep/ .el-table td,
  .el-table th {
    padding: 5px 0;
  }
}
</style>
