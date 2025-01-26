import { Nav, Navbar,Container } from 'react-bootstrap';
import {ROUTES} from "../../Routes"
import "./Header.css"
import "../global.css"
import { Link } from 'react-router-dom';

interface Prop{mode: string,}

const Header: React.FC<Prop> = (prop: Prop) => {
    if (prop.mode=="light" || prop.mode=="dark"){
      var isLight = (prop.mode=="light")
      console.log(isLight, prop.mode)
    }
    else{
      var isLight = false
      console.log(isLight, "by default")
    }
    return (
        <div className='header'>
            <div className={`${isLight ? 'header_bg_light' : 'header_bg_dark'}`}></div>
            <div className={'header_logo'}>
              <a href={`/`}>
                <span className={`${isLight ? 'header_logo_lbl_light' : 'header_logo_lbl_dark'}`}>Погода</span>
              </a>
              <a href={`/`}>
                <div className={`${isLight ? 'header_img_light' : 'header_img_dark'}`}></div>
              </a>
            </div>                                                                                                                                                                                                                                                                                                          
            <Navbar expand="lg" className={`bg-body-tertiary navigation ${isLight ? 'light' : 'dark'}`}>
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