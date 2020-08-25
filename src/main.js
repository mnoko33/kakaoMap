const main = (loc) => {
  new App(document.querySelector("#App"), loc);
}

if('geolocation' in navigator) {  
  navigator.geolocation.getCurrentPosition(pos => main({
    x: pos.coords.latitude,
    y: pos.coords.longitude,
  }))
} else {
  main({
    x: 37.395356858155154,
    y: 127.0900521371181,
  })
}
