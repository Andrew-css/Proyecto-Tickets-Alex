import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useConductorStore = defineStore("conductor", () => {
  const rows = ref([]);
  let id = ref("");
  let nombre = ref("");
  let cedula = ref("");
  let email = ref("");
  let cambiar = ref(false);
  let errorvalidacion = ref ("");
 let estatus = ref ();
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
      const x = insertarToken();
      if (!x) return null;
      const response = await x.post(
        "https://transporte-el2a.onrender.com/api/conductor/guardar",
        data
      );
      console.log("Respuesta del servidor al agregar nuevo conductor:", response);
      rows.value.unshift(response.data.conductor);
      estatus.value = response.status
    } catch (error) {
      console.log("Error al agregar nuevo conductor:", error);
      errorvalidacion.value = error.response.data.error
    }
  };

  const actualizarConductor = async (id, data) => {
    console.log("Hola soy data", data);
    const x = insertarToken();
    if (!x) return null;
    try {
      const response = await x.put(
        `https://transporte-el2a.onrender.com/api/conductor/editar/${id}`,
        data
      );
      const buscar = rows.value.findIndex((c) => c._id == id);
      rows.value.splice(buscar, 1, response.data.conductor);
      console.log("Respuesta del servidor al actualizar conductor:", response);
      estatus.value = response.status
    } catch (error) {
      console.log("Error al actualizar conductor:", error);
      errorvalidacion.value = error.response.data.error
    }
  };

  const obtenerConductores = async () => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const conductoresData = await x.get(
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
      const x = insertarToken();
      if (!x) return null;
      const conductor = await x.put(
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
      const x = insertarToken();
      if (!x) return null;
      const conductor = await x.put(
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

      const response = await x.get(`https://transporte-el2a.onrender.com/api/conductor/all`);
      return response.data;
    } catch (error) {
      console.error(error);
      return error.response.data;
    }
  };

  return {
    agregarNuevoConductor,
    actualizarConductor,
    activar,
    desactivar,
    obtenerConductores,
    errorvalidacion,
    estatus,
    rows,
    obtener,
  };
});