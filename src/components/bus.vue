<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">BUSES</h1>
      <div class="linea"></div>
    </div>
    <div class="r">
      <button type="button" class="  button " style="margin:0 auto;" data-bs-toggle="modal"
        data-bs-target="#staticBackdrop" @click="agregar()"> <span class="button__text">Añadir</span> <span
          class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg">
            <line y2="19" y1="5" x2="12" x1="12"></line>
            <line y2="12" y1="12" x2="19" x1="5"></line>
          </svg></span> >
      </button>
    </div>
    <div v-if="loading" class="text-center">
      <q-spinner-hourglass color="primary" size="70px" />
      <h6>Por favor, espere...</h6>
    </div>


    <!-- MODAL DE AÑADIR CON QUASART -->

    <q-dialog v-model="mostrarModalAgregar" position="top">
      <div class="modal fade" style="margin-top: 12%;" id="staticBackdrop" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="cerrar">
                <p class="title">Añadir Bus</p>
                <button type="button" data-bs-dismiss="modal" @click="cerrar()" class="row justify-center items-center"
                  id="botoncerrar">❌</button>
              </div>
              <span v-if="empresaError || asientoError || placaError || conductorError || numeroError"
                class="error-message">{{
                  empresaError || asientoError ||
                  placaError || conductorError || numeroError }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useBus.errorvalidacion }}</p>
              <span v-if="mensaje" :class="[mensajeColor === 'success' ? 'success-message' : 'error-message']">{{ mensaje
              }}</span>
              <div v-if="loading" class="text-center">
                <q-spinner-hourglass color="primary" size="50px" />
                <p>Por favor, espere...</p>
              </div>
              <label for="empresa">
                <input placeholder="Empresa" type="text" class="input" v-model="empresa">
                <span>Empresa</span>
              </label>

              <label for="asiento">
                <input placeholder="Cantidad Asientos" type="text" class="input" v-model="asiento">
                <span>Cantidad Asientos</span>
              </label>

              <label for="placa">
                <input placeholder="Placa" type="text" class="input" v-model="placa">
                <span>Placa</span>
              </label>

              <label for="numero">
                <input placeholder="Numero Bus" type="text" class="input" v-model="numero">
                <span>Número Bus</span>
              </label>


              <q-select filled v-model="conductor" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione conductor" :options="getFilteredConductores(conductores)" style="width: 400px"
                @filter="filtrarConductores">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <!-- Resto del contenido del formulario... -->

              <button type="button" @click="agregarNuevoBus" class="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>

    </q-dialog>

    <!-- MODAL DE EDITAR CON QUASART -->

    <q-dialog v-model="mostrarModalEditar" position="top">

      <div class="modal fade" style="margin-top: 12%;" id="editBusModal" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="cerrar">
                <p class="title">Editar Bus</p>
                <button type="button" data-bs-dismiss="modal" @click="cerrarEditar()"
                  class="row justify-center items-center" id="botoncerrar">❌</button>
              </div>
              <span v-if="empresaError || asientoError || placaError || conductorError || numeroError"
                class="error-message">{{ empresaError || asientoError
                  ||
                  placaError || conductorError || numeroError }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useBus.errorvalidacion }}</p>
              <span v-if="mensaje" :class="[mensajeColor === 'success' ? 'success-message' : 'error-message']">{{
                mensaje
              }}</span>
              <div v-if="loading" class="text-center">
                <q-spinner-hourglass color="primary" size="50px" />
                <p>Por favor, espere...</p>
              </div>
              <label for="empresa">
                <input placeholder="Empresa" type="text" class="input" v-model="empresa">
                <span>Empresa</span>
              </label>

              <label for="asiento">
                <input placeholder="Cantidad Asientos" type="text" class="input" v-model="asiento">
                <span>Cantidad Asientos</span>
              </label>

              <label for="placa">
                <input placeholder="Placa" type="text" class="input" v-model="placa">
                <span>Placa</span>
              </label>

              <label for="numero">
                <input placeholder="Numero Bus" type="text" class="input" v-model="numero">
                <span>Número Bus</span>
              </label>

              <q-select filled v-model="conductor" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione conductor" :options="getFilteredConductores(conductores)" style="width: 400px"
                @filter="filtrarConductores">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <!-- Resto del contenido del formulario... -->

              <button type="button" @click="editarBus" class="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>

    </q-dialog>


    <!-- TABLA DE DATOS  -->


    <div class="q-pa-xl">
      <q-table class="text-center" :rows="rows" :columns="columns" row-key="id">
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title class="text-center">Buses</q-toolbar-title>
          </q-toolbar>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="q-ma-xs text-center">{{ props.row.empresa }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.asiento }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.placa }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.numero }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.conductor.nombre }}</div>
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
                data-bs-target="#editBusModal" />
              <q-btn label="✅" color="primary" @click="useBus.activar(props.row._id)" v-if="props.row.estado === 0" />
              <q-btn label="❌" color="primary" @click="useBus.desactivar(props.row._id)" v-if="props.row.estado === 1" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { useBusStore } from "../stores/bus.js";
import { useConductorStore } from "../stores/conductor.js";
import { onMounted, ref } from "vue";
const useBus = useBusStore();
const useConductor = useConductorStore();
let rows = ref([]);
let buses = ref([]);
let conductores = ref([]);
let loading = ref(false);
let mensaje = ref('');
let mensajeColor = ref('');
const empresaError = ref(null);
const asientoError = ref(null);
const placaError = ref(null);
const conductorError = ref(null);
const numeroError = ref(null)
const mostrarModalAgregar = ref(false);
const mostrarModalEditar = ref(false);
let id = ref("");
let empresa = ref("");
let asiento = ref("");
let placa = ref("");
let conductor = ref("");
let numero = ref("");
let estado = ref(1);


console.log("Conductores lista: ", conductor)




const agregar = () => {
  empresa.value = "";
  asiento.value = "";
  placa.value = "";
  mensaje.value = "";
  conductor.value = "";
  numero.value = "";
  mostrarModalAgregar.value = true;
};


const cerrarEditar = () => {
  empresa.value = "";
  asiento.value = "";
  placa.value = "";
  mensaje.value = "";
  conductor.value = "";
  numero.value = "";
  mostrarModalEditar.value = false;
};


const cerrar = () => {
  empresa.value = "";
  asiento.value = "";
  placa.value = "";
  mensaje.value = "";
  conductor.value = "";
  numero.value = "";
  mostrarModalAgregar.value = false;

};

const editar = (row) => {
  console.log(row);
  id.value = row._id;
  empresa.value = row.empresa;
  asiento.value = row.asiento;
  placa.value = row.placa;
  numero.value = row.numero;
  conductor.value = { label: row.conductor.nombre, value: row.conductor._id };
  estado.value = row.estado;
  mostrarModalEditar.value = true;
};

const columns = ref([
  {
    name: "Empresa",
    label: "Empresa",
    align: "center",
    field: (row) => row.empresa,
  },
  {
    name: "Cantidad Asientos",
    label: "Cantidad Asientos",
    align: "center",
    field: (row) => row.asiento,
  },
  {
    name: "Placa",
    label: "Placa",
    align: "center",
    field: (row) => row.placa,
  },
  {
    name: "Numero Bus",
    label: "Numero Bus",
    align: "center",
    field: (row) => row.numero,
  },
  {
    name: "Conductor",
    label: "Conductor",
    align: "center",
    field: (row) => row.conductor,
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

console.log("Conductores", conductores)



const soloNumeros = (value) => {
  const numeroRegex = /^[0-9]+$/;
  return numeroRegex.test(value);
};

const clearErrors = () => {

  setTimeout(() => {
    empresaError.value = null;
    asientoError.value = null;
    placaError.value = null;
    numeroError.value = null
    conductorError.value = null;
  }, 5500);
};



async function obtenerBuses() {
  loading.value = true
  try {
    await useBus.obtenerBuses();
    buses.value = useBus.rows;
    rows.value = useBus.rows.reverse();
    loading.value = false
  } catch (error) {
    console.log(error);
  }
}

const agregarNuevoBus = async () => {
  clearErrors();

  if (!empresa.value) {
    empresaError.value = 'La empresa es requerida';
  } else if (!empresa.value.trim()) {
    empresaError.value = 'Solo espacios no es permitido, por favor digite un nombre de empresa   real'
  }


  if (!asiento.value) {
    asientoError.value = 'El asiento es requerido';
  } else if (!soloNumeros(asiento.value)) {
    asientoError.value = 'El asiento debe contener solo números (sin espacios si es el caso)';
  } else if (asiento.value > 40) {
    asientoError.value = 'El número de asiento no puede ser mayor a 40';
  }

  if (!placa.value) {
    placaError.value = 'La placa es requerida';
  } else if (!placa.value.trim()) {
    placaError.value = 'Solo espacios no es permitido, por favor digite una placa real'
  } else if (placa.value.length > 7) {
    placaError.value = 'La placa no puede tener más de 7 caracteres (eliminar espacios si es el caso)';
  }

  if (!numero.value) {
    numeroError.value = 'El número de bus es requerido';
  } else if (!numero.value.trim()) {
    numeroError.value = 'Solo espacios no es permitido, por favor digite un numero de bus real'
  }

  if (!conductor.value) {
    conductorError.value = 'El conductor es requerido';
  }

  if (!empresaError.value && !asientoError.value && !placaError.value && !numeroError.value && !conductorError.value) {
    loading.value = true
    const data = {
      empresa: empresa.value,
      asiento: asiento.value,
      placa: placa.value,
      numero: numero.value,
      conductor: conductor.value.value,
    };

    try {
      const response = await useBus.agregarNuevoBus(data);

      if (useBus.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Bus añadido correctamente (presione ❌ para cerrar)';
        loading.value = false;
        empresa.value = '';
        asiento.value = '';
        placa.value = '';
        numero.value = '';
        conductor.value = '';
        setTimeout(() => {
          useBus.errorvalidacion = '';
          mensaje.value = '';
        }, 5500);
      } else if (useBus.estatus === 400) {
        mensajeColor.value = 'error';
        loading.value = false;
        setTimeout(() => {
          useBus.errorvalidacion = '';
        }, 7500);
      }
    } catch (error) {
      console.log('Error al agregar  bus:', error);
      mensajeColor.value = 'error';
      loading.value = false;
      setTimeout(() => {
        useBus.errorvalidacion = '';
      }, 7500);
    }
  }
  loading.value = false;
  clearErrors();
};



const editarBus = async () => {
  clearErrors();

  if (!empresa.value) {
    empresaError.value = 'La empresa es requerida';
  } else if (!empresa.value.trim()) {
    empresaError.value = 'Solo espacios no es permitido, por favor digite un nombre de empresa   real'
  }


  if (!asiento.value) {
    asientoError.value = 'El asiento es requerido';
  } else if (!soloNumeros(asiento.value)) {
    asientoError.value = 'El asiento debe contener solo números (sin espacios si es el caso)';
  } else if (asiento.value > 40) {
    asientoError.value = 'El número de asiento no puede ser mayor a 40';
  }

  if (!placa.value) {
    placaError.value = 'La placa es requerida';
  } else if (!placa.value.trim()) {
    placaError.value = 'Solo espacios no es permitido, por favor digite una placa real'
  } else if (placa.value.length > 7) {
    placaError.value = 'La placa no puede tener más de 7 caracteres (eliminar espacios si es el caso)';
  }

  if (!numero.value) {
    numeroError.value = 'El número de bus es requerido';
  } else if (!numero.value.trim()) {
    numeroError.value = 'Solo espacios no es permitido, por favor digite un numero de bus real'
  }

  if (!conductor.value) {
    conductorError.value = 'El conductor es requerido';
  }

  if (!empresaError.value && !asientoError.value && !placaError.value && !numeroError.value && !conductorError.value) {
    loading.value = true
    const data = {
      _id: id.value,
      empresa: empresa.value,
      asiento: asiento.value,
      placa: placa.value,
      numero: numero.value,
      conductor: conductor.value.value,
    };

    try {
      const response = await useBus.actualizarBus(id.value, data);

      if (useBus.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Bus editado correctamente (presione ❌ para cerrar)';
        loading.value = false
        setTimeout(() => {
          useBus.errorvalidacion = '';
          mensaje.value = '';
        }, 5500);
      } else if (useBus.estatus === 400) {
        mensajeColor.value = 'error';
        loading.value = false;
        setTimeout(() => {
          useBus.errorvalidacion = '';
        }, 7500);
      }
    } catch (error) {
      console.log('Error al editar el bus:', error);
      mensajeColor.value = 'error';
      loading.value = false;
      setTimeout(() => {
        useBus.errorvalidacion = '';
      }, 7500);
    }
  }
}

async function obtenerConductores() {
  try {
    await useConductor.obtenerConductores(); // Asumiendo que tienes un método en useConductor para obtener conductores
    conductores.value = useConductor.rows;
  } catch (error) {
    console.log(error);
  }
}

async function desactivarBus(id) {
  await useBus.desactivar(id);
  obtenerBuses();
}

async function activarBus(id) {
  await useBus.activar(id);
  obtenerBuses();
}

const obtenerTextoEstado = (estado) => {
  return estado === 1 ? "Activo" : "Inactivo";
};

const getFilteredConductores = (conductores) => {
  // Filtrar las ciudades inactivas y convertirlas al formato de opciones del q-select
  const conductoresOptions = conductores.map((c) => {
    return {
      label: c.estado === 0 ? `${c.nombre} - Inactiv@` : c.nombre,
      value: c._id,
      disable: c.estado === 0,
    };
  });
  return conductoresOptions;
};


const filtrarConductores = (val, update) => {
  if (val === '') {
    // Restablecer las opciones a la lista original de ciudades cuando el input está vacío
    update(() => {
      conductores.value = useConductor.rows;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    conductores.value = useConductor.rows.filter(c => c.nombre.toLowerCase().includes(needle));
  });
}

onMounted(async () => {
  obtenerBuses();
  obtenerConductores();
  desactivarBus()
  activarBus()
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
  max-width: 500px;
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

.modal-dialog::-webkit-scrollbar {
  width: 0.5em; 
}

.modal-dialog::-webkit-scrollbar-track {
  background-color: transparent; 
}

.modal-dialog::-webkit-scrollbar-thumb {
  background-color: transparent; 
}

@media only screen and (max-height: 600px) {
  .modal-dialog {
    max-height: 80vh; /* Utilizar el 80% del alto de la pantalla en pantallas más pequeñas */
  }
}
</style>