<template>
  <div>
    <q-btn label="Añadir" color="primary" @click="agregar()" />
    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>

          <q-toolbar-title>Cliente</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <label for="">Nombre: </label><br />
          <input type="text" v-model="nombre" />
          <br />
          <label for="">Cedula: </label><br />
          <input type="number" v-model="cedula" />
          <br />
          <label for="">Email: </label><br />
          <input type="text" v-model="email" /><br />
          <button @click="useCliente.agregarNuevoCliente(data), toolbar = false">Enviar</button>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="toolbard">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>

          <q-toolbar-title>Editar Cliente</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <label for="">Nombre: </label><br />
          <input type="text" v-model="nombre" />
          <br />
          <label for="">Cedula: </label><br />
          <input type="number" v-model="cedula" />
          <br />
          <label for="">Email: </label><br />
          <input type="text" v-model="email" /><br />
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
            <th class="text-left">
              <h4 class="q-ma-xs text-left">Clientes</h4>
            </th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <th class="text-left"><b>Nombre</b></th>
            <th class="text-right"><b>Cedula</b></th>
            <th class="text-right"><b>Email</b></th>
            <th class="text-right"><b>Estado</b></th>
            <th class="text-right"><b>Opciones</b></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td class="text-left">{{ row.nombre }}</td>
            <td class="text-right">{{ row.cedula }}</td>
            <td class="text-right">{{ row.email }}</td>
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
                @click="useCliente.activar(row._id)"
                v-if="row.estado == 0"
              />
              <q-btn
                label="Desactivar"
                color="primary"
                @click="useCliente.desactivar(row._id)"
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
import { useClienteStore } from "../stores/cliente.js";
import { onMounted, ref } from "vue";

const useCliente = useClienteStore();
let rows = ref([]);
let clientes = ref([]);

let id = ref("");
let nombre = ref("");
let cedula = ref("");
let email = ref("");
let estado = ref(1);
let toolbard = ref(false);
let toolbar = ref(false);
let cambiar = ref(false);
const data = ref({
  nombre: nombre,
  cedula: cedula,
  email: email,
});

const editar = (row) => {
  console.log(row);
  toolbard.value = true;
  id.value = row._id;
  cambiar.value = true;
  nombre.value = row.nombre;
  cedula.value = row.cedula;
  email.value = row.email;
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
    name: "Email",
    label: "Email",
    field: (row) => row.email,
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
  email.value = "";
};

async function obtenerCliente() {
  try {
    await useCliente.obtenerClientes();
    clientes.value = useCliente.rows;
    rows.value = useCliente.rows;
  } catch (error) {
    console.log(error);
  }
}

async function desactivarCliente(id) {
  await useCliente.desactivar(id);
  obtenerCliente();
}

async function activarCliente(id) {
  await useCliente.activar(id);
  obtenerCliente();
}

const obtenerTextoEstado = (estado) => {
  return estado === 1 ? "Activo" : "Inactivo";
};



onMounted(async () => {
  obtenerCliente();
  desactivarCliente();
  activarCliente();
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
</style>
