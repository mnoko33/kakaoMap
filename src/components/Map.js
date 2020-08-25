class Map {
  constructor({ $app, options, updateAppPlaceList, updateAppClickedPlace }) {
    
    this.$app = $app;
    this.options = options;
    this.placeList = [];
    this.updateAppPlaceList = updateAppPlaceList;
    this.updateAppClickedPlace = updateAppClickedPlace;
    this.map = null;
    this.isNew = true;

    this.mapWrapper = document.createElement("div");
    this.mapWrapper.id = "kakaoMap";
    this.$app.appendChild(this.mapWrapper);

    this.mapOption = {
      center: new kakao.maps.LatLng(this.options.loc.x, this.options.loc.y),
      level: this.options.mapLevel,
    }
    this.infowindow = new kakao.maps.InfoWindow({zIndex:1});
    this.markerList = [];
    this.render();

    this.mapWrapper.addEventListener('click', e => {
      if (e.target.className === "infowindow") {
        e.stopPropagation();
        const target = this.placeList.find(place => place.id === e.target.id)
        if (target) {
          window.open(target.place_url)
        }
      }
    })
  }

  render() {
    this.map = new kakao.maps.Map(this.mapWrapper, this.mapOption);
    /* 
      사용자에 의해 드래그되는 이벤트가 발생하면
      this.map의 중심점을 이동한 중심으로 변경한 후
      해당 위치에서 시설물을 찾는 searchPlace 함수를 실행하는 콜백함수
    */
    const handleMapDrag = () => {
      const latlng = this.map.getCenter();
      this.mapOption.center = new kakao.maps.LatLng(latlng.getLat(), latlng.getLng());
      this.setMap();
      this.searchPlace("CS2");
    }

    const handleZoomChanged = () => {
      const level = this.map.getLevel();
      this.mapOption.level = level;
      this.setMap();
      this.searchPlace("CS2");
    }

    kakao.maps.event.addListener(this.map, 'center_changed', handleMapDrag)
    kakao.maps.event.addListener(this.map, 'zoom_changed', handleZoomChanged)
    this.searchPlace("CS2")
  }

  setMap() {
    const [center, level] = Object.values(this.mapOption);
    this.map.setCenter(center);
    this.map.setLevel(level);
  }

  searchPlace(code) {
    const ps = new kakao.maps.services.Places(this.map);
    let placeList = [];
    const placesSearchCB = (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        placeList = placeList.concat(data);
      }
      // 다음 페이지가 있다면 해당 페이지를 불러와서 placeList에 추가
      if (pagination.hasNextPage) {
        pagination.nextPage()
      } else {
        // 다음 페이지가 없는 경우 해당 placeList로 updateAppPlaceList 함수 실행
        placeList.forEach(place => {
          this.displayMarker(place)
        })
        this.placeList = placeList;
        this.updateAppPlaceList(placeList);
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
    this.markerList.push({ id: place.id, marker })

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', () => {
      // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
      this.updateAppClickedPlace({place, target: 'sidebar'})
      this.infowindow.setContent(this.getInfowindowContent(place));
      this.infowindow.open(this.map, marker);
    });
    
  }

  showMarker(place) {
    const newLatLon = new kakao.maps.LatLng(place.y, place.x);
    this.map.panTo(newLatLon);
    const marker = this.markerList.find(marker => marker.id === place.id).marker
    this.infowindow.setContent(this.getInfowindowContent(place));
    this.infowindow.open(this.map, marker)
  }

  getInfowindowContent = place => {
    return `
      <div class="infowindow" id="${place.id}" style="padding:5px;font-size:12px;">
        ${place.place_name}
      </div>
    `
  }
}
