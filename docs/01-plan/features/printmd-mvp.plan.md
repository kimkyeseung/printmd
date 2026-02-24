# Plan: printmd MVP

> PDCA Phase: **Plan**
> Created: 2026-02-24
> Status: Draft

---

## 1. Feature Overview

### 1.1 Feature Name
printmd MVP (Minimum Viable Product)

### 1.2 One-Line Description
마크다운을 어디서든 가져와서 스타일을 골라 바로 PDF/인쇄로 뽑는 무료 웹 도구 + Chrome 익스텐션

### 1.3 Business Value
| Metric | Target |
|--------|--------|
| Primary Revenue | Google AdSense 광고 수익 |
| Target Users | 개발자, 취준생, 직장인 |
| Operating Cost | 연간 ~$20 (도메인 + 스토어 등록비) |
| Competitive Edge | 마크다운 특화 + 스타일 커스터마이징 + 익스텐션 연동 |

---

## 2. Requirements Summary

### 2.1 Functional Requirements

#### Web Service (printmd.app)

| ID | Category | Requirement | Priority |
|----|----------|-------------|----------|
| WEB-01 | Editor | 분할 화면 (좌측 편집 / 우측 미리보기) | P0 |
| WEB-02 | Editor | 마크다운 툴바 (B, I, H1~H3, 링크, 이미지, 코드블록) | P0 |
| WEB-03 | Editor | 단축키 지원 (Ctrl+B, Ctrl+I, Ctrl+Z, Tab) | P0 |
| WEB-04 | Editor | .md 파일 불러오기 (드래그앤드롭, 파일 선택) | P0 |
| WEB-05 | Editor | .md 파일 다운로드 저장 | P0 |
| WEB-06 | Editor | LocalStorage 임시 저장 | P0 |
| WEB-07 | Editor | 익스텐션 수신 모드 (전달된 내용 자동 로드) | P0 |
| WEB-08 | Editor | 전체화면 모드 | P0 |
| WEB-09 | Editor | 뷰어 전용 모드 | P0 |
| WEB-10 | Editor | 원본 소스 링크 표시 | P0 |
| WEB-11 | Style | 프리셋 테마 5종 (Default, Dark, Document, Blog, Minimal) | P0 |
| WEB-12 | Style | 전역 스타일 커스터마이징 (글씨 크기, 색상, 행간, 배경색, 폰트, 링크 색상, 코드블록 배경, 페이지 너비, 여백) | P0 |
| WEB-13 | Style | 리스트 항목 세부 스타일 (first/last/odd/even/nth-child, prefix/suffix) | P1 |
| WEB-14 | Style | 헤딩별 스타일 설정 | P1 |
| WEB-15 | Print | 인쇄 미리보기 (A4 기준 페이지 레이아웃 오버레이) | P0 |
| WEB-16 | Print | 용지 크기 선택 (A4, Letter, A3) | P0 |
| WEB-17 | Print | 여백 조정 (상하좌우, mm 단위) | P0 |
| WEB-18 | Print | 헤더/푸터 (문서 제목, 날짜, 페이지 번호) | P0 |
| WEB-19 | Print | 배경색 포함 선택 | P0 |
| WEB-20 | Print | 인쇄 전용 CSS (@media print) | P0 |
| WEB-21 | Ads | Google AdSense 광고 연동 | P0 |
| WEB-22 | SEO | SEO 랜딩 페이지 2~3개 (/github, /markdown-to-pdf, /guide) | P1 |

#### Chrome Extension

| ID | Category | Requirement | Priority |
|----|----------|-------------|----------|
| EXT-01 | Core | GitHub .md 파일 뷰어 감지 및 버튼 삽입 | P0 |
| EXT-02 | Core | GitHub README 탭 감지 및 버튼 삽입 | P0 |
| EXT-03 | Core | GitHub API로 Raw 마크다운 가져오기 | P0 |
| EXT-04 | Core | 콘텐츠 전달 (URL 파라미터 / SessionStorage) | P0 |
| EXT-05 | Core | 툴바 아이콘 클릭으로 동작 | P0 |
| EXT-06 | UI | "Open in printmd" 버튼 스타일 | P0 |
| EXT-07 | Storage | 사용자 설정 저장 (chrome.storage.local) | P0 |
| EXT-08 | Core | Notion 공개 페이지 연동 | P2 |
| EXT-09 | Core | Confluence 페이지 연동 | P2 |
| EXT-10 | Core | HTML 본문 추출 (Readability.js) | P2 |

### 2.2 Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | 초기 로딩 속도 LCP | < 2.5초 |
| Performance | 편집 → 미리보기 반영 | < 100ms |
| Performance | 익스텐션 버튼 삽입 | < 500ms |
| Security | XSS 방지 | DOMPurify 필수 |
| Security | 익스텐션 권한 | 최소 권한 원칙 |
| Security | 사용자 데이터 | 서버 전송 없음 |
| Accessibility | WCAG 수준 | 2.1 AA |
| SEO | Lighthouse SEO | 95점 이상 |
| Compliance | Chrome 정책 | Manifest V3 준수 |
| Compliance | AdSense 정책 | 위반 없음 |

---

## 3. Technical Approach

### 3.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js (App Router + SSG) | SEO 최적화, Vercel 배포 |
| Markdown Parser | markdown-it | 플러그인 확장성, 빠른 렌더링 |
| Code Editor | CodeMirror 6 | 마크다운 하이라이팅, 경량 |
| Code Highlighting | highlight.js | 미리보기 코드블록 |
| Style Engine | CSS Variables + Dynamic `<style>` | 즉시 반영, 런타임 없음 |
| HTML Sanitizer | DOMPurify | XSS 방지 필수 |
| State Management | Zustand | 경량 전역 상태 |
| CSS Framework | Tailwind CSS | 빠른 UI 개발 |
| Extension Build | Vite + CRXJS | Manifest V3 번들링 |
| HTML to MD | Turndown.js | DOM → 마크다운 변환 |
| Content Extract | Readability.js | 본문 추출 (Phase 2) |

### 3.2 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    printmd Architecture                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐      ┌──────────────────────────────┐ │
│  │ Chrome Extension │      │      printmd.app (Next.js)   │ │
│  │                  │      │                              │ │
│  │  ┌────────────┐  │      │  ┌──────────┐  ┌──────────┐ │ │
│  │  │ Content    │──┼──────┼─▶│ Editor   │  │ Preview  │ │ │
│  │  │ Script     │  │ URL/ │  │ (CM6)    │  │ (md-it)  │ │ │
│  │  └────────────┘  │ SS   │  └──────────┘  └──────────┘ │ │
│  │                  │      │                              │ │
│  │  ┌────────────┐  │      │  ┌──────────┐  ┌──────────┐ │ │
│  │  │ Popup UI   │  │      │  │ Style    │  │ Print    │ │ │
│  │  └────────────┘  │      │  │ Panel    │  │ Preview  │ │ │
│  │                  │      │  └──────────┘  └──────────┘ │ │
│  └──────────────────┘      │                              │ │
│                            │  ┌──────────────────────────┐│ │
│  ┌──────────────────┐      │  │ LocalStorage             ││ │
│  │ GitHub API       │◀─────│  │ - Content (temp)         ││ │
│  │ (Raw MD fetch)   │      │  │ - Style settings         ││ │
│  └──────────────────┘      │  │ - Saved themes           ││ │
│                            │  └──────────────────────────┘│ │
│                            │                              │ │
│                            │  ┌──────────────────────────┐│ │
│                            │  │ AdSense                  ││ │
│                            │  │ (Header, Sidebar, etc.)  ││ │
│                            │  └──────────────────────────┘│ │
│                            └──────────────────────────────┘ │
│                                                              │
│  Hosting: Vercel (Free) | Domain: printmd.app (~$15/yr)     │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Data Flow

```
[Extension Flow]
GitHub Page → Content Script Detects → Insert Button
    ↓ (Click)
Extract Raw MD via GitHub API
    ↓
URL Param (≤2KB) or SessionStorage (>2KB)
    ↓
Open printmd.app → Load Content → Render Preview

[Web Direct Flow]
User Types MD / Drops .md File
    ↓
CodeMirror Editor → markdown-it Parser → DOMPurify
    ↓
Preview Render (CSS Variables for styling)
    ↓
Print Preview → Browser Print Dialog → PDF/Print
```

---

## 4. Implementation Scope

### 4.1 MVP Scope (Phase 1)

#### Web Service Components

| Component | Description | Files (Est.) |
|-----------|-------------|--------------|
| Layout | 메인 레이아웃, 헤더, 사이드바 | 5 |
| Editor | CodeMirror 기반 편집기, 툴바 | 8 |
| Preview | markdown-it 렌더링, 실시간 동기화 | 4 |
| StylePanel | 테마 선택, 전역 스타일 컨트롤 | 10 |
| PrintPreview | 인쇄 미리보기, 용지/여백 설정 | 6 |
| FileHandler | 파일 불러오기/저장, LocalStorage | 4 |
| ExtensionReceiver | 익스텐션 데이터 수신 처리 | 2 |
| AdSense | 광고 컴포넌트 배치 | 3 |
| SEO Pages | 랜딩 페이지 2~3개 | 6 |
| **Total** | | **~48 files** |

#### Chrome Extension Components

| Component | Description | Files (Est.) |
|-----------|-------------|--------------|
| Manifest | V3 설정 | 1 |
| Background | Service Worker | 1 |
| ContentScript | GitHub 감지 및 버튼 삽입 | 4 |
| Popup | 설정 UI | 3 |
| Utils | GitHub API, 콘텐츠 전달 | 3 |
| **Total** | | **~12 files** |

### 4.2 Out of Scope (Phase 2)

- Notion 페이지 연동
- Confluence 페이지 연동
- HTML 본문 추출
- CSS 직접 편집 모드
- 스타일 CSS export
- URL 인코딩 공유 링크
- 다국어 UI

---

## 5. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| GitHub DOM 구조 변경 | High | Medium | 안정적 selector 사용, 폴백 처리 |
| AdSense 승인 거부 | High | Low | 정책 준수, 충분한 콘텐츠 확보 후 신청 |
| Chrome Web Store 심사 거부 | Medium | Medium | Manifest V3 준수, 최소 권한, 명확한 설명 |
| XSS 취약점 | Critical | Low | DOMPurify 필수 적용, 정기 보안 점검 |
| 성능 이슈 (대용량 MD) | Medium | Medium | 가상 스크롤, 렌더링 최적화 |

---

## 6. Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Core Web Vitals | LCP < 2.5s | Lighthouse |
| SEO Score | ≥ 95 | Lighthouse |
| Editor Response | < 100ms | Performance profiling |
| Extension Install | 1,000+ (첫 3개월) | Chrome Web Store |
| Daily Active Users | 100+ | Google Analytics |
| AdSense Revenue | $50+/month (6개월 후 목표) | AdSense Dashboard |

---

## 7. Dependencies

| Dependency | Type | Required By |
|------------|------|-------------|
| Vercel Account | Infrastructure | Deployment |
| Google AdSense Account | Service | WEB-21 |
| Chrome Developer Account | Service | Extension Publishing |
| printmd.app Domain | Infrastructure | All |
| GitHub API (Public) | External API | EXT-03 |

---

## 8. Timeline Estimate

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Design | 1 week | Design Document, Component Spec |
| Web Core | 2 weeks | Editor, Preview, Style Panel |
| Print Feature | 1 week | Print Preview, PDF Output |
| Extension Core | 1 week | GitHub Integration |
| Integration & QA | 1 week | E2E Testing, Bug Fixes |
| SEO & Ads | 3 days | Landing Pages, AdSense Setup |
| **Total MVP** | **~6 weeks** | Full MVP Launch |

---

## 9. Next Steps

1. **[Design Phase]** - `/pdca design printmd-mvp` 실행
   - Component 구조 설계
   - UI/UX 상세 스펙
   - API 인터페이스 정의
   - 데이터 모델 정의

2. **[Environment Setup]**
   - Next.js 프로젝트 초기화
   - Chrome Extension boilerplate 설정
   - 개발 환경 구성

---

## Appendix: Reference Documents

- [printmd_spec_v3.md](../../printmd_spec_v3.md) - 서비스 기획 스펙 문서
- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [Next.js App Router](https://nextjs.org/docs/app)

---

*Plan Document - printmd MVP v1.0*
