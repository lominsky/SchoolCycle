(function(){var aa=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}},g="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(a==Array.prototype||a==Object.prototype)return a;a[b]=c.value;return a},ea=function(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var b=0;b<a.length;++b){var c=a[b];if(c&&c.Math==Math)return c}throw Error("Cannot find global object");
},fa=ea(this),h=function(a,b){if(b)a:{var c=fa;a=a.split(".");for(var d=0;d<a.length-1;d++){var e=a[d];if(!(e in c))break a;c=c[e]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&g(c,a,{configurable:!0,writable:!0,value:b})}};
h("Symbol",function(a){if(a)return a;var b=function(f,k){this.B=f;g(this,"description",{configurable:!0,writable:!0,value:k})};b.prototype.toString=function(){return this.B};var c="jscomp_symbol_"+(1E9*Math.random()>>>0)+"_",d=0,e=function(f){if(this instanceof e)throw new TypeError("Symbol is not a constructor");return new b(c+(f||"")+"_"+d++,f)};return e});
h("Symbol.iterator",function(a){if(a)return a;a=Symbol("Symbol.iterator");for(var b="Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "),c=0;c<b.length;c++){var d=fa[b[c]];"function"===typeof d&&"function"!=typeof d.prototype[a]&&g(d.prototype,a,{configurable:!0,writable:!0,value:function(){return ha(aa(this))}})}return a});
var ha=function(a){a={next:a};a[Symbol.iterator]=function(){return this};return a},ia=function(a,b,c){if(null==a)throw new TypeError("The 'this' value for String.prototype."+c+" must not be null or undefined");if(b instanceof RegExp)throw new TypeError("First argument to String.prototype."+c+" must not be a regular expression");return a+""};
h("String.prototype.endsWith",function(a){return a?a:function(b,c){var d=ia(this,b,"endsWith");b+="";void 0===c&&(c=d.length);c=Math.max(0,Math.min(c|0,d.length));for(var e=b.length;0<e&&0<c;)if(d[--c]!=b[--e])return!1;return 0>=e}});var ja=function(a,b){a instanceof String&&(a+="");var c=0,d=!1,e={next:function(){if(!d&&c<a.length){var f=c++;return{value:b(f,a[f]),done:!1}}d=!0;return{done:!0,value:void 0}}};e[Symbol.iterator]=function(){return e};return e};
h("Array.prototype.entries",function(a){return a?a:function(){return ja(this,function(b,c){return[b,c]})}});h("Object.is",function(a){return a?a:function(b,c){return b===c?0!==b||1/b===1/c:b!==b&&c!==c}});h("Array.prototype.includes",function(a){return a?a:function(b,c){var d=this;d instanceof String&&(d=String(d));var e=d.length;c=c||0;for(0>c&&(c=Math.max(c+e,0));c<e;c++){var f=d[c];if(f===b||Object.is(f,b))return!0}return!1}});
h("String.prototype.includes",function(a){return a?a:function(b,c){return-1!==ia(this,b,"includes").indexOf(b,c||0)}});window.gapi=window.gapi||{};window.gapi.K=(new Date).getTime();/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var n=this||self,p="closure_uid_"+(1E9*Math.random()>>>0),ka=0,la=function(a,b){function c(){}c.prototype=b.prototype;a.M=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.L=function(d,e,f){for(var k=Array(arguments.length-2),m=2;m<arguments.length;m++)k[m-2]=arguments[m];return b.prototype[e].apply(d,k)}},t=function(a){return a};function w(a,b){if(Error.captureStackTrace)Error.captureStackTrace(this,w);else{var c=Error().stack;c&&(this.stack=c)}a&&(this.message=String(a));void 0!==b&&(this.cause=b)}la(w,Error);w.prototype.name="CustomError";function y(a,b){a=a.split("%s");for(var c="",d=a.length-1,e=0;e<d;e++)c+=a[e]+(e<b.length?b[e]:"%s");w.call(this,c+a[d])}la(y,w);y.prototype.name="AssertionError";var ma=function(a,b){throw new y("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};var z=function(a){if(na!==na)throw Error("SafeUrl is not meant to be built directly");this.J=a};z.prototype.toString=function(){return this.J.toString()};var na={};new z("about:invalid#zClosurez");new z("about:blank");var oa={},pa=function(){if(oa!==oa)throw Error("SafeStyle is not meant to be built directly");this.H=""};pa.prototype.toString=function(){return this.H.toString()};new pa;var qa={},ra=function(){if(qa!==qa)throw Error("SafeStyleSheet is not meant to be built directly");this.G=""};ra.prototype.toString=function(){return this.G.toString()};new ra;var sa={},ta=function(){var a=n.trustedTypes&&n.trustedTypes.emptyHTML||"";if(sa!==sa)throw Error("SafeHtml is not meant to be built directly");this.F=a};ta.prototype.toString=function(){return this.F.toString()};new ta;var B=function(a,b){this.name=a;this.value=b};B.prototype.toString=function(){return this.name};var C=new B("OFF",Infinity),ua=new B("WARNING",900),va=new B("CONFIG",700),wa=function(){this.g=0;this.clear()},D;wa.prototype.clear=function(){this.l=Array(this.g);this.o=-1;this.s=!1};var G=function(a,b,c){this.reset(a||C,b,c,void 0,void 0)};G.prototype.reset=function(){};
var xa=function(a,b){this.level=null;this.C=[];this.parent=(void 0===b?null:b)||null;this.children=[];this.D={i:function(){return a}}},ya=function(a){if(a.level)return a.level;if(a.parent)return ya(a.parent);ma("Root logger has no level set.");return C},za=function(a,b){for(;a;)a.C.forEach(function(c){c(b)}),a=a.parent},Aa=function(){this.entries={};var a=new xa("");a.level=va;this.entries[""]=a},H,I=function(a,b){var c=a.entries[b];if(c)return c;c=I(a,b.slice(0,Math.max(b.lastIndexOf("."),0)));var d=
new xa(b,c);a.entries[b]=d;c.children.push(d);return d},J=function(){H||(H=new Aa);return H};/*

 SPDX-License-Identifier: Apache-2.0
*/
var Ba=[],Ca=function(a){var b;if(b=I(J(),"safevalues").D){var c="A URL with content '"+a+"' was sanitized away.",d=ua;if(a=b)if(a=b&&d){a=d.value;var e=b?ya(I(J(),b.i())):C;a=a>=e.value}if(a){d=d||C;a=I(J(),b.i());"function"===typeof c&&(c=c());D||(D=new wa);e=D;b=b.i();if(0<e.g){var f=(e.o+1)%e.g;e.o=f;e.s?(e=e.l[f],e.reset(d,c,b),b=e):(e.s=f==e.g-1,b=e.l[f]=new G(d,c,b))}else b=new G(d,c,b);za(a,b)}}};-1===Ba.indexOf(Ca)&&Ba.push(Ca);/*
 gapi.loader.OBJECT_CREATE_TEST_OVERRIDE &&*/
var K=window,L=document,Da=K.location,Ea=function(){},Fa=/\[native code\]/,M=function(a,b,c){return a[b]=a[b]||c},Ga=function(a){a=a.sort();for(var b=[],c=void 0,d=0;d<a.length;d++){var e=a[d];e!=c&&b.push(e);c=e}return b},N=function(){var a;if((a=Object.create)&&Fa.test(a))a=a(null);else{a={};for(var b in a)a[b]=void 0}return a},Q=M(K,"gapi",{});var R={};R=M(K,"___jsl",N());M(R,"I",0);M(R,"hel",10);var Ia=function(){var a=Da.href;if(R.dpo)var b=R.h;else{b=R.h;var c=RegExp("([#].*&|[#])jsh=([^&#]*)","g"),d=RegExp("([?#].*&|[?#])jsh=([^&#]*)","g");if(a=a&&(c.exec(a)||d.exec(a)))try{b=decodeURIComponent(a[2])}catch(e){}}return b},Ja=function(a){var b=M(R,"PQ",[]);R.PQ=[];var c=b.length;if(0===c)a();else for(var d=0,e=function(){++d===c&&a()},f=0;f<c;f++)b[f](e)},S=function(a){return M(M(R,"H",N()),a,N())};var T=M(R,"perf",N()),Ka=M(T,"g",N()),La=M(T,"i",N());M(T,"r",[]);N();N();var Ma=function(a,b,c){var d=T.r;"function"===typeof d?d(a,b,c):d.push([a,b,c])},U=function(a,b,c){b&&0<b.length&&(b=Na(b),c&&0<c.length&&(b+="___"+Na(c)),28<b.length&&(b=b.substr(0,28)+(b.length-28)),c=b,b=M(La,"_p",N()),M(b,c,N())[a]=(new Date).getTime(),Ma(a,"_p",c))},Na=function(a){return a.join("__").replace(/\./g,"_").replace(/\-/g,"_").replace(/,/g,"_")};var Oa=N(),V=[],W=function(a){throw Error("Bad hint: "+a);};V.push(["jsl",function(a){for(var b in a)if(Object.prototype.hasOwnProperty.call(a,b)){var c=a[b];"object"==typeof c?R[b]=M(R,b,[]).concat(c):M(R,b,c)}if(b=a.u)a=M(R,"us",[]),a.push(b),(b=/^https:(.*)$/.exec(b))&&a.push("http:"+b[1])}]);var Pa=/^(\/[a-zA-Z0-9_\-]+)+$/,Qa=[/\/amp\//,/\/amp$/,/^\/amp$/],Ra=/^[a-zA-Z0-9\-_\.,!]+$/,Sa=/^gapi\.loaded_[0-9]+$/,Ta=/^[a-zA-Z0-9,._-]+$/,Xa=function(a,b,c,d,e){var f=a.split(";"),k=f.shift(),m=Oa[k],l=null;m?l=m(f,b,c,d):W("no hint processor for: "+k);l||W("failed to generate load url");b=l;c=b.match(Ua);(d=b.match(Va))&&1===d.length&&Wa.test(b)&&c&&1===c.length||W("failed sanity: "+a);try{a="?";if(e&&0<e.length){c=b=0;for(d={};c<e.length;){var q=e[c++];f=void 0;k=typeof q;f="object"==k&&null!=
q||"function"==k?"o"+(Object.prototype.hasOwnProperty.call(q,p)&&q[p]||(q[p]=++ka)):(typeof q).charAt(0)+q;Object.prototype.hasOwnProperty.call(d,f)||(d[f]=!0,e[b++]=q)}e.length=b;l=l+"?le="+e.join(",");a="&"}if(R.rol){var A=R.ol;A&&A.length&&(l=""+l+a+"ol="+A.length)}}catch(ba){}return l},$a=function(a,b,c,d){a=Ya(a);Sa.test(c)||W("invalid_callback");b=Za(b);d=d&&d.length?Za(d):null;var e=function(f){return encodeURIComponent(f).replace(/%2C/g,",")};return[encodeURIComponent(a.pathPrefix).replace(/%2C/g,
",").replace(/%2F/g,"/"),"/k=",e(a.version),"/m=",e(b),d?"/exm="+e(d):"","/rt=j/sv=1/d=1/ed=1",a.j?"/am="+e(a.j):"",a.v?"/rs="+e(a.v):"",a.A?"/t="+e(a.A):"","/cb=",e(c)].join("")},Ya=function(a){"/"!==a.charAt(0)&&W("relative path");for(var b=a.substring(1).split("/"),c=[];b.length;){a=b.shift();if(!a.length||0==a.indexOf("."))W("empty/relative directory");else if(0<a.indexOf("=")){b.unshift(a);break}c.push(a)}a={};for(var d=0,e=b.length;d<e;++d){var f=b[d].split("="),k=decodeURIComponent(f[0]),m=
decodeURIComponent(f[1]);2==f.length&&k&&m&&(a[k]=a[k]||m)}b="/"+c.join("/");Pa.test(b)||W("invalid_prefix");c=0;for(d=Qa.length;c<d;++c)Qa[c].test(b)&&W("invalid_prefix");c=X(a,"k",!0);d=X(a,"am");e=X(a,"rs");a=X(a,"t");return{pathPrefix:b,version:c,j:d,v:e,A:a}},Za=function(a){for(var b=[],c=0,d=a.length;c<d;++c){var e=a[c].replace(/\./g,"_").replace(/-/g,"_");Ta.test(e)&&b.push(e)}return b.join(",")},X=function(a,b,c){a=a[b];!a&&c&&W("missing: "+b);if(a){if(Ra.test(a))return a;W("invalid: "+b)}return null},
Wa=/^https?:\/\/[a-z0-9_.-]+\.google(rs)?\.com(:\d+)?\/[a-zA-Z0-9_.,!=\-\/]+$/,Va=/\/cb=/g,Ua=/\/\//g;Oa.m=function(a,b,c,d){(a=a[0])||W("missing_hint");return"https://apis.google.com"+$a(a,b,c,d)};var Y=decodeURI("%73cript"),ab=/^[-+_0-9\/A-Za-z]+={0,2}$/,bb=function(a,b){for(var c=[],d=0;d<a.length;++d){var e=a[d],f;if(f=e){a:{for(f=0;f<b.length;f++)if(b[f]===e)break a;f=-1}f=0>f}f&&c.push(e)}return c},cb=function(){var a=R.nonce;return void 0!==a?a&&a===String(a)&&a.match(ab)?a:R.nonce=null:L.querySelector?(a=L.querySelector("script[nonce]"))?(a=a.nonce||a.getAttribute("nonce")||"",a&&a===String(a)&&a.match(ab)?R.nonce=a:R.nonce=null):null:null},eb=function(a){if("loading"!=L.readyState)db(a);
else{var b=cb(),c="";null!==b&&(c=' nonce="'+b+'"');a="<"+Y+' src="'+encodeURI(a)+'"'+c+"></"+Y+">";L.write(Z?Z.createHTML(a):a)}},db=function(a){var b=L.createElement(Y);b.setAttribute("src",Z?Z.createScriptURL(a):a);a=cb();null!==a&&b.setAttribute("nonce",a);b.async="true";(a=L.getElementsByTagName(Y)[0])?a.parentNode.insertBefore(b,a):(L.head||L.body||L.documentElement).appendChild(b)},gb=function(a,b,c){fb(function(){var d=b===Ia()?M(Q,"_",N()):N();d=M(S(b),"_",d);a(d)},c)},ib=function(a,b){var c=
b||{};"function"==typeof b&&(c={},c.callback=b);var d=(b=c)&&b._c;if(d)for(var e=0;e<V.length;e++){var f=V[e][0],k=V[e][1];k&&Object.prototype.hasOwnProperty.call(d,f)&&k(d[f],a,b)}b=[];a?b=a.split(":"):c.features&&(b=c.features);if(!(a=c.h)&&(a=Ia(),!a))throw Error("Bad hint: !hint");hb(b||[],c,a)},hb=function(a,b,c){var d=!!R.glrp;a=Ga(a)||[];var e=b.callback,f=b.config,k=b.timeout,m=b.ontimeout,l=b.onerror,q=void 0;"function"==typeof l&&(q=l);var A=null,ba=!1;if(k&&!m||!k&&m)throw"Timeout requires both the timeout parameter and ontimeout parameter to be set";
l=M(S(c),"r",[]).sort();var ca=M(S(c),"L",[]).sort(),nb=R.le||[],O=[].concat(l),Ha=function(x,E){if(ba)return 0;K.clearTimeout(A);ca.push.apply(ca,r);var F=((Q||{}).config||{}).update;F?F(f):f&&M(R,"cu",[]).push(f);if(E){U("me0",x,O);try{gb(E,c,q)}finally{U("me1",x,O)}}return 1};0<k&&(A=K.setTimeout(function(){ba=!0;m()},k));var r=bb(a,ca);if(r.length){r=bb(a,l);var u=M(R,"CP",[]),v=u.length;u[v]=function(x){if(!x)return 0;U("ml1",r,O);var E=function(P){d||(u[v]=null);Ha(r,x)&&(d&&(u[v]=null),Ja(function(){e&&
e();P()}))},F=function(){var P=u[v+1];P&&P()};0<v&&u[v-1]?u[v]=function(){E(F)}:E(F)};if(r.length){var da="loaded_"+R.I++;Q[da]=function(x){u[v](x);Q[da]=null};a=Xa(c,r,"gapi."+da,l,nb);l.push.apply(l,r);U("ml0",r,O);b.sync||K.___gapisync?eb(a):db(a)}else u[v](Ea)}else Ha(r)&&e&&e()},jb;var kb=null,lb=n.trustedTypes;if(lb&&lb.createPolicy)try{kb=lb.createPolicy("gapi#gapi",{createHTML:t,createScript:t,createScriptURL:t})}catch(a){n.console&&n.console.error(a.message)}jb=kb;var Z=jb;var fb=function(a,b){if(R.hee&&0<R.hel)try{return a()}catch(c){b&&b(c),R.hel--,ib("debug_error",function(){try{window.___jsl.hefn(c)}catch(d){throw c;}})}else try{return a()}catch(c){throw b&&b(c),c;}};var mb=Q.load;mb&&M(R,"ol",[]).push(mb);Q.load=function(a,b){return fb(function(){return ib(a,b)})};V.unshift(["url",function(a,b,c){!a||b&&""!==b||!a.endsWith(".js")||(a=a.substring(0,a.length-3),b=a.lastIndexOf("/")+1,b>=a.length||(a=a.substr(b).split(":").filter(function(d){return!["api","platform"].includes(d)}),c.features=a))}]);Ka.bs0=window.gapi._bs||(new Date).getTime();Ma("bs0");Ka.bs1=(new Date).getTime();Ma("bs1");delete window.gapi._bs;window.gapi.load("",{callback:window["gapi_onload"],_c:{url:"https://apis.google.com/js/api.js",jsl:{ci:{"oauth-flow":{authUrl:"https://accounts.google.com/o/oauth2/auth",proxyUrl:"https://accounts.google.com/o/oauth2/postmessageRelay",disableOpt:!0,idpIframeUrl:"https://accounts.google.com/o/oauth2/iframe",usegapi:!1},debug:{reportExceptionRate:1,forceIm:!1,rethrowException:!0,host:"https://apis.google.com"},enableMultilogin:!0,"googleapis.config":{auth:{useFirstPartyAuthV2:!0},root:"https://content.googleapis.com","root-1p":"https://clients6.google.com"},inline:{css:1},
disableRealtimeCallback:!1,drive_share:{skipInitCommand:!0},csi:{rate:.01},client:{cors:!1},signInDeprecation:{rate:0},include_granted_scopes:!0,llang:"en",iframes:{youtube:{params:{location:["search","hash"]},url:":socialhost:/:session_prefix:_/widget/render/youtube?usegapi=1",methods:["scroll","openwindow"]},ytsubscribe:{url:"https://www.youtube.com/subscribe_embed?usegapi=1"},plus_circle:{params:{url:""},url:":socialhost:/:session_prefix::se:_/widget/plus/circle?usegapi=1"},plus_share:{params:{url:""},
url:":socialhost:/:session_prefix::se:_/+1/sharebutton?plusShare=true&usegapi=1"},rbr_s:{params:{url:""},url:":socialhost:/:session_prefix::se:_/widget/render/recobarsimplescroller"},":source:":"3p",playemm:{url:"https://play.google.com/work/embedded/search?usegapi=1&usegapi=1"},savetoandroidpay:{url:"https://pay.google.com/gp/v/widget/save"},blogger:{params:{location:["search","hash"]},url:":socialhost:/:session_prefix:_/widget/render/blogger?usegapi=1",methods:["scroll","openwindow"]},evwidget:{params:{url:""},
url:":socialhost:/:session_prefix:_/events/widget?usegapi=1"},partnersbadge:{url:"https://www.gstatic.com/partners/badge/templates/badge.html?usegapi=1"},dataconnector:{url:"https://dataconnector.corp.google.com/:session_prefix:ui/widgetview?usegapi=1"},surveyoptin:{url:"https://www.google.com/shopping/customerreviews/optin?usegapi=1"},":socialhost:":"https://apis.google.com",shortlists:{url:""},hangout:{url:"https://talkgadget.google.com/:session_prefix:talkgadget/_/widget"},plus_followers:{params:{url:""},
url:":socialhost:/_/im/_/widget/render/plus/followers?usegapi=1"},post:{params:{url:""},url:":socialhost:/:session_prefix::im_prefix:_/widget/render/post?usegapi=1"},signin:{params:{url:""},url:":socialhost:/:session_prefix:_/widget/render/signin?usegapi=1",methods:["onauth"]},rbr_i:{params:{url:""},url:":socialhost:/:session_prefix::se:_/widget/render/recobarinvitation"},share:{url:":socialhost:/:session_prefix::im_prefix:_/widget/render/share?usegapi=1"},plusone:{params:{count:"",size:"",url:""},
url:":socialhost:/:session_prefix::se:_/+1/fastbutton?usegapi=1"},comments:{params:{location:["search","hash"]},url:":socialhost:/:session_prefix:_/widget/render/comments?usegapi=1",methods:["scroll","openwindow"]},":im_socialhost:":"https://plus.googleapis.com",backdrop:{url:"https://clients3.google.com/cast/chromecast/home/widget/backdrop?usegapi=1"},visibility:{params:{url:""},url:":socialhost:/:session_prefix:_/widget/render/visibility?usegapi=1"},autocomplete:{params:{url:""},url:":socialhost:/:session_prefix:_/widget/render/autocomplete"},
":signuphost:":"https://plus.google.com",ratingbadge:{url:"https://www.google.com/shopping/customerreviews/badge?usegapi=1"},appcirclepicker:{url:":socialhost:/:session_prefix:_/widget/render/appcirclepicker"},follow:{url:":socialhost:/:session_prefix:_/widget/render/follow?usegapi=1"},community:{url:":ctx_socialhost:/:session_prefix::im_prefix:_/widget/render/community?usegapi=1"},sharetoclassroom:{url:"https://classroom.google.com/sharewidget?usegapi=1"},ytshare:{params:{url:""},url:":socialhost:/:session_prefix:_/widget/render/ytshare?usegapi=1"},
plus:{url:":socialhost:/:session_prefix:_/widget/render/badge?usegapi=1"},family_creation:{params:{url:""},url:"https://families.google.com/webcreation?usegapi=1&usegapi=1"},commentcount:{url:":socialhost:/:session_prefix:_/widget/render/commentcount?usegapi=1"},configurator:{url:":socialhost:/:session_prefix:_/plusbuttonconfigurator?usegapi=1"},zoomableimage:{url:"https://ssl.gstatic.com/microscope/embed/"},appfinder:{url:"https://workspace.google.com/:session_prefix:marketplace/appfinder?usegapi=1"},savetowallet:{url:"https://pay.google.com/gp/v/widget/save"},
person:{url:":socialhost:/:session_prefix:_/widget/render/person?usegapi=1"},savetodrive:{url:"https://drive.google.com/savetodrivebutton?usegapi=1",methods:["save"]},page:{url:":socialhost:/:session_prefix:_/widget/render/page?usegapi=1"},card:{url:":socialhost:/:session_prefix:_/hovercard/card"}}},h:"m;/_/scs/abc-static/_/js/k=gapi.lb.en.y0xCMa4KeeI.O/d=1/rs=AHpOoo8-3MGCaatZB3kdS5TpZdd-gOSBHg/m=__features__",u:"https://apis.google.com/js/api.js",hee:!0,dpo:!1,le:["scs"],glrp:false},platform:"backdrop blogger comments commentcount community donation family_creation follow hangout health page partnersbadge person playemm playreview plus plusone post ratingbadge savetoandroidpay savetodrive savetowallet sharetoclassroom shortlists signin2 surveyoptin visibility youtube ytsubscribe zoomableimage".split(" "),
annotation:["interactivepost","recobar","signin2","autocomplete"]}});}).call(this);