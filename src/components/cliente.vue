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

    <div class="q-pa-xl">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
      >
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title class="text-center">Clientes</q-toolbar-title>
          </q-toolbar>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="q-ma-xs text-left">{{ props.row.nombre }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-right">{{ props.row.cedula }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-right">{{ props.row.email }}</div>
            </q-td>
            <q-td auto-width>
              <div
                :class="{
                  'text-right': true,
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
                @click="useCliente.activar(props.row._id)"
                v-if="props.row.estado === 0"
              />
              <q-btn
                label="❌"
                color="primary"
                @click="useCliente.desactivar(props.row._id)"
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
