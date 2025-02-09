import React, { useEffect, useState } from 'react';
import { Forecasts_Mock } from '../../modules/mock';
import { Forecast } from '../../modules/types';
import { useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { setHeaderMode } from "../../store/slices/modeSlice.ts";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import "./ForecastPage.css";
import "../../components/global.css"
import image from "../../defaultImage.png"
import Header from '../../components/Header/Header';
import { useDispatch } from 'react-redux';
import {target_tauri, self_addr} from "../../../target-config.ts"


const ForecastPage: React.FC = () => {
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const [Forecast, setForecast] = useState<Forecast | null>(null);
    const [isMock, setIsMock] = useState(false);

    const fetchForecast = async () => {
        try {
            const response = await fetch(`/api/forecast/${id}`, { signal: AbortSignal.timeout(3000) });
            if (!response.ok) throw new Error('Network response has failed');

            const data = await response.json();

            if (!data || !data.forecast_id || !data.image) {
                throw new Error('Invalid data format');
            }

            const ForecastParsed: Forecast = {
                id:      data.forecast_id,
		        title:   data.title,
		        short_title:   data.short_title,
		        desc: data.descr,
		        color: data.color,
		        img: data.image,
                ext_desc: data.ext_desc,
                meas: data.measure_type,
            };

            setForecast(ForecastParsed);
        } catch (error) {
            console.error('Fetch error or invalid data:', error);
            setIsMock(true);
        }
    };

    useEffect(() => {
        if (isMock) {
            const idNum = parseInt(id as string, 10);
            const mockForecast = Forecasts_Mock.find(Forecast => Forecast?.id === idNum) as Forecast;
            setForecast(mockForecast);
        } else {
            fetchForecast();
        }

        return () => {
            setForecast(null); //destructor
        };
    }, [id, isMock]);

    if (!Forecast) {
        return <div>Прогноз не найден</div>;
    }

    dispatch(setHeaderMode("dark"));
    console.log("Written dark")

    return (
        <>
        <Header/>
        <div className="body">
            <BreadCrumbs crumbs={[
                { label: ROUTE_LABELS.FORECASTS, path: ROUTES.FORECASTS },
                { label: Forecast.short_title }
            ]} />
            <div className="body_container">
                <div className="detail_title">{Forecast.title}</div>
                    <div className="details">
                      <Image className="img" src={(target_tauri? self_addr + "/img-proxy" + "/test" +Forecast.img.split("/test").slice(-1)[0] : Forecast.img) || image}/>
                        <div className="info">
                            <span  className="short">{Forecast.short_title}</span>
                            <span  className="measure_type">{Forecast.meas}</span>
                            <div  className="extended_desc">{Forecast.ext_desc}</div>
                            <span  className="desc">“{Forecast.desc}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForecastPage;
