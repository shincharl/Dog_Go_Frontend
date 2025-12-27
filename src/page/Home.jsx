import main_img from "../image/main.jpg";
import styles from "../css/Home.module.css";
import CalendarBasic from "../components/Calender"; // 달력 컴포넌트
import { Calendar } from "lucide-react";           // 달력 아이콘
import { useState } from "react";
import TimePickers from "../components/TimePicker"; // 시간 선택 컴포넌트
import Regions from "../components/Regions";       // 지역 선택 모달
import Movingdistance from "../components/Movingdistance"; // 산책 코스 모달
import DogEvent from "../components/DogEvent";     // 이벤트 선택 모달

import { useForm, Controller } from "react-hook-form";
import { NumericFormat, PatternFormat } from "react-number-format";
import {dataSend} from "../components/Datasend";

const Home = () => {
  const [step, setStep] = useState(1);

  // Step1
  const [selected_Calender, setSelected_Calender] = useState(); // 날짜 선택
  const [open_Calender, setOpen_Calender] = useState(false);
  const [selected_Clock, setSelected_Clock] = useState(null); // 시간 선택

  // Step2
  const [place, setPlace] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [selectedDistition, setSelectedDistition] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [onevent, setOnEvent] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 예약 데이터 전송 state
  const [isCompleted, setIsCompleted] = useState(false);

  // react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      reservationName: "",
      phone: "",
      dogType: "",
      dogAge: "",
      addressDong: "",
      password: "",
    },
  });

  const handleNext = () => setStep((prev) => prev + 1); // 앞으로 이동
  const handlePrev = () => setStep((prev) => prev - 1); // 뒤로 이동

  return (
    <div className={styles.page_container}>
      {/* 왼쪽 이미지 */}
      <div className={styles.image_container}>
        <img src={main_img} alt="메인 페이지 강아지" className={styles.main_img} />
        <div className={styles.text_group}>
          <p className={styles.overlay_text_1}>슬기로운 산책 생활</p>
          <p className={styles.overlay_text_2}>강아지 산책 예약 서비스</p>
        </div>
      </div>

      {/* Step1 */}
      {step === 1 && (
        <form className={styles.reservation_form} onSubmit={handleSubmit(handleNext)}>
          <p style={{ fontWeight: 700, marginBottom: 20 }}>예약 정보를 입력해주세요</p>

          {/* 달력 */}
          <div style={{ position: "relative", marginBottom: 20 }}>
            <input
              type="text"
              placeholder="날짜 선택"
              value={selected_Calender ? selected_Calender.toLocaleDateString("ko-KR") : ""}
              readOnly
              onClick={() => setOpen_Calender(!open_Calender)}
            />
            <Calendar
              size={20}
              onClick={() => setOpen_Calender(!open_Calender)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            />
            {open_Calender && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 100,
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  marginTop: 4,
                }}
              >
                <CalendarBasic
                  selected={selected_Calender}
                  setSelected={setSelected_Calender}
                  setOpen={setOpen_Calender}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            )}
          </div>

          {/* 시간 선택 */}
          <TimePickers selected={selected_Clock} setSelected={setSelected_Clock} />

          {/* 강아지 종류 */}
          <input
            type="text"
            placeholder="강아지 종류"
            {...register("dogType", 
              { required: "강아지 품종를 입력해주세요",
                pattern: {
                  value : /^[가-힇]+$/, // 한글만 허용
                  message: "잘못된 기입 입니다."
                },
               })}
          />
          {errors.dogType && <span style={{ color: "red" }}>{errors.dogType.message}</span>}

          {/* 견종 나이 */}
          <Controller
            name="dogAge"
            control={control}
            rules={{ required: "견종 나이를 입력해주세요" }}
            render={({ field }) => (
              <NumericFormat {...field} placeholder="견종 나이 (숫자만 입력)" allowNegative={false} decimalScale={0} />
            )}
          />
          {errors.dogAge && <span style={{ color: "red" }}>{errors.dogAge.message}</span>}

          <input type="password"
                 placeholder="예약 변경 비밀번호"
                 {...register("password", {
                  required: "예약 변경 비밀번호를 입력해주세요",
                  minLength: {value: 4, message: "비밀번호는 최소 4자리 이상 입력해주세요"},
                 })} />

          {errors.password && <span style={{color: "red"}}>{errors.password.message}</span>}

          <button type="submit"
                  onClick={() => {
                    if(!selected_Calender || !selected_Clock){
                      alert("정보(날짜, 시간 필수)를 모두 입력 해주세요.");
                      return;
                    }
                  }}>다음</button>
        </form>
      )}

      {/* Step2 */}
      {step === 2 && (
        <form className={styles.reservation_form} onSubmit={handleSubmit(handleNext)}>
          <p style={{ fontWeight: 700, marginBottom: 20 }}>예약자 정보를 입력해주세요</p>

          {/* 예약자 성명 */}
          <input
            type="text"
            placeholder="예약자 성명 또는 닉네임(한글)"
            {...register("reservationName", { 
              required: "예약자 성명 또는 닉네임(한글)을 입력해주세요",
              pattern: {
                value: /^[가-힇]+$/, // 한글만 허용
                message: "성명이 잘못 입력 되었습니다.", 
              },
            })}
          />
          {errors.reservationName && <span style={{ color: "red" }}>{errors.reservationName.message}</span>}

          {/* 전화번호 */}
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "전화번호를 입력해주세요",
                pattern: {
                  value: /^010-\d{4}-\d{4}$/,
                  message: "전화번호 형식이 올바르지 않습니다",
                },
              }}
              render={({ field }) => (
                <PatternFormat
                  format="###-####-####"
                  allowEmptyFormatting={false}
                  mask="_"
                  placeholder="전화번호 입력"
                  value={field.value ?? undefined} // react-hook-form 값 표시
                  onValueChange={(values) => {
                    field.onChange(values.formattedValue); // 하이픈 포함된 값 저장
                  }}
                  onBlur={field.onBlur}
                />
              )}
            />
          {errors.phone && <span style={{ color: "red" }}>{errors.phone.message}</span>}

          {/* 지역 선택 */}
          <input
            type="text"
            placeholder="지역 선택"
            readOnly
            value={selectedRegion && selectedDong ? `${selectedRegion} ${selectedDong}` : ""}
            onClick={(e) => {
              e.preventDefault();
              setPlace(true);
            }}
          />
          {place && (
            <Regions
              onClose={() => setPlace(false)}
              onConfirm={(region, dong) => {
                setSelectedRegion(region);
                setSelectedDong(dong);
                setValue("addressDong", dong);
                setPlace(false);
              }}
            />
          )}

          {/* 산책 코스 */}
          <input
            type="text"
            placeholder="코스 선택 (마우스 우측 클릭 종료)"
            readOnly
            value={totalDistance > 0 ? `${totalDistance} m` : ""}
            onClick={(e) => {
              e.preventDefault();
              setSelectedDistition(true);
            }}
          />
          {selectedDistition && (
            <Movingdistance
              address={selectedRegion && selectedDong ? `${selectedRegion} ${selectedDong}` : ""}
              onDistanceChange={setTotalDistance}
            />
          )}

          {/* 이벤트 선택 */}
          <input
            type="text"
            placeholder="이벤트 선택 (필수 X)"
            readOnly
            value={onevent}
            onClick={(e) => {
              e.preventDefault();
              setShowModal(true);
            }}
          />
          {showModal && <DogEvent setOnEvent={setOnEvent} onClose={() => setShowModal(false)} />}

          <div style={{ marginTop: 12, display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button type="button" onClick={handlePrev}>
              이전
            </button>
            <button type="submit">다음</button>
          </div>
        </form>
      )}

      {/* Step3 */}
      {step === 3 && (
        <div className={styles.reservation_form}>
          <p style={{ fontWeight: 700, marginBottom: 20 }}>예약 최종 확인</p>

          <div>
            <strong>날짜:</strong> {selected_Calender ? selected_Calender.toLocaleDateString("ko-KR", {
                year : "numeric",
                month : "2-digit",
                day : "2-digit",
            }) : "-"}
          </div>
          <div>
            <strong>시간:</strong> {selected_Clock ? selected_Clock.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }) : "-"}
          </div>
          <div>
            <strong>강아지 종류:</strong> {getValues("dogType") || "-"}
          </div>
          <div>
            <strong>견종 나이:</strong> {getValues("dogAge") || "-"}
          </div>
           <div>
            <strong>예약 수정 비밀번호</strong> {getValues("password") || "-"}
          </div>
          <div>
            <strong>예약자 성명(닉네임):</strong> {getValues("reservationName") || "-"}
          </div>
          <div>
            <strong>전화 번호:</strong> {getValues("phone") || "-"}
          </div>
          <div>
            <strong>지역:</strong> {selectedRegion && selectedDong ? `${selectedRegion} ${selectedDong}` : "-"}
          </div>
          <div>
            <strong>산책 코스 거리:</strong> {totalDistance > 0 ? `${totalDistance} m` : "-"}
          </div>
          <div>
            <strong>이벤트 선택:</strong> {onevent || "-"}
          </div>
          <span style={{color : "red" ,  fontWeight : "bold" }}>잘못된 예약은 관리자에 의해 취소될수 있습니다.</span>

          <div style={{ marginTop: 20 }}>
            <button onClick={handlePrev} style={{ marginRight: 12}}>
              이전
            </button>
            <button
                  style={{ backgroundColor: "#4caf50", color: "#fff" }}
                      onClick={() => {
                            if (isCompleted) return; // 중복 방지
                            setIsCompleted(true);
                            dataSend({
                              selected_Calender,
                              selected_Clock,
                              dogType: getValues("dogType"),
                              dogAge: getValues("dogAge"),
                              password: getValues("password"),
                              name: getValues("reservationName"),
                              phone: getValues("phone"),
                              location: selectedRegion + selectedDong,
                              totalDistance,
                              event: onevent,
                              onSuccess: () => {
                                alert("예약이 완료되었습니다!");
                                window.location.reload();
                              },
                            });
                          }}
                      >
              완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
