class Sidebar {
  constructor({ $app, placeList, updateAppClickedPlace }) {
    this.$app = $app;
    this.sidebar = document.createElement('div');
    this.sidebar.className = 'sidebar-wrapper';
    this.clicked = null;
    this.updateAppClickedPlace = updateAppClickedPlace;

    this.sidebar.addEventListener('click', (e) => {
      const place = this.state.placeList.find(place => place.id === e.target.parentNode.id);
      if (place) {
        // app.state.clickedPlace를 변경
        this.updateAppClickedPlace({place, target: 'map'});
        // clicked를 변경
        this.setPlaceClicked(place);
      }
    })

    this.$app.appendChild(this.sidebar);

    this.state = {
      placeList,
    }

    this.render();
  }

  render() {
    this.sidebar.innerHTML = `
      ${this.state.placeList.length 
          ? this.state.placeList
              .map(place => 
                `<div class="${this.clicked === place.id ? 'placeInfo clicked' : 'placeInfo'}" id="${place.id}">
                  <div>이름: ${place.place_name}</div>
                  <div>연락처: ${place.phone ? place.phone : '-'}</div>
                  <div>주소: ${place.address_name}</div>
                </div>`
                )
              .join('')
          : '<div class="placeInfo vacant">아무것도 없네요...</div>'
          }
    `
  }

  updateSidebar(newPlaceList) {
    this.state = {
      ...this.state,
      placeList: newPlaceList
    }
    this.render();
  }
  setPlaceClicked(place) {
    const prev = document.getElementById(this.clicked);
    if (this.clicked && prev) {
      prev.classList.remove('clicked');
    }
    this.clicked = place.id;
    document.getElementById(this.clicked).classList.add('clicked');
  }
}