<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">Ventas</h1>
      <div class="linea"></div>
    </div>
    <div class="r">
      <button type="button" class="  button " style="margin:0 auto;" data-bs-toggle="modal"
        data-bs-target="#staticBackdrop" @click="abrir()"> <span class="button__text">Nueva Venta</span> <span
          class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg">
            <line y2="19" y1="5" x2="12" x1="12"></line>
            <line y2="12" y1="12" x2="19" x1="5"></line>
          </svg></span>
      </button>
      <button type="button" class="  button " style="margin:0 auto;" data-bs-toggle="modal" @click="abrirContinuarVenta()"
        data-bs-target="#staticBackdrop"> <span class="button__text">Continuar Venta</span> <span
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
                <button type="button" data-bs-dismiss="modal" @click="cerrarModal()" class="row justify-center items-center"
                  id="botoncerrar">❌</button>
              </div>
              <span v-if="rutaError " class="error-message">{{ rutaError  }}</span>
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
              <q-input filled v-model="fechaActual" label="Fecha Venta" readonly />




              <button type="button" @click="cerrar()" class="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </q-dialog>

    <!-- Modal continuarVenta -->

    <q-dialog v-model="mostrarContinuarVenta" position="top">
      <div class="modal fade" style="margin-top: 12%;" id="staticBackdrop" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" ref="addClientModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="cerrar">
                <p class="title">Seleccione
                </p>
                <button type="button" data-bs-dismiss="modal" @click="cerrarContinuarVenta()"
                  class="row justify-center items-center" id="botoncerrar">❌</button>
              </div>
              <span v-if="rutaError " class="error-message">{{ rutaError  }}</span>
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
              <q-input filled v-model="fechaActual" label="Fecha Venta" readonly />




              <button type="button" @click="cerrarContinuarVenta()" class="submit">Continuar Venta</button>
            </form>
          </div>
        </div>
      </div>
    </q-dialog>


    <div v-if="mostrarasientos">
      <p>Asientos del Bus:</p>
      <div class="asientos-container">
        <button v-for="asiento in Array(asientosBus).fill().map((_, index) => index + 1)" :key="asiento"
          @click="seleccionarAsiento(asiento)" :class="{
            'asiento-seleccionado': asientoSeleccionado === asiento,
            'asiento': true,
            'asiento-vendido': asientosVendidos.includes(asiento),
          }">
          <img src="../assets/silla.png" alt="Asiento {{ asiento }}" />
        </button>



      </div>
    </div>


    <!-- Nuevo bloque para el formulario -->
    <div v-if="mostrarFormulario" class="formulario">
      <button type="button" @click="mostrarFormulario = false">Cerrar Formulario</button>
      <button type="button" @click="abrirModalAgregarCliente">Agregar Cliente</button>

      <q-select filled v-model="cliente" clearable use-input hide-selected fill-input input-debounce="0"
        label="Digite cédula cliente" :options="clientes.map(c => ({ label: c.cedula, value: c }))"
        @filter="filtrarClientes" style="width: 400px">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No se encontraron resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input filled v-model="nombre" label="Nombre Cliente" readonly />

      <q-input filled v-model="email" label="Email Cliente" readonly />

      <q-input filled v-model="asientoSeleccionado" label="Numero Asiento" readonly />

      <q-input filled v-model="valor" label="Valor" />



      <button type="button" @click="vender" :disabled="loadingVender" class="submit">
        {{ loadingVender ? 'Cargando...' : 'Vender' }}
      </button>
      <div v-if="mensajeExito" class="success-message">{{ mensajeExito }}</div>
      <span v-if="clienteError || valorError " class="error-message">{{ clienteError || valorError }}</span>
    </div>

    <q-dialog v-model="mostrarModalAgregarCliente" position="top">

      <div class="modal fade" style="margin-top: 12%;" id="staticBackdrop" data-bs-backdrop="static"
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" ref="addClientModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="cerrar">
                <p class="title">Añadir cliente</p>
                <button type="button" data-bs-dismiss="modal" @click="cerrarAgregarCliente()"
                  class="row justify-center items-center" id="botoncerrar">❌</button>
              </div>
              <span v-if="nombreError || cedulaError || emailError" class="error-message">{{ nombreError || cedulaError ||
                emailError }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useCliente.errorvalidacion }}</p>
              <span v-if="mensaje" :class="[mensajeColor === 'success' ? 'success-message' : 'error-message']">{{
                mensaje
              }}</span>
              <div v-if="loading" class="text-center">
                <q-spinner-hourglass color="primary" size="50px" />
                <p>Por favor, espere...</p>
              </div>
              <label for="nombre">
                <input placeholder="Nombre" type="text" class="input" v-model="nuevoNombre">

              </label>

              <label for="cedula">
                <input placeholder="Cedula" type="text" class="input" v-model="nuevaCedula">

              </label>

              <label for="email">
                <input placeholder="Email" type="text" class="input" v-model="nuevoEmail">

              </label>

              <!-- Resto del contenido del formulario... -->

              <button type="button" @click="agregarNuevoCliente" class="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </q-dialog>

  </div>
</template>
  
<script setup>
import { useTiqueteStore } from "../stores/tiquete.js";
import { onMounted, ref, watch } from "vue";
import { useRutaStore } from "../stores/ruta.js";
import { format } from 'date-fns';
import { useClienteStore } from "../stores/cliente.js";
import { useVendedorStore } from "../stores/vendedor.js";

const mostrarModalAgregar = ref(false)
const rutas = ref([])
const clientes = ref([])
const ruta = ref('')
const useRuta = useRutaStore()
const useCliente = useClienteStore()
const useTiquete = useTiqueteStore()
const useVendedor = useVendedorStore()
const horaSalida = ref('');
const bus = ref([]);
const asientosBus = ref('');
const valor = ref('');
const loading = ref(false);
const mostrarasientos = ref(false);
const mostrarFormulario = ref(false);
const mostrarModalAgregarCliente = ref(false);
const mostrarContinuarVenta = ref(false)
const fechaActual = ref(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
const vendedor = ref('');
const cliente = ref('');
const cedula = ref('');
const nombre = ref('');
const email = ref('');
const nuevoNombre = ref('');
const nuevaCedula = ref('');
const nuevoEmail = ref('');
const mensaje = ref('');
const mensajeColor = ref('');
const nombreError = ref(null);
const cedulaError = ref(null);
const emailError = ref(null);
const clienteError = ref(null)
const valorError = ref(null)
const rutaError = ref(null);
const asientoSeleccionado = ref(null);
const asientosVendidos = ref([]);
const vendedorId = ref(localStorage.getItem('vendedorId'))
const ventas = ref('')
const loadingVender = ref(false);
const mensajeExito = ref('');



console.log("Hola soy ruta seleccionada:", ruta)
console.log("Hola soy vendedor id", vendedorId)

const clearErrors = () => {
  setTimeout(() => {
    clienteError.value = null;
    useCliente.errorvalidacion = '';
  }, 4500);
};

const soloNumeros = (value) => {
  const numeroRegex = /^[0-9]+$/;
  return numeroRegex.test(value);
};

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const seleccionarAsiento = (asiento) => {
  if (!Array.isArray(asientosVendidos.value)) {
    // Si asientosVendidos no es un array, inicialízalo como un array vacío
    asientosVendidos.value = [];
  }

  if (asientosVendidos.value.includes(asiento)) {
    // Asiento ya vendido, realizar acciones necesarias (mostrar mensaje, etc.)
    return;
  }
  asientoSeleccionado.value = asiento;
  mostrarFormulario.value = true;
};



watch(ruta, (nuevaRuta) => {
  mostrarasientos.value = true

  if (nuevaRuta && nuevaRuta.value && nuevaRuta.value.hora_salida) {
    horaSalida.value = nuevaRuta.value.hora_salida;
  } else {
    horaSalida.value = '';
  }


  if (nuevaRuta && nuevaRuta.value && nuevaRuta.value.bus.placa) {
    bus.value = nuevaRuta.value.bus.placa;
  } else {
    bus.value = '';
  }

  if (nuevaRuta && nuevaRuta.value && nuevaRuta.value.bus.asiento) {
    asientosBus.value = nuevaRuta.value.bus.asiento;
  } else {
    asientosBus.value = '';
  }

  if (nuevaRuta && nuevaRuta.value && nuevaRuta.value.valor) {
    valor.value = nuevaRuta.value.valor;
  } else {
    valor.value = '';
  }
});


watch(cliente, (nuevoCliente) => {
  if (nuevoCliente && nuevoCliente.value && nuevoCliente.value.nombre) {
    nombre.value = nuevoCliente.value.nombre;
  } else {
    nombre.value = '';
  }


  if (nuevoCliente && nuevoCliente.value && nuevoCliente.value.email) {
    email.value = nuevoCliente.value.email;
  } else {
    email.value = '';
  }

});


const vender = async () => {
  loadingVender.value = true;
  if (!cliente.value){
    clienteError.value = 'Por favor digite la cedula del cliente'
    setTimeout(() => {
      clienteError.value = ''
      loadingVender.value = false;
    }, 4500);
  }

  if (!valor.value){
    valorError.value = 'Por favor digite el valor del tiquete'
    setTimeout(() => {
      valorError.value = ''
      loadingVender.value = false;
    }, 4500);
  } else if (!soloNumeros(valor.value)) {
    valorError.value = 'El valor debe contener solo números';
    setTimeout(() => {
      valorError.value = ''
      loadingVender.value = false;
    }, 4500);
  }

  if (asientosVendidos.value.includes(asientoSeleccionado.value)) {
    // Asiento ya vendido, realizar acciones necesarias (mostrar mensaje, etc.)
    return;
  }

  // Resto del código para la venta...

  // Después de realizar la venta, agregar el asiento a la lista de vendidos
  asientosVendidos.value.push(asientoSeleccionado.value);


  const data = {
    vendedor: vendedorId.value,
    ruta: ruta.value.value._id,
    cliente: cliente.value.value._id,
    fecha_salida: fechaActual.value,
    num_asiento: asientoSeleccionado.value,
  };

  try {
    const response = await useTiquete.agregarNuevoTiquete(data);

    if (useTiquete.estatus === 200) {
      mensajeColor.value = 'success';
      mensajeExito.value = 'Tiquete vendido exitosamente';
      setTimeout(() => {
        cliente.value = '';
        cedula.value = '';
        email.value = '';
        valor.value = '';
        useTiquete.errorvalidacion = '';
        mensaje.value = '';
        mensajeExito.value = '';
        mostrarFormulario.value = false
      }, 4500);
    } else {
      mensajeColor.value = 'error';
      setTimeout(() => {
        useTiquete.errorvalidacion = '';
      }, 4500);
    }
  } catch (error) {
    console.log('Error al agregar el tiquete:', error);
    mensajeColor.value = 'error';
    setTimeout(() => {
      useTiquete.errorvalidacion = '';
    }, 4500);
  }
  loadingVender.value = false;
};

const abrirModalAgregarCliente = () => {
  mostrarModalAgregarCliente.value = true;
};  

const cerrarAgregarCliente = () => {
  mostrarModalAgregarCliente.value = false
  nombre.value = "";
  cedula.value = "";
  email.value = "";
  mensaje.value = "";
};

const abrir = () => {
  mostrarModalAgregar.value = true
};
const cerrar = () => {
  if (!ruta.value) {
    rutaError.value = 'Por favor seleccione una ruta';
    setTimeout(() => {
      rutaError.value = '';
    }, 4500);
  } else {
     // Clear the error message immediately when the condition is not met
    mostrarModalAgregar.value = false;
  }
};

const cerrarModal = () => {
    mostrarModalAgregar.value = false;
};

const abrirContinuarVenta = () => {
  mostrarContinuarVenta.value = true
};

const cerrarContinuarVenta = () => {
  mostrarContinuarVenta.value = false
};


const obtenerRutas = async () => {
  try {
    loading.value = true;
    await useRuta.obtenerRutas();
    rutas.value = useRuta.rows;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

async function obtenerClientes() {
  try {
    await useCliente.obtenerClientes();
    clientes.value = useCliente.rows;
  } catch (error) {
    console.log(error);
  }
}

async function continuarVenta() {
  try {
    await useTiquete.continuarVentaTiquete();
    ventas.value = useTiquete.rows;

    // Obtener los asientos vendidos de la respuesta de la petición
    asientosVendidos.value = useTiquete.rows.map(tiquete => tiquete.num_asiento);

  } catch (error) {
    console.log(error);
  }
}

console.log('Asientos Vendidos:', asientosVendidos);

const agregarNuevoCliente = async () => {
  loading.value = true;
  nombreError.value = null;
  cedulaError.value = null;
  emailError.value = null;
  useCliente.errorvalidacion = '';

  if (!nuevoNombre.value) {
    nombreError.value = 'El nombre es requerido';
  } else if (!nuevoNombre.value.trim()) {
    nombreError.value = 'Nombre no valido'
  } else if (nuevoNombre.value.length > 15) {
    nombreError.value = 'El nombre no debe tener más de 15 caracteres';
  } else if (!/^[a-zA-Z\s]+$/.test(nuevoNombre.value)) {
    nombreError.value = 'El nombre debe ser una cadena de texto válida'
  }

  if (!nuevaCedula.value) {
    cedulaError.value = 'La cédula es requerida';
  } else if (nuevaCedula.value.length !== 10) {
    cedulaError.value = 'La cédula debe tener exactamente 10 caracteres';
  } else if (!soloNumeros(nuevaCedula.value)) {
    cedulaError.value = 'La cédula debe contener solo números';
  }

  if (!nuevoEmail.value) {
    emailError.value = 'El email es requerido';
  } else if (!emailRegex.test(nuevoEmail.value)) {
    emailError.value = 'El email debe ser válido';
  }




  if (!nombreError.value && !cedulaError.value && !emailError.value) {
    const data = {
      nombre: nuevoNombre.value,
      cedula: nuevaCedula.value,
      email: nuevoEmail.value,
    };

    try {
      const response = await useCliente.agregarNuevoCliente(data);

      if (useCliente.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Cliente añadido correctamente (presione ❌ para cerrar)';
        setTimeout(() => {
          nuevoNombre.value = '';
          nuevaCedula.value = '';
          nuevoEmail.value = '';
          useCliente.errorvalidacion = '';
          mensaje.value = '';
        }, 4500);
      } else {
        mensajeColor.value = 'error';
        setTimeout(() => {
          useCliente.errorvalidacion = '';
        }, 4500);
      }
    } catch (error) {
      console.log('Error al agregar el cliente:', error);
      mensajeColor.value = 'error';
      setTimeout(() => {
        useCliente.errorvalidacion = '';
      }, 4500);
    }
  }

  loading.value = false;
  clearErrors();
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

const filtrarClientes = (val, update) => {
  if (val === '') {
    // Restablecer las opciones a la lista original de conductores cuando el input está vacío
    update(() => {
      clientes.value = useCliente.rows;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    clientes.value = useCliente.rows.filter(c => c.cedula.toLowerCase().includes(needle));
  });
}


onMounted(async () => {
  obtenerRutas();
  obtenerClientes();
  await continuarVenta(); // Asegúrate de esperar a que la función termine antes de continuar
});

</script>
  
<style scoped>
.asientos-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* Crear 4 columnas */
  gap: 10px;
  /* Espacio entre los botones */
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
  object-fit: cover;
  /* Ajusta la imagen para que cubra completamente el área del botón */
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

.asiento-seleccionado {
  background-color: #4caf50;
  /* Cambia el color de fondo al asiento seleccionado */
  border: 2px solid #388e3c;
  /* Cambia el borde al asiento seleccionado */
  color: #fff;
  /* Cambia el color del texto al asiento seleccionado si es necesario */
}

.formulario {
  display: grid;
  grid-template-columns: 1fr;
  /* Una columna */
  gap: 20px;
  /* Espacio entre elementos */
  padding: 20px;
  /* Padding para separar del borde */
}

.asiento-vendido {
  background-color: red;
  /* Color de fondo para los asientos vendidos */
  cursor: not-allowed;
  /* Cursor not-allowed para los asientos vendidos */
}
</style>