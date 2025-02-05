export const ROUTES = {
    HOME: "/",
    FORECASTS: "/forecasts",
    FORECAST: "/forecast/",
    PREDICTION: "/prediction/",
    PREDICTIONS: "/predictions",
    LOGIN: "/login",
    PROFILE: "/profile",
    REGISTER: "/register"
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    FORECASTS: "Прогнозы",
    FORECAST: "Прогноз",
    PREDICTION: "Предсказание",
    PREDICTIONS: "Предсказания",
    LOGIN: "Авторизация",
    PROFILE: "Профиль",
    REGISTER: "Регистрация"
};