<template>
  <div class="mt-2 container-fluid">
    <b-row>
      <div class="col-lg-3">
        <LeftMenu worktime=true />
      </div>
      <div class="col-lg-9 main">
        <b-row class="w-100" >
          <form class="w-100" @submit="search">
            <b-row class="w-100">
              <div class="form-group col-lg">
                <label for="dataSelect">Data</label>
                <input type="date" class="form-control mr-2" id="dataSelect" name="date_from" v-model="date_from" >
              </div>
              <div class="form-group col-lg">
                <label for="personaSelect">Persona</label>
                <select class="form-control" id="personaSelect"  v-model="userIds">
                  <option value="1">Aldo </option>
                  <option value="2">Giovanni </option>
                </select>
              </div>
              <b-col lg=""></b-col>
              <div class="form-group col-lg ">
                <br>
                <button class="btn btn-primary w-100" @submit="search">Cerca</button>
              </div>
              <hr class="w-100">
            </b-row>
          </form>
        </b-row>
        <div v-if="isLoading" class="row justify-content-center">
          <div class="col-4"></div>
          <div class="col-4 text-center">
            <img src="@/assets/imgs/loading.gif"  width=140/>
            <p>Caricamento....</p>
          </div><div class="col-4"></div>
        </div>
        <div v-if="isError" class="row justify-content-center">
          <div class="col-4"></div>
          <div class="col-4 text-center">
            <img  src="@/assets/imgs/errore.png"  width=140/>
            <p>E t parev ca nun jev stuort</p>
          </div><div class="col-4"></div>
        </div>
        <b-row class="w-100">

          <table class="table w-100 table-bordered table-sm table-hover text-center">
            <thead class="thead-light">
            <tr>
              <th scope="col">E-mail</th>
              <th scope="col">Data</th>
              <th scope="col">Orario ingresso</th>
              <th scope="col">Orario uscita</th>
              <th scope="col">Dettagli</th>
            </tr>
            </thead>
            <tbody>

            <tr v-for="worktime in worktimes" v-bind:key="worktime">
              <td>{{worktime.email}}</td>
              <td >{{worktime.date}}</td>
              <td>{{worktime.details[worktime.details.length - 1].dateFrom.substring(11, 16)}}</td>
              <td>{{worktime.details[0].dateTo.substring(11, 16)}}</td>
              <td style="width: 20%;">
                <a class="expand-button" v-bind:id="'expand-button-'+worktime.idUser+'-'+worktime.date" v-bind:remove-button="'remove-button-'+worktime.idUser+'-'+worktime.date" v-bind:expand-button="'expand-button-'+worktime.idUser+'-'+worktime.date" v-bind:details="worktime.idUser+'-'+worktime.date"><ph-plus-circle :size="24" color="green"/></a>
                <a class="remove-button d-none"  v-bind:id="'remove-button-'+worktime.idUser+'-'+worktime.date" v-bind:remove-button="'remove-button-'+worktime.idUser+'-'+worktime.date" v-bind:expand-button="'expand-button-'+worktime.idUser+'-'+worktime.date" v-bind:details="worktime.idUser+'-'+worktime.date"><ph-minus-circle :size="24" color="red"/></a>
                <table class="w-100">
                  <tr v-for="details in worktime.details" v-bind:key="details" v-bind:class="worktime.idUser+'-'+worktime.date" class="d-none">
                    <td> {{ details.dateFrom.substring(11, 16) }}</td>
                    <td> {{ details.dateTo.substring(11, 16) }}</td>
                  </tr>
                </table>
              </td>
            </tr>
            </tbody>
          </table>
          <div v-if="!worktimes.length" class="w-100 text-center">
            <p>Nessun risultato</p>
          </div>
          <div class="w-100 text-center">
            <button @click="$vm2.open('modal-1')">Open modal</button>
          </div>
          <vue-modal-2 name="modal-1" @on-close="close" noHeader  noFooter >
            <div class="custom-modal-close">
              <div type="button" class="close" aria-label="Close" @click="close">
                <span aria-hidden="true">×</span>
              </div>
            </div>
            <div class="custom-modal-container">
              <h2 class="custom-modal-title">Attenzione!<br> Assembramento nella stanza 3 A </h2>
              <h4 class="custom-modal-text">Partecipanti: Katia Morelli e Mirko Lodato</h4>
            </div>
          </vue-modal-2>
        </b-row>
      </div>

    </b-row>

  </div>
</template>

<script>
import LeftMenu from '@/components/LeftMenu';
import WorktimeWS from "@/assets/js/WorktimeWS";
import UserWS from "@/assets/js/UserWS";
import Vue from "vue";

import Modal from "@burhanahmeed/vue-modal-2";
Vue.use(Modal);
Vue.config.productionTip = false;

let isLoading = false;
let isError = false;

async function search(e) {
  this.isError = false;
  e.preventDefault();
  if(this.date_from == undefined){
    this.date_from ="";
  }
  if(this.userIds == undefined){
    this.userIds ="";
  }
  if(this.companyId == undefined){
    this.companyId ="1";
  }
  this.isLoading = true;
  this.worktimes ="";
  this.worktimes = await this.worktimeWS.search(this.companyId, this.userIds, this.date_from);
  for (let i=0; i< this.worktimes.length; i++){
    let user = await this.userWS.getUserById(1,this.worktimes[i].idUser)
    this.worktimes[i].email = ''+user.email
  }

  this.isLoading = false;
  this.assignFunction();
}

async function getAllWorktimes(){
  this.isError = false;
  this.worktimes ="";
  this.isLoading = true;
  this.worktimes = await this.worktimeWS.getAllWorktimes();
  if(!this.worktimes){
    this.isError = true;
  }
  for (let i=0; i< this.worktimes.length; i++){
    let user = await this.userWS.getUserById(1,this.worktimes[i].idUser)
    this.worktimes[i].email = ''+user.email
  }
  this.isLoading = false;
}

function showDetails(showButton,hideButton,dettagli){
  document.getElementById(hideButton).classList.remove('d-none');
  document.getElementById(showButton).classList.add('d-none');
  let details = document.getElementsByClassName(dettagli);
  for(let i =0; i <details.length; i++){
    details[i].classList.remove('d-none');
  }
}

function hideDetails(showButton,hideButton, dettagli) {
  document.getElementById(hideButton).classList.add('d-none');
  document.getElementById(showButton).classList.remove('d-none');
  let details = document.getElementsByClassName(dettagli);
  for(let i =0; i <details.length; i++){
    details[i].classList.add('d-none');
  }
}

function assignFunction() {

  const expandButtons = document.getElementsByClassName('expand-button');
  console.log("expand buttons number "+ expandButtons.length)
  for (let i=0; i<expandButtons.length; i+= 1) {
    let button = expandButtons[i];
    let details = button.getAttribute('details');
    let expandButton = button.getAttribute('expand-button');
    let removeButton = button.getAttribute('remove-button');
    button.addEventListener('click', function (){
      showDetails(expandButton, removeButton, details)
    });
  }
  const removeButtons = document.getElementsByClassName('remove-button');
  for (let i=0; i<removeButtons.length; i+= 1) {
    let button = removeButtons[i];
    let details = button.getAttribute('details');
    let expandButton = button.getAttribute('expand-button');
    let removeButton = button.getAttribute('remove-button');
    button.addEventListener('click', function (){
      hideDetails(expandButton, removeButton, details)
    });
  }
}

export default {
  data() {
    return {
      worktimes: "",
      isError,
      isLoading,
      value: null,
      tracking_options: [],
      worktimeWS: new WorktimeWS(),
      userWS: new UserWS(),
    };
  },
  name: "Worktime",
  components: {
    LeftMenu,
  },
  methods:{
    getAllWorktimes,
    search,
    assignFunction,
    open () {
      this.$vm2.open('modal-1')
    },
    close () {
      this.$vm2.close('modal-1')
    }
  },
  async beforeMount() {
    await this.getAllWorktimes();
    this.assignFunction()
  },
  async mounted() {
    await this.assignFunction()
  }
}

</script>

<style scoped>
.remove-button, .expand-button{
  cursor: pointer;
  font-size: large;
  color: black;
  text-underline: none;
}

.vm2_modal-content {
  position: relative;
  width: 50%;
  border-radius: 5em;
  background-color: red !important;
}

.custom-modal-close{
  text-align: right;
  background-color: #d9d9d9;
}
.custom-modal-close div{
  cursor: pointer;
  margin-bottom: 0;
  font-size: x-large;
  margin: 0.3em 0.5em 0 0;
}
.custom-modal-container{
  background-color: #d9d9d9;
  padding: 4em;
  width: 100%;
  text-align: center;
  border-radius: 0.5em;
}
.custom-modal-title{
  color: #ff5247;
  padding-bottom: 1em;
}
.custom-modal-text{
  color: black;
}
</style>