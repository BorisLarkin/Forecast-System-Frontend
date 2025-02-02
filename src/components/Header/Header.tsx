import { Nav, Navbar,Container, Image } from 'react-bootstrap';
import {ROUTES} from "../../Routes"
import { RootState, AppDispatch } from "../../store/store";
import "./Header.css"
import "../global.css"
import logo_dark from "../../logo_dark.svg"
import logo_light from "../../logo_light.svg"
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from 'react';
import { logoutUserAsync } from '../../store/slices/userSlice'; 
import { setSearchValue, getForecastsList } from '../../store/slices/forecastsSlice';

const Header: React.FC = () => {
  const mode = useSelector((state: RootState) => state.mode.header);
  const[loaded_logo, setLoaded] = useState("");
  var isLight = (mode=="light")

  useEffect(() => {
    if (mode == "light" || mode =="dark"){
      setLoaded("http://127.0.0.1:9000/test/logo_"+mode+".svg")
    }
    isLight = (mode=="light")
  }, [mode]);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {role, login} = useSelector((state: RootState) => state.user); 

  // Обработчик события нажатия на кнопку "Выйти"
  const handleExit = async ()  => {
    await dispatch(logoutUserAsync());
  
    dispatch(setSearchValue('')); 
    
    navigate('/forecasts'); // переход на страницу списка услуг
  
    await dispatch(getForecastsList()); // для показа очищения поля поиска
  }

  return (
      <div className='header'>
          <div className={`${isLight ? 'header_bg_light' : 'header_bg_dark'}`}></div>
            <Link to={ROUTES.HOME}>
              <span className={`${isLight ? 'header_logo_lbl_light' : 'header_logo_lbl_dark'}`}>Погода</span>
            </Link>
            <Link to={ROUTES.HOME}>
              {isLight 
              ? <Image className={'header_img'} src={logo_light || loaded_logo}></Image>
              : <Image className={'header_img'} src={logo_dark || loaded_logo}></Image>
              }
            </Link>
          <Navbar expand="lg" variant={isLight ? "dark" : "light"} className={`navigation ${isLight ? 'light' : 'dark'}`}>
              <Container>
                <a href="#"></a>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className={`${isLight ? 'nav_collapse_light' : 'nav_collapse_dark'}`}>
                  <Nav className="me-auto">
                    {(role != 0 ) && (
                      <Nav.Link style={{marginLeft: 2}} href={"/Forecast-System-Frontend" + ROUTES.PROFILE}>{login}</Nav.Link>
                    )}
                    <Nav.Link style={{marginLeft: 2}} href={"/Forecast-System-Frontend" + ROUTES.FORECASTS}>Прогнозы</Nav.Link>
                    {(role == 0 ) && (
                      <Nav.Link style={{marginLeft: 2}} href={"/Forecast-System-Frontend" + ROUTES.LOGIN}>Войти</Nav.Link>
                    )}
                    {(role != 0) && (
                      <Nav.Link style={{marginLeft: 2}} onClick={handleExit}>Выйти</Nav.Link>
                    )}
                  </Nav>
                </Navbar.Collapse>
              </Container>
          </Navbar>
      </div>
  );
};

export default Header;