<template>
  <div>
    <div class="contenedor">
      <h1 class="titulocli">VENDEDORES</h1>
      <div class="linea"></div>
    </div>
    <div class="botongregar">
      <q-btn class="butoagre" label="Añadir" color="primary" @click="agregar()" />
    </div>
    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
          <q-toolbar-title>Vendedores</q-toolbar-title>
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
          <button @click="useVendedor.agregarNuevoVendedor(data); toolbar = false">Enviar</button>
        </q-card-section>
      </q-card>
    </q-dialog>

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
import {useVendedorStore} from '../stores/vendedor.js'

</script>

<style scoped>

</style>