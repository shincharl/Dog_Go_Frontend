import Styles from '../css/sidebar.module.css';
import {Link} from 'react-router-dom';
import {X} from 'lucide-react'; 
const Sidebar = ({isOpen, closeSidebar, userData, onLogout}) => {

    const handleSidebarClick = (e) =>{
       e.stopPropagation(); // 버튼 클릭이 외부 클릭으로 처리되지 않도록 막음
    };


    return(
           <>
                {isOpen && (
                    <div className={Styles.overlay} onClick={closeSidebar}/>
                )}

                <div className={`${Styles.left_side} ${isOpen ? Styles.move : ''}`}
                     onClick={handleSidebarClick}
                     
                >
                    <div className={Styles.header}>
                        <h2 className={Styles.title}>Menu</h2>
                        <button className={Styles.closeBtn} onClick={closeSidebar}>
                            <X size={22}/>
                        </button>
                    </div>

                    {/* 로그인시 사용자 정보 표시 */}
                    <div className={Styles.userSection}>
                        {userData ? (
                          <>
                            <p className={Styles.welcome}>{userData.name}님 환영합니다!</p>
                            <button className="btn btn-outline-danger" onClick={onLogout}>
                                로그아웃
                            </button>
                          </>
                        ) : (
                                <Link to="/signin" className={Styles.loginLink}>관리자 로그인</Link>       
                        )}
                    </div>                     

                    <ul className={Styles.menuList}>
                        <li><Link to="/allReservation">예약확인</Link></li>
                        <li><Link to="/service">서비스 요금</Link></li>
                        <li><Link to="/qna">QnA</Link></li>
                    </ul> 
                </div>
           </>
    );
};

export default Sidebar;