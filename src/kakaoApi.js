const URL = "http://dapi.kakao.com/v2/local/search/category.json";
const CATEGORY_GROUP_CODE = {
  convenience:    "CS2",
  supermarket:    "MT1",
  school:         "SC4",
  subwayStation:  "SW8",
  bank:           "BK9",
  restaurant:     "FD6",
  cafe:           "CE7",
  hospital:       "HP8",
  pharmacy:       "PM9",
};

const HEADERS = {
  Authorization: "KakaoAK 23500884b32010418a45ae2d9c5da604",
};

const request = (url, params) => {
  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return fetch(`${url}?${query}`, { method: "GET", headers: HEADERS });
};

// TODO: request에 대한 try catch문 필요
const kakaoSearchByCategory = (categoryGroupCode) => async (params) => {
  params = { ...params, category_group_code: categoryGroupCode };
  const res = await request(URL, params);
  if (res.status === 200) {
    return res.json();
  } else {
    return { err: true };
  }
};

const search = {
  convenience:    kakaoSearchByCategory("CS2"),
  supermarket:    kakaoSearchByCategory("MT1"),
  school:         kakaoSearchByCategory("SC4"),
  subwayStation:  kakaoSearchByCategory("SW8"),
  bank:           kakaoSearchByCategory("BK9"),
  restaurant:     kakaoSearchByCategory("FD6"),
  cafe:           kakaoSearchByCategory("CE7"),
  hospital:       kakaoSearchByCategory("HP8"),
  pharmacy:       kakaoSearchByCategory("PM9"),
};

const kakaoApi = {
  getConvenienceInfo: (params) => search.convenience(params),
  getSupermarketInfo: (params) => search.supermarket(params),
};
