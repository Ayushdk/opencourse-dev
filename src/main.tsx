import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

const basename = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <HashRouter basename={basename}>
            <App />
        </HashRouter>
    </Provider>
);