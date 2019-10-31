<template>
  <div class="CraftPrint_container">
    <el-form-item>
      <el-table
        empty-text="点击+号,添加数据"
        border
        height="320"
        style="width: 100%"
        :data="CraftConvexData"
      >
        <!-- 部件 -->
        <el-table-column label="部件" align="center" prop="item_name">
          <template slot-scope="scope">
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
              @click.native.prevent="deleteRowCraftConvex(scope.$index, CraftConvexData)"
              type="danger"
              size="small"
            >
              <i class="el-icon-close"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="addRowCraftConvex(CraftConvexData)">
        <i class="el-icon-plus"></i>
      </el-button>
    </el-form-item>
    <!-- 表单提交按钮 -->
    <div class="form-submit">
      <el-form-item size="mini">
        <div class="total_unit">
          <div>
            <el-button type="info" ref="totalPrice">激凸总价</el-button>
            <el-input disabled v-model="allTotalPrice.CraftConvex_price"></el-input>
          </div>
          <div>
            <el-button type="info" ref="totalPrice">激凸单价</el-button>
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
      // 工艺-激凸
      CraftConvexData: [
        {
          item_name: "", //激凸部件
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
      return this.$store.state.allTotalPrice.CraftConvex_price;
    },
    listenClean() {
      return this.$store.state.orderInfo.clean_date;
    }
  },
  watch: {
    listenOffer: function(newCount, oldCount) {
      this.submitText = "提交";
      this.$store.state.allTotalPrice.CraftConvex_submit = false;
      this.getAllComponent();
      if (
        this.$store.state.formInfo.qty &&
        this.$store.state.allTotalPrice.CraftPi_price !== 0
      ) {
        let array = this.CraftConvexData;
        for (let i = 0; i < array.length; i++) {
          this.selectComponent(i);
        }
      }
    },
    listenPrice(newCount, oldCount) {
      this.submitText = "提交";
      this.$store.state.allTotalPrice.CraftConvex_submit = false;
    },
    listenClean(newCount, oldCount) {
      this.all_unit_price = 0;
      return (this.CraftConvexData = [
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
    // 获取部件id(并请求激凸单价)
    selectComponent(index) {
      if (this.CraftConvexData[index].item_name) {
        axios({
          method: "get",
          url: "/Technology/GetBeer",
          params: {
            id: this.CraftConvexData[index].item_name,
            ordernum: this.$store.state.formInfo.qty,
            name: "激凸"
          }
        }).then(res => {
          if (res.data.rows !== null) {
            this.CraftConvexData[index].unit_price = res.data.rows;
            this.CraftConvexData[index].total_price = (
              this.CraftConvexData[index].unit_price *
              this.$store.state.formInfo.qty
            ).toFixed(2);
            this.computer();
          }
        });
      }
    },
    // 激凸
    deleteRowCraftConvex(index, rows) {
      rows.splice(index, 1);
      this.computer();
    },
    addRowCraftConvex(CraftConvexData, event) {
      CraftConvexData.push({
        item_name: "", //激凸部件
        unit_price: "", //单价
        total_price: "" //合计
      });
    },
    // 计算合计总价
    computer() {
      const { allTotalPrice, CraftConvexData, formInfo } = this;
      // 先归零,不然不会累积
      allTotalPrice.CraftConvex_price = 0;
      let array = 0;
      CraftConvexData.forEach(item => {
        array += parseFloat(item.total_price);
      });
      allTotalPrice.CraftConvex_price = array.toFixed(2);
      this.all_unit_price = (array / formInfo.qty).toFixed(3);
    },
    // 激凸表单信息提交
    onSubmit() {
      const { CraftConvexData, formInfo, orderInfo, allTotalPrice } = this;
      // 每次点击提交就先将文字变成默认的
      this.submitText = "提交";
      allTotalPrice.CraftConvex_submit = false;
      const convices = [];
      // 遍历表单,获取需要提交的数据
      for (let i = 0; i < CraftConvexData.length; i++) {
        let obj = {
          order_no: orderInfo.offerNumber, //订单号
          item_no: CraftConvexData[i].item_name, //部件id
          totalPrice: CraftConvexData[i].total_price //合计总价
        };
        convices.push(obj);
      }
      let json = { convices }; //或许需要
      let datas = JSON.stringify(json);
      axios({
        method: "post",
        url: "/Order/AddConvexOrder",
        data: datas,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        if (res.data.rows !== null) {
          this.submitText = "√ 已提交";
          allTotalPrice.CraftConvex_submit = true;
          this.$message({
            showClose: true,
            message: "提交成功!",
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: "提交信息错误,或有空项",
            type: "warning"
          });
        }
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
