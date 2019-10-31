<template>
  <div class="add_material">
    <el-dialog
      title="新增材料"
      :visible="addMaterialForm"
      :modal-append-to-body="false"
      @close="closeDialog"
    >
      <el-form id="#addsForm" ref="addsForm" :model="addsForm" label-width="110px">
        <el-form-item label="类型">
          <el-select v-model="addsForm.categoryId" value-key="id" @change="selectMaterial">
            <el-option
              v-for="(item,index) in addArry"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 切换 -->
        <div v-if="listTon">
          <el-form-item label="克重" prop="GramWeight">
            <el-input v-model="addsForm.GramWeight"></el-input>
          </el-form-item>
          <el-form-item label="吨价" prop="TonPrice">
            <el-input v-model="addsForm.TonPrice"></el-input>
          </el-form-item>
          <el-form-item label="纹路" prop="item_lines">
            <el-input v-model="addsForm.item_lines"></el-input>
          </el-form-item>
        </div>
        <div v-if="listDai">
          <el-form-item label="长度" prop="item_spec_H">
            <el-input v-model="addsForm.item_spec_H"></el-input>
          </el-form-item>
          <el-form-item label="单价" prop="price">
            <el-input v-model="addsForm.price"></el-input>
          </el-form-item>
          <el-form-item label="单位">
            <el-select v-model="addsForm.Company" value-key="id">
              <el-option
                v-for="item in metre_yard"
                :key="item.id"
                :label="item.id"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="listPian">
          <el-form-item label="长">
            <el-input v-model="addsForm.item_spec_H"></el-input>
          </el-form-item>
          <el-form-item label="宽">
            <el-input v-model="addsForm.item_spec_W"></el-input>
          </el-form-item>
          <el-form-item label="单价">
            <el-input v-model="addsForm.price"></el-input>
          </el-form-item>
          <el-form-item label="单位">
            <el-select v-model="addsForm.Company" value-key="id">
              <el-option
                v-for="item in metre_yard"
                :key="item.id"
                :label="item.id"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="listUnit">
          <el-form-item label="单价" prop="price">
            <el-input v-model="addsForm.price"></el-input>
          </el-form-item>
          <el-form-item label="规格">
            <el-select v-model="addsForm.isjust" value-key="id">
              <el-option v-for="item in Specs" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="纹路" prop="item_lines">
            <el-input v-model="addsForm.item_lines"></el-input>
          </el-form-item>
        </div>
        <!-- 公用属性 -->
        <el-form-item label="产品代码" prop="item_code">
          <el-select v-model="addsForm.item_code" value-key="id">
            <el-option v-for="item in addCode" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名" prop="item_name">
          <el-input v-model="addsForm.item_name"></el-input>
        </el-form-item>
        <el-form-item label="供应商产品编码" prop="supplier_no">
          <el-input v-model="addsForm.supplier_no"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplier">
          <el-input @change="getPhone" v-model="addsForm.supplier"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="supplier">
          <el-input v-model="addsForm.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="materialAdd()">确定</el-button>
          <el-button @click="addMaterialForm = false;">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      listTon: true, //平装片材(吨价)
      listUnit: false, //平装片材(单价)
      listPian: false, //卷装片材
      listDai: false, //卷装带材
      addMaterialForm: false, //新增模态框
      addsForm: {
        item_code: "", //产品代码
        item_name: "", //产品名
        GramWeight: "", //克重
        TonPrice: "", //吨价
        categoryId: "", //类型  1
        item_lines: "", //纹路
        supplier_no: "", //供应商产品编码
        supplier: "", //供应商名称
        item_spec_W: "",
        item_spec_H: "",
        price: "", //单价
        Company: "", //单位(下拉选择 米/码)
        phone: "",
        isjust: "", //规格(正度大度)
        craate_date: "" //录入时间
      },
      addArry: [],
      addCode: [
        {
          id: "YBS",
          name: "YBS"
        },
        {
          id: "YYY",
          name: "YYY"
        }
      ],
      metre_yard: [
        {
          name: "米",
          id: "米"
        },
        {
          name: "码",
          id: "码"
        }
      ], //下拉选择米和码
      Specs: [
        {
          id: 1,
          name: "正度"
        },
        {
          id: 0,
          name: "大度"
        }
      ]
    };
  },
  props: ["lengthChild"],
  mounted() {
    this.getItemType();
  },
  methods: {
    selectMaterial(value) {
      if (value == 1) {
        this.listTon = true;
        this.listPian = false;
        this.listDai = false;
        this.listUnit = false;
      } else if (value == 2) {
        this.listTon = false;
        this.listPian = true;
        this.listDai = false;
        this.listUnit = false;
      } else if (value == 3) {
        this.listTon = false;
        this.listPian = false;
        this.listDai = true;
        this.listUnit = false;
      } else if (value == 4) {
        this.listTon = false;
        this.listPian = false;
        this.listDai = false;
        this.listUnit = true;
      }
    },
    // 点击+按钮(打开新增材料模态框))
    _addMaterial(index) {
      this.addMaterialForm = true;
    },
    // 关闭新增材料模态框
    closeDialog() {
      this.addMaterialForm = false;
    },
    // 清空表单
    clearForm() {
      return (this.addsForm = {
        item_code: "",
        item_name: "",
        GramWeight: "",
        TonPrice: "",
        categoryId: "",
        item_lines: "",
        supplier_no: "",
        supplier: "",
        item_spec_W: "",
        item_spec_H: "",
        price: "",
        Company: "",
        phone: "",
        isjust: "",
        craate_date: ""
      });
    },
    // 封装通用请求
    add_list(data) {
      return axios({
        method: "post",
        url: "/Backstage/AddItem",
        data: data,
        headers: {
          "Content-Type": "application/json"
        }
      });
    },
    // 封装通用 调用父组件方法
    fatherMethod() {
      // 循环更新 物料列表(先判断第一行是否 选择了)
      if (this.lengthChild[0].item_lengths) {
        let array = this.lengthChild;
        for (let i = 0; i < array.length; i++) {
          this.$parent.getSpecs(i);
        }
      }
    },
    // 点击新增信息模态框的确定按钮（确定新增信息） 将所增信息提交给后台
    materialAdd() {
      const { addsForm } = this;
      let addList = this.addsForm;
      let {
        item_code,
        item_name,
        GramWeight,
        TonPrice,
        categoryId,
        item_lines,
        supplier_no,
        supplier,
        item_spec_W,
        item_spec_H,
        price,
        Company,
        phone,
        isjust,
        craate_date
      } = addList;
      // 将规格选择的 0 或者1 转换成 布尔值
      if (addsForm.categoryId == 1) {
        let json = {
          item: {
            item_code: item_code,
            item_name: item_name,
            categoryId: categoryId,
            item_lines: item_lines,
            GramWeight: GramWeight,
            TonPrice: TonPrice,
            supplier_no: supplier_no,
            supplier: supplier,
            phone: phone,
            craate_date: this.nowTimes()
          },
          specifications: {}
        };
        if (
          item_code == "" ||
          item_name == "" ||
          GramWeight == "" ||
          TonPrice == "" ||
          categoryId == "" ||
          item_lines == "" ||
          supplier_no == "" ||
          phone == "" ||
          supplier == ""
        ) {
          this.$message.error("不能有数据为空");
        } else {
          this.add_list(json).then(res => {
            if (res.data.rows !== false) {
              this.addMaterialForm = false;
              this.$message.success(res.data.msg + "!");
              this.clearForm();
              this.fatherMethod();
            }
          });
        }
      } else if (addsForm.categoryId == 2) {
        let json = {
          item: {
            item_code: item_code,
            item_name: item_name,
            categoryId: categoryId,
            supplier_no: supplier_no,
            supplier: supplier,
            phone: phone,
            craate_date: this.nowTimes()
          },
          specifications: {
            item_spec_W: item_spec_W,
            item_spec_H: item_spec_H,
            Company: Company,
            price: price
          }
        };
        if (
          item_code == "" ||
          item_name == "" ||
          categoryId == "" ||
          Company == "" ||
          item_spec_W == "" ||
          item_spec_H == "" ||
          price == "" ||
          supplier_no == "" ||
          supplier == "" ||
          phone == ""
        ) {
          this.$message.error("不能有数据为空");
        } else {
          this.add_list(json).then(res => {
            if (res.data.rows !== false) {
              this.addMaterialForm = false;
              this.$message.success(res.data.msg + "!");
              this.clearForm();
              this.fatherMethod();
            }
          });
        }
      } else if (addsForm.categoryId == 3) {
        let json = {
          item: {
            item_code: item_code,
            item_name: item_name,
            categoryId: categoryId,
            price: price,
            supplier_no: supplier_no,
            supplier: supplier,
            phone: phone,
            craate_date: this.nowTimes(),
            updator: 0
          },
          specifications: {
            item_spec_H: item_spec_H,
            Company: Company,
            price: price
          }
        };
        if (
          item_code == "" ||
          item_name == "" ||
          item_spec_H == "" ||
          price == "" ||
          categoryId == "" ||
          supplier_no == "" ||
          phone == "" ||
          supplier == ""
        ) {
          this.$message.error("不能有数据为空");
        } else {
          this.add_list(json).then(res => {
            if (res.data.rows !== false) {
              this.addMaterialForm = false;
              this.$message.success(res.data.msg + "!");
              this.clearForm();
              this.fatherMethod();
            }
          });
        }
      } else if (addsForm.categoryId == 4) {
        // 将规格选择的 0 或者1 转换成 布尔值
        let isj;
        if (isjust) {
          isj = true;
        } else {
          isj = false;
        }
        let json = {
          item: {
            item_code: item_code,
            item_name: item_name,
            categoryId: categoryId,
            item_lines: item_lines,
            items_price: price,
            supplier_no: supplier_no,
            supplier: supplier,
            phone: phone,
            craate_date: this.nowTimes()
          },
          specifications: {
            isjust: isj
          }
        };
        if (
          item_code == "" ||
          item_name == "" ||
          price == "" ||
          categoryId == "" ||
          // isjust == "" ||
          supplier_no == "" ||
          supplier == "" ||
          phone == "" ||
          item_lines == ""
        ) {
          this.$message.error("不能有数据为空");
        } else {
          this.add_list(json).then(res => {
            if (res.data.rows !== false) {
              this.addMaterialForm = false;
              this.$message.success(res.data.msg + "!");
              this.clearForm();
              this.fatherMethod();
            }
          });
        }
      }
    },
    // 获取添加的物料长代码类型
    getItemType() {
      axios({
        method: "get",
        url: "/Items/GetAllCategory"
      })
        .then(res => {
          if (res.data.rows !== null) {
            let json = JSON.parse(res.data.rows); //eval(item)
            for (let i = 0; i < json.length; i++) {
              let data2 = {
                name: json[i].CategoryName,
                id: json[i].Id
              };
              this.addArry.push(data2);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 输入商家名 同时判断是否有 对应的商家电话
    getPhone() {
      let json = {
        suppliername: this.addsForm.supplier
      };
      if (this.addsForm.supplier) {
        axios({
          url: "/Backstage/GetPhone",
          method: "get",
          params: json
        }).then(res => {
          this.addsForm.phone = res.data.rows;
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
    }
  }
};
</script>

<style lang="scss" scope>
.add_material {
  .el-dialog__header {
    padding: 0;
    height: 100px;
    line-height: 100px;
  }
  .el-dialog__body {
    text-align: left;
  }
}
</style>