(function(){
  var ns='http://www.w3.org/2000/svg';
  var svg=document.getElementById('treeline-svg');
  var VW=1920,VH=580;
  svg.setAttribute('viewBox','0 0 '+VW+' '+VH);
  var sd=42;
  function r(){sd=(sd*16807)%2147483647;return(sd-1)/2147483646;}
  function rr(a,b){return a+r()*(b-a);}
  function F(d,ax,ay,bx,by,n,amp){
    if(n<1){d+=' L'+bx.toFixed(1)+' '+by.toFixed(1);return d;}
    var dx=bx-ax,dy=by-ay,len=Math.sqrt(dx*dx+dy*dy);
    if(len<1){d+=' L'+bx.toFixed(1)+' '+by.toFixed(1);return d;}
    var px=-dy/len,py=dx/len;
    for(var i=1;i<=n;i++){var f=i/(n+1);d+=' L'+(ax+dx*f+px*rr(-amp,amp)).toFixed(1)+' '+(ay+dy*f+py*rr(-amp,amp)).toFixed(1);}
    d+=' L'+bx.toFixed(1)+' '+by.toFixed(1);return d;
  }
  function spruce(cx,h,wf,tilt){
    var B=VH,T=B-h,layers=Math.max(22,Math.floor(h/5)),mW=h*rr(0.12,0.19)*wf;
    var aR=rr(0.76,1.24),aL=rr(0.76,1.24);tilt=tilt||0;
    function ox(y){return cx+tilt*(B-y)/h;}
    var d='M'+ox(T).toFixed(1)+' '+T.toFixed(1),spY=T+rr(1.5,4);
    d+=' L'+(ox(T)+rr(-0.5,0.5)).toFixed(1)+' '+spY.toFixed(1);
    var lx=ox(T),ly=spY;
    for(var i=0;i<layers;i++){
      var f=(i+1)/layers,y=T+h*f*0.92,w=mW*f*aR*rr(0.80,1.20),drp=rr(0.5,2)+f*rr(4,9);
      var tc=ox(y),fn=Math.max(2,Math.floor(w/7)),fa=rr(1.8,4.0);
      var p1x=tc+w*rr(0.10,0.17),p1y=y-h/layers*rr(0.28,0.48);
      var p2x=tc+w*rr(0.30,0.45),p2y=y-h/layers*rr(0.06,0.16);
      var p3x=tc+w*rr(0.60,0.78),p3y=y+drp*rr(0.10,0.40);
      var ex=tc+w,ey=y+drp;
      d=F(d,lx,ly,p1x,p1y,Math.ceil(fn*0.25),fa*0.4);
      d=F(d,p1x,p1y,p2x,p2y,Math.ceil(fn*0.3),fa*0.8);
      d=F(d,p2x,p2y,p3x,p3y,Math.ceil(fn*0.3),fa);
      var nc=2+Math.floor(r()*4);
      for(var c=0;c<nc;c++){var cf=(c+0.3)/(nc+0.3),nx=p3x+(ex-p3x)*cf,ny=p3y+(ey-p3y)*cf;
        d+=' L'+(nx+rr(-2.5,2.5)).toFixed(1)+' '+(ny+rr(-4.5,0)).toFixed(1);
        d+=' L'+(nx+rr(-1,3.5)).toFixed(1)+' '+(ny+rr(0,4.5)).toFixed(1);}
      d+=' L'+ex.toFixed(1)+' '+ey.toFixed(1);
      var hx=ex-rr(0.5,3),hy=ey+rr(1,4.5);d+=' L'+hx.toFixed(1)+' '+hy.toFixed(1);
      if(i<layers-1){lx=tc+w*rr(0.05,0.12);ly=y+rr(0.3,2.5);d=F(d,hx,hy,lx,ly,Math.ceil(fn*0.2),fa*0.35);}
      else{lx=hx;ly=hy;}
    }
    var bc=ox(B);d+=' L'+(bc+mW*0.03).toFixed(1)+' '+B+' L'+(bc-mW*0.03).toFixed(1)+' '+B;
    lx=bc-mW*0.03;ly=B;
    for(var i=layers-1;i>=0;i--){
      var f=(i+1)/layers,y=T+h*f*0.92,w=mW*f*aL*rr(0.80,1.20),drp=rr(0.5,2)+f*rr(4,9);
      var tc=ox(y),fn=Math.max(2,Math.floor(w/7)),fa=rr(1.8,4.0);
      if(i<layers-1){var qx=tc-w*rr(0.05,0.12),qy=y+rr(0.3,2.5);d=F(d,lx,ly,qx,qy,Math.ceil(fn*0.2),fa*0.35);}
      var ex=tc-w,ey=y+drp,hx=ex+rr(0.5,3),hy=ey+rr(1,4.5);
      d+=' L'+hx.toFixed(1)+' '+hy.toFixed(1)+' L'+ex.toFixed(1)+' '+ey.toFixed(1);
      var p3x=tc-w*rr(0.60,0.78),p3y=y+drp*rr(0.10,0.40),nc=2+Math.floor(r()*4);
      for(var c=nc-1;c>=0;c--){var cf=(c+0.3)/(nc+0.3),nx=p3x+(ex-p3x)*cf,ny=p3y+(ey-p3y)*cf;
        d+=' L'+(nx+rr(-3.5,1)).toFixed(1)+' '+(ny+rr(0,4.5)).toFixed(1);
        d+=' L'+(nx+rr(-2.5,2.5)).toFixed(1)+' '+(ny+rr(-4.5,0)).toFixed(1);}
      var p2x=tc-w*rr(0.30,0.45),p2y=y-h/layers*rr(0.06,0.16);
      var p1x=tc-w*rr(0.10,0.17),p1y=y-h/layers*rr(0.28,0.48);
      d=F(d,p3x,p3y,p2x,p2y,Math.ceil(fn*0.3),fa);
      d=F(d,p2x,p2y,p1x,p1y,Math.ceil(fn*0.3),fa*0.8);
      lx=p1x;ly=p1y;
    }
    d+=' Z';return d;
  }
  function snag(cx,h){
    var B=VH,brkH=h*rr(0.5,0.85),brkY=B-brkH,tw=rr(2,4.5),lean=rr(-5,5);
    function ox(y){return cx+lean*(B-y)/h;}
    var d='M'+(ox(brkY)-tw*0.3).toFixed(1)+' '+brkY.toFixed(1);
    d+=' L'+(ox(brkY)+rr(-2,0)).toFixed(1)+' '+(brkY-rr(4,10)).toFixed(1);
    d+=' L'+(ox(brkY)+rr(0,2)).toFixed(1)+' '+(brkY-rr(2,6)).toFixed(1);
    d+=' L'+(ox(brkY)+tw*0.3).toFixed(1)+' '+brkY.toFixed(1);
    var stubs=2+Math.floor(r()*4);
    for(var i=0;i<stubs;i++){var sy=brkY+(B-brkY)*rr(0.08+i*0.18,0.2+i*0.18),sw=rr(5,16),sdrp=rr(1,5);
      d+=' L'+(ox(sy)+tw*0.4).toFixed(1)+' '+sy.toFixed(1)+' L'+(ox(sy)+tw*0.4+sw).toFixed(1)+' '+(sy+sdrp).toFixed(1);
      d+=' L'+(ox(sy)+tw*0.4+sw-rr(1,3)).toFixed(1)+' '+(sy+sdrp+rr(0.5,2)).toFixed(1)+' L'+(ox(sy)+tw*0.45).toFixed(1)+' '+(sy+rr(1,3)).toFixed(1);}
    d+=' L'+(cx+tw).toFixed(1)+' '+B+' L'+(cx-tw).toFixed(1)+' '+B;
    for(var i=stubs-1;i>=0;i--){var sy=brkY+(B-brkY)*rr(0.08+i*0.18,0.2+i*0.18),sw=rr(5,16),sdrp=rr(1,5);
      d+=' L'+(ox(sy)-tw*0.45).toFixed(1)+' '+(sy+rr(1,3)).toFixed(1)+' L'+(ox(sy)-tw*0.4-sw+rr(1,3)).toFixed(1)+' '+(sy+sdrp+rr(0.5,2)).toFixed(1);
      d+=' L'+(ox(sy)-tw*0.4-sw).toFixed(1)+' '+(sy+sdrp).toFixed(1)+' L'+(ox(sy)-tw*0.4).toFixed(1)+' '+sy.toFixed(1);}
    d+=' Z';return d;
  }
  function birch(cx,h){
    var B=VH,T=B-h,tw=rr(1.2,2.5),lean=rr(-8,8);
    function bx(y){return cx+lean*(B-y)/h;}
    var d='M'+(cx-tw).toFixed(1)+' '+B,st=10;
    for(var i=1;i<=st;i++){var f=i/st,y=B-h*f,w=tw*(1-f*0.65);d+=' L'+(bx(y)-w+rr(-0.5,0.5)).toFixed(1)+' '+y.toFixed(1);}
    for(var i=st;i>=1;i--){var f=i/st,y=B-h*f,w=tw*(1-f*0.65);d+=' L'+(bx(y)+w+rr(-0.5,0.5)).toFixed(1)+' '+y.toFixed(1);}
    d+=' Z';
    var nb=7+Math.floor(r()*7);
    for(var b=0;b<nb;b++){
      var by=T+h*rr(0.03,0.62),bo=bx(by),side=r()<0.5?1:-1,bl=rr(14,45),ba=rr(0.15,1.1);
      var bex=bo+side*Math.cos(ba)*bl,bey=by-Math.sin(ba)*bl;
      d+=' M'+(bo-0.8*side).toFixed(1)+' '+by.toFixed(1)+' L'+bex.toFixed(1)+' '+bey.toFixed(1)+' L'+(bo+0.8*side).toFixed(1)+' '+(by+0.5).toFixed(1)+' Z';
      var nsb=1+Math.floor(r()*4);
      for(var sb=0;sb<nsb;sb++){
        var sf=rr(0.2,0.88),sx=bo+(bex-bo)*sf,sy=by+(bey-by)*sf,sl=bl*rr(0.2,0.5),sa=ba+rr(-0.7,0.9);
        var sex=sx+side*Math.cos(sa)*sl,sey=sy-Math.sin(sa)*sl;
        d+=' M'+(sx-0.3).toFixed(1)+' '+sy.toFixed(1)+' L'+sex.toFixed(1)+' '+sey.toFixed(1)+' L'+(sx+0.3).toFixed(1)+' '+sy.toFixed(1)+' Z';
        var nt=Math.floor(r()*3);
        for(var t2=0;t2<nt;t2++){
          var tf=rr(0.3,0.85),tx2=sx+(sex-sx)*tf,ty2=sy+(sey-sy)*tf,tl=sl*rr(0.2,0.45),ta=sa+rr(-0.6,0.6);
          d+=' M'+tx2.toFixed(1)+' '+ty2.toFixed(1)+' L'+(tx2+side*Math.cos(ta)*tl).toFixed(1)+' '+(ty2-Math.sin(ta)*tl).toFixed(1)+' L'+(tx2+0.2).toFixed(1)+' '+(ty2+0.2).toFixed(1)+' Z';
        }
      }
    }
    return d;
  }
  function shrub(cx,h){
    var B=VH,w=h*rr(1.0,2.0),d='M'+(cx-w*0.5).toFixed(1)+' '+B;
    var pts=6+Math.floor(r()*5);
    for(var i=0;i<=pts;i++){var a=Math.PI*(i/pts),rx=w*0.5*rr(0.6,1.4),ry=h*rr(0.5,1.3);d+=' L'+(cx-rx*Math.cos(a)+rr(-2,2)).toFixed(1)+' '+(B-Math.sin(a)*ry+rr(-2,2)).toFixed(1);}
    d+=' L'+(cx+w*0.5).toFixed(1)+' '+B+' Z';return d;
  }
  function sapling(cx,h){
    var B=VH,T=B-h,w=h*rr(0.08,0.14),d='M'+cx.toFixed(1)+' '+T.toFixed(1),layers=4+Math.floor(r()*4);
    for(var i=0;i<layers;i++){var f=(i+1)/layers,y=T+h*f*0.85,bw=w*f;d+=' L'+(cx+bw*0.3).toFixed(1)+' '+(y-h/layers*0.3).toFixed(1)+' L'+(cx+bw).toFixed(1)+' '+(y+rr(1,3)).toFixed(1);if(i<layers-1)d+=' L'+(cx+bw*0.15).toFixed(1)+' '+(y+1).toFixed(1);}
    d+=' L'+(cx+1).toFixed(1)+' '+B+' L'+(cx-1).toFixed(1)+' '+B;
    for(var i=layers-1;i>=0;i--){var f=(i+1)/layers,y=T+h*f*0.85,bw=w*f;if(i<layers-1)d+=' L'+(cx-bw*0.15).toFixed(1)+' '+(y+1).toFixed(1);d+=' L'+(cx-bw).toFixed(1)+' '+(y+rr(1,3)).toFixed(1)+' L'+(cx-bw*0.3).toFixed(1)+' '+(y-h/layers*0.3).toFixed(1);}
    d+=' Z';return d;
  }
  var P='',x=-10;
  while(x<VW+30){P+=spruce(x,rr(35,80),rr(0.55,0.85),rr(-0.5,0.5));x+=rr(5,12);}
  x=-10;while(x<VW+30){if(r()<0.88)P+=spruce(x,rr(70,130),rr(0.7,1.0),rr(-1.5,1.5));else P+=birch(x,rr(55,100));x+=rr(8,18);}
  x=-10;while(x<VW+30){var k=r();if(k<0.78)P+=spruce(x,rr(120,200),rr(0.85,1.15),rr(-2.5,2.5));else if(k<0.92)P+=birch(x,rr(90,160));else P+=snag(x,rr(80,150));x+=rr(14,26);}
  x=-10;while(x<VW+30){var k=r();if(k<0.75)P+=spruce(x,rr(200,320),rr(0.95,1.2),rr(-3.5,3.5));else if(k<0.88)P+=birch(x,rr(140,240));else P+=snag(x,rr(120,220));x+=rr(20,36);}
  x=rr(0,25);while(x<VW+30){var k=r();if(k<0.55)P+=spruce(x,rr(280,460),rr(1.0,1.3),rr(-5,5));else if(k<0.70)P+=birch(x,rr(180,320));else if(k<0.80)P+=snag(x,rr(140,260));else if(k<0.90)P+=sapling(x,rr(20,50));else P+=shrub(x,rr(12,30));x+=rr(25,45);}
  x=0;while(x<VW+20){if(r()<0.35)P+=shrub(x,rr(8,25));else if(r()<0.3)P+=sapling(x,rr(15,40));x+=rr(12,45);}
  P+=' M-1 '+(VH+2)+' L'+(VW+1)+' '+(VH+2)+' L'+(VW+1)+' '+(VH-4)+' L-1 '+(VH-4)+' Z';
  var path=document.createElementNS(ns,'path');
  path.setAttribute('d',P);
  path.setAttribute('fill','#040810');
  svg.appendChild(path);
})();
