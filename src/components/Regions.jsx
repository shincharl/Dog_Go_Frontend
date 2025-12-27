import styles from "../css/Modal.module.css";  
import { useState } from "react";

const regions = ["동구", "중구", "서구", "유성구", "대덕구"];

const dongMap = {
  서구: [
    "복수동", "도마동", "정림동", "변동",
    "용문동", "탄방동", "괴정동", "가장동", "내동",
    "갈마1동", "갈마2동", "월평동",
    "가수원동", "도안동", "관저1동", "관저2동", "기성동",
    "둔산동", "만년동",
  ],

  동구: [
    "중앙동", "효동", "신인동", "판암1동", "판암2동",
    "용운동", "대동", "자양동", "가양1동", "가양2동",
    "용전동", "성남동", "홍도동", "삼성동", "대청동", "산내동"
  ],

  중구: [
    "은행선화동", "목동", "중촌동", "대흥동", "문창동", "석교동",
    "대사동", "부사동", "용두동", "오류동", "태평1동", "태평2동",
    "유천1동", "유천2동", "문화1동", "문화2동", "산성동"
  ],

  유성구: [
    "진잠동", "학하동", "상대동", "온천1동", "온천2동",
    "노은1동", "노은2동", "노은3동", "신성동", "전민동",
    "구즉동", "관평동", "원신흥동"
  ],

  대덕구: [
    "오정동", "대화동", "회덕동", "비래동", "송촌동",
    "중리동", "신탄진동", "석봉동", "덕암동", "목상동",
    "법1동", "법2동"
  ],
};

const Regions = ({ onClose, onConfirm }) => {
  const [selected, setSelected] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  /* 다음 지역 선택 단계 */
  const [step, setStep] = useState(1);
  
  const handleSelect = (region) => {
    setSelected(region);
    setSelectedDong(""); // 구 바꾸면 동 초기화
  };

  const handleSelect_Dong = (dong) => {
    setSelectedDong(dong);
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {step === 1 && (
          <div>
            <h4>지역구 선택</h4>
            <div className={styles.regionsContainer}>
              {regions.map((region) => (
                <button
                  type="button"
                  key={region}
                  className={`${styles.regionButton} ${selected === region ? styles.active : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(region)}}
                >
                  {region}
                </button>
              ))}
            </div>

            <div className={styles.modalBtns}>
              <button onClick={onClose} className={styles.closeBtn}>
                닫기
              </button>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => selected && handleNext()}
                disabled={!selected}
              >
                다음
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h4>행정동 선택</h4>
            <p>선택한 지역: {selected}</p>
            
            <div className={styles.regionsContainer}>
              {dongMap[selected]?.map((dong) => (
                  <button
                    type="button"
                    key={dong}
                    className={`${styles.regionButton} ${selectedDong === dong ? styles.active : ""}`}
                    onClick = {() => handleSelect_Dong(dong)}
                    >
                      {dong}
                  </button>
              ))}
            </div>
            
            <div className={styles.modalBtns}>
            <button onClick={handlePrev} className={styles.prevBtn}>
                이전
            </button>
            <button onClick={() => onConfirm(selected, selectedDong)} className={styles.closeBtn}>
                확인
            </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Regions;
