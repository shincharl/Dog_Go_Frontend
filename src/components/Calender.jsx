import {useRef, useEffect} from "react";
import {DayPicker} from "react-day-picker";
import {ko} from "date-fns/locale";
import "react-day-picker/dist/style.css";

export default function CalendarBasic({selected, setSelected, setOpen }){

    const wrapperRef = useRef(null);

    useEffect(()=>{
        function handleClickOutside(event){
            if(wrapperRef.current && !wrapperRef.current.contains(event.target)){
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setOpen]);

    return(
        <div ref={wrapperRef} style={{position : "relative"}}>
            <DayPicker mode="single" selected={selected} onSelect={(date)=>{
                setSelected(date); // 날짜 선택
                setOpen(false); // 달력 닫기
            }} 
            locale={ko}
            disabled={{ before: new Date() }} // 이전 날짜 선택 불가
            />
        </div>
    );
}