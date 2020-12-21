<template>
  <b-row>
    <div class="col-lg-2"></div>
    <div class="col-lg-8 align-content-center">
      <img src="@/assets/imgs/logo.png">
      <p class="mt-1" id="logo-name">ProximAPP</p>
    </div>
    <div class="col-lg-2"></div>
  </b-row>
</template>

<script>
export default {
  name: "Logo"
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap');
#logo-name{
  font-family: "EB-Garamond";
  font-weight: bold ;
  font-size: 42px;
  color: #2f5597;
}
</style>