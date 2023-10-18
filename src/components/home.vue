<template>
  <q-layout view="hhh LpR fFf">

    <q-page-container>
      <div class="lcare">
        <div class="card-info">Cerar sesion</div>
        <div class="card-info">Conductores</div>
        <div class="card-info">Vendedores</div>
        <div class="card-info">Vehiculos</div>
        <div class="card-info"><router-link class="router" to="/cliente" ><img src="../assets/home-lineal-colored.png" alt="">Clientes</router-link>
        
        </div>
        <div class="card-info">Rutas</div>
        <div class="card-info">Ticketes</div>
        <div class="card-info">Ventas</div>
      </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>

img{
  width:200px ;
  height: 200px;
}

.cont {
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

button{
  width:100% ;
  height: 50px;
}
.router{
  width:100% ;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.lcare {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columnas iguales */
  gap: 10px; /* Espacio entre las tarjetas */
  margin: 100px;
  padding: 100px;
}
.card-info {
  box-sizing: border-box;
  width: 250px;
  height: 254px;
  background: rgba(217, 217, 217, 0.58);
  border: 1px solid #ccc;
  backdrop-filter: blur(6px);
  border-radius: 17px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s;
  display: flex;
  flex-direction:column-reverse;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-weight: bolder;
  color: black;
  padding: 10px; /* Espaciado interno de las tarjetas (opcional) */
  text-align: center; /* Alineación de texto al centro (opcional) */
}

.card-info:hover {
  border: 1px solid black;
  transform: scale(1.05);
}

.card-info:active {
  transform: scale(0.95) rotateZ(1.7deg);
}
</style>

<script>
import { ref } from "vue";

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>
