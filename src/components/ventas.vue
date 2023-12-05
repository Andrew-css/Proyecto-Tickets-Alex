<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">Ventas</h1>
      <div class="linea"></div>
    </div>
    <div class="r">
      <button type="button" class="  button " style="margin:0 auto;" data-bs-toggle="modal"
        data-bs-target="#staticBackdrop" @click="abrir()"> <span class="button__text">Nueva Venta</span>
      </button>
      <button type="button" class="  button " style="margin:0 auto;" data-bs-toggle="modal" @click="abrirContinuarVenta()"
        data-bs-target="#staticBackdrop"> <span class="button__text">Continuar Venta</span>
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
                <button type="button" data-bs-dismiss="modal" @click="cerrarModal()"
                  class="row justify-center items-center" id="botoncerrar">❌</button>
              </div>
              <span v-if="rutaError" class="error-message">{{ rutaError }}</span>
              <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useRuta.errorvalidacion }}</p>
              <div v-if="loading" class="text-center">
                <q-spinner-hourglass color="primary" size="50px" />
                <p>Cargando rutas, por favor espere...</p>
              </div>

              <!-- <q-select filled v-model="ruta" clearable use-input hide-selected fill-input input-debounce="0"
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
              </q-select> -->

              <q-select filled v-model="ruta" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione ruta" :options="getFilteredRutas(rutas)" style="width: 400px"
                @filter="filtrarRutas">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <!-- <q-select filled v-model="bus" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione un bus" :options="buses.map(c => ({ label: `${c.placa} / ${c.numero}`, value: c }))"
                @filter="filtrarBuses" style="width: 400px">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select> -->

              <q-select filled v-model="bus" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione bus" :options="getFilteredBuses(buses)" style="width: 400px"
                @filter="filtrarBuses">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>


              <label for="fecha_salida">
                <input placeholder="" type="date" class="input" v-model="fecha_salida" :min="getCurrentDate()">
                <span>Fecha de salida:</span>
              </label>


              <q-input filled v-model="horaSalidaFormateada" label="Hora de Salida" readonly />

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
              <span v-if="rutaError" class="error-message">{{ rutaError }}</span>
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


    <div class="allasientos" v-if="mostrarasientos">

      <p>Ruta: {{ ruta.label }}</p>
      <p>Bus: {{ bus.label }}</p>
      <p>Fecha Salida: {{ fecha_salida }} {{ horaSalidaFormateada }}</p>

      <div class="asientos-container">
       
        <button id="butonasiento" v-for="asiento in Array(asientosBus).fill().map((_, index) => index + 1)" :key="asiento"
          @click="seleccionarAsiento(asiento)" :class="{
            'asiento-seleccionado': asientoSeleccionado === asiento,
            'asiento': true,
            'asiento-vendido': asientosVendidos.includes(asiento),
          }">
          <div class="content-button">
          <span class="numero-asiento">{{ asiento }}</span> 
          
          <img style="height: 80px;" src="../assets/asined.png" alt="Asiento {{ asiento }}" />

          </div>
        </button>
      </div>
    </div>




    <!-- Nuevo bloque para el formulario -->
    <q-dialog v-model="mostrarruta">
      <div class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <form class="form">
              <div class="formulario">
                <div class="botoneliminarx">
                  <button type="button" data-bs-dismiss="modal" @click="cerrarFormulario" class="eliminarx"
                    id="botoncerrar">❌</button>
                </div>
                <button type="button" id="butonasiento" @click="abrirModalAgregarCliente">Agregar Cliente</button>
                <div v-if="mensajeExito" class="success-message">{{ mensajeExito }}</div>
                <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useTiquete.errorvalidacion }}</p>
                <!-- <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useCliente.errorvalidacion }}</p>
                <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useRuta.errorvalidacion }}</p>
                <p style="color: red; font-weight: bold; font-size: 20px;"> {{ useBus.errorvalidacion }}</p> -->
                <span v-if="clienteError || valorError" class="error-message">{{ clienteError || valorError }}</span>
                <div v-if="loadingVender" class="text-center">
                  <q-spinner-hourglass color="primary" size="50px" />
                  <p>Por favor, espere...</p>
                </div>
                <!-- <q-select filled v-model="cliente" clearable use-input hide-selected fill-input input-debounce="0"
                  label="Digite cédula cliente" :options="clientes.map(c => ({ label: c.cedula, value: c }))"
                  @filter="filtrarClientes" style="width: 400px">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No se encontraron resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select> -->

                <q-select filled v-model="cliente" clearable use-input hide-selected fill-input input-debounce="0"
                label="Seleccione bus" :options="getFilteredClientes(clientes)" style="width: 400px"
                @filter="filtrarClientes">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No se encontraron resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

                <q-input filled v-model="nombre" label="Nombre Cliente" readonly />

                <q-input filled v-model="telefono" label="Telefono Cliente" readonly />

                <q-input filled v-model="asientoSeleccionado" label="Numero Asiento" readonly />

                <q-input filled v-model="valor" label="Valor" />



                <button type="button" @click="vender" :disabled="loadingVender" class="submit">
                  {{ loadingVender ? 'Cargando...' : 'Vender' }}
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </q-dialog>

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
              <span v-if="nombreError || cedulaError || telefonoError || emailError" class="error-message">{{ nombreError
                || cedulaError || telefonoError ||
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
                <span>Nombre</span>
              </label>

              <label for="cedula">
                <input placeholder="Cedula" type="text" class="input" v-model="nuevaCedula">
                <span>Cédula</span>
              </label>

              <label for="email">
                <input placeholder="Teléfono" type="text" class="input" v-model="nuevoTelefono">
                <span>Teléfono</span>
              </label>


              <label for="email">
                <input placeholder="Email" type="text" class="input" v-model="nuevoEmail">
                <span>Email</span>
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
import { onMounted, ref, watch, getCurrentInstance  } from "vue";
import { useRutaStore } from "../stores/ruta.js";
import { format } from 'date-fns';
import { useClienteStore } from "../stores/cliente.js";
import { useVendedorStore } from "../stores/vendedor.js";
import { useBusStore } from "../stores/bus.js";

const mostrarModalAgregar = ref(false)
const rutas = ref([])
const clientes = ref([])
const buses = ref([])
const ruta = ref('')
const useRuta = useRutaStore()
const useCliente = useClienteStore()
const useTiquete = useTiqueteStore()
const useBus = useBusStore();
const useVendedor = useVendedorStore()
const horaSalida = ref('');
const bus = ref('');
const asientosBus = ref('');
const valor = ref('');
const loading = ref(false);
const mostrarasientos = ref(false);
const mostrarFormulario = ref(false);
const mostrarModalAgregarCliente = ref(false);
const mostrarContinuarVenta = ref(false)
const fechaActual = ref(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
const fecha_salida = ref('');
const horaSalidaFormateada = ref('');
const vendedor = ref('');
const cliente = ref('');
const cedula = ref('');
const nombre = ref('');
const telefono = ref('');
const email = ref('');
const nuevoNombre = ref('');
const nuevaCedula = ref('');
const nuevoTelefono = ref('');
const nuevoEmail = ref('');
const mensaje = ref('');
const mensajeColor = ref('');
const nombreError = ref(null);
const cedulaError = ref(null);
const telefonoError = ref(null)
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
const mostrarruta = ref(false)

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

const getCurrentDate = () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
  const year = today.getFullYear();

  // Formato de fecha: "AAAA-MM-DD"
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const seleccionarAsiento = (asiento) => {
  if (!Array.isArray(asientosVendidos.value)) {
    asientosVendidos.value = [];
  }

  if (asientosVendidos.value.includes(asiento)) {
    return;
  }
  asientoSeleccionado.value = asiento;
  mostrarruta.value = true;
};

const cerrarFormulario = async () => {
  mostrarruta.value = false
}

watch(ruta, (nuevaRuta) => {

  if (nuevaRuta && nuevaRuta.value && nuevaRuta.value.hora_salida) {
    horaSalida.value = nuevaRuta.value.hora_salida;
    console.log("Hola soy hora seleccionada", horaSalida)
  } else {
    horaSalida.value = '';
  }

});

watch(bus, (nuevoBus) => {
  mostrarasientos.value = true


  if (nuevoBus && nuevoBus.value && nuevoBus.value.asiento) {
    asientosBus.value = nuevoBus.value.asiento;
  } else {
    asientosBus.value = '';
  }

});


watch(cliente, (nuevoCliente) => {
  if (nuevoCliente && nuevoCliente.value && nuevoCliente.value.nombre) {
    nombre.value = nuevoCliente.value.nombre;
  } else {
    nombre.value = '';
  }


  if (nuevoCliente && nuevoCliente.value && nuevoCliente.value.telefono) {
    telefono.value = nuevoCliente.value.telefono;
  } else {
    telefono.value = '';
  }

});

watch(horaSalida, (newValue) => {
  horaSalidaFormateada.value = formatHoraSalida(newValue);
});


const vender = async () => {
  if (!cliente.value) {
    clienteError.value = 'Por favor digite la cedula del cliente'
    setTimeout(() => {
      clienteError.value = ''
      loadingVender.value = false;
    }, 4500);
  }

  if (!valor.value) {
    valorError.value = 'Por favor digite el valor del tiquete'
    setTimeout(() => {
      valorError.value = ''
      loadingVender.value = false;
    }, 4500);
  } else if (!valor.value.trim()) {
    valorError.value = 'Solo espacios no es permitido, por favor digite un valor real';
    setTimeout(() => {
      valorError.value = ''
      loadingVender.value = false;
    }, 4500);
  } else if (!soloNumeros(valor.value)) {
    valorError.value = 'El valor debe contener solo números (eliminar espacios si es el caso)';
    setTimeout(() => {
      valorError.value = ''
      loadingVender.value = false;
    }, 4500);
  }

  if (!valorError.value && !clienteError.value) {
    loadingVender.value = true;
    const data = {
      vendedor: vendedorId.value,
      ruta: ruta.value.value._id,
      cliente: cliente.value.value._id,
      fecha_salida: fecha_salida.value + "T" + horaSalidaFormateada.value + ".000Z",
      bus: bus.value.value._id,
      num_asiento: asientoSeleccionado.value,
      valor: valor.value,
    };


    try {
      const response = await useTiquete.agregarNuevoTiquete(data);

      if (useTiquete.estatus === 200) {
        if (asientosVendidos.value.includes(asientoSeleccionado.value)) {
          return;
        }
        asientosVendidos.value.push(asientoSeleccionado.value);
        mensajeColor.value = 'success';
        mensajeExito.value = 'Tiquete vendido exitosamente';
        loadingVender.value = false;
        setTimeout(() => {
          cliente.value = '';
          cedula.value = '';
          email.value = '';
          valor.value = '';
          useTiquete.errorvalidacion = '';
          mensaje.value = '';
          mensajeExito.value = '';
          mostrarruta.value = false
        }, 4500);
      } else if (useTiquete.estatus === 400){
        mensajeColor.value = 'error';
        loadingVender.value = false;
        setTimeout(() => {
          useTiquete.errorvalidacion = '';
        }, 4500);
      }
    } catch (error) {
      console.log('Error al agregar el tiquete:', error);
      mensajeColor.value = 'error';
      loadingVender.value = false;
      setTimeout(() => {
        useTiquete.errorvalidacion = '';
      }, 4500);
    }
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
    }, 5500);
  } else {
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


const obtenerBuses = async () => {
  try {
    loading.value = true;
    await useBus.obtenerBuses();
    buses.value = useBus.rows;
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

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!nuevoNombre.value) {
    nombreError.value = 'El nombre es requerido';
  } else if (!nuevoNombre.value.trim()) {
    nombreError.value = 'Solo espacios no es permitido, por favor digite un nombre real'
  }

  if (!nuevaCedula.value) {
    cedulaError.value = 'La cédula es requerida';
  } else if (!soloNumeros(nuevaCedula.value)) {
    cedulaError.value = 'La cédula debe contener solo números (sin espacios si es el caso)';
  } else if (nuevaCedula.value.length !== 10) {
    cedulaError.value = 'La cédula debe tener exactamente 10 caracteres (eliminar espacios si es el caso)';
  }

  if (!nuevoTelefono.value) {
    telefonoError.value = 'El telefono es requerido ';
  } else if (!nuevoTelefono.value.trim()) {
    telefonoError.value = 'Solo espacios no es permitido, por favor digite un teléfono real'
  } else if (nuevoTelefono.value.length !== 10) {
    telefonoError.value = 'El teléfono debe tener exactamente 10 caracteres (eliminar espacios si es el caso)';
  }

  if (!nuevoEmail.value) {
    emailError.value = 'El email es requerido';
  } else if (!nuevoEmail.value.trim()) {
    emailError.value = 'Solo espacios no es permitido, por favor digite un email real'
  } else if (!emailRegex.test(nuevoEmail.value)) {
    emailError.value = 'El email debe ser válido (eliminar espacios si es el caso)';
  }




  if (!nombreError.value && !cedulaError.value && !telefonoError.value && !emailError.value) {
    loading.value = true;
    const data = {
      nombre: nuevoNombre.value,
      cedula: nuevaCedula.value,
      telefono: nuevoTelefono.value,
      email: nuevoEmail.value,
    };

    try {
      const response = await useCliente.agregarNuevoCliente(data);

      if (useCliente.estatus === 200) {
        mensajeColor.value = 'success';
        mensaje.value = 'Cliente añadido correctamente (presione ❌ para cerrar)';
        loading.value = false;
        setTimeout(() => {
          nuevoNombre.value = '';
          nuevaCedula.value = '';
          nuevoEmail.value = '';
          nuevoTelefono.value = '';
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

/* const filtrarRutas = (val, update) => {
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
}; */

const getFilteredRutas = (rutas) => {
  const rutasOptions = rutas.map((c) => {
    return {
      label: c.estado === 0 ? `${c.ciudad_origen.nombre} / ${c.ciudad_destino.nombre} - Inactiva` : `${c.ciudad_origen.nombre} / ${c.ciudad_destino.nombre}`,
      value: c,
      disable: c.estado === 0,
    };
  });
  return rutasOptions;
};

const getFilteredBuses = (buses) => {
  const busesOptions = buses.map((c) => {
    return {
      label: c.estado === 0 ? `${c.numero} / ${c.placa} - Inactivo` : `${c.numero} / ${c.placa}`,
      value: c,
      disable: c.estado === 0,
    };
  });
  return busesOptions;
};

const getFilteredClientes = (clientes) => {
  const clientesOptions = clientes.map((c) => {
    return {
      label: c.estado === 0 ? `${c.cedula} - Inactiva` : c.cedula,
      value: c,
      disable: c.estado === 0,
    };
  });
  return clientesOptions;
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
}

const filtrarBuses = (val, update) => {
  if (val === '') {
    update(() => {
      buses.value = useBus.rows;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    buses.value = useBus.rows.filter(c => `${c.numero} / ${c.placa}`.toLowerCase().includes(needle));
  });
}

const filtrarClientes = (val, update) => {
  if (val === '') {
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

/* const filtrarClientes = (val, update) => {
  if (val === '') {
    update(() => {
      clientes.value = useCliente.rows;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    clientes.value = useCliente.rows.filter(c => c.cedula.toLowerCase().includes(needle));
  });
} */

/* const filtrarBuses = (val, update) => {
  if (val === '') {
    update(() => {
      buses.value = useBus.rows;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    buses.value = useBus.rows.filter(c => `${c.numero} / ${c.placa}`.toLowerCase().includes(needle));
  });
} */

const formatHoraSalida = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'HH:mm:ss');
};





onMounted(async () => {
  obtenerRutas();
  obtenerClientes();
  obtenerBuses();
  await continuarVenta();
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
  width: 100px;
  height: 100px;
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
  justify-content: center;
  align-items: center;
  display: flex;
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

.allasientos {
  margin: 0 auto;
  width: 600px;
  margin-top: 100px;
}

.botoneliminarx {
  display: flex;
  width: 94%;
  justify-content: flex-end;
}

#butonasiento {
  position: relative;
  margin: 0;
  padding: 17px 35px;
  outline: none;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-transform: uppercase;
  border: 1px solid rgba(22, 76, 167, 0.6);
  border-radius: 10px;
  color: #1d89ff;
  font-weight: 400;
  font-family: inherit;
  z-index: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.02, 0.01, 0.47, 1);
}

#butonasiento span {
  color: #164ca7;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.7px;
}

#butonasiento:hover {
  animation: rotate624 0.7s ease-in-out both;
}

#butonasiento:hover span {
  animation: storm1261 0.7s ease-in-out both;
  animation-delay: 0.06s;
}

@keyframes rotate624 {
  0% {
    transform: rotate(0deg) translate3d(0, 0, 0);
  }

  25% {
    transform: rotate(3deg) translate3d(0, 0, 0);
  }

  50% {
    transform: rotate(-3deg) translate3d(0, 0, 0);
  }

  75% {
    transform: rotate(1deg) translate3d(0, 0, 0);
  }

  100% {
    transform: rotate(0deg) translate3d(0, 0, 0);
  }
}

@keyframes storm1261 {
  0% {
    transform: translate3d(0, 0, 0) translateZ(0);
  }

  25% {
    transform: translate3d(4px, 0, 0) translateZ(0);
  }

  50% {
    transform: translate3d(-3px, 0, 0) translateZ(0);
  }

  75% {
    transform: translate3d(2px, 0, 0) translateZ(0);
  }

  100% {
    transform: translate3d(0, 0, 0) translateZ(0);
  }
}

#butonasiento {
  border: 1px solid;
  overflow: hidden;
  position: relative;
}

#butonasiento span {
  z-index: 20;
}

#butonasiento:after {
  content: "";
  height: 155px;
  left: -75px;
  opacity: 0.4;
  position: absolute;
  top: -50px;
  transform: rotate(35deg);
  transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
  width: 50px;
  z-index: -10;
}

#butonasiento:hover:after {
  left: 120%;
  transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
}
.numero-asiento{
  display: grid;
  justify-content: center;
  align-items: center;
}

.content-button{
  display: grid;
  width : 100px;
  height:100px;
}
</style>