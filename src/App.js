class App {
  constructor($app, loc) {
    this.$app = $app;
    
    this.state = new Proxy({
      placeList: [],
      err: false,
      loc,
      mapLevel: 3,
      clickedPlace: null,
      category: { ko: "편의점", en: "convenience", code: "CS2" },
    }, {
      get: (target, prop) => Reflect.get(target, prop),
      set: (target, prop, value) => {
        // observe placeList
        if (prop === 'placeList') {
          this.sidebar.updateSidebar(value);
        // observe err
        } else if (prop === 'err') {
          if (value) {
            this.error.showError();
          } else {
            this.error.hideError();
          }
        // observer for marker
        } else if (prop === 'clickedPlace') {
          const {place, target} = value
          if (target === 'map') {
            this.map.showMarker(place);
          } else if (target === 'sidebar') {
            this.sidebar.setPlaceClicked(place);
          }
        } else if (prop === 'category') {
          this.map.changeCategory(value.code);
        }
        return Reflect.set(target, prop, value);
      }
    })

    this.selector = new Selector({
      $app,
      updateAppCategory: (newCategory) => {
        this.state.category = newCategory
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
      $app,
      options: {
        loc: this.state.loc,
        mapLevel: this.state.mapLevel
      },
      code: this.state.category.code,
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
