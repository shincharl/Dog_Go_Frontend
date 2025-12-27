import styles from "../css/Modal.module.css";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { GoHeartFill } from "react-icons/go";
import { FaPersonWalkingLuggage } from "react-icons/fa6";

const DogEvent = ({ setOnEvent, onClose }) => {
  // 버튼 클릭 시 이벤트 선택 + 모달 닫기
  const handleSelect = (eventName) => {
    setOnEvent(eventName);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h4>적용하려고 하는 이벤트 선택</h4>
        <div className={styles.regionsContainer}>
          <button
            className={styles.regionButton}
            onClick={() => handleSelect("생일 축하 이벤트")}
          >
            생일 축하 이벤트
            <LiaBirthdayCakeSolid style={{ marginLeft: "8px" }} />
          </button>

          <button
            className={styles.regionButton}
            onClick={() => handleSelect("애견 결혼식 이벤트")}
          >
            애견 결혼식 이벤트
            <GoHeartFill style={{ marginLeft: "8px" }} />
          </button>

          <button
            className={styles.regionButton}
            onClick={() => handleSelect("장거리 산책 코스 이벤트")}
          >
            장거리 산책 코스 이벤트
            <FaPersonWalkingLuggage style={{ marginLeft: "8px" }} />
          </button>
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default DogEvent;