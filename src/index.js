import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import 'react-loading-skeleton/dist/skeleton.css'

/*primeReact*/
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import { store } from './app/store'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"></link>
    <Provider store={store}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId="6481in7ff7nt.com">
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Provider>
  </>
);

reportWebVitals();
