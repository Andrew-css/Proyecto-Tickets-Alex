<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">CLIENTES</h1>
      <div class="linea"></div>
    </div>
    <div class="botongregar"> <button type="button" class="button" @click="agregar()"> <span
          class="button__text">Añadir</span> <span class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
            viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor"
            height="24" fill="none" class="svg">
            <line y2="19" y1="5" x2="12" x1="12"></line>
            <line y2="12" y1="12" x2="19" x1="5"></line>
          </svg></span> </button> </div>

    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>

          <q-toolbar-title>Cliente</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="a">
          <label for="">Nombre: </label><br />
          <input type="text" v-model="nombre" />
          <span v-if="nombreError" class="error-message">{{ nombreError }}</span>
          <br />
          <label for="">Cedula: </label><br />
          <input type="text" v-model="cedula" name="cedula"/>
          <span v-if="cedulaError" class="error-message">{{ cedulaError }}</span>
          <br />
          <label for="">Email: </label><br />
          <input type="text" v-model="email" />
          <span v-if="emailError" class="error-message">{{ emailError }}</span>
          <br />
          <div v-if="loading" class="text-center">
            <q-spinner-hourglass color="primary" size="50px" />
            <p>Por favor, espere...</p>
          </div>
          <p style="color: red; font-weight: bold;"> {{ useCliente.errorvalidacion }}</p>
          <span v-if="mensaje" :class="[mensajeColor === 'success' ? 'success-message' : 'error-message']">{{ mensaje
          }}</span>
          <button class="butonenviar" @click="agregarNuevoCliente">Enviar</button>
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

        <q-card-section class="a">
          <label for="">Nombre: </label><br />
          <input type="text" v-model="nombre" />
          <span v-if="nombreError" class="error-message">{{ nombreError }}</span>
          <br />
          <label for="">Cedula: </label><br />
          <input type="number" v-model="cedula" readonly class="readonly-input" />
          <br />
          <label for="">Email: </label><br />
          <input type="text" v-model="email" readonly class="readonly-input" />
          <br />
          <div v-if="loading" class="text-center">
            <q-spinner-hourglass color="primary" size="50px" />
            <p>Por favor, espere...</p>
          </div>
          <div class="text-center">
            <span v-if="mensaje" :class="[mensajeColor === 'success' ? 'success-message' : 'error-message']">{{ mensaje
          }}</span>
          </div>
          <button class="butonenviar" @click="editarCliente" v-if="!loading">
            Editar Cliente
          </button>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-xl">
      <q-table class="text-center" :rows="rows" :columns="columns" row-key="id">
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title class="text-center">Clientes</q-toolbar-title>
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
              <div class="text-center">{{ props.row.email }}</div>
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
              <q-btn label="✅" color="primary" @click="useCliente.activar(props.row._id)" v-if="props.row.estado === 0" />
              <q-btn label="❌" color="primary" @click="useCliente.desactivar(props.row._id)"
                v-if="props.row.estado === 1" />
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
const nombreError = ref(null);
const cedulaError = ref(null);
const emailError = ref(null);
let loading = ref(false);
let mensaje = ref('');
let mensajeColor = ref(''); // Variable para el color del mensaje

const data = ref({
  nombre: nombre,
  cedula: cedula,
  email: email,
});

const soloNumeros = (value) => {
  const numeroRegex = /^[0-9]+$/;
  return numeroRegex.test(value);
};

const mostrarMensajeExito = (message) => {
  mensaje.value = message;
  setTimeout(() => {
    mensaje.value = '';
  }, 3000);
};

const editar = (row) => {
  console.log(row);
  toolbard.value = true;
  id.value = row._id;
  cambiar.value = true;
  nombre.value = row.nombre;
  cedula.value = row.cedula;
  email.value = row.email;
  estado.value = row.estado;
  clearErrors();
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
    name: "Email",
    label: "Email",
    align: "center",
    field: (row) => row.email,
  },
  {
    name: "Estado",
    label: "Estado",
    align: "center",
    field: (row) => row.estado,
  },
  {
    name: "d",
    label: "Opciones",
    field: "actions",
    align: "center",
  },
]);

const agregar = () => {
  toolbar.value = true;
  nombre.value = "";
  cedula.value = "";
  email.value = "";
};



const clearErrors = () => {

  setTimeout(() => {
    nombreError.value = null;
    cedulaError.value = null;
    emailError.value = null;
  }, 2000);
};

const agregarNuevoCliente = async () => {
  loading.value = true;
  nombreError.value = null;
  cedulaError.value = null;
  emailError.value = null;
  useCliente.errorvalidacion = '';

  if (!nombre.value) {
    nombreError.value = 'El nombre es requerido';
  } else if (nombre.value.length > 15) {
    nombreError.value = 'El nombre no debe tener más de 15 caracteres';
  }

  if (!cedula.value) {
    cedulaError.value = 'La cédula es requerida';
  } else if (cedula.value.length !== 10) {
    cedulaError.value = 'La cédula debe tener exactamente 10 caracteres';
  } else if (!soloNumeros(cedula.value)) {
    cedulaError.value = 'La cédula debe contener solo números';
  }

  if (!email.value) {
    emailError.value = 'El email es requerido';
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = 'El email debe ser válido';
  }

  if (!nombreError.value && !cedulaError.value && !emailError.value) {
    const data = {
      nombre: nombre.value,
      cedula: cedula.value,
      email: email.value,
    };

    try {
      const response = await useCliente.agregarNuevoCliente(data);

      if (useCliente.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Cliente añadido correctamente';
        setTimeout(() => {
          toolbar.value = false;
          nombre.value = '';
          cedula.value = '';
          email.value = '';
          useCliente.errorvalidacion = ''; 
          mensaje.value = '';
        }, 3000);
      } else {
        mensajeColor.value = 'error';
        mostrarMensajeExito('Error al añadir el cliente');
      }
    } catch (error) {
      console.log('Error al agregar el cliente:', error);
      mensajeColor.value = 'error';
      mostrarMensajeExito('Error al añadir el cliente');
    }
  }

  loading.value = false;
  clearErrors();
};

  

const editarCliente = async () => {
  clearErrors();

  // Validar los campos
  if (!nombre.value) {
    nombreError.value = 'El nombre es requerido';
  } else if (nombre.value.length > 15) {
    nombreError.value = 'El nombre no debe tener más de 15 caracteres';
  }

  if (!nombreError.value) {
    loading.value = true
    const data = {
      nombre: nombre.value,
      cedula: cedula.value,
      email: email.value,
    };

    try {
      const response = await useCliente.actualizarCliente(id.value, data);
      mostrarMensajeExito('Cliente editado correctamente');
      mensajeColor.value = 'success';
      loading.value = false;
      mensaje.value = "Cliente editado correctamente";
      setTimeout(() => {
        toolbard.value = false; // Cierra el modal después de 3 segundos
      }, 3000);
    } catch (error) {
      console.log('Error al agregar el cliente:', error);
      mensajeColor.value = 'error';
      mostrarMensajeExito('Error al editar el cliente');
    }
  }
}

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

.contenedor {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.linea {
  background-color: #1976d2;
  width: 50%;
  height: 5px;
}

.titulocli {
  font-size: 45px;
  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.botongregar {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.butoagre {
  margin-right: 47px;
  margin-bottom: 0px;
  margin-top: 0px;
}

.q-pa-xl {
  padding: 10px 48px 48px 48px;
}

.q-card {
  width: 60%;
  height: 60%;
  display: grid;
  grid-template-rows: 10% 90%;
}

.q-card__section {
  display: flex;
  flex-direction: column;
}

.butonenviar {
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

.button,
.button__icon,
.button__text {
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
  border: 1px solid #1976d2;
}

.error-message {
  color: red;
}

.readonly-input {
  background-color: #f2f2f2;
  cursor: not-allowed;
  color: #666;
  border: none;
  outline: none;
  padding: 5px;
  width: 100%;
}

.success-message {
  color: green;
  font-weight: bold;
}

.error-message {
  color: red;
  font-weight: bold;
}</style>
