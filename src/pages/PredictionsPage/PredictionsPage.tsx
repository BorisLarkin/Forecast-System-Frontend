import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PredictionsPage.css';
import Header from "../../components/Header/Header.tsx";
import {ROUTE_LABELS, ROUTES} from "../../Routes.tsx";
import {BreadCrumbs} from "../../components/BreadCrumbs/BreadCrumbs.tsx";
import {DsPredictionWithUsers, Api} from "../../api/Api.ts";
import { returnHeaderConfig } from '../../store/slices/userSlice.ts';
import { finishPrediction } from '../../store/slices/predictionDraftSlice.ts';
import { api } from '../../api/index.ts';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store.ts';
import { setHeaderMode } from "../../store/slices/modeSlice.ts";
import {
    setEndDate,
    setStartDate,
    setStatus,
    setUsername,
    resetFilters,
    getPredictions
} from "../../store/slices/predFilterSlice.ts";
import time from '../../time.svg'
import open_link from "../../open.svg"


const PredictionsPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [error, setError] = useState<string | null>(null);
    const role = useSelector((state: RootState) => state.user.role);
    const header = returnHeaderConfig().headers.Authorization
    const filters = useSelector((state: RootState) => state.predictionsFilter);

    const fetchPredictions = async () => {
        await dispatch(getPredictions({status: filters.status, start_date: filters.startDate, end_date: filters.endDate}))
    }

    const updateStatus = async (prediction_id: number, status: string) => {
        if (prediction_id==0){return}
        await dispatch(finishPrediction({prId: prediction_id, status: status})); // Отправляем 'thunk'
    };

    useEffect(() => {
        dispatch(setHeaderMode("dark"));
        dispatch(resetFilters())
        fetchPredictions()
    }, []);

    useEffect(() => {
        const interval = setInterval(fetchPredictions, 3000);
        return () => clearInterval(interval);
    });

    return (
        <>
        <div className='body' style={{width:'auto', minWidth:'100vw'}}>
            <Header up={true}/>
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.PREDICTIONS, path: ROUTES.PREDICTIONS }]} />
            <div className="predictions-page">
            <form className="predictions-filters">
                    <div className="filter-group">
                        <label htmlFor="status">Статус</label>
                        <select
                            id="status"
                            name="status"
                            value={filters.status? filters.status : ''}
                            onChange={(event => dispatch(setStatus(event.target.value)))}
                        >
                            <option value="">все</option>
                            <option value="draft">черновик</option>
                            <option value="pending">сформирован</option>
                            <option value="denied">отклонён</option>
                            <option value="done">завершён</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="startDate">От</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={filters.startDate? filters.startDate : ''}
                            onChange={(event => dispatch(setStartDate(event.target.value)))}/>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="endDate">До</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={filters.endDate? filters.endDate : ''}
                            onChange={(event => dispatch(setEndDate(event.target.value)))}/>
                    </div>
                    {role==2 && (
                        <div className="filter-group">
                            <label htmlFor="username">Создатель</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={filters.username? filters.username : ''}
                                onChange={(event => dispatch(setUsername(event.target.value)))}
                                placeholder="Введите имя пользователя" />
                        </div>
                    )}
                </form>
                {error && <div className="error">{error}</div>}
                <h1>Предсказания</h1>
                <table className="predictions-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Статус</th>
                        <th>Кол-во</th>
                        <th>Дата создания</th>
                        <th>Дата обновления</th>
                        <th>Дата завершения</th>
                        {role==2 && (<th>Создатель</th>)}
                        {role==2 && (<th>Действия</th>)}
                        <th>QR</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(filters.predictions_users!=null && filters.predictions_users!=undefined && filters.predictions_users.length>0)? (
                        filters.predictions_users.map((prediction) => (
                            <tr
                                key={prediction.prediction.prediction_id}
                                className="clickable-row"
                                onClick={() => navigate(`/prediction/${prediction.prediction.prediction_id}`)}
                            >
                                <td>{prediction.prediction.prediction_id}</td>
                                <td>
                                    {prediction.prediction.status}
                                </td>
                                <td>
                                    {prediction.prediction.prediction_amount}
                                </td>
                                <td>{new Date(prediction.prediction.date_created? prediction.prediction.date_created : '').toLocaleString()}</td>
                                <td>
                                    {prediction.prediction.date_formed !== '0001-01-01T02:30:17+02:30' && prediction.prediction.date_formed !== '0001-01-01T00:00:00Z'
                                        ? new Date(prediction.prediction.date_formed? prediction.prediction.date_formed : '').toLocaleString()
                                        : '-'}
                                </td>
                                <td>
                                    {prediction.prediction.date_completed !== '0001-01-01T02:30:17+02:30' && prediction.prediction.date_completed !== '0001-01-01T00:00:00Z'
                                        ? new Date(prediction.prediction.date_completed? prediction.prediction.date_completed : '').toLocaleString()
                                        : '-'}
                                </td>
                                {role==2 && (
                                    <>
                                        <td>{prediction.username}</td>
                                        <td>{prediction.prediction.status === 'pending'
                                            ? <div className="status-buttons">
                                                <button className="status-button" onClick={() => updateStatus(prediction.prediction.prediction_id? prediction.prediction.prediction_id : 0, "completed")}>
                                                    Одобрить
                                                </button>
                                                <button className="status-button" onClick={() => updateStatus(prediction.prediction.prediction_id? prediction.prediction.prediction_id : 0, "denied")}>
                                                    Отклонить
                                                </button>
                                            </div> : "-"}
                                        </td>
                                    </>
                                )}
                                <td>
                                {prediction.prediction.status != 'done' ? (
                                   <img className="status-icon" src={time} alt="Time Icon" />
                                 ) : (
                                   <div className="qr-hover-wrapper">
                                     <img className="status-icon" src={open_link} alt="QR Icon" />
                                     <div className="qr-hover">
                                       {prediction.prediction.qr && <img className="qr-code" src={`data:image/png;base64,${prediction.prediction.qr}`} alt="QR Code" />}
                                     </div>
                                   </div>
                                 )}
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9}>Предсказаний не существует.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            </div>
        </>
    );
};

export default PredictionsPage;