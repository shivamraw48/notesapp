import { useState } from 'react'
import Home from './components/home'
import Login from './components/login'
import Signup from './components/signup'
import { createBrowserRouter, RouterProvider } from "react-router-dom";


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
]);


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
