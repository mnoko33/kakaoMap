class App {
  constructor($app) {
    this.$app = $app;
    this.state = new Proxy({
      placeList: [],
      err: false,
      loc: {
        x: null,
        y: null,
      },
      mapLevel: 3
    }, {
      get: (target, prop) => Reflect.get(target, prop),
      set: (target, prop, value) => {
        // observe placeList
        if (prop === 'placeList') {
          this.sidebar.updateSidebar(value);
        }
        // observe err
        if (prop === 'err') {
          if (value) {
            this.error.showError();
          } else {
            this.error.hideError();
          }
        }

        return Reflect.set(target, prop, value);
      }
    })

    
    this.sidebar = new Sidebar({
      $app,
      placeList: this.state.placeList
    })
    
    this.getLocInfo();

    this.error = new Error({
      $app,
      visible: this.state.err,
    })
  }

  // navigator.geolocation를 통해 현재 좌표를 받아온 후, this.loadMap 함수 실행
  getLocInfo() {
    if('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.loadMap({
          x: pos.coords.latitude,
          y: pos.coords.longitude
        })
      })
    } else {
      const DEFAULT_LOC = {
        x: 37.395356858155154,
        y: 127.0900521371181,
      }
      this.loadMap(DEFAULT_LOC);
    }
  }
  /* 
    map instance를 생성
    맵을 그리기 위한 options과 
    kakao.Service로부터 받아온 placeList로 state를 업데이트하는 callback함수을 넘긴다
  */
  loadMap(loc) {
    this.map = new Map({ 
      $app: this.$app,
      options: {
        loc,
        mapLevel: this.state.mapLevel
      },
      updatePlaceList: (placeList) => {
        this.state.placeList = placeList
      }
    });
  }
}
