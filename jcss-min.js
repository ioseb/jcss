(function(){var a=function(h,e){if(typeof e=="string"){e=a(e)}else{e=e||document}if(e.nodeType&&e.nodeType!==1&&e.nodeType!==9){return[]}h=h.replace(/^\s*|\s*$/g,"");var w=function(j,y){if(j.indexOf){return j.indexOf(y)}else{for(var x=0,z;z=j[x++];){if(z===y){return x-1}}}return -1};function m(x,j){return x.contains?x!==j&&x.contains(j):!!(x.compareDocumentPosition(j)&16)}var g=function(){var x=function(C,A){for(var z=0,y=[],B;B=C[z++];){if(A.call(B)){y.push(B)}}return y};var j=function(z,y){return x(z,function(){return this.type===y})};return{":only-child":function(D){for(var A=0,z=[],y=[],C;C=D[A++];){for(var E=C.parentNode.firstChild,B=true;E;E=E.nextSibling){if(B=(E.nodeType==1&&E!==C)){break}}if(!B){z.push(C)}}return z},":last-child":function(C){for(var z=0,y=[],B;B=C[z++];){for(var D=B.nextSibling,A=D;D;D=D.nextSibling){if(A=(D.nodeType==1)){break}}if(!A){y.push(B)}}return y},":first-child":function(C){for(var z=0,y=[],B;B=C[z++];){for(var D=B.previousSibling,A=D;D;D=D.previousSibling){if(A=(D.nodeType==1)){break}}if(!A){y.push(B)}}return y},":nth-child":function(G,J){function A(Q,O,L){var M=0,S=[],T=[],N;while(N=Q[M]){for(var P=0,R=L.length;P<R;P++){if(N===L[P]){T.push(N);L.splice(0,P);break}}M+=O}return T}J=J.replace(/\s+/g,"").replace("odd","2n+1").replace("even","2n+2").replace(/^(\d+)n$/,"$1n+$1").replace(/^0n\+(\d+)$/,"$1").replace(/^(\d+)n\-(\1)$/,"$1n+$1").replace(/^(1)?n(\+0)?$/,"n");if(J=="n"){return G}var I=[],C={};for(var E=0,F,K,D;D=G[E++];){if((F=w(I,(K=D.parentNode)))==-1){F=I.push(K)-1}if(!C[F]){C[F]=[]}C[F].push(D)}var y=[],z=0,H=0;if(/(\d+)n(\+|-)(\d+)/.test(J)){z=parseInt(RegExp.$3);H=parseInt(RegExp.$1);if(RegExp.$2=="+"){z=z>0?z-1:H-1}else{if(RegExp.$2=="-"){z=H-z-1}}}if(H>0){for(var E in C){for(var D=I[E].firstChild,B=[];D;D=D.nextSibling){if(D.nodeType==1){B.push(D)}}Array.prototype.push.apply(y,A(B.slice(z),H,C[E]))}return y}if(!isNaN(J)){var y=[],J=parseInt(J)-1;for(var E in C){if(C[E][J]){y.push(C[E][J])}}return y}return[]},":nth":function(z,y){return this[":eq"](z,y)},":first":function(y){return y.length?[y[0]]:[]},":last":function(y){return y.length?[y[y.length-1]]:[]},":even":function(B){for(var z=0,y=[],A;A=B[z];z+=2){y.push(A)}return y},":odd":function(B){for(var z=1,y=[],A;A=B[z];z+=2){y.push(A)}return y},":not":function(B,A){var C=A.split(/\s*,\s*/);for(var z=0,y;y=C[z++];){B=o(y.replace(/\.(.+)/,"[class~=$1]").replace(/#(.+)/,"[id=$1]")).not(B)}return B},":selected":function(z,y){return x(z,function(){this.parentNode.selectedIndex;return this.selected==true})},":checked":function(z,y){return x(z,function(){return this.checked===true})},":empty":function(z,y){return z},":disabled":function(z,y){return x(z,function(){return this.disabled==true})},":enabled":function(z,y){return x(z,function(){return this.disabled==false})},":visible":function(z,y){return x(z,function(){return(this.offsetWidth|this.offsetHeight)>0})},":hidden":function(z,y){return x(z,function(){return this.offsetWidth==0||this.offsetHeight==0})},":contains":function(z,y){return x(z,function(){return(this.innerText||this.textContent||"").indexOf(y)>-1})},":header":function(z,y){return x(z,function(){return/h[1-6]/i.test(this.nodeName)})},":eq":function(z,y){return !isNaN(y)&&z[y]?[z[y]]:[]},":gt":function(C,B){var y=[];if(!isNaN(B)&&C.length>B){for(var z=parseInt(B)+1,A;A=C[z++];){y.push(A)}}return y},":lt":function(C,B){var y=[];if(!isNaN(B)&&C.length>=B){for(var z=0,A;z<B&&(A=C[z++]);){y.push(A)}}return y},":has":function(z,y){return x(z,function(){return a(y,this).length>0})},":input":function(y){return x(y,function(){return/^input|button|textarea|select$/i.test(this.nodeName)})},":radio":function(y){return j(y,"radio")},":checkbox":function(y){return j(y,"checkbox")},":text":function(y){return j(y,"text")},":image":function(y){return j(y,"image")},":submit":function(y){return j(y,"submit")},":lang":function(z,y){return x(z,function(){return(this.getAttribute("lang")||this.lang)==y})},":root":function(y){return x(y,function(){return this.nodeName=="HTML"})}}}();var s=function(){var j=function(z,y){return z.getAttribute(y,2)||z[x(y)]||""};var x=function(y){return{"class":"className","for":"htmlFor"}[y]||y};return{"=":function(y,z){return function(){return z?j(this,y)===z:!j(this,y)}},"*=":function(y,z){return function(){return j(this,y).indexOf(z)>-1}},"!=":function(y,z){return function(){return z?j(this,y)!==z:!!j(this,y)}},"^=":function(y,z){return function(){return j(this,y).indexOf(z)==0}},"$=":function(y,z){return function(){var A=j(this,y);return A.substr(A.length-z.length)===z}},"~=":function(y,z){return function(){return new RegExp("(^|\\s)"+z+"(\\s|$)").test(j(this,y))}},"|=":function(y,z){return function(){return new RegExp("(^|-)"+z+"(-|$)").test(j(this,y))}},"":function(y,z){return function(){return !!j(this,y)}}}}();function o(P,z){var G=P,F=/^(>|~|<|\+|)(\w+|\*)?(?:(#|\.)(.+))?(.*)/,D=/(?:\[\w+(?:(?:(?:!|\*|\^|\$|~|\||)=.*))?\])+$/,B=/(\:[-\w]+)(?:\((.*?)\))?$/,j=F.exec(G),G=(j[4]||"")+(j[5]||"");var E=j[1]||"",Q=(j[2]||"*").toUpperCase(),L=j[3]=="#",J=null,M=j[3]==".",y=null,I=[],C=[];while(j=D.exec(G)){G=RegExp.leftContext||"";var A=/\[\s*(\w+)\s*(?:(!|\*|\^|\$|~|\||)(=)\s*(.*?\]?))?\s*\]/,N=j[0];while(j=A.exec(N)){N=RegExp.rightContext;if(j.length==5){var H=(j[2]||"")+(j[3]||"");if(H!==null&&(H=s[H])){I.push(H(j[1],j[4]||""))}}}}var O=[];while(j=B.exec(G)){G=RegExp.leftContext||"";if(j.length==3){if(!g[j[1]]){O.push(j[1])}else{C.push(j)}}}if(L){J=G.replace(/\\/g,"")+O.join("")}if(M){y=G+O.join("")}function K(S){var R=I.length;if(R>0){while(R--){if(!I[R].call(S)){return false}}}return true}var x=function(U){var W,S=[];if(L){if(W=document.getElementById(J)){if(document.all&&W.attributes.id.value!=J){for(var T=0,Y=false,X;X=document.all[J][T++];){if(Y=(X.attributes.id.value==J)){W=X;break}}W=Y?W:null}if(W&&(Q=="*"||Q==W.nodeName)&&(U!==document&&U!==W?m(U,W):true)){S.push(W)}}}else{if(!E||E==">"){if(M&&!window.opera&&!/^\w+\.\w+$/.test(y)&&!/[^-\w\.\:\\\[\]]/.test(y)&&!/[A-Z]/.test(y)&&document.getElementsByClassName&&document.documentElement.getElementsByClassName){for(var T=0,R=U.getElementsByClassName(y.replace(/\\/g,"").toLowerCase()),X;X=R[T++];){if(Q=="*"||X.nodeName==Q&&K(X)){S.push(X)}}}else{if(M){I.push(s["~="]("class",y))}var V=Q==="*";for(var T=0,R=U.getElementsByTagName(Q),X;X=R[T++];){if(V){if(M){if(X.className&&K(X)){S.push(X)}}else{if(X.nodeType==1&&K(X)){S.push(X)}}}else{if(K(X)){S.push(X)}}}}}}return S};return{name:Q,relation:E,pseudo:function(U){if(C.length){C=C.reverse();var S=[];for(var T=0,R;R=C[T++];){S.push(R)}for(var T=0,R;R=S[T++];){U=g[""+R[1]](U,""+R[2]||null)}}return U},atts:function(S){var R=I.length;if(R>0){while(R--){if(!I[R].call(S)){return false}}}return true},not:function(W){for(var U=0,T=[],V;V=W[U++];){if(Q=="*"&&(!I.length||!this.atts(V))){T.push(V)}else{if(Q!="*"&&I.length&&V.nodeName==Q&&!this.atts(V)){T.push(V)}else{if(Q!="*"&&!I.length&&V.nodeName!=Q){T.push(V)}else{if(Q!="*"&&V.nodeName!=Q){T.push(V)}}}}}var S=this.pseudo(T);if(C.length){for(var U=0,R,V;V=S[U++];){if((R=w(T,V))>-1){T.splice(R,1)}}}return T},filter:function(U){for(var S=0,R=[],T;T=U[S++];){if(Q=="*"&&(this.atts(T))){R.push(T)}else{if(T.nodeName==Q&&this.atts(T)){R.push(T)}else{if(T.nodeName==Q){R.push(T)}}}}return this.pseudo(R)},elements:function(U,Y){var V,R=[],Y=Y||0;if(L&&Y==0){R=x(U)}else{if(!E){R=x(U)}else{if(E==">"){for(var T=0,S=x(U),W;W=S[T++];){if(W.parentNode===U){R.push(W)}}}else{if(E=="+"){for(var X=U.nextSibling;X;X=X.nextSibling){if(X.nodeType==1){if(X.nodeName==Q&&this.atts(X)){R.push(X)}break}}}else{if(E=="~"){for(var X=U.nextSibling;X;X=X.nextSibling){if(X.nodeType==1){if(X.nodeName==Q&&this.atts(X)){R.push(X)}}}}}}}}return R}}}var t=function(y){y=y.replace(new RegExp("&gt;","g"),">").replace(/[\'\"]/g,"").replace(/((\[)\s*|\s*(\]))/g,"$2$3").replace(/\s*(=|\$|\^|!|\*=)\s*/g,"$1").replace(/table\s+tr\s+td/g,"td").replace(/tr\s+td/g,"td");var z=[];while(y!=(y=y.replace(/\([^\(\)]*\)/g,function(A){return"#__"+(z.push(A.replace(/\s*,\s*/g,","))-1)}))){}y=y.replace(/\s*,\s*/g,":::").replace(/\s+/g,"@@@").replace(/@*(>|~|\+)@*([^\d=])/g,"@@@$1$2");for(var x=z.length-1,j;j=z[x--];){y=y.replace(new RegExp("#__"+(x+1),"g"),j)}return y},f=function(z){for(var y=0,x=t(z).split(":::"),j=[];y<x.length;y++){if(w(j,x[y])==-1){j.push(x[y].replace(/^@+/,""))}}return j},d=false,c=function(j){if(d){for(var x=1;x<j.length;x++){if(j[x]===j[x-1]){j.splice(x--,1)}}d=false}return j},k=function(y,j){if(y===j){d=true;return 0}if(y.compareDocumentPosition){return y.compareDocumentPosition(j)&2?1:-1}if("sourceIndex" in y){return y.sourceIndex-j.sourceIndex}var A=y.ownerDocument,z=A.createRange(),x=A.createRange();z.selectNode(y);z.collapse(true);x.selectNode(j);x.collapse(true);return z.compareBoundaryPoints(Range.START_TO_END,x)},q=function(I){var L=I;var E=f(I);for(var D=0,I;I=E[D++];){var H,C=e&&e.length?e:[e];H=I.split("@@@");if(H.length==1&&H[0]=="body"){return[document.body]}if(H[1]&&H[0]=="body"){H.shift()}for(var B=0,z;z=H[B++];){var M=[],G=o(z,L),F;for(var A=0,K;K=C[A++];){Array.prototype.push.apply(M,G.elements(K,B-1))}if(M.length>1&&H.length>1&&B<H.length){if(H[B]){if(!(F=o(H[B])).relation){for(var A=1;A<M.length;A++){if(m(M[A-1],M[A])){M.splice(A--,1)}}}else{if(F.relation=="~"){var y,K,x=[],J=[];for(var D=0;y=M[D++];){if(w(J,(K=y.parentNode))==-1){J.push(K);x.push(y)}}M=x}}}}C=G.pseudo(M.slice())}Array.prototype.push.apply(n,C)}if(E.length>1||e.length>1){n.sort(k);n=c(n)}return n};var n=[];if(document.querySelectorAll&&!/\bparam\b/.test(h)){try{var l=e.length?e:[e];for(var u=0,b;b=l[u++];){var p=b.querySelectorAll(h);try{p=Array.prototype.slice.call(p);Array.prototype.push.apply(n,p)}catch(v){for(i=0,len=p.length;i<len;){n.push(p[i++])}}}if(l.length>1){n.sort(k);n=c(n)}}catch(r){n=q(h)}}else{n=q(h)}return n};window.jCSS=a})();