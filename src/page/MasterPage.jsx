import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import Styles from "../css/Reservation.module.css";

const MasterPage = () => {
  const outletContext = useOutletContext() || {};
  const { userData } = outletContext;
  const navigate = useNavigate();

  const [todayCount, setTodayCount] = useState([]);
  const [expiredCount, setExpiredCount] = useState([]);
  const [eventChoiceMemberCount, setEventChoiceMemberCount] = useState([]);
  const [qnaCount, setQnaCount] = useState([]);

  const [selectedType, setSelectedType] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleCardClick = (type) => {
    setSelectedType(type);
    let url = "";
    if (type === "today") url = "https://doggobackend-production.up.railway.app/api/masterpage/today/list";
    else if (type === "expired") url = "https://doggobackend-production.up.railway.app/api/masterpage/expired/list";
    else if (type === "event") url = "https://doggobackend-production.up.railway.app/api/masterpage/event/list";
    else if (type === "qna") url = "https://doggobackend-production.up.railway.app/api/masterpage/master/qna";

    axios
      .get(url, { withCredentials: true }) // <- 세션 쿠키 전송
      .then((res) => setTableData(res.data))
      .catch((err) => console.error(`${type} 데이터 불러오기 실패:`, err));
  };

  const handleStatusChange = (id, newStatus) => {
    const originalStatus = tableData.find((item) => item.id === id)?.status;

    setTableData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    axios
      .put(
        `https://doggobackend-production.up.railway.app/api/masterpage/status/${id}`,
        { status: newStatus },
        { withCredentials: true } // <- 세션 쿠키 전송
      )
      .catch(() => {
        alert("상태 변경 중 오류가 발생했습니다.");
        setTableData((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: originalStatus } : item))
        );
      });
  };

  useEffect(() => {
    if (!userData) {
      alert("로그인 해야 이용할 수 있는 관리자 전용 페이지 입니다.");
      navigate("/");
      return;
    }

    axios
      .get("https://doggobackend-production.up.railway.app/api/masterpage/today", { withCredentials: true }) // <- 세션 쿠키 전송
      .then((res) => {
        setTodayCount(res.data.todayCount);
        setExpiredCount(res.data.expiredCount);
        setEventChoiceMemberCount(res.data.eventChoiceMemberCount);
        setQnaCount(res.data.qnaCount);
      })
      .catch((err) => console.error("관리자 대시보드 데이터 불러오기 실패:", err));
  }, [userData, navigate]);

  if (!userData) return null;

  return (
    <div className={Styles.container}>
      <h2>관리자 대시보드</h2>
      <p className={Styles.welcome}>환영합니다, {userData?.name}님!</p>

      {/* 카드 통계 */}
      <div className={Styles.cardContainer}>
        <div className={Styles.statCard} onClick={() => handleCardClick("today")}>
          <h3>오늘 예약</h3>
          <p>{todayCount}건</p>
        </div>
        <div className={Styles.statCard} onClick={() => handleCardClick("expired")}>
          <h3>기간 만료 예약</h3>
          <p>{expiredCount}건</p>
        </div>
        <div className={Styles.statCard} onClick={() => handleCardClick("event")}>
          <h4>이벤트 신청 회원</h4>
          <p>{eventChoiceMemberCount}건</p>
        </div>
        <div className={Styles.statCard} onClick={() => handleCardClick("qna")}>
          <h3>QnA 목록</h3>
          <p>{qnaCount}건</p>
        </div>
      </div>

      {/* 데이터 테이블 */}
      {selectedType && (
        <>
          <h3 className={Styles.tableTitle}>
            {selectedType === "today"
              ? "오늘 예약 목록"
              : selectedType === "expired"
              ? "기간 만료 예약 목록"
              : selectedType === "event"
              ? "이벤트 신청 회원 목록"
              : "QnA 목록"}
          </h3>

          <table className={Styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>{selectedType === "qna" ? "메모" : "예약자"}</th>
                {selectedType !== "qna" && <th>강아지 종류</th>}
                {selectedType !== "qna" && <th>시간</th>}
                <th>{selectedType === "qna" ? "만족도" : "상태"}</th>
                {selectedType !== "qna" && <th>작성</th>}
                {selectedType === "qna" && <th>작성일</th>}
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((res) => (
                  <tr key={res.id}>
                    <td>{res.id}</td>
                    <td>{selectedType === "qna" ? res.memo : res.name}</td>
                    {selectedType !== "qna" && <td>{res.dogType}</td>}
                    {selectedType !== "qna" && (
                      <td>{dayjs(res.clock).format("YYYY-MM-DD HH:mm")}</td>
                    )}
                    {selectedType === "qna" ? (
                      <>
                        <td>{res.satisfaction}</td>
                        <td>{dayjs(res.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                      </>
                    ) : (
                      <>
                        <td>
                          {res.status} <br />
                          <select
                            value={res.status || ""}
                            onChange={(e) => handleStatusChange(res.id, e.target.value)}
                          >
                            <option value="대기">대기</option>
                            <option value="승인">승인</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className={Styles.viewMapBtn}
                            onClick={() => navigate(`/tracking/${res.id}`)}
                          >
                            작성
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={selectedType === "qna" ? 4 : 5} className={Styles.noData}>
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default MasterPage;
