import Clientes from '../components/cliente.vue'
/* import Rutas from "../components/rutas.vue"
import Login from "../components/login.vue" */
import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {path: "/", component:Clientes},
/*     {path:"/clientes", component:Clientes},
    {path:"/rutas", component:Rutas}, */
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})