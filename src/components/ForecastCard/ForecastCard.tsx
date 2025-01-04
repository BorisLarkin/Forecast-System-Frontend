import {Forecast} from "../../modules/types.ts";
import {FC} from "react";
import { Button, Card } from "react-bootstrap";
import "./ForecastCard.css"
import "../global.css"
import { ROUTES } from "../../Routes.tsx";
import { useNavigate } from "react-router-dom";
import image from "../../defaultImage.png"

type ForecastCardProps = {
    forecast: Forecast;
}

const ChatCard: FC<ForecastCardProps> = ({forecast}) => {
  const navigate = useNavigate()
  const handleDetails = () => {
    navigate(ROUTES.FORECAST+String(forecast.id))  
  }
  return (
    <div className="forecast">
      <div className="forecast_fade" style={{backgroundImage: `linear-gradient(0deg, rgba(${forecast.color}) 0%, rgba(255, 255, 255, 0) 100%)`}}></div>
      <Card className="forecast_card shadow" style={{ backgroundColor: `rgba(${forecast.color})`}}>
       <Card.Img className="forecast_img" variant="top" src={forecast.img || image} onClick={handleDetails}/>
       <Card.Body style={{paddingTop: '0px', paddingBottom: '0px', paddingLeft: '6px', paddingRight: '6px'}}>
         <Card.Title className="card_title" onClick={handleDetails}>{forecast.title}</Card.Title>
         <Card.Text className="card_desc" style={{marginBottom: 0}}>
           {forecast.desc}
         </Card.Text>
         <Button className="btn_add shadow" variant="light outline-dark" onClick={handleDetails}>Перейти</Button>
       </Card.Body>
     </Card>
    </div>
  );
};

export default ChatCard;