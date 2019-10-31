<template>
  <div class="package_content">
    <el-form @submit.native.prevent ref="form" :model="Form" size="mini">
      <el-form-item>
        <el-tabs stretch type="border-card" style="height: 470px;">
          <!-- 内纸箱 -->
          <el-tab-pane label="内纸箱">
            <el-table :data="inside_box.insideData1" ref="table" tooltip-effect="dark" border>
              <el-table-column label="材料" align="center" prop="package_name"></el-table-column>
              <el-table-column label="长mm" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.package_length" type="number"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="宽mm" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.package_width" type="number"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="高mm" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.package_height" type="number"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <el-table :data="inside_box.insideData2" ref="table" tooltip-effect="dark" border>
              <el-table-column label="装箱数量" align="center">
                <template slot-scope="scope">
                  <el-input
                    disabled
                    ref="inside_number"
                    v-model="scope.row.package_num"
                    type="number"
                  ></el-input>
                  <!-- <span>{{formInfo.boxing}}</span> -->
                </template>
              </el-table-column>
              <el-table-column prop="name" label="纸箱材料" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.inside_material" @change="select_inside">
                    <el-option
                      v-for="(item,i) in inside_materials"
                      :key="i"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="损耗率" align="center">
                <template slot-scope="scope">
                  <el-input
                    ref="inside_lost"
                    @change="getInsidePrice(scope.$index)"
                    type="number"
                    v-model="scope.row.package_lost"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="单价" align="center">
                <template slot-scope="scope">
                  <el-input disabled v-model="scope.row.package_price"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <div class="from-submit">
              <el-form-item size="mini">
                <div class="total_unit">
                  <div>
                    <el-button type="info" ref="totalPrice">内纸箱总价</el-button>
                    <el-input disabled v-model="allTotalPrice.InsidePackage_price"></el-input>
                  </div>
                  <div>
                    <el-button type="info" ref="totalPrice">内纸箱单价</el-button>
                    <el-input disabled v-model="all_unit_inside"></el-input>
                  </div>
                </div>
              </el-form-item>
              <el-form-item size="large">
                <el-button
                  size="medium"
                  round
                  :plain="true"
                  type="primary"
                  @click="savaInsideBox"
                >{{insideSubmit}}</el-button>
              </el-form-item>
            </div>
          </el-tab-pane>
          <!-- 外纸箱 -->
          <el-tab-pane label="外纸箱">
            <el-table :data="outside_box.outsideData1" ref="table" tooltip-effect="dark" border>
              <el-table-column label="材料" align="center" prop="package_name"></el-table-column>
              <el-table-column label="长mm" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.package_length" type="number"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="宽mm" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.package_width" type="number"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="高mm" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.package_height" type="number"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <el-table :data="outside_box.outsideData2" ref="table" tooltip-effect="dark" border>
              <el-table-column label="装箱数量" align="center">
                <template slot-scope="scope">
                  <el-input
                    disabled
                    ref="outside_number"
                    v-model="scope.row.package_num"
                    type="number"
                  ></el-input>
                  <!-- <span>{{formInfo.boxing}}</span> -->
                </template>
              </el-table-column>
              <el-table-column prop="name" label="纸箱材料" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.outside_material" @change="select_outside">
                    <el-option
                      v-for="(item,i) in outside_materials"
                      :key="i"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="损耗率" align="center">
                <template slot-scope="scope">
                  <el-input
                    ref="outside_lost"
                    @change="getOutsidePrice(scope.$index)"
                    type="number"
                    v-model="scope.row.package_lost"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="单价" align="center">
                <template slot-scope="scope">
                  <el-input disabled v-model="scope.row.package_price"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <div class="from-submit">
              <el-form-item size="mini">
                <div class="total_unit">
                  <div>
                    <el-button type="info" ref="totalPrice">外纸箱总价</el-button>
                    <el-input disabled v-model="allTotalPrice.OutsidePackage_price"></el-input>
                  </div>
                  <div>
                    <el-button type="info" ref="totalPrice">外纸箱单价</el-button>
                    <el-input disabled v-model="all_unit_outside"></el-input>
                  </div>
                </div>
              </el-form-item>
              <el-form-item size="large">
                <el-button
                  size="medium"
                  round
                  :plain="true"
                  type="primary"
                  @click="savaOutsideBox"
                >{{outsideSubmit}}</el-button>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from "axios";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      insideSubmit: "提交",
      outsideSubmit: "提交",
      box: true,
      Form: {},
      inside_box: {
        insideData1: [
          {
            rowNum: 1,
            package_name: "盒子规格",
            package_length: "",
            package_width: "",
            package_height: ""
          },
          {
            rowNum: 2,
            package_name: "摆放方式",
            package_length: "",
            package_width: "",
            package_height: ""
          },
          {
            rowNum: 3,
            package_name: "纸箱规格",
            package_length: "",
            package_width: "",
            package_height: ""
          }
        ],
        insideData2: [
          {
            rowNum: 1,
            package_num: "", //装箱数量
            inside_material: "",
            package_lost: "", //损耗率
            package_price: ""
          }
        ]
      },
      outside_box: {
        outsideData1: [
          {
            rowNum: 1,
            package_name: "盒子规格",
            package_length: "",
            package_width: "",
            package_height: ""
          },
          {
            rowNum: 2,
            package_name: "摆放方式",
            package_length: "",
            package_width: "",
            package_height: ""
          },
          {
            rowNum: 3,
            package_name: "纸箱规格",
            package_length: "",
            package_width: "",
            package_height: ""
          }
        ],
        outsideData2: [
          {
            rowNum: 1,
            package_num: "", //装箱数量
            outside_material: "",
            package_lost: "", //损耗率
            package_price: ""
          }
        ]
      },
      inside_materials: [], //内纸箱材料选择数组
      inside_id: "", //内纸箱材料id
      outside_materials: [], //外纸箱材料选择数组
      outside_id: "", //外纸箱材料id
      material_price: [],
      all_unit_inside: 0, //内纸箱总单价
      all_unit_outside: 0 //外纸箱总单价
    };
  },
  computed: {
    ...mapState(["orderInfo", "allTotalPrice"]),
    ...mapGetters(["formInfo"]),
    // 将vuex的state绑定计算属性
    listenBoxing() {
      return this.$store.state.formInfo.boxing;
    },
    listenLength() {
      return this.$store.state.formInfo.item_spec.length;
    },
    listenWidth() {
      return this.$store.state.formInfo.item_spec.width;
    },
    listenHeight() {
      return this.$store.state.formInfo.item_spec.height;
    },
    // 绑定摆放方式的属性
    // 内
    _insideLength() {
      return this.inside_box.insideData1[1].package_length;
    },
    _insideWidth() {
      return this.inside_box.insideData1[1].package_width;
    },
    _insideHeight() {
      return this.inside_box.insideData1[1].package_height;
    },
    // 外
    _outsideLength() {
      return this.outside_box.outsideData1[1].package_length;
    },
    _outsideWidth() {
      return this.outside_box.outsideData1[1].package_width;
    },
    _outsideHeight() {
      return this.outside_box.outsideData1[1].package_height;
    },
    // 侦听表单提交成功的更新时间
    listenOffer() {
      return this.$store.state.orderInfo.update_date;
    },
    // 侦听合计总价是否变动
    listenInside() {
      return this.$store.state.allTotalPrice.InsidePackage_price;
    },
    listenOutside() {
      return this.$store.state.allTotalPrice.OutsidePackage_price;
    },
    listenClean() {
      return this.$store.state.orderInfo.clean_date;
    }
  },
  watch: {
    listenOffer: function(newCount, oldCount) {
      if (
        this.$store.state.formInfo.qty &&
        this.$store.state.allTotalPrice.InsidePackage_price !== 0
      ) {
        this.getInsidePrice();
      }
      if (
        this.$store.state.formInfo.qty &&
        this.$store.state.allTotalPrice.OutsidePackage_price !== 0
      ) {
        this.getOutsidePrice();
      }
    },
    listenInside(newCount, oldCount) {
      this.insideSubmit = "提交";
      this.$store.state.allTotalPrice.InsidePackage_submit = false;
    },
    listenOutside(newCount, oldCount) {
      this.outsideSubmit = "提交";
      this.$store.state.allTotalPrice.OutsidePackage_submit = false;
    },
    // 侦听计算属性方法变化
    listenBoxing(newCount, oldCount) {
      const { inside_box, outside_box, formInfo } = this;
      this.getData();
      // 内纸箱
      if (formInfo.boxing) {
        this.getInsidePrice();
      }
      // 外纸箱
      if (formInfo.boxing) {
        this.getOutsidePrice();
      }
    },
    listenLength(newCount, oldCount) {
      this.getData();
    },
    listenWidth(newCount, oldCount) {
      this.getData();
    },
    listenHeight(newCount, oldCount) {
      this.getData();
    },
    // 侦听摆放方式的属性变动
    _insideLength(newCount, oldCount) {
      const { inside_box } = this;
      if (this.$store.state.formInfo.qty) {
        inside_box.insideData1[2].package_length =
          inside_box.insideData1[1].package_length *
            inside_box.insideData1[0].package_length +
          20;
      }
    },
    _insideWidth(newCount, oldCount) {
      const { inside_box } = this;
      if (this.$store.state.formInfo.qty) {
        inside_box.insideData1[2].package_width =
          inside_box.insideData1[1].package_width *
            inside_box.insideData1[0].package_width +
          20;
      }
    },
    _insideHeight(newCount, oldCount) {
      const { inside_box } = this;
      if (this.$store.state.formInfo.qty) {
        inside_box.insideData1[2].package_height =
          inside_box.insideData1[1].package_height *
            inside_box.insideData1[0].package_height +
          20;
      }
    },
    _outsideLength(newCount, oldCount) {
      const { outside_box } = this;
      if (this.$store.state.formInfo.qty) {
        outside_box.outsideData1[2].package_length =
          outside_box.outsideData1[1].package_length *
            outside_box.outsideData1[0].package_length +
          20;
      }
    },
    _outsideWidth(newCount, oldCount) {
      const { outside_box } = this;
      if (this.$store.state.formInfo.qty) {
        outside_box.outsideData1[2].package_width =
          outside_box.outsideData1[1].package_width *
            outside_box.outsideData1[0].package_width +
          20;
      }
    },
    _outsideHeight(newCount, oldCount) {
      const { outside_box } = this;
      if (this.$store.state.formInfo.qty) {
        outside_box.outsideData1[2].package_height =
          outside_box.outsideData1[1].package_height *
            outside_box.outsideData1[0].package_height +
          20;
      }
    },
    listenClean(newCount, oldCount) {
      const { inside_box, outside_box } = this;
      this.all_unit_inside = 0;
      this.all_unit_outside = 0;
      this.inside_box = {
        insideData1: [
          {
            rowNum: 1,
            package_name: "盒子规格",
            package_length: "",
            package_width: "",
            package_height: ""
          },
          {
            rowNum: 2,
            package_name: "摆放方式",
            package_length: "",
            package_width: "",
            package_height: ""
          },
          {
            rowNum: 3,
            package_name: "纸箱规格",
            package_length: "",
            package_width: "",
            package_height: ""
          }
        ],
        insideData2: [
          {
            rowNum: 1,
            package_num: "", //装箱数量
            inside_material: "",
            package_lost: "", //损耗率
            package_price: ""
          }
        ]
      };
      this.outside_box = {
        outsideData1: [
          {
            rowNum: 1,
            package_name: "盒子规格",
            package_length: "",
            package_width: "",
            package_height: ""
          },
          {
            rowNum: 2,
            package_name: "摆放方式",
            package_length: "",
            package_width: "",
            package_height: ""
          },
          {
            rowNum: 3,
            package_name: "纸箱规格",
            package_length: "",
            package_width: "",
            package_height: ""
          }
        ],
        outsideData2: [
          {
            rowNum: 1,
            package_num: "", //装箱数量
            outside_material: "",
            package_lost: "", //损耗率
            package_price: ""
          }
        ]
      };
      inside_box.insideData1[2].package_length = "";
      inside_box.insideData1[2].package_width = "";
      inside_box.insideData1[2].package_height = "";
      outside_box.outsideData1[2].package_length = "";
      outside_box.outsideData1[2].package_width = "";
      outside_box.outsideData1[2].package_height = "";
      return;
    }
  },
  mounted() {
    this.getAllMaterial();
  },
  methods: {
    // 同步产品信息输入的长宽高和装箱数量
    getData() {
      const { inside_box, outside_box, formInfo } = this;
      // 内纸箱
      inside_box.insideData1[0].package_length = formInfo.item_spec.length;
      inside_box.insideData1[0].package_width = formInfo.item_spec.width;
      inside_box.insideData1[0].package_height = formInfo.item_spec.height;
      inside_box.insideData2[0].package_num = formInfo.boxing;
      // 外纸箱
      outside_box.outsideData1[0].package_length = formInfo.item_spec.length;
      outside_box.outsideData1[0].package_width = formInfo.item_spec.width;
      outside_box.outsideData1[0].package_height = formInfo.item_spec.height;
      outside_box.outsideData2[0].package_num = formInfo.boxing;
    },
    // 获取所有纸箱材料(内外都一样)
    getAllMaterial() {
      axios({
        method: "get",
        url: "/Carton/GetCarton"
      }).then(res => {
        if (res.data.rows !== 0) {
          let json = JSON.parse(res.data.rows);
          for (let i = 0; i < json.length; i++) {
            let obj = {
              text: json[i].Type,
              value: json[i].id
            };
            this.inside_materials.push(obj);
            this.outside_materials.push(obj);
            this.material_price.push(json[i].price);
          }
        }
      });
    },
    // 输入内纸箱损耗率(单价计算)
    getInsidePrice() {
      // 封装好百分比转换小数的方法
      function toPoint(percent) {
        let str = percent.replace("%", "");
        str = str / 100;
        return str;
      }
      if (this.inside_box.insideData2[0].package_lost && this.inside_id) {
        axios({
          method: "get",
          url: "/Carton/GetPrice",
          params: {
            cartonId: this.inside_id, //纸箱id
            Wastage: toPoint(this.inside_box.insideData2[0].package_lost), //耗损率
            carton_sum: this.$store.state.formInfo.boxing, //装箱数量
            carton_high: this.inside_box.insideData1[2].package_height, //高(纸箱规格)
            carton_w: this.inside_box.insideData1[2].package_width, //宽(纸箱规格)
            carton_h: this.inside_box.insideData1[2].package_length //长(纸箱规格)
          }
        }).then(res => {
          if (res.data.rows) {
            // console.log(res.data.rows);
            this.inside_box.insideData2[0].package_price = res.data.rows;
            this.computer_inside();
          }
        });
      }
    },
    // 输入外纸箱损耗率(单价计算)
    getOutsidePrice() {
      // 封装好百分比转换小数的方法
      function toPoint(percent) {
        let str = percent.replace("%", "");
        str = str / 100;
        return str;
      }
      // console.log(toPoint(this.outside_box.outsideData2[0].package_lost));
      if (this.outside_box.outsideData2[0].package_lost && this.outside_id) {
        let json = {
          cartonId: this.outside_id, //纸箱id
          Wastage: toPoint(this.outside_box.outsideData2[0].package_lost), //耗损率
          carton_sum: this.$store.state.formInfo.boxing, //装箱数量
          carton_high: this.outside_box.outsideData1[2].package_height, //高(纸箱规格)
          carton_w: this.outside_box.outsideData1[2].package_width, //宽(纸箱规格)
          carton_h: this.outside_box.outsideData1[2].package_length //长(纸箱规格)
        };
        // console.log(json);
        axios({
          method: "get",
          url: "/Carton/GetPrice",
          params: json
        }).then(res => {
          if (res.data.rows) {
            this.outside_box.outsideData2[0].package_price = res.data.rows;
            this.computer_outside();
          }
        });
      }
    },
    // 选择内纸箱
    select_inside(value) {
      this.inside_id = value;
      if (this.inside_box.insideData2[0].package_lost) {
        this.getInsidePrice();
      }
    },
    // 选择外纸箱
    select_outside(value) {
      this.outside_id = value;
      if (this.outside_box.outsideData2[0].package_lost) {
        this.getOutsidePrice();
      }
    },
    // 计算内纸箱总价
    computer_inside() {
      const { allTotalPrice, formInfo, inside_box } = this;
      allTotalPrice.InsidePackage_price = 0; // 先归零,不然不会累积
      // 将单价*数量得出的合计 存放到vuex
      allTotalPrice.InsidePackage_price =
        inside_box.insideData2[0].package_price * formInfo.qty;
      this.all_unit_inside = (
        allTotalPrice.InsidePackage_price / formInfo.qty
      ).toFixed(3);
    },
    // 计算外纸箱总价
    computer_outside() {
      const { allTotalPrice, formInfo, outside_box } = this;
      allTotalPrice.OutsidePackage_price = 0; // 先归零,不然不会累积
      // 将单价*数量得出的合计 存放到vuex
      allTotalPrice.OutsidePackage_price =
        outside_box.outsideData2[0].package_price * formInfo.qty;
      this.all_unit_outside = (
        allTotalPrice.OutsidePackage_price / formInfo.qty
      ).toFixed(3);
    },
    // 提交内纸箱
    savaInsideBox() {
      this.getData();
      // 每次点击提交就先将文字变成默认的
      this.insideSubmit = "提交";
      this.$store.state.allTotalPrice.InsidePackage_submit = false;
      // 封装好百分比转换小数的方法
      function toPoint(percent) {
        let str = percent.replace("%", "");
        str = str / 100;
        return str;
      }
      if (this.inside_box.insideData2[0].package_price !== "") {
        const { inside_box, formInfo, orderInfo } = this;
        let data1 = {
          boxingnum: this.$store.state.formInfo.boxing,
          orderSum: this.$store.state.formInfo.qty,
          order_Cartons: [
            {
              order_no: orderInfo.offerNumber, //订单号
              carton_id: inside_box.insideData2[0].inside_material, //纸箱材料
              totalPrice:
                inside_box.insideData2[0].package_price * formInfo.qty, //单价*数量
              boxLength: formInfo.item_spec.length, //盒子规格长
              boxWidth: formInfo.item_spec.width, //盒子规格宽
              boxHeight: formInfo.item_spec.height, //盒子规格高
              attritionRate: toPoint(inside_box.insideData2[0].package_lost), //耗损率
              price: inside_box.insideData2[0].package_price, //单价
              longCartonSize: inside_box.insideData1[2].package_length, //纸箱规格长
              cartonSizeWidth: inside_box.insideData1[2].package_width, //纸箱规格宽
              cartonHeight: inside_box.insideData1[2].package_height, //纸箱规格高
              longPlacement: inside_box.insideData1[1].package_length, //摆放方式长
              widePlacing: inside_box.insideData1[1].package_width, //摆放方式宽
              highPlacement: inside_box.insideData1[1].package_height, //摆放方式高
              cartonType: 1 //纸箱类别  外0 内1
            }
          ]
        };
        let json = JSON.stringify(data1);
        axios({
          method: "post",
          url: "/Carton/AddCarton",
          data: json,
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          if (res.data.rows !== null) {
            this.insideSubmit = "√ 已提交";
            this.$store.state.allTotalPrice.InsidePackage_submit = true;
            this.$message({
              showClose: true,
              message: "提交成功!",
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: "提交信息错误",
              type: "warning"
            });
          }
        });
      } else {
        this.$message.error("提交内容错误");
      }
    },
    // 提交外纸箱
    savaOutsideBox() {
      // 每次点击提交就先将文字变成默认的
      this.outsideSubmit = "提交";
      this.$store.state.allTotalPrice.OutsidePackage_submit = false;
      // 封装好百分比转换小数的方法
      function toPoint(percent) {
        let str = percent.replace("%", "");
        str = str / 100;
        return str;
      }
      if (this.outside_box.outsideData2[0].package_price !== "") {
        const { outside_box, formInfo, orderInfo } = this;
        let data1 = {
          boxingnum: formInfo.boxing,
          orderSum: formInfo.qty,
          order_Cartons: [
            {
              order_no: orderInfo.offerNumber, //订单号
              carton_id: outside_box.outsideData2[0].outside_material, //纸箱材料
              totalPrice:
                outside_box.outsideData2[0].package_price * formInfo.qty, //单价*数量
              boxLength: formInfo.item_spec.length, //盒子规格长
              boxWidth: formInfo.item_spec.width, //盒子规格宽
              boxHeight: formInfo.item_spec.height, //盒子规格高
              attritionRate: toPoint(outside_box.outsideData2[0].package_lost), //耗损率
              price: outside_box.outsideData2[0].package_price, //单价
              longCartonSize: outside_box.outsideData1[2].package_length, //纸箱规格长
              cartonSizeWidth: outside_box.outsideData1[2].package_width, //纸箱规格宽
              cartonHeight: outside_box.outsideData1[2].package_height, //纸箱规格高
              longPlacement: outside_box.outsideData1[1].package_length, //摆放方式长
              widePlacing: outside_box.outsideData1[1].package_width, //摆放方式宽
              highPlacement: outside_box.outsideData1[1].package_height, //摆放方式高
              cartonType: 0 //纸箱类别  外0 内1
            }
          ]
        };
        let json = JSON.stringify(data1);
        // console.log(json);
        axios({
          method: "post",
          url: "/Carton/AddCarton",
          data: json,
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => {
            if (res.data.rows !== null) {
              this.outsideSubmit = "√ 已提交";
              this.$store.state.allTotalPrice.OutsidePackage_submit = true;
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
                message: "提交信息错误",
                type: "warning"
              });
            }
          });
      } else {
        this.$message.error("提交内容错误");
      }
    }
  }
};
</script>


<style lang="scss" scope>
.package_content {
  position: relative;
  .from-submit {
    .total_unit {
      margin-top: -10px;
    }
    padding-top: 40px;
    display: flex;
    justify-content: flex-end;
    .el-input {
      width: 40%;
    }
  }
  .el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
    text-align: center;
  }
}
</style>