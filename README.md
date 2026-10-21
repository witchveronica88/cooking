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
    - 한 줄에 하나씩 `"설탕 40g"`. 덧붙임은 `"소금 0.4g — 두 꼬집"`처럼 ` — ` 뒤에
  - `notes`: 메모 줄 목록(없으면 `[]`)
  - `subs`(있을 때만): 레시피 카드 맨 아래 ＋ 줄로 접어 두는 참고 내용. `{ "title": "묵나물 가이드", "sections": [...] }`

### `peaches-data.js` (복숭아)

- `varieties`: `id`, `name`, `aliases`(다른 이름), `season`(극조생 · 조생 · 중생 · 만생), `flesh`(백육 · 황육 · 천도), `texture`, `harvestWindow`, `description`, 사진이 있으면 `image`(`images/peaches/아이디.jpg`)
- `farms`: `id`, `name`, `region`(예: `경북 영천`), `description`, `items`(취급 품종 이름), `storeLinks`, `socialLinks`
- `tastings`: `id`, `tastedOn`(`2026-08-19`, 모르면 `null`), `varietyName`, `farmName`, `spec`, `price`(원, 없으면 0), `rating`(1~5, 없으면 0), `note`
