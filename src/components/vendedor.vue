<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">VENDEDORES</h1>
      <div class="linea"></div>
    </div>
    <div class="botongregar">  </div>
      <!-- Button trigger modal -->
    
  <button type="button" class="  button " style="margin:0 auto;" data-bs-toggle="modal" data-bs-target="#staticBackdrop" @click="agregar()"> <span class="button__text">Añadir</span> <span class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span> >
</button>

<!-- Modal -->
<div class="modal fade " style="margin-top: 12%;" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
  <div class="modal-dialog">
    <div class="modal-content">

      <form class="form">
        
        <p class="title">Register </p>  
        <p class="message">Signup now and get full access to our app. </p>
            <div class="flex">
            <label>
                <input required="" placeholder="" type="text" class="input" v-model="nombre">
                <span>Nombre</span>
            </label>

            <label>
                <input required="" placeholder="" type="text" class="input"  v-model="apellido">
                <span>Apellido</span>
            </label>
        </div>  
          
        <label>
            <input required="" placeholder="" type="number" class="input" v-model="cedula">
            <span>Cedula</span>
        </label> 
      
        <label>
            <input required="" placeholder="" type="number" class="input" v-model="telefono">
            <span>Telefono</span>
        </label>
        <label>
            <input required="" placeholder="" type="text" class="input" v-model="usuario">
            <span>Usuario</span>
        </label>
        <label>
            <input required="" placeholder="" type="text" class="input" v-model="contrasena">
            <span>contraseña</span>
        </label>
        <button  data-bs-dismiss="modal"  @click="useVendedor.agregarNuevoVendedor(data); toolbar = false" class="submit">Enviar</button>
      </form>
      
    </div>
  </div>
</div>
    

    <q-dialog v-model="toolbard">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
          <q-toolbar-title>Editar Vendedor</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <label for="">Nombre: </label><br />
          <input type="text" v-model="nombre" />
          <br />
          <label for="">Apellido: </label><br />
          <input type="text" v-model="apellido" />
          <br />
          <label for="">Cedula: </label><br />
          <input type="number" v-model="cedula" />
          <br />
          <label for="">Teléfono: </label><br />
          <input type="tel" v-model="telefono" />
          <br />
          <label for="">Usuario: </label><br />
          <input type="text" v-model="usuario" />
          <br />
          <label for="">Contraseña: </label><br />
          <input type="password" v-model="contrasena" />
          <br />
          <label for="">Estado: </label><br />
          <p
            :class="{ 'text-right': true, activo: estado === 1, inactivo: estado === 0 }"
          >
            {{ obtenerTextoEstado(estado) }}
          </p>
          <button @click="useVendedor.actualizarVendedor(id, data); toolbard = false">Enviar</button>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-xl">
      <q-table
        class="text-center"
        :rows="rows"
        :columns="columns"
        row-key="id"
      >
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
              <div class="text-center">{{ props.row.usuario }}</div>
            </q-td>
            <q-td auto-width>
              <div
                :class="{
                  'text-center': true,
                  activo: props.row.estado === 1,
                  inactivo: props.row.estado === 0
                }"
              >
                {{ obtenerTextoEstado(props.row.estado) }}
              </div>
            </q-td>
            <q-td auto-width>
              <q-btn
                label="📋"
                color="primary"
                @click="editar(props.row)"
              />
              <q-btn
                label="✅"
                color="primary"
                @click="useVendedor.activar(props.row._id)"
                v-if="props.row.estado === 0"
              />
              <q-btn
                label="❌"
                color="primary"
                @click="useVendedor.desactivar(props.row._id)"
                v-if="props.row.estado === 1"
              />
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
let toolbard = ref(false);
let toolbar = ref(false);
let cambiar = ref(false);
const data = ref({
  nombre: nombre,
  apellido: apellido,
  cedula: cedula,
  telefono: telefono,
  usuario: usuario,
  contrasena: contrasena,
});

const editar = (row) => {
  toolbard.value = true;
  id.value = row._id;
  cambiar.value = true;
  nombre.value = row.nombre;
  apellido.value = row.apellido;
  cedula.value = row.cedula;
  telefono.value = row.telefono;
  usuario.value = row.usuario;
  contrasena.value = row.contrasena;
  estado.value = row.estado;
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
    name: "Usuario",
    label: "Usuario",
    align: "center",
    field: (row) => row.usuario,
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
  toolbar.value = true;
  nombre.value = "";
  apellido.value = "";
  cedula.value = "";
  telefono.value = "";
  usuario.value = "";
  contrasena.value = "";
};

async function obtenerVendedor() {
  try {
    await useVendedor.obtenerVendedores();
    vendedores.value = useVendedor.rows;
    rows.value = useVendedor.rows;
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
.contenedor{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.linea{
  background-color: #1976d2;
  width: 50%;
  height: 5px;
}
.titulocli{
  font-size: 45px;
  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.botongregar{
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.butoagre{
  margin-right: 47px;
  margin-bottom: 0px;
  margin-top: 0px;
}
.q-pa-xl{
  padding: 10px 48px 48px 48px;
}

.q-card{
  width: 60%;
  height: 60%;
  display: grid;
  grid-template-rows: 10% 90%;
}

.q-card__section{
  display: flex;
  flex-direction: column;
}

.butonenviar{
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

.button, .button__icon, .button__text {
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
  border: 1px solid #1976d2 ;
}


/* FORMULARIO */

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

.title::before,.title::after {
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

.message, .signin {
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

.form label .input + span {
  position: absolute;
  left: 10px;
  top: 15px;
  color: grey;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
}

.form label .input:placeholder-shown + span {
  top: 15px;
  font-size: 0.9em;
}

.form label .input:focus + span,.form label .input:valid + span {
  top: 30px;
  font-size: 0.7em;
  font-weight: 600;
}

.form label .input:valid + span {
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
</style>