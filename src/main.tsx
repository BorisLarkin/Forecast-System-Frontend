import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import ContextWrapper from "./components/ContextWrapper/ContextWrapper.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ContextWrapper/>
  </React.StrictMode>
)