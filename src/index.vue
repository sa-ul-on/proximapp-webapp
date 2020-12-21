<template id="index">
  <div class="mt-2 container-fluid">

    <div class="w-100">

    </div>
    <b-row>
      <div class="col-lg-3">
        <LeftMenu/>
      </div>
      <div class="col-lg-9 main">
        <b-row class="w-100" >
            <form class="w-100" @submit="search" >
              <b-row class="w-100">
                <div class="form-group col-lg">
                  Periodo date
                  <input type="date" class="form-control mr-2" name="date_from" v-model="date_from">
                </div>
                <div class="form-group col-lg" id="input-data-2" >
                  <br>
                  <input type="date" class="form-control mr-2" name="date_to" v-model="date_to">
                </div>
                <div class="form-group col-lg">
                  Persone
                  <treeselect name="trackings"  :multiple="true" :options="tracking_options"  search="true"/>
                </div>
                <div class="form-group col-lg" id="input-stanze" >
                  Stanze
                  <treeselect name="places"  :multiple="true" :options="places_options"  search="true"/>
                </div>
                <b-col lg=""></b-col>
                <div class="form-group col-lg ">
                  <br>
                  <button class="btn btn-primary w-100" @click="search">Cerca</button>
                </div>
                <hr class="w-100">
              </b-row>
            </form>
        </b-row>
        <div v-if="isLoading" class="row justify-content-center">
          <div class="col-4"></div>
          <div class="col-4">
            <img src="@/assets/imgs/loading.gif"  width=140/>
          </div><div class="col-4"></div>
        </div>
        <div v-if="isError" class="row justify-content-center">
          <div class="col-4"></div>
          <div class="col-4">
            <img  src="@/assets/imgs/errore.png"  width=140/>
          </div><div class="col-4"></div>
        </div>
        <div>
        <div v-if="!(Object.keys(gatherings).length)" class="row justify-content-center">
          <div class="col-4"></div>
          <div class="col-4">
            <p>Nessun risultato</p>
          </div><div class="col-4"></div>
        </div>
        <b-row id="gatherings-div" v-if="Object.keys(gatherings).length">
          <div class="row w-100 mt-3" v-for="(gatheringOfADate, index) in gatherings" v-bind:key="index">
            <ph-calendar-blank :size="24"/>
            <h5> {{new Date(index).getDate()}} {{monthNames[new Date(index).getMonth()+1]}} </h5>
            <div class="row w-100">
             <div class="col-lg-3 gathering-container" v-for="gathering in gatheringOfADate" v-bind:key="gathering.id">
               <div class="h-100">
                 <Gathering :orario="gathering.start" :luogo="gathering.place.name" :persone="gathering.trackings" ></Gathering>
               </div>
             </div>
            </div>
          </div>
        </b-row>
        </div>
      </div>
  </b-row>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';
import VueAxios from "vue-axios";
import LeftMenu from '@/components/LeftMenu';
import Gathering from "@/components/Gathering";

import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

Vue.use(VueAxios,axios);

const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settemmbre", "Ottobbre", "Novembre", "Dicembre"];

let isLoading = false;
let isError = false;

function getPreparedGatherings(gatherings) {
  let gatheringsData = {};
  if (gatherings.length){
    gatherings.sort((a,b) => { return new Date(b.start) - new Date(a.start); });
    for (const gg of gatherings) {
      const date = new Date(gg.start);
      const dateStr = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
      if (gatheringsData[dateStr] === undefined)
        gatheringsData[dateStr] = [];
      gatheringsData[dateStr].push(gg);
    }
  }
  return gatheringsData;
}

async function fillPersone(){
  let link="http://localhost:8080/trackings";
  isLoading = true;
  await Vue.axios.get(link)
      .then((resp) => {
        for (let p of resp.data){
          this.tracking_options.push(
              {
                id: p.id,
                label: p.nome+" "+p.cognome,
              }
          )
        }
        this.isLoading = false;
      })
      .catch(e => {
        this.isError = true;
        console.error(e.toString());
      })
}

async function fillStanze(){
  let link="http://localhost:8080/places";
  isLoading = true;
  await Vue.axios.get(link)
      .then((resp) => {
        for (let p of resp.data){
          this.places_options.push(
              {
                id: p.id,
                label: p.name,
              }
          )
        }
        this.isLoading = false;
      })
      .catch(e => {
        this.isError = true;
        console.error(e.toString());
      })
}

async function getAllGatherings(){
  let link="http://localhost:8080/api/find";
  this.gatherings ="";
  isLoading = true;
  await Vue.axios.get(link)
      .then((resp) => {
        this.gatherings = getPreparedGatherings(resp.data);
        this.isLoading = false;
      })
      .catch(e => {
        this.isError = true;
        console.error(e.toString());
      })
}

async function search(e) {
  this.isLoading = true;
  e.preventDefault();
  if (this.date_from == undefined) {
    this.date_from = "";
  }
  if (this.date_to == undefined) {
    this.date_to = "";
  }
  if (this.trackings == undefined) {
    this.trackings = "";
  }
  if (this.places == undefined) {
    this.places = "";
  }
  let link = "http://localhost:8080/api/find?date_from="
      + this.date_from + "&date_to=" + this.date_to
      + "&trackings=" + this.trackings + "&places=" + this.places;
  this.gatherings = "";
  await Vue.axios.get(link)
      .then((resp) => {
        if (resp.data.length) {
          this.gatherings = "";
          this.gatherings = getPreparedGatherings(resp.data);
          this.isLoading = false;
          return getPreparedGatherings(resp.data);
        } else {
          this.isLoading = false;
          this.gatherings = "";
        }
      })
      .catch(e => {
        e;
        this.isError = true;
      });
}

export default {
  data() {
    return {
      gatherings: "",
      monthNames,
      isError,
      isLoading,
      // define the default value
      value: null,
      tracking_options: [],
      places_options:[],
    };
  },
  name: 'index',
  components: {
    LeftMenu,
    Gathering,
    Treeselect
  },
  methods: {
    search,
    getAllGatherings,
    fillPersone,
    fillStanze
  },
  beforeMount() {
    this.getAllGatherings();
    this.fillStanze();
    this.fillPersone();
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
#index {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#gatherings-div {
  width: 100%; /* Set full-width to expand the whole page */
}
@media (min-width: 992px) {
  .main{
    margin-top: 10em;
  }
}
.gathering-container :hover{
  background-color: #f8f8f8;
  text-align: left;
}

</style>
