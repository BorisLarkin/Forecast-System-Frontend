import ReactDOM from 'react-dom/client';
import App from './App'
import store from "./store/store";
import { Provider } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
        <Provider store={store}>
            <App />
        </Provider>
)

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("./serviceWorker.js")
            .then(() => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}