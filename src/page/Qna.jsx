import React, {useState} from "react";
import Styles from "../css/Qna.module.css"
import axios from "axios";
import {FaPrint} from "react-icons/fa";

const Qna = () => {

    const [formData, setFormData] = useState({
        memo : "",
        satisfaction : "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("제출된 데이터: " , formData);

        if(formData.satisfaction && formData.memo){
            try {
                const response = await axios.post("https://doggobackend-production.up.railway.app/api/qna", formData);

                if(response.status === 200){
                    alert("소중한 의견 감사합니다.");
                    setFormData({memo: "", satisfaction: ""}); // 입력값 초기화
                }
            } catch (error) {
                console.error("서버 전송 중 오류:", error);
                alert("제출 중 오류가 발생했습니다.");
            }
        } else {
            alert("입력되지 않은 항목이 있습니다.");
        }

    }

    // Q&A 데이터 배열
    
    const qnaList = [
    {
      question: "결제는 어떻게 해야 하나요?",
      answer: "예약이 완료되어 관리자가 수락을 하면 예약한 휴대전화로 연락이 갑니다. 해당 담당자와 일정 및 비용을 조율하고 결제를 하시면 됩니다.",
    },
    {
      question: "예약일정을 변경하고 싶다면 어떻게 해야하나요?",
      answer: "예약확인에서 사용자명과 비밀번호를 입력 후 목록을 수정해 주세요. 관리자가 예약 승인을 했다면 수정이 불가할 수도 있습니다.",
    },
    {
      question: "고양이도 산책이 되나요?",
      answer: "죄송합니다. 강아지 외에는 산책 서비스를 할 수 없습니다.",
    },
    {
      question: "산책 중간에 코스를 늘릴 수 있나요?",
      answer: "담당 산책 인원이 선택되면 해당 담당자와 일정 조율 후 코스 거리를 조절할 수 있습니다.",
    },
    {
      question: "대전 지역 이외의 타 지역은 예약이 불가능 한가요?",
      answer: "추가 다른 지역은 인력 확보 및 추가 확장 개발 이후 예약 받을 예정입니다. ",
    },
  ];

  // 인쇄 동작 실시
  const broserPrint = () => {
    const printContent = document.getElementById('print-area');
    if(printContent) {
        const newWin = window.open('','', 'width=800,height=600');
        newWin.document.write('<html><head><title>인쇄</title></head><body>');
        newWin.document.write(printContent.innerHTML);
        newWin.document.write('</body></html>');
        newWin.document.close();
        newWin.focus();
        newWin.print();
        newWin.close();
    }
  }

    return(
        <>
            <div className={Styles.qnaContainer}>
                <div className={Styles.qnaCard} id="print-area">
                    <header className={Styles.qnaHeader}>
                      <div>
                        <h2>Q&A</h2>
                        <p>궁금한 내용은 무엇인가요?</p>
                      </div>
                      <button onClick={broserPrint}>
                            <FaPrint size={24} color="black"/>
                        </button>
                    </header>

                    <section className={Styles.qnaList}>
                        {qnaList.map((item, idx) => (
                            <div key={idx} className={Styles.qnaItem}>
                                <h4>Q. {item.question}</h4>
                                <p>A. {item.answer}</p>
                            </div>
                        ))}
                    </section>

                    <div className={Styles.qnaContact}>
                        <h4>관리자 : 김사원</h4>
                        <h4>연락처 : 010-1234-5678</h4>
                    </div>

                            <form onSubmit={handleSubmit} className={Styles.qnaForm}>
                                <p className={Styles.qnaQuestion}>이 페이지에서 제공하는 정보에 대하여 만족하십니까?</p>
                                <div className={Styles.qnaRadios}>
                                  {[
                                    {label: "매우만족", value: "very_good"},
                                    {label: "만족", value: "good"},
                                    {label: "보통", value: "soso"},
                                    {label: "불만족", value: "bad"},
                                    {label: "매우불만족", value: "very_bad"},
                                  ].map((item) => (
                                    <label
                                      key={item.value}
                                      className={`${Styles.radioBtn} ${
                                        formData.satisfaction === item.value ? Styles.active : ""
                                      }`}
                                    >
                                        <input
                                            type="radio"
                                            name="satisfaction"
                                            value={item.value}
                                            checked={formData.satisfaction === item.value}
                                            onChange={handleChange}
                                        /> 
                                        {item.label}
                                    </label>
                                  ))}
                                </div>

                                <input
                                    type="text"
                                    name="memo"
                                    value={formData.memo}
                                    onChange={handleChange}
                                    placeholder="의견을 남겨주세요..."
                                    className={Styles.qnaInput}
                                />

                                <button type="submit" className={Styles.qnaSubmit}>
                                    평가하기
                                </button>
                        </form>
                    </div>
                </div>
        </>
    );
};

export default Qna;