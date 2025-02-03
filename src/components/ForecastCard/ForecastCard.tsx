import {Forecast} from "../../modules/types.ts";
import {FC} from "react";
import { Button, Card } from "react-bootstrap";
import "./ForecastCard.css"
import "../global.css"
import { ROUTES } from "../../Routes.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import image from "../../defaultImage.png"
import {Row, Col} from 'react-bootstrap'
import { addForecastToPrediction, } from '../../store/slices/predictionDraftSlice.ts';
import { getForecastsList } from '../../store/slices/forecastsSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store.ts';

type ForecastCardProps = {
    forecast: Forecast;
}

const ForecastCard: FC<ForecastCardProps> = ({forecast}) => {
    const navigate = useNavigate()
    const handleDetails = () => {
      navigate(ROUTES.FORECAST+String(forecast.forecast_id))  
    }
    const handleAdd = async () => {
        if (forecast.forecast_id) {
            await dispatch(addForecastToPrediction(forecast.forecast_id));
            await dispatch(getForecastsList()); // Для обновления отображения состояния иконки "корзины" 
        }
    }
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const role = useSelector((state: RootState) => state.user.role);
  if (pathname === '/forecasts'){
  return (
    <div className="forecast">
      <div className="forecast_fade" style={{backgroundImage: `linear-gradient(0deg, rgba(${forecast.color}) 0%, rgba(255, 255, 255, 0) 100%)`}}></div>
      <Card className="forecast_card shadow_custom" style={{ backgroundColor: `rgba(${forecast.color})`}}>
       <Card.Img className="forecast_img" variant="top" src={forecast.image || image} onClick={handleDetails}/>
       <div className="inside_card">
       <Card.Body className="content_block">
         <Card.Title className="card_title" onClick={handleDetails}>{forecast.title}</Card.Title>
         <Card.Text className="card_desc" style={{marginBottom: 0}}>
           {forecast.descr}
         </Card.Text>
       </Card.Body>
       <Button className="btn_add shadow_custom" variant="outline-dark" onClick={handleDetails}>Перейти</Button>
       {(role > 0 ) && (
       <Button className="btn_add shadow_custom" variant="outline-dark" onClick={handleAdd}>Добавить</Button>
        )}
       </div>
     </Card>
    </div>
  );
  }
  if (pathname.includes("/prediction")) {
    return (
        <div className="fav-card">
            <Row>
                <Col xs={2} sm={2} md={2}>
                    <div className="d-flex justify-center">
                        <img src={forecast.image || image} alt={forecast.short_title} />
                    </div>
                </Col>
                <Col xs={10} sm={10} md={10}>
                    <div className="fav-card-body">
                        <h5>{forecast.short_title}</h5>
                        <div className="form-group">
                            <Row>
                                <Col xs={3} sm={3} md={3}>
                                    <label className="form-label">Количество вакансий: </label>
                                </Col>
                                <Col xs={9} sm={9} md={9}>
                                    <input
                                        type="number"
                                        className="localcount"
                                        value={0}
                                        disabled
                                    />
                                </Col>
                            </Row>
                        </div>
                        <Row>
                            <Col md={3} xs={3}>
                                <a onClick={() => handleDetails()} className="fav-btn-open">
                                    Подробнее
                                </a>
                            </Col>
                            <Col md={3} xs={3}>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
  }
};

export default ForecastCard;