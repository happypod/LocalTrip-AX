# Data Model (Draft)

## 핵심 엔티티 구조

### Region (지역)
- id: String
- name: String
- code: String (URL Slug)

### Category (카테고리)
- id: String
- name: String (숙소, 체험, 주민소득상품, 추천코스)
- type: Enum

### Item (상품)
- id: String
- regionId: Relation
- categoryId: Relation
- title: String
- description: Text
- images: String[]
- contactUrl: String (Kakao/Phone)

## 확장 전략
- `regionId` 기반의 샤딩 또는 필터링 구조를 통해 전국 단위 확장 지원.
