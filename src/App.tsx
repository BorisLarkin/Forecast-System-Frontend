import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./pages/MainPage/MainPage"
import ForecastsPage from "./pages/ForecastsPage/ForecastsPage"
import ForecastPage from "./pages/ForecastPage/ForecastPage";
import { ROUTES } from "./Routes";
import { useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";

function App() {
    useEffect(()=>{
        invoke('tauri', {cmd: 'create'})
            .then((response: any) => console.log(response))
            .catch((error: any) => console.log(error));

        return() => {
            invoke('tauri', {cmd: 'close'})
                .then((response: any) => console.log(response))
                .catch((error: any) => console.log(error));
        }
    }, []);

    return (
        <BrowserRouter basename='/Forecast-System-Frontend'>
            <Routes>
                <Route path={ROUTES.HOME} index element={<MainPage/>} />
                <Route path={ROUTES.FORECASTS} element={<ForecastsPage/>} />
                <Route path={`${ROUTES.FORECAST}:id`} element={<ForecastPage/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;