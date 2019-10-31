<template>
  <div class="CraftPrint_container">
    <el-form-item>
      <el-table empty-text="点击+号,添加数据" border height="320" style="width: 100%" :data="CraftUVData">
        <!-- 规格 -->
        <el-table-column label="规格" align="center">
          <template slot-scope="scope">
            <div class="Flex">
              <div>
                <el-input
                  ref="itemHeight"
                  placeholder="高"
                  type="number"
                  @change="getPrice(scope.$index)"
                  size="mini"
                  v-model="scope.row.item_height"
                ></el-input>
              </div>
              <div>
                <el-input
                  ref="itemWidth"
                  placeholder="宽"
                  type="number"
                  @change="getPrice(scope.$index)"
                  size="mini"
                  v-model="scope.row.item_width"
                ></el-input>
              </div>
            </div>
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
              @click.native.prevent="deleteRowCraftUV(scope.$index, CraftUVData)"
              type="danger"
              size="small"
            >
              <i class="el-icon-close"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="addRowCraftUV(CraftUVData)">
        <i class="el-icon-plus"></i>
      </el-button>
    </el-form-item>
    <!-- 表单提交按钮 -->
    <div class="form-submit">
      <el-form-item size="mini">
        <div class="total_unit">
          <div>
            <el-button type="info" ref="totalPrice">UV总价</el-button>
            <el-input disabled v-model="allTotalPrice.CraftUV_price"></el-input>
          </div>
          <div>
            <el-button type="info" ref="totalPrice">UV单价</el-button>
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
      // 工艺-UV
      CraftUVData: [
        {
          item_height: "", //UV规格
          item_width: "", //UV规格
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
      return this.$store.state.allTotalPrice.CraftUV_price;
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
      this.$store.state.allTotalPrice.CraftUV_submit = false;
      if (this.$store.state.formInfo.qty) {
        let array = this.CraftUVData;
        for (let i = 0; i < array.length; i++) {
          this.getPrice(i);
        }
      }
    },
    listenPrice(newCount, oldCount) {
      this.submitText = "提交";
      this.$store.state.allTotalPrice.CraftUV_submit = false;
    },
    listenClean(newCount, oldCount) {
      this.all_unit_price = 0;
      return (this.CraftUVData = [
        {
          item_height: "", //UV规格
          item_width: "", //UV规格
          unit_price: "", //单价
          total_price: "" //合计
        }
      ]);
    }
  },
  methods: {
    // 获取UV单价(并计算总价)
    getPrice(index) {
      if (
        this.CraftUVData[index].item_heigh !== "" &&
        this.CraftUVData[index].item_width !== ""
      ) {
        axios({
          method: "get",
          url: "/Technology/GetUV",
          params: {
            height: this.CraftUVData[index].item_height, //输入的部件数
            width: this.CraftUVData[index].item_width, //订单数量
            orderSum: this.$store.state.formInfo.qty
          }
        }).then(res => {
          if (res.data.rows !== null) {
            this.CraftUVData[index].unit_price = res.data.rows;
            // 合计 = 数量*单价
            this.CraftUVData[index].total_price =
              this.$store.state.formInfo.qty *
              this.CraftUVData[index].unit_price;
            this.computer();
          }
        });
      }
    },
    // 计算合计总价
    computer() {
      const { allTotalPrice, CraftUVData, formInfo } = this;
      // 先归零,不然不会累积
      allTotalPrice.CraftUV_price = 0;
      let array = 0;
      CraftUVData.forEach(item => {
        array += parseFloat(item.total_price);
      });
      allTotalPrice.CraftUV_price = array.toFixed(2);
      this.all_unit_price = (array / formInfo.qty).toFixed(3);
    },
    // UV表单信息提交
    onSubmit() {
      const { allTotalPrice, formInfo, CraftUVData } = this;
      // 每次点击提交就先将文字变成默认的
      this.submitText = "提交";
      allTotalPrice.CraftUV_submit = false;
      const uVs = [];
      // 遍历表单,获取需要提交的数据
      for (let i = 0; i < CraftUVData.length; i++) {
        let obj = {
          item_spec_W: CraftUVData[i].item_height,
          item_spec_H: CraftUVData[i].item_width,
          order_no: this.$store.state.orderInfo.offerNumber,
          totalPrice: CraftUVData[i].total_price
        };
        uVs.push(obj);
      }
      let json = { uVs }; //或许需要
      let datas = JSON.stringify(json);
      axios({
        method: "post",
        url: "/Order/AddUvOrder",
        data: datas,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.data.rows !== null) {
            this.submitText = "√ 已提交";
            allTotalPrice.CraftUV_submit = true;
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
    // UV
    deleteRowCraftUV(index, rows) {
      rows.splice(index, 1);
      this.computer();
    },
    addRowCraftUV(CraftUVData, event) {
      CraftUVData.push({
        item_height: "", //UV规格
        item_width: "", //UV规格
        unit_price: "", //单价
        total_price: "" //合计
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.CraftPrint_container {
  .Flex {
    display: flex;
  }
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
