
<template>
    <b-row>
      <div class="col-sm-2">
      </div>
      <div class="col-sm-8">
        <b-row class="w-100" align="center">
          <Logo/>
        </b-row>
        <b-row class="mb-4" >
          <a href="" class="btn btn-light w-100 voce-menu" >
          <ph-arrows-out-line-horizontal :size="24" color="#6495ed" class="mr-3"/>
            <i> Assembramenti</i>
          </a>
        </b-row>
        <b-row class="my-4">
          <a href="" class="btn btn-light w-100 voce-menu">
          <ph-buildings :size="24" color="green" class="mr-3" />
            <i> Accessi</i>

          </a>
        </b-row>
        <b-row class="my-4" >
          <a href="" class="btn btn-light w-100 voce-menu">
          <ph-clipboard-text :size="24" color="orange" class="mr-3" />
            <i> Bacheca</i>

          </a>
        </b-row>
        <b-row class="my-4" >
          <a href="" class="btn btn-light w-100 voce-menu" >
            <ph-warning :size="24" color="darkviolet" class="mr-3"  />
            <i> Segnalazioni</i>
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
  }
}
</script>

<style scoped>
.voce-menu{
  text-align: left;
}

</style>