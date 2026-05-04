# LocalTrip AX / 소원로컬트립 MVP

문의·연결 중심의 로컬 여행 플랫폼 MVP 프로젝트입니다.

## 프로젝트 정보
- **기술 스택**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **티켓 T-001**: 프로젝트 초기 세팅 및 앱 골격 구축 완료

## 실행 방법

### 로컬 개발 서버 실행
```bash
npm install
npm run dev
```

### 빌드 및 실행
```bash
npm run build
npm run start
```

## MVP 범위 및 제외 사항

### 핵심 원칙
- 본 서비스는 예약 플랫폼이 아닌 **문의 및 연결** 중심의 플랫폼입니다.

### MVP 제외 기능
- 결제 및 정산 시스템
- 실시간 예약 및 객실 재고 관리
- 차량 운송 관련 기능
- 후기(Review) 시스템
- 쿠폰 및 포인트 시스템
- 데이터베이스 연동 (Prisma 등) - 이후 단계에서 구현
- 인증 시스템 (Auth) - 이후 단계에서 구현
- 외부 API 연동 (지도, AI 등) - 이후 단계에서 구현

## T-001 작업 내용
- Next.js App Router + TypeScript 초기화
- Tailwind CSS 및 shadcn/ui 설정
- 기본 Layout 및 홈 Placeholder 구성
- 프로젝트 문서 구조화 (`docs/` 폴더)
- `.env.example` 및 `README.md` 작성
