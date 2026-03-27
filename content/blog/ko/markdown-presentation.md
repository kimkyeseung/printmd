---
title: "마크다운으로 프레젠테이션 만들기"
description: "마크다운으로 프레젠테이션 슬라이드를 만드는 방법을 소개합니다. Marp, Slidev, reveal.js 도구 비교와 기본 슬라이드 문법, 스타일링, 코드 하이라이팅, PDF 내보내기 방법을 다룹니다."
date: 2025-03-25
tags: [마크다운, 프레젠테이션, 슬라이드, 발표]
---

# 마크다운으로 프레젠테이션 만들기

파워포인트에서 도형 정렬하고 폰트 맞추느라 시간을 보낸 경험이 있으신가요? 발표 내용보다 슬라이드 디자인에 더 많은 시간을 쓰고 있다면, 마크다운 프레젠테이션을 시도해보세요. 텍스트만으로 깔끔한 슬라이드를 만들 수 있고, 코드 하이라이팅도 자동으로 됩니다. 개발자 발표에 특히 적합합니다.

## 마크다운 프레젠테이션의 장점

### 내용에 집중할 수 있다

파워포인트에서는 슬라이드 레이아웃, 색상, 폰트, 애니메이션 등에 신경을 쓰느라 정작 내용이 부실해지기 쉽습니다. 마크다운에서는 텍스트만 작성하면 되므로 내용에 온전히 집중할 수 있습니다.

### 코드가 아름답게 보인다

개발 관련 발표에서 코드를 보여줘야 할 때, 파워포인트에서는 코드를 스크린샷으로 찍거나 서식을 일일이 맞춰야 합니다. 마크다운 프레젠테이션 도구들은 자동으로 구문 강조를 적용합니다.

### 버전 관리가 가능하다

발표 자료도 Git으로 관리할 수 있습니다. 수정 이력을 추적하고, 브랜치로 다양한 버전을 관리할 수 있습니다.

### 파일 크기가 작다

텍스트 기반이므로 파일 크기가 매우 작습니다. 이미지를 많이 쓰지 않는다면 KB 단위입니다.

## 도구 비교

### Marp (Markdown Presentation Ecosystem)

Marp은 마크다운을 슬라이드로 변환하는 가장 접근성 높은 도구입니다.

**특징**:
- VS Code 확장으로 바로 사용 가능
- HTML, PDF, PPTX로 내보내기 지원
- CSS로 테마 커스터마이징
- CLI 도구로 자동화 가능

**설치 및 사용**:

```bash
# CLI 설치
npm install -g @marp-team/marp-cli

# 슬라이드 변환
marp slide.md --html
marp slide.md --pdf
marp slide.md --pptx

# 개발 서버
marp slide.md --server
```

**VS Code에서 사용**:
1. `Marp for VS Code` 확장 프로그램 설치
2. 마크다운 파일 상단에 Marp 설정 추가
3. 미리보기에서 슬라이드 확인

### Slidev

Slidev는 Vue.js 기반의 개발자 친화적 프레젠테이션 도구입니다.

**특징**:
- 실시간 코딩 데모 가능
- Vue 컴포넌트를 슬라이드에 삽입 가능
- 발표자 노트, 녹화 기능
- 다양한 테마와 레이아웃
- 인터랙티브 슬라이드

**설치 및 사용**:

```bash
# 프로젝트 생성
npm init slidev@latest

# 개발 서버
npm run dev

# 빌드
npm run build

# PDF 내보내기
npm run export
```

### reveal.js

reveal.js는 가장 역사가 오래된 HTML 프레젠테이션 프레임워크입니다.

**특징**:
- 풍부한 전환 효과
- 스피커 노트 지원
- 수직/수평 슬라이드 네비게이션
- 마크다운 플러그인으로 마크다운 작성 가능
- PDF 내보내기 지원

**설치 및 사용**:

```bash
# 저장소 클론
git clone https://github.com/hakimel/reveal.js.git
cd reveal.js

# 설치 및 실행
npm install
npm start
```

### 도구 비교표

| 기능 | Marp | Slidev | reveal.js |
|:-----|:----:|:------:|:---------:|
| 학습 곡선 | 낮음 | 보통 | 보통 |
| VS Code 통합 | 최고 | 좋음 | 보통 |
| 코드 하이라이팅 | 좋음 | 최고 | 좋음 |
| 인터랙티브 | 제한적 | 최고 | 좋음 |
| 테마 | 기본 3종 | 다양 | 다양 |
| PDF 내보내기 | 좋음 | 좋음 | 좋음 |
| PPTX 내보내기 | 지원 | 미지원 | 미지원 |
| 오프라인 발표 | 가능 | 가능 | 가능 |
| 커스터마이징 | CSS | Vue + CSS | HTML + CSS |

## Marp으로 슬라이드 만들기

Marp이 가장 진입 장벽이 낮으므로 Marp을 기준으로 상세 문법을 설명합니다.

### 기본 구조

```markdown
---
marp: true
theme: default
paginate: true
---

# 발표 제목

발표자 이름 | 날짜

---

## 첫 번째 슬라이드

- 핵심 내용 1
- 핵심 내용 2
- 핵심 내용 3

---

## 두 번째 슬라이드

더 자세한 내용을 설명합니다.

---

## 감사합니다

질문이 있으신가요?
```

슬라이드는 `---`(수평선)으로 구분합니다. 이것만 알면 기본적인 슬라이드를 만들 수 있습니다.

### 이미지 추가

```markdown
---

## 아키텍처

![width:600px](./images/architecture.png)

---

## 배경 이미지

![bg](./images/background.jpg)

---

## 배경 이미지 (반투명)

![bg opacity:0.3](./images/background.jpg)

# 텍스트가 보이는 슬라이드

---

## 좌우 분할

![bg left:40%](./images/photo.jpg)

오른쪽에 텍스트가 표시됩니다.
- 항목 1
- 항목 2
```

### 코드 하이라이팅

````markdown
---

## React 컴포넌트 예시

```tsx
interface Props {
  title: string;
  items: string[];
}

function TodoList({ title, items }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

---
````

코드 블록은 자동으로 구문 강조가 적용됩니다. 발표에서 코드를 보여줄 때 매우 유용합니다.

### 스타일 커스터마이징

```markdown
---
marp: true
theme: default
style: |
  section {
    font-family: 'Pretendard', sans-serif;
    background-color: #f8f9fa;
  }
  h1 {
    color: #2563eb;
  }
  h2 {
    color: #1e40af;
    border-bottom: 2px solid #3b82f6;
  }
  code {
    font-family: 'JetBrains Mono', monospace;
  }
---
```

### Marp 디렉티브

슬라이드별로 설정을 다르게 적용할 수 있습니다.

```markdown
---

<!-- _class: lead -->
<!-- _backgroundColor: #1e3a5f -->
<!-- _color: white -->

# 제목 슬라이드

강조하고 싶은 슬라이드에 다른 스타일 적용

---

<!-- _footer: "© 2025 홍길동" -->
<!-- _paginate: false -->

## 일반 슬라이드

이 슬라이드에만 하단에 푸터가 표시됩니다.
```

## Slidev로 인터랙티브 슬라이드 만들기

### 기본 구조

```markdown
---
theme: seriph
background: https://cover.sli.dev
title: 발표 제목
---

# 발표 제목

부제목

<div class="abs-br m-6 text-xl">
  발표자 이름
</div>

---

# 목차

<Toc />

---
layout: two-cols
---

# 좌우 분할 레이아웃

왼쪽 내용

::right::

오른쪽 내용

---
layout: center
---

# 가운데 정렬 슬라이드
```

### 코드 블록 하이라이팅

````markdown
---

# 코드에 라인 하이라이트

```typescript {2-3|5-6|all}
function greet(name: string): string {
  // 이 줄이 먼저 강조됩니다
  const greeting = `안녕하세요, ${name}님!`;

  // 그 다음 이 줄이 강조됩니다
  console.log(greeting);

  return greeting;
}
```

---
````

`{2-3|5-6|all}` 문법으로 클릭할 때마다 다른 줄이 하이라이트됩니다. 코드를 단계별로 설명할 때 매우 유용합니다.

## PDF로 내보내기

### Marp

```bash
# PDF로 변환
marp slide.md --pdf

# 옵션 추가
marp slide.md --pdf --allow-local-files
```

### Slidev

```bash
# PDF 내보내기 (playwright 필요)
npm run export

# 옵션
slidev export --output slides.pdf
```

### reveal.js

reveal.js는 브라우저에서 `?print-pdf`를 URL에 추가한 후 인쇄 기능으로 PDF를 생성합니다.

```
http://localhost:8000/?print-pdf
```

### printmd 활용

간단한 슬라이드 스타일의 문서를 만들고 싶다면, printmd에서 마크다운을 인쇄 최적화된 형태로 변환하는 것도 방법입니다. 특히 발표 후 핸드아웃으로 배포할 문서를 만들 때 유용합니다.

## 발표 자료 작성 팁

### 1. 한 슬라이드에 하나의 메시지

```markdown
---

<!-- 나쁜 예: 너무 많은 내용 -->

## 프로젝트 소개

- 프로젝트 배경
- 기술 스택
- 아키텍처
- 주요 기능
- 성능 개선
- 향후 계획

---

<!-- 좋은 예: 하나의 핵심 메시지 -->

## 성능 개선 결과

**API 응답 시간 75% 감소**

800ms → 200ms

---
```

### 2. 글자 수를 최소화하라

슬라이드는 읽는 것이 아니라 보는 것입니다. 핵심 키워드만 넣고, 설명은 말로 합니다.

### 3. 코드는 핵심만 보여줘라

````markdown
---

## 전체 코드 (X)

모든 코드를 보여주면 청중이 따라가기 어렵습니다.

---

## 핵심 코드만 (O)

```typescript
// 캐싱으로 성능 개선
const cache = new Map();

function getData(key: string) {
  if (cache.has(key)) return cache.get(key);
  const data = fetchFromDB(key);
  cache.set(key, data);
  return data;
}
```

---
````

### 4. 데모를 준비하라

마크다운 슬라이드의 장점 중 하나는 코드와 가까이 있다는 것입니다. 가능하면 라이브 데모를 준비하세요.

### 5. 발표자 노트를 활용하라

Marp과 Slidev 모두 발표자 노트를 지원합니다.

```markdown
---

## 슬라이드 내용

핵심 키워드만 표시

<!--
발표자 노트:
여기에 상세한 설명을 적어둡니다.
- 이 슬라이드에서 강조할 점
- 예상 질문과 답변
- 시간: 2분
-->
```

## 마무리

마크다운 프레젠테이션은 개발자에게 가장 효율적인 발표 자료 제작 방법입니다. 내용에 집중할 수 있고, 코드가 아름답게 보이며, 버전 관리까지 가능합니다.

처음이라면 Marp부터 시작하세요. VS Code에서 바로 사용할 수 있어 진입 장벽이 가장 낮습니다. 인터랙티브한 슬라이드가 필요하다면 Slidev로 넘어가면 됩니다.

파워포인트가 필요 없다는 뜻은 아닙니다. 디자인이 중요한 발표(경영진 보고, 마케팅 발표 등)에서는 여전히 파워포인트가 적합합니다. 하지만 기술 발표, 사내 세미나, 스터디 발표 등에서는 마크다운 프레젠테이션이 훨씬 효율적입니다. 한 번 시도해보면 다시 돌아가기 어려울 것입니다.
