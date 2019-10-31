<template>
  <section class="login-container">
    <!-- 登录界面 -->
    <div class="login-inner">
      <!-- 头部信息 -->
      <div class="login-header">
        <h1>登录|注册</h1>
        <div class="login-methods">
          <!-- 用class绑定属性，和click点击事件实现登录方式隐藏切换 -->
          <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true">登录</a>
          <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">注册</a>
        </div>
      </div>
      <div class="login-content">
        <!-- 登录表单(提交submit.prevent()提交表单内容且阻止默认行为) -->
        <form @submit.prevent="login" ref="Form">
          <!-- 短信登录 -->
          <!-- 这里添加的绑定属性是 是否隐藏 -->
          <div :class="{on:loginWay}">
            <section class="login-message">
              <!-- 使用v-model表单输入绑定，添加computed计算属性 监控手机号输入结果（用正则表达式匹配），判断布尔值，true的话，即按钮样式生效 -->
              <input type="tel" maxlength="11" placeholder="用户名" v-model="LoginName" />
            </section>
            <section class="login-verification">
              <input type="password" maxlength="8" placeholder="密码" v-model="LoginPassWord" />
            </section>
          </div>
          <!-- 用户名密码登录 -->
          <div :class="{on:!loginWay}">
            <section class="login-message">
              <input type="tel" maxlength="11" placeholder="用户名" v-model="LoginName" />
            </section>
            <!-- 注册密码 -->
            <section class="login-message">
              <input type="text" placeholder="密码" v-if="showPwd" v-model="LoginPassWord" />
              <input type="password" placeholder="密码" v-else v-model="LoginPassWord" />
              <!-- 复制过来的开关按钮 -->
              <div class="switch_button off" :class="showPwd?'on':'off'" @click="showPwd=!showPwd">
                <div class="switch_circle" :class="{right: showPwd}"></div>
                <span class="switch_text">{{showPwd ? 'abc' : '.......'}}</span>
              </div>
            </section>
            <!-- 确认注册密码 -->
            <section class="login-message">
              <input type="text" placeholder="确认密码" v-if="showPwd" v-model="ConfirmPassword" />
              <input type="password" placeholder="确认密码" v-else v-model="ConfirmPassword" />
              <!-- 复制过来的开关按钮 -->
              <div class="switch_button off" :class="showPwd?'on':'off'" @click="showPwd=!showPwd">
                <div class="switch_circle" :class="{right: showPwd}"></div>
                <span class="switch_text">{{showPwd ? 'abc' : '.......'}}</span>
              </div>
            </section>
            <section class="login-verification">
              <input type="text" placeholder="邮箱" v-model="Email" />
            </section>
            <section class="login-verification">
              <input type="text" placeholder="电话" v-model="Tel" />
            </section>
            <section class="login-verification">
              <input type="text" placeholder="地址" v-model="Address" />
            </section>
            <section class="login-verification">
              <input type="text" placeholder="公司名称" v-model="CompanyName" />
            </section>
            <!-- <section class="login-verification">
              <input type="text" placeholder="创建日期" v-model="CreateDate" />
            </section>-->
            <section class="login-verification">
              <input type="text" placeholder="真名" v-model="RealName" />
            </section>
            <section class="login-verification">
              <input type="text" placeholder="国家" v-model="Country" />
            </section>
            <section class="login-hint">
              温馨提示：请仔细阅读
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <button class="login-submit" @click.prevent="login" v-if="loginWay">登录</button>
          <button class="register-submit" @click.prevent="register" v-else>注册</button>
        </form>
        <a href="javascript:;" class="about-us">关于我们</a>
      </div>
      <!-- 返回上一个界面按钮 -->
      <!-- <a @click="$router.back()" href="javascript:;">
        <span class="iconfont icon-jiantou2"></span>
      </a>-->
    </div>
    <!-- <AlertTip :alertText="alertText" @closeTip="alertShow=false" v-show="alertShow" /> -->
  </section>
</template>

<script>
// import AlertTip from "../../components/AlertTip/AlertTip.vue";
// import { reqPwdLogin, reqSendCode, reqSmsLogin } from "../../api";
import axios from "axios";
// import { mapState } from "vuex";

export default {
  data() {
    return {
      loginWay: true, //切换登录方式，true为短信登录 false为密码登录
      showPwd: false, //默认不显示密码
      alertText: "", //提示信息
      alertShow: false, //是否显示提示框

      LoginName: "", //用户名
      LoginPassWord: "", //密码
      ConfirmPassword: "", //确认密码
      Email: "", //邮箱
      Tel: "", //电话
      Address: "", //地址
      CompanyName: "", //公司名称
      UserType: "0", //用户类型
      Status: "1", //用户状态
      CreateDate: "", //创建日期
      RealName: "", //真名
      Country: "" //国家
    };
  },
  // computed: {
  //   ...mapState(["userInfo"])
  // },
  created() {
    this.CreateDate = this.nowTimes(); //获取时间
    // window.localStorage.clear(); // 由于localStrory的特性，所以每次登录前或者退出后要清除缓存
  },
  methods: {
    login() {
      // 简单登录前台校验
      if (!this.LoginName) {
        return alert("用户名不能为空");
      }
      if (!this.LoginPassWord) {
        return alert("密码不能为空");
      }
      axios({
        method: "get",
        url: "/User/SignIn",
        params: {
          name: this.LoginName,
          password: this.LoginPassWord
        }
      }).then(res => {
        if (res.data.rows === null) {
          return alert(res.data.msg);
        } else {
          const userInfo = JSON.parse(res.data.rows);
          this.$store.dispatch("setUserInfo", userInfo); //存入state中
          return this.$router.replace("/index");
        }
      });
    },

    // 注册
    register() {
      if (
        !this.LoginName ||
        !this.LoginPassWord ||
        !this.ConfirmPassword ||
        !this.Email
      ) {
        return alert("必须全部填写");
      }
      if (this.LoginPassWord !== this.ConfirmPassword) {
        return alert("两次密码不一致");
      }
      const Data = {
        loginName: this.LoginName,
        loginPassWord: this.LoginPassWord,
        email: this.Email,
        tel: this.Tel,
        address: this.Address,
        companyName: this.CompanyName,
        userType: this.UserType,
        status: this.Status,
        createDate: this.CreateDate,
        realName: this.RealName,
        country: this.Country
      };
      var json = JSON.stringify(Data);
      axios({
        method: "post",
        url: "/User/Register",
        data: json,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then(res => {
        if (res.data.rows > 0) {
          alert("注册成功");
          return location.reload(); //刷新页面
        }
      });
    },

    // 创建时间
    nowTimes() {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      var day = now.getDay(); //得到周几
      var hour = now.getHours(); //得到小时
      var minu = now.getMinutes(); //得到分钟
      var sec = now.getSeconds(); //得到秒
      var week;
      month = month + 1;
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      if (hour < 10) hour = "0" + hour;
      if (minu < 10) minu = "0" + minu;
      if (sec < 10) sec = "0" + sec;
      var time = "";
      time = year + "-" + month + "-" + date+" " + hour + ":" + minu;
      return time;
      //设置得到当前日期的函数的执行间隔时间，每1000毫秒刷新一次。
      // var timer = setTimeout("writeCurrentDate()", 1000);
    }
  }
};
</script>

<style lang="scss" scope>
.login-container {
  box-sizing: border-box; // 加了这个 padding就不会改变盒子宽高了
  padding-top: 60px;
  position: relative;
  width: 500px;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
  input:hover {
    border: 1px solid #409eff;
  }
  input {
    box-sizing: border-box; // 加了这个 padding就不会改变盒子宽高了
    padding-left: 5px;
    height: 48px;
    width: 100%;
    font-size: 14px;
    line-height: 21px;
    margin-bottom: 15px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    outline: 0; // 取消边框样式
    background-color: #fff;
  }
  .login-inner {
    width: 80%;
    margin: 0 auto;
    .login-header {
      h1 {
        font-size: 40px;
        color: #409eff;
        font-weight: 700;
        text-align: center;
      }
      .login-methods {
        text-align: center;
        color: #333;
        font-size: 14px;
        padding-top: 40px;
        margin-bottom: 8px;
        a {
          color: #333;
          display: inline-block;
          padding-bottom: 5px;
        }
        a:first-child {
          margin-right: 40px;
        }
        .on {
          color: #409eff;
          font-weight: 700;
          border-bottom: 2px solid #409eff;
        }
      }
    }
    .login-content {
      // 切换登录方式
      > form {
        > div {
          display: none;
        }
        .on {
          display: block;
        }
      }
      //下面是样式
      .login-message {
        position: relative;
        .login-verification-get {
          position: absolute;
          right: 0;
          top: 25%;
          border: 0;
          background: transparent;
          // padding-top: 10px;
          text-align: left;
          color: #ccc;
          &.right_LoginName {
            color: #409eff;
          }
        }

        // 复制过来的按钮
        .switch_button {
          font-size: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          transition: background-color 0.3s, border-color 0.3s;
          padding: 0 6px;
          width: 35px;
          height: 16px;
          line-height: 16px;
          color: #fff;
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-100%);
          // margin-top: -5px;
        }
        .switch_button.off {
          background: #fff;
        }
        .switch_button.off .switch_text {
          display: flex;
          // float: right;
          color: #ccc;
        }
        .switch_button.on {
          background: #409eff;
        }
        .switch_button > .switch_circle {
          position: absolute;
          top: -1px;
          left: -1px;
          width: 16px;
          height: 16px;
          border: 1px solid #ddd;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
          &.right {
            transform: translateX(30px);
          }
        }

        .mint-switch {
          position: absolute;
          top: 25%;
          right: 0%;
          .switch_text {
            position: absolute;
            top: 3px;
            right: 19px;
            font-size: 12px;
            color: #ddd;
          }
          .mint-switch-input:checked + .mint-switch-core {
            border-color: #00143d;
            background-color: #00143d;
          }
          .mint-switch-core {
            display: inline-block;
            position: relative;
            width: 42px;
            height: 18px;
            border: 1px solid #d9d9d9;
            border-radius: 16px;
            box-sizing: border-box;
            background: #d9d9d9;
          }
          .mint-switch-core::before {
            width: 40px;
            height: 16px;
          }
          .mint-switch-core::after {
            width: 18px;
            height: 18px;
            content: " ";
            top: -1px;
            left: -5px;
            position: absolute;
            z-index: 9;
          }
          .mint-switch-input:checked + .mint-switch-core::after {
            -webkit-transform: translateX(30px);
            transform: translateX(30px);
          }
        }
      }
      .login-verification {
        position: relative;
        input {
          height: 48px;
          font-size: 14px;
        }
        .get_verification {
          position: absolute;
          right: -5px;
          top: -5px;
        }
      }

      .login-hint {
        font-size: 14px;
        color: #999;
        line-height: 20px;
        text-indent: 0;
        a {
          color: #00143d;
        }
      }
      .login-submit {
        width: 100%;
        height: 42px;
        background-color: #409eff;
        color: #fff;
        font-size: 16px;
        border: 0;
        margin-top: 30px;
      }
      .register-submit {
        width: 100%;
        height: 42px;
        background-color: #409eff;
        color: #fff;
        font-size: 16px;
        border: 0;
        margin-top: 30px;
      }
      .about-us {
        display: block;
        font-size: 12px;
        margin-top: 20px;
        text-align: center;
        color: #999;
      }
    }

    .icon-jiantou2 {
      position: absolute;
      left: 5px;
      top: 5px;
      font-size: 20px;
    }
  }
}
</style>
