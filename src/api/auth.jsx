import axios from 'axios';

const apiClient = axios.create({
    baseURL : 'https://doggobackend-production.up.railway.app/api',
    headers : {'Content-Type' : 'application/json'},
    withCredentials: true,
});

/* 로그인 시도 axios */

export const login = async (email, password) => {

    try {
        const res = await apiClient.post('/login', {email, password}, { withCredentials: true });
        return res;   
    } catch (error) {
        throw error;
    }

};

/* 회원가입 시도 axios */

export const signup = async (name, email, password, adminCode) => {

    if(!name || !email || !password || !adminCode ){
        throw new Error("잘못된 입력입니다. 확인해 주세요.")
    }

   try {
        const res = await apiClient.post('/signup', {name, email, password, adminCode}, { withCredentials: true });
        return res;
   } catch (error) {
        throw error;
   }
};