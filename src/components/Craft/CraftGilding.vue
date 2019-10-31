<template>
  <div class="CraftPrint_container">
    <el-form-item>
      <el-table
        empty-text="点击+号,添加数据"
        border
        height="320"
        style="width: 100%"
        :data="CraftGildingData"
      >
        <!-- 印刷部件 -->
        <el-table-column label="部件" align="center" prop="item_name">
          <template slot-scope="scope">
            <!-- 普通下拉框 -->
            <el-select
              v-model="scope.row.item_name"
              no-data-text="未生成报价单号"
              @change="selectComponent(scope.$index)"
            >
              <el-option
                v-for="(item,i) in item_names"
                :key="i"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
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
              @click.native.prevent="deleteRowCraftGilding(scope.$index, CraftGildingData)"
              type="danger"
              size="small"
            >
              <i class="el-icon-close"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="addRowCraftGilding(CraftGildingData)">
        <i class="el-icon-plus"></i>
      </el-button>
    </el-form-item>
    <!-- 表单提交按钮 -->
    <div class="form-submit">
      <el-form-item size="mini">
        <div class="total_unit">
          <div>
            <el-button type="info" ref="totalPrice">烫金总价</el-button>
            <el-input disabled v-model="allTotalPrice.CraftGilding_price"></el-input>
          </div>
          <div>
            <el-button type="info" ref="totalPrice">烫金总价</el-button>
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
      // 工艺-烫金
      CraftGildingData: [
        {
          item_name: "", //烫金部件
          unit_price: "", //单价
          total_price: "" //合计
        }
      ],
      componentId: "", //部件Id(物料编号)
      item_names: [], //部件选择数组
      height: "",
      width: "",
      all_unit_price: 0
    };
  },
  mounted() {},
  computed: {
    ...mapState(["formInfo", "allTotalPrice", "orderInfo"]),
    listenOffer() {
      // 侦听表单提交成功的更新时间
      return this.$store.state.orderInfo.update_date;
    },
    listenPrice() {
      return this.$store.state.allTotalPrice.CraftGilding_price;
    },
    listenClean() {
      return this.$store.state.orderInfo.clean_date;
    }
  },
  watch: {
    listenOffer: function(newCount, oldCount) {
      this.submitText = "提交";
      this.$store.state.allTotalPrice.CraftGilding_submit = false;
      this.getAllComponent();
      if (
        this.$store.state.formInfo.qty &&
        this.$store.state.allTotalPrice.CraftPi_price !== 0
      ) {
        let array = this.CraftGildingData;
        for (let i = 0; i < array.length; i++) {
          this.selectComponent(i);
        }
      }
    },
    listenPrice(newCount, oldCount) {
      this.submitText = "提交";
      this.$store.state.allTotalPrice.CraftGilding_submit = false;
    },
    listenClean(newCount, oldCount) {
      this.all_unit_price = 0;
      return (this.CraftGildingData = [
        {
          item_name: "",
          unit_price: "",
          total_price: ""
        }
      ]);
    }
  },
  methods: {
    // 获取部件下拉选择数组
    getAllComponent() {
      let array = this.item_names;
      array.splice(0, array.length);
      axios({
        methods: "get",
        url: "/Technology/GetParts",
        params: {
          order_no: this.$store.state.orderInfo.offerNumber
        }
      }).then(res => {
        if (res.data.rows !== null) {
          let obj = JSON.parse(res.data.rows);
          for (let i = 0; i < obj.length; i++) {
            let obj2 = {
              text: obj[i].parts_name,
              value: obj[i].id
            };
            this.item_names.push(obj2);
          }
        }
      });
    },
    // 获取部件id(并请求烫金单价)
    selectComponent(index) {
      if (this.CraftGildingData[index].item_name) {
        axios({
          method: "get",
          url: "/Technology/GetBeer",
          params: {
            id: this.CraftGildingData[index].item_name,
            ordernum: this.$store.state.formInfo.qty,
            name: "烫金"
          }
        }).then(res => {
          if (res.data.rows !== null) {
            this.CraftGildingData[index].unit_price = res.data.rows;
            this.CraftGildingData[index].total_price = (
              this.CraftGildingData[index].unit_price *
              this.$store.state.formInfo.qty
            ).toFixed(2);
            this.computer();
          }
        });
      }
    },
    // 计算合计总价
    computer() {
      const { allTotalPrice, CraftGildingData, formInfo } = this;
      // 先归零,不然不会累积
      allTotalPrice.CraftGilding_price = 0;
      let array = 0;
      CraftGildingData.forEach(item => {
        array += parseFloat(item.total_price);
      });
      allTotalPrice.CraftGilding_price = array.toFixed(2);
      this.all_unit_price = (array / formInfo.qty).toFixed(3);
    },
    // 烫金表单信息提交
    onSubmit() {
      const { CraftGildingData, formInfo, orderInfo, allTotalPrice } = this;
      // 每次点击提交就先将文字变成默认的
      this.submitText = "提交";
      allTotalPrice.CraftGilding_submit = false;
      const gildings = [];
      // 遍历表单,获取需要提交的数据
      for (let i = 0; i < CraftGildingData.length; i++) {
        let obj = {
          order_no: orderInfo.offerNumber, //订单号
          item_no: CraftGildingData[i].item_name, //部件id
          totalPrice: CraftGildingData[i].total_price //合计总价
        };
        gildings.push(obj);
      }
      let json = { gildings };
      let datas = JSON.stringify(json); //或许需要
      axios({
        method: "post",
        url: "/Order/AddGildingOrder",
        data: datas,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.data.rows !== null) {
            this.submitText = "√ 已提交";
            allTotalPrice.CraftGilding_submit = true;
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
    // 烫金
    deleteRowCraftGilding(index, rows) {
      rows.splice(index, 1);
      this.computer();
    },
    addRowCraftGilding(CraftGildingData, event) {
      CraftGildingData.push({
        item_name: "", //烫金部件
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
