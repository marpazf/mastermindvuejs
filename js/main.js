const MESSAGE = {
  INICIO: "",
  GANA: "¡Enhorabuena!",
  PIERDE: "¡Inténtalo de nuevo!",
  CHECK: "Comprueba"
}

const vm = new Vue({
  el: '#main',
  data: {
    maxColumns: 4,
    maxRows: 8,
    colors: ['red', 'blue', 'yellow', 'green', 'black', 'white'],
    /*
    colors: [
      { index: 0, color: 'red' },
      { index: 1, color: 'blue' },
      { index: 2, color: 'yellow' },
      { index: 3, color: 'green' },
      { index: 4, color: 'black' },
      { index: 5, color: 'white' },
    ],
    */
    human: [],
    computer: [],
    negros: 0,
    blancos: 0,
    juegoTerminado: false,
    currentRow: 0,
    currentColumn: 0,
    message: MESSAGE.INICIO,
    marbleColor: [[]],
    hints: [[]],
    marbleSolution: [],
  },
  created() {
    this.setComputer()
    this.initMarbleColor()
    this.initHints()
    this.initMarbleSoution()
  },
  computed: {
  },
  methods: {
    initMarbleColor() {
      for (let i = 0; i < this.maxRows; i++) {
        Vue.set(this.marbleColor, i, new Array(this.maxColumns))
        for (let j = 0; j < this.maxColumns; j++) {
          Vue.set(this.marbleColor[i], j, '')
        }
      }
    },
    initHints() {
      for (let i = 0; i < this.maxRows; i++) {
        Vue.set(this.hints, i, new Array(this.maxColumns))
        for (let j = 0; j < this.maxColumns; j++) {
          Vue.set(this.hints[i], j, '')
        }
      }
    },
    initMarbleSoution() {
      for (let i = 0; i < this.maxColumns; i++) {
        Vue.set(this.marbleSolution, i, '')
      }
    },
    setComputer() {
      for (let i = 0; i < this.maxColumns; i++) {
        this.computer[i] = randomIntFromRange(0, 5);
      }
      console.log("computer: ", this.computer);
    },
    setInputColor(event) {
      if (this.juegoTerminado) {
        return;
      }
      if (this.currentColumn < this.maxColumns) {
        this.marbleColor[this.currentRow].splice(this.currentColumn, 1, event.target.classList[1])
        this.human[this.currentColumn] = parseInt(event.target.dataset.color)
        this.currentColumn++
      }
    },
    checkInput() {
      if (this.juegoTerminado) {
        return;
      }
      if (this.currentColumn != this.maxColumns) {
        return;
      }

      this.compruebaNumero();
      this.renderHints();
      this.finJuego();

      this.negros = 0;
      this.blancos = 0;
      this.currentRow++;
      this.currentColumn = 0;
    },
    compruebaNumero() {
      let checkH = this.human.slice(0);
      let checkC = this.computer.slice(0);
      this.human.forEach((humanDigito, index) => {
        if (humanDigito == this.computer[index]) {
          this.negros++;
          checkH[index] = 10; // Valores no válidos: 10 y 11, para que no los vuelva a contar
          checkC[index] = 11;
        }
      });
      checkH.forEach((humanDigito, index) => {
        if (checkC.includes(humanDigito)) {
          this.blancos++;
          checkC[checkC.indexOf(humanDigito)] = 11;
        }
      });
    },
    finJuego() {
      this.juegoTerminado = true;
      let intentos = this.currentRow + 1;
      if (this.negros == this.maxColumns) {
        this.message = MESSAGE.GANA;
        this.renderSolution();
      } else if (intentos >= this.maxRows) {
        this.message = MESSAGE.PIERDE;
        this.renderSolution();
      } else {
        this.juegoTerminado = false;
      }
    },
    restart() {
      this.negros = 0;
      this.blancos = 0;
      this.juegoTerminado = false;
      this.currentRow = 0;
      this.currentColumn = 0;
      this.message = MESSAGE.INICIO;

      this.setComputer();
      this.clearRender();
    },
    clearRender() {
      // Clear Marble
      for (let i = 0; i < this.maxRows; i++) {
        for (let j = 0; j < this.maxColumns; j++) {
          this.marbleColor[i].splice(j, 1, '')
        }
      }
      // Clear Hints
      for (let i = 0; i < this.maxRows; i++) {
        for (let j = 0; j < this.maxColumns; j++) {
          this.hints[i].splice(j, 1, '')
        }
      }
      // Clear Solution
      for (let i = 0; i < this.maxColumns; i++) {
        this.marbleSolution[i] = ''
      }
    },
    renderHints() {
      for (let i = 0; i < this.negros; i++) {
        this.hints[this.currentRow].splice(i, 1, 'black');
      }
      for (let i = this.negros; i < this.negros + this.blancos; i++) {
        this.hints[this.currentRow].splice(i, 1, 'white');
      }
    },
    renderSolution() {
      this.computer.forEach((color, index) => {
        this.marbleSolution[index] = this.colors[color]
      })
    },
  }
});

