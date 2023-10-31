import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useVendedorStore = defineStore("vendedor",()=>{
  const rows = ref([]);
  let id = ref("");
  let nombre = ref("");
  let apellido = ref ("");
  let cedula = ref("");
  let telefono = ref("");
  let usuario = ref("");
  let contraseña = ref("");
  let toolbar = ref(false);
  let cambiar = ref(false);



  const agregarNuevoVendedor = async (data) => {
    try {
      const response = await axios.post(
        "https://transporte-el2a.onrender.com/api/vendedor/guardar",
        data
      );
      console.log("Respuesta del servidor al agregar nuevo vendedor:", response);
      rows.value.push(response.data.vendedor);
    } catch (error) {
      console.log("e", error);
    }
    toolbar.value = false;
  };


  const actualizarVendedor = async (id, data) => {

    console.log("Hola soy data", data);
    try {
      const response = await axios.put(
        `https://transporte-el2a.onrender.com/api/vendedor/editar/${id}`,
        data
      );
      const buscar = rows.value.findIndex((r) => r._id == id);
      rows.value.splice(buscar, 1, response.data.vendedor);
      console.log("r", response);
    } catch (error) {
      console.log("e", error);
    }

    toolbar.value = false;
  };

  
  const obtenerVendedor = async () => {
    try {
      const vendedor = await axios.get(
        "https://transporte-el2a.onrender.com/api/vendedor/all"
      );
      rows.value = vendedor.data.vendedor;
    } catch (error) {
      console.log("e", error);
    }
  };


  const activado = ref(false);


  const activar = async (id) => {
    try {
      const vendedor = await axios.put(
        `https://transporte-el2a.onrender.com/api/vendedor/activar/${id}`
      );
      console.log(vendedor);
      if (vendedor) {
        const buscar = rows.value.findIndex((r) => r._id == id);
        rows.value.splice(buscar, 1, vendedor.data.vendedor);
        activado.value = false;
      }
    } catch (error) {
      console.log("e", error);
    }
  };

  const desactivar = async (id) => {
    try {
      const vendedor = await axios.put(
        `https://transporte-el2a.onrender.com/api/vendedor/inactivar/${id}`
      );
      console.log(vendedor);
      if (vendedor) {
        const buscar = rows.value.findIndex((r) => r._id == id);
        rows.value.splice(buscar, 1, vendedor.data.vendedor);
        activado.value = true;
      }
      return vendedor;
    } catch (error) {
      console.log("e", error);
    }
  };

  return {
    agregarNuevoVendedor,
    actualizarVendedor,
    activar,
    desactivar,
    obtenerVendedor,
    rows,
  };


});