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

type TopDown = {
    up?: boolean | undefined;
}

const Header: React.FC<TopDown> = ({up}) => {
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
      <div className={up==true? 'header header_up' : 'header'}>
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
            <nav className='nav'>
                <div className='nav__wrapper'>
                    <div className='nav__links'>
                        {role >0 ? (
                            <>
                                <Link to={ROUTES.FORECASTS} className='nav__link'>Прогнозы</Link>
                                <Link to={ROUTES.PREDICTIONS} className='nav__link'>Предсказания</Link>
                                <Link to={ROUTES.PROFILE} className='nav__link'>{login}</Link>
                                <button className="nav__link" onClick={handleExit}>
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to={ROUTES.REGISTER} className='nav__link'>Регистрация</Link>
                                <Link to={ROUTES.LOGIN} className='nav__link'>Вход</Link>
                            </>
                        )}
                    </div>
                    <div className='nav__mobile-wrapper'
                         onClick={(event) => event.currentTarget.classList.toggle('active')}
                    >
                        <div className='nav__mobile-target'/>
                        <div className='nav__mobile-menu'>
                            {role>0 ? (
                                <>
                                    <Link to={ROUTES.FORECASTS} className='nav__link'>Прогнозы</Link>
                                    <Link to={ROUTES.PREDICTIONS} className='nav__link'>Предсказания</Link>
                                    <Link to={ROUTES.PROFILE} className='nav__link'>{login}</Link>
                                    <button className="nav__link" onClick={handleExit}>
                                        Выйти
                                    </button>
                                </>
                            ) : (
                                <>
                                <Link to={ROUTES.REGISTER} className='nav__link'>Регистрация</Link>
                                <Link to={ROUTES.LOGIN} className='nav__link'>Вход</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
      </div>
  );
};

export default Header;