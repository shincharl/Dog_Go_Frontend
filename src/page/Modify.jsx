import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"; // URL에서 id 가져오기
import Styles from "../css/Modify.module.css";
import axios from "axios"

const Modify = () => {

  const navigate = useNavigate();

  const { id } = useParams();
  const [reservation, setReservation] = useState({
    calender: "",
    clock: "",
    dogType: "",
    dogAge: 0,
    name: "",
    phone: "",
    location: "",
    distance: 0,
    event: "",
  });

  // 서버에서 기존 예약 정보 불러오기
  useEffect(() => {
    axios.get(`https://doggobackend-production.up.railway.app/api/reservation/${id}`)
      .then(res => setReservation(res.data))
      .catch(err => console.log(err));
  }, [id]);

  // 날짜 추출
  const isoString_Date = reservation.calender;
  const dateOnly = isoString_Date ? isoString_Date.split('T')[0] : "";

  // 시간 추출
  const isoString_Time = reservation.clock;
  const timeOnly = isoString_Time ? isoString_Time.split('T')[1].substring(0, 5) : "";

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // 수정 값 전송 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`https://doggobackend-production.up.railway.app/api/reservation/${id}`, reservation)
      .then(res => {
        if(res.data === "OK"){
          alert("수정 성공!");

          // 수정 성공 후 페이지 이동
          navigate(`/modify/${reservation.id}`);

        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={Styles.container}>
      <h2 className={Styles.title}>예약 수정</h2>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <div className={Styles.field}>
          <label>날짜</label>
          <input
            type="date"
            name="calender"
            value={dateOnly}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.field}>
          <label>시간</label>
          <input
            type="time"
            name="clock"
            value={timeOnly}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.field}>
          <label>강아지 종류</label>
          <input
            type="text"
            name="dogType"
            value={reservation.dogType}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.field}>
          <label>강아지 나이</label>
          <input
            type="number"
            name="dogAge"
            value={reservation.dogAge}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.field}>
          <label>예약자 이름</label>
          <input
            type="text"
            name="name"
            value={reservation.name}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.field}>
          <label>전화번호</label>
          <input
            type="text"
            name="phone"
            value={reservation.phone}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.field}>
          <label>위치</label>
          <input
            type="text"
            name="location"
            value={reservation.location}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.field}>
          <label>거리 (km)</label>
          <input
            type="number"
            name="distance"
            value={reservation.distance}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.field}>
          <label>이벤트</label>
          <input
            type="text"
            name="event"
            value={reservation.event}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={Styles.button}>
          수정 완료
        </button>
      </form>
    </div>
  );
};

export default Modify;