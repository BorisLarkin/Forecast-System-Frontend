import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PredictionsPage.css';
import Header from "../../components/Header/Header.tsx";
import {ROUTE_LABELS, ROUTES} from "../../Routes.tsx";
import {BreadCrumbs} from "../../components/BreadCrumbs/BreadCrumbs.tsx";
import {DsPredictions, Api} from "../../api/Api.ts";
import { returnHeaderConfig } from '../../store/slices/userSlice.ts';
import { getPredictions } from '../../store/slices/predictionDraftSlice.ts';
import { api } from '../../api/index.ts';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store.ts';
import { setHeaderMode } from "../../store/slices/modeSlice.ts";

const PredictionsPage: React.FC = () => {
    const [predictions, setPredictions] = useState<DsPredictions[]>([]);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    let status=null
    let start_date=null
    let end_date=null
    const header = returnHeaderConfig().headers.Authorization

    const fetchPredictions = async () => {
        try {
            const response = await api.instance.get(`/predictions`, {
                params: {
                    status,
                    start_date,
                    end_date
                },
                headers:{
                    "Authorization": header,
                }
            });
            setPredictions(response.data);
        } catch (err) {
            setError("Ошибка при загрузке.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        dispatch(setHeaderMode("dark"));
        console.log("Written dark")
        fetchPredictions(); 
        const interval = setInterval(fetchPredictions, 30000);
        return () => clearInterval(interval);
    }, []);    

    return (
        <>
        <Header/>
        <div className='body'>
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.PREDICTIONS, path: ROUTES.PREDICTIONS }]} />
            <div className="predictions-page">
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
                    </tr>
                    </thead>
                    <tbody>
                    {predictions.length > 0 ? (
                        predictions.map((prediction) => (
                            <tr
                                key={prediction.prediction_id}
                                className="clickable-row"
                                onClick={() => navigate(`/prediction/${prediction.prediction_id}`)}
                            >
                                <td>{prediction.prediction_id}</td>
                                <td>
                                    {prediction.status}
                                </td>
                                <td>
                                    {prediction.prediction_amount}
                                </td>
                                <td>{new Date(prediction.date_created? prediction.date_created : '').toLocaleString()}</td>
                                <td>
                                    {prediction.date_formed !== '0001-01-01T02:30:17+02:30' && prediction.date_formed !== '0001-01-01T00:00:00Z'
                                        ? new Date(prediction.date_formed? prediction.date_formed : '').toLocaleString()
                                        : '-'}
                                </td>
                                <td>
                                    {prediction.date_completed !== '0001-01-01T02:30:17+02:30' && prediction.date_completed !== '0001-01-01T00:00:00Z'
                                        ? new Date(prediction.date_completed? prediction.date_completed : '').toLocaleString()
                                        : '-'}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6}>Предсказаний не существует.</td>
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