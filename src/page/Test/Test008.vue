<template>
  <div class="add_material">
    <a href="#" @click="add">点击</a>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {};
  },
  methods: {
    add() {
      axios({
        method: "get",
        url: "/Order/GetByIdHistory?orderno=20191031008"
      }).then(res => {
        let json = JSON.parse(res.data.rows)
        console.log(JSON.stringify(json));
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>