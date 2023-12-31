import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useTiqueteStore = defineStore("tiquete",()=>{
    const rows = ref([]);
    let id = ref("");
    let nombre = ref("");
    let cedula = ref("");
    let email = ref("");
    let tokenvendedor = ref()
    let cambiar = ref(false);
    let errorvalidacion = ref("")
    let estatus = ref()
    let tickets = ref([])
    let asientos = ref([])
    let infoTiquete = ref([]);

  
  
    const agregarNuevoTiquete = async (data) => {
      try {
        const x = insertarToken();
        if (!x) return null;
        const response = await x.post(
          "https://transporte-el2a.onrender.com/api/tiquete/guardar",
          data
        );
        console.log("Respuesta del servidor al agregar nuevo tiquete:", response);
        rows.value.unshift(response.data.tiquetePopulate);
        infoTiquete.value = response.data.tiquetePopulate;
        estatus.value = response.status;
      } catch (error) {
        console.log("e", error);
        errorvalidacion.value = error.response.data.error;
        estatus.value = error.response.status;
      }
  
    };
  
  
    const actualizarTiquete = async (id, data) => {
  
      console.log("Hola soy data", data);
      try {
        const x = insertarToken();
        if (!x) return null;
        const response = await x.put(
          `https://transporte-el2a.onrender.com/api/tiquete/editar/${id}`,
          data
        );
        const buscar = rows.value.findIndex((r) => r._id == id);
        rows.value.splice(buscar, 1, response.data.tiquetePopulate);
        console.log("r", response);
      } catch (error) {
        console.log("e", error);
        errorvalidacion.value = error.response.data.error
      }
  
    
    };
  
  
    const obtenerTiquetes = async () => {
      try {
        const x = insertarToken();
        if (!x) return null;
        const tiquetes = await x.get(
          "https://transporte-el2a.onrender.com/api/tiquete/all"
        );
        rows.value = tiquetes.data.tiquetePopulate;
        console.log(tiquetes)
      } catch (error) {
        console.log("e", error);
      }
    };

    const continuarVentaTiquete = async () => {
      try {
        const x = insertarToken();
        if (!x) return null;
        const response = await x.get(
          "https://transporte-el2a.onrender.com/api/tiquete/continuarVenta"
        );
        tickets.value = response.data.tiquetePopulate;
      } catch (error) {
        console.error("Error al obtener tiquetes desde el backend:", error);
      }
    };

    const obtenerAsientosOcupados = async (idBus, idRuta, fecha_salida) => {
      try {
        const x = insertarToken();
        if (!x) return null;
  
        let res = await x.get(`https://transporte-el2a.onrender.com/api/tiquete/asientosOcupados/${idBus}/${idRuta}/${fecha_salida}`)
        console.log("Hola sor res", res)
        asientos.value = res.data;
        console.log("Hola soy asientos vendidos backend", asientos);
        estatus.value = res.status;
        return res
      }  catch (error) {
        estatus.value = x.status;
        console.error("Error al obtener asientos ocupados desde el backend:", error);
      }
    }

  
    const activado = ref(false);
  
    const activar = async (id) => {
      try {
        const x = insertarToken();
        if (!x) return null;
        const tiquete = await x.put(
          `https://transporte-el2a.onrender.com/api/tiquete/activar/${id}`
        );
        console.log(tiquete);
        if (tiquete) {
          const buscar = rows.value.findIndex((r) => r._id == id);
          rows.value.splice(buscar, 1, tiquete.data.tiquetePopulate);
          activado.value = false;
        }
      } catch (error) {
        console.log("e", error);
      }
    };
  
    const desactivar = async (id) => {
      try {
        const x = insertarToken();
        if (!x) return null;
        const tiquete = await x.put(
          `https://transporte-el2a.onrender.com/api/tiquete/inactivar/${id}`
        );
        console.log(tiquete);
        if (tiquete) {
          const buscar = rows.value.findIndex((r) => r._id == id);
          rows.value.splice(buscar, 1, tiquete.data.tiquetePopulate);
          activado.value = true;
        }
        return tiquete;
      } catch (error) {
        console.log("e", error);
      }
    };

    function insertarToken(){
      const token = localStorage.getItem("x-token");
      tokenvendedor.value = token
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
  
        const response = await x.get(`https://transporte-el2a.onrender.com/api/tiquete/all`);
        return response.data;
      } catch (error) {
        console.error(error);
        return error.response.data;
      }
    };
  
    return {
      agregarNuevoTiquete,
      actualizarTiquete,
      activar,
      desactivar,
      obtenerTiquetes,
      rows,
      estatus,
      errorvalidacion,
      tokenvendedor,
      obtener,
      continuarVentaTiquete,
      tickets,
      obtenerAsientosOcupados,
      asientos,
      infoTiquete,
    };


   
})