<template>
  <section class="form_header">
    <el-form
      @submit.native.prevent
      ref="form"
      :rules="rules"
      :model="formInfo"
      label-width="80px"
      size="mini"
    >
      <div class="form-header">
        <el-form-item label="报价日期:">
          <span>{{orderInfo.create_date}}</span>
        </el-form-item>
        <el-form-item label="报价单号:">
          <span v-if="orderInfo.offerNumber==''">初次提交表单后生成</span>
          <span v-else>{{orderInfo.offerNumber}}</span>
        </el-form-item>
        <el-form-item label="报价员:">
          <span>{{userInfo.RealName}}</span>
        </el-form-item>
      </div>
      <div class="form-title">
        <el-form-item>客户信息</el-form-item>
        <el-form-item>产品信息</el-form-item>
        <el-form-item>导入图片</el-form-item>
      </div>
      <div class="form-info">
        <!-- 客户信息 -->
        <div class="form-box">
          <el-form-item prop="customer_name" label="客户">
            <el-input v-model="formInfo.customer_name" placeholder="必填"></el-input>
          </el-form-item>
          <el-form-item label="网址">
            <el-input placeholder="www" v-model="formInfo.www"></el-input>
          </el-form-item>
          <el-form-item label="国家/地区">
            <!-- <el-input v-model="formInfo.Country"></el-input> -->
            <!-- <el-row class="demo-autocomplete"> -->
            <div class="form-box-kuanshi">
              <!-- <el-col :span="12"> -->
              <el-autocomplete
                class="inline-input"
                v-model="formInfo.Country"
                :fetch-suggestions="querySearch"
                placeholder="选择"
                @select="handleSelect"
              ></el-autocomplete>
              <!-- </el-col> -->
            </div>
            <!-- </el-row> -->
          </el-form-item>
          <el-form-item label="地址">
            <el-input placeholder="详细地址" v-model="formInfo.Address"></el-input>
          </el-form-item>
          <el-form-item prop="Contacts" label="联系人">
            <el-input v-model="formInfo.Contacts" placeholder="必填"></el-input>
          </el-form-item>
          <el-form-item prop="customer_phone" label="电话">
            <el-input v-model="formInfo.customer_phone" placeholder="必填"></el-input>
          </el-form-item>
          <el-form-item prop="Email" label="邮箱">
            <el-input v-model="formInfo.Email" placeholder="必填"></el-input>
          </el-form-item>
          <el-form-item label="其它">
            <el-input v-model="formInfo.other" placeholder="可不填"></el-input>
          </el-form-item>
        </div>
        <!-- 产品信息 -->
        <div class="form-box">
          <el-form-item prop="item_name" label="品名">
            <el-input v-model="formInfo.item_name" placeholder="品牌名称"></el-input>
          </el-form-item>
          <el-form-item label="款式">
            <div class="form-box-kuanshi">
              <el-select v-model="formInfo.kuanshi" placeholder="请选择款式">
                <el-option label="款式一" value="shanghai"></el-option>
                <el-option label="款式二" value="beijing"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item prop="item_spec" label="规格">
            <div class="demo_input_size">
              <el-input
                size="mini"
                placeholder="长-MM"
                type="number"
                v-model="formInfo.item_spec.length"
              ></el-input>
              <el-input
                size="mini"
                placeholder="宽-MM"
                type="number"
                v-model="formInfo.item_spec.width"
              ></el-input>
              <el-input
                size="mini"
                placeholder="高-MM"
                type="number"
                v-model="formInfo.item_spec.height"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="qty" label="数量">
            <el-input placeholder="PCS" type="number" v-model="formInfo.qty"></el-input>
          </el-form-item>
          <el-form-item prop="boxing" label="装箱">
            <el-input placeholder="PCS" type="number" v-model="formInfo.boxing"></el-input>
          </el-form-item>
          <el-form-item prop="completed_date" label="交期">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="formInfo.completed_date"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2"></el-col>
          </el-form-item>
          <el-form-item label="报价方式">
            <!-- 限制型多选 -->
            <el-checkbox-group v-model="checkedCities" :min="0" :max="2">
              <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="价格(个)">
            <div class="demo_input_price">
              <div class="price_item">
                <el-input disabled placeholder="CNY" v-model="allTotalPrice.priceUnit"></el-input>
              </div>
              <div>
                <el-radio-group v-model="radio" size="small" @change="exchangeRate">
                  <el-radio label="1">CNY</el-radio>
                  <el-radio label="2">USD</el-radio>
                  <el-radio label="3">EUR</el-radio>
                </el-radio-group>
              </div>
            </div>
          </el-form-item>
        </div>
        <!-- 导入图片 -->
        <div class="form-box">
          <el-form-item>
            <div class="upload_files">
              <el-upload
                class="avatar-uploader"
                :file-list="uploadFiles"
                ref="upload"
                :on-success="upLoadSuccess"
                :on-error="upLoadError"
                :action="uploadURL"
                :auto-upload="false"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button
                  style="margin-left: 10px;"
                  size="small"
                  type="success"
                  @click="submitUpload"
                >确认上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </div>
            <img v-if="formInfo.imageUrl" :src="formInfo.imageUrl" class="avatar" />
          </el-form-item>
          <div class="keep_clean">
            <!-- <el-button @click="onReset" icon="el-icon-refresh-left">重置页面</el-button> -->
            <el-button @click="onClean" icon="el-icon-delete-solid">清空数据</el-button>
          </div>
        </div>
      </div>
    </el-form>
  </section>
</template>

<script>
import { mapGetters, mapState } from "vuex";
// import { countryList } from "../../assets/js/countryList.js"; //引入世界国家列表
const cityOptions = ["EXW", "FOB", "CIF", "CFR", "VAT"];
export default {
  data() {
    // 手机正则校验
    // var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    // var validatePhone = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("号码不能为空!!"));
    //   }
    //   setTimeout(() => {
    //     if (!phoneReg.test(value)) {
    //       callback(new Error("格式有误"));
    //     } else {
    //       callback();
    //     }
    //   }, 500);
    // };
    // 邮箱正则校验
    // var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
    // var validateEmail = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("邮箱不能为空!!"));
    //   }
    //   setTimeout(() => {
    //     if (!emailReg.test(value)) {
    //       callback(new Error("格式有误"));
    //     } else {
    //       callback();
    //     }
    //   }, 500);
    // };
    return {
      radio: "1", //汇率默认选项
      // 选择国家地区列表
      restaurants: [],
      state1: "",
      // 图片上传
      projectName: "",
      uploadFiles: [], //上传的文件列表
      checkedCities: ["EXW", "VAT"],
      cities: cityOptions,
      // 校验规则
      rules: {
        // 主要通过validator来指定验证器名称
        // Email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        Email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
        customer_phone: [
          { required: true, message: "电话不能为空", trigger: "blur" }
        ],
        // 不加规则,只校验非空
        item_spec: [
          {
            required: true, //是否必填
            message: "规格不能为空", //规则
            trigger: "blur" //何事件触发
          }
        ],
        Contacts: [
          {
            required: true, //是否必填
            message: "联系人不能为空", //规则
            trigger: "blur" //何事件触发
          }
        ],
        customer_name: [
          {
            required: true, //是否必填
            message: "客户名不能为空", //规则
            trigger: "blur" //何事件触发
          }
        ],
        item_name: [
          {
            required: true, //是否必填
            message: "品名不能为空", //规则
            trigger: "blur" //何事件触发
          }
        ],
        qty: [
          {
            required: true, //是否必填
            message: "数量不能为空", //规则
            trigger: "blur" //何事件触发
          }
        ],
        boxing: [
          {
            required: true, //是否必填
            message: "装箱不能为空", //规则
            trigger: "blur" //何事件触发
          }
        ],
        completed_date: [
          {
            required: true, //是否必填
            message: "交期不能为空", //规则
            trigger: "blur" //何事件触发
          }
        ]
      }
    };
  },
  mounted() {
    this.orderInfo.create_date = this.nowTimes();
    this.restaurants = this.loadAll();
    //在页面加载时读取localStorage里的状态信息
    localStorage.getItem("formInfo") &&
      this.$store.replaceState(
        Object.assign(
          this.$store.state,
          JSON.parse(localStorage.getItem("formInfo"))
        )
      );

    //在页面刷新时将vuex里的信息保存到localStorage里
    // window.addEventListener("beforeunload",()=>{
    //     localStorage.setItem("userMsg",JSON.stringify(this.$store.state))
    // })
  },
  computed: {
    ...mapState(["userInfo", "orderInfo"]),
    ...mapGetters(["formInfo", "getFormInfo", "allTotalPrice"]),
    //文件的上传路径
    //附带用户id和项目名称
    uploadURL() {
      return (
        "http://192.168.101.21:8787/api/UpLoad/UploadFile?userId=" +
        this.userInfo.Id
      );
    },
    listenClean() {
      return this.$store.state.orderInfo.clean_date;
    }
  },
  watch: {
    listenClean(newCount, oldCount) {
      const { formInfo, orderInfo, allTotalPrice } = this;
      orderInfo.offerNumber = "";
      orderInfo.create_date = this.nowTimes();
      formInfo.total_price = "";
      formInfo.unit_price = "";
      formInfo.item_name = "";
      formInfo.kuanshi = "";
      formInfo.item_spec.length = "";
      formInfo.item_spec.width = "";
      formInfo.item_spec.height = "";
      formInfo.qty = "";
      formInfo.imageUrl = "";
      this.checkedCities = ["EXW", "VAT"];
      this.radio = "1";
    }
  },
  methods: {
    exchangeRate(value) {
      const { allTotalPrice } = this;
      if (value == 1) {
        allTotalPrice.price_unit = " ￥";
      } else if (value == 2) {
        allTotalPrice.price_unit = " $";
      } else if (value == 3) {
        allTotalPrice.price_unit = " €";
      }
      allTotalPrice.priceUnit =
        allTotalPrice.all_unit_price + allTotalPrice.price_unit;
    },
    // 选择/搜索选择国家地区
    querySearch(queryString, cb) {
      var restaurants = this.restaurants.countryList;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      let countryList = require("../../assets/js/countryList.js");
      return countryList;
    },
    handleSelect(item) {
      // console.log(item);
    },
    // 创建报价时间
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
    },
    //文件上传
    submitUpload() {
      this.$refs.upload.submit();
    },
    //文件上传成功时的钩子
    upLoadSuccess(response, file, fileList) {
      this.$store.state.formInfo.imageUrl =
        "http://192.168.101.21:8787/api/UpLoad/getProblemImg?width=200&imageName=" +
        response;
    },
    //文件上传失败时的钩子
    upLoadError(response, file, fileList) {
      // console.log("项目添加失败");
    },
    onClean() {
      const { orderInfo } = this;
      this.$confirm("确认清空表单 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          orderInfo.clean_date = Date.now(); //记录更新时间(毫秒)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    onReset() {
      this.$confirm("确认重置报价单 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return location.reload(); //刷新页面
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>


<style lang="scss" scope>
.form_header {
  // .el-table td,
  // .el-table th {
  //   padding: 0 !important;
  //   text-align: left;
  // }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 15px;
  }
  .el-form {
    border: 1px solid #409eff;
    // height: 500px;
    overflow: hidden;

    .form-header {
      display: flex;
      justify-content: flex-end;
      background: #efeff1;

      .el-form-item {
        margin: 0;

        span {
          display: block;
          margin-right: 45px;
        }
      }
    }

    .form-title {
      display: flex;

      .el-form-item {
        width: 33.33%;
        // padding-left: 206px;
        margin: 0;
      }
    }
    .form-info .el-input--suffix .el-input__inner {
      // padding-right: 30px;
      width: 218%;
    }
    .form-info {
      position: relative;
      display: flex;
      padding-top: 10px;
      .form-box {
        .upload_files {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .avatar {
            width: 178px;
            height: 178px;
            display: block;
            margin: 0 auto;
          }
        }

        width: 33.33%;
        padding-left: 1px;
        .form-box-kuanshi {
          display: flex;
          .el-input--suffix .el-input__inner {
            width: 100%;
          }
        }

        .el-form-item {
          .el-radio--mini.is-bordered {
            margin: 0;
            margin-right: 3px;
            padding: 0 2px;
            border-radius: 3px;
            height: 28px;

            .el-radio__input {
              cursor: pointer;
              vertical-align: middle;
              line-height: 28px;
            }

            .el-radio__label {
              padding-left: 5px;
            }
          }

          .el-checkbox {
            margin-right: 15px;
          }
        }
        .demo_input_size {
          display: flex;

          // .el-input__inner {
          //   // width: 142px;
          // }
        }
        .demo_input_price {
          display: flex;
          .price_item {
            width: 30%;
            margin-right: 20px;
          }
        }
      }
      .keep_clean {
        position: absolute;
        right: 10px;
        bottom: -40px;
      }
    }
  }
}
</style>