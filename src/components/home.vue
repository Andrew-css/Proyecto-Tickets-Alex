<template>
  <q-layout view="hhh LpR fFf">

    <q-page-container>
      <div class="lcare">
        <div class="card-info"><router-link class="router" to="/conductor" ><img src="../assets/hombre-conduciendo.png" alt=""></router-link>Conductores</div>
        <div class="card-info"><router-link class="router" to="/vendedor" ><img src="../assets/vende.png" alt=""></router-link>Vendedores</div>
        <div class="card-info"><router-link class="router" to="/bus" ><img src="../assets/bus.png" alt=""></router-link> Vehiculos</div>
        <div class="card-info"><router-link class="router" to="/cliente" ><img src="../assets/servicio-al-cliente.png" alt=""></router-link>Clientes</div>
        <div class="card-info"><router-link class="router" to="/ruta" ><img src="../assets/ruta.png" alt=""></router-link>Rutas</div>
        <div class="card-info"><router-link class="router" to="/tiquete" ><img src="../assets/factura.png" alt=""></router-link>Ticketes</div>
        <div class="card-info"><router-link class="router" to="/ventas" ><img src="../assets/carrito-de-compras.png" alt=""></router-link>Ventas</div>
        <div class="card-info"><router-link class="router" to="/ciudad" ><img src="../assets/ciudadela.png" alt=""></router-link>Ciudad</div>

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
  width:100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.lcare {
  display: flex;
  gap: 30px;
  margin: 100px;
  padding: 100px 150px;
  flex-wrap: wrap;
  justify-content: center;
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
