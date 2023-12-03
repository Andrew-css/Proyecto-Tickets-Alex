<template>
  <div class="body">
     <body class="bg" >
     <div class="background">
         <div class="shape"></div>
         <div class="shape"></div>
     </div>
     <form>
         <h3>CityExpress</h3>
 
         <label for="typeEmailX">Usuario</label>
         <input  v-model="usuario" type="text" placeholder="Digite aquí el usuario" id="typeEmailX">
 
         <label for="typePasswordX">Contraseña</label>
         <input v-model="contrasena" type="password" placeholder="Digite aquí la contraseña" id="typePasswordX">
         <div v-if="loading" class="text-center">
                     <q-spinner-hourglass color="primary" size="50px" />
                     <p>Por favor, espere...</p>
         </div>
 
         <router-link to=""><button @click="login">Ingresar</button></router-link>
         <p style="color: red; font-weight: bold;"> {{ useVendedor.errorvalidacion }}</p>
        
     </form>
   </body>
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
 const loading = ref(false);
 
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
     }, 4500);
     return; // Detén la función para evitar la solicitud vacía
   }
   loading.value = true;
   const response = await useVendedor.loginRequest(usuario, contrasena);
   if (response.success) {
     // El inicio de sesión fue exitoso, redirige al usuario a la página de inicio
     // o realiza cualquier acción necesaria.
     loading.value = false;
     router.push("/home");
     console.log("Hola soy vendedor", response)
     console.log("Hola soy nombre vendedor", response.user._id)
     localStorage.setItem("x-token", response.token)
   } else {
     console.log("Error de inicio de sesión");
     // Muestra el mensaje de error y luego desaparece después de 2 segundos
     setTimeout(() => {
       useVendedor.errorvalidacion = "";
       loading.value = false;
     }, 4500);
   }
 }
 </script>
   
   
   
 <style scoped>
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
 body {
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
 
 *:before,
 *:after{
     padding: 0;
     margin: 0;
     box-sizing: border-box;
 }
 .bg{
   background-color: black;
 }
 body{
     background-color: #080710;
 }
 
 .background{
     width: 430px;
     height: 520px;
     position: absolute;
     transform: translate(-50%,-50%);
     left: 50%;
     top: 50%;
 }
 .background .shape{
     height: 200px;
     width: 200px;
     position: absolute;
     border-radius: 50%;
 }
 .shape:first-child{
     background: linear-gradient(
         #1845ad,
         #23a2f6
     );
     left: -80px;
     top: -80px;
 }
 .shape:last-child{
     background: linear-gradient(
         to right,
         #ff512f,
         #f09819
     );
     right: -30px;
     bottom: -80px;
 }
 form{
     height: 580px;
     width: 400px;
     background-color:#000000;
     
     position: absolute;
     transform: translate(-50%,-50%);
     top: 50%;
     left: 50%;
     border-radius: 10px;
     backdrop-filter: blur(10px);
     border: 2px solid rgba(255,255,255,0.1);
     box-shadow: 0 0 40px rgba(8,7,16,0.6);
     padding: 50px 35px;
 }
 form *{
     font-family: 'Poppins',sans-serif;
     color: #ffffff;
     letter-spacing: 0.5px;
     outline: none;
     border: none;
 }
 form h3{
     font-size: 32px;
     font-weight: 500;
     line-height: 42px;
     text-align: center;
 }
 
 label{
     display: block;
     margin-top: 30px;
     font-size: 16px;
     font-weight: 500;
 }
 input{
     display: block;
     height: 50px;
     width: 100%;
     background-color: rgba(255,255,255,0.07);
     border-radius: 3px;
     padding: 0 10px;
     margin-top: 8px;
     font-size: 14px;
     font-weight: 300;
 }
 ::placeholder{
     color: #e5e5e5;
 }
 button{
     margin-top: 60px;
     width: 100%;
     background-color: #ffffff;
     color: #080710;
     padding: 15px 0;
     font-size: 18px;
     font-weight: 600;
     border-radius: 5px;
     cursor: pointer;
 }
 
 </style>