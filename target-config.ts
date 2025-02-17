export const target_tauri = true

export const local_ip = '192.168.201.158';
//local_ip='127.0.0.1' //if localhost
export const api_proxy_addr = `http://${local_ip}:8080`
export const img_proxy_addr = `http://${local_ip}:9000`
export const self_addr = `https://${local_ip}:3000`
export const dest_api = (target_tauri) ? api_proxy_addr : "http://localhost:8080"
export const dest_img =  (target_tauri) ?  img_proxy_addr : "http://localhost:9000"
export const dest_root = (target_tauri) ? "/Forecast-System-Frontend" : "/Forecast-System-Frontend"