import { Forecast } from "../../modules/types.ts";
import { FormEvent, useEffect, useState } from "react";
import { Forecasts_Mock } from "../../modules/mock.ts";
import { setFilterName } from "../../store/slices/filterSlice";
import { setHeaderMode } from "../../store/slices/modeSlice.ts";
import { RootState } from "../../store/store";
import ForecastCard from "../../components/ForecastCard/ForecastCard.tsx";
import "./ForecastsPage.css";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs.tsx";
import {ROUTE_LABELS, ROUTES} from "../../Routes.tsx";
import "../../components/global.css"
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from '../../components/Header/Header';


const ForecastsPage = () => {
    const dispatch = useDispatch();
    const [forecasts, setForecasts] = useState<Forecast[]>([]);
    const [isMock, setIsMock] = useState(false);
    const name = useSelector((state: RootState) => state.filter.name);
    const [cartCount, setCount] = useState(0);
    const [draftID, setDraftID] = useState(0);

    const fetchForecasts = async () => {
        try {
            const response = await fetch(`/api/forecasts?forecast_name=${name.toLowerCase()}`, { signal: AbortSignal.timeout(5000) });

            if (!response.ok) {
                throw new Error('Network response failed');
            }
            const result = await response.json();

            const forecasts = result.forecasts.map((forecast: any) => ({
                id:      forecast.forecast_id,
		        title:   forecast.title,
		        short_title:   forecast.short_title,
		        desc: forecast.descr,
		        color: forecast.color,
		        img: forecast.image,
                ext_desc: forecast.ext_desc,
                meas: forecast.measure_type,
            }));

            setForecasts(forecasts);
            setCount(result.draft_count || 0);
            setDraftID(result.draft_id);
            setIsMock(false);
        } catch (error) {
            console.error("Fetch error:", error);
            if (!isMock) {
                createMocks();
            }
        }
    };

    const createMocks = () => {
        setIsMock(true);
        setForecasts(Forecasts_Mock.filter(forec => forec.title.toLowerCase().includes(name.toLowerCase())));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await fetchForecasts();
    };

    useEffect(() => {
        fetchForecasts();
    }, []);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilterName(e.target.value));
        fetchForecasts();
        console.log("nameChanged: ", name)
    };

    dispatch(setHeaderMode("dark"));
    console.log("Written dark")

    return (
        <>
        <Header/>
        <div className="body">
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.FORECASTS, path: ROUTES.FORECASTS }]} />
            {cartCount !== 0 ? (
                <Link to={`${ROUTES.PREDICTION}${draftID}`}>
                    <div className="prediction granted">
                        <div className="prediction_size_bg">
                          <span className="prediction_size">{cartCount}</span>
                        </div>
                        <div className="prediction_img"></div>
                    </div>
                </Link>
            ) : (
                <div className="prediction restricted">
                    <div className="prediction_img"></div>
                </div>
            )}
            <div className="forecasts-container">
                <div className="search">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="search"
                            className="value"
                            placeholder="Поиск..."
                            value={name}
                            onChange={handleNameChange}
                        />
                        <button type="submit" className="search_btn" style={{zIndex:2, cursor: "pointer"}}></button>
                        <img className="search_btn" src="http://127.0.0.1:9000/test/search.svg"/>
                    </form>
                </div>
                <div className="content">
                    {forecasts.map(forecast => (
                        <ForecastCard key={forecast.id} forecast={forecast}/>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
};

export default ForecastsPage;
