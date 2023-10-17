<template>
    <div>
      <q-btn label="Añadir" color="primary" @click="agregar()" />
      <q-dialog v-model="toolbar">
        <q-card>
          <q-toolbar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
            </q-avatar>
  
            <q-toolbar-title>Agregar cliente</q-toolbar-title>
  
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
  
          <q-card-section>
            <label for="">Nombre: </label><br />
            <input type="text" v-model="nombre" />
            <br />
            <label for="">Cedula: </label><br />
            <input type="number" v-model="cedula" />
            <br />
            <label for="">Email: </label><br />
            <input type="text" v-model="email" /><br />
            <label for="">Estado: </label><br />
            <input type="number" v-model="estado" /><br />
            <button @click="agregarcliente()">Enviar</button>
          </q-card-section>
        </q-card>
      </q-dialog>
  
      <div class="q-pa-md">
        <q-markup-table>
          <thead>
            <tr>
              <th><h4 class="q-ma-xs text-left">Clientes</h4></th>
            </tr>
            <tr>
              <th class="text-left"><b>Nombre</b></th>
              <th class="text-right"><b>Cedula</b></th>
              <th class="text-right"><b>Email</b></th>
              <th class="text-right"><b>Estado</b></th>
              <th class="text-right"><b>Opciones</b></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in useClienteStore.rows" :key="i">
              <td class="text-left">{{ row.nombre }}</td>
              <td class="text-right">{{ row.cedula }}</td>
              <td class="text-right">{{ row.email }}</td>
              <td class="text-right">{{ row.estado }}</td>
              <td class="text-right">
                <q-btn label="Editar" color="primary" @click="editar(row)" />
                <q-btn
                  label="Activar"
                  color="primary"
                  @click="activar(row._id)"
                  v-if="row.estado==0"
                />
                <q-btn
                  label="Desactivar"
                  color="primary"
                  @click="desactivar(row._id)"
                  v-if="row.estado==1"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </template>


<script setup>
import { useClienteStore } from '../stores/cliente.js';
import {ref} from 'vue'

const columns = ref([
        {
          name: "Nombre",
          label: "Nombre",
          align: "left",
          field: (row) => row.nombre,
        },
        {
          name: "Cedula",
          label: "Cedula",
          field: (row) => row.cedula,
        },
        {
          name: "Email",
          label: "Email",
          field: (row) => row.email,
        },
        {
          name: "Estado",
          label: "Estado",
          field: (row) => row.estado,
        },
        {
          name: "Opciones",
          label: "Opciones",
          field: "actions",
        },
      ]);
      


  


</script>

<style scoped>
</style>