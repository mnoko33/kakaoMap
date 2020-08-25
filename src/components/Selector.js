class Selector {
  constructor({ $app, updateAppCategory }) {
    this.$app = $app;
    this.selector = document.createElement('div');
    this.selector.className = "selector-wrapper";
    this.$app.appendChild(this.selector);

    
    this.updateAppCategory = updateAppCategory;

    this.categoryList = [
      { ko: "편의점", en: "convenience", code: "CS2" },
      { ko: "슈퍼마켓", en: "supermarket", code: "MT1" },
      { ko: "학교", en: "school", code: "SC4" },
      { ko: "지하철역", en: "subway", code: "SW8" },
      { ko: "은행", en: "bank", code: "BK9" },
      { ko: "음식점", en: "restaurant", code: "FD6" },
      { ko: "카페", en: "cafe", code: "CE7" },
      { ko: "병원", en: "hospital", code: "HP8" },
      { ko: "약국", en: "pharmacy", code: "PM9" },
    ];
    this.selectedCategory = this.categoryList[0];
    
    this.selector.addEventListener('click', (e) => {
      console.log(e.target);
      if (e.target.className === 'category') {
        e.stopPropagation();
        const category = this.categoryList.find(category => {
          return category.code === e.target.id;
        });
        if (category) {
          this.selectedCategory = category;
          this.updateAppCategory(this.selectedCategory);
          this.render();
        }
      }
    })

    this.render();
  }

  render() {
    this.selector.innerHTML = `
      ${this.categoryList
        .map(category => 
          `
            <div 
              id=${category.code} 
              class="${this.selectedCategory.code === category.code 
                  ? "category clicked" 
                  : "category"}">
              ${category.ko}
            </div>
          `)
        .join("")
      }
    `
  }
}