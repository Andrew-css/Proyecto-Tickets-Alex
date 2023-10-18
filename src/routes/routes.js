import Clientes from '../components/cliente.vue'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Menu from '../components/menu.vue'
/* import Rutas from "../components/rutas.vue"
import Login from "../components/login.vue" */
import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {path: "/", component: Login},
    {path: "/menu",component: Menu,
    children: [
      { path: "", redirect: "/menu" },
      { path: "/home", component: Home },
      { path: "/cliente", component: Clientes }
    ]}
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})