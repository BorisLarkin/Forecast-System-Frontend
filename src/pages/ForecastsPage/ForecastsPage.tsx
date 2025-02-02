import {  useEffect } from "react";
import { setHeaderMode } from "../../store/slices/modeSlice.ts";
import { AppDispatch, RootState } from "../../store/store";
import ForecastCard from "../../components/ForecastCard/ForecastCard.tsx";
import "./ForecastsPage.css";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs.tsx";
import {ROUTE_LABELS, ROUTES} from "../../Routes.tsx";
import "../../components/global.css"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from '../../components/Header/Header';
import cart from "../../cart.svg"
import { Image } from "react-bootstrap";
import { getForecastsList } from '../../store/slices/forecastsSlice.ts';
import InputField from "../../components/InputField/InputField.tsx";
import {Spinner} from "react-bootstrap";

const ForecastsPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { predictionID, forecasts, cartCount, searchValue, loading } = useSelector((state: RootState) => state.forecasts); // получение данных из стора

    useEffect(() => {
      dispatch(getForecastsList()); // отправляем `thunk`
    }, [dispatch]);

    useEffect(() => {
        dispatch(setHeaderMode("dark"));
        console.log("Written dark")
      }, []);

    return (
        <>
        <Header/>
        <div className="body">
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.FORECASTS, path: ROUTES.FORECASTS }]} />
            {cartCount !== 0 ? (
                <Link to={`${ROUTES.PREDICTION}${predictionID}`}>
                    <div className="prediction granted">
                        <div className="prediction_size_bg">
                          <span className="prediction_size">{cartCount}</span>
                        </div>
                        <Image className="prediction_img" src={cart || "http://127.0.0.1:9000/test/cart.svg"}/>
                    </div>
                </Link>
            ) : (
                <div className="prediction restricted">
                    <Image className="prediction_img" src={cart || "http://127.0.0.1:9000/test/cart.svg"}/>
                </div>
            )}
            <div className="forecasts-container">
                <InputField
                    value={searchValue}
                    loading={loading}
                />
                {loading ? (
                  <>
                    <Spinner animation="border" />
                  </>
                ) : (
                    <>
                    {forecasts.length ? (
                        <div className="content">
                            {forecasts.map(forecast => (
                                <ForecastCard key={forecast.forecast_id} forecast={forecast}/>
                            ))}
                        </div>
                    ) : (
                        <h1>К сожалению, пока ничего не найдено :(</h1>
                    )}
                  </>
                )}
            </div>
        </div>
        </>
    );
};

export default ForecastsPage;
