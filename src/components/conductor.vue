<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">CONDUCTORES</h1>
      <div class="linea"></div>
    </div>    
    <div class="botongregar">
      <q-btn class="butoagre" label="Añadir" color="primary" @click="agregar()" />
    </div>
    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>

          <q-toolbar-title>Conductores</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <label for="">Nombre: </label><br />
          <input type="text" v-model="nombre" />
          <br />
          <label for="">Cedula: </label><br />
          <input type="number" v-model="cedula" />
          <br />
          <button @click="useConductor.agregarNuevoConductor(data), toolbar = false">Enviar</button>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="toolbard">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>

          <q-toolbar-title>Editar Conductor</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <label for="">Nombre: </label><br />
          <input type="text" v-model="nombre" />
          <br />
          <label for="">Cedula: </label><br />
          <input type="number" v-model="cedula" />
          <br />
          <label for="">Estado: </label><br />
          <p
            :class="{ 'text-right': true, activo: estado === 1, inactivo: estado === 0 }"
          >
            {{ obtenerTextoEstado(estado) }}
          </p>
          <button @click="useConductor.actualizarConductor(id, data); toolbard = false">Enviar</button>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-xl">
      <q-table
      class="text-center"
        :rows="rows"
        :columns="columns"
        row-key="id"
      >
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title class="text-center">Conductores</q-toolbar-title>
          </q-toolbar>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="q-ma-xs text-center">{{ props.row.nombre }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.cedula }}</div>
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
              <q-btn
                label="📋"
                color="primary"
                @click="editar(props.row)"
              />
              <q-btn
                label="✅"
                color="primary"
                @click="useConductor.activar(props.row._id)"
                v-if="props.row.estado === 0"
              />
              <q-btn
                label="❌"
                color="primary"
                @click="useConductor.desactivar(props.row._id)"
                v-if="props.row.estado === 1"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
  
</template>

<script setup>
import { useConductorStore } from "../stores/conductor.js";
import { onMounted, ref } from "vue";
const useConductor = useConductorStore();
let rows = ref([]);
let conductores = ref([]);

let id = ref("");
let nombre = ref("");
let cedula = ref("");
let estado = ref(1);
let toolbard = ref(false);
let toolbar = ref(false);
let cambiar = ref(false);
const data = ref({
  nombre: nombre,
  cedula: cedula,
});

const editar = (row) => {
  console.log(row);
  toolbard.value = true;
  id.value = row._id;
  cambiar.value = true;
  nombre.value = row.nombre;
  cedula.value = row.cedula;
  estado.value = row.estado;
};

const columns = ref([
  {
    name: "Nombre",
    label: "Nombre",
    align: "center",
    field: (row) => row.nombre,
  },
  {
    name: "Cedula",
    label: "Cedula",
    align: "center",
    field: (row) => row.cedula,
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
  nombre.value = "";
  cedula.value = "";
};

async function obtenerConductor() {
  try {
    await useConductor.obtenerConductores()
    conductores.value = useConductor.rows;
    rows.value = useConductor.rows;
    console.log("Conductor",conductores.value)

  } catch (error) {
    console.log(error);
  }
}

async function desactivarConductor(id) {
  await useConductor.desactivarConductor(id);
  obtenerConductor();
}

async function activarConductor(id) {
  await useConductor.activarConductor(id);
  obtenerConductor();
}

const obtenerTextoEstado = (estado) => {
  return estado === 1 ? "Activo" : "Inactivo";
};



onMounted(async () => {
  obtenerConductor();
  desactivarConductor();
  activarConductor();
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
</style>