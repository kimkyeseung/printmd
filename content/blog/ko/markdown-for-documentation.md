---
title: "기술 문서 작성에 마크다운 활용하기"
description: "마크다운을 활용해 효율적으로 기술 문서를 작성하는 방법을 알아봅니다. 폴더 구조, 상호 참조, 버전 관리, 문서화 도구 활용법과 베스트 프랙티스를 소개합니다."
date: 2025-02-10
tags: [마크다운, 기술문서, 문서화, 개발]
---

# 기술 문서 작성에 마크다운 활용하기

소프트웨어 개발에서 문서화는 코드만큼이나 중요합니다. 하지만 많은 개발팀이 문서화를 부담스러워합니다. 마크다운을 활용하면 이 부담을 크게 줄일 수 있습니다. 개발자에게 이미 익숙한 도구와 워크플로우 안에서 자연스럽게 문서를 작성하고 관리할 수 있기 때문입니다.

## 마크다운으로 기술 문서를 쓰는 이유

### 코드와 같은 워크플로우

마크다운 문서는 코드와 동일한 방식으로 관리됩니다. Git으로 버전 관리를 하고, Pull Request로 리뷰하고, CI/CD로 배포합니다. 별도의 문서 관리 시스템을 도입할 필요가 없습니다.

```bash
# 문서도 브랜치에서 작업
git checkout -b docs/update-api-guide

# 변경 사항 커밋
git add docs/api-guide.md
git commit -m "docs: API 가이드에 인증 섹션 추가"

# PR 생성
git push origin docs/update-api-guide
```

### Diff로 변경 이력 추적

마크다운은 텍스트 기반이므로 Git diff로 변경 내용을 정확히 확인할 수 있습니다. Word 문서에서는 이런 정밀한 변경 추적이 어렵습니다.

### 다양한 출력 형식

하나의 마크다운 소스에서 웹사이트, PDF, ePub 등 다양한 형식으로 출력할 수 있습니다. 문서를 한 번 작성하면 필요에 따라 형식만 바꾸면 됩니다.

## 문서 폴더 구조

프로젝트의 규모와 성격에 따라 적절한 폴더 구조를 선택합니다.

### 소규모 프로젝트

```
project/
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── docs/
    ├── getting-started.md
    ├── configuration.md
    └── faq.md
```

### 중대규모 프로젝트

```
project/
├── README.md
├── docs/
│   ├── index.md
│   ├── getting-started/
│   │   ├── installation.md
│   │   ├── quick-start.md
│   │   └── configuration.md
│   ├── guides/
│   │   ├── authentication.md
│   │   ├── database.md
│   │   └── deployment.md
│   ├── api/
│   │   ├── overview.md
│   │   ├── endpoints.md
│   │   └── errors.md
│   ├── reference/
│   │   ├── cli.md
│   │   ├── config.md
│   │   └── environment.md
│   └── contributing/
│       ├── development.md
│       ├── style-guide.md
│       └── release.md
```

### 파일 이름 규칙

- **소문자 사용**: `getting-started.md` (O) `Getting-Started.md` (X)
- **하이픈으로 구분**: `api-reference.md` (O) `api_reference.md` (X)
- **영문 사용**: URL에 포함될 수 있으므로 파일명은 영문으로 작성합니다.
- **명확한 이름**: `guide.md`보다 `authentication-guide.md`가 낫습니다.

## 상호 참조 (Cross-referencing)

문서 간 연결은 독자가 관련 내용을 쉽게 찾을 수 있게 해줍니다.

### 같은 문서 내 참조

```markdown
자세한 내용은 [설정 섹션](#설정)을 참고하세요.

## 설정

여기에 설정 내용을 작성합니다.
```

### 다른 문서 참조

```markdown
인증에 대한 자세한 내용은 [인증 가이드](./guides/authentication.md)를 참고하세요.

API 엔드포인트 목록은 [API 레퍼런스](../api/endpoints.md)에서 확인할 수 있습니다.
```

### 참조 링크 스타일

문서 내에 링크가 많으면 참조 스타일을 사용하면 가독성이 좋아집니다.

```markdown
설치 방법은 [설치 가이드][install]를 참고하고,
설정 방법은 [설정 가이드][config]에서 확인하세요.

[install]: ./getting-started/installation.md
[config]: ./getting-started/configuration.md
```

## 버전 관리와 문서

### 문서와 코드를 함께 커밋하라

기능이 변경되면 관련 문서도 같은 PR에서 업데이트합니다. 이를 강제하기 위해 PR 템플릿에 문서 업데이트 체크리스트를 추가할 수 있습니다.

```markdown
<!-- PR 템플릿 -->
## 체크리스트

- [ ] 코드 변경 사항에 대한 테스트 추가
- [ ] 관련 문서 업데이트
- [ ] CHANGELOG 업데이트
```

### CHANGELOG 관리

변경 이력을 체계적으로 관리합니다.

```markdown
# Changelog

## [1.2.0] - 2025-02-10

### 추가
- OAuth 2.0 인증 지원
- 다국어 지원 (한국어, 일본어)

### 변경
- API 응답 형식을 JSON:API 규격으로 변경

### 수정
- 대용량 파일 업로드 시 타임아웃 오류 수정

### 제거
- 더 이상 사용되지 않는 v1 API 엔드포인트 제거
```

[Keep a Changelog](https://keepachangelog.com/) 규약을 따르면 일관된 형식을 유지할 수 있습니다.

## 문서화 도구 활용

### MkDocs

Python 기반의 정적 문서 사이트 생성기입니다.

```yaml
# mkdocs.yml
site_name: 프로젝트 문서
theme:
  name: material
  language: ko
nav:
  - 시작하기: index.md
  - 설치: getting-started/installation.md
  - 가이드:
    - 인증: guides/authentication.md
    - 배포: guides/deployment.md
```

```bash
# 설치
pip install mkdocs mkdocs-material

# 로컬 서버 실행
mkdocs serve

# 빌드
mkdocs build
```

MkDocs Material 테마는 검색, 다크 모드, 다국어 지원 등 풍부한 기능을 제공합니다.

### Docusaurus

React 기반의 문서 사이트 생성기로, Facebook(Meta)에서 만들었습니다.

```bash
# 프로젝트 생성
npx create-docusaurus@latest my-docs classic

# 개발 서버 실행
cd my-docs
npm start
```

블로그 기능과 버전 관리 기능이 내장되어 있어 대규모 프로젝트에 적합합니다.

### VitePress

Vue.js 기반의 경량 문서 사이트 생성기입니다.

```bash
# 설치
npm add -D vitepress

# 개발 서버
npx vitepress dev docs
```

빌드 속도가 빠르고 설정이 간단한 것이 장점입니다.

## 기술 문서 작성 베스트 프랙티스

### 1. 독자를 정의하라

누가 이 문서를 읽을 것인지 먼저 정의합니다.

- **초보자**: 개념 설명과 단계별 가이드가 필요
- **경험자**: 빠른 참조와 고급 설정이 필요
- **기여자**: 아키텍처와 개발 가이드가 필요

### 2. 예제를 충분히 넣어라

````markdown
<!-- 나쁜 예: 설명만 있음 -->
`format` 옵션으로 출력 형식을 지정할 수 있습니다.

<!-- 좋은 예: 코드 예제 포함 -->
`format` 옵션으로 출력 형식을 지정할 수 있습니다.

```javascript
const result = convert(markdown, {
  format: 'pdf',  // 'html', 'pdf', 'epub' 중 선택
});
```
````

### 3. 경고와 참고를 명확히 표시하라

```markdown
> **참고**: 이 기능은 v2.0 이상에서만 사용 가능합니다.

> **주의**: 이 작업은 되돌릴 수 없습니다. 반드시 백업 후 진행하세요.

> **팁**: 개발 환경에서는 `--watch` 플래그를 사용하면 파일 변경 시 자동으로 재빌드됩니다.
```

### 4. 일관된 용어를 사용하라

같은 개념에 대해 문서 전체에서 동일한 용어를 사용합니다. 용어집(Glossary)을 만들어 두면 좋습니다.

### 5. 정기적으로 검토하라

분기마다 문서를 검토하여 오래된 내용을 업데이트합니다. 문서에 마지막 수정일을 표시하면 독자가 최신 여부를 판단할 수 있습니다.

## 문서를 PDF로 배포하기

기술 문서를 오프라인에서 참고하거나 공식 문서로 배포해야 할 때가 있습니다. printmd를 사용하면 마크다운 기술 문서를 깔끔한 PDF로 변환할 수 있습니다. 코드 블록의 구문 강조, 표, 목차 등이 잘 유지되어 인쇄물로도 손색이 없습니다.

## 마무리

마크다운을 활용한 기술 문서화는 개발자에게 가장 자연스러운 문서화 방법입니다. 별도의 도구 없이 익숙한 에디터와 Git으로 문서를 관리할 수 있고, 다양한 정적 사이트 생성기로 아름다운 문서 웹사이트를 만들 수 있습니다. 중요한 것은 도구가 아니라 문서화하는 습관입니다. 코드를 작성할 때 문서도 함께 작성하는 습관을 들이면, 미래의 자신과 팀원들에게 큰 도움이 될 것입니다.
