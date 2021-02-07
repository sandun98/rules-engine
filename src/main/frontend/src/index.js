import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1565c0',
        },
        secondary: {
            main: '#0277bd',
        },
    },
});
ReactDOM.render(
    <React.StrictMode>
        <MuiThemeProvider theme={theme}>
        <App/>
        </MuiThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);


