import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Scene from './comp/mouse';
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCAm-xSF7xuCXefu_4T2T3rfqRx9otDRQI&callback=myMap"></script>


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

