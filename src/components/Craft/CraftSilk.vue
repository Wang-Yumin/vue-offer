<template>
  <div class="CraftPrint_container">
    <el-form-item>
      <el-table
        empty-text="点击+号,添加数据"
        border
        height="320"
        style="width: 100%"
        :data="CraftSilkData"
      >
        <!-- 部件 -->
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
        <!-- 颜色数量 -->
        <el-table-column label="颜色数" align="center" prop="item_color">
          <template slot-scope="scope">
            <el-input
              type="number"
              size="mini"
              @change="getNum(scope.$index)"
              v-model="scope.row.item_color"
            ></el-input>
          </template>
        </el-table-column>
        <!-- 丝印材料 -->
        <el-table-column label="丝印材料" align="center" prop="item_material">
          <template slot-scope="scope">
            <!-- 普通下拉框 -->
            <el-select v-model="scope.row.item_material" @change="selectMaterial(scope.$index)">
              <el-option
                v-for="(item,i) in item_materials"
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
              @click.native.prevent="deleteRowCraftSilk(scope.$index, CraftSilkData)"
              type="danger"
              size="small"
            >
              <i class="el-icon-close"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="addRowCraftSilk(CraftSilkData)">
        <i class="el-icon-plus"></i>
      </el-button>
    </el-form-item>
    <!-- 表单提交按钮 -->
    <div class="form-submit">
      <el-form-item size="mini">
        <div class="total_unit">
          <div>
            <el-button type="info" ref="totalPrice">丝印总价</el-button>
            <el-input disabled v-model="allTotalPrice.CraftSilk_price"></el-input>
          </div>
          <div>
            <el-button type="info" ref="totalPrice">丝印单价</el-button>
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
      // 工艺-丝印
      CraftSilkData: [
        {
          item_name: "", //丝印部件
          item_material: "", //丝印材料
          item_color: "", //颜色
          unit_price: "", //单价
          total_price: "" //合计
        }
      ],
      componentId: "", //部件Id(物料编号)
      item_names: [], //部件选择数组
      item_materials: [], //材料选择数组
      height: "",
      width: "",
      test: "",
      all_unit_price: 0
    };
  },
  mounted() {
    this.getAllMaterial();
  },
  computed: {
    ...mapState(["formInfo", "allTotalPrice", "orderInfo"]),
    listenOffer() {
      // 侦听表单提交成功的更新时间
      return this.$store.state.orderInfo.update_date;
    },
    listenPrice() {
      return this.$store.state.allTotalPrice.CraftSilk_price;
    },
    listenClean() {
      return this.$store.state.orderInfo.clean_date;
    }
  },
  watch: {
    listenOffer: function(newCount, oldCount) {
      this.submitText = "提交";
      this.$store.state.allTotalPrice.CraftSilk_submit = false;
      this.getAllComponent();
      if (
        this.$store.state.formInfo.qty &&
        this.$store.state.allTotalPrice.CraftSilk_price !== 0
      ) {
        let array = this.CraftSilkData;
        for (let i = 0; i < array.length; i++) {
          this.selectMaterial(i);
        }
      }
    },
    listenPrice(newCount, oldCount) {
      this.submitText = "提交";
      this.$store.state.allTotalPrice.CraftSilk_submit = false;
    },
    listenClean(newCount, oldCount) {
      this.all_unit_price = 0;
      return (this.CraftSilkData = [
        {
          item_name: "",
          item_material: "",
          item_color: "",
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
    // 获取部件
    selectComponent(index) {
      if (this.CraftSilkData[index].total_price) {
        this.computer();
        this.selectMaterial(index);
      }
    },
    // 获取丝印材料下拉数组
    getAllMaterial() {
      axios({
        method: "get",
        url: "/Technology/GetAllSilk"
      }).then(res => {
        let json2 = JSON.parse(res.data.rows);
        if (res.data.rows !== null) {
          for (let i = 0; i < json2.length; i++) {
            let obj2 = {
              text: json2[i].name,
              value: json2[i].id
            };
            this.item_materials.push(obj2);
          }
        }
      });
    },
    // 获取选择材料的id(并请求丝印单价)
    selectMaterial(index) {
      if (this.CraftSilkData[index].item_color) {
        axios({
          method: "get",
          url: "/Technology/GetSilkPrice",
          params: {
            silkId: this.CraftSilkData[index].item_material, //丝印ID
            orderNumber: this.$store.state.formInfo.qty //订单数量
          }
        }).then(res => {
          if (res.data.rows !== null) {
            // 合计
            this.CraftSilkData[index].total_price = res.data.rows;
            // 单价 = 总价/数量
            this.CraftSilkData[index].unit_price = (
              (this.CraftSilkData[index].total_price /
                this.$store.state.formInfo.qty) *
              this.CraftSilkData[index].item_color
            ).toFixed(3);
            // 颜色总价
            this.CraftSilkData[index].total_price = (
              this.CraftSilkData[index].total_price *
              this.CraftSilkData[index].item_color
            ).toFixed(3);
            this.computer();
          }
        });
      }
    },
    // 当输入颜色数量是 同步计算价钱
    getNum(index) {
      // 判断是否已经选中了丝印材料
      if (this.CraftSilkData[index].item_material) {
        this.selectMaterial(index);
      }
    },
    // 计算合计总价
    computer() {
      const { allTotalPrice, CraftSilkData, formInfo } = this;
      // 先归零,不然不会累积
      allTotalPrice.CraftSilk_price = 0;
      let array = 0;
      CraftSilkData.forEach(item => {
        array += parseFloat(item.total_price);
      });
      allTotalPrice.CraftSilk_price = array.toFixed(2);
      this.all_unit_price = (array / formInfo.qty).toFixed(3);
    },
    // 丝印单信息提交
    onSubmit() {
      const { CraftSilkData, formInfo, orderInfo, allTotalPrice } = this;
      // 每次点击提交就先将文字变成默认的
      this.submitText = "提交";
      allTotalPrice.CraftSilk_submit = false;
      const silks = [];
      // 遍历表单,获取需要提交的数据
      for (let i = 0; i < CraftSilkData.length; i++) {
        let obj = {
          item_no: CraftSilkData[i].item_name, //部件名称
          order_no: orderInfo.offerNumber, //订单号
          qty: formInfo.qty, //数量
          silk_id: CraftSilkData[i].item_material //丝印材料id
        };
        silks.push(obj);
      }
      let json = { silks };
      let datas = JSON.stringify(json);
      axios({
        method: "post",
        url: "/Technology/AddSilk",
        data: datas,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.data.rows !== null) {
            this.submitText = "√ 已提交";
            allTotalPrice.CraftSilk_submit = true;
            this.$message({
              showClose: true,
              message: "提交成功!",
              type: "success"
            });
          }
        })
        .catch(error => {
          {
            this.$message({
              showClose: true,
              message: "提交信息错误,或有空项",
              type: "warning"
            });
          }
        });
    },
    // 丝印
    deleteRowCraftSilk(index, rows) {
      rows.splice(index, 1);
      this.computer();
    },
    addRowCraftSilk(CraftSilkData, event) {
      CraftSilkData.push({
        item_name: "", //丝印部件
        item_material: "", //丝印材料
        item_color: "", //颜色
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
