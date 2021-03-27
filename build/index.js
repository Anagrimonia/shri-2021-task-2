(()=>{var t={319:(t,e,r)=>{var a;void 0===(a=function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e,r,a,n){if(Number(String(t).length)>2&&(t%=100),11==t||12==t||13==t||14==t)return e+n;switch(t%10){case 1:return e+r;case 2:case 3:case 4:return e+a;case 5:case 6:case 7:case 8:case 9:case 0:return e+n}return""}}.apply(e,[r,e]))||(t.exports=a)},341:function(t,e,r){var a,n,i=this&&this.__assign||function(){return(i=Object.assign||function(t){for(var e,r=1,a=arguments.length;r<a;r++)for(var n in e=arguments[r])Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t}).apply(this,arguments)},o=this&&this.__values||function(t){var e="function"==typeof Symbol&&Symbol.iterator,r=e&&t[e],a=0;if(r)return r.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&a>=t.length&&(t=void 0),{value:t&&t[a++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")},u=this&&this.__read||function(t,e){var r="function"==typeof Symbol&&t[Symbol.iterator];if(!r)return t;var a,n,i=r.call(t),o=[];try{for(;(void 0===e||e-- >0)&&!(a=i.next()).done;)o.push(a.value)}catch(t){n={error:t}}finally{try{a&&!a.done&&(r=i.return)&&r.call(i)}finally{if(n)throw n.error}}return o},s=this&&this.__spreadArray||function(t,e){for(var r=0,a=e.length,n=t.length;r<a;r++,n++)t[n]=e[r];return t},l=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};a=[r,e,r(319)],void 0===(n=function(e,r,a){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),a=l(a),t.exports={prepareData:function(t,e){var r,n,l,f,c,m,d=e.sprintId,v={Comment:[],Commit:[],Sprint:[]},p={Summary:new Map,User:new Map},h=void 0,y=void 0,g=new Map,b=new Map;t.map((function(t){switch(t.type){case"Comment":v.Comment.push(t);break;case"Commit":v.Commit.push(t);break;case"Sprint":v.Sprint.push(t);break;case"Summary":p.Summary.set(t.id,t);break;case"User":p.User.set(t.id,t)}})),v.Sprint.sort((function(t,e){return t.startAt-e.startAt})),v.Commit.sort((function(t,e){return t.timestamp-e.timestamp})),v.Comment.sort((function(t,e){return t.createdAt-e.createdAt}));var x=0,S=0,w=v.Commit[x++],_=v.Comment[S++];try{for(var C=o(v.Sprint),A=C.next();!A.done;A=C.next()){var M=A.value;for(M.id===d-1&&(y=M),M.id===d&&(h=M),b.get(M.id)||b.set(M.id,[]),g.get(M.id)||g.set(M.id,[]);w&&w.timestamp<M.startAt;)w=v.Commit[x++];for(;w&&w.timestamp<=M.finishAt;)g.get(M.id).push(w),w=v.Commit[x++];for(;_&&_.createdAt<M.startAt;)_=v.Comment[S++];for(;_&&_.createdAt<=M.finishAt;)b.get(M.id).push(_),_=v.Comment[S++]}}catch(t){r={error:t}}finally{try{A&&!A.done&&(n=C.return)&&n.call(C)}finally{if(r)throw r.error}}var j=h&&(null==g?void 0:g.get(h.id))||[],T=h&&(null==b?void 0:b.get(h.id))||[],U=new Map;try{for(var O=o(j),k=O.next();!k.done;k=O.next()){var D=k.value.author;U.set(D,(U.get(D)||0)+1)}}catch(t){l={error:t}}finally{try{k&&!k.done&&(f=O.return)&&f.call(O)}finally{if(l)throw l.error}}var P=new Map;try{for(var E=o(T),H=E.next();!H.done;H=E.next()){var I=H.value,N=(D=I.author,I.likes);P.set(D,(P.get(D)||0)+N.length)}}catch(t){c={error:t}}finally{try{H&&!H.done&&(m=E.return)&&m.call(E)}finally{if(c)throw c.error}}var q={title:"Больше всего коммитов",subtitle:h?h.name:"",emoji:"👑",users:s([],u(U)).sort((function(t,e){return e[1]-t[1]||t[0]-e[0]})).map((function(t){var e,r=u(t,2),a=r[0],n=r[1],i=p.User.get(a);return{id:a,name:(e="number"==typeof i?p.User.get(i):i)?e.name:"",avatar:e?e.avatar:"",valueText:String(n)}}))},z={title:"Самый 🔎 внимательный разработчик",subtitle:h?h.name:"",emoji:"🔎",users:s([],u(P)).sort((function(t,e){return e[1]-t[1]||t[0]-e[0]})).map((function(t){var e,r=u(t,2),n=r[0],i=r[1],o=p.User.get(n);return{id:n,name:(e="number"==typeof o?p.User.get(o):o)?e.name:"",avatar:e?e.avatar:"",valueText:i+" "+a.default(i,"голос","","а","ов")}}))},B={title:"Коммиты",subtitle:h?h.name:"",values:s([],u(g)).map((function(t,e){var r=u(t,2),a=r[0],n=r[1],o=v.Sprint[e];return i({title:String(a),hint:o?o.name:"",value:n.length},o&&o.id===d&&{active:!0})})),users:q.users},F=y&&(null==g?void 0:g.get(y.id))||[];return[{alias:"leaders",data:q},{alias:"vote",data:z},{alias:"chart",data:B},{alias:"diagram",data:{title:"Размер коммитов",subtitle:h?h.name:"",totalText:h?String(j.length)+" "+a.default(j.length,"коммит","","а","ов"):"",differenceText:(h&&y?String(j.length-F.length):"?")+" с прошлого спринта",categories:function(){for(var t=function(t){var e=[0,0,0,0];return t.map((function(t){var r=t.summaries,a=0;r.map((function(t){var e;e="number"==typeof t?p.Summary.get(t):t,a+=e?e.added+e.removed:0})),e[function(t){return t>500?t>1e3?0:1:t>100?2:3}(a)]+=1})),e},e=t(j),r=t(F),n=["> 1001 строки","501 — 1000 строк","101 — 500 строк","1 — 100 строк"],i=[],o=0;o<4;o++){var u=e[o]||0,s=r[o]||0;i.push({title:n[o],valueText:String(u)+" "+a.default(u,"коммит","","а","ов"),differenceText:String(u-s)+" "+a.default(Math.abs(u-s),"коммит","","а","ов")})}return i}()}},{alias:"activity",data:{title:"Коммиты",subtitle:h?h.name:"",data:function(){for(var t,e=[[],[],[],[],[],[],[]],r=0;r<7;r++)for(var a=0;a<24;a++)null===(t=e[r])||void 0===t||t.push(0);return j.map((function(t,r){var a=t.timestamp,n=new Date(a);e[n.getDay()][n.getHours()]+=1})),{sun:e[0],mon:e[1],tue:e[2],wed:e[3],thu:e[4],fri:e[5],sat:e[6]}}()}}]}}}.apply(e,a))||(t.exports=n)}},e={};!function r(a){var n=e[a];if(void 0!==n)return n.exports;var i=e[a]={exports:{}};return t[a].call(i.exports,i,i.exports,r),i.exports}(341)})();