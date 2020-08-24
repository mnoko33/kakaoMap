class Map {
  constructor({ $app, options, updatePlaceList }) {
    
    this.$app = $app;
    this.options = options;
    this.updatePlaceList = updatePlaceList;
    this.map = null;

    this.mapWrapper = document.createElement("div");
    this.mapWrapper.id = "kakaoMap";
    this.$app.appendChild(this.mapWrapper);

    this.mapOption = {
      center: new kakao.maps.LatLng(this.options.loc.x, this.options.loc.y),
      level: this.options.mapLevel,
    }
    
    this.render();
  }

  render() {
    this.map = new kakao.maps.Map(this.mapWrapper, this.mapOption); 
    this.searchPlace("CS2")
  }

  searchPlace(code) {
    const ps = new kakao.maps.services.Places(this.map);

    const placesSearchCB = (data, status, pagination) => {
      // 받아온 데이터로 Appdml placeList를 업데이터
      this.updatePlaceList(data);
      if (status === kakao.maps.services.Status.OK) {
        for (var i=0; i<data.length; i++) {
            this.displayMarker(data[i]);    
        }
      }
    }

    ps.categorySearch(code, placesSearchCB, {useMapBounds:true}); 
  }

  displayMarker(place) {
    // 마커를 생성하고 지도에 표시합니다
    const marker = new kakao.maps.Marker({
      map: this.map,
      position: new kakao.maps.LatLng(place.y, place.x) 
    });
    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
      // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
      infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
      infowindow.open(map, marker);
    });
  }
}
