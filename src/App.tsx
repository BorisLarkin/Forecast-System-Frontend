import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./pages/MainPage/MainPage"
import ForecastsPage from "./pages/ForecastsPage/ForecastsPage"
import ForecastPage from "./pages/ForecastPage/ForecastPage";
import LoginPage from './pages/LoginPage/LoginPage';
import { ROUTES } from "./Routes";


function App() {
    return (
        <BrowserRouter basename='/Forecast-System-Frontend'>
            <Routes>
                <Route path={ROUTES.HOME} index element={<MainPage/>} />
                <Route path={ROUTES.FORECASTS} element={<ForecastsPage/>} />
                <Route path={`${ROUTES.FORECAST}:id`} element={<ForecastPage/>} />
                <Route path={`${ROUTES.LOGIN}`} element={<LoginPage/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;