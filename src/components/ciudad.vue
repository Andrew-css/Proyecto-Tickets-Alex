<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">CIUDADES</h1>
      <div class="linea"></div>
    </div>
    <div class="botongregar"> </div>


    <!-- Button trigger modal -->
    <button type="button" class="  button " style="margin:0 auto;" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
      @click="agregar()"> <span class="button__text">Añadir</span> <span class="button__icon"><svg
          xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round"
          stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg">
          <line y2="19" y1="5" x2="12" x1="12"></line>
          <line y2="12" y1="12" x2="19" x1="5"></line>
        </svg></span> >
    </button>
    <div v-if="loading" class="text-center">
      <q-spinner-hourglass color="primary" size="70px" />
      <h6>Por favor, espere...</h6>
    </div>

    <!-- Modal -->

    <q-dialog v-model="mostrarModalAgregar" position="top">

      <div class="modal fade " style="margin-top: 12%;" id="staticBackdrop" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form ">
              <div class="cerrar">
                <p class="title">Añadir ciudad</p>
                <button type="button" data-bs-dismiss="modal" @click="cerrar()" class="row justify-center items-center"
                  id="botoncerrar">❌</button>
              </div>
              <span v-if="nombreError" class="error-message">{{ nombreError }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useCiudad.errorvalidacion }} </p>
              <span v-if="mensaje" :class="[mensajeColor === 'success' ? 'success-message' : 'error-message']">{{
                mensaje
              }}</span>
              <div v-if="loading" class="text-center">
                <q-spinner-hourglass color="primary" size="50px" />
                <p>Por favor, espere...</p>
              </div>
              <label>
                <input placeholder="Nombre" type="text" class="input" v-model="nombre">
                <span>Nombre</span>
              </label>

              <button type="button" class="btn btn-secondary submit" @click="agregarNuevaCiudad">Enviar</button>
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
                <p class="title">Editar ciudad</p>
                <button type="button" data-bs-dismiss="modal" @click="cerrarEditar()"
                  class="row justify-center items-center" id="botoncerrar">❌</button>
              </div>
              <span v-if="nombreError" class="error-message">{{ nombreError }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useCiudad.errorvalidacion }}</p>
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


              <button type="button" @click="editarCiudad" class="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </q-dialog>


    <div class="q-pa-xl">
      <q-table class="text-center" :rows="rows" :columns="columns" row-key="id">
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title class="text-center">Ciudades</q-toolbar-title>
          </q-toolbar>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="q-ma-xs text-center">{{ props.row.nombre }}</div>
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
              <q-btn label="✅" color="primary" @click="useCiudad.activar(props.row._id)" v-if="props.row.estado === 0" />
              <q-btn label="❌" color="primary" @click="useCiudad.desactivar(props.row._id)"
                v-if="props.row.estado === 1" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { useCiudadStore } from "../stores/ciudad.js";
import { onMounted, ref } from "vue";
const useCiudad = useCiudadStore();
let rows = ref([]);
let ciudades = ref([]);

const nombreError = ref(null);
let id = ref("");
let nombre = ref("");
let loading = ref(false);
let mensaje = ref("");
let mensajeColor = ref('');
const mostrarModalAgregar = ref(false);
const mostrarModalEditar = ref(false);



const mostrarMensajeExito = (message) => {
  mensaje.value = message;
  setTimeout(() => {
    mensaje.value = '';
  }, 5500);
};

const clearErrors = () => {

  setTimeout(() => {
    nombreError.value = null;
    useCiudad.errorvalidacion = '';
    mensaje.value = '';
  }, 5500);
};

const editar = (row) => {
  console.log(row);

  id.value = row._id;
  nombre.value = row.nombre;
  mostrarModalEditar.value = true
};

const columns = ref([
  {
    name: "Nombre",
    label: "Nombre",
    align: "center",
    field: (row) => row.nombre,
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
  nombre.value = "";
  mostrarModalAgregar.value = true
};

const cerrar = () => {
  nombre.value = "";
  mostrarModalAgregar.value = false
};

const cerrarEditar = () => {
  nombre.value = "";
  mostrarModalEditar.value = false
};

async function obtenerCiudad() {
  loading.value = true
  try {
    await useCiudad.obtenerCiudades();
    ciudades.value = useCiudad.rows;
    rows.value = useCiudad.rows.reverse();
    loading.value = false
  } catch (error) {
    console.log(error);
  }
}

async function desactivarCiudad(id) {
  await useCiudad.desactivar(id);
  obtenerCiudad();
}

async function activarCiudad(id) {
  await useCiudad.activar(id);
  obtenerCiudad();
}

const obtenerTextoEstado = (estado) => {
  return estado === 1 ? "Activo" : "Inactivo";
};


const agregarNuevaCiudad = async () => {

  nombreError.value = null;
  useCiudad.errorvalidacion = '';

  if (!nombre.value) {
    nombreError.value = 'El nombre es requerido';
  } else if (!nombre.value.trim()) {
    nombreError.value = 'Solo espacios no es permitido, por favor digite un nombre de ciudad real'
  }



  if (!nombreError.value) {
    loading.value = true
    const data = {
      nombre: nombre.value,
    };

    try {
      const response = await useCiudad.agregarNuevaCiudad(data);

      if (useCiudad.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Ciudad añadida correctamente (presione ❌ para cerrar)';
        loading.value = false;
        nombre.value = '';
        setTimeout(() => {
          useCiudad.errorvalidacion = '';
          mensaje.value = '';
        }, 5500);
      } else if (useCiudad.estatus === 400)   {
        mensajeColor.value = 'error';
        loading.value = false;
        setTimeout(() => {
          useCiudad.errorvalidacion = '';
        }, 7500);
      }
    } catch (error) {
      console.log('Error al agregar el ciudad:', error);
      mensajeColor.value = 'error';
      loading.value = false;
      setTimeout(() => {
        useCiudad.errorvalidacion = '';
      }, 7500);
    }
  }
  loading.value = false;
  clearErrors();
};

const editarCiudad = async () => {
  clearErrors();

  // Validar los campos
  if (!nombre.value) {
    nombreError.value = 'El nombre es requerido';
  } else if (!nombre.value.trim()) {
    nombreError.value = 'Solo espacios no es permitido, por favor digite un nombre de ciudad real'
  }

  if (!nombreError.value) {
    loading.value = true
    const data = {
      _id: id.value,
      nombre: nombre.value,
    };

    try {
      const response = await useCiudad.actualizarCiudad(id.value, data);
      if (useCiudad.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Ciudad editada correctamente (presione ❌ para cerrar)';
        loading.value = false;
        setTimeout(() => {
          useCiudad.errorvalidacion = '';
          mensaje.value = '';
        }, 5500);
      } else if (useCiudad.estatus === 400) {
        mensajeColor.value = 'error';
        loading.value = false
        setTimeout(() => {
          useCiudad.errorvalidacion = '';
        }, 7500);
      }
    } catch (error) {
      console.log('Error al editar la ciudad:', error);
      mensajeColor.value = 'error';
      loading.value = false
      setTimeout(() => {
          useCiudad.errorvalidacion = '';
        }, 7500);
    }
  }
}

onMounted(async () => {
  obtenerCiudad();
  desactivarCiudad();
  activarCiudad();
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

/* FORMULARIO */

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 400px;
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

/* VALIDACIONES MODAL */
.success-message {
  color: green;
  font-weight: bold;
  font-size: 20px;
}

.error-message {
  color: red;
  font-weight: bold;
  font-size: 20px;
}</style>