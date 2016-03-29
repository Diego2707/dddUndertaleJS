"use strict"

////////////////////////Variables & Preloads
var audio = document.getElementById("music");
audio.loop = true;
audio.play();
audio.playbackRate = 0;
var frames = 0;
////////////////////////Functions

function requestFullscreen(){
  (canvas.requestFullscreen||canvas.webkitRequestFullscreen||canvas.mozRequestFullScreen||canvas.msRequestFullscreen).call(canvas);
}


function fillTextLines(text,x,y,yDiff) {
	var lines=text.split("\n");
	for(let i=0;i<lines.length;i++){
 		ctx.fillText(lines[i],x,y+i*yDiff);
	}
}


function conv(n) {
	return String.fromCharCode(n&0xff,(n>>8)&0xff,(n>>16)&0xff,(n>>24)&0xff);
}
function BMP(arr,width,height,color) {
  var data='BM'+conv(62+arr.length)+"\0\0\0\0\x3E\0\0\0\x28\0\0\0"+conv(width)+
    conv(height||width)+"\x01\0\x01\0\0\0\0\0"+conv(arr.length)+
    "\x13\x0B\0\0\x13\x0B\0\0\0\0\0\0\0\0\0\0\0\0\0\0"+(color||"\xFF\xFF\xFF")+"\0"+
  	String.fromCharCode.apply(String, arr);
  var image=new Image();
	image.src='data:image/bmp;base64,'+window.btoa(data);
	return image;
}

////////////////////////Keyboard input

var prKeys={};
window.onkeydown=function(e){
  prKeys[e.keyCode]=true;
  return false;
};
window.onkeyup=function(e){
  prKeys[e.keyCode]=undefined;
};
window.onblur=function(){
  prKeys=[];
};

////////////////////////Images

var heartSpr=BMP([
  3,192,0,0,
  3,192,0,0,
  15,240,0,0,
  15,240,0,0,
  63,252,0,0,
  63,252,0,0,
  255,255,0,0,
  255,255,0,0,
  255,255,0,0,
  255,255,0,0,
  255,255,0,0,
  255,255,0,0,
  254,127,0,0,
  254,127,0,0,
  124,62,0,0,
  48,12,0,0
],16,16,"\x00\x00\xFF");

var flowey0=BMP([
  0,0,127,0,0,0,0,0,
  0,0,128,128,0,0,0,0,
  0,1,62,64,0,0,0,0,
  0,2,127,32,0,0,0,0,
  0,2,63,32,0,0,0,0,
  0,0,31,0,0,0,0,0,
  0,0,14,0,0,0,0,0,
  0,0,14,0,0,0,0,0,
  0,0,28,0,0,0,0,0,
  0,0,60,0,0,0,0,0,
  0,0,120,0,0,0,0,0,
  0,0,112,0,0,0,0,0,
  0,0,224,0,0,0,0,0,
  0,0,224,0,0,0,0,0,
  0,0,240,0,0,0,0,0,
  0,0,120,0,0,0,0,0,
  0,0,120,0,0,0,0,0,
  0,0,48,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  1,248,0,15,192,0,0,0,
  7,255,128,255,240,0,0,0,
  7,127,247,255,112,0,0,0,
  7,126,0,63,112,0,0,0,
  7,176,0,6,240,0,0,0,
  3,192,255,129,224,0,0,0,
  1,195,255,225,192,0,0,0,
  0,71,255,241,0,0,0,0,
  0,15,128,248,0,0,0,0,
  15,159,127,124,248,0,0,0,
  31,30,0,60,124,0,0,0,
  63,61,255,222,126,0,0,0,
  255,63,156,254,127,128,0,0,
  254,63,156,254,63,128,0,0,
  224,63,156,254,3,128,0,0,
  127,63,156,254,127,0,0,0,
  63,31,156,252,126,0,0,0,
  30,15,255,248,60,0,0,0,
  0,7,255,240,0,0,0,0,
  0,192,255,129,128,0,0,0,
  1,240,0,7,192,0,0,0,
  0,248,0,7,128,0,0,0,
  0,99,243,243,0,0,0,0,
  0,15,128,248,0,0,0,0
],41,43);

var battleBubble=new Image();
battleBubble.src="BMPs/BattleBubble.bmp";

var flowey1=new Image();
flowey1.src="BMPs/flowey1.bmp";

////////////////////////Important shit

var canvas=document.getElementById('canvas'),
    heartX=312,heartY=304,heartL=16,HP=20,
    ctx=canvas.getContext('2d'),text=[],
    sprite={},onSprites=[],tick=0;

sprite["pellet"]={
  onInit:function(spr){
    var angle=Math.tan((heartY-spr[2])/(heartX-spr[1]));
    return [Math.cos(angle),Math.sin(angle)];
  },
  onTick:function(spr,dir){
    spr[1]=spr[1]+dir[1];
    spr[2]=spr[2]+dir[2];
  },
  imgs:[]
};

sprite["misterAsshole"]={
  onInit:function(){
  	return true;
  },
  onTick:function(spr){
    //Bullet Box
    if(heartX<242){
      heartX=242;
    }else if(heartX>381){
      heartX=381;
    }if(heartY<255){
      heartY=255;
    }else if(heartY>369){
      heartY=369;
    }
    ctx.beginPath();
    ctx.lineWidth="5";
    ctx.rect(239.5,252.5,160,135);
    ctx.stroke();
    ctx.drawImage(battleBubble,367,134);
    if(tick%10==0){
      spr[5]=1-spr[5];
    }
  },
  imgs:[flowey0,flowey1]
};


onSprites=[
  //Sprite name,x,y,sizeX,sizeY,img,rot
  ["misterAsshole",281,134,82,86,0,0],
];

text=[
  //Text,x,y,yDiff,delay,offset
  ["See that heart?    \nThat is your SOUL,    \nthe very culmination\nof your being!",406,158,20,2,0]
];


function step(time){
  if(prKeys[37]){
    heartX-=2;
  }if(prKeys[38]){
    heartY-=2;
  }if(prKeys[39]){
    heartX+=2;
  }if(prKeys[40]){
    heartY+=2;
  }
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<onSprites.length;i++){
    let spr=onSprites[i];
    if(spr[7]==undefined){
      spr[7]=sprite[spr[0]].onInit(spr);
    }
    sprite[spr[0]].onTick(spr,spr[7]);
    let img=sprite[spr[0]].imgs[spr[5]];
    if(img){
      ctx.rotate(spr[6]);
      ctx.drawImage(img,spr[1],spr[2],spr[3],spr[4]);
      ctx.rotate(0);
    }
  }
  //Drawing text char by char
  for(let i=0;i<text.length;i++){
    let t=text[i];
    fillTextLines(t[0].slice(0,(tick-t[5])/t[4]),t[1],t[2],t[3]);
  }
  
  ctx.drawImage(heartSpr,heartX,heartY,heartL,heartL);
  tick++;
  window.requestAnimationFrame(step);
}


////////////////////////And now we start...
ctx.imageSmoothingEnabled=false;
ctx.mozImageSmoothingEnabled=false;
ctx.msImageSmoothingEnabled=false;
ctx.strokeStyle="white";
ctx.font="100% Serious";
window.requestAnimationFrame(step);
