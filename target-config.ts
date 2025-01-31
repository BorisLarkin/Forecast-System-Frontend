const target_tauri = false

export const api_proxy_addr = "http://192.168.0.104:8000"
export const img_proxy_addr = "http://192.168.0.104:9000"
export const dest_api = (target_tauri) ? api_proxy_addr : "http://localhost:8080"
export const dest_img =  (target_tauri) ?  img_proxy_addr : "http://localhost:9000"
export const dest_root = (target_tauri) ? "/Forecast-System-Frontend" : "/Forecast-System-Frontend"