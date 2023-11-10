import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useVendedorStore = defineStore("vendedor", () => {
  const rows = ref([]);
  let id = ref("");
  let nombre = ref("");
  let apellido = ref("");
  let cedula = ref("");
  let telefono = ref("");
  let usuario = ref("");
  let contrasena = ref("");
  let estado = ref(1);
  let toolbar = ref(false);
  let cambiar = ref(false);
  let errorvalidacion = ref("");
  let estatus = ref()
  const columns = ref([
    {
      name: "Nombre",
      label: "Nombre",
      align: "left",
      field: (row) => row.nombre,
    },
    {
      name: "Apellido",
      label: "Apellido",
      align: "left",
      field: (row) => row.apellido,
    },
    {
      name: "Cedula",
      label: "Cedula",
      field: (row) => row.cedula,
    },
    {
      name: "Teléfono",
      label: "Teléfono",
      field: (row) => row.telefono,
    },
    {
      name: "Usuario",
      label: "Usuario",
      field: (row) => row.usuario,
    },
    {
      name: "Estado",
      label: "Estado",
      field: (row) => row.estado,
    },
    {
      name: "Opciones",
      label: "Opciones",
      align: "left",
      field: "actions",
    },
  ]);

  const agregarNuevoVendedor = async (data) => {
    try {
      const response = await axios.post(
        "https://transporte-el2a.onrender.com/api/vendedor/guardar",
        data
      );
      console.log("Respuesta del servidor al agregar nuevo vendedor:", response);
      estatus.value = response.status
      rows.value.push(response.data.vendedor);
    } catch (error) {
      console.log("Error al agregar nuevo vendedor:", error);
      errorvalidacion.value = error.response.data.error
    }
    toolbar.value = false;
  };

  const actualizarVendedor = async (id, data) => {
    try {
      const response = await axios.put(
        `https://transporte-el2a.onrender.com/api/vendedor/editar/${id}`,
        data
      );
      const index = rows.value.findIndex((v) => v._id === id);
      if (index !== -1) {
        rows.value.splice(index, 1, response.data.vendedor);
      }
      toolbar.value = false;
      console.log("Respuesta del servidor al actualizar vendedor:", response);
    } catch (error) {
      console.log("Error al actualizar vendedor:", error);
    }
  };

  const obtenerVendedores = async () => {
    try {
      const response = await axios.get("https://transporte-el2a.onrender.com/api/vendedor/all");
      rows.value = response.data.vendedor;
      console.log(response)
    } catch (error) {
      console.log("Error al obtener vendedores:", error);
    }
  };

  const activar = async (id) => {
    try {
      const response = await axios.put(
        `https://transporte-el2a.onrender.com/api/vendedor/activar/${id}`
      );
      const index = rows.value.findIndex((v) => v._id === id);
      if (index !== -1) {
        rows.value.splice(index, 1, response.data.vendedor);
      }
      console.log("Respuesta del servidor al activar vendedor:", response);
    } catch (error) {
      console.log("Error al activar vendedor:", error);
    }
  };

  const desactivar = async (id) => {
    try {
      const response = await axios.put(
        `https://transporte-el2a.onrender.com/api/vendedor/inactivar/${id}`
      );
      const index = rows.value.findIndex((v) => v._id === id);
      if (index !== -1) {
        rows.value.splice(index, 1, response.data.vendedor);
      }
      console.log("Respuesta del servidor al desactivar vendedor:", response);
    } catch (error) {
      console.log("Error al desactivar vendedor:", error);
    }
  };

  const loginRequest = async (usuario, contrasena) => {
    try {
      const response = await axios.post("https://transporte-el2a.onrender.com/api/vendedor/login", {
        usuario: usuario.value, 
        contrasena: contrasena.value,
      });
  
      if (response.status === 200) {
        return {
          success: true,
          user: response.data.vendedor,
          token: response.data.token,
        };
      }
     
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      errorvalidacion.value = error.response.data.msg
      console.log("Error backend", errorvalidacion)
      return {
        success: false,
      };
    }
  };
  

  return {
    agregarNuevoVendedor,
    actualizarVendedor,
    activar,
    desactivar,
    obtenerVendedores,
    loginRequest,
    errorvalidacion,
    estatus,
    rows,
  };
});