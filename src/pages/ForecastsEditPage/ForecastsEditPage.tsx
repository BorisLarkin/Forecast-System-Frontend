import React, { useEffect, useState } from "react";
import "./ForecastsEditPage.css";
import Header from "../../components/Header/Header.tsx";
import mock_img from "../../defaultImage.png";
import {useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { deleteForecast, getForecastsList } from "../../store/slices/forecastsSlice.ts";
import { setHeaderMode } from "../../store/slices/modeSlice.ts";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs.tsx";
import {ROUTE_LABELS, ROUTES} from "../../Routes.tsx";

const ForecastsEditPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [error, setError] = useState<string | null>(null);
    const { forecasts } = useSelector((state: RootState) => state.forecasts); // получение данных из стора
    const role = useSelector((state: RootState) => state.user.role);
    const navigate = useNavigate();

    const handleDeleteForecast= async (id: number) => {
        try {
            dispatch(deleteForecast(id));
            dispatch(getForecastsList()); // отправляем `thunk`
        } catch (err) {
            console.error("Ошибка удаления чата:", err);
            setError("Не удалось удалить чат.");
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/forecast/edit/${id}`);
    };

    // Переход на страницу добавления
    const handleAdd = () => {
        navigate(`/forecast/add`);
    };

    useEffect(() => {
      dispatch(getForecastsList()); // отправляем `thunk`
    }, [dispatch]);

    useEffect(() => {
        dispatch(setHeaderMode("dark"));
        console.log("Written dark")
      }, []);

    return (
        <>
        <Header></Header>
            <div className="body">
                <BreadCrumbs
                    crumbs={[
                    { label: ROUTE_LABELS.ADMIN, path: ROUTES.ADMIN },
                    ]}
                />
            <div className="services-page">
                <h1>Управление прогнозами</h1>
                {error && <div className="error">{error}</div>}
                <table className="services-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Изображение</th>
                        <th>Название</th>
                        <th>Описание</th>
                        <th>Ед. измерения</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {forecasts.map((forecast) => (
                        <tr key={forecast.forecast_id}>
                            <td>{forecast.forecast_id}</td>
                            <td className="image-replace">
                                <img
                                    src={forecast.image || mock_img}
                                    alt="Изображение"
                                    className="forecast-avatar"
                                />
                            </td>
                            <td>
                                {forecast.short_title}
                            </td>
                            <td>
                                {forecast.descr}
                            </td>
                            <td>
                                {forecast.measure_type}
                            </td>
                            <td>
                                    <>
                                        <button className="service-button"
                                                onClick={() => handleEdit(forecast.forecast_id)}>Редактировать
                                        </button>
                                        <button className="service-button"
                                                onClick={() => handleDeleteForecast(forecast.forecast_id)}>Удалить
                                        </button>
                                    </>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="add-service-form">
                    <button onClick={handleAdd}>Добавить</button>
                </div>
            </div>
            </div>

        </>
    );
};

export default ForecastsEditPage;