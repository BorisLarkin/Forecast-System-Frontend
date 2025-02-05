//import "./VacancyApplicationPage.css"
import { FC } from 'react';
import { Col, Row, Image, Alert } from "react-bootstrap";
import "./PredictionPage.css"
import "../../components/global.css"
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import  ForecastCard  from '../../components/ForecastCard/ForecastCard';
import Header from "../../components/Header/Header";

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store.ts';
import { getPrediction, } from '../../store/slices/predictionDraftSlice.ts';
import { setHeaderMode } from "../../store/slices/modeSlice.ts";

const PredictionPage: FC = () => {
  const { prediction_id } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    forecasts,
    predictionData,
    error,
  } = useSelector((state: RootState) => state.predictionDraft);

  useEffect(() => {
    if (prediction_id) {
      dispatch(getPrediction(Number(prediction_id)));
    }
  }, [dispatch]);

  const handleCardClick = (city_id: number | undefined) => {
    navigate(`${ROUTES.FORECAST}/${city_id}`);
  };

  useEffect(() => {
      dispatch(setHeaderMode("dark"));
      console.log("Written dark")
  }, []);
  
  return (
    <div>
      <div className='body' style={{width: 'auto'}}>
      <Header up={true}/>
      <div className="container-2" style={{ width: '100%' }}>  
        <div className="fav-content all-contain" style={{ width: '100%' }}>
          {error && <Alert variant="danger" style={{ width: '15vw'}}>{error}</Alert>}
          <Col md={8} xs={8} style={{margin: '5px', marginTop: '20px', width: 'auto'}}>
            <h1>Предсказание</h1>
          </Col>
          <div>
            <h4 style={{width: 'auto'}}>Номер заявки: {prediction_id}</h4>
            <h4 style={{width: 'auto'}}>Окно расчета: {predictionData.prediction_window}</h4>
            <h4 style={{width: 'auto'}}>Кол-во расчетов: {predictionData.predictions_amount}</h4>
          </div>
          <h1>Выбранные прогнозы для предсказания</h1>
          <div className="cards-wrapper-2 d-flex flex-column" style={{minWidth: '100%', width:'auto', gap: '20px'}}>
            {forecasts.length ? (
              forecasts.map((item) => (
                <ForecastCard
                  forecast={item}
                />
              ))
            ) : (
              <section className="cities-not-found">
                <h1>К сожалению, пока ничего не найдено :(</h1>
              </section>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PredictionPage;