# 🌦️ 날씨 웹앱

도시 이름을 입력하고 **날씨 확인** 버튼을 누르면 현재 날씨를 보여주는 간단한 웹앱입니다.

## 폴더 구조

```
날씨 앱 만들기/
├── backend/
│   └── server.js      ← 백엔드 (Node.js). 외부 날씨 API 호출 + 프론트엔드 파일 제공
├── frontend/
│   ├── index.html     ← 화면 구조
│   ├── style.css      ← 화면 디자인
│   └── script.js      ← 버튼 클릭 → 백엔드에 요청 → 결과 표시
└── README.md
```

## 동작 흐름

```
[브라우저] --(도시 이름)--> [backend/server.js] --> [Open-Meteo 날씨 API]
     ↑                              |
     └──────(날씨 정보 JSON)─────────┘
```

- 날씨 API: [Open-Meteo](https://open-meteo.com) (무료, **API Key 필요 없음**)
- 별도 라이브러리 설치(npm install)가 필요 없습니다.

## 실행 방법

1. **Node.js 설치 확인**
   터미널(PowerShell)에서 `node --version` 입력 → `v18` 이상이면 됩니다.
   없다면 https://nodejs.org 에서 LTS 버전을 설치하세요.

2. **이 폴더로 이동**
   VS Code에서 이 폴더를 열고 메뉴의 **터미널 → 새 터미널**을 엽니다.

3. **백엔드 서버 실행**
   ```
   node backend/server.js
   ```
   `날씨 앱 서버 실행 중: http://localhost:8000` 메시지가 나오면 성공입니다.

4. **브라우저에서 접속**
   주소창에 http://localhost:8000 을 입력합니다.

5. **날씨 확인**
   도시 이름(예: `서울`, `부산`, `Tokyo`, `London`)을 입력하고 **날씨 확인** 버튼을 누릅니다.

6. **종료**
   터미널에서 `Ctrl + C`를 누릅니다.

## 참고

- 어떤 방법으로 화면을 열든 **3번의 백엔드 서버는 반드시 켜져 있어야 합니다.** 서버를 실행한 터미널을 닫으면 서버도 꺼집니다.
- `index.html`을 더블클릭하거나 Live Server로 열어도 동작하지만, http://localhost:8000 으로 접속하는 방법을 권장합니다.
- 8000번 포트가 이미 사용 중이라면 다른 포트로 실행할 수 있습니다.
  ```
  $env:PORT=8080; node backend/server.js
  ```
  그 다음 http://localhost:8080 으로 접속합니다.
- 한국 소도시는 한글로 검색되지 않을 수 있습니다. 이때는 영어 이름(예: `Gimhae`)으로 입력해 보세요.
