import { Nav, Navbar,Container, Image } from 'react-bootstrap';
import {ROUTES} from "../../Routes"
import { RootState } from "../../store/store";
import "./Header.css"
import "../global.css"
import logo_dark from "../../logo_dark.svg"
import logo_light from "../../logo_light.svg"
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';


const Header: React.FC = () => {
  const mode = useSelector((state: RootState) => state.mode.header);
  const[loaded_logo, setLoaded] = useState("");
  var isLight = (mode=="light")

  useEffect(() => {
    if (mode == "light" || mode =="dark"){
      setLoaded("http://127.0.0.1:9000/test/logo_"+mode+".svg")
    }
    isLight = (mode=="light")
    console.log("checked header: ", mode)
  }, [mode]);

    return (
        <div className='header'>
            <div className={`${isLight ? 'header_bg_light' : 'header_bg_dark'}`}></div>
              <a href={`/`}>
                <span className={`${isLight ? 'header_logo_lbl_light' : 'header_logo_lbl_dark'}`}>Погода</span>
              </a>
              <a href={`/`}>
                {isLight 
                ? <Image className={'header_img'} src={logo_light || loaded_logo}></Image>
                : <Image className={'header_img'} src={logo_dark || loaded_logo}></Image>
                }
              </a>
            <Navbar expand="lg" variant={isLight ? "dark" : "light"} className={`navigation ${isLight ? 'light' : 'dark'}`}>
                <Container>
                  <a href="#"></a>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav" className={`${isLight ? 'nav_collapse_light' : 'nav_collapse_dark'}`}>
                    <Nav className="me-auto">
                      <Nav.Link href={ROUTES.FORECASTS} style={{marginLeft: 2}}>Прогнозы</Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default Header;