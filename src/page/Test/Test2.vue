<template>
  <div class="pdf_container">
    <div class="pdf_title">报价单</div>
    <div class="pdf_content">
      <!-- 报价单信息 -->
      <table class="pdf_header" style="table-layout:fixed">
        <tr>
          <td>客户名</td>
          <td>{{price_list.customer_name}}</td>
          <td>公司名</td>
          <td>{{price_list.CompanyName}}</td>
        </tr>
        <tr>
          <td>联系人</td>
          <td>{{price_list.Contacts}}</td>
          <td>联系人</td>
          <td>{{price_list.RealName}}</td>
        </tr>
        <tr>
          <td>电话</td>
          <td>{{price_list.customer_phone}}</td>
          <td>电话</td>
          <td>{{price_list.Tel}}</td>
        </tr>
        <tr>
          <td>邮箱</td>
          <td>{{price_list.Email}}</td>
          <td>邮箱</td>
          <td>{{price_list.userEmail}}</td>
        </tr>
      </table>
      <!-- 产品信息 -->
      <table class="pdf_info" border="1">
        <tr>
          <td width="20%">品名</td>
          <td width="30%">{{price_list.item_name}}</td>
          <td rowspan="7">
            <!-- <img :src="image_url" /> -->
          </td>
        </tr>
        <tr>
          <td>规格</td>
          <td>{{price_list.item_spec}}</td>
        </tr>
        <tr>
          <td>数量</td>
          <td>{{price_list.qty}}</td>
        </tr>
        <tr>
          <td>装箱</td>
          <td>{{price_list.Boxing}}</td>
        </tr>
        <tr>
          <td>价格</td>
          <td>{{price_list.TotalPrice}}</td>
        </tr>
        <tr>
          <td>生产周期</td>
          <td>
            <input type="text" />
          </td>
        </tr>
        <tr>
          <td>样板费</td>
          <td>
            <input type="text" />
          </td>
        </tr>
        <tr>
          <td rowspan="4">描述</td>
          <td style="text-align: left;" colspan="3">所有物料:{{Text}}</td>
        </tr>
        <tr>
          <td style="text-align: left;" colspan="3">印刷:</td>
        </tr>
        <tr>
          <td style="text-align: left;" colspan="3">烫金:</td>
        </tr>
        <tr>
          <td style="text-align: left;" colspan="3">过胶:{{glue}}</td>
        </tr>
        <tr>
          <td colspan="7"></td>
        </tr>
        <tr>
          <td colspan="3">
            <label>报价日期:{{Time}}</label>
            <label>报价单号 :{{price_list.orderno}}</label>
            <label>报价员:{{price_list.bjy}}</label>
          </td>
        </tr>
      </table>
    </div>
    <div class="pdf_printing">
      <a class="btn" href="javascript:window.print();">打印</a>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      showMask: false,
      htmlTitle: "页面导出PDF文件名",
      packData: [],
      price_list: {},
      Time: "",
      Text: "",
      glue: ""
    };
  },
  computed: {
    ...mapState(["formInfo", "orderInfo"])
  },
  methods: {
    // 生成报价单信息
    priceList() {
      const { orderInfo } = this;
      if (orderInfo.offerNumber) {
        axios({
          method: "get",
          url: "/Order/GetExport",
          params: {
            orderno: orderInfo.offerNumber
          }
        }).then(res => {
          if (res.data.rows !== null) {
            let item = JSON.parse(res.data.rows);
            console.log(item);
            this.price_list = item;
            this.Time = this.price_list.create_date.replace("T", " ");
            this.Text = this.price_list.bom.substring(
              0,
              this.price_list.bom.length - 1
            );
            this.glue = this.price_list.glue.substring(
              0,
              this.price_list.glue.length - 1
            );
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@media print {
  .pdf_printing {
    display: none;
  }
  .pdf_container {
    background: #6fdffc;
  }
}
.pdf_container {
  line-height: 60px;
  font-size: 18px;
  color: #696969;
  font-weight: 600;
  text-align: center;
  box-sizing: border-box;
  .pdf_title {
    width: 100%;
    margin: 0 auto;
  }
  .pdf_content {
    width: 1002px;
    color: #797979;
    line-height: 26px;
    box-sizing: border-box;
    margin: 0 auto;
    table {
      width: 100%;
      height: 100%;
      input {
        height: 20px;
        width: 80%;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 5px;
      }
      tr,
      td {
        vertical-align: middle;
        border: 1px solid #ccc;
        text-align: center;
        height: 20px;
        padding: 10px 5px;
        label {
          padding: 0 10px;
        }
      }
    }
  }
  .pdf_header {
    width: 1002px;
    tr {
      border-bottom: 1px solid #e0e6ed;
    }
    tr td {
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      border: 0;
      border-right: 1px solid #e0e6ed;
    }
  }
  .pdf_info {
    width: 1002px;
  }
  .pdf_printing {
    .btn {
      background: #409eff;
      padding: 10px;
      border-radius: 3px;
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>