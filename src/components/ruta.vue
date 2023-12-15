<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">RUTAS</h1>
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

    <!-- Modal agregar -->

    <q-dialog v-model="mostrarModalAgregar" position="top">
      <div class="modal fade" style="margin-top: 12%;" id="staticBackdrop" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" ref="addClientModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="cerrar">
                <p class="title">Añadir Ruta
                </p>
                <button type="button" data-bs-dismiss="modal" @click="cerrar()" class="row justify-center items-center"
                  id="botoncerrar">❌</button>
              </div>
              <span v-if="ciudadOrigenError || ciudadDestinoError || horaSalidaError" class="error-message">{{
                ciudadOrigenError || ciudadDestinoError || horaSalidaError
              }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useRuta.errorvalidacion }}</p>
              <span v-if="mensaje" :class="[mensajeColor === 'success' ? 'success-message' : 'error-message']">{{
                mensaje
              }}</span>
              <div v-if="loading" class="text-center">
                <q-spinner-hourglass color="primary" size="50px" />
                <p>Por favor, espere...</p>
              </div>
              <!-- <label for="ciudad_origen">
                  <select v-model="ciudad_origen" id="ciudad_origen" class="input">
                    <option value="" disabled>Selecciona una ciudad de origen</option>
                    <option v-for="ciudad in ciudades" :value="ciudad._id" :key="ciudad._id">{{ ciudad.nombre }}</option>
                  </select>
                </label> -->

              <q-select filled v-model="ciudad_origen" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione ciudad origen" :options="getFilteredCiudades(ciudades)" style="width: 400px"
                @filter="filtrarCiudades">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-select filled v-model="ciudad_destino" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione ciudad destino" :options="getFilteredCiudades(ciudades)" style="width: 400px"
                @filter="filtrarCiudades">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>


              <!-- <label for="ciudad_destino">
                  <select v-model="ciudad_destino" id="ciudad_destino" class="input">
                    <option value="" disabled>Selecciona una ciudad de detino</option>
                    <option v-for="ciudad in ciudades" :value="ciudad._id" :key="ciudad._id">{{ ciudad.nombre }}</option>
                  </select>
                </label> -->

              <label for="hora_salida">
                <input placeholder="" type="time" class="input" v-model="hora_salida">
                <span>Hora de salida:</span>
              </label>


              <!--               <q-select filled v-model="bus" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione bus" :options="buses.map(c => ({ label: c.placa, value: c._id }))"
                @filter="filtrarBuses" style="width: 400px">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select> -->

              <!-- <label for="bus">
                  <select v-model="bus" id="bus" class="input">
                    <option value="" disabled>Selecciona un bus</option>
                    <option v-for="b in buses" :value="b._id" :key="b._id">{{ b.placa }}</option>
                  </select>

                </label> -->


              <button type="button" @click="agregarNuevaRuta" class="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </q-dialog>

    <!-- Modal editar -->

    <q-dialog v-model="mostrarModalEditar" position="top">
      <div class="modal fade" style="margin-top: 12%;" id="editClientModal" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="cerrar">
                <p class="title">Editar Ruta</p>
                <button type="button" data-bs-dismiss="modal" @click="cerrarEditar()"
                  class="row justify-center items-center" id="botoncerrar">❌</button>
              </div>
              <span v-if="ciudadOrigenError || ciudadDestinoError || horaSalidaError" class="error-message">{{
                ciudadOrigenError || ciudadDestinoError || horaSalidaError
              }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useRuta.errorvalidacion }}</p>
              <span v-if="mensaje" :class="[mensajeColor === 'success' ? 'success-message' : 'error-message']">{{
                mensaje
              }}</span>
              <div v-if="loading" class="text-center">
                <q-spinner-hourglass color="primary" size="50px" />
                <p>Por favor, espere...</p>
              </div>
              <!-- <label for="ciudad_origen">
                  <select v-model="ciudad_origen" id="ciudad_origen" class="input">
                    <option value="" disabled>Selecciona una ciudad de origen</option>
                    <option v-for="ciudad in ciudades" :value="ciudad._id" :key="ciudad._id">{{ ciudad.nombre }}</option>
                  </select>
                </label> -->

              <q-select filled v-model="ciudad_origen" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione ciudad origen" :options="getFilteredCiudades(ciudades)" style="width: 400px"
                @filter="filtrarCiudades">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-select filled v-model="ciudad_destino" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione ciudad destino" :options="getFilteredCiudades(ciudades)" style="width: 400px"
                @filter="filtrarCiudades">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <!-- <label for="ciudad_destino">
                  <select v-model="ciudad_destino" id="ciudad_destino" class="input">
                    <option value="" disabled>Selecciona una ciudad de detino</option>
                    <option v-for="ciudad in ciudades" :value="ciudad._id" :key="ciudad._id">{{ ciudad.nombre }}</option>
                  </select>
                </label> -->

              <label for="hora_salida">
                <input placeholder="" type="time" class="input" v-model="hora_salida">
                <span>Hora de salida:</span>
              </label>


              <!--               <q-select filled v-model="bus" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione bus" :options="buses.map(c => ({ label: c.placa, value: c._id }))"
                @filter="filtrarBuses" style="width: 400px">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select> -->

              <!-- <label for="bus">
                  <select v-model="bus" id="bus" class="input">
                    <option value="" disabled>Selecciona un bus</option>
                    <option v-for="b in buses" :value="b._id" :key="b._id">{{ b.placa }}</option>
                  </select>

                </label> -->

              <!-- Resto del contenido del formulario... -->

              <button type="button" @click="editarRuta" class="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </q-dialog>




    <div class="q-pa-xl">
      <q-table class="text-center" :rows="rows" :columns="columns" row-key="id">
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title class="text-center">Rutas</q-toolbar-title>
          </q-toolbar>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="q-ma-xs text-center">{{ props.row.ciudad_origen.nombre }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.ciudad_destino.nombre }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ formatHoraSalida(props.row.hora_salida) }}</div>
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
              <q-btn label="✅" color="primary" @click="useRuta.activar(props.row._id)" v-if="props.row.estado === 0" />
              <q-btn label="❌" color="primary" @click="useRuta.desactivar(props.row._id)" v-if="props.row.estado === 1" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { useRutaStore } from "../stores/ruta.js";
import { useCiudadStore } from "../stores/ciudad.js";
import { onMounted, ref } from "vue";
import { format } from 'date-fns';

const useRuta = useRutaStore();
const useCiudad = useCiudadStore();
const mostrarModalAgregar = ref(false);
const mostrarModalEditar = ref(false);

let rows = ref([]);
let rutas = ref([]);
let ciudades = ref([]);
let id = ref("");
let ciudad_origen = ref("");
let ciudad_destino = ref("");
let hora_salida = ref("");
let estado = ref(1);
let loading = ref(false);
let mensaje = ref("");
let mensajeColor = ref("");

let ciudadOrigenError = ref(null);
let ciudadDestinoError = ref(null);
let horaSalidaError = ref(null);
const formatHoraSalida = (dateString) => {
  const date = new Date(dateString);
  // Formatear solo la hora en formato 'HH:mm:ss'
  return format(date, 'HH:mm:ss');
};

console.log("Hola soy opciones: ", ciudades)



const agregar = () => {
  mostrarModalAgregar.value = true
  ciudad_origen.value = "";
  ciudad_destino.value = "";
  hora_salida.value = "";
  mensaje.value = "";
  useRuta.errorvalidacion = "";
};

const cerrar = () => {
  mostrarModalAgregar.value = false
  ciudad_origen.value = "";
  ciudad_destino.value = "";
  hora_salida.value = "";
  mensaje.value = "";
  useRuta.errorvalidacion = "";
};

/* function deshabilitarCiudad(val) {

console.log(val);

for (const c of ciudades.value) {
  console.log(c);
  if (c.disable === true && ciudad_origen != c.nombre && ciudad_destino != c.nombre && c.estado!=0) {
    c.disable = false
    if (val === null) return
  }
}


const buscar = ciudades.value.findIndex(c => c.nombre === val.nombre)
console.log("hola soy buscar",buscar);
if (buscar < 0) return false

ciudades.value[buscar].disable = true
console.log(ciudades.value);
return true
} */

const cerrarEditar = () => {
  mostrarModalEditar.value = false
  ciudad_origen.value = "";
  ciudad_destino.value = "";
  hora_salida.value = "";
  mensaje.value = "";
  useRuta.errorvalidacion = "";
};

const soloNumeros = (value) => {
  const numeroRegex = /^[0-9]+$/;
  return numeroRegex.test(value);
};

const clearErrors = () => {
  setTimeout(() => {
    ciudadOrigenError.value = null;
    ciudadDestinoError.value = null;
    horaSalidaError.value = null;
    mensaje.value = '';
    useRuta.errorvalidacion = '';
  }, 5500);
};


const editar = (row) => {
  console.log("Datos de la fila:", row);
  id.value = row._id;
  ciudad_origen.value = { label: row.ciudad_origen.nombre, value: row.ciudad_origen._id };
  ciudad_destino.value = { label: row.ciudad_destino.nombre, value: row.ciudad_destino._id };
  hora_salida.value = format(new Date(row.hora_salida), 'HH:mm');
  estado.value = row.estado;
  mostrarModalEditar.value = true;
};

const columns = ref([
  {
    name: "Ciudad Origen",
    label: "Ciudad Origen",
    align: "center",
    field: (row) => row.ciudad_origen,
  },
  {
    name: "Ciudad Destino",
    label: "Ciudad Destino",
    align: "center",
    field: (row) => row.ciudad_destino,
  },
  {
    name: "Hora Salida",
    label: "Hora Salida",
    align: "center",
    field: (row) => row.hora_salida,
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

const agregarNuevaRuta = async () => {
  clearErrors()
  useRuta.errorvalidacion = '';

  if (!ciudad_origen.value) {
    ciudadOrigenError.value = 'La ciudad de origen es requerido';
  } else if (ciudad_origen.value === ciudad_destino.value) {
    ciudadDestinoError.value = 'La ciudad de destino no puede ser igual a la ciudad de origen';
  }

  if (!ciudad_destino.value) {
    ciudadDestinoError.value = 'La ciudad de destino es requerido';
  }

  if (!hora_salida.value) {
    horaSalidaError.value = 'La hora de salida es requerida';
  }



  if (!ciudadOrigenError.value && !ciudadDestinoError.value && !horaSalidaError.value) {
    loading.value = true
    const fechaActual = new Date();
    const horaSalidaDate = new Date(fechaActual.toDateString() + ' ' + hora_salida.value);
    const data = {
      ciudad_origen: ciudad_origen.value.value,
      ciudad_destino: ciudad_destino.value.value,
      hora_salida: horaSalidaDate,
    };

    try {
      const response = await useRuta.agregarNuevaRuta(data);
      console.log(response);

      if (useRuta.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Ruta añadida correctamente (presione ❌ para cerrar)';
        loading.value = false;
        ciudad_origen.value = '';
        ciudad_destino.value = '';
        hora_salida.value = '';
        setTimeout(() => {
          useRuta.errorvalidacion = '';
          mensaje.value = '';
        }, 5500);
      } else if (useRuta.estatus === 400) {
        mensajeColor.value = 'error';
        setTimeout(() => {
          useRuta.errorvalidacion = '';
        }, 7500);
      }
    } catch (error) {
      console.log('Error al agregar la ruta:', error);
      mensajeColor.value = 'error';
      setTimeout(() => {
        useRuta.errorvalidacion = '';
      }, 5500);
    }
  }

  loading.value = false;
  clearErrors();
};

const editarRuta = async () => {

  clearErrors();

  // Validar los campos
  if (!ciudad_origen.value) {
    ciudadOrigenError.value = 'La ciudad de origen es requerido';
  } else if (ciudad_origen.value === ciudad_destino.value) {
    ciudadDestinoError.value = 'La ciudad de destino no puede ser igual a la ciudad de origen';
  }

  if (!ciudad_destino.value) {
    ciudadDestinoError.value = 'La ciudad de destino es requerido';
  }

  if (!hora_salida.value) {
    horaSalidaError.value = 'La hora de salida es requerida';
  }



  if (!ciudadOrigenError.value && !ciudadDestinoError.value && !horaSalidaError.value) {
    loading.value = true;
    const fechaActual = new Date();
    const horaSalidaDate = new Date(fechaActual.toDateString() + ' ' + hora_salida.value);
    const data = {
      ciudad_origen: ciudad_origen.value.value,
      ciudad_destino: ciudad_destino.value.value,
      hora_salida: horaSalidaDate,
    };

    try {
      const response = await useRuta.actualizarRuta(id.value, data);
      mensajeColor.value = 'success';
      if (useRuta.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Ruta editada correctamente (presione ❌ para cerrar)';
        loading.value = false;
        setTimeout(() => {
          useRuta.errorvalidacion = '';
          mensaje.value = '';
        }, 7500);
      } else if (useRuta.estatus === 400) {
        mensajeColor.value = 'error';
        loading.value = false;
        setTimeout(() => {
          useRuta.errorvalidacion = '';
        }, 7500);
      }
    } catch (error) {
      console.log('Error al editar la ruta:', error);
      mensajeColor.value = 'error';
      loading.value = false;
      setTimeout(() => {
        useRuta.errorvalidacion = '';
      }, 7500);
    }
  }
}

async function obtenerRutas() {
  loading.value = true
  try {
    await useRuta.obtenerRutas();
    rutas.value = useRuta.rows;
    rows.value = useRuta.rows.reverse();
    loading.value = false
  } catch (error) {
    console.log(error);
  }
}

async function obtenerCiudades() {
  try {
    await useCiudad.obtenerCiudades();
    ciudades.value = useCiudad.rows;
    console.log("ola", ciudades)
  } catch (error) {
    console.log(error);
  }
}

/* async function obtenerBuses() {
  try {
    await useBus.obtenerBuses();
    buses.value = useBus.rows;
  } catch (error) {
    console.log(error);
  }
} */

const getFilteredCiudades = (ciudades) => {
  const ciudadesOptions = ciudades.map((c) => {
    return {
      label: c.estado === 0 ? `${c.nombre} - Inactiva` : c.nombre,
      value: c._id,
      disable: c.estado === 0,
    };
  });
  return ciudadesOptions;
};

async function desactivarRuta(id) {
  await useRuta.desactivar(id);
  obtenerRutas();
}

async function activarRuta(id) {
  await useRuta.activar(id);
  obtenerRutas();
}

const obtenerTextoEstado = (estado) => {
  return estado === 1 ? "Activo" : "Inactivo";
};

const filtrarCiudades = (val, update) => {
  if (val === '') {
    // Restablecer las opciones a la lista original de ciudades cuando el input está vacío
    update(() => {
      ciudades.value = useCiudad.rows;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    ciudades.value = useCiudad.rows.filter(c => c.nombre.toLowerCase().includes(needle));
  });
}


/* const filtrarBuses = (val, update) => {
  if (val === '') {
    // Restablecer las opciones a la lista original de conductores cuando el input está vacío
    update(() => {
      buses.value = useBus.rows;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    buses.value = useBus.rows.filter(c => c.placa.toLowerCase().includes(needle));
  });
} */

onMounted(async () => {
  obtenerRutas();
  obtenerCiudades();
  desactivarRuta()
  activarRuta()
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