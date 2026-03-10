---
title: "마크다운으로 이력서 만들기"
description: "마크다운으로 이력서를 작성하고 PDF로 변환하는 방법을 안내합니다. 템플릿 구조, CSS 스타일링, printmd 활용법, ATS 친화적인 이력서 작성 팁까지 다룹니다."
date: 2025-03-20
tags: [마크다운, 이력서, 취업, PDF]
---

# 마크다운으로 이력서 만들기

이력서를 Word나 한글로 작성하고 계신가요? 개발자라면 마크다운으로 이력서를 작성하는 것을 고려해보세요. 버전 관리가 가능하고, 내용에 집중할 수 있으며, CSS로 자유롭게 스타일링할 수 있습니다. 이 글에서는 마크다운 이력서의 장점, 작성 방법, 그리고 PDF로 변환하는 과정을 단계별로 안내합니다.

## 왜 마크다운으로 이력서를 쓸까?

### 1. 버전 관리가 가능하다

이력서는 계속 업데이트됩니다. Git으로 관리하면 변경 이력을 추적할 수 있고, 지원하는 회사에 따라 다른 버전을 만들 수도 있습니다.

```bash
# 회사별 브랜치로 관리
git checkout -b resume/naver
# 네이버 맞춤형으로 수정 후
git commit -m "네이버 지원용 이력서 업데이트"

git checkout -b resume/kakao
# 카카오 맞춤형으로 수정 후
git commit -m "카카오 지원용 이력서 업데이트"
```

### 2. 내용에 집중할 수 있다

Word에서 서식을 맞추느라 시간을 쓰는 대신, 마크다운에서는 내용만 집중해서 작성합니다. 디자인은 CSS로 한 번에 적용하면 됩니다.

### 3. 코드처럼 관리한다

개발자답게 이력서를 코드처럼 관리할 수 있습니다. 이력서 자체가 기술력을 보여주는 포트폴리오가 됩니다.

### 4. 다양한 형식으로 변환 가능하다

하나의 마크다운 소스에서 PDF, HTML, Word 등 다양한 형식으로 변환할 수 있습니다.

## 이력서 템플릿

### 기본 구조

```markdown
# 홍길동

> 3년차 프론트엔드 개발자 | 사용자 경험을 중시하는 웹 개발자

## 연락처

- **이메일**: hong@example.com
- **GitHub**: github.com/honggildong
- **블로그**: blog.honggildong.dev
- **전화**: 010-1234-5678

---

## 요약

사용자 중심의 웹 애플리케이션을 개발하는 프론트엔드 개발자입니다.
React와 TypeScript를 주력으로 사용하며, 성능 최적화와 접근성에
관심이 많습니다. 스타트업에서 대기업까지 다양한 환경에서의
개발 경험이 있습니다.

---

## 기술 스택

### 프론트엔드
- **언어**: TypeScript, JavaScript (ES6+)
- **프레임워크**: React, Next.js
- **상태 관리**: Zustand, React Query
- **스타일링**: Tailwind CSS, Styled Components
- **테스트**: Jest, React Testing Library, Cypress

### 백엔드 & 인프라
- **서버**: Node.js, Express
- **데이터베이스**: PostgreSQL, MongoDB
- **인프라**: AWS (EC2, S3, CloudFront), Docker
- **CI/CD**: GitHub Actions

---

## 경력

### ABC 테크 | 프론트엔드 개발자
*2023.03 - 현재*

**이커머스 플랫폼 리뉴얼 프로젝트**
- Next.js 13 App Router를 도입하여 초기 로딩 속도 40% 개선
- React Query 기반 서버 상태 관리 아키텍처 설계
- Lighthouse 성능 점수 45점 → 92점으로 개선
- 기술 스택: Next.js, TypeScript, React Query, Tailwind CSS

**디자인 시스템 구축**
- 사내 공통 컴포넌트 라이브러리(50+ 컴포넌트) 설계 및 개발
- Storybook 기반 컴포넌트 문서화
- 번들 사이즈 최적화로 패키지 크기 60% 감소

### XYZ 소프트 | 주니어 개발자
*2021.06 - 2023.02*

**SaaS 대시보드 개발**
- React + D3.js 기반 데이터 시각화 대시보드 개발
- WebSocket을 활용한 실시간 데이터 업데이트 구현
- 사용자 피드백 반영으로 DAU 30% 증가에 기여

---

## 프로젝트

### 오픈소스 마크다운 에디터
- **설명**: 실시간 미리보기를 지원하는 웹 기반 마크다운 에디터
- **기술**: React, CodeMirror, unified.js
- **GitHub**: github.com/honggildong/md-editor
- **성과**: GitHub Stars 500+, npm 주간 다운로드 2,000+

### 개인 블로그
- **설명**: Next.js 기반 정적 블로그
- **기술**: Next.js, MDX, Vercel
- **URL**: blog.honggildong.dev
- **성과**: 월 방문자 5,000+, 기술 블로그 커뮤니티 선정

---

## 교육

### 한국대학교 | 컴퓨터공학과
*2017.03 - 2021.02 | 학사*

- GPA: 3.8/4.5
- 졸업 프로젝트: AI 기반 코드 리뷰 도구 개발

---

## 자격증 & 활동

- AWS Solutions Architect Associate (2024)
- 정보처리기사 (2020)
- 사내 프론트엔드 스터디 리드 (2023-현재)
- 오픈소스 컨트리뷰톤 참가 (2022, 2023)
```

## CSS로 스타일링하기

마크다운 이력서의 디자인은 CSS로 결정됩니다. printmd에서 커스텀 CSS를 적용하거나, HTML 변환 후 스타일을 입힐 수 있습니다.

### 기본 스타일

```css
/* 전체 레이아웃 */
body {
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  font-size: 10pt;
  line-height: 1.6;
  color: #333;
  max-width: 210mm;
  margin: 0 auto;
  padding: 20mm;
}

/* 이름 (h1) */
h1 {
  font-size: 24pt;
  font-weight: 700;
  margin-bottom: 4px;
  color: #1a1a1a;
  border-bottom: none;
}

/* 한 줄 소개 (blockquote) */
blockquote {
  border-left: none;
  padding: 0;
  margin: 0 0 16px 0;
  font-style: normal;
  color: #666;
  font-size: 11pt;
}

/* 섹션 제목 (h2) */
h2 {
  font-size: 14pt;
  font-weight: 600;
  color: #2563eb;
  border-bottom: 2px solid #2563eb;
  padding-bottom: 4px;
  margin-top: 20px;
}

/* 회사/학교 (h3) */
h3 {
  font-size: 12pt;
  font-weight: 600;
  margin-bottom: 2px;
}

/* 기간 (em) */
em {
  color: #666;
  font-style: normal;
  font-size: 9pt;
}

/* 구분선 */
hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
}

/* 목록 */
ul {
  padding-left: 20px;
}

li {
  margin-bottom: 4px;
}
```

### 인쇄 최적화 CSS

```css
@media print {
  body {
    padding: 15mm;
  }

  /* 페이지 나눔 제어 */
  h2, h3 {
    page-break-after: avoid;
  }

  section {
    page-break-inside: avoid;
  }

  /* 링크 URL 표시 (선택) */
  a[href]:after {
    content: " (" attr(href) ")";
    font-size: 8pt;
    color: #999;
  }

  /* 불필요한 요소 숨기기 */
  .no-print {
    display: none;
  }
}

/* A4 용지에 맞추기 */
@page {
  size: A4;
  margin: 15mm;
}
```

### 2단 레이아웃 스타일

연락처와 기술 스택을 좌측 사이드바에 배치하는 레이아웃도 가능합니다.

```css
/* 연락처 섹션을 가로 배치 */
h2 + ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  list-style: none;
  padding: 0;
}
```

## printmd로 PDF 변환하기

### 변환 과정

1. **마크다운 작성**: 위 템플릿을 기반으로 이력서를 작성합니다.
2. **printmd에서 열기**: 작성한 마크다운 파일을 printmd에서 엽니다.
3. **미리보기 확인**: 렌더링 결과를 확인하고 필요시 내용을 수정합니다.
4. **PDF로 저장**: 인쇄 기능(Ctrl+P / Cmd+P)을 사용해 PDF로 저장합니다.

### PDF 저장 시 설정

- **용지 크기**: A4
- **여백**: 기본값 또는 사용자 정의
- **배경 그래픽**: 체크 (색상과 배경이 포함되도록)
- **머리글/바닥글**: 해제 (URL이나 날짜가 인쇄되지 않도록)

## ATS 친화적인 이력서 팁

ATS(Applicant Tracking System)는 기업에서 이력서를 자동으로 스크리닝하는 시스템입니다. 마크다운 이력서를 ATS에 맞게 작성하는 팁을 알아봅니다.

### 1. 단순한 구조를 유지하라

```markdown
<!-- 좋은 구조: ATS가 파싱하기 쉬움 -->
## 경력

### 회사명 | 직책
*기간*

- 업무 내용 1
- 업무 내용 2
```

표나 복잡한 레이아웃보다 단순한 제목+목록 구조가 ATS 호환성이 좋습니다.

### 2. 키워드를 자연스럽게 포함하라

채용 공고에 나온 기술 스택과 키워드를 이력서에 포함합니다.

```markdown
<!-- 채용 공고 키워드: React, TypeScript, Next.js, AWS -->

## 기술 스택
- **프론트엔드**: React, Next.js, TypeScript
- **인프라**: AWS (EC2, S3, CloudFront)
```

### 3. 약어와 풀네임을 함께 쓰라

```markdown
- Amazon Web Services (AWS)
- Continuous Integration/Continuous Deployment (CI/CD)
- Search Engine Optimization (SEO)
```

### 4. 성과를 수치로 표현하라

```markdown
<!-- 나쁜 예: 모호한 표현 -->
- 웹사이트 성능을 개선했습니다.

<!-- 좋은 예: 구체적인 수치 -->
- Lighthouse 성능 점수를 45점에서 92점으로 개선 (104% 향상)
- API 응답 시간을 평균 800ms에서 200ms로 단축 (75% 감소)
- 번들 사이즈를 2.1MB에서 840KB로 최적화 (60% 감소)
```

### 5. 이미지와 아이콘을 피하라

ATS는 이미지를 읽지 못합니다. 텍스트만으로 모든 정보를 전달하세요.

## 이력서 관리 팁

### Git 저장소 구조

```
resume/
├── resume.md          ← 마스터 이력서
├── styles/
│   ├── default.css    ← 기본 스타일
│   ├── minimal.css    ← 미니멀 스타일
│   └── modern.css     ← 모던 스타일
├── versions/
│   ├── resume-naver.md
│   └── resume-kakao.md
└── README.md
```

### 정기 업데이트 습관

분기마다 이력서를 업데이트하세요. 취업 활동 중이 아니더라도 새로운 프로젝트나 성과가 생기면 바로 기록해두면 나중에 이력서를 쓸 때 훨씬 수월합니다.

```bash
# 분기별 이력서 업데이트 커밋
git commit -m "2025 Q1 이력서 업데이트 - 디자인 시스템 프로젝트 추가"
```

### 마크다운 이력서와 웹 포트폴리오 연동

마크다운 이력서를 GitHub Pages나 개인 웹사이트에도 게시하면 온라인 이력서로도 활용할 수 있습니다. 하나의 소스로 PDF 이력서와 웹 이력서를 모두 관리하는 효율적인 워크플로우가 됩니다.

## 마무리

마크다운 이력서는 개발자에게 여러 모로 장점이 많습니다. 내용에 집중할 수 있고, Git으로 버전 관리가 가능하며, CSS로 자유롭게 디자인할 수 있습니다. 무엇보다 이력서를 코드처럼 관리한다는 것 자체가 개발자로서의 역량을 보여줍니다.

처음에는 위의 기본 템플릿에 내용만 채워 넣는 것부터 시작하세요. printmd로 PDF를 변환하면 깔끔한 이력서가 완성됩니다. 디자인은 나중에 CSS로 천천히 다듬으면 됩니다. 중요한 것은 내용이니까요.
