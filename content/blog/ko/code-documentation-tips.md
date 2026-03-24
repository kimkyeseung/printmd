---
title: "코드 문서화 베스트 프랙티스"
description: "효과적인 코드 문서화 방법을 알아봅니다. 인라인 주석, API 문서, JSDoc/TSDoc, README 구조, CHANGELOG 관리까지 실전 베스트 프랙티스를 소개합니다."
date: 2025-03-10
tags: [코드, 문서화, 개발, 베스트프랙티스]
---

# 코드 문서화 베스트 프랙티스

"코드가 곧 문서다"라는 말이 있습니다. 하지만 현실에서 코드만으로 모든 맥락을 전달하기는 어렵습니다. 왜 이런 결정을 했는지, 어떤 제약 조건이 있는지, 어떻게 사용해야 하는지는 별도의 문서가 필요합니다. 이 글에서는 실무에서 바로 적용할 수 있는 코드 문서화 베스트 프랙티스를 소개합니다.

## 왜 코드를 문서화해야 하는가

### 6개월 후의 나를 위해

지금 작성한 코드를 6개월 후에 다시 보면 "이걸 왜 이렇게 짰지?"라는 생각이 듭니다. 주석과 문서가 있으면 과거의 자신이 미래의 자신에게 맥락을 전달해줍니다.

### 팀원을 위해

혼자 개발하는 프로젝트는 거의 없습니다. 새로운 팀원이 합류했을 때, 문서가 없으면 온보딩에 몇 주가 걸릴 수 있습니다. 좋은 문서는 온보딩 시간을 며칠로 줄여줍니다.

### 오픈소스 생태계를 위해

오픈소스 프로젝트에서 문서는 코드만큼 중요합니다. 아무리 좋은 라이브러리라도 문서가 없으면 아무도 사용하지 않습니다.

## 인라인 주석 vs 외부 문서

### 인라인 주석: What보다 Why

```javascript
// 나쁜 주석: what을 설명
// 배열을 순회한다
for (let i = 0; i < arr.length; i++) {
  // ...
}

// 좋은 주석: why를 설명
// 역순으로 순회하는 이유: 삭제 중에 인덱스가 변하는 것을 방지
for (let i = arr.length - 1; i >= 0; i--) {
  if (shouldRemove(arr[i])) {
    arr.splice(i, 1);
  }
}
```

```python
# 나쁜 주석: 코드를 그대로 반복
# timeout을 30으로 설정한다
timeout = 30

# 좋은 주석: 비즈니스 맥락을 설명
# 결제 API의 SLA가 최대 25초이므로 여유를 두고 30초로 설정
timeout = 30
```

### 주석을 쓰면 안 되는 경우

```javascript
// 나쁜 예: 코드 자체로 충분히 설명되는 경우
// 사용자의 이름을 가져온다
const userName = user.getName();

// 나쁜 예: 주석 대신 변수명을 개선해야 하는 경우
// 세금 포함 가격
const p = price * 1.1;

// 좋은 예: 변수명으로 설명
const priceWithTax = price * TAX_RATE;
```

### 외부 문서가 필요한 경우

- **아키텍처 결정**: ADR(Architecture Decision Record) 형식으로 기록
- **시스템 다이어그램**: 전체 구조를 시각적으로 표현
- **온보딩 가이드**: 새 팀원이 참고할 시작 문서
- **API 레퍼런스**: 외부에 공개하는 API 문서

## JSDoc / TSDoc으로 API 문서화

### JSDoc 기본

```javascript
/**
 * 주어진 마크다운 문자열을 HTML로 변환합니다.
 *
 * @param {string} markdown - 변환할 마크다운 문자열
 * @param {Object} [options] - 변환 옵션
 * @param {boolean} [options.sanitize=true] - HTML 새니타이즈 여부
 * @param {string} [options.theme='light'] - 테마 ('light' | 'dark')
 * @returns {string} 변환된 HTML 문자열
 * @throws {Error} 마크다운 파싱에 실패한 경우
 *
 * @example
 * const html = convertMarkdown('# Hello');
 * // '<h1>Hello</h1>'
 *
 * @example
 * const html = convertMarkdown('**Bold**', { theme: 'dark' });
 * // '<strong>Bold</strong>'
 */
function convertMarkdown(markdown, options = {}) {
  // 구현
}
```

### TSDoc (TypeScript)

```typescript
/**
 * 사용자 정보를 나타내는 인터페이스입니다.
 */
interface User {
  /** 사용자의 고유 식별자 */
  id: string;

  /** 사용자 이름 (2-50자) */
  name: string;

  /** 이메일 주소 */
  email: string;

  /** 계정 생성일 */
  createdAt: Date;
}

/**
 * 사용자를 ID로 조회합니다.
 *
 * @param id - 조회할 사용자의 ID
 * @returns 사용자 객체, 존재하지 않으면 null
 *
 * @example
 * ```typescript
 * const user = await findUserById('abc123');
 * if (user) {
 *   console.log(user.name);
 * }
 * ```
 */
async function findUserById(id: string): Promise<User | null> {
  // 구현
}
```

### Python Docstring

```python
def calculate_shipping_cost(weight: float, distance: float, express: bool = False) -> float:
    """배송비를 계산합니다.

    무게와 거리를 기반으로 배송비를 산출합니다.
    급행 배송 선택 시 1.5배가 적용됩니다.

    Args:
        weight: 상품 무게 (kg 단위, 0보다 커야 함)
        distance: 배송 거리 (km 단위, 0보다 커야 함)
        express: 급행 배송 여부 (기본값: False)

    Returns:
        계산된 배송비 (원 단위)

    Raises:
        ValueError: weight 또는 distance가 0 이하인 경우

    Examples:
        >>> calculate_shipping_cost(2.5, 100)
        5000.0
        >>> calculate_shipping_cost(2.5, 100, express=True)
        7500.0
    """
    if weight <= 0 or distance <= 0:
        raise ValueError("무게와 거리는 0보다 커야 합니다")

    base_cost = weight * 1000 + distance * 20
    return base_cost * 1.5 if express else base_cost
```

## README 구조 가이드

프로젝트의 README.md는 프로젝트의 관문입니다. 다음 구조를 기본으로 합니다.

```markdown
# 프로젝트 이름

> 한 줄로 프로젝트를 설명합니다.

## 소개

왜 이 프로젝트를 만들었는지, 어떤 문제를 해결하는지 설명합니다.

## 빠른 시작

5분 안에 프로젝트를 실행해볼 수 있는 최소 가이드입니다.

## 설치

상세한 설치 방법을 안내합니다.

## 사용법

주요 기능과 사용 예시를 보여줍니다.

## 설정

환경 변수, 설정 파일 등을 안내합니다.

## API 레퍼런스

라이브러리인 경우 API 문서를 제공합니다.

## 기여하기

기여 방법을 안내합니다.

## 라이선스

라이선스 정보를 명시합니다.
```

## CHANGELOG 관리

### Keep a Changelog 형식

```markdown
# Changelog

이 프로젝트의 모든 주요 변경 사항을 기록합니다.
[Keep a Changelog](https://keepachangelog.com/) 형식을 따릅니다.

## [Unreleased]

### 추가
- 다크 모드 지원

## [2.1.0] - 2025-03-10

### 추가
- PDF 내보내기에 목차 자동 생성 기능 추가
- 한국어 맞춤법 검사 지원

### 변경
- 미리보기 렌더링 성능 2배 개선

### 수정
- 긴 테이블이 PDF에서 잘리는 문제 수정
- 코드 블록 내 한글 깨짐 현상 수정

## [2.0.0] - 2025-02-01

### 추가
- 완전히 새로운 렌더링 엔진
- 플러그인 시스템

### 변경
- **Breaking**: 설정 파일 형식이 JSON에서 YAML로 변경

### 제거
- 레거시 API 엔드포인트 제거
```

### 자동화 도구

커밋 메시지를 규약에 맞게 작성하면 CHANGELOG를 자동으로 생성할 수 있습니다.

```bash
# Conventional Commits 형식
git commit -m "feat: PDF 내보내기에 목차 자동 생성 기능 추가"
git commit -m "fix: 긴 테이블이 PDF에서 잘리는 문제 수정"
git commit -m "docs: API 레퍼런스 업데이트"

# standard-version으로 자동 생성
npx standard-version
```

## 문서화 워크플로우

### 1. 코드 작성 시

- 복잡한 로직에는 Why를 설명하는 인라인 주석을 달아라
- 공개 API에는 JSDoc/TSDoc을 작성하라
- TODO 주석에는 이슈 번호를 함께 적어라

```javascript
// TODO(#142): 캐시 만료 시간을 설정 가능하도록 변경
const CACHE_TTL = 3600;
```

### 2. PR 작성 시

- PR 설명에 변경 이유와 영향 범위를 적어라
- 스크린샷이 도움이 되면 첨부하라
- 관련 이슈를 링크하라

### 3. 릴리즈 시

- CHANGELOG를 업데이트하라
- 마이그레이션 가이드가 필요하면 작성하라
- README가 최신 상태인지 확인하라

### 4. 분기별 정기 검토

- 오래된 문서를 찾아서 업데이트하라
- 더 이상 유효하지 않은 주석을 삭제하라
- 자주 묻는 질문을 FAQ에 추가하라

## 문서화 도구 활용

### TypeDoc (TypeScript)

```bash
# 설치
npm install --save-dev typedoc

# 문서 생성
npx typedoc src/index.ts
```

TSDoc 주석을 기반으로 HTML 문서를 자동 생성합니다.

### Swagger / OpenAPI (REST API)

```yaml
openapi: 3.0.0
info:
  title: 사용자 API
  version: 1.0.0
paths:
  /users:
    get:
      summary: 사용자 목록 조회
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: 성공
```

### Storybook (컴포넌트)

UI 컴포넌트의 경우 Storybook으로 시각적 문서를 만들 수 있습니다. 각 컴포넌트의 다양한 상태를 보여주는 인터랙티브 문서가 됩니다.

## 문서를 PDF로 공유하기

기술 문서를 오프라인 교육이나 인쇄물로 배포해야 할 때가 있습니다. 마크다운으로 작성한 코드 문서를 printmd로 PDF 변환하면, 코드 블록의 구문 강조와 표 서식이 잘 유지되어 인쇄물로도 가독성이 좋습니다.

## 마무리

코드 문서화는 투자입니다. 당장은 시간이 걸리지만, 장기적으로는 유지보수 비용을 크게 줄여줍니다. 완벽한 문서를 처음부터 만들려고 하지 마세요. 중요한 것부터 시작하고, 꾸준히 개선해나가면 됩니다.

핵심 원칙을 정리하면 다음과 같습니다:

1. **What보다 Why를 설명하라**: 코드는 What을 보여주고, 주석은 Why를 설명한다.
2. **코드와 문서를 함께 관리하라**: 같은 저장소, 같은 PR에서 관리한다.
3. **예시를 충분히 넣어라**: 코드 예시 하나가 긴 설명보다 낫다.
4. **최신 상태를 유지하라**: 오래된 문서는 없는 것보다 나쁘다.
5. **자동화를 활용하라**: JSDoc, TypeDoc, Swagger 등으로 문서 생성을 자동화하라.
