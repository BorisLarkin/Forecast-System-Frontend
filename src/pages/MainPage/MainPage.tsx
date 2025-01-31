import { useState } from 'react';
import "./MainPage.css"
import "../../components/global.css"
import {Button, Image} from "react-bootstrap";
import image from "../../clouds.gif"
import {ROUTES} from "../../Routes.tsx";
import { setHeaderMode } from "../../store/slices/modeSlice.ts";
import Header from '../../components/Header/Header';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const MainPage = () => {
    const dispatch = useDispatch();
    const[loaded_bg] = useState("http://127.0.0.1:9000/test/clouds.gif");

    dispatch(setHeaderMode("light"));
    console.log("Written light")

    return (
        <>
            <Header/>
            <main className="body main-container">
                <span  className="home_title">Прогноз погоды</span>
                <span  className="home_desc">Предскажем, когда Вам поехать на шашлыки</span>
                <Link to={ROUTES.FORECASTS} style={{zIndex:3}}>
                    <Button variant="outline-light" className="btn_resume" style={{zIndex: 5}}>Продолжить</Button>
                </Link>
                <div className="home_bg_fade"></div>
            </main>
            <Image className="home_bg_img" src={image || loaded_bg}/>
        </>
    );
};

export default MainPage;
