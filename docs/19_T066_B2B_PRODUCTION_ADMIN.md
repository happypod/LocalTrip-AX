# T-066 B2B Premium PR 제작대행 신청 관리자 화면

## 목적

T-065에서 접수된 Premium PR 제작대행 문의를 플랫폼 관리자가 별도 관리자 화면에서 확인하고 처리 상태를 관리한다.

## 구현 경로

- 목록: `/admin/premium-pr-applications`
- 상세: `/admin/premium-pr-applications/[id]`
- 상태 변경: `src/app/admin/premium-pr-applications/actions.ts`
- 사이드바 메뉴: `프리미엄 PR 문의`

## 조회 기준

일반 입점신청과 섞이지 않도록 다음 조건을 반드시 적용한다.

```ts
where: {
  region: { slug: "sowon" },
  businessType: "premium_pr_production"
}
```

## 개인정보 기준

목록 화면:

- 신청자명 마스킹
- 연락처 마스킹
- 이메일 마스킹
- 메시지는 `messagePreview`만 전달
- 원문 `message`는 목록 컴포넌트 props로 전달하지 않음

상세 화면:

- 관리자 인증 후 접근
- `sowon` 권역과 `businessType=premium_pr_production` 검증 후 원문 노출

## 상태 기준

Prisma enum은 기존 `InquiryStatus`를 재사용한다.

| 상태 | 운영 의미 |
|---|---|
| `new` | 신규 접수 |
| `in_progress` | 상담/제작 진행 |
| `resolved` | 등록/공개 완료 |
| `archived` | 취소, 보관, 종료 |

## 제외 범위

- 결제/정산 관리
- 촬영 일정 캘린더
- 파일 업로드
- 작업자 배정
- 외부 API 연동
