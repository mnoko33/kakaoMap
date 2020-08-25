class App {
  constructor($app, loc) {
    this.$app = $app;
    this.state = new Proxy({
      placeList: [],
      err: false,
      loc,
      mapLevel: 3,
      clickedPlace: null,
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
        // observer for marker
        if (prop === 'clickedPlace') {
          const {place, target} = value
          if (target === 'map') {
            this.map.showMarker(place);
          } else if (target === 'sidebar') {
            this.sidebar.setPlaceClicked(place);
          }
        }

        return Reflect.set(target, prop, value);
      }
    })

    
    this.sidebar = new Sidebar({
      $app,
      placeList: this.state.placeList,
      updateAppClickedPlace: (placeAndTarget) => {
        this.state.clickedPlace = placeAndTarget;
      }
    })

    this.map = new Map({ 
      $app: this.$app,
      options: {
        loc: this.state.loc,
        mapLevel: this.state.mapLevel
      },
      updateAppPlaceList: (placeList) => {
        this.state.placeList = placeList;
      },
      updateAppClickedPlace: (placeAndTarget) => {
        this.state.clickedPlace = placeAndTarget;
      }
    })

    this.error = new Error({
      $app,
      visible: this.state.err,
    })
  }
}
