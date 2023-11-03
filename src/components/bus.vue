<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">BUSES</h1>
      <div class="linea"></div>
    </div>
    <div class="botongregar"> <button type="button" class="button" @click="agregar()"> <span class="button__text">Añadir</span> <span class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span> </button> </div>
    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
          <q-toolbar-title>Buses</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <label for="">Empresa: </label><br />
          <input type="text" v-model="empresa" />
          <br />
          <label for="">Asiento: </label><br />
          <input type="number" v-model="asiento" />
          <br />
          <label for="">Placa: </label><br />
          <input type="text" v-model="placa" />
          <br />
          <label for="">Conductor: </label><br />
          <select v-model="conductor" id="conductor">
            <option value="" disabled>Selecciona un conductor</option>
            <option v-for="c in conductores" :value="c._id" :key="c._id">{{ c.nombre }}</option>
          </select>
          <br />
          <br />
          <button @click="useBus.agregarNuevoBus(data); toolbar = false">Enviar</button>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="toolbard">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>

          <q-toolbar-title>Editar Bus</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <label for="">Empresa: </label><br />
          <input type="text" v-model="empresa" />
          <br />
          <label for="">Asiento: </label><br />
          <input type="number" v-model="asiento" />
          <br />
          <label for="">Placa: </label><br />
          <input type="text" v-model="placa" />
          <br />
          <label for="">Conductor: </label><br />
          <select v-model="conductor" id="conductor">
            <option value="" disabled>Selecciona un conductor</option>
            <option v-for="c in conductores" :value="c._id" :key="c._id">{{ c.nombre }}</option>
          </select>
          <br />
          <p :class="{ 'text-right': true, activo: estado === 1, inactivo: estado === 0 }">
            {{ obtenerTextoEstado(estado) }}
          </p>
          <button @click="useBus.actualizarBus(id, data); toolbard = false">Enviar</button>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-xl">
      <q-table class="text-center" :rows="rows" :columns="columns" row-key="id">
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title class="text-center">Buses</q-toolbar-title>
          </q-toolbar>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="q-ma-xs text-center">{{ props.row.empresa }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.asiento }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.placa }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.conductor.nombre }}</div>
            </q-td>
            <q-td auto-width>
              <div :class="{
                'text-center': true,
                activo: props.row.estado === 1,
                inactivo: props.row.estado === 0
              }">
                {{ obtenerTextoEstado(props.row.estado) }}
              </div>
            </q-td>
            <q-td auto-width>
              <q-btn label="📋" color="primary" @click="editar(props.row)" />
              <q-btn label="✅" color="primary" @click="useBus.activar(props.row._id)" v-if="props.row.estado === 0" />
              <q-btn label="❌" color="primary" @click="useBus.desactivar(props.row._id)" v-if="props.row.estado === 1" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { useBusStore } from "../stores/bus.js";
import { useConductorStore } from "../stores/conductor.js";
import { onMounted, ref } from "vue";
const useBus = useBusStore();
const useConductor = useConductorStore();
let rows = ref([]);
let buses = ref([]);
let conductores = ref([]);

let id = ref("");
let empresa = ref("");
let asiento = ref("");
let placa = ref("");
let conductor = ref("");
let estado = ref(1);
let toolbard = ref(false);
let toolbar = ref(false);
let cambiar = ref(false);
const data = ref({
  empresa: empresa,
  asiento: asiento,
  placa: placa,
  conductor:  conductor,
});

console.log("Conductores lista: ", conductor)

const editar = (row) => {
  console.log(row);
  toolbard.value = true;
  id.value = row._id;
  cambiar.value = true;
  empresa.value = row.empresa;
  asiento.value = row.asiento;
  placa.value = row.placa;
  conductor.value = row.conductor;
  estado.value = row.estado;
};

const columns = ref([
  {
    name: "Empresa",
    label: "Empresa",
    align: "center",
    field: (row) => row.empresa,
  },
  {
    name: "Asiento",
    label: "Asiento",
    align: "center",
    field: (row) => row.asiento,
  },
  {
    name: "Placa",
    label: "Placa",
    align: "center",
    field: (row) => row.placa,
  },
  {
    name: "Conductor",
    label: "Conductor",
    align: "center",
    field: (row) => row.conductor,
  },
  {
    name: "Estado",
    label: "Estado",
    align: "center",
    field: (row) => row.estado,
  },
  {
    name: "Opciones",
    label: "Opciones",
    align: "center",
    field: "actions",
  },
]);



const agregar = () => {
  toolbar.value = true;
  empresa.value = "";
  asiento.value = "";
  placa.value = "";
  estado.value = 1;
};


async function obtenerBuses() {
  try {
    await useBus.obtenerBuses();
    buses.value = useBus.rows;
    rows.value = useBus.rows;
  } catch (error) {
    console.log(error);
  }
}

async function obtenerConductores() {
  try {
    await useConductor.obtenerConductores(); // Asumiendo que tienes un método en useConductor para obtener conductores
    conductores.value = useConductor.rows;
  } catch (error) {
    console.log(error);
  }
}

async function desactivarBus(id) {
  await useBus.desactivar(id);
  obtenerBuses();
}

async function activarBus(id) {
  await useBus.activar(id);
  obtenerBuses();
}

const obtenerTextoEstado = (estado) => {
  return estado === 1 ? "Activo" : "Inactivo";
};

onMounted(async () => {
  obtenerBuses();
  obtenerConductores();
  desactivarBus()
  activarBus()
});

</script>

<style scoped>
.activo {
  color: green;
  font-weight: bold;
}
.inactivo {
  color: red;
  font-weight: bold;
}
p {
  display: flex;
}
.contenedor{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.linea{
  background-color: #1976d2;
  width: 50%;
  height: 5px;
}
.titulocli{
  font-size: 45px;
  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.botongregar{
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.butoagre{
  margin-right: 47px;
  margin-bottom: 0px;
  margin-top: 0px;
}
.q-pa-xl{
  padding: 10px 48px 48px 48px;
}

.q-card{
  width: 60%;
  height: 60%;
  display: grid;
  grid-template-rows: 10% 90%;
}

.q-card__section{
  display: flex;
  flex-direction: column;
}

.butonenviar{
  margin-top: 30px;
}

.button {
  position: relative;
  width: 156px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid blue;
  background-color: #518fcc;
  margin-right: 50px;
}

.button, .button__icon, .button__text {
  transition: all 0.3s;
}

.button .button__text {
  transform: translateX(30px);
  color: #fff;
  font-weight: 600;
}

.button .button__icon {
  position: absolute;
  transform: translateX(109px);
  height: 100%;
  width: 39px;
  background-color: #1976d2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button .svg {
  width: 30px;
  stroke: #fff;
}

.button:hover {
  background: #1976d2;
}

.button:hover .button__text {
  color: transparent;
}

.button:hover .button__icon {
  width: 148px;
  transform: translateX(0);
}

.button:active .button__icon {
  background-color: #1976d2;
}

.button:active {
  border: 1px solid #1976d2 ;
}
</style>