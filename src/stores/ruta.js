import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useRutaStore = defineStore("ruta", () => {
  const rows = ref([]);
  let ciudad_origen = ref("");
  let ciudad_destino = ref("");
  let hora_salida = ref("");
  let valor = ref("");
  let bus = ref("");
  let errorvalidacion = ref("");
  let estatus = ref()
  let estado = ref("");
  let toolbar = ref(false);
  let cambiar = ref(false);

  const columns = ref([
    {
      name: "Ciudad Origen",
      label: "Ciudad Origen",
      align: "left",
      field: (row) => row.ciudad_origen,
    },
    {
      name: "Ciudad Destino",
      label: "Ciudad Destino",
      field: (row) => row.ciudad_destino,
    },
    {
      name: "Hora Salida",
      label: "Hora Salida",
      field: (row) => row.hora_salida,
    },
    {
      name: "Valor",
      label: "Valor",
      field: (row) => row.valor,
    },
    {
      name: "Bus",
      label: "Bus",
      field: (row) => row.bus,
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

  const agregarNuevaRuta = async (data) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.post(
        "https://transporte-el2a.onrender.com/api/ruta/guardar",
        data
      );
      console.log("Respuesta del servidor al agregar nueva ruta:", response);
      rows.value.unshift(response.data.rutasPopulate);
      estatus.value = response.status
    } catch (error) {
      console.log("Error al agregar nueva ruta:", error);
      errorvalidacion.value = error.response.data.error
    }
  };

  const actualizarRuta = async (id, data) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.put(
        `https://transporte-el2a.onrender.com/api/ruta/editar/${id}`,
        data
      );
      const buscar = rows.value.findIndex((ruta) => ruta._id == id);
      rows.value.splice(buscar, 1, response.data.rutasPopulate);
      console.log("Respuesta del servidor al actualizar ruta:", response);
      estatus.value = response.status
    } catch (error) {
      console.log("Error al actualizar ruta:", error);
      errorvalidacion.value = error.response.data.error
    }
  };

  const obtenerRutas = async () => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const rutasData = await x.get(
        "https://transporte-el2a.onrender.com/api/ruta/all"
      );
      rows.value = rutasData.data.rutasPopulate;
      console.log(rutasData);
    } catch (error) {
      console.log("Error al obtener rutas:", error);
    }
  };


  const activar = async (id) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const ruta = await x.put(
        `https://transporte-el2a.onrender.com/api/ruta/activar/${id}`
      );
      if (ruta) {
        const buscar = rows.value.findIndex((r) => r._id == id);
        rows.value.splice(buscar, 1, ruta.data.rutasPopulate);
        estado.value = false;
      }
      console.log("Respuesta del servidor al activar ruta:", ruta);
    } catch (error) {
      console.log("Error al activar ruta:", error);
    }
  };

  const desactivar = async (id) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const ruta = await x.put(
        `https://transporte-el2a.onrender.com/api/ruta/inactivar/${id}`
      );
      if (ruta) {
        const buscar = rows.value.findIndex((r) => r._id == id);
        rows.value.splice(buscar, 1, ruta.data.rutasPopulate);
        estado.value = true;
      }
      console.log("Respuesta del servidor al desactivar ruta:", ruta);
      return ruta;
    } catch (error) {
      console.log("Error al desactivar ruta:", error);
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

      const response = await x.get(`https://transporte-el2a.onrender.com/api/ruta/all`);
      return response.data;
    } catch (error) {
      console.error(error);
      return error.response.data;
    }
  };

  return {
    agregarNuevaRuta,
    actualizarRuta,
    activar,
    desactivar,
    obtenerRutas,
    errorvalidacion,
    estatus,
    rows,
    obtener,
  };
});
