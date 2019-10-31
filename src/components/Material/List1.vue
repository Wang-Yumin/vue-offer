<template>
  <div class="list_container">
    <el-form @submit.native.prevent ref="form" :model="formInfo" size="mini">
      <el-form-item>
        <el-table border :data="tableData" height="320" style="width: 100%">
          <!-- 部件名称 -->
          <el-table-column prop="item_name" label="部件" align="center">
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-model="scope.row.item_name"
                placeholder="名称"
                @change="getName(scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <!-- 规格选择 -->
          <el-table-column prop="item_name" label="规格" align="center" width="240">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.item_specs" @change="getSpecs(scope.$index)">
                <el-radio :label="2">全部</el-radio>
                <el-radio :label="1">正度</el-radio>
                <el-radio :label="0">大度</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <!-- 物料长代码 -->
          <el-table-column prop="item_length" label="物料长代码" align="center" width="210">
            <template slot-scope="scope">
              <div class="materiel_code">
                <el-select
                  v-model="scope.row.item_length"
                  filterable
                  no-data-text="请选择规格"
                  placeholder="搜索"
                  @change="selectGet(scope.$index)"
                  no-match-text="+号添加该材料"
                  size="mini"
                >
                  <el-option
                    v-for="(item,index) in tableData[scope.$index].item_lengths"
                    :key="index"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <a @click.prevent="addMaterial(scope.$index, tableData)">
                  <i class="el-icon-plus"></i>
                </a>
              </div>
            </template>
          </el-table-column>
          <!-- 用料规格 -->
          <el-table-column prop="remark" label="用料规格(MM)" align="center" width="170">
            <template slot-scope="scope">
              <div class="Flex">
                <el-input
                  size="mini"
                  placeholder="长"
                  type="number"
                  @change="getKaidu(scope.$index)"
                  ref="specsWidth"
                  v-model="scope.row.item_widthHeight[0].height"
                ></el-input>
                <el-input
                  size="mini"
                  placeholder="宽"
                  type="number"
                  @change="getKaidu(scope.$index)"
                  ref="specsHeight"
                  v-model="scope.row.item_widthHeight[0].width"
                  :disabled="scope.row.item_materiel"
                ></el-input>
                <!-- 下拉宽高填写 -->
                <div class="wh-dropdown">
                  <el-dropdown
                    trigger="click"
                    size="mini"
                    split-button
                    type="primary"
                    :hide-on-click="false"
                  >
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <!-- 下拉多规格 -->
                        <div class="down_table">
                          <table>
                            <tbody>
                              <tr
                                v-for="(item,index) in tableData[scope.$index].item_widthHeight"
                                :key="index"
                              >
                                <td>
                                  <input
                                    @change="getKaidu(scope.$index)"
                                    type="text"
                                    v-model="tableData[scope.$index].item_widthHeight[index].height"
                                    placeholder="长"
                                  />
                                </td>
                                <td>
                                  <input
                                    @change="getKaidu(scope.$index)"
                                    type="text"
                                    v-model="tableData[scope.$index].item_widthHeight[index].width"
                                    placeholder="宽"
                                  />
                                </td>
                                <td>
                                  <div class="down_number">
                                    <span
                                      :plain="true"
                                      @click="down_deletelist(scope.$index,index)"
                                      class="down_delete el-icon-close"
                                    ></span>
                                    <span
                                      :plain="true"
                                      @click="down_adddetail(scope.$index,index)"
                                      class="down_add el-icon-plus"
                                    ></span>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <!-- <div class="down_add">
                            <a @click="down_adddetail(scope.$index)">
                              <i class="el-icon-plus"></i>
                            </a>
                          </div>-->
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 开度 -->
          <el-table-column prop="item_kaidu" label="开度" align="center" width="100">
            <template slot-scope="scope">
              <div class="Flex">
                <el-input size="mini" disabled v-model="scope.row.item_kaidu.kaidu"></el-input>
                <el-input size="mini" disabled v-model="scope.row.item_kaidu.tuijian">{{item_kaidu}}</el-input>
              </div>
            </template>
          </el-table-column>
          <!-- 损耗率 -->
          <el-table-column prop="lost" label="损耗率%" align="center" width="80">
            <template slot-scope="scope">
              <el-input
                @change="getCost(scope.$index)"
                type="number"
                placeholder="百分比"
                ref="lostRate"
                size="mini"
                v-model="scope.row.lost"
              ></el-input>
            </template>
          </el-table-column>
          <!-- 用量 -->
          <el-table-column prop="cost" label="用量(单位)" align="center">
            <template slot-scope="scope">
              <div class="Flex">
                <el-input size="mini" disabled v-model="scope.row.cost"></el-input>
                <el-input size="mini" disabled v-model="scope.row.unit"></el-input>
              </div>
            </template>
          </el-table-column>
          <!-- 材料单价 -->
          <el-table-column prop="item_price" label="材料单价" align="center">
            <template slot-scope="scope">
              <el-input size="mini" disabled v-model="scope.row.item_price"></el-input>
            </template>
          </el-table-column>
          <!-- 模类 -->
          <el-table-column prop="mould_type" label="模类" align="center" width="120">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.mould_type"
                clearable
                @change="selectMould(scope.$index)"
              >
                <el-option
                  v-for="item in mould_types"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <!-- 模数 -->
          <el-table-column prop="mould_number" label="模数" align="center">
            <template slot-scope="scope">
              <el-input size="mini" disabled v-model="scope.row.mould_number"></el-input>
            </template>
          </el-table-column>
          <!-- 模总价 -->
          <el-table-column prop="mould_total" label="模总价" align="center">
            <template slot-scope="scope">
              <el-input size="mini" disabled v-model="scope.row.mould_total"></el-input>
            </template>
          </el-table-column>
          <!-- 单价 -->
          <el-table-column prop="unit_price" label="模单价" align="center">
            <template slot-scope="scope">
              <el-input size="mini" disabled v-model="scope.row.unit_price"></el-input>
            </template>
          </el-table-column>
          <!-- 合计 -->
          <el-table-column prop="total_price" label="合计" align="center">
            <template slot-scope="scope">
              <el-input size="mini" disabled v-model="scope.row.total_price"></el-input>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" width="50px" align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="danger"
                size="small"
              >
                <i class="el-icon-close"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 增加行数 -->
        <el-button type="primary" @click="addRow(tableData)">
          <i class="el-icon-plus"></i>
        </el-button>
      </el-form-item>
      <!-- 按钮 -->
      <div class="material_total">
        <el-form-item size="mini">
          <div class="total_unit">
            <div>
              <el-button type="info" ref="totalPrice">材料合计</el-button>
              <el-input disabled v-model="allTotalPrice.Material_price"></el-input>
            </div>
            <div>
              <el-button type="info" ref="totalPrice">材料单价</el-button>
              <el-input disabled v-model="all_unit_price"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item size="large">
          <el-button :plain="true" type="primary" @click="onSubmit">{{submitText}}</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!-- 新增材料 -->
    <AddMaterial ref="AddMt" v-bind:lengthChild="tableData_length" @AddChild="getSpecs()" />
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapState } from "vuex";
import AddMaterial from "../Material/AddMaterial.vue";
export default {
  data() {
    return {
      submitText: "提交并生成单号",
      totalPrice: "",
      item_kaidu: "",
      more_widthHeight: [
        // {
        //   width: "",
        //   height: ""
        // }
      ],
      // 材料
      tableData: [
        {
          item_name: "", //部件名称
          item_specs: "", //规格
          item_length: "", //物料长代码(这里是value)
          item_lengths: [], //物料长代码选择数组
          item_materiel: false, //选择物料时的 判断是否是带材
          // 用料规格
          item_widthHeight: [
            {
              height: "", //长
              width: "" //宽
            }
          ],
          //开度
          item_kaidu: {
            tuijian: "",
            kaidu: ""
          },
          lost: "", //损耗率
          cost: "", //用量
          unit: "", //用量单位
          kaidu_price: "", //单价开度
          item_price: "", //材料单价
          mould_type: "", //模类
          mould_number: "", //模数
          mould_total: "", //模总价
          unit_price: "", //单价
          total_price: "", //合计
          item_spec_Wnum: "",
          item_spec_Hnum: ""
        }
      ],
      tableData_length: [], //大数组的循环
      // addArry: [],
      selectGetId: "", //物料长代码Id
      selectMouldId: "", //模类Id
      // item_lengths: [], //物料长代码选择数组
      mould_types: [], //模类
      item_index: "0", //大行索引 默认是第一行
      more_index: "0", //多规格索引 默认是第一行
      all_unit_price: 0 //总单价
    };
  },
  mounted() {
    // this.getAllItems();
    this.getMould();
    // this.getItemType();
  },
  computed: {
    ...mapState(["userInfo", "orderInfo", "allTotalPrice"]),
    ...mapGetters(["formInfo"]),
    listenSpec_W() {
      return tableData[this.item_index];
    },
    listenSpec_H() {
      return tableData[this.item_index];
    },
    listenQty() {
      return this.$store.state.formInfo.qty;
    },
    listenPrice() {
      return this.$store.state.allTotalPrice.Material_price;
    },
    listenClean() {
      return this.$store.state.orderInfo.clean_date;
    }
  },
  watch: {
    listenSpec(newCount, oldCount) {
      let index = this.item_index;
      if (this.item_index !== "") {
        this.selectGet(index);
      }
    },
    listenQty(newCount, oldCount) {
      let array = this.tableData;
      if (this.$store.state.allTotalPrice.Material_price) {
        for (let i = 0; i < array.length; i++) {
          this.selectGet(i);
        }
      }
    },
    listenPrice(newCount, oldCount) {
      this.submitText = "提交并生成单号";
      this.$store.state.allTotalPrice.Material_submit = false;
    },
    listenClean(newCount, oldCount) {
      const { formInfo, orderInfo, allTotalPrice } = this;
      formInfo.modulus = "";
      formInfo.exchange = "";
      allTotalPrice.exchange = "";
      this.all_unit_price = 0;
      return (this.tableData = [
        {
          item_name: "",
          item_length: "",
          item_lengths: [],
          item_widthHeight: [
            {
              width: "",
              height: ""
            }
          ],
          item_kaidu: {
            tuijian: "",
            kaidu: ""
          },
          lost: "",
          cost: "",
          kaidu_price: "",
          item_price: "",
          mould_type: "",
          mould_number: "",
          mould_total: "",
          unit_price: "",
          total_price: ""
        }
      ]);
    }
  },
  methods: {
    getSpecs(index) {
      const { tableData } = this;
      // 先清空原来对应行数的数据
      let array = this.tableData[index].item_lengths;
      array.splice(0, array.length);
      let json = {
        type: tableData[index].item_specs
      };
      if (
        tableData[index].item_specs == 2 ||
        tableData[index].item_specs == 1 ||
        tableData[index].item_specs == 0
      ) {
        axios({
          method: "get",
          url: "/Items/GetAllItems",
          params: json
        }).then(res => {
          if (res.data.rows !== null) {
            let obj = JSON.parse(res.data.rows);
            for (let i = 0; i < obj.length; i++) {
              let data = {
                text: obj[i].item_name,
                value: obj[i].item_no
              };
              this.tableData[index].item_lengths.push(data);
            }
          }
        });
      }
    },
    // 侦听名字变动
    getName() {
      const { orderInfo } = this;
      orderInfo.update_date = Date.now(); //记录更新时间(毫秒)
      this.submitText = "提交并生成单号";
      this.$store.state.allTotalPrice.Material_submit = false;
    },
    // 点击+按钮(打开新增材料模态框))
    addMaterial(index) {
      this.tableData_length = this.tableData;
      this.$refs.AddMt._addMaterial(index);
    },
    // 获取物料长代码的下拉框
    selectGet(index) {
      let { formInfo, tableData, item_index } = this;
      if (tableData[index].item_length) {
        axios({
          method: "get",
          url: "/Items/GetItemCategory",
          params: {
            itemno: tableData[index].item_length
          }
        }).then(res => {
          if (res.data.rows === 3) {
            tableData[index].item_materiel = true;
            tableData[index].item_widthHeight[0].width = 0;
          } else {
            tableData[index].item_materiel = false;
          }
        });
        item_index = index;
        this.getKaidu(index);
      }
    },
    // 获取开度
    getKaidu(index) {
      this.item_index = index;
      // every过滤判断  当有空项目 则提示不让添加
      function check(item) {
        if (item.width === "" || item.height === "") {
          return false;
        } else {
          return true;
        }
      }
      if (this.tableData[index].item_widthHeight.every(check)) {
        const datas = {
          item_no: this.tableData[index].item_length,
          togethers: this.tableData[index].item_widthHeight
        };
        let data3 = JSON.stringify(datas);
        axios({
          method: "post",
          url: "/Items/GetOpeningDegree",
          data: data3,
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          if (res.data.rows == false) {
            this.tableData[index].item_widthHeight.splice(length - 1, 1);
            this.$message({
              showClose: true,
              message: "已超出规格,请添加一个新的部件",
              type: "warning"
            });
            return;
          }
          if (res.data.rows !== null) {
            let s = JSON.parse(res.data.rows);
            if (s.categoryId == 1 || s.categoryId == 4) {
              this.tableData[index].kaidu_price = s.basal_Specifications.price;
              let isjust = s.basal_Specifications.isjust;
              if (isjust) {
                this.tableData[index].item_kaidu.tuijian = "正度";
                this.tableData[index].item_kaidu.kaidu = s.Sum;
                this.tableData[index].item_spec_Wnum = s.item_spec_W;
                this.tableData[index].item_spec_Hnum = s.item_spec_H;
              } else {
                this.tableData[index].item_kaidu.tuijian = "大度";
                this.tableData[index].item_kaidu.kaidu = s.Sum;
                this.tableData[index].item_spec_Wnum = s.item_spec_W;
                this.tableData[index].item_spec_Hnum = s.item_spec_H;
              }
            } else if (s.categoryId == 2 || s.categoryId == 3) {
              this.tableData[index].kaidu_price = s.price;
              this.tableData[index].item_kaidu.tuijian = "一米";
              this.tableData[index].item_kaidu.kaidu = s.Sum;
              this.tableData[index].item_spec_Wnum = s.item_spec_W;
              this.tableData[index].item_spec_Hnum = s.item_spec_H;
            }
            if (
              this.tableData[index].lost &&
              this.tableData[index].item_kaidu.tuijian
            ) {
              this.getCost(index);
            }
          }
        });
      }
    },
    // 获取用量和材料单价(输入损耗率)
    getCost(index) {
      let { tableData } = this;
      this.item_index = index;
      // 封装好百分比转换小数的方法
      function toPoint(percent) {
        let str = percent.replace("%", "");
        str = str / 100;
        return str;
      }
      // 判断损耗率输入框失去焦点且不为空时
      if (tableData[index].lost && tableData[index].item_kaidu.kaidu) {
        // 用量=订单数量/开度*(1+损耗率)
        tableData[index].cost = Math.round(
          (this.$store.state.formInfo.qty / tableData[index].item_kaidu.kaidu) *
            (1 + toPoint(tableData[index].lost))
        );
        //材料单价=用量*物料单价/数量
        tableData[index].item_price = (
          (tableData[index].cost * tableData[index].kaidu_price) /
          this.$store.state.formInfo.qty
        ).toFixed(3);
        // 合计 = 材料单价*数量
        tableData[index].total_price = parseFloat(
          tableData[index].item_price * this.$store.state.formInfo.qty
        ).toFixed(2);
        // 判断单位
        tableData[index].unit =
          this.tableData[index].item_kaidu.tuijian == "一米" ? "米" : "张";
        // 判断是否执行获取模数
        if (tableData[index].mould_total) {
          this.selectMould(index);
        }
        this.computer();
      }
    },
    // 获取模具类型
    getMould() {
      axios({
        methods: "get",
        url: "/Items/GetMould"
      })
        .then(res => {
          if (res.data.rows !== null) {
            let myobj = JSON.parse(res.data.rows);
            for (let i = 0; i < myobj.length; i++) {
              let data2 = {
                text: myobj[i].Type,
                value: myobj[i].Id
              };
              this.mould_types.push(data2);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 获取选中模类型(同时计算单价和合计)
    selectMould(index) {
      const { formInfo, allTotalPrice, tableData } = this;
      this.item_index = index;
      let obj = {
        mould: tableData[index].mould_type,
        togethers: tableData[index].item_widthHeight,
        OpeningDegreeSum: tableData[index].item_kaidu.kaidu,
        Consumption: tableData[index].cost,
        item_spec_Wnum: tableData[index].item_spec_Wnum,
        item_spec_Hnum: tableData[index].item_spec_Hnum,
        OrderNum: formInfo.qty
      };
      let json = JSON.stringify(obj);
      // 先判断是否获取了材料单价
      if (
        tableData[index].mould_type &&
        tableData[index].item_kaidu.kaidu &&
        tableData[index].cost
      ) {
        axios({
          method: "post",
          url: "/Items/MouldNum",
          data: json,
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          if (res.data.rows !== null) {
            var mold = JSON.parse(res.data.rows);
            tableData[index].mould_number = mold.number;
            // 模总价
            tableData[index].mould_total = mold.values.toFixed(2);
            // 模单价 = 模总价/总数量
            tableData[index].unit_price = (
              tableData[index].mould_total / formInfo.qty
            ).toFixed(3);
            // 合计 = 模总价+用量*单价
            tableData[index].total_price = (
              parseFloat(tableData[index].mould_total) +
              parseFloat(tableData[index].cost * tableData[index].kaidu_price)
            ).toFixed(2);
            // 并计算合计总价
            this.computer();
          }
        });
      } else {
        // 模数
        tableData[index].mould_number =
          tableData[index].mould_type == "" ? 0 : tableData[index].mould_number;
        // 模总价
        tableData[index].mould_total =
          tableData[index].mould_type == "" ? 0 : tableData[index].mould_total;
        // 模单价
        tableData[index].unit_price =
          tableData[index].mould_type == "" ? 0 : tableData[index].unit_price;
        // 合计
        let totalPrice = 0;
        tableData[index].total_price =
          tableData[index].mould_type == ""
            ? (totalPrice = parseFloat(
                // 合计 = 材料单价*数量
                tableData[index].item_price * this.$store.state.formInfo.qty
              ).toFixed(2))
            : tableData[index].total_price;
        this.computer();
      }
    },
    // 计算合计总价
    computer() {
      const { allTotalPrice, tableData, formInfo } = this;
      // 先归零,不然会累积
      allTotalPrice.Material_price = 0;
      let array = 0;
      // 方法一
      // for (let i = 0; i < tableData.length; i++) {
      //   array += parseFloat(item.total_price);
      // }
      // 方法二
      tableData.forEach(item => {
        array += parseFloat(item.total_price);
      });
      allTotalPrice.Material_price = array.toFixed(2);
      this.all_unit_price = (array / formInfo.qty).toFixed(3);
    },
    // 材料表单提交
    onSubmit() {
      const { formInfo, orderInfo, userInfo, tableData, allTotalPrice } = this;
      if (
        allTotalPrice.Material_price !== 0 &&
        formInfo.customer_name &&
        formInfo.Contacts &&
        formInfo.customer_phone &&
        formInfo.Email &&
        formInfo.item_name &&
        formInfo.item_spec.length &&
        formInfo.item_spec.width &&
        formInfo.item_spec.height &&
        formInfo.qty &&
        formInfo.boxing &&
        formInfo.completed_date
      ) {
        this.$confirm("确认提交并生成单号?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 每次点击提交就先将文字变成默认的
            this.submitText = "提交并生成单号";
            allTotalPrice.Material_submit = false;
            let spec =
              formInfo.item_spec.length +
              "*" +
              formInfo.item_spec.width +
              "*" +
              formInfo.item_spec.height;

            // 客户信息、产品信息
            const order = {
              order_no: orderInfo.offerNumber,
              item_name: formInfo.item_name,
              Boxing: formInfo.boxing,
              item_spec: spec,
              status: 1,
              qty: formInfo.qty,
              Email: formInfo.Email,
              Contacts: formInfo.Contacts,
              customer_name: formInfo.customer_name,
              customer_phone: formInfo.customer_phone,
              completed_date: formInfo.completed_date,
              creator: userInfo.Id, //需要登录
              create_date: orderInfo.create_date
            };
            // 材料信息(在tableData中循环获取,因为每一行都不一样)
            const basal_Items = [];
            const materials = [];
            // 百分比转换小数
            function toPoint(percent) {
              let str = percent.replace("%", "");
              str = str / 100;
              return str;
            }
            // 遍历表单,获取需要提交的数据
            for (let i = 0; i < tableData.length; i++) {
              let mould_type =
                tableData[i].mould_type == "" ? 0 : tableData[i].mould_type;
              let mould_number =
                tableData[i].mould_type == "" ? 0 : tableData[i].mould_number;
              let mould_total =
                tableData[i].mould_type == "" ? 0 : tableData[i].mould_type;
              let unit_price =
                tableData[i].unit_price == "" ? 0 : tableData[i].mould_type;

              let obj = {
                item_no: tableData[i].item_length,
                qty: tableData[i].cost,
                parts_name: tableData[i].item_name, //产品名
                kdNumber: tableData[i].item_kaidu.kaidu, //开度
                totalPrice: tableData[i].total_price, //合计
                opening: tableData[i].item_kaidu.tuijian, //开度 正度/大度
                wastage: toPoint(tableData[i].lost), //耗损率
                price: tableData[i].item_price, //材料单价
                moduleId: mould_type, //模类Id
                moduleNumber: mould_number, //模数
                modulePrice: mould_total, //模总价
                moduleunitPrice: unit_price, //单价
                materials: tableData[i].item_widthHeight
              };
              basal_Items.push(obj);
            }
            let json = {
              order: order,
              basal_Items: basal_Items
            };
            let datas = JSON.stringify(json);
            // console.log(datas); //打印检查
            axios({
              method: "post",
              url: "/Order/AddOrder",
              data: datas,
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(res => {
                if (res.data.rows !== null) {
                  orderInfo.offerNumber = res.data.rows;
                  orderInfo.update_date = Date.now(); //记录更新时间(毫秒)
                  this.submitText = "√ 已提交";
                  allTotalPrice.Material_submit = true; //提交成功状态
                  this.$message({
                    showClose: true,
                    message: "提交成功!",
                    type: "success"
                  });
                }
              })
              .catch(() => {
                this.$message({
                  showClose: true,
                  message: "提交信息错误",
                  type: "warning"
                });
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else {
        this.$message.error("关键信息不能为空!");
      }
    },
    // tableData-材料
    deleteRow(index, rows) {
      //删除改行
      rows.splice(index, 1);
      this.computer();
    },
    // 增加行
    addRow(tableData, event) {
      tableData.push({
        item_name: "", //部件名称
        item_length: "", //物料长代码
        item_lengths: [],
        // 用料规格
        item_widthHeight: [
          {
            width: "",
            height: ""
          }
        ],
        //开度
        item_kaidu: {
          tuijian: "",
          kaidu: ""
        },
        lost: "", //损耗率
        cost: "", //用量
        kaidu_price: "", //单价开度
        item_price: "", //材料单价
        mould_type: "",
        mould_number: "", //模数
        mould_total: "", //模总价
        unit_price: "", //单价
        total_price: "" //合计
      });
    },
    // 计算开度
    computeLineMin(index) {
      this.getKaidu(index);
    },
    addLineMin(index) {
      //添加新的行数
      this.tableData[index].item_widthHeight.push({
        width: "",
        height: ""
      });
    },
    handleDelete(index) {
      //删除行数
      this.more_widthHeight.splice(index, 1);
    },
    // 多规格
    down_adddetail(index, i) {
      // 如果有空则不让添加下一行
      let _this = this;
      function check(item) {
        if (item.width === "" || item.height === "") {
          return false;
        } else {
          _this.more_index = i;
          return true;
        }
      }
      if (this.tableData[index].item_widthHeight.every(check)) {
        this.tableData[index].item_widthHeight.push({
          width: "",
          height: ""
        });
      } else {
        this.$message({
          showClose: true,
          message: "请填写完当前规格",
          type: "warning"
        });
      }
    },
    down_deletelist(index, i) {
      if (this.tableData[index].item_widthHeight.length > 1) {
        this.tableData[index].item_widthHeight.splice(i, 1);
        this.getKaidu(index);
      } else {
        this.$message({
          showClose: true,
          message: "至少有一行规格！",
          type: "warning"
        });
      }
    },
    // 当前时间
    nowTimes() {
      let now = new Date();
      let year = now.getFullYear(); //得到年份
      let month = now.getMonth(); //得到月份
      let date = now.getDate(); //得到日期
      let day = now.getDay(); //得到周几
      let hour = now.getHours(); //得到小时
      let minu = now.getMinutes(); //得到分钟
      let sec = now.getSeconds(); //得到秒
      let week;
      month = month + 1;
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      if (hour < 10) hour = "0" + hour;
      if (minu < 10) minu = "0" + minu;
      if (sec < 10) sec = "0" + sec;
      let time = "";
      // time = year + "-" + month + "-" + date + " " + hour + ":" + minu;
      time = year + "-" + month + "-" + date + " " + hour + ":" + minu;
      return time;
      //设置得到当前日期的函数的执行间隔时间，每1000毫秒刷新一次。
      // let timer = setTimeout("writeCurrentDate()", 1000);
    }
  },
  components: {
    AddMaterial
  }
};
</script>

<style lang="scss" scoped>
.list_container {
  .materiel_code {
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

  .material_total {
    .total_unit {
      margin-top: -10px;
    }
    display: flex;
    justify-content: flex-end;
    /deep/ .el-input {
      width: 40%;
    }
  }
  /deep/ .el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
    padding: 0;
    text-align: center;
  }

  /deep/ .el-table--enable-row-transition .el-table__body td {
    padding: 5px 0;
  }

  .wh-dropdown {
    /deep/ .el-button-group > .el-button:first-child {
      display: none;
    }

    /deep/ .el-button-group > .el-button:last-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    /deep/ .el-dropdown-menu__item i {
      margin: 0px;
    }
  }
}

// 这家伙搞特殊,被父级嵌套 就不生效
.form_body {
  // height: 500px;
  border: 1px solid #409eff;
  position: relative;
  .Flex {
    display: flex;
  }
}
// 下拉框天写长宽
.down_table {
  width: 135px;
  table {
    width: 135px;
    font-size: 14px;
    // border: 1px solid #eee;
    tbody {
      td {
        // padding: 5px;
        text-align: center;
        // border-bottom: 1px solid #eee;
        // border-right: 1px solid #eee;
        span {
          margin-left: 5px;
          width: 20px;
          height: 20px;
          display: block;
          // margin: 0 10px;
          cursor: pointer;
          text-align: center;
          line-height: 20px;
          border-radius: 3px;
        }
        input {
          border: 1px solid #ccc;
          padding: 5px;
          border-radius: 3px;
          width: 35px;
          height: 12px;
          text-align: center;
        }
        .down_number {
          display: flex;
          .down_delete {
            color: #fff;
            background: #f78989;
          }
          .down_add {
            color: #fff;
            background: #409eff;
          }
        }
      }
    }
  }
}
</style>
