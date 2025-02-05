import React, { useEffect, useState } from 'react';
import { RootState, AppDispatch } from "../../store/store.ts";
import "../../components/global.css"
import { useSelector, useDispatch } from "react-redux";
import { Forecast } from '../../modules/types.ts';
import { setForecsMeasure } from '../../store/slices/predictionDraftSlice.ts'
import "./MeasureInput.css"

interface ListProps {
    measure_amount: number
    forecast: Forecast
}

interface reducerResponse {
    value: string,
    forecast_id: number,
    index: number
}

const MeasurementList: React.FC<ListProps> = ({ measure_amount, forecast }) => {
    const dispatch = useDispatch<AppDispatch>();

    const fs = useSelector((state: RootState) => state.predictionDraft.forecasts); 
    const f = fs.find(t=>t.forecast_id===forecast.forecast_id);
    const meas = f?.measurements

     const handleChange = (value: string, forecast_id: number, index: number)  => {
        const req: reducerResponse = {
            value: value,
            forecast_id: forecast_id,
            index: index,
        }
        dispatch(setForecsMeasure(req))
      }

    if (meas==undefined){
        const items = Array.from(Array(measure_amount).keys())
        const listItems = items.map((item) =>
            // Correct! Key should be specified inside the array.
            <input
                  key={item}
                  type="text"
                  name="input"
                  className="input_cell"
                  placeholder=""
                  value={""}
                  onChange={(event =>handleChange("", item, forecast.forecast_id))}
              />
          );
        return (
            <div key={forecast.forecast_id} className={'InputsContainerLine'}>
              {listItems}
            </div>
          );
    }
    else{
        const listItems = meas.map((item) =>
            // Correct! Key should be specified inside the array.
            <input
                  key={item.index}
                  type="text"
                  name="input"
                  className="input_cell"
                  placeholder=""
                  value={item.value ? item.value : ""}
                  onChange={(event =>handleChange(item.value? event.target.value : "", item.index? item.index : 0, forecast.forecast_id))}
              />
          );
          return (
            <div className={'InputsContainerLine'} key={forecast.forecast_id}>
              {listItems}
            </div>
          );
    }
}

export default MeasurementList
