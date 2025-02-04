//import "./VacancyApplicationPage.css"
import { FC } from 'react';
import { Col, Row, Image, Alert } from "react-bootstrap";
import FavImage from "../../defaultImage.png"

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
      <Header />
      <div className='body'>
      <div className="container-2">  
        <div className="fav-content">
          {error && <Alert variant="danger" style={{ width: '15vw'}}>{error}</Alert>}
          <Row>
              <Col md={8} xs={8}>
                <h1>Предсказание</h1>
              </Col>
              <Col md={4} xs={4}>
                <Image src={FavImage}></Image>
              </Col>
          </Row>
          <div>
            <h4>Номер заявки: {prediction_id}</h4>
            <h4>Окно расчета: {predictionData.prediction_window}</h4>
            <h4>Кол-во расчетов: {predictionData.predictions_amount}</h4>
          </div>
          <h1>Выбранные прогнозы для предсказания</h1>
          <div className="cards-wrapper-2 d-flex flex-column">
            {forecasts.length ? (
              forecasts.map((item) => (
                <Col key={item.forecast_id}>
                  <ForecastCard
                    forecast={item}
                  />
                </Col>
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