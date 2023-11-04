<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">RUTAS</h1>
      <div class="linea"></div>
    </div>
    <div class="botongregar"> <button type="button" class="button" @click="agregar()"> <span class="button__text">Añadir</span> <span class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span> </button> </div>
    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
          <q-toolbar-title>Rutas</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <label for="ciudad_origen">Ciudad Origen: </label><br />
          <select v-model="ciudad_origen" id="ciudad_origen">
            <option value="" disabled>Selecciona una ciudad</option>
            <option v-for="ciudad in ciudades" :value="ciudad.id" :key="ciudad.id">{{ ciudad.nombre }}</option>
          </select>
          <br />
          <label for="ciudad_destino">Ciudad Destino: </label><br />
          <select v-model="ciudad_destino" id="ciudad_destino">
            <option value="" disabled>Selecciona una ciudad</option>
            <option v-for="ciudad in ciudades" :value="ciudad.id" :key="ciudad.id">{{ ciudad.nombre }}</option>
          </select>
          <br />
          <label for="hora_salida">Hora Salida: </label><br />
          <input type="text" v-model="hora_salida" />
          <br />
          <label for="valor">Valor: </label><br />
          <input type="number" v-model="valor" />
          <br />
          <label for="bus">Bus: </label><br />
          <select v-model="bus" id="bus">
            <option value="" disabled>Selecciona un bus</option>
            <option v-for="b in buses" :value="b.id" :key="b.id">{{ b.empresa }}</option>
          </select>
          <br />
          <br />
          <button @click="useRuta.agregarNuevaRuta(data); toolbar = false">Enviar</button>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="toolbard">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
          <q-toolbar-title>Editar Ruta</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <label for="ciudad_origen">Ciudad Origen: </label><br />
          <select v-model="ciudad_origen" id="ciudad_origen">
            <option value="" disabled>Selecciona una ciudad</option>
            <option v-for="ciudad in ciudades" :value="ciudad._id" :key="ciudad._id">{{ ciudad.nombre }}</option>
          </select>
          <br />
          <label for="ciudad_destino">Ciudad Destino: </label><br />
          <select v-model="ciudad_destino" id="ciudad_destino">
            <option value="" disabled>Selecciona una ciudad</option>
            <option v-for="ciudad in ciudades" :value="ciudad._id" :key="ciudad._id">{{ ciudad.nombre }}</option>
          </select>
          <br />
          <label for="hora_salida">Hora Salida: </label><br />
          <input type="text" v-model="hora_salida" />
          <br />
          <label for="valor">Valor: </label><br/>
          <input type="number" v-model="valor" />
          <br />
          <label for="bus">Bus: </label><br />
          <select v-model="bus" id="bus">
            <option value="" disabled>Selecciona un bus</option>
            <option v-for="b in buses" :value="b._id" :key="b._id">{{ b.placa }}</option>
          </select>
          <br />
          <p
            :class="{ 'text-right': true, activo: estado === 1, inactivo: estado === 0 }"
          >
            {{ obtenerTextoEstado(estado) }}
          </p>
          <button @click="useRuta.actualizarRuta(id, data); toolbard = false">Enviar</button>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="q-pa-xl">
      <q-table class="text-center" :rows="rows" :columns="columns" row-key="id">
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title class="text-center">Rutas</q-toolbar-title>
          </q-toolbar>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="q-ma-xs text-center">{{ props.row.ciudad_origen.nombre }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.ciudad_destino.nombre }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.hora_salida }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.valor }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.bus.placa }}</div>
            </q-td>
            <q-td auto-width>
              <div
                :class="{
                  'text-center': true,
                  activo: props.row.estado === 1,
                  inactivo: props.row.estado === 0
                }"
              >
                {{ obtenerTextoEstado(props.row.estado) }}
              </div>
            </q-td>
            <q-td auto-width>
              <q-btn label="📋" color="primary" @click="editar(props.row)" />
              <q-btn label="✅" color="primary" @click="useRuta.activar(props.row._id)" v-if="props.row.estado === 0" />
              <q-btn label="❌" color="primary" @click="useRuta.desactivar(props.row._id)" v-if="props.row.estado === 1" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { useRutaStore } from "../stores/ruta.js";
import { useCiudadStore } from "../stores/ciudad.js";
import { useBusStore } from "../stores/bus.js";
import { onMounted, ref } from "vue";

const useRuta = useRutaStore();
const useCiudad = useCiudadStore();
const useBus = useBusStore();

let rows = ref([]);
let rutas = ref([]);
let ciudades = ref([]);
let buses = ref([]);

let id = ref("");
let ciudad_origen = ref("");
let ciudad_destino = ref("");
let hora_salida = ref("");
let valor = ref("");
let bus = ref("");
let estado = ref(1);
let toolbard = ref(false);
let toolbar = ref(false);
let cambiar = ref(false);

const data = ref({
  ciudad_origen: ciudad_origen,
  ciudad_destino: ciudad_destino,
  hora_salida: hora_salida,
  valor: valor,
  bus: bus,
});

const editar = (row) => {
  toolbard.value = true;
  id.value = row._id;
  cambiar.value = true;
  ciudad_origen.value = row.ciudad_origen;
  ciudad_destino.value = row.ciudad_destino;
  hora_salida.value = row.hora_salida;
  valor.value = row.valor;
  bus.value = row.bus;
  estado.value = row.estado;
};

const columns = ref([
  {
    name: "Ciudad Origen",
    label: "Ciudad Origen",
    align: "center",
    field: (row) => row.ciudad_origen,
  },
  {
    name: "Ciudad Destino",
    label: "Ciudad Destino",
    align: "center",
    field: (row) => row.ciudad_destino,
  },
  {
    name: "Hora Salida",
    label: "Hora Salida",
    align: "center",
    field: (row) => row.hora_salida,
  },
  {
    name: "Valor",
    label: "Valor",
    align: "center",
    field: (row) => row.valor,
  },
  {
    name: "Bus",
    label: "Bus",
    align: "center",
    field: (row) => row.bus,
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

async function obtenerRutas() {
  try {
    await useRuta.obtenerRutas();
    rutas.value = useRuta.rows;
    rows.value = useRuta.rows;
  } catch (error) {
    console.log(error);
  }
}

async function obtenerCiudades() {
  try {
    await useCiudad.obtenerCiudades();
    ciudades.value = useCiudad.rows;
  } catch (error) {
    console.log(error);
  }
}

async function obtenerBuses() {
  try {
    await useBus.obtenerBuses();
    buses.value = useBus.rows;
  } catch (error) {
    console.log(error);
  }
}

async function desactivarRuta(id) {
  await useRuta.desactivar(id);
  obtenerRutas();
}

async function activarRuta(id) {
  await useRuta.activar(id);
  obtenerRutas();
}

const obtenerTextoEstado = (estado) => {
  return estado === 1 ? "Activo" : "Inactivo";
};



onMounted(async () => {
  obtenerRutas();
  obtenerCiudades();
  obtenerBuses();
  desactivarRuta()
  activarRuta()
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