<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">TIQUETES</h1>
      <div class="linea"></div>
    </div>
    <div v-if="loading" class="text-center">
    <q-spinner-hourglass color="primary" size="70px" />
    <h6>Por favor, espere...</h6>
    </div>

    <q-dialog v-model="mostrarModalTiquete" position="top">
        <div class="modal fade" style="margin-top: 12%;" id="staticBackdrop" data-bs-backdrop="static"
          data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" ref="addClientModal">
          <div class="modal-dialog">
            <div class="modal-content">
              <form class="form">
                <div class="cerrar">
                  <p class="title">Información tiquete</p>
                  <button type="button" data-bs-dismiss="modal" @click="cerrar()" class="row justify-center items-center"
                    id="botoncerrar">❌</button>
                </div>
                <div v-if="loading" class="text-center">
                  <q-spinner-hourglass color="primary" size="50px" />
                  <p>Por favor, espere...</p>
                </div>
                <p><strong>FECHA VENTA:</strong> {{ fecha_venta }}</p>
                <p><strong>FECHA SALIDA:</strong> {{ fecha_salida }}</p>
                <p><strong>C.C PASAJERO:</strong> {{ cedula }}</p>
                <p><strong>NOMBRE:</strong> {{ cliente }}</p>
                <p><strong>EMAIL:</strong> {{ email }}</p>
                <p><strong>VEHICULO:</strong> {{ vehiculo }}</p>
                <p><strong>ORIGEN:</strong> {{ origen }}</p>
                <p><strong>DESTINO:</strong> {{ destino }}</p>
                <p><strong>NUM SILLA:</strong> {{ num_asiento }}</p>
                <p><strong>VALOR:</strong> {{ valor }}</p>

                <!-- Resto del contenido del formulario... -->

                <button type="button" @click="cerrar()" class="submit">Aceptar</button>
              </form>
            </div>
          </div>
        </div>
    </q-dialog>

    <div class="q-pa-xl">
      <q-table class="text-center" :rows="rows" :columns="columns" row-key="id">
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title class="text-center">Tiquetes</q-toolbar-title>
          </q-toolbar>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="q-ma-xs text-center">{{ props.row.vendedor.nombre }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.ruta.ciudad_origen.nombre + ' / ' +
                props.row.ruta.ciudad_destino.nombre }}</div>
            </q-td>

            <q-td auto-width>
              <div class="text-center">{{ props.row.cliente.nombre }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.fecha_salida }}</div>
            </q-td>
            <q-td auto-width>
              <div class="text-center">{{ props.row.num_asiento }}</div>
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
              <q-btn label="🎫" color="primary" @click="editar(props.row)" data-bs-toggle="modal"
                data-bs-target="#editClientModal" />
              <q-btn label="✅" color="primary" @click="useTiquete.activar(props.row._id)" v-if="props.row.estado === 0" />
              <q-btn label="❌" color="primary" @click="useTiquete.desactivar(props.row._id)"
                v-if="props.row.estado === 1" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { useTiqueteStore } from "../stores/tiquete.js";
import { onMounted, ref } from "vue";

const useTiquete = useTiqueteStore();
let rows = ref([]);
let tiquetes = ref([]);
let id = ref("");
let fecha_venta = ref("");
let fecha_salida = ref("");
let cedula = ref("");
let cliente = ref("");
let email = ref("");
let vehiculo = ref("");
let origen = ref("");
let destino = ref("");
let num_asiento = ref("");
let valor = ref("");
let estado = ref(1);
let loading = ref(false);
let mostrarModalTiquete = ref(false)
let mensaje = ref('');
let mensajeColor = ref(''); 

const editar = (row) => {
  console.log(row);
  id.value = row._id;
  fecha_venta.value = row.fecha_salida;
  fecha_salida.value = row.ruta.hora_salida;
  cedula.value = row.cliente.cedula;
  cliente.value = row.cliente.nombre;
  email.value = row.cliente.email;
  vehiculo.value = row.ruta.bus.placa
  origen.value = row.ruta.ciudad_origen.nombre
  destino.value = row.ruta.ciudad_destino.nombre
  num_asiento.value = row.num_asiento
  valor.value = row.ruta.valor
  mostrarModalTiquete.value = true
};

const cerrar = () => {
  mostrarModalTiquete.value = false
};

const columns = ref([
  {
    name: "Vendedor",
    label: "Vendedor",
    align: "center",
    field: (row) => row.vendedor.nombre,
  },
  {
    name: "Ruta",
    label: "Ruta",
    align: "center",
    field: (row) => `${row.ruta.ciudad_origen.nombre} - ${row.ruta.ciudad_destino.nombre}`,
  },
  {
    name: "Cliente",
    label: "Cliente",
    align: "center",
    field: (row) => row.cliente.nombre,
  },
  {
    name: "Fecha Salida",
    label: "Fecha Venta",
    align: "center",
    field: (row) => row.fecha_salida,
  },
  {
    name: "Num Asiento",
    label: "Num Asiento",
    align: "center",
    field: (row) => row.num_asiento,
  },
  {
    name: "d",
    label: "Opciones",
    field: "actions",
    align: "center",
  },
]);




async function obtenerTiquete() {
  loading.value = true
  try {
    await useTiquete.obtenerTiquetes();
    tiquetes.value = useTiquete.rows;
    rows.value = useTiquete.rows.reverse();
    loading.value = false
  } catch (error) {
    console.log(error);
  }
}

async function desactivarTiquete(id) {
  await useTiquete.desactivar(id);
  obtenerTiquete();
}

async function activarTiquete(id) {
  await useTiquete.activar(id);
  obtenerTiquete();
}

const obtenerTextoEstado = (estado) => {
  return estado === 1 ? "Activo" : "Inactivo";
};


onMounted(async () => {
  obtenerTiquete();
  desactivarTiquete();
  activarTiquete();
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

