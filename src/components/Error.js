class Error {
  constructor({ $app, visible }) {
    this.$app = $app;
    this.error = document.createElement('div');
    this.error.className = 'err-wrapper';
    this.$app.appendChild(this.error);

    this.state = {
      visible
    }

    this.render();
  }

  showError() {
    this.state = {
      ...this.state,
      visible: true
    }
    this.render();
  }

  hideError() {
    this.state = {
      ...this.state,
      visible: false
    }
    this.render();
  }

  render() {
    this.error.innerHTML = this.state.visible 
      ? `<div class="err-msg">일시적인 오류로 문제가 발생했습니다. 새로고침해주세요!</div>`   
      : ''
    this.error.style.display = this.state.visible ? 'block' : 'none';
  }
}