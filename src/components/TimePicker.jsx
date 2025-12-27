import * as React from "react";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import koLocale from "date-fns/locale/ko";

export default function TimePickers({selected, setSelected}){
    const handleChange = (newValue) => {
        setSelected(newValue);
    };

    // 최소/최대 시간 설정
    const today = new Date();
    const minTime = new Date(today);
    minTime.setHours(6, 0, 0); // 오전 6시
    const maxTime = new Date(today);
    maxTime.setHours(21, 0, 0); // 오후 9시

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={koLocale}>
            <TimePicker
              label="시간 선택"
              value={selected}
              onChange={handleChange}
              minTime={minTime}
              maxTime={maxTime}
              ampm={false} // 24시간 표기
              slotProps={{
                textField : {
                    fullWidth: true,
                    sx : {width: 420,
                        // 기본 테두리 색상
                    },
                    placeholder: "시간 선택",
                    onKeyDown: (e) => e.preventDefault(), // 직접 입력 방지
                }
              }}
              />
        </LocalizationProvider>
    );
}