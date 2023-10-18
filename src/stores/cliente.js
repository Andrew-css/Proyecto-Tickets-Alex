import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useClienteStore = defineStore("cliente", () => {
  const rows = ref([]);
  const id = ref("");
  const nombre = ref("");
  const cedula = ref("");
  const email = ref("");
  const estado = ref(1);
  const cambiar = ref(false);
  const toolbar = ref(false);

  const agregarcliente = async () => {
    if (cambiar.value) {
      const data = {
        id: id.value,
        nombre: nombre.value,
      };
      const buscar = rows.value.findIndex((r) => r._id == id.value);

      console.log(data);
      try {
        const response = await axios.put(
          `https://transporte-el2a.onrender.com/api/cliente/editar`,
          data
        );
        console.log("r", response);
        rows.value.splice(buscar, 1, response.data.cliente);
      } catch (error) {
        console.log("e", error);
      }
    } else {
      const data = {
        nombre: nombre.value,
        cedula: cedula.value,
        email: email.value,
      };
      try {
        const response = await axios.post(
          "https://transporte-el2a.onrender.com/api/cliente/guardar",
          data
        );
        rows.value.push(response.data.cliente);
      } catch (error) {
        console.log("e", error);
      }
    }

    toolbar.value = false;
  };
  function obtenerClientes(){
    const obtenerCliente = async () => {
      console.log("Esperando datos");
      try {
        const clientes = await axios.get(
          "https://transporte-el2a.onrender.com/api/cliente/all"
        );
        rows.value = clientes.data.cliente;
      } catch (error) {
        console.log("e", error);
      }
    };
  }
  


  const editar = (row) => {
    console.log(row);
    toolbar.value = true;
    id.value = row._id;
    cambiar.value = true;
    nombre.value = row.nombre;
    cedula.value = row.cedula;
    email.value = row.email;
    estado.value = row.estado;
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
    } catch (error) {
      console.log("e", error);
    }
  };

  return {
    agregarcliente, editar, activar, desactivar, obtenerClientes
  }
});
