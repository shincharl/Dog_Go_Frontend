![header](https://capsule-render.vercel.app/api?type=venom&color=auto&height=300&section=header&text=Dog-GO&fontSize=90)

<img width="1905" height="1253" alt="Screenshot 2025-12-29 at 13 53 24" src="https://github.com/user-attachments/assets/692857c3-ee35-4c9f-b47c-b23eae2f2c96" />

# Dog-Go

강아지 산책 예약 & 관리자 웹 서비스

## 프로젝트 소개

Dog-Go는 반려견 보호자와 산책 서비스를 연결하는 웹 기반 예약 관리 서비스 입니다.
사용자와 관리자의 역할을 명확히 분리하고,
Spring Security 기반 세션 인증을 중심으로 실제 서비스 환경을 고려해 구현했습니다.

프론트엔드와 백엔드를 분리하여 배포했으며,
배포 환경에서 발생하는 인증,CORS 문제를 직접 해결한 경험을 담은 프로젝트입니다.

---

## 기술 스택

### Frontend

[![My Skills](https://skillicons.dev/icons?i=js,html,css,react,vercel,vite)](https://skillicons.dev)

- HTML5 + CSS3

- JavaScript6

- REACT

- Axios

- Vercel

- vite

### Backend

[![My Skills](https://skillicons.dev/icons?i=java,spring)](https://skillicons.dev)

- Java 21

- Spring Boot 3.5

- Spring Security

- Spring Data JPA

### Database

[![My Skills](https://skillicons.dev/icons?i=postgres)](https://skillicons.dev)

- PostgreSQL (Railway)

### Infra

[![My Skills](https://skillicons.dev/icons?i=vercel)](https://skillicons.dev)

- Railway (Backend, DB)

- Vercel (Frontend)

- HTTPS 환경 구성

---

## 주요 기능

### 사용자

- 강아지 산책 예약

- 예약 상태 조회

- 일자별 산책 결과 조회

- QnA 및 의견 등록

### 관리자 (ROLE_ADMIN)

- 오늘 예약 / 만료 예약 조회

- 이벤트 신청 예약 관리

- 예약 상태 변경

- 일자별 산책 결과 작성 및 저장

- Q&A 관리

---

## 인증 & 보안 구조

본 프로젝트는 JWT가 아닌 HttpSession 기반 인증을 사용합니다.

### 인증 흐름

1. 사용자가 로그인 요청

2. `AuthenticationManager`를 통해 사용자 인증

3. 인증 성공 시 `SecurityContext` 생성

4. `HttpSessionSecurityContextRepository`를 통해 인증 정보를 HttpSession에 저장

5. 서버가 `JSESSIONID` 쿠키 반환

6. 이후 요청은 세션 쿠키 기반으로 인증 처리

### 보안 설정

- Spring Security 기반 접근 제어

- 관리자 API는 `ROLE_ADMIN` 권한 필수

- CORS 설정 + `allowCredentials=true` 필요

- 프론트엔드 요청 시 `withCredentials` 사용

---

<img width="1536" height="1024" alt="6bc4eb8e-00c9-444f-baa9-c4115cca505e" src="https://github.com/user-attachments/assets/b0ac21e9-e4f0-4533-947d-96b59c769951" />

## 시스템 아키텍처

### 설계 포인트

- 프론트엔드 / 백엔드 완전 분리
- 세션 기반 인증으로 서버 중심 보안 관리
- 실 배포 환경에서의 인증 유지 문제 해결 경험

---

## 프로젝트를 통해 얻은 경험

- spring Security 인증 흐름에 대한 이해

- `SecurityContext`와 `HttpSession` 동작 방식 분석

- CORS + 세션 쿠키 문제 해결

- Railway / Vercel 환경에서의 실 배포 경험

- 관리자 권한 분리 및 접근 제어 설계

---

### 배포 주소

- Frontend: https://dog-go-frontend-roan.vercel.app
- Backend : Railway 배포
