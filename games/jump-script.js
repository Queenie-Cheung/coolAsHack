function jumpingDisplacement(time, maxt, hero){
  let maxh = hero.h*2 // maximum height
  //let maxt = 1000 // time when land after jump
  let a = -4 * maxh / (maxt ** 2) // "acceleration"ish
  let s = a * time * (time - maxt) // formula for the displacement from original y
  return s
}

function random(max,min=0){return Math.floor(Math.random()*(max-min)+min)}

let canvas = document.querySelector("canvas")
let ctx = canvas.getContext('2d')

let hero = {
  //image: heroImage,
  colour: "darkgrey",
  w: 50,
  h: 50,
  x: 50,
  y: 100,//canvas.height-this.h,
  oy: 100,//original y aka ground
  in(thing){ // check if the thing is overlapping (in) with hero
    return (this.x+this.w>=thing.x)&&(this.x<=thing.x+thing.w)&&(this.y+this.h>=thing.y)&&(this.y<=thing.y+thing.h)
  },
}

class Things{
  x = canvas.width
  v = 2
}
class Cactus extends Things{
  w = random(hero.w*1.5,10)
  h = hero.h/3*2
  y = hero.oy + hero.h - this.h
  colour = "green"
}
class Bird extends Things{
  y = hero.oy-hero.h
  w = 30
  h = hero.h/2
  colour = "blue"
}

let obstacle = []
let score = 0
let lose = false

let lastTime = 0
let jumpTime = 0
let jumpCtrl = false

//animation loop
let loop = {
  previousTime: 0,
  dt: 0
}
requestAnimationFrame(drawLoop)
function drawLoop (currentTime) {
  loop.dt = currentTime - loop.previousTime
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  updateState()
  drawState()
  loop.previousTime = currentTime
  if(!lose)requestAnimationFrame(drawLoop)
}

function updateState(){
  // if hero jumping
  if(jumpCtrl){
    jumpTime+=loop.dt// counting time
    let jumpDis = jumpingDisplacement(jumpTime, 1000, hero) // displacement from original y
    let fallOff = jumpDis<0
    hero.y = (fallOff ? hero.oy:hero.oy-jumpDis)
    if(fallOff){
      jumpCtrl = false
      jumpTime = 0
    }
  }
  // obstacles moving
  for(let i=0;i<obstacle.length;i++){
    let ob = obstacle[i]
    ob.x -= ob.v //moving
    if(ob.x+ob.w<0){
      obstacle.splice(i,1)// removing when out of the screen
      score++
    }
    if(hero.in(ob)){// hit
      lose = true
    }
  }
  // obstacles spawning
  lastTime += loop.dt
  if(lastTime>=1250){
    if(Math.random()<0.4){// 40% spawning somwthing each frame
      let dice = Math.random()
      if(dice<0.7)obstacle.push(new Cactus)// 70%
      else obstacle.push(new Bird) // 30%
      lastTime = 0
    }
  }
}

function drawState(){
  for(let a of [...obstacle,hero]){
    ctx.fillStyle = a.colour
    ctx.fillRect(a.x,a.y,a.w,a.h)
  }
  if(lose){
    ctx.fillStyle = "black"
    ctx.font = '24px Verdana'
    ctx.fillText("Game Over",100,hero.oy-hero.h)
    ctx.fillText(`Score: ${score}`,100,hero.oy-hero.h+50)
  }
  else {
    ctx.font = '24px Verdana'
    ctx.fillText("Score: "+score,10,20)
  }
}

window.onkeydown = (e)=>{
  e.preventDefault()
  // if(e.key===" "){
  //   jumpCtrl = true
  // }
  if(!lose)jumpCtrl = true
  else reset()
}

document.querySelector("canvas").onpointerdown = () =>{
  if(!lose)jumpCtrl = true
  else reset()
}
function reset(){
  obstacle = []
  lastTime = 0
  jumpTime = 0
  jumpCtrl = false
  hero.y = hero.oy
  score = 0
  lose = false
  requestAnimationFrame(drawLoop)
}