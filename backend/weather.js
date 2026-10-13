// =============================================================
// 날씨 조회 로직 (로컬 서버와 Vercel 함수가 함께 사용)
// 외부 API: Open-Meteo (https://open-meteo.com) - API Key 필요 없음
// =============================================================

// 날씨 코드(WMO) → 한국어 설명 + 아이콘
const WEATHER_CODES = {
  0: ["맑음", "☀️"],
  1: ["대체로 맑음", "🌤️"],
  2: ["구름 조금", "⛅"],
  3: ["흐림", "☁️"],
  45: ["안개", "🌫️"],
  48: ["짙은 안개", "🌫️"],
  51: ["약한 이슬비", "🌦️"],
  53: ["이슬비", "🌦️"],
  55: ["강한 이슬비", "🌧️"],
  61: ["약한 비", "🌦️"],
  63: ["비", "🌧️"],
  65: ["강한 비", "🌧️"],
  66: ["어는 비", "🌧️"],
  67: ["강한 어는 비", "🌧️"],
  71: ["약한 눈", "🌨️"],
  73: ["눈", "🌨️"],
  75: ["강한 눈", "❄️"],
  77: ["싸락눈", "🌨️"],
  80: ["약한 소나기", "🌦️"],
  81: ["소나기", "🌧️"],
  82: ["강한 소나기", "⛈️"],
  85: ["약한 눈보라", "🌨️"],
  86: ["강한 눈보라", "❄️"],
  95: ["뇌우", "⛈️"],
  96: ["우박을 동반한 뇌우", "⛈️"],
  99: ["강한 우박을 동반한 뇌우", "⛈️"],
};

// 한글로 검색하면 같은 이름의 작은 마을이 먼저 나오는 경우가 많아서
// 주요 도시는 영어 이름으로 바꿔서 검색함
const KOREAN_CITY_NAMES = {
  서울: "Seoul", 부산: "Busan", 인천: "Incheon", 대구: "Daegu",
  대전: "Daejeon", 광주: "Gwangju", 울산: "Ulsan", 세종: "Sejong",
  수원: "Suwon", 성남: "Seongnam", 고양: "Goyang", 용인: "Yongin",
  창원: "Changwon", 청주: "Cheongju", 전주: "Jeonju", 천안: "Cheonan",
  포항: "Pohang", 제주: "Jeju City", 춘천: "Chuncheon", 강릉: "Gangneung",
  도쿄: "Tokyo", 오사카: "Osaka", 베이징: "Beijing", 상하이: "Shanghai",
  뉴욕: "New York", 런던: "London", 파리: "Paris", 시드니: "Sydney",
};

// 1단계: 도시 이름 → 위도/경도 (Open-Meteo Geocoding API)
async function findCity(city) {
  const shortName = city.replace(/(특별시|광역시|특별자치시|시)$/, "");
  const searchName = KOREAN_CITY_NAMES[shortName] || city;

  const url =
    "https://geocoding-api.open-meteo.com/v1/search?count=10&language=ko&name=" +
    encodeURIComponent(searchName);
  const response = await fetch(url);
  const data = await response.json();
  if (!data.results) return null;

  // 이름이 같은 곳이 여러 개면 인구가 가장 많은 도시를 선택
  return data.results.reduce((best, place) =>
    (place.population || 0) > (best.population || 0) ? place : best
  );
}

// 2단계: 위도/경도 → 현재 날씨 (Open-Meteo Forecast API)
async function getCurrentWeather(latitude, longitude) {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}&longitude=${longitude}` +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +
    "&wind_speed_unit=ms&timezone=auto";
  const response = await fetch(url);
  const data = await response.json();
  return data.current;
}

// 도시 이름을 받아 { status: HTTP 상태 코드, body: 응답 데이터 }를 돌려줌
async function getWeather(city) {
  if (!city) {
    return { status: 400, body: { error: "도시 이름을 입력해 주세요." } };
  }

  try {
    const place = await findCity(city);
    if (!place) {
      return { status: 404, body: { error: `'${city}' 도시를 찾을 수 없어요.` } };
    }

    const current = await getCurrentWeather(place.latitude, place.longitude);
    const [description, icon] = WEATHER_CODES[current.weather_code] || ["알 수 없음", "❓"];

    return {
      status: 200,
      body: {
        city: place.name,
        country: place.country || "",
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        description,
        icon,
        time: current.time,
      },
    };
  } catch (err) {
    console.error(err);
    return { status: 500, body: { error: "날씨 정보를 가져오는 중 오류가 발생했어요." } };
  }
}

module.exports = { getWeather };
