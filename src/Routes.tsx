export const ROUTES = {
    HOME: "/",
    FORECASTS: "/forecasts",
    FORECAST: "/forecast/",
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    FORECASTS: "Прогнозы",
    FORECAST: "Прогноз",
};