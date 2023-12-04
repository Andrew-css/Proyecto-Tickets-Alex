<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">CONDUCTORES</h1>
      <div class="linea"></div>
    </div>
    <div class="botongregar">
    </div>


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
                <p class="title">Añadir conductor</p>
                <button type="button" data-bs-dismiss="modal" @click="cerrar()" class="row justify-center items-center"
                  id="botoncerrar">❌</button>
              </div>
              <span v-if="nombreError || cedulaError || telefonoError || emailError || numlicenciaError"
                class="error-message">{{ nombreError || cedulaError || telefonoError || emailError || numlicenciaError
                }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useConductor.errorvalidacion }}</p>
              <span v-if="mensaje" :class="[mensajeColor === 'success' ? 'success-message' : 'error-message']">{{
                mensaje
              }}</span>
              <div v-if="loading" class="text-center">
                <q-spinner-hourglass color="primary" size="50px" />
                <p>Por favor, espere...</p>
              </div>

              <label>
                <input required="" placeholder="" type="text" class="input" v-model="nombre">
                <span>Nombre</span>
              </label>
              <label>
                <input required="" placeholder="" type="text" class="input" v-model="cedula" @keydown="handleKeydown">
                <span>Cedula</span>
              </label>
              <label>
                <input required="" placeholder="" type="text" class="input" v-model="telefono" @keydown="handleKeydown">
                <span>Telefono</span>
              </label>
              <label>
                <input required="" placeholder="" type="text" class="input" v-model="email" @keydown="handleKeydown">
                <span>Email</span>
              </label>
              <label>
                <input required="" placeholder="" type="text" class="input" v-model="num_licencia"
                  @keydown="handleKeydown">
                <span>Numero Licencia</span>
              </label>



              <button type="button" class="btn btn-secondary submit" @click="agregarNuevoConductor">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </q-dialog>

    <!-- MODAL DE EDITAR  -->

    <q-dialog v-model="mostrarModalEditar" position="top">
      <div class="modal fade" style="margin-top: 12%;" id="editClientModal" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" ref="editClientModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="cerrar">
                <p class="title">Editar conductor</p>
                <button type="button" data-bs-dismiss="modal" @click="cerrarEditar()"
                  class="row justify-center items-center" id="botoncerrar">❌</button>
              </div>
              <span v-if="nombreError || cedulaError" class="error-message">{{ nombreError || cedulaError }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useConductor.errorvalidacion }}</p>
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
                <input placeholder="Cedula" type="text" class="input" v-model="cedula" @keydown="handleKeydown">
                <span>Cedula</span>
              </label>

              <label>
                <input required="" placeholder="" type="text" class="input" v-model="telefono" @keydown="handleKeydown">
                <span>Telefono</span>
              </label>
              <label>
                <input required="" placeholder="" type="text" class="input" v-model="email" @keydown="handleKeydown">
                <span>Email</span>
              </label>
              <label>
                <input required="" placeholder="" type="text" class="input" v-model="num_licencia"
                  @keydown="handleKeydown">
                <span>Numero Licencia</span>
              </label>

              <!-- Resto del contenido del formulario... -->

              <button type="button" @click="editarConductor" class="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </q-dialog>



    <div class="q-pa-xl">
      <q-table class="text-center" :rows="rows" :columns="columns" row-key="id">
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
              <div class="text-center">{{ props.row.telefono }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.email }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.num_licencia }}</div>
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
              <q-btn label="✅" color="primary" @click="useConductor.activar(props.row._id)"
                v-if="props.row.estado === 0" />
              <q-btn label="❌" color="primary" @click="useConductor.desactivar(props.row._id)"
                v-if="props.row.estado === 1" />
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
let telefono = ref("");
let email = ref("");
let num_licencia = ref("");
let estado = ref(1);
let loading = ref(false);
let mensaje = ref("");
let mensajeColor = ref('');
let nombreError = ref(null);
let cedulaError = ref(null);
let telefonoError = ref(null);
let emailError = ref(null);
let numlicenciaError = ref(null);
const mostrarModalAgregar = ref(false);
const mostrarModalEditar = ref(false);


const mostrarMensajeExito = (message) => {
  mensaje.value = message;
  setTimeout(() => {
    mensaje.value = '';
  }, 3000);
};


const clearErrors = () => {

  setTimeout(() => {
    nombreError.value = null;
    cedulaError.value = null;
    telefonoError.value = null;
    emailError.value = null;
    numlicenciaError.value = null;
    mensaje.value = '';
  }, 4500);
};

const agregar = () => {
  nombre.value = "";
  cedula.value = "";
  telefono.value = "";
  email.value = "";
  num_licencia.value = "";
  mostrarModalAgregar.value = true
};

const editar = (row) => {
  console.log(row);
  id.value = row._id;
  nombre.value = row.nombre;
  cedula.value = row.cedula;
  telefono.value = row.telefono;
  email.value = row.email;
  num_licencia.value = row.num_licencia;
  mostrarModalEditar.value = true
  clearErrors();
};

const cerrar = () => {
  nombre.value = "";
  cedula.value = "";
  telefono.value = "";
  email.value = "";
  num_licencia.value = "";
  mostrarModalAgregar.value = false
};

const cerrarEditar = () => {
  nombre.value = "";
  cedula.value = "";
  telefono.value = "";
  email.value = "";
  num_licencia.value = "";
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
    name: "Numero licencia",
    label: "Numero licencia",
    align: "center",
    field: (row) => row.num_licencia,
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




const soloNumeros = (value) => {
  const numeroRegex = /^[0-9]+$/;
  return numeroRegex.test(value);
};


const agregarNuevoConductor = async () => {

  nombreError.value = null;
  cedulaError.value = null;
  telefonoError.value = null;
  emailError.value = null;
  numlicenciaError.value = null;
  useConductor.errorvalidacion = '';

  if (!nombre.value) {
    nombreError.value = 'El nombre es requerido';
  } else if (!nombre.value.trim()) {
    nombreError.value = 'Nombre no valido'
  }

  if (cedula.value.trim() === '') {
    cedulaError.value = 'La cédula es requerida';
  } else if (!soloNumeros(cedula.value)) {
    cedulaError.value = 'La cédula debe contener solo números';
  } else if (cedula.value.trim().length !== 10) {
    cedulaError.value = 'La cédula debe tener exactamente 10 caracteres';
  }

  if (!telefono.value) {
    telefonoError.value = 'El telefono es requerido';
  }

  if (!email.value) {
    emailError.value = 'El email es requerido';
  }

  if (!num_licencia.value) {
    numlicenciaError.value = 'El número de licencia es requerido';
  }



  if (!nombreError.value && !cedulaError.value && !telefonoError.value && !emailError.value && !numlicenciaError.value) {
    loading.value = true
    const data = {
      nombre: nombre.value,
      cedula: cedula.value,
      telefono: telefono.value,
      email: email.value,
      num_licencia: num_licencia.value,
    };

    try {
      loading.value = true;
      const response = await useConductor.agregarNuevoConductor(data);

      if (useConductor.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Conductor añadido correctamente (presione ❌ para cerrar)';
        loading.value = false;
        setTimeout(() => {
          nombre.value = '';
          cedula.value = '';
          telefono.value = "";
          email.value = "";
          num_licencia.value = "";
          useConductor.errorvalidacion = '';
          mensaje.value = '';
        }, 4500);
      } else {
        mensajeColor.value = 'error';
        loading.value = false;
        setTimeout(() => {
          useConductor.errorvalidacion = '';  
        }, 4500);
      }
    } catch (error) {
      console.log('Error al agregar el conductor:', error);
      mensajeColor.value = 'error';
      loading.value = false;;
      setTimeout(() => {
        useConductor.errorvalidacion = ''
      }, 4500);
    }
  }
  loading.value = false;
  clearErrors();
};

const editarConductor = async () => {
  clearErrors();

  // Validar los campos
  if (!nombre.value) {
    nombreError.value = 'El nombre es requerido';
  } else if (!nombre.value.trim()) {
    nombreError.value = 'Nombre no valido'
  }

  if (cedula.value.trim() === '') {
    cedulaError.value = 'La cédula es requerida';
  } else if (!soloNumeros(cedula.value)) {
    cedulaError.value = 'La cédula debe contener solo números';
  } else if (cedula.value.trim().length !== 10) {
    cedulaError.value = 'La cédula debe tener exactamente 10 caracteres';
  }

  if (!telefono.value) {
    telefonoError.value = 'El telefono es requerido';
  }

  if (!email.value) {
    emailError.value = 'El email es requerido';
  }

  if (!num_licencia.value) {
    numlicenciaError.value = 'El número de licencia es requerido';
  }

  if (!nombreError.value && !cedulaError.value && !telefonoError.value && !emailError.value && !numlicenciaError.value) {
    loading.value = true
    const data = {
      _id: id.value,
      nombre: nombre.value,
      cedula: cedula.value,
      telefono: telefono.value,
      email: email.value,
      num_licencia: num_licencia.value,
    };

    try {
      const response = await useConductor.actualizarConductor(id.value, data);
      if (useConductor.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Conductor editado correctamente (presione ❌ para cerrar)';
        loading.value = false
        setTimeout(() => {
          useConductor.errorvalidacion = '';
          mensaje.value = '';
        }, 4500);
      } else {
        mensajeColor.value = 'error';
        loading.value = false;
        setTimeout(() => {
          useConductor.errorvalidacion = '';

        }, 4500);
      }
    } catch (error) {
      console.log('Error al editar el conductor:', error);
      mensajeColor.value = 'error';
      loading.value = false;
    }
  }
}

async function obtenerConductor() {
  loading.value = true
  try {
    await useConductor.obtenerConductores()
    conductores.value = useConductor.rows;
    rows.value = useConductor.rows.reverse();
    console.log("Conductor", conductores.value)
    loading.value = false

  } catch (error) {
    console.log(error);
  }
}

async function desactivarConductor(id) {
  await useConductor.desactivar(id);
  obtenerConductor();
}

async function activarConductor(id) {
  await useConductor.activar(id);
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





const handleKeydown = (event) => {
  if (event.key === ' ') {
    event.preventDefault();
  }
};
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
  align-items: center;
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
}
</style>