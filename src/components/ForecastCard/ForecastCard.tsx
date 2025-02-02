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
    navigate(ROUTES.FORECAST+String(forecast.forecast_id))  
  }
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
       </div>
     </Card>
    </div>
  );
};

export default ChatCard;