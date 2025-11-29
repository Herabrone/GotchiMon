import Base from '../pages/Base';
import Landing from '../pages/Landing';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import '../styles/global.css';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Landing/>}/>
          <Route path={"/base"} element={<Base/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
