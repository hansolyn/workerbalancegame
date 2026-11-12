# 직장인 밸런스게임

15번의 선택(4축 12문항 + 보너스 3문항)으로 16개 직장인 유형을 알려주는 스낵 콘텐츠.

## 구성

- `index.html` — 화면 전체(스타일·스크립트 포함)
- `api/stats.js` — 문항별 선택 횟수 조회
- `api/submit.js` — 15문항 응답 집계
- `api/_redis.js` — Upstash Redis REST 호출 공통 코드

## 배포 (Vercel)

1. Vercel에서 이 저장소를 가져와 프로젝트를 만든다. 빌드 설정은 필요 없다.
2. 프로젝트의 Storage 탭에서 Upstash for Redis를 추가해 프로젝트에 연결한다.
3. 환경변수 `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` 또는 `KV_REST_API_URL`/`KV_REST_API_TOKEN`이 생겼는지 확인하고 다시 배포한다.

Redis를 연결하지 않아도 게임은 동작하며, 선택 비율만 표시되지 않는다.
비율은 문항당 응답이 30건 이상 쌓인 뒤부터 표시된다(`index.html`의 `MIN_VOTES`).
