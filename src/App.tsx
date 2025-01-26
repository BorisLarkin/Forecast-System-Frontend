import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./pages/MainPage/MainPage"
import ForecastsPage from "./pages/ForecastsPage/ForecastsPage"
import ForecastPage from "./pages/ForecastPage/ForecastPage";
import { ROUTES } from "./Routes";


function App({setMode} : {setMode : React.Dispatch<React.SetStateAction<string>>}) {
    setMode("dark") //by default
    console.log("Written dark")
    return (
        <BrowserRouter>
            <Routes>
                <Route path={ROUTES.HOME} index element={<MainPage setMode={setMode}/>} />
                <Route path={ROUTES.FORECASTS} element={<ForecastsPage setMode={setMode}/>} />
                <Route path={`${ROUTES.FORECAST}:id`} element={<ForecastPage setMode={setMode}/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;