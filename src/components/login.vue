<template>

  <div class="body">
    <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-dark text-white" style="border-radius: 1rem;">
            <div class="card-body p-5 text-center">
  
              <div class="mb-md-5 mt-md-4 pb-5">
  
                <h2 class="fw-bold mb-2 text-uppercase">INGRESA</h2>
                <p class="text-white-50 mb-5">Por favor digite su usuario y contraseña</p>
  
                <div class="form-outline form-white mb-4">
                  <input v-model="usuario" type="text" id="typeEmailX" style="color: black;font-weight: bold;" class="form-control form-control-lg" />
               
                  <label class="form-label" for="typeEmailX">Usuario</label>
                </div>
  
                <div class="form-outline form-white mb-4">
                  <input v-model="contrasena" type="password" id="typePasswordX" style="color: black;font-weight: bold;" class="form-control form-control-lg" />
                  <label class="form-label" for="typePasswordX">Contraseña</label>
                </div>
                <p style="color: red;"> {{ useVendedor.errorvalidacion }}</p>
                <p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">¿Olvidaste tu contraseña?</a></p>
  
                <router-link to=""><button class="btn btn-outline-light btn-lg px-5" type="submit" @click="login">Iniciar sesion</button></router-link>
  
                <div class="d-flex justify-content-center text-center mt-4 pt-1">
                  <a href="#!" class="text-white"><i class="fab fa-facebook-f fa-lg"></i></a>
                  <a href="#!" class="text-white"><i class="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                  <a href="#!" class="text-white"><i class="fab fa-google fa-lg"></i></a>
                </div>
  
              </div>
  
              <div>
                <p class="mb-0">¿Aún no tienes una cuenta? <a href="#!" class="text-white-50 fw-bold">Registrate</a>
                </p>
              </div>
  
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  </div>
  
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useVendedorStore } from '../stores/vendedor.js'
  import { router } from '../routes/routes.js';
  
  
  const useVendedor = useVendedorStore()
  const usuario = ref("")
  const contrasena = ref("")
  const leftDrawerOpen = ref(false)
  
  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  const login = async () => {
    // Verifica si los campos de usuario y contraseña no están vacíos
    if (usuario.value === '' || contrasena.value === '') {
      // Muestra un mensaje de error y luego desaparece después de 2 segundos
      useVendedor.errorvalidacion = "Por favor complete todos los campos.";
      setTimeout(() => {
        useVendedor.errorvalidacion = "";
      }, 2000);
      return; // Detén la función para evitar la solicitud vacía
    }

    const response = await useVendedor.loginRequest(usuario, contrasena);
    if (response.success) {
      // El inicio de sesión fue exitoso, redirige al usuario a la página de inicio
      // o realiza cualquier acción necesaria.
      router.push("/home");
    } else {
      console.log("Error de inicio de sesión");
      // Muestra el mensaje de error y luego desaparece después de 2 segundos
      setTimeout(() => {
        useVendedor.errorvalidacion = "";
      }, 2000);
    }
  }
  </script>
  
  
  
  <style>
  /* Cool infinite background scrolling animation.
   * Twitter: @kootoopas
   */
  /* Exo thin font from Google. */
  @import url(https://fonts.googleapis.com/css?family=Exo:100);
  /* Background data (Original source: https://subtlepatterns.com/grid-me/) */
  /* Animations */
  @-webkit-keyframes bg-scrolling-reverse {
    100% {
      background-position: 50px 50px;
    }
  }
  @-moz-keyframes bg-scrolling-reverse {
    100% {
      background-position: 50px 50px;
    }
  }
  @-o-keyframes bg-scrolling-reverse {
    100% {
      background-position: 50px 50px;
    }
  }
  @keyframes bg-scrolling-reverse {
    100% {
      background-position: 50px 50px;
    }
  }
  @-webkit-keyframes bg-scrolling {
    0% {
      background-position: 50px 50px;
    }
  }
  @-moz-keyframes bg-scrolling {
    0% {
      background-position: 50px 50px;
    }
  }
  @-o-keyframes bg-scrolling {
    0% {
      background-position: 50px 50px;
    }
  }
  @keyframes bg-scrolling {
    0% {
      background-position: 50px 50px;
    }
  }
  /* Main styles */
  .body {
    color: #999;
    font: 400 16px/1.5 exo, ubuntu, "segoe ui", helvetica, arial, sans-serif;
    text-align: center;
    /* img size is 50x50 */
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABnSURBVHja7M5RDYAwDEXRDgmvEocnlrQS2SwUFST9uEfBGWs9c97nbGtDcquqiKhOImLs/UpuzVzWEi1atGjRokWLFi1atGjRokWLFi1atGjRokWLFi1af7Ukz8xWp8z8AAAA//8DAJ4LoEAAlL1nAAAAAElFTkSuQmCC") repeat 0 0;
    -webkit-animation: bg-scrolling-reverse .92s infinite;
    /* Safari 4+ */
    -moz-animation: bg-scrolling-reverse .92s infinite;
    /* Fx 5+ */
    -o-animation: bg-scrolling-reverse .92s infinite;
    /* Opera 12+ */
    animation: bg-scrolling-reverse .92s infinite;
    /* IE 10+ */
    -webkit-animation-timing-function: linear;
    -moz-animation-timing-function: linear;
    -o-animation-timing-function: linear;
    animation-timing-function: linear;
  }
  .body::before {
    font-size: 8rem;
    font-weight: 100;
    font-style: normal;
  }

  
  </style>