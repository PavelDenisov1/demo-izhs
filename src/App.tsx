import { createContext, useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { Home } from './pages/home';
import * as rdd from 'react-device-detect'
import { getUserInfo, setUserId } from './shared/MetricApi';


export const DeviceContext = createContext({
  mobile: false
});

export const UserContext = createContext({
  user: null,
  id: null
});

const router = createBrowserRouter([
  {
    path: "/product/izhsnotcadaster/:location?/",
    element: <Home/>,
  },
]);

function App() {
  const [id, setId] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUserId(setId)
  }, [])

  useEffect(() => {
    if(id) getUserInfo(id, setUser)
  }, [id])
  

  return (
    <DeviceContext.Provider value={{ mobile: rdd.isMobile }}>
      <UserContext.Provider value={{ user: user,  id: id}}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </DeviceContext.Provider>
  );
}

export default App;
