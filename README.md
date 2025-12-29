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

### DB 설계

## 공통 엔티티

BaseEntity (공통 생성/수정 시간 관리)

모든 주요 엔티티에서 상속받아 생성일 / 수정일 자동 관리를 수행합니다.

| 필드명       | 타입          | 설명                          |
| ------------ | ------------- | ----------------------------- |
| createdDate  | LocalDateTime | 생성 시 자동 저장 (수정 불가) |
| modifiedDate | LocalDateTime | 수정 시 자동 갱신             |

특징

- @MappedSuperclass 사용

- Spring Data JPA Auditing 적용

- 중복 코드 제거 및 일관된 시간 관리

## Member (회원)

사용자 및 관리자 정보를 관리하는 엔티티입니다.

| 필드명   | 타입   | 설명                       |
| -------- | ------ | -------------------------- |
| id       | Long   | 회원 고유 ID (PK)          |
| email    | String | 이메일 (Unique)            |
| password | String | 암호화된 비밀번호          |
| name     | String | 사용자 이름                |
| role     | Role   | 사용자 권한 (USER / ADMIN) |

특징

- 이메일 기반 로그인

- EnumType.STRING으로 권한 관리

- Spring Security 연동 대상 엔티티

## Qna (문의)

사용자의 서비스 만족도 및 문의 사항을 저장합니다.

| 필드명       | 타입          | 설명         |
| ------------ | ------------- | ------------ |
| id           | Long          | 문의 ID (PK) |
| memo         | String        | 문의 내용    |
| satisfaction | String        | 만족도       |
| createdAt    | LocalDateTime | 생성일       |
| updateAt     | LocalDateTime | 수정일       |

특징

- Auditing 적용

- 단순 문의 및 피드백 목적

## Reservation (산책 예약)

강아지 산책 예약 정보를 관리하는 핵심 엔티티입니다.

| 필드명   | 타입   | 설명                     |
| -------- | ------ | ------------------------ |
| id       | Long   | 예약 ID (PK)             |
| calender | String | 예약 날짜                |
| clock    | String | 예약 시간                |
| dogType  | String | 강아지 종류              |
| dogAge   | int    | 강아지 나이              |
| name     | String | 보호자 이름              |
| phone    | String | 연락처                   |
| location | String | 산책 장소                |
| distance | int    | 산책 거리                |
| event    | String | 특이사항                 |
| status   | String | 예약 상태 (기본값: 대기) |

특징

- BaseEntity 상속 (시간 자동 관리)

- @PrePersist로 상태 기본값 설정

- Tracking 엔티티와 1:N 관계

## Tracking (산책 기록)

산책 진행 중 작성되는 기록을 관리하는 엔티티입니다.

| 필드명      | 타입         | 설명                  |
| ----------- | ------------ | --------------------- |
| id          | Long         | 기록 ID (PK)          |
| reservation | Reservation  | 연관된 예약           |
| record      | String (Lob) | 산책 상세 기록        |
| statusJSON  | String (Lob) | 위치/상태 JSON 데이터 |
| photos      | List         | 산책 사진 목록        |
| tags        | List         | 산책 태그 목록        |

관계

- Reservation : Tracking → N : 1

- Tracking : TrackingPhoto → 1 : N

- Tracking : TrackingTag → 1 : N

특징

- 대용량 텍스트 저장을 위한 @Lob

- 연관관계 편의 메서드 제공

- Cascade + orphanRemoval 적용

## TrackingPhoto (산책 사진)

산책 중 촬영된 사진 정보를 관리합니다.

| 필드명       | 타입     | 설명             |
| ------------ | -------- | ---------------- |
| id           | Long     | 사진 ID (PK)     |
| originalName | String   | 원본 파일명      |
| savedName    | String   | 서버 저장 파일명 |
| filePath     | String   | 파일 경로        |
| tracking     | Tracking | 연관된 산책 기록 |

특징

- Tracking과 다대일 관계

- JSON 순환 참조 방지 처리

## TrackingTag (산책 태그)

산책 중 발생한 이벤트를 태그로 기록합니다.

| 필드명   | 타입     | 설명             |
| -------- | -------- | ---------------- |
| id       | Long     | 태그 ID (PK)     |
| name     | String   | 태그명           |
| tracking | Tracking | 연관된 산책 기록 |

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
