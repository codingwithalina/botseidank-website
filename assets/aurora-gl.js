/* botseidank.com – lebender Aurora-Hintergrund für alle Seiten.
   Wird direkt auf der Grafikkarte gerechnet. Ohne WebGL bleibt der ruhige CSS-Grund aus aurora.css stehen.
   Bei „Bewegung reduzieren“ wird ein einziges Standbild gezeichnet. */
(function () {
  var cv = document.getElementById('gl');
  if (!cv) { cv = document.createElement('canvas'); cv.id = 'gl'; cv.setAttribute('aria-hidden', 'true'); document.body.prepend(cv); }
  var gl = cv.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) { cv.remove(); return; }
  var COL = ['#F1FFFA', '#A5FCDF', '#6CBCE0', '#8ADEDD', '#A9A8E6'].map(function (h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16) / 255; }); });
  var fs = 'precision highp float;uniform vec2 r;uniform float t;uniform vec2 m;uniform float s;uniform vec3 c0,c1,c2,c3,c4;' +
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}' +
    'float fbm(vec2 p){float a=.5,v=0.;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.+vec2(3.1,1.7);a*=.5;}return v;}' +
    'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*1.25;p+=(m-.5)*.35;float tt=t*.05+s*2.2;' +
    'vec2 q=vec2(fbm(p+tt),fbm(p-tt+4.));float f=fbm(p+q*1.7+vec2(tt*.5,-tt*.3));float g=fbm(p*.7-q*1.3+7.+s);' +
    'vec3 c=mix(c0,c1,smoothstep(.28,.78,f));c=mix(c,c2,smoothstep(.42,.8,g)*.8);c=mix(c,c3,smoothstep(.5,.85,q.x)*.55);' +
    'c=mix(c,c4,smoothstep(.55,.9,q.y)*(.3+s*.7));gl_FragColor=vec4(c,1.);}';
  function sh(ty, src) { var o = gl.createShader(ty); gl.shaderSource(o, src); gl.compileShader(o); return o; }
  var pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { cv.remove(); return; }
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var al = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
  function U(k) { return gl.getUniformLocation(pr, k); }
  var ur = U('r'), ut = U('t'), um = U('m'), us = U('s'), root = document.documentElement;
  COL.forEach(function (c, i) { gl.uniform3f(U('c' + i), c[0], c[1], c[2]); });
  function size() { cv.width = Math.round(innerWidth * .5); cv.height = Math.round(innerHeight * .5); gl.viewport(0, 0, cv.width, cv.height); }
  var mx = .5, my = .5, tx = .5, ty = .5;
  function draw(time) {
    mx += (tx - mx) * .04; my += (ty - my) * .04;
    gl.uniform2f(ur, cv.width, cv.height); gl.uniform1f(ut, time * .001); gl.uniform2f(um, mx, my);
    gl.uniform1f(us, scrollY / Math.max(1, root.scrollHeight - innerHeight)); gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  size();
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  addEventListener('resize', function () { size(); if (still) draw(4000); });
  if (still) { draw(4000); addEventListener('scroll', function () { draw(4000); }, { passive: true }); return; }
  addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth; ty = 1 - e.clientY / innerHeight; }, { passive: true });
  (function loop(t) { draw(t); requestAnimationFrame(loop); })(0);
})();
