<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">VENDEDORES</h1>
      <div class="linea"></div>
    </div>
    <div class="botongregar"> </div>
    <!-- Button trigger modal -->

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
    <q-dialog v-model="mostrarModalAgregar" position="top">
      <div class="modal fade" style="margin-top: 5%;" id="staticBackdrop" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" ref="addClientModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="cerrar">
                <p class="title">Añadir vendedor</p>
                <button type="button" data-bs-dismiss="modal" @click="cerrar()" class="row justify-center items-center"
                  id="botoncerrar">❌</button>
              </div>
              <span v-if="nombreError || apellidoError || cedulaError || telefonoError || usuarioError || contrasenaError"
                class="error-message">{{ nombreError || apellidoError || cedulaError || telefonoError || usuarioError ||
                  contrasenaError }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useVendedor.errorvalidacion }}</p>
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

              <label for="apellido">
                <input placeholder="Apellido" type="text" class="input" v-model="apellido">
                <span>Apellido</span>
              </label>

              <label for="cedula">
                <input placeholder="Cedula" type="text" class="input" v-model="cedula">
                <span>Cédula</span>
              </label>

              <label for="telefono">
                <input placeholder="Telefono" type="text" class="input" v-model="telefono">
                <span>Teléfono</span>
              </label>

              <label for="usuario">
                <input placeholder="Usuario" type="text" class="input" v-model="usuario">
                <span>Usuario</span>
              </label>

              <label for="contrasena">
                <input placeholder="Contrasena" type="text" class="input" v-model="contrasena">
                <span>Contraseña</span>
              </label>

              <!-- Resto del contenido del formulario... -->

              <button type="button" @click="agregarNuevoVendedor" class="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </q-dialog>

    <q-dialog v-model="mostrarModalEditar" position="top">
      <div class="modal fade" style="margin-top: 12%;" id="editClientModal" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="cerrar">
                <p class="title">Editar Vendedor</p>
                <button type="button" data-bs-dismiss="modal" @click="cerrarEditar()"
                  class="row justify-center items-center" id="botoncerrar">❌</button>
              </div>
              <span v-if="nombreError || apellidoError || cedulaError || telefonoError || usuarioError || contrasenaError"
                class="error-message">{{ nombreError || apellidoError || cedulaError || telefonoError || usuarioError ||
                  contrasenaError
                }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useVendedor.errorvalidacion }}</p>
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

              <label for="apellido">
                <input placeholder="Apellido" type="text" class="input" v-model="apellido">
                <span>Apellido</span>
              </label>

              <label for="cedula">
                <input placeholder="Cedula" type="text" class="input" v-model="cedula">
                <span>Cedula</span>
              </label>

              <label for="telefono">
                <input placeholder="Telefono" type="text" class="input" v-model="telefono">
                <span>Teléfono</span>
              </label>


              <!-- Resto del contenido del formulario... -->

              <button type="button" @click="editarVendedor" class="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </q-dialog>




    <div class="q-pa-xl">
      <q-table class="text-center" :rows="rows" :columns="columns" row-key="id">
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title class="text-center">Vendedores</q-toolbar-title>
          </q-toolbar>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="q-ma-xs text-center">{{ props.row.nombre }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.apellido }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.cedula }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.telefono }}</div>
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
              <q-btn label="📋" color="primary" @click="editar(props.row)" data-bs-toggle="modal"
                data-bs-target="#editClientModal" />
              <q-btn label="✅" color="primary" @click="useVendedor.activar(props.row._id)"
                v-if="props.row.estado === 0" />
              <q-btn label="❌" color="primary" @click="useVendedor.desactivar(props.row._id)"
                v-if="props.row.estado === 1" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { useVendedorStore } from "../stores/vendedor.js";
import { onMounted, ref } from "vue";
const useVendedor = useVendedorStore();
let rows = ref([]);
let vendedores = ref([]);

let id = ref("");
let nombre = ref("");
let apellido = ref("");
let cedula = ref("");
let telefono = ref("");
let usuario = ref("");
let contrasena = ref("");
let estado = ref(1);
let cambiar = ref(false);
let loading = ref(false);
let mensaje = ref("");
let mensajeColor = ref("");
let nombreError = ref(null);
let apellidoError = ref(null);
let cedulaError = ref(null);
let telefonoError = ref(null);
let usuarioError = ref(null);
let contrasenaError = ref(null);
const mostrarModalAgregar = ref(false);
const mostrarModalEditar = ref(false);



const soloNumeros = (value) => {
  const numeroRegex = /^[0-9]+$/;
  return numeroRegex.test(value);
};

let mostrarContrasena = ref(false);

/* const toggleMostrarContrasena = () => {
  mostrarContrasena.value = !mostrarContrasena.value;
}; */

const agregar = () => {
  nombre.value = "";
  apellido.value = "";
  cedula.value = "";
  telefono.value = "";
  usuario.value = "";
  contrasena.value = "";
  mensaje.value = "";
  useVendedor.errorvalidacion = "";
  mostrarModalAgregar.value = true
};

const editar = (row) => {
  id.value = row._id;
  cambiar.value = true;
  nombre.value = row.nombre;
  apellido.value = row.apellido;
  cedula.value = row.cedula;
  telefono.value = row.telefono;
  usuario.value = row.usuario;
  contrasena.value = row.contrasena;
  estado.value = row.estado;
  mostrarModalEditar.value = true
};

const cerrar = () => {
  nombre.value = "";
  apellido.value = "";
  cedula.value = "";
  telefono.value = "";
  usuario.value = "";
  contrasena.value = "";
  mensaje.value = "";
  useVendedor.errorvalidacion = "";
  mostrarModalAgregar.value = false
};

const cerrarEditar = () => {
  nombre.value = "";
  apellido.value = "";
  cedula.value = "";
  telefono.value = "";
  usuario.value = "";
  contrasena.value = "";
  mensaje.value = "";
  useVendedor.errorvalidacion = "";
  mostrarModalEditar.value = false
};

const columns = ref([
  {
    name: "Nombre",
    label: "Nombre",
    align: "center",
    field: (row) => row.nombre,
  },
  {
    name: "Apellido",
    label: "Apellido",
    align: "center",
    field: (row) => row.apellido,
  },
  {
    name: "Cedula",
    label: "Cedula",
    align: "center",
    field: (row) => row.cedula,
  },
  {
    name: "Teléfono",
    label: "Teléfono",
    align: "center",
    field: (row) => row.telefono,
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



const clearErrors = () => {

  setTimeout(() => {
    nombreError.value = null;
    apellidoError.value = null;
    cedulaError.value = null;
    telefonoError.value = null;
    usuarioError.value = null;
    contrasenaError.value = null;
  }, 5500);
};

const agregarNuevoVendedor = async () => {
  clearErrors()
  useVendedor.errorvalidacion = '';

  if (!nombre.value) {
    nombreError.value = 'El nombre es requerido';
  } else if (!nombre.value.trim()) {
    nombreError.value = 'Solo espacios no es permitido, por favor digite un nombre real'
  }

  if (!apellido.value) {
    apellidoError.value = 'El apellido es requerido';
  } else if (!apellido.value.trim()) {
    apellidoError.value = 'Solo espacios no es permitido, por favor digite un apellido real'
  }

  if (!cedula.value) {
    cedulaError.value = 'La cédula es requerida';
  } else if (!cedula.value.trim()) {
    cedulaError.value = 'Solo espacios no es permitido, por favor digite una cédula real'
  } else if (!soloNumeros(cedula.value)) {
    cedulaError.value = 'La cédula debe contener solo números (eliminar espacios si es el caso)';
  } else if (cedula.value.length !== 10) {
    cedulaError.value = 'La cédula debe tener exactamente 10 caracteres';
  }

  if (!telefono.value) {
    telefonoError.value = 'El teléfono es requerido';
  } else if (!telefono.value.trim()) {
    telefonoError.value = 'Solo espacios no es permitido, por favor digite un teléfono real'
  } else if (telefono.value.length !== 10) {
    telefonoError.value = 'El teléfono debe tener exactamente 10 caracteres (eliminar espacios si es el caso)';
  }

  if (!usuario.value) {
    usuarioError.value = 'El usuario es requerido';
  } else if (!usuario.value.trim()) {
    usuarioError.value = 'Solo espacios no es permitido, por favor digite un usuario válido'
  }

  if (!contrasena.value) {
    contrasenaError.value = 'La contraseña es requerida';
  } else if (!contrasena.value.trim()) {
    contrasenaError.value = 'Solo espacios no es permitido, por favor digite una contraseña válida'
  } else if (contrasena.value.length < 8) {
    contrasenaError.value = 'La contraseña debe tener al menos 8 caracteres (eliminar espacios si es el caso)';
  }


  if (!nombreError.value && !apellidoError.value && !cedulaError.value && !telefonoError.value && !usuarioError.value && !contrasenaError.value) {
    loading.value = true
    const data = {
      nombre: nombre.value,
      apellido: apellido.value,
      cedula: cedula.value,
      telefono: telefono.value,
      usuario: usuario.value,
      contrasena: contrasena.value
    };

    try {
      const response = await useVendedor.agregarNuevoVendedor(data);
      console.log(response);

      if (useVendedor.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Vendedor añadido correctamente (presione ❌ para cerrar)';
        loading.value = false;
        nombre.value = '';
        apellido.value = '';
        cedula.value = '';
        telefono.value = '';
        usuario.value = '';
        contrasena.value = '';
        setTimeout(() => {
          useVendedor.errorvalidacion = '';
          mensaje.value = '';
        }, 5500);
      } else if (useVendedor.estatus === 400) {
        mensajeColor.value = 'error';
        loading.value = false;
        setTimeout(() => {
          useVendedor.errorvalidacion = '';
        }, 7500);
      }
    } catch (error) {
      console.log('Error al agregar el vendedor:', error);
      mensajeColor.value = 'error';
      loading.value = false;
      setTimeout(() => {
        useVendedor.errorvalidacion = '';
      }, 7500);
    }
  }

  loading.value = false;
  clearErrors();
};

const editarVendedor = async () => {
  clearErrors();

  // Validar los campos
  if (!nombre.value) {
    nombreError.value = 'El nombre es requerido';
  } else if (!nombre.value.trim()) {
    nombreError.value = 'Solo espacios no es permitido, por favor digite un nombre real'
  }

  if (!apellido.value) {
    apellidoError.value = 'El apellido es requerido';
  } else if (!apellido.value.trim()) {
    apellidoError.value = 'Solo espacios no es permitido, por favor digite un apellido real'
  }

  if (!cedula.value) {
    cedulaError.value = 'La cédula es requerida';
  } else if (!cedula.value.trim()) {
    cedulaError.value = 'Solo espacios no es permitido, por favor digite una cédula real'
  } else if (!soloNumeros(cedula.value)) {
    cedulaError.value = 'La cédula debe contener solo números (eliminar espacios si es el caso)';
  } else if (cedula.value.length !== 10) {
    cedulaError.value = 'La cédula debe tener exactamente 10 caracteres';
  }

  if (!telefono.value) {
    telefonoError.value = 'El teléfono es requerido';
  } else if (!telefono.value.trim()) {
    telefonoError.value = 'Solo espacios no es permitido, por favor digite un teléfono real'
  } else if (telefono.value.length !== 10) {
    telefonoError.value = 'El teléfono debe tener exactamente 10 caracteres (eliminar espacios si es el caso)';
  }

  if (!nombreError.value && !apellidoError.value && !cedulaError.value && !telefonoError.value) {
    loading.value = true;
    const data = {
      _id: id.value,
      nombre: nombre.value,
      apellido: apellido.value,
      cedula: cedula.value,
      telefono: telefono.value,
      usuario: usuario.value,
      contrasena: contrasena.value,
    };

    try {
      const response = await useVendedor.actualizarVendedor(id.value, data);
      if (useVendedor.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Vendedor editado correctamente (presione ❌ para cerrar)';
        loading.value = false;
        setTimeout(() => {
          useVendedor.errorvalidacion = '';
          mensaje.value = '';
        }, 5500);
      } else if (useVendedor.estatus === 400) {
        mensajeColor.value = 'error';
        loading.value = false;
        setTimeout(() => {
          useVendedor.errorvalidacion = '';
        }, 7500);
      }
    } catch (error) {
      console.log('Error al editar el vendedor:', error);
      mensajeColor.value = 'error';
      loading.value = false;
      setTimeout(() => {
        useVendedor.errorvalidacion = '';
      }, 7500);
    }
  }
}

async function obtenerVendedor() {
  loading.value = true
  try {
    await useVendedor.obtenerVendedores();
    vendedores.value = useVendedor.rows;
    rows.value = useVendedor.rows.reverse();
    loading.value = false
  } catch (error) {
    console.log(error);
  }
}

async function desactivarVendedor(id) {
  await useVendedor.desactivar(id);
  obtenerVendedor();
}

async function activarVendedor(id) {
  await useVendedor.activar(id);
  obtenerVendedor();
}

const obtenerTextoEstado = (estado) => {
  return estado === 1 ? "Activo" : "Inactivo";
};

onMounted(async () => {
  obtenerVendedor();
  desactivarVendedor();
  activarVendedor();
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
}

.select {
  border: 1px solid rgb(193, 193, 193);
  border-radius: 15px;
}

#labelmodaladd {
  margin-left: 10px;
  margin-top: 10px;
}

.modal-dialog{
  max-height: 600px; 
  overflow-y: auto;
}

@media only screen and (max-height: 600px) {
  .modal-dialog {
    max-height: 80vh; /* Utilizar el 80% del alto de la pantalla en pantallas más pequeñas */
  }
}
</style>