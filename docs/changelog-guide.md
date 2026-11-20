# 업데이트 내역 작성 가이드

printmd의 업데이트 내역(`/ko/changelog`, `/en/changelog`)을 쓰는 방법과 규칙입니다.
사람과 AI 에이전트 모두 이 문서를 따릅니다. 에이전트가 언제 사용자에게 물어봐야 하는지는 [AGENTS.md](../AGENTS.md)에 있습니다.

## 어디에 무엇이 있나

| 무엇 | 위치 |
|---|---|
| 업데이트 항목 (본문 데이터) | `lib/changelog.ts`의 `CHANGELOG` 배열 — **최신 항목이 맨 위** |
| 페이지 문구·SEO 키워드 | `lib/changelog.ts`의 `CHANGELOG_PAGE` |
| 페이지 | `app/[locale]/changelog/page.tsx` (보통 수정할 필요 없음) |
| 캡처 이미지 | `public/changelog/<날짜>/<언어>-<이름>.png` |
| 캡처 스크립트 | `scripts/capture-changelog.mjs` (`npm run capture:changelog`) |
| 사이트맵 날짜 | `app/sitemap.ts`의 `/changelog` 항목 `lastModified` |

좌측 사이드바의 "업데이트 내역" 버튼에 보이는 날짜는 `CHANGELOG[0].date`를 그대로 쓰므로 따로 고칠 필요가 없습니다.

## 무엇을 기록하나

**기록한다** — 사용자가 화면에서 느낄 수 있는 변화

- 새 기능 (`new`)
- 기존 기능의 개선, 사용성·디자인 변화 (`improved`)
- 사용자가 겪을 수 있던 버그 수정 (`fixed`)

**기록하지 않는다**

- 리팩터링, 테스트 추가, 타입 정리, 빌드·설정 변경, 의존성 업데이트
- 사용자 눈에 보이지 않는 내부 구조 변경
- 블로그 글, 문서(이 가이드 포함) 수정
- 같은 업데이트 안에서 만들고 바로 고친 버그 (사용자는 그 버그를 본 적이 없음)

## 새 항목 vs 기존 항목

- **날짜**는 배포(푸시)하는 날, `YYYY-MM-DD` 형식입니다. 실제 오늘 날짜를 쓰고, 미래 날짜를 쓰지 않습니다.
- 같은 날짜의 항목이 이미 있으면 **그 항목에 변경 사항을 추가**하고 제목·요약을 다듬습니다.
- 날짜가 다르면 `CHANGELOG` **맨 앞에 새 항목**을 추가합니다.
- 여러 날에 걸친 작업을 한 번에 배포했다면 배포한 날 하나로 묶습니다.

## 쓰는 법

### 공통 규칙

1. **한국어(`ko`)와 영어(`en`)를 모두** 씁니다. 뜻은 같게, 문장은 각 언어로 자연스럽게 씁니다(직역 금지).
2. **사용자의 말**로 씁니다. 컴포넌트·함수·파일 이름, CSS 용어 대신 화면에 보이는 이름을 씁니다.
   - 앱 라벨과 똑같이: "스타일 패널", "문서 정보", "코드블럭", "인라인 코드", "미리보기", "프리셋"
   - ✗ `frontmatterValue` 요소의 `td` 셀렉터 분리 → ✓ 문서 정보의 값 색상을 따로 바꿀 수 있습니다
3. **사실만** 씁니다. 실제로 동작을 확인한 것만 적고, "획기적인", "완벽한" 같은 과장은 쓰지 않습니다.
4. 한국어는 "~합니다 / ~있습니다" 존댓말, 영어는 짧고 평이한 문장으로 씁니다.

### 제목 (`title`)

- 이번 업데이트의 핵심 1~3가지를 나열합니다. 한국어 40자 안팎.
- 예: `코드블럭 문법 강조·코드 테마, 프롬프트 문서를 위한 문서 정보 카드`

### 요약 (`summary`)

- 2~4문장. **무엇이 좋아졌는지**와 **누가 어디에 쓰면 좋은지**를 씁니다.
- 세부 목록을 반복하지 말고 큰 그림만 씁니다.

### 변경 사항 (`changes`)

- 한 항목에 변경 하나, 1~2문장.
- 순서는 페이지가 알아서 `new → improved → fixed`로 묶으므로, 같은 종류 안에서 중요한 것부터 씁니다.
- `new`는 `기능 이름: 설명` 형식을 권장합니다.
  - 예: `코드 테마: GitHub, One, Monokai … 테마를 고를 수 있고, 미리보기·인쇄·PDF에 똑같이 적용됩니다.`
- `fixed`는 `~하던 문제를 고쳤습니다` / `Fixed …` 형식으로, 사용자가 겪던 증상을 씁니다.
- 기존 사용자 데이터(저장한 스타일 등)가 어떻게 되는지 영향이 있으면 꼭 적습니다.
  - 예: `기존에 저장한 스타일은 지금 모습 그대로 옮겨집니다.`

### SEO

- 관련 검색어는 **기능 설명 안에 자연스럽게** 넣습니다. 키워드만 나열하지 않습니다.
- 이번 업데이트로 새로 생긴 핵심 검색어가 있으면 `CHANGELOG_PAGE[locale].keywords`와 홈 키워드(`lib/i18n/dictionaries/*.json`의 `meta.keywords`)에 추가할지 검토합니다.

## 이미지 (선택, 권장)

주요 새 기능이 있는 업데이트에는 캡처를 1~3장 붙입니다. 개선·수정만 있는 업데이트는 생략해도 됩니다.

1. `scripts/capture-changelog.mjs`의 `capture()`에 새 장면을 추가합니다. 예시 문서(`SAMPLE`)와 버튼 라벨(`LABELS`)은 언어별로 준비합니다.
2. dev 서버를 켠 상태에서 실행합니다.
   ```bash
   npm run dev                                   # 다른 터미널
   npm run capture:changelog -- --date 2026-12-01
   ```
3. 결과 이미지를 직접 열어 확인합니다. 잘린 곳, 광고·개발 배지 노출, 빈 공간이 없어야 합니다.
4. 크기를 확인해 항목의 `images`에 적습니다. 글자 줄바꿈 때문에 언어별 높이가 다를 수 있으니 각각 확인합니다.
   ```bash
   node -e "const fs=require('fs'),d='public/changelog/2026-12-01';for(const f of fs.readdirSync(d)){const b=fs.readFileSync(d+'/'+f);console.log(f,b.readUInt32BE(16),b.readUInt32BE(20))}"
   ```
5. `alt`는 화면에 보이는 것을 묘사하고(검색·접근성용), `caption`은 한 문장으로 무엇을 보여주는지 씁니다.

## 항목 예시

```ts
{
  date: '2026-12-01',
  title: {
    ko: '…',
    en: '…',
  },
  summary: {
    ko: '…',
    en: '…',
  },
  images: [
    {
      name: 'feature-name',                       // public/changelog/2026-12-01/ko-feature-name.png
      size: { ko: [1536, 900], en: [1536, 940] },
      alt: { ko: '…', en: '…' },
      caption: { ko: '…', en: '…' },
    },
  ],
  changes: [
    { kind: 'new', text: { ko: '기능 이름: …', en: 'Feature name: …' } },
    { kind: 'improved', text: { ko: '…', en: '…' } },
    { kind: 'fixed', text: { ko: '…하던 문제를 고쳤습니다.', en: 'Fixed …' } },
  ],
},
```

## 마무리 체크리스트

- [ ] `CHANGELOG` 맨 위에 항목 추가(또는 같은 날짜 항목에 추가), ko/en 모두 작성
- [ ] `app/sitemap.ts`의 `/changelog` `lastModified`를 항목 날짜로 변경
- [ ] (이미지가 있으면) 파일 존재, `size` 값 일치
- [ ] `npx tsc --noEmit`, `npm test`, `npm run build` 통과
- [ ] 앱에서 `/ko/changelog`, `/en/changelog` 확인, 사이드바 날짜 확인
- [ ] 기능 커밋과 별도로 커밋: `docs: 2026-12-01 업데이트 내역 추가`
