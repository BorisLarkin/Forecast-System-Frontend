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
  var image;
  
  var isLight = (mode=="light")

  useEffect(() => {
    if (mode == "light" || mode =="dark"){
      setLoaded("http://127.0.0.1:9000/test/logo_"+mode+".svg")
      if (mode == "dark"){
        image = logo_dark
      }
      else {
        image = logo_light
      }
    }
    isLight = (mode=="light")
    console.log("checked header: ", mode)
  }, [mode]);

    return (
        <div className='header'>
            <div className={`${isLight ? 'header_bg_light' : 'header_bg_dark'}`}></div>
            <div className={'header_logo'}>
              <a href={`/`}>
                <span className={`${isLight ? 'header_logo_lbl_light' : 'header_logo_lbl_dark'}`}>Погода</span>
              </a>
              <a href={`/`}>
                <Image className={`${isLight ? 'header_img_light' : 'header_img_dark'}`} src={loaded_logo || image}></Image>
              </a>
            </div>                                                                                                                                                                                                                                                                                                          
            <Navbar expand="lg" className={`navigation ${isLight ? 'light' : 'dark'}`}>
                <Container>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                      <Nav.Link href={ROUTES.FORECASTS}>Прогнозы</Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default Header;