import { createContext } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Home } from './pages/home';
import * as rdd from 'react-device-detect'



export const DeviceContext = createContext({
  mobile: false
});

const router = createBrowserRouter([
  {
    path: "/:location?",
    element: <Home/>,
  },
]);

function App() {
  return (
    <DeviceContext.Provider value={{mobile: rdd.isMobile}}>
      <RouterProvider router={router} />
    </DeviceContext.Provider>
  );
}

export default App;
