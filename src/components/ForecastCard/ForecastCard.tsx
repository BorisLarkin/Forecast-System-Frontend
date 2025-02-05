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
import MeasurementList from '../MeasureInput/MeasureInput'

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
        <div className="fav-card" style={{height: 'auto', marginRight: '10px', marginLeft: '10px'}}>
            <Row style={{overflow: 'hidden', margin: 0, width: '100%', flexWrap: 'nowrap', height: 'auto', padding: 0, minWidth: '180px'}}>
                <Col className="sth-sth" xs={2} sm={2} md={2} style={{padding: 0}}>
                    <div className="d-flex justify-center" style={{height: '100%', margin: 0}}>
                        <img src={forecast.image || image} alt={forecast.short_title} style={{width: '100%', objectFit: 'cover'}}/>
                    </div>
                </Col>
                <Col xs={10} sm={10} md={10} style={{width: '70%', display: 'flex', alignItems: 'center'}}>
                    <div className="fav-card-body" style={{width: 'auto'}}>
                        <h5 style={{width: 'auto', wordBreak: 'break-all', wordWrap: 'break-word'}}>{forecast.short_title}</h5>
                        <div className="form-group">
                            <Row style={{margin: 0, width: '100%', alignItems: 'center'}}>
                                <Col xs={3} sm={3} md={3} style={{width: 'auto', padding: 0}}>
                                    <label className="form-label" style={{width: 'auto', wordBreak: 'break-all', margin: 0}}>Количество показаний: </label>
                                </Col>
                                <Col xs={9} sm={9} md={9} style={{width: 'auto', padding: 0, marginLeft: '5px'}}>
                                    <input
                                        style={{width: '40px'}}
                                        type="number"
                                        className="localcount"
                                        value={0}
                                        disabled
                                    />
                                </Col>
                            </Row>
                        </div>
                        <Row style={{width: 'auto', margin: 0, wordBreak: 'break-all' }}>
                            <Col md={3} xs={3} style={{width: 'auto', padding: 0}}>
                                <a onClick={() => handleDetails()} className="fav-btn-open">
                                    Подробнее
                                </a>
                            </Col>
                            <Col md={3} xs={3} style={{width: 'auto'}}>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <MeasurementList forecast={forecast} measure_amount={4}/>
        </div>
    );
  }
};

export default ForecastCard;