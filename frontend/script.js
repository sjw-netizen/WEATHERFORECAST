// =============================================================
// 날씨 앱 프론트엔드
// 버튼을 누르면 우리 백엔드(/api/weather)에 요청하고, 결과를 화면에 표시
// =============================================================

// 백엔드 서버(http://localhost:8000)에서 열었으면 같은 주소로,
// 파일을 직접 열었거나 Live Server 등으로 열었으면 localhost:8000으로 요청
const API_BASE = location.port === "8000" ? "" : "http://localhost:8000";

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const button = form.querySelector("button");
const message = document.getElementById("message");
const result = document.getElementById("result");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // 페이지 새로고침 막기

  const city = cityInput.value.trim();
  if (!city) {
    showMessage("도시 이름을 입력해 주세요.");
    return;
  }

  showMessage("날씨를 불러오는 중...");
  result.classList.add("hidden");
  button.disabled = true;

  try {
    const response = await fetch(API_BASE + "/api/weather?city=" + encodeURIComponent(city));
    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error);
      return;
    }

    showWeather(data);
    showMessage("");
  } catch (err) {
    showMessage(
      "서버에 연결할 수 없어요. 터미널에서 'node backend/server.js'를 실행한 뒤 다시 시도해 주세요."
    );
  } finally {
    button.disabled = false;
  }
});

function showMessage(text) {
  message.textContent = text;
}

function showWeather(data) {
  document.getElementById("city-name").textContent =
    data.country ? `${data.city}, ${data.country}` : data.city;
  document.getElementById("weather-icon").textContent = data.icon;
  document.getElementById("temperature").textContent = `${Math.round(data.temperature)}°C`;
  document.getElementById("description").textContent = data.description;
  document.getElementById("feels-like").textContent = `${Math.round(data.feelsLike)}°C`;
  document.getElementById("humidity").textContent = `${data.humidity}%`;
  document.getElementById("wind").textContent = `${data.windSpeed} m/s`;
  document.getElementById("updated-time").textContent =
    `현지 시각 ${data.time.replace("T", " ")} 기준`;

  result.classList.remove("hidden");
}
