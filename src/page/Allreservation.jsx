import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import styles from "../css/Allreservation.module.css";

const Allreservation = () => {

     const navigate = useNavigate();

    const [reservations, setReservations] = useState([]);

    useEffect(()=> {
        axios.get("https://doggobackend-production.up.railway.app/api/allReservation")
             .then((res) => {
                setReservations(res.data);
             })
            .catch((err) => {
                console.error("데이터 불러오기 실패:", err);
            });
    }, []);

    // 날짜/시간 포맷 유틸 함수
    const formatDate = (dateStr) => {
        if(!dateStr) return "-";
        const date = new Date(dateStr);
        if(isNaN(date)) return dateStr; // 변환 실패 시 그대로 출력
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };
    
    const formatTime = (timeStr) => {
        if(!timeStr) return "-";

        const date = new Date(timeStr);
        if (isNaN(date)) return timeStr;

        return date.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Seoul", // KST 변환
        });
    };

    // 수정하기 버튼 입력
    const modify = async (reservation) => {

       const inputPassword = prompt('등록하신 비밀번호를 입력해주세요');

       if(!inputPassword){
            alert('잘못된 입력입니다...');
            return;
       }else if(reservation.status === '승인'){
            alert('이미 관리자가 승인한 예약입니다. 회사로 연락 바랍니다.');
            return;
       }

       axios
        .post(`https://doggobackend-production.up.railway.app/api/reservation/${reservation.id}`, {password: inputPassword})
        .then((res) => {
            if(res.data === "OK"){
                navigate(`/modify/${reservation.id}`);
            }
        })
        .catch((err) => {
            console.error(err);
            alert("비밀번호가 올바르지 않습니다.");
        });
    };

    // 삭제하기 버튼 입력
    const deletes = (reservation) => {

        const inputPassword = prompt('등록하신 비밀번호를 입력해주세요');

        if(!inputPassword){
            alert('잘못된 입력입니다.');
            return;
        }else if(reservation.status === '승인'){
            alert('이미 관리자가 승인한 예약입니다. 회사로 연락 바랍니다.');
            return;
        }

        axios
          .post(`https://doggobackend-production.up.railway.app/api/reservation/${reservation.id}/delete`, {password : inputPassword})
          .then((res) => {
            if(res.data === "OK"){
                alert("정상적으로 예약이 취소 되었습니다.");
                window.location.reload();
            }
          })
          .catch((err) => {
            console.error(err);
            alert("비밀번호가 올바르지 않습니다.");
          });
    };

    return(
       <div className={styles.container}>
            <h1 className={styles.title}>예약목록</h1>
            <div className={styles.list}>
                {reservations.map((reservation) => (
                    <div key={reservation.id} className={styles.card}>

                        <div className={styles.content}>
                            <h3 className={styles.name}>{reservation.name}
                                {" "}
                            </h3>
                            <p className={styles.text}>
                               📅 {formatDate(reservation.calender)} ⏰ {formatTime(reservation.clock)}
                            </p>
                            <p className={styles.text}>
                               🐶 {reservation.dogType} ({reservation.dogAge}살)
                            </p>
                            <p className={styles.text}>📞 {reservation.phone}</p>
                            <p className={styles.text}>
                                📍 {reservation.location} ({reservation.distance} km)
                            </p>
                            <p className={styles.text}>🎉 {reservation.event}</p>
                            <p className={styles.text}>예약상태 : {reservation.status}</p>
                        </div> 
                         <div className={styles.rightButtonWrapper}>
                                <button className={styles.rightButtonArea} onClick={() => modify(reservation)}>
                                    수정하기
                                </button>
                                <button className={`${styles.rightButtonArea} ${styles.deleteButton}`} onClick={() => deletes(reservation)}>
                                    삭제하기
                                </button>
                            </div>
                    </div>
                ))}
            </div>
       </div>
    );
};


export default Allreservation;