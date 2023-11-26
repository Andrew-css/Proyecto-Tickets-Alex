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
  let vendedorId = ref("");
  let nombreVendedor = ref("");
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
      const x = insertarToken();
      if (!x) return null;
      const response = await x.post(
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
      const x = insertarToken();
      if (!x) return null;
      const response = await x.put(
        `https://transporte-el2a.onrender.com/api/vendedor/editar/${id}`,
        data
      );
      estatus.value = response.status
      const index = rows.value.findIndex((v) => v._id === id);
      if (index !== -1) {
        rows.value.splice(index, 1, response.data.vendedor);
      }
      console.log("Respuesta del servidor al actualizar vendedor:", response);
    } catch (error) {
      console.log("Error al actualizar vendedor:", error);
      errorvalidacion.value = error.response.data.error;
    }
  };

  const obtenerVendedores = async () => {
    try {
      const x = insertarToken();
      if (!x) return null;

      const response = await x.get("https://transporte-el2a.onrender.com/api/vendedor/all");
      rows.value = response.data.vendedor;
      console.log(response)
    } catch (error) {
      console.log("Error al obtener vendedores:", error);
    }
  };

  const activar = async (id) => {
    try {
      const x = insertarToken();
      if (!x) return null;

      const response = await x.put(
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
      const x = insertarToken();
      if (!x) return null;
      const response = await x.put(
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
        console.log("Hola soy respuesta login", response)
        localStorage.setItem('vendedorId', response.data.vendedor._id);
        localStorage.setItem('nombreVendedor', response.data.vendedor.nombre);
        vendedorId.value = response.data.vendedor._id
        nombreVendedor.value = response.data.vendedor.nombre
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



  function insertarToken() {
    const token = localStorage.getItem("x-token");

    if (!token) return false

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
      if (!x) return null

      const response = await x.get(`https://transporte-el2a.onrender.com/api/vendedor/all`);
      return response.data;
    } catch (error) {
      console.error(error);
      return error.response.data;
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
    obtener,
    vendedorId,
    nombreVendedor,
  };
});