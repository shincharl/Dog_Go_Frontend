import Styles from '../css/header.module.css';
import {Link} from 'react-router-dom';
const Header = ({ toggleSidebar, userData, onLogout, timeLeft }) => {

  // 로그인 남은 시간 ms -> 분:초 변환
  const formatTime = (ms) => {
    if (!ms) return "00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
  }


  return (
    <>
      <nav className={`navbar navbar-expand-lg bg-body-tertiary ${Styles.navbarSticky}`}>
        <div className="container-fluid d-flex align-items-center">

          {/* 왼쪽 끝: 로고 */}
          <Link to="/" className="navbar-brand">웹 사이트</Link>

          {/* 오른쪽 끝으로 밀기 */}
          <div className="d-flex align-items-center ms-auto">

          {/* 로그인시 사용자 정보 표시 */}
            {userData ? (
              <>
                <p style={{"marginTop" : "2%"}}>
                  {userData.name}님 환영합니다! &nbsp;
                  <span style={{ color: "red", fontWeight: "bold"}}>
                      {formatTime(timeLeft)}
                  </span>
                </p>
                <span style={{marginLeft : "20px"}}></span>
                
                <button className="btn btn-outline-danger ms-2" onClick={onLogout}>
                  로그아웃
                </button>
                <span style={{marginLeft : "20px"}}></span>
                
              </>
            ) : (
              <>
                <Link to="/signin">관리자 로그인</Link>
                <span style={{marginLeft : "20px"}}></span>
              </>
            )}

            {/* 메뉴 버튼 */}
            <button onClick={toggleSidebar} className={`btn btn-outline-primary ${Styles.push_menu} me-3`}>
              ☰ 메뉴
            </button>

            {/* 내비게이션 메뉴 */}
            <ul className="navbar-nav d-flex flex-row mb-0">
              <li className="nav-item me-3">
                <Link to="/masterpage" className="nav-link active">관리페이지</Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/trackinglist" className="nav-link active">일일 강아지 산책 기록</Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/allReservation" className="nav-link active">예약확인</Link>
              </li>
               <li className="nav-item me-3">
                <Link to="/service" className="nav-link active">서비스 요금</Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/qna" className="nav-link active">QnA</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;