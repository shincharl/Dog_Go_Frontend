import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Styles from "../css/TrackingMyDogReader.module.css";

const PAGE_SIZE = 5;

const statusLabelMap = {
  poop: "💩 배변",
  condition: "😴 컨디션",
  behavior: "🐕 행동",
  training: "🎓 훈련",
  issue: "⚠️ 특이사항",
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${month}월 ${day}일`;
};

const isSameUTCDate = (date1, date2) =>
  date1.getUTCFullYear() === date2.getUTCFullYear() &&
  date1.getUTCMonth() === date2.getUTCMonth() &&
  date1.getUTCDate() === date2.getUTCDate();

const TrackingMyDogReader = () => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(
        `https://doggobackend-production.up.railway.app/api/tracking?page=${page}&size=${PAGE_SIZE}`
      );
      const data = res.data.content ?? [];
      if (data.length < PAGE_SIZE) setHasMore(false);
      setRecords((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("기록 불러오기 실패", error);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const groupedRecords = records.reduce((acc, record) => {
    const recordDate = new Date(record.createdAt);
    if (!selectedDate || isSameUTCDate(recordDate, selectedDate)) {
      const dateKey = formatDate(record.createdAt);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(record);
    }
    return acc;
  }, {});

  return (
    <div className={Styles.container}>
      {/* 달력 */}
      <div className={Styles.datePickerWrapper}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            if (!date) return;
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            setSelectedDate(utcDate);
          }}
          dateFormat="yyyy-MM-dd"
          placeholderText="날짜 선택"
          isClearable
        />
      </div>

      {/* 피드 */}
      <InfiniteScroll
        dataLength={records.length}
        next={fetchRecords}
        hasMore={hasMore}
        loader={<p className={Styles.loader}>Loading...</p>}
        endMessage={
          <div className={Styles.endCard}>
            <span className={Styles.endEmoji}>🐾</span>
            <p className={Styles.endTitle}>산책 기록 끝</p>
            <p className={Styles.endSub}>우리 아이들의 하루를 모두 확인했어요</p>
          </div>
        }
      >
        <div className={Styles.feed}>
          {Object.entries(groupedRecords).map(([date, recordsOfDay]) => (
            <div key={date}>
              <div className={Styles.dateHeader}>{date}</div>
              {recordsOfDay.map((record) => {
                const isLong = record.record?.length > 80;
                const isExpanded = expanded[record.id];

                return (
                  <div key={record.id} className={Styles.card}>
                    <div className={Styles.header}>
                      <div className={Styles.profile}>
                        <div className={Styles.avatar}>🐶</div>
                        <span className={Styles.nickname}>
                          {record.ownerNickname} 님의 강아지 산책 기록
                        </span>
                      </div>
                      <span className={Styles.more}>⋯</span>
                    </div>

                    <div className={Styles.imageWrapper}>
                      <img
                        src={record.photoPaths?.[0] ? `https://doggobackend-production.up.railway.app${record.photoPaths[0]}` : "/images/no-image.png"}
                        alt="강아지"
                      />
                      <div className={Styles.overlay}>산책 결과</div>
                    </div>

                    <div className={Styles.actions}>
                      <span>❤️</span>
                      <span>💬</span>
                      <span>📌</span>
                    </div>

                    <div className={Styles.dogInfo}>
                      <span>🐕 {record.dogType}</span>
                      <span>🎂 {record.dogAge}살</span>
                    </div>

                    <div className={Styles.info}>
                      <p className={Styles.record}>
                        <span className={Styles.nicknameInline}>{record.ownerNickname}</span>{" "}
                        {isExpanded || !isLong ? record.record : record.record.slice(0, 80) + "..."}
                      </p>

                      {isLong && (
                        <button className={Styles.moreBtn} onClick={() => toggleExpand(record.id)}>
                          {isExpanded ? "접기" : "더보기"}
                        </button>
                      )}

                      <div className={Styles.tags}>
                        {record.tags?.map((tag, index) => (
                          <span key={`${record.id}-tag-${index}`} className={Styles.tag}>#{tag}</span>
                        ))}
                      </div>

                      {record.status && (
                        <div className={Styles.statusBox}>
                          <p className={Styles.statusTitle}>🐾 오늘의 상태</p>
                          {Object.entries(record.status).map(([key, values]) => (
                            <div key={key} className={Styles.statusRow}>
                              <span className={Styles.statusKey}>{statusLabelMap[key] || key}</span>
                              <span className={Styles.statusValue}>{values.join(", ")}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default TrackingMyDogReader;
