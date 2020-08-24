class Sidebar {
  constructor({ $app, placeList }) {
    this.$app = $app;
    this.sidebar = document.createElement('div');
    this.sidebar.className = 'sidebar-wrapper';
    this.$app.appendChild(this.sidebar);

    this.state = {
      placeList,
    }

    this.render();
  }

  render() {
    this.sidebar.innerHTML = `
      ${this.state.placeList
        .map(place => 
          `<div class="placeInfo" id="${place.id}">
            <div>이름: ${place.place_name}</div>
            <div>연락처: ${place.phone ? place.phone : '-'}</div>
            <div>주소: ${place.address_name}</div>
          </div>`
          )
          .join('')
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
}