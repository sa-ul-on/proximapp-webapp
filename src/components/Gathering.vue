<template>
  <div class="rounded mt-2 gathering px-2">
    <p><strong>Persone: </strong>
    <a href="#" class="text-dark" v-for="persona in persone" v-bind:key="persona.id">{{persona.nome}} </a>
    </p>
   <p><strong>Luogo:</strong> <a href="#" class="text-dark">{{luogo}}</a> </p>

    <p><strong>Orario</strong>: {{ new Date(orario).getHours()}}:{{  new Date(orario).getUTCMinutes()}} </p>
  </div>
</template>

<script>
export default {
  name: "Gathering",
  props: {
    persone: Array,
    luogo: String,
    orario: Date,
  },
}

</script>

<style scoped>
.gathering{
  text-align: left;
}

</style>