<template>
  <div class="CraftPrint_container">
    <el-form-item>
      <el-table
        empty-text="点击+号,添加数据"
        border
        height="320"
        style="width: 100%"
        :data="CraftPrintData"
      >
        <!-- 印刷部件 -->
        <el-table-column label="印刷部件" prop="item_name" align="center">
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
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- 印刷开度 -->
        <el-table-column label="印刷开度" prop="item_kaidu" align="center">
          <template slot-scope="scope">
            <el-input disabled size="mini" v-model="scope.row.item_kaidu"></el-input>
          </template>
        </el-table-column>
        <!-- 车头数 -->
        <el-table-column label="车头数" prop="head_number" align="center">
          <template slot-scope="scope">
            <el-input disabled size="mini" v-model="scope.row.head_number"></el-input>
          </template>
        </el-table-column>
        <!-- 颜色数 -->
        <el-table-column label="颜色数" prop="color_number" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.color_number"
              no-data-text="请选择部件"
              @change="selectColor(scope.$index)"
            >
              <el-option
                v-for="(item,i) in CraftPrintData[scope.$index].color_numbers"
                :key="i"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- 印刷总价 -->
        <el-table-column label="印刷总价" prop="print_total" align="center">
          <template slot-scope="scope">
            <el-input disabled size="mini" v-model="scope.row.print_total"></el-input>
          </template>
        </el-table-column>
        <!-- 印刷单价 -->
        <el-table-column label="印刷单价" prop="print_unit" align="center">
          <template slot-scope="scope">
            <el-input disabled size="mini" v-model="scope.row.print_unit"></el-input>
          </template>
        </el-table-column>
        <!-- 是否过胶 -->
        <el-table-column label="是否过胶" prop="checked" align="center">
          <template slot-scope="scope">
            <div class="over">
              <el-checkbox v-model="scope.row.checked" @change="isOver(scope.$index)">过胶</el-checkbox>
              <el-select
                v-if="scope.row.checked"
                v-model="scope.row.over_type"
                @change="selectOver(scope.$index)"
              >
                <el-option
                  v-for="item in over_types"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <!-- 过胶总价 -->
        <el-table-column label="过胶总价" prop="over_total" align="center">
          <template slot-scope="scope">
            <el-input v-if="scope.row.checked" disabled size="mini" v-model="scope.row.over_total"></el-input>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <!-- 合计 -->
        <el-table-column label="合计" prop="total_price" align="center">
          <template slot-scope="scope">
            <el-input disabled size="mini" v-model="scope.row.total_price"></el-input>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="50px" align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRowCraftPrint(scope.$index, CraftPrintData)"
              type="danger"
              size="small"
            >
              <i class="el-icon-close"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 增加行数 -->
      <el-button type="primary" @click="addRowCraftPrint(CraftPrintData)">
        <i class="el-icon-plus"></i>
      </el-button>
    </el-form-item>
    <!-- 表单提交按钮 -->
    <div class="form-submit">
      <el-form-item size="mini">
        <div class="total_unit">
          <div>
            <el-button type="info" ref="totalPrice">印刷总价</el-button>
            <el-input disabled v-model="allTotalPrice.CraftPrint_price"></el-input>
          </div>
          <div>
            <el-button type="info" ref="totalPrice">印刷单价</el-button>
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
      // 工艺-印刷
      CraftPrintData: [
        {
          item_name: "", //印刷部件(id)
          item_kaidu: "", //印刷开度
          head_number: "", //车头数
          color_number: "", //颜色数
          color_numbers: [],
          print_total: "", //印刷总价
          print_unit: "", //印刷单价
          checked: false, //是否过胶
          over_type: "", //过胶类型
          over_total: 0, //过胶总价
          total_price: 0 //合计
        }
      ],
      // componentId: "", //部件Id(物料编号)
      item_names: [], //印刷部件选择数组
      // color_numbers: [], //颜色数量
      over_types: [], //过胶类型
      height: "",
      width: "",
      all_unit_price: 0 //总单价
    };
  },
  computed: {
    ...mapState(["formInfo", "allTotalPrice", "orderInfo"]),
    listenOffer() {
      // 侦听表单提交成功的更新时间
      return this.$store.state.orderInfo.update_date;
    },
    listenPrice() {
      return this.$store.state.allTotalPrice.CraftPrint_price;
    },
    listenClean() {
      return this.$store.state.orderInfo.clean_date;
    }
  },
  watch: {
    // 侦听计算属性方法变化
    listenOffer: function(newCount, oldCount) {
      this.submitText = "提交";
      this.$store.state.allTotalPrice.CraftPrint_submit = false;
      this.getAllComponent();
      if (this.$store.state.formInfo.qty) {
        let array = this.CraftPrintData;
        for (let i = 0; i < array.length; i++) {
          this.selectComponent(i);
        }
      }
    },
    listenPrice(newCount, oldCount) {
      this.submitText = "提交";
      this.$store.state.allTotalPrice.CraftPrint_submit = false;
    },
    listenClean(newCount, oldCount) {
      this.all_unit_price = 0;
      return (this.CraftPrintData = [
        {
          item_name: "",
          item_kaidu: "",
          head_number: "",
          color_number: "",
          color_numbers: [],
          print_total: "",
          print_unit: "",
          checked: false,
          over_type: "",
          over_total: 0,
          total_price: 0
        }
      ]);
    }
  },
  mounted() {
    this.getAllOver();
  },
  methods: {
    // 获取印刷部件下拉选择数组
    getAllComponent() {
      let array = this.item_names;
      array.splice(0, array.length);
      this.item_names = [];
      axios({
        methods: "get",
        url: "/Technology/GetParts",
        params: {
          order_no: this.$store.state.orderInfo.offerNumber
        }
      }).then(res => {
        if (res.data.rows !== null) {
          // let array = this.item_names;
          // array.splice(0, array.length);
          let obj = JSON.parse(res.data.rows);
          for (let i = 0; i < obj.length; i++) {
            let obj2 = {
              text: obj[i].parts_name, //部件名
              value: obj[i].id
            };
            this.item_names.push(obj2);
          }
        }
      });
    },
    // 获取部件id(并请求对应开度和车头数量)
    selectComponent(index) {
      // 根据部件id获取对应部件名字
      let obj = {};
      let name = "";
      let value = this.CraftPrintData[index].item_name;
      // 先校验是否获取了部件名
      if (this.CraftPrintData[index].item_name) {
        // obj = this.item_names.find(item => {
        //   return item.value === value;
        // });
        // name = obj.text;
        axios({
          method: "get",
          url: "/Technology/GetHeadNumber",
          params: {
            id: value, //物料编号
            order_no: this.$store.state.orderInfo.offerNumber
          }
        }).then(res => {
          if (res.data.rows !== null) {
            let json = JSON.parse(res.data.rows);
            this.CraftPrintData[index].item_kaidu = json.printingnumber;
            this.CraftPrintData[index].head_number = json.headhumber;
            this.height = json.height;
            this.width = json.width;
            // 选择部件后 获取颜色数
            this.getAllColor(index);
            // 如修改部件 则触发后面的价格变动
            this.isOver(index);
            // 如部件变动,且合计不为空,则触发印刷总价的获取
            if (this.CraftPrintData[index].print_total) {
              this.selectColor(index);
            }
          }
        });
      }
    },
    // 获取颜色数组(在选择部件之后直接触发)
    getAllColor(index) {
      let array = this.CraftPrintData[index].color_numbers;
      array.splice(0, array.length);
      axios({
        method: "get",
        url: "/Technology/GetColour",
        params: {
          printingOpening: this.CraftPrintData[index].item_kaidu
        }
      }).then(res => {
        if (res.data.rows !== null) {
          let obj = JSON.parse(res.data.rows);
          for (let i = 0; i < obj.length; i++) {
            let obj2 = {
              text: obj[i].name,
              value: obj[i].id
            };
            array.push(obj2);
          }
        }
      });
    },
    // 获取颜色id(并计算印刷总价和印刷单价---默认合计设置为印刷总价)
    selectColor(index) {
      let printingId = [this.CraftPrintData[index].color_number];
      let json = {
        headhumber: this.CraftPrintData[index].head_number,
        printingkd: this.CraftPrintData[index].item_kaidu,
        printingId: printingId
      };
      axios({
        method: "post",
        url: "/Technology/GetTotal",
        data: json,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        if (res.data.rows !== null) {
          this.CraftPrintData[index].print_total = res.data.rows;
          // 根据给的印刷总价 计算单价
          this.CraftPrintData[index].print_unit =
            this.CraftPrintData[index].print_total /
            this.$store.state.formInfo.qty;
          // 总价 = 过胶价+印刷总价
          this.CraftPrintData[index].total_price = (
            parseFloat(this.CraftPrintData[index].over_total) +
            parseFloat(this.CraftPrintData[index].print_total)
          ).toFixed(2);
          this.computer();
        }
      });
    },
    // 获取过胶类型数组
    getAllOver() {
      axios({
        method: "get",
        url: "/Technology/GetOverGlue"
      }).then(res => {
        if (res.data.rows !== null) {
          let obj = JSON.parse(res.data.rows);
          for (let i = 0; i < obj.length; i++) {
            let obj2 = {
              text: obj[i].name,
              value: obj[i].id
            };
            this.over_types.push(obj2);
          }
        }
      });
    },
    // 获取过胶类型id(并获取过胶总价和合计)
    selectOver(index) {
      if (this.CraftPrintData[index].over_type) {
        let json = {
          ordersum: this.$store.state.formInfo.qty,
          headNumber: this.CraftPrintData[index].head_number,
          height: this.height,
          width: this.width,
          overGlueId: this.CraftPrintData[index].over_type
        };
        // console.log(json)
        if (this.CraftPrintData[index].total_price) {
          axios({
            method: "get",
            url: "/Technology/GetPrice",
            params: json
          }).then(res => {
            if (res.data.rows !== null) {
              this.CraftPrintData[index].over_total = (
                res.data.rows * this.$store.state.formInfo.qty
              ).toFixed(2);
              // 总价 = 过胶价+印刷总价
              this.CraftPrintData[index].total_price = (
                parseFloat(this.CraftPrintData[index].over_total) +
                parseFloat(this.CraftPrintData[index].print_total)
              ).toFixed(2);
              this.computer();
            }
          });
        }
      }
    },
    // 是否勾选过胶
    isOver(index) {
      if (this.CraftPrintData[index].print_unit) {
        if (this.CraftPrintData[index].checked) {
          this.selectColor(index);
          this.selectOver(index);
          this.computer();
        } else {
          this.CraftPrintData[index].over_total = 0;
          this.selectColor(index);
        }
      }
    },
    // 计算合计总价
    computer() {
      const { allTotalPrice, CraftPrintData, formInfo } = this;
      // 先归零,不然不会累积
      allTotalPrice.CraftPrint_price = 0;
      let array = 0;
      CraftPrintData.forEach(item => {
        array += parseFloat(item.total_price);
      });
      allTotalPrice.CraftPrint_price = array.toFixed(2);
      this.all_unit_price = (array / formInfo.qty).toFixed(3);
    },
    // 提交工艺-印刷表单提交
    onSubmit() {
      const { CraftPrintData, formInfo, orderInfo, allTotalPrice } = this;
      // 每次点击提交就先将文字变成默认的
      this.submitText = "提交";
      allTotalPrice.CraftPrint_submit = false;
      const printings = [];
      const glues = [];
      // 遍历表单,获取需要提交的数据
      for (let i = 0; i < CraftPrintData.length; i++) {
        let obj = {
          item_no: CraftPrintData[i].item_name, //印刷部件id
          order_no: orderInfo.offerNumber, //订单号
          qty: formInfo.qty, //数量
          printing_id: CraftPrintData[i].color_number, //颜色id
          totalPrice: CraftPrintData[i].print_total //印刷总价
        };
        printings.push(obj);
        let obj2 = {
          item_no: CraftPrintData[i].item_name, //印刷部件id
          glue_id: CraftPrintData[i].over_type, //过胶id
          order_no: orderInfo.offerNumber, //订单号
          totalPrice: CraftPrintData[i].over_total //过胶总价
        };
        if (
          this.CraftPrintData[i].checked &&
          this.CraftPrintData[i].over_type
        ) {
          glues.push(obj2);
        }
      }
      let array = { printings, glues };
      let json = JSON.stringify(array); //或许需要
      // console.log(json);
      axios({
        method: "post",
        url: "/Technology/AddOrderPrinting",
        data: json,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.data.rows == null) {
            this.submitText = "√ 已提交";
            allTotalPrice.CraftPrint_submit = true;
            this.$message({
              showClose: true,
              message: res.data.msg,
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
    test() {},
    // 印刷-增删行
    deleteRowCraftPrint(index, rows) {
      rows.splice(index, 1);
      this.computer();
    },
    addRowCraftPrint(CraftPrintData, event) {
      CraftPrintData.push({
        item_name: "", //印刷部件(id)
        item_kaidu: "", //印刷开度
        head_number: "", //车头数
        color_number: "", //颜色数
        color_numbers: [],
        print_total: "", //印刷总价
        print_unit: "", //印刷单价
        checked: false, //是否过胶
        over_type: "", //过胶类型
        over_total: 0, //过胶总价
        total_price: 0 //合计
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
  .over {
    display: flex;
    /deep/.el-input--mini .el-input__inner {
      width: 85px;
    }
  }
  /deep/.el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
    text-align: center;
  }
  /deep/ .el-table td,
  .el-table th {
    padding: 8px 0;
  }
  /deep/ .el-table td,
  .el-table th {
    padding: 5px 0;
  }
}
</style>
