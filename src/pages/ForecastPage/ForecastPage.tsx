import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { setHeaderMode } from "../../store/slices/modeSlice.ts";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import "./ForecastPage.css";
import "../../components/global.css"
import image from "../../defaultImage.png"
import Header from '../../components/Header/Header';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getForecast } from '../../store/slices/forecastsSlice.ts';


const ForecastPage: React.FC = () => {
    const { forecast_id } = useParams();

    const dispatch = useDispatch<AppDispatch>();
    const forecast = useSelector((state: RootState) => state.forecasts.forecast); // получение данных из стора

    useEffect(() => {
        dispatch(getForecast(Number(forecast_id))); // отправляем `thunk`
    }, [dispatch]);

    useEffect(() => {
        dispatch(setHeaderMode("dark"));
        console.log("Written dark")
      }, []);

    if (!forecast) {
        return <div>Прогноз не найден</div>;
    }
      
    return (
        <>
        <Header/>
        <div className="body" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <BreadCrumbs crumbs={[
                { label: ROUTE_LABELS.FORECASTS, path: ROUTES.FORECASTS },
                { label: forecast.short_title }
            ]} />
            <div className="body_container">
                <div className="detail_title">{forecast.title}</div>
                    <div className="details">
                      <Image className="img" src={forecast.image || image}/>
                        <div className="info">
                            <span  className="short">{forecast.short_title}</span>
                            <span  className="measure_type">{forecast.measure_type}</span>
                            <div  className="extended_desc">{forecast.ext_desc}</div>
                            <span  className="desc">“{forecast.descr}“</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForecastPage;
