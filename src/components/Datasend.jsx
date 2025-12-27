import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://doggobackend-production.up.railway.app/api",
  headers: { "Content-Type": "application/json" },
  
});

export const dataSend = async ({
  selected_Calender,
  selected_Clock,
  dogType,
  dogAge,
  password,
  name,
  phone,
  location,
  totalDistance,
  event,
  onSuccess,
}) => {
  const data = {
    selected_Calender,
    selected_Clock,
    dogType,
    dogAge,
    password,
    name,
    phone,
    location,
    totalDistance,
    event,
  };

  try {
    const response = await apiClient.post("/reservation", data);
    console.log("예약 성공:", response.data);
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("예약 전송 실패:", error.response?.data || error.message);
    alert("예약 전송에 실패했습니다.");
  }
};
