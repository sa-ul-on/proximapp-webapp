
<template>
    <b-row>
      <div class="col-sm-2">
      </div>
      <div class="col-sm-8">
        <b-row class="w-100" align="center">
          <Logo/>
        </b-row>
        <b-row class="mb-4" >
          <a href="/" class="btn w-100 voce-menu" v-bind:class="{ 'left-menu-active': index}" >
          <ph-arrows-out-line-horizontal :size="24" color="#6495ed" class="mr-3"  />
            Assembramenti
          </a>
        </b-row>
        <b-row class="my-4">
          <a href="/worktime" class="btn w-100 voce-menu"  v-bind:class="{ 'left-menu-active': worktime}">
          <ph-buildings :size="24" color="green" class="mr-3" />
            Accessi
          </a>
        </b-row>
        </div>
        <div class="col-sm-2"></div>
    </b-row>
</template>

<script>
import Logo from "@/components/Logo";

export default {
  name: "LeftMenu",
  components: {
    Logo,
  },
  props: {
    index :  Boolean,
    worktime: Boolean,
    bacheca :  Boolean,
    segnalazioni: Boolean
  },
}
</script>

<style scoped>
.voce-menu{
  font-size: large;
  background-color: #fafafa;
  text-align: left;
}
.left-menu-active{
  background-color: #e9e9e9;
  color: #020202;
}
</style>