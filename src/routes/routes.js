import Clientes from '../components/cliente.vue'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Menu from '../components/menu.vue'
import Vendedor from '../components/vendedor.vue'
import Conductor from '../components/conductor.vue'
/* import Rutas from "../components/rutas.vue"
import Login from "../components/login.vue" */
import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {path: "/", component: Login},
    {path: "/menu",component: Menu,
    children: [
      { path: "", redirect: "/menu" },
      { path: "/home", component: Home },
      { path: "/cliente", component: Clientes },
      { path: "/vendedor", component: Vendedor },
      {path: "/conductor", component:Conductor}

      

    ]}
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})