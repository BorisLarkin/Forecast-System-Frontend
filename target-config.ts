export const target_tauri = true

export const api_proxy_addr = "http://192.168.1.38:8080"
export const img_proxy_addr = "http://192.168.1.38:9000"
export const dest_api = (target_tauri) ? api_proxy_addr : "http://localhost:8080"
export const dest_img =  (target_tauri) ?  img_proxy_addr : "http://localhost:9000"
export const dest_root = (target_tauri) ? "/Forecast-System-Frontend" : "/Forecast-System-Frontend"