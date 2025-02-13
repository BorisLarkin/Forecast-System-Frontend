import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ForecastForm from '../../components/ForecastForm/ForecastForm';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS, ROUTES } from '../../Routes';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from "react-redux";
import { editForecast, getForecast, addForecast, addPictureToForecast } from '../../store/slices/forecastsSlice';
import { setHeaderMode } from '../../store/slices/modeSlice';
import { DsForecastRequest, DsForecastResponse } from '../../api/Api';
import './ForecastEditPage.css'

const ForecastEditPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [error, setError] = useState<string | null>(null);

    const { forecast_id } = useParams();

    const forecast = useSelector((state: RootState) => state.forecasts.forecast); // получение данных из стора
    const fid = useSelector((state: RootState) => state.forecasts.forecast_id); 

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


    useEffect(() => {
        if (forecast_id) {
            try {
                dispatch(getForecast(Number(forecast_id))); // отправляем `thunk`
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setError('Не удалось загрузить данные.');
            }
        }
    }, [forecast_id]);

    const handleSave = async (data: { title: string; short: string; desc: string; ext: string; color: string; meas: string; image?: File }) => {
        let new_f: DsForecastResponse = {
            forecast_id: forecast_id? Number(forecast_id) : 0,
            short_title: data.short,
            color: data.color,
            title: data.title,
            descr: data.desc,
            ext_desc: data.ext,
            measure_type: data.meas,
            image: forecast.image
        }
        try {
            if (forecast_id) {
                dispatch(editForecast({
                    forecast_id: parseInt(forecast_id),
                    forecast: new_f
                }));
            } else {
                dispatch(addForecast(new_f));
            }

            if (data.image) {
               dispatch(addPictureToForecast({
                    forecast_id: fid ? fid : 0,
                    image: data.image,
                }));
            }

            navigate('/forecasts');
        } catch (err) {
            console.error('Ошибка сохранения чата:', err);
            setError('Не удалось сохранить чат.');
        }
    };

    const handleCancel = () => {
        navigate('/forecasts');
    };

    return (
        <>
            <Header />
            <div className='body'>
            <BreadCrumbs
                crumbs={[
                    { label: ROUTE_LABELS.ADMIN, path: ROUTES.ADMIN },
                    { label: forecast_id ? 'Редактирование прогноза' : 'Добавление прогноза', path: '' },
                ]}
            />
            <div className="forecast-edit-page">
                <h1>{forecast_id ? 'Редактирование прогноза' : 'Добавление прогноза'}</h1>
                {error && <div className="error">{error}</div>}
                <ForecastForm initialData={forecast? {forecast} : undefined} onSave={handleSave} onCancel={handleCancel} />
            </div>
            </div>
        </>
    );
};

export default ForecastEditPage;