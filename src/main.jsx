// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import App from './App.jsx'
import { router } from './router/index';
import 'antd/dist/reset.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
    <App />
  </React.StrictMode>,
)
