import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./pages/MainPage/MainPage"
import ForecastsPage from "./pages/ForecastsPage/ForecastsPage"
import ForecastPage from "./pages/ForecastPage/ForecastPage";
import LoginPage from './pages/LoginPage/LoginPage';
import PredictionPage from './pages/PredictionPage/PredictionPage';
import RegisterPage from './pages/RegistrationPage/RegistrationPage';
import PredictionsPage from './pages/PredictionsPage/PredictionsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { ROUTES } from "./Routes";


function App() {
    return (
        <BrowserRouter basename='/Forecast-System-Frontend'>
            <Routes>
                <Route path={ROUTES.HOME} index element={<MainPage/>} />
                <Route path={ROUTES.FORECASTS} element={<ForecastsPage/>} />
                <Route path={`${ROUTES.FORECAST}:forecast_id`} element={<ForecastPage/>} />
                <Route path={`${ROUTES.LOGIN}`} element={<LoginPage/>} />
                <Route path={`${ROUTES.PREDICTION}:prediction_id`} element={<PredictionPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage/>} />
                <Route path={ROUTES.PROFILE} element={<ProfilePage/>} />
                <Route path={`${ROUTES.PREDICTIONS}`} element={<PredictionsPage/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;