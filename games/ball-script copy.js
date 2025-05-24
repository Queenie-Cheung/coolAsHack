
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let keys = { up: 0, down: 0, left: 0, right: 0 }
let timeSpeed = 0
let scoreUp = false
let scoreGlo = 0
let random = (max,min=0) => Math.floor(Math.random()*(max-min)+min)//0-max
let shorterWords = ["atom","cell","ions","mass","acid","base","pH","gas","ion","salt","iron","coal","oil","test","light","solid","force","plant","metal","neutr"]
let longerWords = ["energy","reaction","enzyme","carbon","oxygen","fusion","fission","neuron","proton","electron","solvent","current","circuit","voltage","gravity","density","molecule","evaporation","diffusion"]

let balls = []
let bask = {
  image: rockets,
  x: canvas.width/2,
  y: canvas.height*7/8,
  w: 75,
  h: 5,
  v: 9,
  colour: "black"
}

setTimeout(drawLoop, 16)

function drawLoop () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  updateState()
  drawState()
  timeSpeed += 0.000005
  setTimeout(drawLoop, 16)
}

function updateState () {
  for (let ball of balls) {
    ball.vy += timeSpeed
    ball.y += ball.vy

    if((ball.y+ball.r)>=bask.y&&(ball.x+ball.r)>=bask.x&&(ball.x-ball.r)<=(bask.x+bask.w)){
      if(!ball.over){
      let score = ball.score
      let s = scoreGlo
      if(ball.buff)ball.buff()
      if(scoreUp)score*=3
      scoreGlo = s + score
      }
      ball.over=true
      balls.splice(ball,1)
    }
    if(ball.y-ball.r>canvas.height)balls.splice(ball,1)
  }
  if (keys.left)bask.x-=bask.v
  if (keys.right)bask.x+=bask.v
  if(bask.x<0)bask.x=0
  if(bask.x>canvas.width-bask.w)bask.x=canvas.width-bask.w
}

function drawState () {
  for (let ball of balls){
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
  ctx.fillStyle = ball.colour
  ctx.fill()
  ctx.stroke()
  }
  ctx.fillStyle = bask.colour
  ctx.fillRect(bask.x,bask.y,bask.w,bask.h)
  ctx.fillStyle = "black"
  ctx.font = '24px Verdana'
  ctx.fillText("Score: "+scoreGlo,10,20)
}

/*window.onpointerdown = (e) => mouse(e)
window.onpointermove = (e) => mouse(e)
function mouse(e){
  if(e.offsetX<canvas.width&&e.offsetY<canvas.height)bask.x = e.offsetX-(bask.w/2)
}*/

window.onkeydown = (e) => keyChange(e, 1)
window.onkeyup = (e) => keyChange(e, 0)
function keyChange (e, val) {
  e.preventDefault()
  if (e.key === 'ArrowLeft') keys.left = val
  if (e.key === 'ArrowRight') keys.right = val
  if (e.key === 'a') keys.left = val
  if (e.key === 'd') keys.right = val
}

setInterval(newBall,1000+timeSpeed)

function newBall(){
  let type = random(14)
  if(type<1)balls.push(new GreenBall)//1
  else if(type<2)balls.push(new YellowBall)//1
  else if(type<5)balls.push(new BlueBall)//3
  else if(type<9)balls.push(new RedBall)//4
  else balls.push(new WhiteBall)//5
}

class Ball{
  x = random(canvas.width)
  y = 0
  over = false
}

class RedBall extends Ball {//bomb
  r = 10
  vy = 5
  score = -3
  colour = 'red'
  over = false
  buff(){
    scoreUp = false
    bask.colour = "darkred"
    setTimeout(()=>bask.colour="black",1500)
  }
}
class WhiteBall extends Ball{//normal
  r = 10
  vy = 5
  colour = 'whitesmoke'
  score = 1
}
class BlueBall extends Ball {//extra point
  r = 5
  vy = 7
  colour = 'blue'
  score = 5
}
class GreenBall extends Ball{//extra speed
  r = 4
  vy = 7.5
  colour = 'green'
  score = 3
  buffNum = 3
  buffTime = 10000
  buff(){
    bask.v+=this.buffNum
    bask.colour = "darkgreen"
    setTimeout(this.buffGone,this.buffTime)
  }
  buffGone(){
    bask.v-=3
    bask.colour = "black"
  }
}
class YellowBall extends Ball{//score*3
  r = 4
  vy = 7.5
  colour = 'yellow'
  score = 1
  buffNum = 3//useless, set another global viarable scoreUp, edit buff in updateState
  buffTime = 10*1000
  buff(){
    scoreUp = true
    bask.colour = "darkgoldenrod"
    setTimeout(this.buffGone,this.buffTime)
  }
  buffGone(){
    scoreUp = false
    bask.colour = "black"
  }
}
