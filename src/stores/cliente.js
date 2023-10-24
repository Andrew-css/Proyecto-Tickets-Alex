import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useClienteStore = defineStore("cliente", () => {
  const rows = ref([]);
  let id = ref("");
  let nombre = ref("");
  let cedula = ref("");
  let email = ref("");
  let toolbar = ref(false);
  let cambiar = ref(false);


  const agregarNuevoCliente = async (data) => {
    try {
      const response = await axios.post(
        "https://transporte-el2a.onrender.com/api/cliente/guardar",
        data
      );
      console.log("Respuesta del servidor al agregar nuevo cliente:", response);
      rows.value.push(response.data.cliente);
    } catch (error) {
      console.log("e", error);
    }
    toolbar.value = false;
  };


  const actualizarCliente = async (id, data) => {

    console.log("Hola soy data", data);
    try {
      const response = await axios.put(
        `https://transporte-el2a.onrender.com/api/cliente/editar/${id}`,
        data
      );
      const buscar = rows.value.findIndex((r) => r._id == id);
      rows.value.splice(buscar, 1, response.data.cliente);
      console.log("r", response);
    } catch (error) {
      console.log("e", error);
    }

    toolbar.value = false;
  };


  const obtenerClientes = async () => {
    try {
      const clientes = await axios.get(
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
      const cliente = await axios.put(
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
      const cliente = await axios.put(
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

  return {
    agregarNuevoCliente,
    actualizarCliente,
    activar,
    desactivar,
    obtenerClientes,
    rows,
  };
});
