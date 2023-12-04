import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useCiudadStore = defineStore("ciudad", () => {
  const rows = ref([]);
  let id = ref("");
  let nombre = ref("");

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
      name: "Opciones",
      label: "Opciones",
      field: "actions",
    },
  ]);

  const agregarNuevaCiudad = async (data) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.post(
        "https://transporte-el2a.onrender.com/api/ciudad/guardar",
        data
      );
      console.log("Respuesta del servidor al agregar nueva ciudad:", response);
      rows.value.unshift(response.data);
      estatus.value = response.status;
    } catch (error) {
      console.log("Error al agregar nueva ciudad:", error);
      errorvalidacion.value = error.response.data.error
    }
  };

  const actualizarCiudad = async (id, data) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.put(
        `https://transporte-el2a.onrender.com/api/ciudad/editar/${id}`,
        data
      );
      const index = rows.value.findIndex((c) => c._id === id);
      if (index !== -1) {
        rows.value[index] = response.data;
      }
      console.log("Respuesta del servidor al actualizar ciudad:", response);
      estatus.value = response.status
    } catch (error) {
      console.log("Error al actualizar ciudad:", error);
      errorvalidacion.value = error.response.data.error;
    }
  };

  const obtenerCiudades = async () => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const ciudadesData = await x.get(
        "https://transporte-el2a.onrender.com/api/ciudad/all"
      );
      rows.value = ciudadesData.data;
      console.log(ciudadesData);
    } catch (error) {
      console.log("Error al obtener ciudades:", error);
    }
  };

  const activar = async (id) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.put(
        `https://transporte-el2a.onrender.com/api/ciudad/activar/${id}`
      );
      const index = rows.value.findIndex((c) => c._id === id);
      if (index !== -1) {
        rows.value[index] = response.data;
      }
      console.log("Respuesta del servidor al activar ciudad:", response);
    } catch (error) {
      console.log("Error al activar ciudad:", error);
    }
  };

  const desactivar = async (id) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.put(
        `https://transporte-el2a.onrender.com/api/ciudad/inactivar/${id}`
      );
      const index = rows.value.findIndex((c) => c._id === id);
      if (index !== -1) {
        rows.value[index] = response.data;
      }
      console.log("Respuesta del servidor al desactivar ciudad:", response);
    } catch (error) {
      console.log("Error al desactivar ciudad:", error);
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

      const response = await x.get(`https://transporte-el2a.onrender.com/api/ciudad/all`);
      return response.data;
    } catch (error) {
      console.error(error);
      return error.response.data;
    }
  };

  return {
    agregarNuevaCiudad,
    actualizarCiudad,
    obtenerCiudades,
    activar,
    desactivar,
    rows,
    errorvalidacion,
    estatus,
    obtener,
  };
});
