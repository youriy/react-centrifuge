import ReactDOM from "react-dom";
import React from "react";
import Centrifuga from "./components/Centrifuga.jsx";
import DenseAppBar from "./components/DenseAppBar.jsx";
import { SnackbarProvider } from "notistack";
import "./sass/main.scss";

ReactDOM.render(
    <SnackbarProvider
        maxSnack={6}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
    >
        <DenseAppBar />
        <Centrifuga />
    </SnackbarProvider>,
    document.getElementById("app")
);
