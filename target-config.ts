export const target_mobile = false

export const api_proxy_addr = "http://192.168.1.38:8080"
export const img_proxy_addr = "http://192.168.1.38:9000"
export const self_addr = "https://192.168.1.38:3000"
export const dest_api = (target_mobile) ? api_proxy_addr : "http://localhost:8080"
export const dest_img =  (target_mobile) ?  img_proxy_addr : "http://localhost:9000"
export const dest_root = (target_mobile) ? "/Forecast-System-Frontend" : "/Forecast-System-Frontend"