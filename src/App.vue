<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px


#defaultCanvas0{
  position: fixed; /*canvasを固定*/
  top: 0; /*canvasを上に固定*/
	z-index: -9999
}
</style>

<script>
class Module {
  constructor(xOff, yOff, x, y, speed, unit) {
    this.xOff = xOff;
    this.yOff = yOff;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.unit = unit;
    this.xDir = 1;
    this.yDir = 1;
  }

  // Custom method for updating the variables
  update() {
    this.x = this.x + this.speed * this.xDir;
    if (this.x >= this.unit || this.x <= 0) {
      this.xDir *= -1;
      this.x = this.x + 1 * this.xDir;
      this.y = this.y + 1 * this.yDir;
    }
    if (this.y >= this.unit || this.y <= 0) {
      this.yDir *= -1;
      this.y = this.y + 1 * this.yDir;
    }
  }

  // Custom method for drawing the object
  draw(p) {
    p.fill(255);
    p.ellipse(this.xOff + this.x, this.yOff + this.y, 6, 6);
  }
}

export default {
	mounted() {   
		const script = function (p5) {
			let unit = 200;
			let count;
			let mods = [];

			const width = window.innerWidth
			const height = window.innerHeight

			p5.setup = _ => {      
				p5.createCanvas(width, height);
				p5.noStroke();
				let wideCount = width / unit;
				let highCount = height / unit;
				count = wideCount * highCount;

				let index = 0;
				for (let y = 0; y < highCount; y++) {
					for (let x = 0; x < wideCount; x++) {
						mods[index++] = new Module(
							x * unit,
							y * unit,
							unit / 2,
							unit / 2,
							p5.random(0.05, 3.8),
							unit
						);
					}
				}
			}     
			// NOTE: Draw is here
			p5.draw = _ => {      
				p5.background(0);
				for (let i = 0; i < count; i++) {
					mods[i].update();
					mods[i].draw(p5);
				}
			}  
		}   
		const P5 = require('p5');
		new P5(script)
	}
}
</script>