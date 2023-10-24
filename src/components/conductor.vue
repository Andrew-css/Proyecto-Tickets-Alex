<template>
  <div>
    <q-btn label="Añadir" color="primary" @click="agregar()" />
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
          <button @click="useCliente.actualizarCliente(id, data); toolbard = false">Enviar</button>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-markup-table>
        <thead>
          <tr>
            <th>
              <h4 class="q-ma-xs text-left">Conductores</h4>
            </th>
          </tr>
          <tr>
            <th class="text-left"><b>Nombre</b></th>
            <th class="text-right"><b>Cedula</b></th>
            <th class="text-right"><b>Estado</b></th>
            <th class="text-right"><b>Opciones</b></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td class="text-left">{{ row.nombre }}</td>
            <td class="text-right">{{ row.cedula }}</td>
            <td
              class="text-right"
              :class="{
                'text-right': true,
                activo: row.estado === 1,
                inactivo: row.estado === 0,
              }"
            >
              {{ obtenerTextoEstado(row.estado) }}
            </td>
            <td class="text-right">
              <q-btn label="Editar" color="primary" @click="editar(row)" />
              <q-btn
                label="Activar"
                color="primary"
                @click="useConductor.activar(row._id)"
                v-if="row.estado == 0"
              />
              <q-btn
                label="Desactivar"
                color="primary"
                @click="useConductor.desactivar(row._id)"
                v-if="row.estado == 1"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
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
    align: "left",
    field: (row) => row.nombre,
  },
  {
    name: "Cedula",
    label: "Cedula",
    field: (row) => row.cedula,
  },
  {
    name: "Estado",
    label: "Estado",
    field: (row) => row.estado,
  },
  {
    name: "d",
    label: "Opciones",
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

</style>