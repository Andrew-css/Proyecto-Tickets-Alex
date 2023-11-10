import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useCiudadStore = defineStore("ciudad", () => {
  const rows = ref([]);
  let id = ref("");
  let nombre = ref("");
  let toolbar = ref(false);
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
      const response = await axios.post(
        "https://transporte-el2a.onrender.com/api/ciudad/guardar",
        data
      );
      console.log("Respuesta del servidor al agregar nueva ciudad:", response);
      estatus.value = response.status
      rows.value.push(response.data);
    } catch (error) {
      console.log("Error al agregar nueva ciudad:", error);
      errorvalidacion.value = error.response.data.error
    }
    toolbar.value = false;
  };

  const actualizarCiudad = async (id, data) => {
    try {
      const response = await axios.put(
        `https://transporte-el2a.onrender.com/api/ciudad/editar/${id}`,
        data
      );
      const index = rows.value.findIndex((c) => c._id === id);
      if (index !== -1) {
        rows.value[index] = response.data;
      }
      console.log("Respuesta del servidor al actualizar ciudad:", response);
    } catch (error) {
      console.log("Error al actualizar ciudad:", error);
    }
    toolbar.value = false;
  };

  const obtenerCiudades = async () => {
    try {
      const ciudadesData = await axios.get(
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
      const response = await axios.put(
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
      const response = await axios.put(
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

  return {
    agregarNuevaCiudad,
    actualizarCiudad,
    obtenerCiudades,
    activar,
    desactivar,
    rows,
    errorvalidacion,
    estatus,
  };
});
