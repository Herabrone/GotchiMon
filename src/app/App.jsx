import '../styles/global.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DialogueProvider } from '../utils/dialogueContext';

import Base from '../pages/Base/Base';
import Landing from '../pages/landing/Landing';
import SelectEgg from '../pages/SelectEgg/SelectEgg';
import Evolution from '../pages/Evolution';

function App() {

  return (
    <>
      <DialogueProvider>
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<Landing/>}/>
            <Route path={"/base"} element={<Base/>}/>
            <Route path={"/select-egg"} element={<SelectEgg/>}/>
            <Route path={"/evolution"} element={<Evolution/>}/>
          </Routes>
        </BrowserRouter>
      </DialogueProvider>
    </>
  )
}

export default App
