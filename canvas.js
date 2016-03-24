"use strict"

////////////////////////Keyboard input

var prKeys={};
window.onkeydown=function(e){
  prKeys[e.keyCode]=true;
  return false;
}
window.onkeyup=function(e){
  prKeys[e.keyCode]=undefined;
}
window.onblur=function(){
  prKeys=[];
}

////////////////////////Important shit

var canvas=document.getElementById('canvas'),
    ctx=canvas.getContext('2d'),
    heartSpr=new Image(),
    sprite={},onSprites=[],
    heartX=0,heartY=0,
    HP=20,items=[];

heartSpr.src="https://static.tumblr.com/f6c48b514aa41da79dd0eb3d931019fb/ycfppqo/81no29htn/tumblr_static_9xc2tj68dcwg4w8gw4so0csco.png"


sprite["pellet"]={
  onHit:function(){
    HP=1;
    for(i=0;i<onSprites.length;i++){
      if(onSprites[i][0]=="pellet"){
        onSprites.splice(i,1);
      }
    }
  },
  onInit:function(spr){
    let angle=Math.tan((heartY-spr[2])/(heartX-spr[1]));
    return [Math.cos(angle),Math.sin(angle)];
  },
  onTick:function(dir){
    spr[1]=spr[1]+dir[1];
    spr[2]=spr[2]+dir[2];
  },
  onTurn:function(){},
  //imgs=[<images>] //Help how do I do this
};

sprite["misterAsshole"]={
  onHit:function(){},
  onInit:function(){
  	return true;
  },
  onTick:function(){},
  onTurn:function(){},
  //imgs:[<images>] //Seriously how the fuck do I do this
};

onSprites=[
  //Sprite name,x,y,sizeX,sizeY,img,rot,new?
  ["misterAsshole",500,500,300,300,0,0]
];


function tick(time){
  var heartSpd=2
  if(prKeys[88]||prKeys[16]){
    var heartSpd=1
  }if(prKeys[37]){
    heartX-=heartSpd;
  }if(prKeys[38]){
    heartY-=heartSpd;
  }if(prKeys[39]){
    heartX+=heartSpd;
  }if(prKeys[40]){
    heartY+=heartSpd;
  }
  ctx.clearRect(0,0,canvas.width,canvas.height)
  for(let i=0;i<onSprites.length;i++){
    let spr=onSprites[i];
    if(spr[7]==undefined){
      spr[7]=sprite[spr[0]].onInit(spr);
    }
    sprite[spr[0]].onTick(spr[7]);
    //Draw sprite from spr[5]
  }
  
  ctx.drawImage(heartSpr,heartX,heartY,20,20)
  
  window.requestAnimationFrame(tick);
}

////////////////////////And now we start...After I write more stuff

window.requestAnimationFrame(tick)
