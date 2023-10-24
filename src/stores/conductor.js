import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useConductorStore = defineStore("conductor", () => {
  const rows = ref([]);
  let id = ref("");
  let nombre = ref("");
  let cedula = ref("");
  let email = ref("");
  let toolbar = ref(false);
  let cambiar = ref(false);
  const columns = ref([
    {
      name: "Nombre",
      label: "Nombre",
      align: "left",
      field: (row) => row.nombre,
    },
    {
      name: "Cedula",
      label: "Cedula",
      field: (row) => row.cedula,
    },
    {
      name: "Email",
      label: "Email",
      field: (row) => row.email,
    },
    {
      name: "Estado",
      label: "Estado",
      field: (row) => row.estado,
    },
    {
      name: "Opciones",
      label: "Opciones",
      field: "actions",
    },
  ]);

  const agregarNuevoConductor = async (data) => {
    try {
      const response = await axios.post(
        "https://transporte-el2a.onrender.com/api/conductor/guardar",
        data
      );
      console.log("Respuesta del servidor al agregar nuevo conductor:", response);
      rows.value.push(response.data.conductor);
    } catch (error) {
      console.log("Error al agregar nuevo conductor:", error);
    }
    toolbar.value = false;
  };

  const actualizarConductor = async (id, data) => {
    console.log("Hola soy data", data);
    try {
      const response = await axios.put(
        `https://tu-api.com/conductor/editar/${id}`,
        data
      );
      const buscar = rows.value.findIndex((c) => c._id == id);
      rows.value.splice(buscar, 1, response.data.conductor);
      console.log("Respuesta del servidor al actualizar conductor:", response);
    } catch (error) {
      console.log("Error al actualizar conductor:", error);
    }
    toolbar.value = false;
  };

  const obtenerConductores = async () => {
    try {
      const conductoresData = await axios.get(
        "https://transporte-el2a.onrender.com/api/conductor/all"
      );
      rows.value = conductoresData.data.conductor;
      console.log(conductoresData)
    } catch (error) {
      console.log("Error al obtener conductores:", error);
    }
  };

  const activado = ref(false);

  const activar = async (id) => {
    try {
      const conductor = await axios.put(
        `https://transporte-el2a.onrender.com/api/conductor/activar/${id}`
      );
      if (conductor) {
        const buscar = rows.value.findIndex((c) => c._id == id);
        rows.value.splice(buscar, 1, conductor.data.conductor);
        activado.value = false;
      }
      console.log("Respuesta del servidor al activar conductor:", conductor);
    } catch (error) {
      console.log("Error al activar conductor:", error);
    }
  };

  const desactivar = async (id) => {
    try {
      const conductor = await axios.put(
        `https://transporte-el2a.onrender.com/api/conductor/inactivar/${id}`
      );
      if (conductor) {
        const buscar = rows.value.findIndex((c) => c._id == id);
        rows.value.splice(buscar, 1, conductor.data.conductor);
        activado.value = true;
      }
      console.log("Respuesta del servidor al desactivar conductor:", conductor);
      return conductor;
    } catch (error) {
      console.log("Error al desactivar conductor:", error);
    }
  };

  return {
    agregarNuevoConductor,
    actualizarConductor,
    activar,
    desactivar,
    obtenerConductores,
    rows,
  };
});