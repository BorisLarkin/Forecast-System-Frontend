import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import store from "./store/store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
)

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(() => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}