import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useClienteStore = defineStore("cliente", () => {
  const rows = ref([]);
  let id = ref("");
  let nombre = ref("");
  let cedula = ref("");
  let email = ref("");
  
  let cambiar = ref(false);
  let errorvalidacion = ref("")
  let estatus = ref()


  const agregarNuevoCliente = async (data) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.post(
        "https://transporte-el2a.onrender.com/api/cliente/guardar",
        data
      );
      console.log("Respuesta del servidor al agregar nuevo cliente:", response);
      rows.value.unshift(response.data.cliente);
      estatus.value = response.status
    } catch (error) {
      console.log("e", error);
      errorvalidacion.value = error.response.data.error
    }

  };


  const actualizarCliente = async (id, data) => {
    const x = insertarToken();
    if (!x) return null;
    console.log("Hola soy data", data);
    try {
      const response = await x.put(
        `https://transporte-el2a.onrender.com/api/cliente/editar/${id}`,
        data
      );
      const buscar = rows.value.findIndex((r) => r._id == id);
      rows.value.splice(buscar, 1, response.data.cliente);
      console.log("r", response);
      estatus.value = response.status
    } catch (error) {
      console.log("e", error);
      errorvalidacion.value = error.response.data.error
    }

  
  };


  const obtenerClientes = async () => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const clientes = await x.get(
        "https://transporte-el2a.onrender.com/api/cliente/all"
      );
      rows.value = clientes.data.cliente;
    } catch (error) {
      console.log("e", error);
    }
  };

  const activado = ref(false);

  const activar = async (id) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const cliente = await x.put(
        `https://transporte-el2a.onrender.com/api/cliente/activar/${id}`
      );
      console.log(cliente);
      if (cliente) {
        const buscar = rows.value.findIndex((r) => r._id == id);
        rows.value.splice(buscar, 1, cliente.data.cliente);
        activado.value = false;
      }
    } catch (error) {
      console.log("e", error);
    }
  };

  const desactivar = async (id) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const cliente = await x.put(
        `https://transporte-el2a.onrender.com/api/cliente/inactivar/${id}`
      );
      console.log(cliente);
      if (cliente) {
        const buscar = rows.value.findIndex((r) => r._id == id);
        rows.value.splice(buscar, 1, cliente.data.cliente);
        activado.value = true;
      }
      return cliente;
    } catch (error) {
      console.log("e", error);
    }
  };

  function insertarToken(){
    const token = localStorage.getItem("x-token");

    if(!token) return false

    const axiosInstance = axios.create({
      headers: {
        'x-token': token
      }
    });

    return axiosInstance
  }


  const obtener = async () => {
    try {
      const x = insertarToken()
      if(!x) return null

      const response = await x.get(`https://transporte-el2a.onrender.com/api/cliente/all`);
      return response.data;
    } catch (error) {
      console.error(error);
      return error.response.data;
    }
  };

  return {
    agregarNuevoCliente,
    actualizarCliente,
    activar,
    desactivar,
    obtenerClientes,
    rows,
    errorvalidacion,
    estatus,
    obtener,
  };
});
