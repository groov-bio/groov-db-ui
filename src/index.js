import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
if (module.hot) {
  module.hot.accept();
}
root.render(
  <BrowserRouter>
    <SnackbarProvider maxSnack={1}>
      <App />
    </SnackbarProvider>
  </BrowserRouter>
);
