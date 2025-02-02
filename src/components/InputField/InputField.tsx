import React from "react";
import { AppDispatch } from "../../store/store.ts";
import "./InputField.css";
import "../../components/global.css"
import { useDispatch } from "react-redux";
import search from "../../search.svg"
import { Image } from "react-bootstrap";
import { getForecastsList, setSearchValue} from '../../store/slices/forecastsSlice.ts';


interface Props {
    value: string
    loading?: boolean
}

const InputField: React.FC<Props> = ({ value, loading }) => {

    const dispatch = useDispatch<AppDispatch>();

    return (  
        <>
                <div className="search">
                    <form onSubmit={() => dispatch(getForecastsList())}>
                        <input
                            type="text"
                            name="search"
                            className="value"
                            placeholder="Поиск..."
                            value={value}
                            onChange={(event => dispatch(setSearchValue(event.target.value)))}
                        />
                        <button type="submit" disabled={loading} className="search_btn" style={{zIndex:2, cursor: "pointer"}}></button>
                        <Image className="search_btn" src={search || "http://127.0.0.1:9000/test/search.svg"}/>
                    </form>
                </div>
        </>
    );
};

export default InputField