import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useBusStore = defineStore("bus", () => {
  const rows = ref([]);
  let empresa = ref("");
  let asiento = ref("");
  let placa = ref("");
  let conductor = ref("");
  let estado = ref("");
  let toolbar = ref(false);
  let cambiar = ref(false);
  const columns = ref([
    {
      name: "Empresa",
      label: "Empresa",
      align: "left",
      field: (row) => row.empresa,
    },
    {
      name: "Asiento",
      label: "Asiento",
      field: (row) => row.asiento,
    },
    {
      name: "Placa",
      label: "Placa",
      field: (row) => row.placa,
    },
    {
      name: "Conductor",
      label: "Conductor",
      field: (row) => row.conductor,
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

  const agregarNuevoBus = async (data) => {
    try {

      const response = await axios.post(
        "https://transporte-el2a.onrender.com/api/bus/guardar",
        data
      );
      console.log("Respuesta del servidor al agregar nuevo bus:", response);
      console.log("Datos del array", data)
      rows.value.push(response.data.busPopulate);
    } catch (error) {
      console.log("Error al agregar nuevo bus:", error);
    }
    toolbar.value = false;
  };

  const actualizarBus = async (id, data) => {
    try {
      const response = await axios.put(
        `https://transporte-el2a.onrender.com/api/bus/editar/${id}`,
        data
      );
      const buscar = rows.value.findIndex((b) => b._id == id);
      rows.value.splice(buscar, 1, response.data.busPopulate);
      console.log("Respuesta del servidor al actualizar bus:", response);
    } catch (error) {
      console.log("Error al actualizar bus:", error);
    }
    toolbar.value = false;
  };

  const obtenerBuses = async () => {
    try {
      const busesData = await axios.get(
        "https://transporte-el2a.onrender.com/api/bus/all"
      );
      rows.value = busesData.data.busPopulate;
      console.log(busesData);
    } catch (error) {
      console.log("Error al obtener buses:", error);
    }
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
      const bus = await axios.put(
        `https://transporte-el2a.onrender.com/api/bus/activar/${id}`
      );
      if (bus) {
        const buscar = rows.value.findIndex((b) => b._id == id);
        rows.value.splice(buscar, 1, bus.data.busPopulate);
        activado.value = false;
      }
      console.log("Respuesta del servidor al activar bus:", bus);
    } catch (error) {
      console.log("Error al activar bus:", error);
    }
  };

  const desactivar = async (id) => {
    try {
      const bus = await axios.put(
        `https://transporte-el2a.onrender.com/api/bus/inactivar/${id}`
      );
      if (bus) {
        const buscar = rows.value.findIndex((b) => b._id == id);
        rows.value.splice(buscar, 1, bus.data.busPopulate);
        activado.value = true;
      }
      console.log("Respuesta del servidor al desactivar bus:", bus);
      return bus;
    } catch (error) {
      console.log("Error al desactivar bus:", error);
    }
  };

  return {
    agregarNuevoBus,
    actualizarBus,
    activar,
    desactivar,
    obtenerBuses,
    obtenerConductores,
    rows,
  };
});
