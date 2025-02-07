//import "./VacancyApplicationPage.css"
import { FC } from 'react';
import { Col, Row, Image, Alert, Button } from "react-bootstrap";
import "./PredictionPage.css"
import "../../components/global.css"
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import  ForecastCard  from '../../components/ForecastCard/ForecastCard';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs.tsx';
import Header from "../../components/Header/Header";
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store.ts';
import { getPrediction, setAmount, setWindow, setError, setForecsInput, updatePrediction, deletePrediction, editForecastInPrediction} from '../../store/slices/predictionDraftSlice.ts';
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

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prediction_id) {
      try {
        await dispatch(deletePrediction(prediction_id)).unwrap();
        navigate(ROUTES.FORECASTS);
      } catch (error) {
        dispatch(setError(error));
      }
    }
  };

  const handleSaveVacancy = () => {
    if (prediction_id) {
      try {
        dispatch(updatePrediction({ prId: prediction_id, predictionData: predictionData }));
        forecasts.map((item) => {
          let final_string=""
          item.measurements?.map((meas) => {
            final_string += meas.value
            final_string += ','
          })
          final_string = final_string.substring(0, final_string.length - 1);
          if (final_string!=undefined){
            dispatch(setForecsInput(final_string))
            dispatch(editForecastInPrediction({prediction_id: Number(prediction_id), forecast_id: Number(item.forecast_id), inp: final_string}))  
          }
        })
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }

  useEffect(() => {
      dispatch(setHeaderMode("dark"));
      console.log("Written dark")
  }, []);
  
  return (
    <div>
      <div className='body' style={{width: 'auto', minWidth: '100vw'}}>
      <Header up={true}/>
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.PREDICTION, path: ROUTES.PREDICTION }]} />
      <div className="container-2" style={{ width: '100%' }}>  
        <div className="fav-content all-contain" style={{ width: '100%' }}>
        {(predictionData.Status == "draft") && (
          <Button className="clear-button" variant='danger' onClick={handleDelete}>
            Очистить
          </Button>
        )}
          {error && <Alert variant="danger" style={{ width: '15vw'}}>{error}</Alert>}
          <Col md={8} xs={8} style={{margin: '5px', marginTop: '20px', width: 'auto'}}>
            <h1>Предсказание</h1>
          </Col>
          <div className='sub-header-container'>
            <h4 style={{width: 'auto', margin: 0, height: 'min-content'}}>Номер заявки: {prediction_id}</h4>
            <div className='amount-window-flex'>
              <h4 style={{width: 'auto', margin: 0}}>Окно расчета:</h4>
              <input
                    type="text"
                    name="window"
                    className="big_input"
                    placeholder=""
                    maxLength={3}
                    value={predictionData.prediction_window?.toString()}
                    onChange={(event => dispatch(setWindow(event.target.value)))}
                    disabled={predictionData.Status!='draft'}
                />
            </div>
            <div className='amount-window-flex'>
            <h4 style={{width: 'auto', margin: 0}}>Количество расчетов:</h4>
              <input
                    type="text"
                    name="amount"
                    className="big_input"
                    placeholder=""
                    maxLength={2}
                    value={predictionData.predictions_amount?.toString()}
                    onChange={(event => dispatch(setAmount(event.target.value)))}
                    disabled={predictionData.Status!='draft'}
                />
            </div>
            <Button type="submit" className="save-button" onClick={handleSaveVacancy}>
              Сохранить
            </Button>
          </div>
          <h4 style={{marginTop: '4%'}}>Выбранные прогнозы для предсказания</h4>
          <div className="cards-wrapper-2 d-flex flex-column" style={{minWidth: '100%', width:'auto', gap: '20px', marginTop: '10px'}}>
            {forecasts.length ? (
              forecasts.map((item) => (
                <ForecastCard
                  key={item.forecast_id}
                  forecast={item}
                  pred_status={predictionData.Status!=null? predictionData.Status : ""}
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