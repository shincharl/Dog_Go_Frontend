import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import styles from '../css/signin.module.css';
import { login, signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

const AdminSignin = () => {
  const navigate = useNavigate();

  // 로그인 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 회원가입 상태
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [adminCode, setAdminCode] = useState(""); // 관리자 코드

  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await login(email, password);
      console.log("로그인 성공:", res.data);
      navigate("/", { state: { userData: res.data } });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "로그인 실패");
    }
  };

  // 관리자 회원가입
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !signupEmail || !signupPassword || !adminCode) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      const res = await signup(name, signupEmail, signupPassword, adminCode);
      console.log("회원가입 성공:", res.data);
      alert("관리자 회원가입 성공! 로그인 해주세요.");

      // 초기화 후 로그인 화면으로
      setIsLogin(true);
      setName("");
      setSignupEmail("");
      setSignupPassword("");
      setAdminCode("");
      setErrorMessage("");
    } catch (error) {
      alert(error.response?.data?.message || "회원가입 실패!");
    }
  };

  return (
    <div className={styles.container}>
      {isLogin ? (
        <>
          <h2 className={styles.heading}>관리자 로그인</h2>
          <form onSubmit={handleLogin} className={`${styles.card} ${styles.form}`}>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={styles.input_field}
            />
            <hr className={styles.divider} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.input_field}
            />
            <div style={{ whiteSpace: "pre-line", height: "1.2em", color: "red" }}>
              {errorMessage || <>&nbsp;</>}
            </div>
            <hr className={styles.divider} />
            <button type="submit" className={styles.button_primary}>로그인</button>
            <button type="button" onClick={() => setIsLogin(false)} className={styles.button_primary}>
              관리자 회원가입
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className={styles.heading}>관리자 회원가입</h2>
          <form onSubmit={handleSignup} className={`${styles.card} ${styles.form}`}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className={styles.input_field}
            />
            <hr className={styles.divider} />
            <input
              type="text"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="Email address"
              className={styles.input_field}
            />
            <hr className={styles.divider} />
            <input
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              placeholder="Password"
              className={styles.input_field}
            />
            <hr className={styles.divider} />
            <input
              type="text"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="관리자 코드"
              className={styles.input_field}
            />
            <hr className={styles.divider} />
            <button type="submit" className={styles.button_primary}>회원가입</button>
            <button type="button" onClick={() => setIsLogin(true)} className={styles.button_primary}>
              로그인 화면으로
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AdminSignin;
