<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">Tiquete</h1>
      <div class="linea"></div>
    </div>
    <div class="r">
      <button type="button" class="  button " style="margin:0 auto;" data-bs-toggle="modal"
        data-bs-target="#staticBackdrop" @click="abrir()"> <span class="button__text">Añadir</span> <span
          class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg">
            <line y2="19" y1="5" x2="12" x1="12"></line>
            <line y2="12" y1="12" x2="19" x1="5"></line>
          </svg></span>
      </button>
    </div>

    <!-- Modal agregar -->

    <q-dialog v-model="mostrarModalAgregar" position="top">
      <div class="modal fade" style="margin-top: 12%;" id="staticBackdrop" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" ref="addClientModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="cerrar">
                <p class="title">Seleccione
                </p>
                <button type="button" data-bs-dismiss="modal" @click="cerrar()" class="row justify-center items-center"
                  id="botoncerrar">❌</button>
              </div>
              <!--  <span v-if="ciudadOrigenError || ciudadDestinoError || horaSalidaError || valorError || busError"
                  class="error-message">{{ ciudadOrigenError || ciudadDestinoError || horaSalidaError || valorError || busError
                  }}</span>
                <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useRuta.errorvalidacion }}</p>
                <span v-if="mensaje" :class="[mensajeColor === 'success' ? 'success-message' : 'error-message']">{{
                  mensaje
                }}</span>
                <div v-if="loading" class="text-center">
                  <q-spinner-hourglass color="primary" size="50px" />
                  <p>Por favor, espere...</p>
                </div> -->
              <!-- <label for="ciudad_origen">
                  <select v-model="ciudad_origen" id="ciudad_origen" class="input">
                    <option value="" disabled>Selecciona una ciudad de origen</option>
                    <option v-for="ciudad in ciudades" :value="ciudad._id" :key="ciudad._id">{{ ciudad.nombre }}</option>
                  </select>
                </label> -->
              <div v-if="loading" class="text-center">
                <q-spinner-hourglass color="primary" size="50px" />
                <p>Cargando rutas, por favor espere...</p>
              </div>

              <q-select filled v-model="ruta" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione una ruta"
                :options="rutas.map(c => ({ label: `${c.ciudad_origen.nombre} / ${c.ciudad_destino.nombre}`, value: c }))"
                @filter="filtrarRutas" style="width: 400px">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <!-- Inputs adicionales para mostrar la Hora_Salida y el Bus -->
              <q-input filled v-model="horaSalida" label="Hora de Salida" readonly />
              <q-input filled v-model="bus" label="Bus" readonly />





              <!--  <q-select
              filled
              v-model="ciudad_destino"
              clearable
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              label="Seleccione ciudad destino"
              :options="ciudades.map(c => ({ label: c.nombre, value: c._id }))"
              @filter="filtrarCiudades"
              style="width: 400px"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                   No se encontraron resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select> -->

              <!-- <label for="ciudad_destino">
                  <select v-model="ciudad_destino" id="ciudad_destino" class="input">
                    <option value="" disabled>Selecciona una ciudad de detino</option>
                    <option v-for="ciudad in ciudades" :value="ciudad._id" :key="ciudad._id">{{ ciudad.nombre }}</option>
                  </select>
                </label> -->



              <!-- <label for="valor">
                  <input placeholder="" type="text" class="input" v-model="valor">
                  <span>Valor :</span>
                </label>

                <q-select
              filled
              v-model="bus"
              clearable
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              label="Seleccione bus"
              :options="buses.map(c => ({ label: c.placa, value: c._id }))"
              @filter="filtrarBuses"
              style="width: 400px"
            >
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

    <!-- Puedes agregar esto donde desees mostrar la cantidad de asientos del bus -->
    <div v-if="mostrarasientos">
  <p>Asientos del Bus:</p>
  <div class="asientos-container">
    <button
      v-for="asiento in Array(asientosBus).fill().map((_, index) => index + 1)"
      :key="asiento"
      @click="seleccionarAsiento(asiento)"
      :class="{ 'asiento-seleccionado': asientoSeleccionado === asiento, 'asiento': true }"
    >
    <img src="../assets/silla.png" alt="Asiento {{ asiento }}" />
    </button>
  </div>
</div>


  </div>
</template>

<script setup>
import { useTiqueteStore } from "../stores/tiquete.js";
import { onMounted, ref, watch } from "vue";
import { useRutaStore } from "../stores/ruta.js";

const mostrarModalAgregar = ref(false)
const rutas = ref([])
const ruta = ref('')
const useRuta = useRutaStore()
const horaSalida = ref('');
const bus = ref([]);
const asientosBus = ref('');
const loading = ref(false);
const mostrarasientos = ref(false)

const asientoSeleccionado = ref(null);

const seleccionarAsiento = (asiento) => {
  if (asientoSeleccionado.value === asiento) {
    // Deseleccionar el asiento si ya estaba seleccionado
    asientoSeleccionado.value = null;
  } else {
    // Seleccionar el nuevo asiento
    asientoSeleccionado.value = asiento;
  }
};



watch(ruta, (nuevaRuta) => {
  mostrarasientos.value = true
  console.log(nuevaRuta)
  // Verifica si nuevaRuta está definido y tiene las propiedades Hora_Salida y Bus
  if (nuevaRuta && nuevaRuta.value && nuevaRuta.value.hora_salida) {
    // Asigna el valor de Hora_Salida
    horaSalida.value = nuevaRuta.value.hora_salida;
  } else {
    // En caso contrario, asigna un valor predeterminado o vacío según tu lógica
    horaSalida.value = ''; // o algún valor predeterminado
  }

  // Verifica si nuevaRuta está definido y tiene la propiedad Bus
  if (nuevaRuta && nuevaRuta.value && nuevaRuta.value.bus.placa) {
    // Asigna el valor de Bus
    bus.value = nuevaRuta.value.bus.placa;
  } else {
    // En caso contrario, asigna un valor predeterminado o vacío según tu lógica
    bus.value = ''; // o algún valor predeterminado
  }

  if (nuevaRuta && nuevaRuta.value && nuevaRuta.value.bus.asiento) {
    // Asigna el valor de asientosBus
    asientosBus.value = nuevaRuta.value.bus.asiento;
  } else {
    // En caso contrario, asigna un valor predeterminado o vacío según tu lógica
    asientosBus.value = ''; // o algún valor predeterminado
  }
});







console.log(rutas.value)
const abrir = () => {
  mostrarModalAgregar.value = true
};
const cerrar = () => {
  mostrarModalAgregar.value = false
};


const obtenerRutas = async () => {
  try {
    loading.value = true; // Indicar que la carga está en progreso
    await useRuta.obtenerRutas();
    rutas.value = useRuta.rows;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false; // Indicar que la carga ha terminado (independientemente del resultado)
  }
};


const filtrarRutas = (val, update) => {
  if (val === '') {
    update(() => {
      rutas.value = useRuta.rows;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    rutas.value = useRuta.rows.filter(c => `${c.ciudad_origen.nombre} / ${c.ciudad_destino.nombre}`.toLowerCase().includes(needle));
  });
};


onMounted(async () => {
  obtenerRutas()
});

</script>

<style scoped>

.asientos-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Crear 4 columnas */
  gap: 10px; /* Espacio entre los botones */
}

.asiento {
  /* Estilos del botón de asiento */
  width: 50px;
  height: 50px;
  /* Otros estilos... */
}

.asientos-container button img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ajusta la imagen para que cubra completamente el área del botón */
}



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
</style>