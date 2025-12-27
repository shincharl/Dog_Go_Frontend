import {Outlet} from "react-router-dom"
import Header from "../components/header";
import Footer from "../components/footer";
import Screen from "../components/screen";
import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import {useNavigate, useLocation} from "react-router-dom";

const Layout = () =>{

     // 로그인 상태 관리 1
      const location = useLocation();
      const navigate = useNavigate();

      // 로그인 시 전달된 userData를 상태로 관리
      // 여기서 느낀점 : 각각 상태로 넘어가게 따로 파일을 만들어 데이터 넘어가는것만 관리할 수도 있겠다....
      // 여기서 느낀점 : 근데 리덕스 공부하니까 그냥 전역으로 리덕스에서 관리할것 같다... 로그인 정보는 전역으로 사용하니까
       const [userData, setUserData] = useState(() => {
            const saved = localStorage.getItem("userData");
            return saved ? JSON.parse(saved) : location.state?.userData || null;
       }); 

      const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
      const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
      const closeSidebar = () => setIsSidebarOpen(false);

      // 로그인 타이머 시간 관리 훅
      const [timeLeft, setTimeLeft] = useState(0); // 남은 시간(ms)

      // 로그아웃 상태 관리 
      const handleLogout = () =>{
        setUserData(null);
        localStorage.removeItem("userData");
        localStorage.removeItem("loginExpireTime");
        navigate("/");
      };
      
      // 마운트 시 localStorage에서 userData 초기화
      useEffect(() => {
        const savedUser = localStorage.getItem("userData");
        if(savedUser){
            setUserData(JSON.parse(savedUser));
        } else if(location.state?.userData){
            // 로그인 직후 다른 페이지로 넘어올 때
             setUserData(location.state.userData);
             localStorage.setItem("userData", JSON.stringify(location.state.userData));
            // 로그인 만료 시간 초기화
             const LOGIN_DURATION = 30 * 60 * 1000; // 30분
             localStorage.setItem("loginExpireTime", Date.now() + LOGIN_DURATION);
        }
      }, [location.state]);

      // 로그인 타이머
      useEffect(() => {
        
        if(!userData) return;

        const LOGIN_DURATION = 30 * 60 * 1000; // 30분
        // 브라우저에 데이터를 키/값 형태로 저장, 브라우저를 닫거나 새로고침해도 남아있음
        let expireTime = localStorage.getItem("loginExpireTime");


        if(!expireTime) {
            // 로그인 직후에만 만료 시간 새로 설정
            expireTime = Date.now() + LOGIN_DURATION;
            localStorage.setItem("loginExpireTime", expireTime);
        } else {
            expireTime = parseInt(expireTime, 10);
        }

        const timer = setInterval(() => {
            const remaining = expireTime - Date.now();
            if(remaining <= 0){
                clearInterval(timer); // 시간 초기화
                alert("로그인 시간이 만료되어 로그아웃 됩니다.");
                handleLogout();
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);
    
        return () => clearInterval(timer);

      }, [userData]);

    return(
        <>
            <Header toggleSidebar={toggleSidebar} userData = {userData} onLogout={handleLogout} timeLeft={timeLeft}></Header>
            <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} userData = {userData} onLogout = {handleLogout} />
            <Screen>
                <Outlet context = {{ userData }}/>
            </Screen>
            <Footer></Footer>
        </>
    );
}

export default Layout;