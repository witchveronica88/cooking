# cooking

- 레시피 모음: https://witchveronica88.github.io/cooking/
- 복숭아 노트: https://witchveronica88.github.io/cooking/peaches.html

## 데이터 넣는 법

데이터를 고친 뒤에는 HTML에서 그 파일 주소 뒤 `?v=` 숫자를 하나 올린다.

### `recipes-data.js` (레시피)

- `categories`: 아래 탭. `id`, `name`.
- `recipes`: 레시피 하나마다
  - `id`: 영문 · 숫자 · `-`로 된 고유 이름
  - `category`: `meal`(식사) · `dessert`(디저트) · `drink`(음료)
  - `title`: 카드 제목
  - `sections`: `{ "heading": "재료", "items": ["..."] }`. 순서가 있는 과정은 `"ordered": true`
    - 묶음으로 나눌 때는 `items` 대신 `"groups": [{ "label": "소스", "items": ["..."] }]`
  - `notes`: 메모 줄 목록(없으면 `[]`)
  - `subs`(있을 때만): 레시피 카드 맨 아래 ＋ 줄로 접어 두는 참고 내용. `{ "title": "묵나물 가이드", "sections": [...] }`

적는 규칙은 `CLAUDE.md`의 "레시피 추가 규칙"을 따른다. 한 레시피의 모양:

```json
{
  "id": "japanese-pudding",
  "category": "dessert",
  "title": "일본식 푸딩",
  "sections": [
    {
      "heading": "재료",
      "groups": [
        { "label": "캐러멜", "items": ["설탕 40g", "물 20g", "뜨거운 물 15g"] },
        { "label": "푸딩", "items": ["달걀 1개", "우유 200ml", "소금 약간"] }
      ]
    },
    { "heading": "도구", "items": ["냄비", "고운 체"] },
    {
      "heading": "만드는 법",
      "ordered": true,
      "groups": [
        { "label": "캐러멜", "items": ["설탕과 물 20g을 중불에서 젓지 않고 끓인다."] },
        { "label": "푸딩", "items": ["우유를 가장자리가 끓기 시작할 때까지만 약불로 데운다."] }
      ]
    },
    { "heading": "맛 조절", "items": ["덜 달게: 설탕을 30g까지 줄인다."] }
  ],
  "notes": ["달걀 1개 기준."],
  "subs": [
    { "title": "참고 내용 이름", "sections": [{ "heading": "재료", "items": ["..."] }] }
  ]
}
```

- 묶음이 없으면 `"items": [...]`, 묶음이 있으면 `"groups": [...]`를 쓴다.
- 덧붙임은 `"소금 0.4g — 두 꼬집"`처럼 ` — ` 뒤에 쓴다.
- `notes`가 없으면 `[]`, `subs`가 없으면 빼도 된다.

### `peaches-data.js` (복숭아)

- `varieties`: `id`, `name`, `aliases`(다른 이름), `season`(극조생 · 조생 · 중생 · 만생), `flesh`(백육 · 황육 · 천도), `texture`, `harvestWindow`, `description`, 사진이 있으면 `image`(`images/peaches/아이디.jpg`)
- `farms`: `id`, `name`, `region`(예: `경북 영천`), `description`, `items`(취급 품종 이름), `storeLinks`, `socialLinks`
- `tastings`: `id`, `tastedOn`(`2026-08-19`, 모르면 `null`), `varietyName`, `farmName`, `spec`, `price`(원, 없으면 0), `rating`(1~5, 없으면 0), `note`
