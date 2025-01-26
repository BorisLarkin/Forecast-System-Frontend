import { useState } from 'react';
import "./MainPage.css"
import "../../components/global.css"
import {Button, Image} from "react-bootstrap";
import image from "../../clouds.gif"
import { Link } from "react-router-dom";
import {ROUTES} from "../../Routes.tsx";
import { setHeaderMode } from "../../store/slices/modeSlice.ts";
import Header from '../../components/Header/Header';


const MainPage = () => {
    const[loaded_bg, setLoaded] = useState("http://127.0.0.1:9000/test/clouds.gif");

    setHeaderMode("dark");
    console.log("Written dark")

    return (
        <>
            <Header/>
            <main className="main-container">
                <div className="home_body">
                    <span  className="home_title">Прогноз погоды</span>
                    <span  className="home_desc">Предскажем, когда Вам поехать на шашлыки</span>
                    <Link to={ROUTES.FORECASTS}>
                        <Button variant="outline-light" className="btn_resume">Продолжить</Button>
                    </Link>
                </div>
                <div className="home_bg_fade"></div>
            </main>
            <Image className="home_bg_img" src={loaded_bg || image}/>
        </>
    );
};

export default MainPage;
