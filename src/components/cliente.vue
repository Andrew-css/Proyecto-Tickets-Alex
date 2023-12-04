<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">CLIENTES</h1>
      <div class="linea"></div>
    </div>
    <div class="r">
      <button type="button" class="  button " style="margin:0 auto;" data-bs-toggle="modal"
        data-bs-target="#staticBackdrop" @click="agregar()"> <span class="button__text">Añadir</span> <span
          class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg">
            <line y2="19" y1="5" x2="12" x1="12"></line>
            <line y2="12" y1="12" x2="19" x1="5"></line>
          </svg></span>
      </button>
    </div>
    <div v-if="loading" class="text-center">
      <q-spinner-hourglass color="primary" size="70px" />
      <h6>Por favor, espere...</h6>
    </div>

    <!-- MODAL AGREGAR -->
    <q-dialog v-model="mostrarModalAgregar" position="top">

      <div class="modal fade" style="margin-top: 12%;" id="staticBackdrop" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" ref="addClientModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="cerrar">
                <p class="title">Añadir cliente</p>
                <button type="button" data-bs-dismiss="modal" @click="cerrar()" class="row justify-center items-center"
                  id="botoncerrar">❌</button>
              </div>
              <span v-if="nombreError || cedulaError || telefonoError || emailError" class="error-message">{{ nombreError || cedulaError ||
                telefonoError || emailError }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useCliente.errorvalidacion }}</p>
              <span v-if="mensaje" :class="[mensajeColor === 'success' ? 'success-message' : 'error-message']">{{
                mensaje
              }}</span>
              <div v-if="loading" class="text-center">
                <q-spinner-hourglass color="primary" size="50px" />
                <p>Por favor, espere...</p>
              </div>
              <label for="nombre">
                <input placeholder="Nombre" type="text" class="input" v-model="nombre">
                <span>Nombre</span>
              </label>

              <label for="cedula">
                <input placeholder="Cedula" type="text" class="input" v-model="cedula">
                <span>Cedula</span>
              </label>

              <label for="telefono">
                <input placeholder="Telefono" type="text" class="input" v-model="telefono">
                <span>Teléfono</span>
              </label>

              <label for="email">
                <input placeholder="Email" type="text" class="input" v-model="email">
                <span>Email</span>
              </label>

              <!-- Resto del contenido del formulario... -->

              <button type="button" @click="agregarNuevoCliente" class="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>

    </q-dialog>

    <!-- MODAL EDITAR  -->

    <q-dialog v-model="mostrarModalEditar" position="top">


      <div class="modal fade" style="margin-top: 12%;" id="editClientModal" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" ref="editClientModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="cerrar">
                <p class="title">Editar cliente</p>
                <button type="button" data-bs-dismiss="modal" @click="cerrarEditar()"
                  class="row justify-center items-center" id="botoncerrar">❌</button>
              </div>
              <span v-if="nombreError || cedulaError || telefonoError || emailError" class="error-message">{{ nombreError || cedulaError ||
               telefonoError || emailError }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useCliente.errorvalidacion }}</p>
              <span v-if="mensaje" :class="[mensajeColor === 'success' ? 'success-message' : 'error-message']">{{
                mensaje
              }}</span>
              <div v-if="loading" class="text-center">
                <q-spinner-hourglass color="primary" size="50px" />
                <p>Por favor, espere...</p>
              </div>
              <label for="nombre">
                <input placeholder="Nombre" type="text" class="input" v-model="nombre">
                <span>Nombre</span>
              </label>

              <label for="cedula">
                <input placeholder="Cedula" type="text" class="input" v-model="cedula">
                <span>Cedula</span>
              </label>

              <label for="telefono">
                <input placeholder="Telefono" type="text" class="input" v-model="telefono">
                <span>Teléfono</span>
              </label>

              <label for="email">
                <input placeholder="Email" type="text" class="input" v-model="email">
                <span>Email</span>
              </label>

              <!-- Resto del contenido del formulario... -->

              <button type="button" @click="editarCliente" class="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
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
              <div class="text-center">{{ props.row.telefono }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.email }}</div>
            </q-td>
            <q-td auto-width>
              <div :class="{
                'text-center': true,
                activo: props.row.estado === 1,
                inactivo: props.row.estado === 0
              }
                ">
                {{ obtenerTextoEstado(props.row.estado) }}
              </div>
            </q-td>
            <q-td auto-width>
              <q-btn label="📋" color="primary" @click="editar(props.row)" data-bs-toggle="modal"
                data-bs-target="#editClientModal" />
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
let telefono = ref("");
let email = ref("");
let estado = ref(1);
let loading = ref(false);
let mensaje = ref('');
let mensajeColor = ref('');
const nombreError = ref(null);
const cedulaError = ref(null);
const telefonoError = ref(null)
const emailError = ref(null);

const mostrarModalAgregar = ref(false);
const mostrarModalEditar = ref(false);


const soloNumeros = (value) => {
  const numeroRegex = /^[0-9]+$/;
  return numeroRegex.test(value);
};


const editar = (row) => {
  console.log(row);
  id.value = row._id;
  nombre.value = row.nombre;
  cedula.value = row.cedula;
  email.value = row.email;
  telefono.value = row.telefono
  estado.value = row.estado;
  mostrarModalEditar.value = true;
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
    name: "Telefono",
    label: "Telefono",
    align: "center",
    field: (row) => row.telefono,
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
  nombre.value = "";
  cedula.value = "";
  email.value = "";
  telefono.value = "";
  mensaje.value = "";
  mostrarModalAgregar.value = true

};

const cerrar = () => {
  nombre.value = "";
  cedula.value = "";
  email.value = "";
  telefono.value = "";
  mensaje.value = "";
  mostrarModalAgregar.value = false
};

const cerrarEditar = () => {
  nombre.value = "";
  cedula.value = "";
  email.value = "";
  telefono.value = "";
  mensaje.value = "";
  mostrarModalEditar.value = false

};

const clearErrors = () => {

  setTimeout(() => {
    nombreError.value = null;
    cedulaError.value = null;
    telefonoError.value = null;
    emailError.value = null;
  }, 5500);
};

const agregarNuevoCliente = async () => {
  nombreError.value = null;
  cedulaError.value = null;
  emailError.value = null;
  telefonoError.value = null;
  useCliente.errorvalidacion = '';
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!nombre.value) {
    nombreError.value = 'El nombre es requerido';
  } else if (!nombre.value.trim()) {
    nombreError.value = 'Solo espacios no es permitido, por favor digite un nombre real'
  } 

  if (!cedula.value) {
    cedulaError.value = 'La cédula es requerida';
  } else if (!soloNumeros(cedula.value)) {
    cedulaError.value = 'La cédula debe contener solo números (sin espacios si es el caso)';
  } else if (cedula.value.length !== 10) {
    cedulaError.value = 'La cédula debe tener exactamente 10 caracteres (eliminar espacios si es el caso)';
  } 

  if (!telefono.value) {
    telefonoError.value = 'El telefono es requerido ';
  } else if (!telefono.value.trim()) {
    telefonoError.value = 'Solo espacios no es permitido, por favor digite un teléfono real'
  } else if (telefono.value.length !== 10) {
    telefonoError.value = 'El teléfono debe tener exactamente 10 caracteres (eliminar espacios si es el caso)';
  } 

  if (!email.value) {
    emailError.value = 'El email es requerido';
  } else if (!email.value.trim()) {
    emailError.value = 'Solo espacios no es permitido, por favor digite un email real'
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'El email debe ser válido (eliminar espacios si es el caso)';
  }

  if (!nombreError.value && !cedulaError.value && !telefonoError.value && !emailError.value) {
    loading.value = true;
    const data = {
      nombre: nombre.value,
      cedula: cedula.value,
      telefono: telefono.value,
      email: email.value,
    };

    try {
      const response = await useCliente.agregarNuevoCliente(data);
      if (useCliente.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Cliente añadido correctamente (presione ❌ para cerrar)';
        loading.value = false;
        setTimeout(() => {
          nombre.value = '';
          cedula.value = '';
          email.value = '';
          telefono.value = '';
          useCliente.errorvalidacion = '';
          mensaje.value = '';
        }, 5500);
      } else {
        mensajeColor.value = 'error';
        loading.value = false;
        setTimeout(() => {
          useCliente.errorvalidacion = '';
        }, 7500);
      }
    } catch (error) {
      console.log('Error al agregar el cliente:', error);
      mensajeColor.value = 'error';
      loading.value = false;
      setTimeout(() => {
        useCliente.errorvalidacion = '';
      }, 7500);
    }
  }

  loading.value = false;
  clearErrors();
};



const editarCliente = async () => {
  nombreError.value = null;
  cedulaError.value = null;
  emailError.value = null;
  telefonoError.value = null;
  useCliente.errorvalidacion = '';
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!nombre.value) {
    nombreError.value = 'El nombre es requerido';
  } else if (!nombre.value.trim()) {
    nombreError.value = 'Solo espacios no es permitido, por favor digite un nombre real'
  } 

  if (!cedula.value) {
    cedulaError.value = 'La cédula es requerida';
  } else if (!soloNumeros(cedula.value)) {
    cedulaError.value = 'La cédula debe contener solo números (sin espacios si es el caso)';
  } else if (cedula.value.length !== 10) {
    cedulaError.value = 'La cédula debe tener exactamente 10 caracteres (eliminar espacios si es el caso)';
  } 

  if (!telefono.value) {
    telefonoError.value = 'El telefono es requerido ';
  } else if (!telefono.value.trim()) {
    telefonoError.value = 'Solo espacios no es permitido, por favor digite un teléfono real'
  } else if (telefono.value.length !== 10) {
    telefonoError.value = 'El teléfono debe tener exactamente 10 caracteres (eliminar espacios si es el caso)';
  } 

  if (!email.value) {
    emailError.value = 'El email es requerido';
  } else if (!email.value.trim()) {
    emailError.value = 'Solo espacios no es permitido, por favor digite un email real'
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'El email debe ser válido (eliminar espacios si es el caso)';
  }
  console.log("Hola soy id", id.value)

  if (!nombreError.value && !cedulaError.value && !telefonoError.value && !emailError.value) {
    loading.value = true;
    const data = {
      _id: id.value,
      nombre: nombre.value,
      cedula: cedula.value,
      telefono: telefono.value,
      email: email.value,
    };

    try {
      const response = await useCliente.actualizarCliente(id.value, data);
      if (useCliente.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Cliente editado correctamente (presione ❌ para cerrar)';
        loading.value = false;
        setTimeout(() => {
          useCliente.errorvalidacion = '';
          mensaje.value = '';
        }, 5500);
      } else {
        mensajeColor.value = 'error';
        loading.value = false;
        setTimeout(() => {
          useCliente.errorvalidacion = '';
        }, 7500);
      }
    } catch (error) {
      console.log('Error al agregar el cliente:', error);
      mensajeColor.value = 'error';
      loading.value = false;
      setTimeout(() => {
        useCliente.errorvalidacion = '';
      }, 7500);
    }
  }
  clearErrors();
}

async function obtenerCliente() {
  loading.value = true
  try {
    await useCliente.obtenerClientes();
    clientes.value = useCliente.rows;
    rows.value = useCliente.rows.reverse();
    loading.value = false
    console.log(clientes.value)
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

#readonly {
  background-color: #ffeee4;
  cursor: not-allowed;
  color: #505050;
  border: 1px solid rgb(198, 198, 198);
  outline: none;
  height: 50px;
  padding: 5px;
  width: 100%;
}

.success-message {
  color: green;
  font-weight: bold;
  font-size: 20px;
}

.error-message {
  color: red;
  font-weight: bold;
  font-size: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 500px;
  background-color: #fff;
  padding: 20px;
  border-radius: 20px;
  position: relative;
}

.title {
  font-size: 28px;
  color: royalblue;
  font-weight: 600;
  letter-spacing: -1px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
}

.title::before,
.title::after {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  border-radius: 50%;
  left: 0px;
  background-color: royalblue;
}

.title::before {
  width: 18px;
  height: 18px;
  background-color: royalblue;
}

.title::after {
  width: 18px;
  height: 18px;
  animation: pulse 1s linear infinite;
}

.message,
.signin {
  color: rgba(88, 87, 87, 0.822);
  font-size: 14px;
}

.signin {
  text-align: center;
}

.signin a {
  color: royalblue;
}

.signin a:hover {
  text-decoration: underline royalblue;
}

.flex {
  display: flex;
  width: 150%;
  gap: 6px;
}

.form label {
  position: relative;
}

.form label .input {
  width: 100%;
  padding: 10px 10px 20px 10px;
  outline: 0;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;
}

.form label .input+span {
  position: absolute;
  left: 10px;
  top: 15px;
  color: grey;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
}

.form label .input:placeholder-shown+span {
  top: 15px;
  font-size: 0.9em;
}

.form label .input:focus+span,
.form label .input:valid+span {
  top: 30px;
  font-size: 0.7em;
  font-weight: 600;
}

.form label .input:valid+span {
  color: green;
}

.submit {
  border: none;
  outline: none;
  background-color: royalblue;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  transform: .3s ease;
}

.submit:hover {
  background-color: rgb(56, 90, 194);
}

@keyframes pulse {
  from {
    transform: scale(0.9);
    opacity: 1;
  }

  to {
    transform: scale(1.8);
    opacity: 0;
  }
}

.cerrar {
  display: flex;
  justify-content: space-between;
  margin-right: 20px;

}


#botoncerrar {
  width: 5px;
  font-size: 25px;
  border: none;
  background-color: white;
  cursor: pointer;
}

.r {
  display: flex;
  margin-top: 20px;
}
</style>