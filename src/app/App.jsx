import '../styles/global.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Base from '../pages/Base/Base';
import Landing from '../pages/Landing';
import SelectEgg from '../pages/SelectEgg/SelectEgg';
import Shop from '../pages/Shop/Shop';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Landing/>}/>
          <Route path={"/base"} element={<Base/>}/>
          <Route path={"/select-egg"} element={<SelectEgg/>}/>
          <Route path={"/shop"} element={<Shop/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
