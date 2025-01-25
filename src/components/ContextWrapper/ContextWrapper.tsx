import {useState} from "react";
import App from "../../App.tsx";
import Header from "../Header/Header.tsx";
import { useEffect } from "react";


const ContextWrapper = () => {
  const [mode, setMode] = useState('');

  useEffect(() => {
    setMode("dark") //by default
    console.log("Written dark by default")
  }, []);

  return (
    <>
      <Header mode={mode} />
      <App setMode={setMode}/>
    </>
)
}

export default ContextWrapper;