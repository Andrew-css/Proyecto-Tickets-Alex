<template>
  <q-layout view="hhh LpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
      <div class="container-info">
        <div class="cont">
          <img src="../assets/perfil.jpeg" alt="">
          
        </div>
        <h5 class="user">Usuario</h5>
        <h5 class="user">Administrativo</h5>
      </div>
      <div class="btns-m">
        <button class="btn-17">
          <span class="text-container">
            <span class="text">Home</span>
          </span>
        </button>

        <button class="btn-17">
          <span class="text-container">
            <span class="text">Conducto</span>
          </span>
        </button>

        <button class="btn-17">
          <span class="text-container">
            <span class="text">Vendedor</span>
          </span>
        </button>

        <button class="btn-17">
          <span class="text-container">
            <span class="text">Vehiculo</span>
          </span>
        </button>

        <button class="btn-17">
          <span class="text-container">
            <span class="text">Cliente</span>
          </span>
        </button>

        <button class="btn-17">
          <span class="text-container">
            <span class="text">Rutas</span>
          </span>
        </button>

        <button class="btn-17">
          <span class="text-container">
            <span class="text">Tiquete</span>
          </span>
        </button>
     
        <button class="btn-17">
          <span class="text-container">
            <span class="text">Ventas</span>
          </span>
        </button>

      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

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

<style>
.user{
    justify-content: center;
    align-items: center;
    display: flex;
}

.cont{
    align-items: center;
    justify-content: center;
    display: flex;
}
.btns-m{
  margin: 25px;  
  margin-top: 80px;
}

.btn-17,
.btn-17 *,
.btn-17 :after,
.btn-17 :before,
.btn-17:after,
.btn-17:before {
  border: 0 solid;
  box-sizing: border-box;
}

.btn-17 {
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: button;
  background-color: #000;
  background-image: none;
  color: #fff;
  cursor: pointer;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
    Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  font-size: 100%;
  font-weight: 900;
  line-height: 1.5;
  margin: 0;
  -webkit-mask-image: -webkit-radial-gradient(#000, #fff);
  padding: 0;
  text-transform: uppercase;
}

.btn-17:disabled {
  cursor: default;
}

.btn-17:-moz-focusring {
  outline: auto;
}

.btn-17 svg {
  display: block;
  vertical-align: middle;
}

.btn-17 [hidden] {
  display: none;
}

.btn-17 {
  border-radius: 99rem;
  border-width: 2px;
  padding: 0.8rem 3rem;
  z-index: 0;
}

.btn-17,
.btn-17 .text-container {
  overflow: hidden;
  position: relative;
}

.btn-17 .text-container {
  display: block;
  mix-blend-mode: difference;
}

.btn-17 .text {
  display: block;
  position: relative;
}

.btn-17:hover .text {
  -webkit-animation: move-up-alternate 0.3s forwards;
  animation: move-up-alternate 0.3s forwards;
}

@-webkit-keyframes move-up-alternate {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(80%);
  }

  51% {
    transform: translateY(-80%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes move-up-alternate {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(80%);
  }

  51% {
    transform: translateY(-80%);
  }

  to {
    transform: translateY(0);
  }
}

.btn-17:after,
.btn-17:before {
  --skew: 0.2;
  background: #fff;
  content: "";
  display: block;
  height: 102%;
  left: calc(-50% - 50% * var(--skew));
  pointer-events: none;
  position: absolute;
  top: -104%;
  transform: skew(calc(150deg * var(--skew))) translateY(var(--progress, 0));
  transition: transform 0.2s ease;
  width: 100%;
}

.btn-17:after {
  --progress: 0%;
  left: calc(50% + 50% * var(--skew));
  top: 102%;
  z-index: -1;
}

.btn-17:hover:before {
  --progress: 100%;
}

.btn-17:hover:after {
  --progress: -102%;
}
</style>
