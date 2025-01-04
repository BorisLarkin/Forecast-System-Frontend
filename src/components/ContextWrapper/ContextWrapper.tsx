import {useState} from "react";
import App from "../../App.tsx";
import Header from "../Header/Header.tsx";


const ContextWrapper = () => {
  const [mode, setMode] = useState('');
  return (
    <>
      <Header mode={mode} />
      <App setMode={setMode}/>
    </>
)
}

export default ContextWrapper;