import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./pages/MainPage/MainPage"
import ForecastsPage from "./pages/ForecastsPage/ForecastsPage"
import ForecastPage from "./pages/ForecastPage/ForecastPage";
import LoginPage from './pages/LoginPage/LoginPage';
import PredictionPage from './pages/PredictionPage/PredictionPage';
import RegisterPage from './pages/RegistrationPage/RegistrationPage';
import PredictionsPage from './pages/PredictionsPage/PredictionsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ForecastsEditPage from './pages/ForecastsEditPage/ForecastsEditPage';
import ForecastEditPage from './pages/ForecastEditPage/ForecastEditPage';
import Page403 from './pages/Page403/Page403';
import Page404 from './pages/Page404/Page404';
import { ROUTES } from "./Routes";
import { RootState, AppDispatch } from './store/store';
import { useSelector, useDispatch } from 'react-redux';


function App() {
    const role = useSelector((state: RootState) => state.user.role);
    return (
        <BrowserRouter basename='/Forecast-System-Frontend'>
            <Routes>
                <Route path={ROUTES.HOME} index element={<MainPage/>} />
                <Route path={ROUTES.FORECASTS} element={<ForecastsPage/>} />
                <Route path={`${ROUTES.FORECAST}:forecast_id`} element={<ForecastPage/>} />
                <Route path={`${ROUTES.LOGIN}`} element={role==0 ? <LoginPage /> : <Page403 />} />
                <Route path={`${ROUTES.PREDICTION}:prediction_id`} element={role>0 ? <PredictionPage /> : <Page403 />}/>
                <Route path={ROUTES.REGISTER} element={role==0 ? <RegisterPage /> : <Page403 />} />
                <Route path={ROUTES.PROFILE} element={role>0 ? <ProfilePage /> : <Page403 />} />
                <Route path={`${ROUTES.PREDICTIONS}`} element={role>0 ? <PredictionsPage /> : <Page403 />} />
                <Route path={`${ROUTES.FORECAST}edit/:forecast_id`} element={role==2 ? <ForecastEditPage /> : <Page403 />} />
                <Route path={`${ROUTES.FORECAST}add`} element={role==2 ? <ForecastEditPage /> : <Page403 />} />
                <Route path={ROUTES.ADMIN} element={role==2 ? <ForecastsEditPage /> : <Page403 />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;