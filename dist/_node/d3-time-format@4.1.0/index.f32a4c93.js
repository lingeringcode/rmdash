import{utcMonday as Z,utcDay as P,timeMonday as W,timeDay as Q,timeYear as M,timeSunday as Jn,timeThursday as U,utcYear as x,utcSunday as Pn,utcThursday as w}from"../d3-time@3.1.0/index.ae6ab93d.js";function b(n){if(0<=n.y&&n.y<100){var e=new Date(-1,n.m,n.d,n.H,n.M,n.S,n.L);return e.setFullYear(n.y),e}return new Date(n.y,n.m,n.d,n.H,n.M,n.S,n.L)}function V(n){if(0<=n.y&&n.y<100){var e=new Date(Date.UTC(-1,n.m,n.d,n.H,n.M,n.S,n.L));return e.setUTCFullYear(n.y),e}return new Date(Date.UTC(n.y,n.m,n.d,n.H,n.M,n.S,n.L))}function S(n,e,t){return{y:n,m:e,d:t,H:0,M:0,S:0,L:0}}function X(n){var e=n.dateTime,t=n.date,u=n.time,y=n.periods,m=n.days,L=n.shortDays,Y=n.months,H=n.shortMonths,an=p(y),fn=F(y),ln=p(m),sn=F(m),gn=p(L),hn=F(L),yn=p(Y),dn=F(Y),mn=p(H),vn=F(H),v={a:Fn,A:Ln,b:Yn,B:Hn,c:null,d:k,e:k,f:fe,g:De,G:Me,H:ce,I:oe,j:ae,L:z,m:le,M:se,p:An,q:Zn,Q:en,s:tn,S:ge,u:he,U:ye,V:de,w:me,W:ve,x:null,X:null,y:Te,Y:Ce,Z:Ue,"%":nn},T={a:Wn,A:bn,b:Vn,B:$n,c:null,d:R,e:R,f:pe,g:$e,G:qe,H:xe,I:we,j:Se,L:_,m:Fe,M:Le,p:jn,q:qn,Q:en,s:tn,S:Ye,u:He,U:Ae,V:Ze,w:We,W:be,x:null,X:null,y:Ve,Y:je,Z:Je,"%":nn},Tn={a:Cn,A:Mn,b:Un,B:xn,c:wn,d:B,e:B,f:te,g:N,G:O,H:G,I:G,j:_n,L:ee,m:Rn,M:Kn,p:Dn,q:En,Q:ue,s:ie,S:ne,u:Nn,U:Bn,V:Gn,w:On,W:kn,x:Sn,X:pn,y:N,Y:O,Z:zn,"%":re};v.x=d(t,v),v.X=d(u,v),v.c=d(e,v),T.x=d(t,T),T.X=d(u,T),T.c=d(e,T);function d(i,c){return function(o){var r=[],s=-1,f=0,g=i.length,h,D,J;for(o instanceof Date||(o=new Date(+o));++s<g;)i.charCodeAt(s)===37&&(r.push(i.slice(f,s)),(D=I[h=i.charAt(++s)])!=null?h=i.charAt(++s):D=h==="e"?" ":"0",(J=c[h])&&(h=J(o,D)),r.push(h),f=s+1);return r.push(i.slice(f,s)),r.join("")}}function q(i,c){return function(o){var r=S(1900,void 0,1),s=A(r,i,o+="",0),f,g;if(s!=o.length)return null;if("Q"in r)return new Date(r.Q);if("s"in r)return new Date(r.s*1e3+("L"in r?r.L:0));if(c&&!("Z"in r)&&(r.Z=0),"p"in r&&(r.H=r.H%12+r.p*12),r.m===void 0&&(r.m="q"in r?r.q:0),"V"in r){if(r.V<1||r.V>53)return null;"w"in r||(r.w=1),"Z"in r?(f=V(S(r.y,0,1)),g=f.getUTCDay(),f=g>4||g===0?Z.ceil(f):Z(f),f=P.offset(f,(r.V-1)*7),r.y=f.getUTCFullYear(),r.m=f.getUTCMonth(),r.d=f.getUTCDate()+(r.w+6)%7):(f=b(S(r.y,0,1)),g=f.getDay(),f=g>4||g===0?W.ceil(f):W(f),f=Q.offset(f,(r.V-1)*7),r.y=f.getFullYear(),r.m=f.getMonth(),r.d=f.getDate()+(r.w+6)%7)}else("W"in r||"U"in r)&&("w"in r||(r.w="u"in r?r.u%7:"W"in r?1:0),g="Z"in r?V(S(r.y,0,1)).getUTCDay():b(S(r.y,0,1)).getDay(),r.m=0,r.d="W"in r?(r.w+6)%7+r.W*7-(g+5)%7:r.w+r.U*7-(g+6)%7);return"Z"in r?(r.H+=r.Z/100|0,r.M+=r.Z%100,V(r)):b(r)}}function A(i,c,o,r){for(var s=0,f=c.length,g=o.length,h,D;s<f;){if(r>=g)return-1;if(h=c.charCodeAt(s++),h===37){if(h=c.charAt(s++),D=Tn[h in I?c.charAt(s++):h],!D||(r=D(i,o,r))<0)return-1}else if(h!=o.charCodeAt(r++))return-1}return r}function Dn(i,c,o){var r=an.exec(c.slice(o));return r?(i.p=fn.get(r[0].toLowerCase()),o+r[0].length):-1}function Cn(i,c,o){var r=gn.exec(c.slice(o));return r?(i.w=hn.get(r[0].toLowerCase()),o+r[0].length):-1}function Mn(i,c,o){var r=ln.exec(c.slice(o));return r?(i.w=sn.get(r[0].toLowerCase()),o+r[0].length):-1}function Un(i,c,o){var r=mn.exec(c.slice(o));return r?(i.m=vn.get(r[0].toLowerCase()),o+r[0].length):-1}function xn(i,c,o){var r=yn.exec(c.slice(o));return r?(i.m=dn.get(r[0].toLowerCase()),o+r[0].length):-1}function wn(i,c,o){return A(i,e,c,o)}function Sn(i,c,o){return A(i,t,c,o)}function pn(i,c,o){return A(i,u,c,o)}function Fn(i){return L[i.getDay()]}function Ln(i){return m[i.getDay()]}function Yn(i){return H[i.getMonth()]}function Hn(i){return Y[i.getMonth()]}function An(i){return y[+(i.getHours()>=12)]}function Zn(i){return 1+~~(i.getMonth()/3)}function Wn(i){return L[i.getUTCDay()]}function bn(i){return m[i.getUTCDay()]}function Vn(i){return H[i.getUTCMonth()]}function $n(i){return Y[i.getUTCMonth()]}function jn(i){return y[+(i.getUTCHours()>=12)]}function qn(i){return 1+~~(i.getUTCMonth()/3)}return{format:function(i){var c=d(i+="",v);return c.toString=function(){return i},c},parse:function(i){var c=q(i+="",!1);return c.toString=function(){return i},c},utcFormat:function(i){var c=d(i+="",T);return c.toString=function(){return i},c},utcParse:function(i){var c=q(i+="",!0);return c.toString=function(){return i},c}}}var I={"-":"",_:" ",0:"0"},l=/^\s*\d+/,Qn=/^%/,Xn=/[\\^$*+?|[\]().{}]/g;function a(n,e,t){var u=n<0?"-":"",y=(u?-n:n)+"",m=y.length;return u+(m<t?new Array(t-m+1).join(e)+y:y)}function In(n){return n.replace(Xn,"\\$&")}function p(n){return new RegExp("^(?:"+n.map(In).join("|")+")","i")}function F(n){return new Map(n.map((e,t)=>[e.toLowerCase(),t]))}function On(n,e,t){var u=l.exec(e.slice(t,t+1));return u?(n.w=+u[0],t+u[0].length):-1}function Nn(n,e,t){var u=l.exec(e.slice(t,t+1));return u?(n.u=+u[0],t+u[0].length):-1}function Bn(n,e,t){var u=l.exec(e.slice(t,t+2));return u?(n.U=+u[0],t+u[0].length):-1}function Gn(n,e,t){var u=l.exec(e.slice(t,t+2));return u?(n.V=+u[0],t+u[0].length):-1}function kn(n,e,t){var u=l.exec(e.slice(t,t+2));return u?(n.W=+u[0],t+u[0].length):-1}function O(n,e,t){var u=l.exec(e.slice(t,t+4));return u?(n.y=+u[0],t+u[0].length):-1}function N(n,e,t){var u=l.exec(e.slice(t,t+2));return u?(n.y=+u[0]+(+u[0]>68?1900:2e3),t+u[0].length):-1}function zn(n,e,t){var u=/^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(e.slice(t,t+6));return u?(n.Z=u[1]?0:-(u[2]+(u[3]||"00")),t+u[0].length):-1}function En(n,e,t){var u=l.exec(e.slice(t,t+1));return u?(n.q=u[0]*3-3,t+u[0].length):-1}function Rn(n,e,t){var u=l.exec(e.slice(t,t+2));return u?(n.m=u[0]-1,t+u[0].length):-1}function B(n,e,t){var u=l.exec(e.slice(t,t+2));return u?(n.d=+u[0],t+u[0].length):-1}function _n(n,e,t){var u=l.exec(e.slice(t,t+3));return u?(n.m=0,n.d=+u[0],t+u[0].length):-1}function G(n,e,t){var u=l.exec(e.slice(t,t+2));return u?(n.H=+u[0],t+u[0].length):-1}function Kn(n,e,t){var u=l.exec(e.slice(t,t+2));return u?(n.M=+u[0],t+u[0].length):-1}function ne(n,e,t){var u=l.exec(e.slice(t,t+2));return u?(n.S=+u[0],t+u[0].length):-1}function ee(n,e,t){var u=l.exec(e.slice(t,t+3));return u?(n.L=+u[0],t+u[0].length):-1}function te(n,e,t){var u=l.exec(e.slice(t,t+6));return u?(n.L=Math.floor(u[0]/1e3),t+u[0].length):-1}function re(n,e,t){var u=Qn.exec(e.slice(t,t+1));return u?t+u[0].length:-1}function ue(n,e,t){var u=l.exec(e.slice(t));return u?(n.Q=+u[0],t+u[0].length):-1}function ie(n,e,t){var u=l.exec(e.slice(t));return u?(n.s=+u[0],t+u[0].length):-1}function k(n,e){return a(n.getDate(),e,2)}function ce(n,e){return a(n.getHours(),e,2)}function oe(n,e){return a(n.getHours()%12||12,e,2)}function ae(n,e){return a(1+Q.count(M(n),n),e,3)}function z(n,e){return a(n.getMilliseconds(),e,3)}function fe(n,e){return z(n,e)+"000"}function le(n,e){return a(n.getMonth()+1,e,2)}function se(n,e){return a(n.getMinutes(),e,2)}function ge(n,e){return a(n.getSeconds(),e,2)}function he(n){var e=n.getDay();return e===0?7:e}function ye(n,e){return a(Jn.count(M(n)-1,n),e,2)}function E(n){var e=n.getDay();return e>=4||e===0?U(n):U.ceil(n)}function de(n,e){return n=E(n),a(U.count(M(n),n)+(M(n).getDay()===4),e,2)}function me(n){return n.getDay()}function ve(n,e){return a(W.count(M(n)-1,n),e,2)}function Te(n,e){return a(n.getFullYear()%100,e,2)}function De(n,e){return n=E(n),a(n.getFullYear()%100,e,2)}function Ce(n,e){return a(n.getFullYear()%1e4,e,4)}function Me(n,e){var t=n.getDay();return n=t>=4||t===0?U(n):U.ceil(n),a(n.getFullYear()%1e4,e,4)}function Ue(n){var e=n.getTimezoneOffset();return(e>0?"-":(e*=-1,"+"))+a(e/60|0,"0",2)+a(e%60,"0",2)}function R(n,e){return a(n.getUTCDate(),e,2)}function xe(n,e){return a(n.getUTCHours(),e,2)}function we(n,e){return a(n.getUTCHours()%12||12,e,2)}function Se(n,e){return a(1+P.count(x(n),n),e,3)}function _(n,e){return a(n.getUTCMilliseconds(),e,3)}function pe(n,e){return _(n,e)+"000"}function Fe(n,e){return a(n.getUTCMonth()+1,e,2)}function Le(n,e){return a(n.getUTCMinutes(),e,2)}function Ye(n,e){return a(n.getUTCSeconds(),e,2)}function He(n){var e=n.getUTCDay();return e===0?7:e}function Ae(n,e){return a(Pn.count(x(n)-1,n),e,2)}function K(n){var e=n.getUTCDay();return e>=4||e===0?w(n):w.ceil(n)}function Ze(n,e){return n=K(n),a(w.count(x(n),n)+(x(n).getUTCDay()===4),e,2)}function We(n){return n.getUTCDay()}function be(n,e){return a(Z.count(x(n)-1,n),e,2)}function Ve(n,e){return a(n.getUTCFullYear()%100,e,2)}function $e(n,e){return n=K(n),a(n.getUTCFullYear()%100,e,2)}function je(n,e){return a(n.getUTCFullYear()%1e4,e,4)}function qe(n,e){var t=n.getUTCDay();return n=t>=4||t===0?w(n):w.ceil(n),a(n.getUTCFullYear()%1e4,e,4)}function Je(){return"+0000"}function nn(){return"%"}function en(n){return+n}function tn(n){return Math.floor(+n/1e3)}var C,rn,un,$,j;cn({dateTime:"%x, %X",date:"%-m/%-d/%Y",time:"%-I:%M:%S %p",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});function cn(n){return C=X(n),rn=C.format,un=C.parse,$=C.utcFormat,j=C.utcParse,C}var on="%Y-%m-%dT%H:%M:%S.%LZ";function Pe(n){return n.toISOString()}var Qe=Date.prototype.toISOString?Pe:$(on),Xe=Qe;function Ie(n){var e=new Date(n);return isNaN(e)?null:e}var Oe=+new Date("2000-01-01T00:00:00.000Z")?Ie:j(on),Ne=Oe;export{Xe as isoFormat,Ne as isoParse,rn as timeFormat,cn as timeFormatDefaultLocale,X as timeFormatLocale,un as timeParse,$ as utcFormat,j as utcParse};