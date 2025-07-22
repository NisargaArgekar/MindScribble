import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/home" element={<Home />} />
        <Route path = "/" element={<Auth/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
