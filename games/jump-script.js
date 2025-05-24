const urlParams = new URLSearchParams(window.location.search);//copied from somewhere on internet
let chicken = new Image()
let avaNum = urlParams.get("avatar")? urlParams.get("avatar"):1
console.log(avaNum)
let avaArr = ["../avatar1.jpg","../avatar2.jpg","../avatar3.jpg"]
chicken.src = avaArr[avaNum]
let ghost = new Image()
ghost.src = "../images/ghost.png"
let grass = new Image()
grass.src = "../images/grass.png"
let cloud = new Image()
cloud.src = "../image/cloud.png"


let words = ["algorithm","binary","bit","byte","CPU","cache","compiler","compression","cybersecurity","data","database","debugging","decomposition","denary","encryption","function","hardware","hexadecimal","input","iteration","logic gate","loop","memory","network","output","pixel","program","pseudocode","RAM","ROM","register","software","syntax","variable","while loop","TCP/IP","IP address","boolean","machine code","overflow error"]
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
  image: chicken,
  colour: "darkgrey",
  w: 50,
  h: 50,
  x: 50,
  y: 100,//canvas.height-this.h,//100
  oy: 100,//canvas.height-this.h,//100,//original y aka ground
  in(thing){ // check if the thing is overlapping (in) with hero
    return (this.x+this.w>=thing.x)&&(this.x<=thing.x+thing.w)&&(this.y+this.h>=thing.y)&&(this.y<=thing.y+thing.h)
  },
}



class Things{
  x = canvas.width
  v = 7*600/canvas.width
}
class Cactus extends Things{
  image = grass
  w = random(hero.w*1.5,10)
  h = hero.h/3*2
  y = hero.oy + hero.h - this.h
  colour = "green"
}
class Bird extends Things{
  image = ghost
  y = hero.oy-hero.h
  w = 30
  h = hero.h/2
  colour = "blue"
}
class Cloud extends Things{
  image = cloud
  y = hero.oy-hero.h-20
  w = 100
  h = 50
  colour = "white"
}
class Words extends Things{
  text = words[Math.floor(Math.random()*words.length)]
  w = random(hero.w*1.5,30)
  h = hero.h/3*2
  y = hero.oy + hero.h - this.h
  colour = "black"
}

let obstacle = []
let cloudArray = []
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
setTimeout(()=>requestAnimationFrame(drawLoop),50)
//requestAnimationFrame(drawLoop)
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
    let jumpDis = jumpingDisplacement(jumpTime, 1000* (1-Math.floor(score/20)*0.25), hero) // displacement from original y
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
    ob.x -= ob.v * (1+Math.floor(score/20)*0.25) //moving
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
    if(Math.random()<0.5){// 40% spawning somwthing each frame
      let dice = Math.random()
      if(dice<0.3)obstacle.push(new Cactus)// 40%
      else if(dice<0.8)obstacle.push(new Words)//30%
      else obstacle.push(new Bird) // 30%
      lastTime = 0
    }
    if(Math.random()<0.3){
      cloudArray.push(new Cloud)
    }
  }
}

let tree = new Image()
tree.src = "../images/tree.jpeg"
let loseImg = new Image()
loseImg.src = "../images/A.jpeg"
function drawState(){
  ctx.globalAlpha = 0.5
  ctx.drawImage(tree,0,0,canvas.width,canvas.height)
  ctx.globalAlpha = 1
  ctx.fillStyle = "black"
  ctx.fillRect(0,hero.oy+canvas.height/3+hero.h,canvas.width,2)
  for(let a of [...obstacle,hero]){
    ctx.fillStyle = a.colour
    if(a.image)ctx.drawImage(a.image,a.x,a.y+canvas.height/3,a.w,a.h)
    else ctx.fillText(a.text,a.x,a.y+canvas.height/3,a.w)
  }
    // for(let a of cloudArray){
    // ctx.fillStyle = a.colour
    // ctx.globalAlpha = 0.6
    // ctx.drawImage(a.image,a.x,a.y+canvas.height/3,a.w,a.h)
    // ctx.globalAlpha = 1
  //}
  if(lose){
    ctx.fillStyle = "black"
    ctx.font = '24px Verdana'
    ctx.fillText("Game Over",100,hero.oy-hero.h+canvas.height/3)
    ctx.fillText(`Score: ${score}`,100,hero.oy-hero.h+50+canvas.height/3)
    ctx.drawImage(loseImg,250,hero.oy-hero.h+50+canvas.height/3-50,200,200)
  }
  else {
    ctx.font = '24px Verdana'
    ctx.fillText("Score: "+score,10,20+canvas.height/3)
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