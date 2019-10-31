<template>
  <section class="header_container">
    <header class="jeweller_header">
      <div class="w jeweller_container">
        <a class="jeweller_logo" href="#">
          <img src="../../image/logo.png" alt />
        </a>
        <!-- search -->
        <!-- <div class="jeweller_search">
          <input type="search" name id placeholder="请输入关键字" />
          <button></button>
        </div>-->
        <div class="jeweller_text">
          <h3>珠宝商自己的供应链平台</h3>
          <div class="jeweller_login">
            <router-link :to="userInfo.Id?'/index':'/login'">
              <span v-if="!userInfo.Id">登录|注册</span>
              <span v-else>
                <i class="el-icon-user"></i>
                {{userInfo.LoginName}}
                <a href="#" @click="logout">注销</a>
              </span>
            </router-link>
          </div>
        </div>
      </div>
      <div class="jeweller_list">
        <!-- <ul>
          <li>
            <a href="#">全部系列</a>
          </li>
          <li>
            <a href="#">全部系列</a>
          </li>
          <li>
            <a href="#">全部系列</a>
          </li>
          <li>
            <a href="#">全部系列</a>
          </li>
          <li>
            <a href="#">全部系列</a>
          </li>
          <li>
            <a href="#">全部系列</a>
          </li>
        </ul>-->
      </div>
    </header>
    <!-- 分页信息 -->
    <!-- <nav class="jeweller_nav">
      <div class="w">
        <ul>
          <li>
            <a href>首页</a>
          </li>
          <li>
            <a href>首页</a>
          </li>
          <li>
            <a href>首页</a>
          </li>
          <li>
            <a href>首页</a>
          </li>
          <li>
            <a href>首页</a>
          </li>
          <li>
            <a href>首页</a>
          </li>
          <li>
            <a href>首页</a>
          </li>
        </ul>
      </div>
    </nav>-->
  </section>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    logout() {
      return this.$store.commit("REMOVE_USERINFO");
      //  location.reload();//刷新页面
    }
  }
};
</script>
<style lang="scss" scoped>
.w {
  // width: 1300px;
  margin: 0 auto;
}
/* 页面样式 */
.header_container {
  position: relative;
  .jeweller_header {
    width: 100%;
    height: 110px;
    background-color: #00143d;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    .jeweller_container {
      display: flex;
      justify-content: center;
      padding-top: 40px;
      margin: 0 auto;
      text-align: center;
    }
  }

  .jeweller_header h3 {
    font-size: 25px;
    color: #fff;
  }

  .jeweller_logo {
    // float: left;
    padding-right: 10px;
  }

  .jeweller_search {
    width: 510px;
    height: 40px;
    background-color: purple;
    float: left;
    // margin-left: 60px;
    input {
      width: 461px;
      height: 40px;
      // border: 1px solid #00a4ff;
      outline: none; /* 轮廓线 */
      padding-left: 10px;
      float: left;
    }
    button {
      width: 49px;
      height: 40px;
      border: 0;
      outline: none;
      float: left;
      background: url(../../image/fa-search2.png) no-repeat;
    }
  }

  .jeweller_text {
    // h3{
    //   font-size: 15px;
    // }
    position: relative;
    .jeweller_login {
      position: absolute;
      right: -35%;
      bottom: 20%;
      a {
        font-size: 14px;
        color: #fff;
        font-weight: 700;
      }
    }
  }

  .jeweller_list {
    position: absolute;
    bottom: 35px;
    left: 20%;
    li {
      display: inline-block;
      padding-left: 20px;
    }
    ul > li > a {
      color: #fff;
    }
    li ~ li {
      font-size: 12px;
    }
  }

  .jeweller_nav {
    background-color: #efeff1;
    height: 30px;
    ul > li {
      float: left;
      padding-right: 30px;
      line-height: 30px;
    }
    ul > li > a {
      color: #000;
    }
  }
  .jeweller_nav:before {
    content: "";
    position: absolute;
    bottom: 30;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #00a4ff;
    z-index: 99;
  }
}
</style>