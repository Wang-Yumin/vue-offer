<template>
  <div class="LaborCostChild_container">
    <el-form @submit.native.prevent ref="form" :model="Form" size="mini">
      <el-form-item>
        <el-table
          empty-text="点击+号,添加数据"
          border
          height="360"
          style="width: 100%"
          :data="LaborCostData"
        >
          <!-- 步骤 -->
          <el-table-column label="步骤" align="center" prop="item_step">
            <template slot-scope="scope">
              <div class="item_code">
                <el-select
                  v-model="scope.row.item_step"
                  filterable
                  placeholder="搜索"
                  @change="selectStep(scope.$index)"
                  no-match-text="+号添加"
                >
                  <el-option
                    v-for="(item,i) in item_steps"
                    :key="i"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <a @click.prevent="addStep(scope.$index)">
                  <i class="el-icon-plus"></i>
                </a>
              </div>
            </template>
          </el-table-column>
          <!-- 工位数 -->
          <el-table-column label="工位数" align="center" prop="item_number">
            <template slot-scope="scope">
              <el-input
                size="mini"
                type="number"
                @change="getPrice(scope.$index)"
                v-model="scope.row.item_number"
              ></el-input>
            </template>
          </el-table-column>
          <!-- 产能 -->
          <el-table-column label="产能" align="center" prop="capacity">
            <template slot-scope="scope">
              <el-input disabled size="mini" v-model="scope.row.capacity"></el-input>
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
                @click.native.prevent="deleteRowLaborCost(scope.$index, LaborCostData)"
                type="danger"
                size="small"
              >
                <i class="el-icon-close"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 增加行数 -->
        <el-button type="primary" @click="addRowLaborCost(LaborCostData)">
          <i class="el-icon-plus"></i>
        </el-button>
      </el-form-item>
      <!-- 表单提交按钮 -->
      <div class="form-submit">
        <el-form-item size="mini">
          <div class="total_unit">
            <div>
              <el-button type="info" ref="totalPrice">工费总价</el-button>
              <el-input disabled v-model="allTotalPrice.LaborCost_price"></el-input>
            </div>
            <div>
              <el-button type="info" ref="totalPrice">工费单价</el-button>
              <el-input disabled v-model="all_unit_price"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item size="large">
          <el-button :plain="true" type="primary" @click="onSubmit">{{submitText}}</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!-- 新增 -->
    <div class="add_step">
      <el-dialog
        title="新增"
        :visible="addStepForm"
        :modal-append-to-body="false"
        @close="closeDialog"
      >
        <el-form id="#addsForm" ref="addsForm" :model="addsForm" label-width="110px">
          <el-form-item label="工序名称" prop="item_name">
            <el-input v-model="addsForm.item_name"></el-input>
          </el-form-item>
          <el-form-item label="产品代码" prop="item_code">
            <el-input v-model="addsForm.item_code"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="stepAdd()">确定</el-button>
            <el-button @click="addStepForm = false;">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
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
      addStepForm: false, //新增模态框
      addsForm: {
        item_name: "", //工序名称
        item_code: "" //产品代码
      },
      Form: {},
      // 工费
      LaborCostData: [
        {
          item_step: "", //步骤
          item_number: "", //工位数
          capacity: "", //产能
          unit_price: "", //单价
          total_price: "" //合计
        }
      ],
      item_steps: [], //步骤选择数组
      all_unit_price: 0
    };
  },
  mounted() {
    this.getAllStepId();
  },
  computed: {
    ...mapState(["formInfo", "allTotalPrice", "orderInfo"]),
    listenOffer() {
      // 侦听表单提交成功的更新时间
      return this.$store.state.orderInfo.update_date;
    },
    listenPrice() {
      return this.$store.state.allTotalPrice.LaborCost_price;
    },
    listenClean() {
      return this.$store.state.orderInfo.clean_date;
    }
  },
  watch: {
    listenOffer: function(newCount, oldCount) {},
    listenPrice(newCount, oldCount) {
      this.submitText = "提交";
      this.$store.state.allTotalPrice.LaborCost_submit = false;
    },
    listenClean(newCount, oldCount) {
      this.all_unit_price = 0;
      return (this.LaborCostData = [
        {
          item_step: "",
          item_number: "",
          capacity: "",
          unit_price: "",
          total_price: ""
        }
      ]);
    }
  },
  methods: {
    // 获取步骤下拉选择数组
    getAllStepId() {
      axios({
        method: "get",
        url: "/Post/GetWorkingProcedure"
      }).then(res => {
        let json2 = JSON.parse(res.data.rows);
        if (res.data.rows !== null) {
          for (let i = 0; i < json2.length; i++) {
            let obj2 = {
              text: json2[i].router_name,
              value: json2[i].id
            };
            this.item_steps.push(obj2);
          }
        }
      });
    },
    selectStep(index) {
      this.getPrice(index);
    },
    // 点击+号按钮(弹出模态框)
    addStep() {
      this.addStepForm = true;
    },
    // 关闭新增材料模态框
    closeDialog() {
      this.addStepForm = false;
    },
    // 点击新增信息模态框的确定按钮（确定新增信息） 将所增信息提交给后台
    stepAdd() {
      let stepList = this.addsForm;
      let { item_code, item_name } = stepList;
      //判断数据是否为空
      if (item_code == "" || item_name == "") {
        this.$message.error("不能有数据为空");
      } else {
        //每一条都不为空时才向后台发送请求
        let json = {
          item_code: item_code,
          item_name: item_name
        };
        axios({
          method: "post",
          url: "/Backstage/AddItem",
          data: json,
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          if (res.data.rows !== false) {
            this.getAllItems();
            this.addMaterialForm = false;
            this.$message.success(res.data.msg + "!");
          }
        });
      }
    },
    // 输入数量(获取单价和合计)
    getPrice(index) {
      const { LaborCostData } = this;
      if (LaborCostData[index].item_number && LaborCostData[index].item_step) {
        axios({
          method: "get",
          url: "/Post/GetPost",
          params: {
            rid: LaborCostData[index].item_step, //步骤id
            Workstation: LaborCostData[index].item_number
          }
        }).then(res => {
          if (res.data.rows !== null) {
            let obj = JSON.parse(res.data.rows);
            LaborCostData[index].capacity = obj.capacity;
            LaborCostData[index].unit_price = obj.price.toFixed(3);
            LaborCostData[index].total_price = (
              LaborCostData[index].unit_price * this.$store.state.formInfo.qty
            ).toFixed(2);
            this.computer();
          }
        });
      }
    },
    // 计算合计总价
    computer() {
      const { allTotalPrice, LaborCostData, formInfo } = this;
      // 先归零,不然不会累积
      allTotalPrice.LaborCost_price = 0;
      let array = 0;
      LaborCostData.forEach(item => {
        array += parseFloat(item.total_price);
      });
      allTotalPrice.LaborCost_price = array.toFixed(2);
      this.all_unit_price = (array / formInfo.qty).toFixed(3);
    },
    // 工费单信息提交
    onSubmit() {
      const { LaborCostData, allTotalPrice } = this;
      // 每次点击提交就先将文字变成默认的
      this.submitText = "提交";
      allTotalPrice.LaborCost_submit = false;
      const rel_Routers = [];
      // 遍历表单,获取需要提交的数据
      for (let i = 0; i < LaborCostData.length; i++) {
        let obj = {
          order_id: 0,
          order_no: this.$store.state.orderInfo.offerNumber, //订单号
          router_id: LaborCostData[i].item_step, //步骤id
          router_code: "",
          totalPrice: LaborCostData[i].total_price
        };
        rel_Routers.push(obj);
      }
      let json = { rel_Routers }; //或许需要
      let datas = JSON.stringify(json);
      axios({
        method: "post",
        url: "/Post/AddPost",
        data: datas,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.data.rows == null) {
            this.submitText = "√ 已提交";
            allTotalPrice.LaborCost_submit = true;
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
    // 工费
    deleteRowLaborCost(index, rows) {
      rows.splice(index, 1);
      this.computer();
    },
    addRowLaborCost(LaborCostData, event) {
      LaborCostData.push({
        item_step: "", //步骤
        item_number: "", //次数
        unit_price: "", //单价
        total_price: "" //合计
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.LaborCostChild_container {
  .add_step {
    /deep/ .el-dialog__header {
      padding: 0;
      height: 100px;
      line-height: 100px;
    }
    /deep/.el-dialog__body {
      text-align: left;
    }
  }
  .item_code {
    a {
      display: inline-block;
      background: #409eff;
      border: 0;
      border-radius: 3px;
      color: #fff;
      width: 25px;
      height: 25px;
    }
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
}
</style>
