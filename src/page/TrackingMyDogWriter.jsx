import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Styles from "../css/TrackingMyDog.module.css";

const STATUS_OPTIONS = {
  poop: ["배변 완료", "소변만 함", "배변 못함", "설사", "변이 딱딱함"],
  condition: ["컨디션 좋음", "보통", "피곤함", "기운 없음", "절뚝거림"],
  behavior: [
    "잘 따라옴",
    "리드줄 당김",
    "짖음",
    "다른 강아지 관심",
    "사람 친화적",
    "흥분도 높음",
  ],
  training: ["앉아 가능", "기다려 가능", "리콜 반응 좋음", "훈련 필요"],
  issue: ["문제 행동 없음", "돌진", "물려고 함", "쓰레기 집착"],
};
const TrackingMyDogWriter = () => {
  const [record, setRecord] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [photos, setPhotos] = useState([]);

  const [status, setStatus] = useState({
    poop: [],
    condition: [],
    behavior: [],
    training: [],
    issue: [],
  });

  const { id } = useParams();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ---------- handlers ---------- */

  const handlePhotoChange = (e) => {
    if (!e.target.files) return;
    setPhotos([...e.target.files]);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const toggleStatus = (category, value) => {
    setStatus((prev) => {
      const exists = prev[category].includes(value);
      return {
        ...prev,
        [category]: exists
          ? prev[category].filter((v) => v !== value)
          : [...prev[category], value],
      };
    });
  };

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await axios.get(`https://doggobackend-production.up.railway.app/api/reservation/${id}`);
        setReservation(res.data);
      } catch (error) {
        console.error("예약 정보 조회 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();

  }, [id]);


  const handleSave = async () => {
    try {
      // 1. FormData 생성
      const formData = new FormData();

      // 2. JSON 데이터 구성
      const payload = {
        reservationId: reservation.id,
        record,
        tags,
        status,
      };

      // 3. JSON을 Blob으로 변환해서 추가
      formData.append(
        "data",
        new Blob([JSON.stringify(payload)], {type: "application/json"})
      );

      // 사진 파일들
      photos.forEach((file) => {
        formData.append("photos", file);
      });

      await axios.post(
        "https://doggobackend-production.up.railway.app/api/tracking",
        formData,
      );

      alert("산책 기록이 저장되었습니다!");

      navigate("/masterpage");

    } catch (error) {
      console.error("산책 기록 저장 실패", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  }

  if (loading || !reservation) {
    return (
        <div className={Styles.container}>
          <div className={`${Styles.writeCard} ${Styles.loadingCard}`}>
            <div className={Styles.skeletonTitle} />
            <div className={Styles.skeletonSummary} />
            <div className={Styles.skeletonBox} />
            <div className={Styles.skeletonBox} />
          </div>
        </div>
    );
  }

  /* ---------- render ---------- */

  return (
    <div className={Styles.container}>
      <div className={Styles.writeCard}>
        {/* 제목 */}
        <h1 className={Styles.title}>산책 기록 작성</h1>

        {/* 요약 카드 */}
        <div className={Styles.summaryCard}>
          <div>
            <strong>🐶 {reservation.name}</strong>
            <p>{reservation.dogType} · {reservation.dogAge}</p>
          </div>
          <div>
            <p>📍 {reservation.location}</p>
            <p>📏 {reservation.distance}m</p>
          </div>
        </div>

        {/* 사진 업로드 */}
        <div className={Styles.photoSection}>
          <label>사진 업로드</label>
          <input type="file" multiple accept="image/*" onChange={handlePhotoChange} />

          <div className={Styles.previewGrid}>
            {photos.map((file, idx) => (
              <img key={idx} src={URL.createObjectURL(file)} alt="미리보기" />
            ))}
          </div>
        </div>

        {/* 기록 */}
        <div className={Styles.recordSection}>
          <label>산책 기록</label>
          <textarea
            value={record}
            onChange={(e) => setRecord(e.target.value)}
            placeholder="오늘 산책 중 특이사항을 작성하세요"
          />
        </div>

        {/* 태그 */}
        <div className={Styles.tagSection}>
          <label>태그</label>
          <div className={Styles.tagInputBox}>
            {tags.map((tag, idx) => (
              <span key={idx} className={Styles.tagChip}>
                #{tag}
                <button onClick={() => setTags(tags.filter((_, i) => i !== idx))}>
                  ×
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="태그 입력 후 Enter"
            />
          </div>
        </div>

        {/* 상태 체크 (칩 UI) */}
        <div className={Styles.statusSection}>
          <h3>상태 체크</h3>

          {Object.entries(STATUS_OPTIONS).map(([category, options]) => (
            <div key={category} className={Styles.statusGroup}>
              <p className={Styles.statusTitle}>{category.toUpperCase()}</p>
              <div className={Styles.chipGroup}>
                {options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${Styles.statusChip} ${
                      status[category].includes(option) ? Styles.active : ""
                    }`}
                    onClick={() => toggleStatus(category, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 저장 */}
        <button className={Styles.saveBtn} onClick={handleSave}>저장</button>
      </div>
    </div>
  );
};

export default TrackingMyDogWriter;
