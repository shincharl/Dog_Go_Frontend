import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./page/Layout";
import Signin from "./page/Signin";
import Home from "./page/Home";
import Service from "./page/Service";
import Allreservation from "./page/Allreservation";
import Qna from "./page/Qna";
import Modify from "./page/Modify";
import MasterPage from "./page/MasterPage";
import TrackingMyDogWriter from "./page/TrackingMyDogWriter";
import TrackingMyDogReader from "./page/TrackingMyDogReader";
//import Signup from "./page/Signup";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} /> {/*기본 홈 페이지*/}
          <Route path="masterpage" element={<MasterPage />} />
          <Route path="/allReservation" element={<Allreservation />} />
          <Route path="service" element={<Service />} />
          <Route path="qna" element={<Qna />} />
          <Route path="modify/:id" element={<Modify />} />
          <Route path="/tracking/:id" element={<TrackingMyDogWriter />} />
          <Route path="trackinglist" element={<TrackingMyDogReader />} />
        </Route>
        {/*중첩 라우트의 path는 절대 경로가 아닌 상대경로를 써야 한다.*/}
        <Route path="/signin" element={<Signin />} />
        {/* <Route path="/signup" element={<Signup />}></Route> */}
      </Routes>
    </>
  );
}

export default App;
