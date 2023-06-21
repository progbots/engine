var LocalEchoController;(()=>{"use strict";var t={121:(t,e,r)=>{r(151),e.parse=r(38)},38:t=>{for(var e="(?:"+["\\|\\|","\\&\\&",";;","\\|\\&","\\<\\(","\\<\\<\\<",">>",">\\&","<\\&","[&;()|<>]"].join("|")+")",r=new RegExp("^"+e+"$"),i="|&;()<> \\t",n=/^#$/,s="",o=0;o<4;o++)s+=(4294967296*Math.random()).toString(16);var a=new RegExp("^"+s);t.exports=function(t,o,h){var u=function(t,o,a){a||(a={});var h=a.escape||"\\",u=new RegExp(["("+e+")","((\\"+h+"['\""+i+"]|[^\\s'\""+i+"])+|\"((\\\\\"|[^\"])*?)\"|'((\\\\'|[^'])*?)')+"].join("|"),"g"),l=function(t,e){for(var r,i=e.lastIndex,n=[];r=e.exec(t);)n.push(r),e.lastIndex===r.index&&(e.lastIndex+=1);return e.lastIndex=i,n}(t,u);if(0===l.length)return[];o||(o={});var c=!1;return l.map((function(e){var i=e[0];if(i&&!c){if(r.test(i))return{op:i};var a,u=!1,l=!1,p="",f=!1;for(a=0;a<i.length;a++){var v=i.charAt(a);if(f=f||!u&&("*"===v||"?"===v),l)p+=v,l=!1;else if(u)v===u?u=!1:"'"==u?p+=v:v===h?(a+=1,p+='"'===(v=i.charAt(a))||v===h||"$"===v?v:h+v):p+="$"===v?d():v;else if('"'===v||"'"===v)u=v;else{if(r.test(v))return{op:i};if(n.test(v)){c=!0;var m={comment:t.slice(e.index+a+1)};return p.length?[p,m]:[m]}v===h?l=!0:p+="$"===v?d():v}}return f?{op:"glob",pattern:p}:p}function d(){var t,e;a+=1;var r=i.charAt(a);if("{"===r){if(a+=1,"}"===i.charAt(a))throw new Error("Bad substitution: "+i.slice(a-2,a+1));if((t=i.indexOf("}",a))<0)throw new Error("Bad substitution: "+i.slice(a));e=i.slice(a,t),a=t}else if(/[*@#?$!_-]/.test(r))e=r,a+=1;else{var n=i.slice(a);(t=n.match(/[^\w\d_]/))?(e=n.slice(0,t.index),a+=t.index-1):(e=n,a=i.length)}return function(t,e,r){var i="function"==typeof t?t(r):t[r];return void 0===i&&""!=r?i="":void 0===i&&(i="$"),"object"==typeof i?""+s+JSON.stringify(i)+s:""+i}(o,0,e)}})).reduce((function(t,e){return void 0===e?t:t.concat(e)}),[])}(t,o,h);return"function"!=typeof o?u:u.reduce((function(t,e){if("object"==typeof e)return t.concat(e);var r=e.split(RegExp("("+s+".*?"+s+")","g"));return 1===r.length?t.concat(r[0]):t.concat(r.filter(Boolean).map((function(t){return a.test(t)?JSON.parse(t.split(s)[1]):t})))}),[])}},151:t=>{t.exports=function(t){return t.map((function(t){return t&&"object"==typeof t?t.op.replace(/(.)/g,"\\$1"):/["\s]/.test(t)&&!/'/.test(t)?"'"+t.replace(/(['\\])/g,"\\$1")+"'":/["'\s]/.test(t)?'"'+t.replace(/(["\\$`!])/g,"\\$1")+'"':String(t).replace(/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g,"$1\\$2")})).join(" ")}}},e={};function r(i){var n=e[i];if(void 0!==n)return n.exports;var s=e[i]={exports:{}};return t[i](s,s.exports,r),s.exports}r.d=(t,e)=>{for(var i in e)r.o(e,i)&&!r.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},r.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var i={};(()=>{function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(e,r){for(var i=0;i<r.length;i++){var n=r[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(void 0,s=function(e,r){if("object"!==t(e)||null===e)return e;var i=e[Symbol.toPrimitive];if(void 0!==i){var n=i.call(e,"string");if("object"!==t(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(n.key),"symbol"===t(s)?s:String(s)),n)}var s}r.d(i,{default:()=>y});var n=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.size=e,this.entries=[],this.cursor=0}var r,i;return r=t,(i=[{key:"push",value:function(t){""!==t.trim()&&t!=this.entries[this.entries.length-1]&&(this.entries.push(t),this.entries.length>this.size&&this.entries.pop(0),this.cursor=this.entries.length)}},{key:"rewind",value:function(){this.cursor=this.entries.length}},{key:"getPrevious",value:function(){var t=Math.max(0,this.cursor-1);return this.cursor=t,this.entries[t]}},{key:"getNext",value:function(){var t=Math.min(this.entries.length,this.cursor+1);return this.cursor=t,this.entries[t]}}])&&e(r.prototype,i),Object.defineProperty(r,"prototype",{writable:!1}),t}(),s=r(121);function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,i=new Array(e);r<e;r++)i[r]=t[r];return i}function a(t){for(var e,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=[],n=/\w+/g;e=n.exec(t);)r?i.push(e.index):i.push(e.index+e[0].length);return i}function h(t,e){var r=a(t,!0).reverse().find((function(t){return t<e}));return null==r?0:r}function u(t,e,r){for(var i=0,n=0,s=0;s<e;++s)("\n"==t.charAt(s)||(n+=1)>r)&&(n=0,i+=1);return{row:i,col:n}}function l(t,e){return u(t,t.length,e).row+1}function c(t){return null!=t.match(/[^\\][ \t]$/m)}function p(t){return""===t.trim()||c(t)?"":(0,s.parse)(t).pop()||""}function f(t,e){if(t.length>=e[0].length)return t;var r=t;t+=e[0].slice(t.length,t.length+1);for(var i=0;i<e.length;i++){if(!e[i].startsWith(r))return null;if(!e[i].startsWith(t))return r}return f(t,e)}function v(t){return v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},v(t)}function m(t,e){for(var r=0;r<e.length;r++){var i=e[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,(void 0,n=function(t,e){if("object"!==v(t)||null===t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var i=r.call(t,"string");if("object"!==v(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(i.key),"symbol"===v(n)?n:String(n)),i)}var n}var d=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.term=e,this._handleTermData=this.handleTermData.bind(this),this._handleTermResize=this.handleTermResize.bind(this),this.history=new n(r.historySize||10),this.maxAutocompleteEntries=r.maxAutocompleteEntries||100,this._autocompleteHandlers=[],this._active=!1,this._input="",this._cursor=0,this._activePrompt=null,this._activeCharPrompt=null,this._termSize={cols:0,rows:0},this._disposables=[],e&&(e.loadAddon?e.loadAddon(this):this.attach())}var e,r;return e=t,r=[{key:"activate",value:function(t){this.term=t,this.attach()}},{key:"dispose",value:function(){this.detach()}},{key:"detach",value:function(){this.term.off?(this.term.off("data",this._handleTermData),this.term.off("resize",this._handleTermResize)):(this._disposables.forEach((function(t){return t.dispose()})),this._disposables=[])}},{key:"attach",value:function(){this.term.on?(this.term.on("data",this._handleTermData),this.term.on("resize",this._handleTermResize)):(this._disposables.push(this.term.onData(this._handleTermData)),this._disposables.push(this.term.onResize(this._handleTermResize))),this._termSize={cols:this.term.cols,rows:this.term.rows}}},{key:"addAutocompleteHandler",value:function(t){for(var e=arguments.length,r=new Array(e>1?e-1:0),i=1;i<e;i++)r[i-1]=arguments[i];this._autocompleteHandlers.push({fn:t,args:r})}},{key:"removeAutocompleteHandler",value:function(t){var e=this._autocompleteHandlers.findIndex((function(e){return e.fn===t}));-1!==e&&this._autocompleteHandlers.splice(e,1)}},{key:"read",value:function(t){var e=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"> ";return new Promise((function(i,n){e.term.write(t),e._activePrompt={prompt:t,continuationPrompt:r,resolve:i,reject:n},e._input="",e._cursor=0,e._active=!0}))}},{key:"readChar",value:function(t){var e=this;return new Promise((function(r,i){e.term.write(t),e._activeCharPrompt={prompt:t,resolve:r,reject:i}}))}},{key:"abortRead",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"aborted";null==this._activePrompt&&null==this._activeCharPrompt||this.term.write("\r\n"),null!=this._activePrompt&&(this._activePrompt.reject(t),this._activePrompt=null),null!=this._activeCharPrompt&&(this._activeCharPrompt.reject(t),this._activeCharPrompt=null),this._active=!1}},{key:"println",value:function(t){this.print(t+"\n")}},{key:"print",value:function(t){var e=t.replace(/[\r\n]+/g,"\n");this.term.write(e.replace(/\n/g,"\r\n"))}},{key:"printWide",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;if(0==t.length)return println("");for(var r=t.reduce((function(t,e){return Math.max(t,e.length)}),0)+e,i=Math.floor(this._termSize.cols/r),n=Math.ceil(t.length/i),s=0,o=0;o<n;++o){for(var a="",h=0;h<i;++h)if(s<t.length){var u=t[s++];a+=u+=" ".repeat(r-u.length)}this.println(a)}}},{key:"applyPrompts",value:function(t){var e=(this._activePrompt||{}).prompt||"",r=(this._activePrompt||{}).continuationPrompt||"";return e+t.replace(/\n/g,"\n"+r)}},{key:"applyPromptOffset",value:function(t,e){return this.applyPrompts(t.substr(0,e)).length}},{key:"clearInput",value:function(){for(var t=this.applyPrompts(this._input),e=l(t,this._termSize.cols),r=u(t,this.applyPromptOffset(this._input,this._cursor),this._termSize.cols),i=(r.col,e-r.row-1),n=0;n<i;++n)this.term.write("[E");for(this.term.write("\r[K"),n=1;n<e;++n)this.term.write("[F[K")}},{key:"setInput",value:function(t){(!(arguments.length>1&&void 0!==arguments[1])||arguments[1])&&this.clearInput();var e=this.applyPrompts(t);this.print(e),this._cursor>t.length&&(this._cursor=t.length);var r=this.applyPromptOffset(t,this._cursor),i=l(e,this._termSize.cols),n=u(e,r,this._termSize.cols),s=n.col,o=i-n.row-1;this.term.write("\r");for(var a=0;a<o;++a)this.term.write("[F");for(a=0;a<s;++a)this.term.write("[C");this._input=t}},{key:"printAndRestartPrompt",value:function(t){var e=this,r=this._cursor;this.setCursor(this._input.length),this.term.write("\r\n");var i=function(){e._cursor=r,e.setInput(e._input)},n=t();null==n?i():n.then(i)}},{key:"setCursor",value:function(t){t<0&&(t=0),t>this._input.length&&(t=this._input.length);var e=this.applyPrompts(this._input),r=(l(e,this._termSize.cols),u(e,this.applyPromptOffset(this._input,this._cursor),this._termSize.cols)),i=r.col,n=r.row,s=u(e,this.applyPromptOffset(this._input,t),this._termSize.cols),o=s.col,a=s.row;if(a>n)for(var h=n;h<a;++h)this.term.write("[B");else for(var c=a;c<n;++c)this.term.write("[A");if(o>i)for(var p=i;p<o;++p)this.term.write("[C");else for(var f=o;f<i;++f)this.term.write("[D");this._cursor=t}},{key:"handleCursorMove",value:function(t){if(t>0){var e=Math.min(t,this._input.length-this._cursor);this.setCursor(this._cursor+e)}else if(t<0){var r=Math.max(t,-this._cursor);this.setCursor(this._cursor+r)}}},{key:"handleCursorErase",value:function(t){var e=this._cursor,r=this._input;if(t){if(e<=0)return;var i=r.substr(0,e-1)+r.substr(e);this.clearInput(),this._cursor-=1,this.setInput(i,!1)}else{var n=r.substr(0,e)+r.substr(e+1);this.setInput(n)}}},{key:"handleCursorInsert",value:function(t){var e=this._cursor,r=this._input,i=r.substr(0,e)+t+r.substr(e);this._cursor+=t.length,this.setInput(i)}},{key:"handleReadComplete",value:function(){this.history&&this.history.push(this._input),this._activePrompt&&(this._activePrompt.resolve(this._input),this._activePrompt=null),this.term.write("\r\n"),this._active=!1}},{key:"handleTermResize",value:function(t){var e=t.rows,r=t.cols;this.clearInput(),this._termSize={cols:r,rows:e},this.setInput(this._input,!1)}},{key:"handleTermData",value:function(t){var e=this;if(this._active){if(null!=this._activeCharPrompt)return this._activeCharPrompt.resolve(t),this._activeCharPrompt=null,void this.term.write("\r\n");if(t.length>3&&27!==t.charCodeAt(0)){var r=t.replace(/[\r\n]+/g,"\r");Array.from(r).forEach((function(t){return e.handleData(t)}))}else this.handleData(t)}}},{key:"handleData",value:function(t){var e=this;if(this._active){var r,i,n,u,l=t.charCodeAt(0);if(27==l)switch(t.substr(1)){case"[A":if(this.history){var v=this.history.getPrevious();v&&(this.setInput(v),this.setCursor(v.length))}break;case"[B":if(this.history){var m=this.history.getNext();m||(m=""),this.setInput(m),this.setCursor(m.length)}break;case"[D":this.handleCursorMove(-1);break;case"[C":this.handleCursorMove(1);break;case"[3~":this.handleCursorErase(!1);break;case"[F":this.setCursor(this._input.length);break;case"[H":this.setCursor(0);break;case"b":null!=(r=h(this._input,this._cursor))&&this.setCursor(r);break;case"f":i=this._input,n=this._cursor,null!=(r=null==(u=a(i,!1).find((function(t){return t>n})))?i.length:u)&&this.setCursor(r);break;case"":null!=(r=h(this._input,this._cursor))&&(this.setInput(this._input.substr(0,r)+this._input.substr(this._cursor)),this.setCursor(r))}else if(l<32||127===l)switch(t){case"\r":!function(t){return""!=t.trim()&&((t.match(/'/g)||[]).length%2!=0||(t.match(/"/g)||[]).length%2!=0||""==t.split(/(\|\||\||&&)/g).pop().trim()||!(!t.endsWith("\\")||t.endsWith("\\\\")))}(this._input)?this.handleReadComplete():this.handleCursorInsert("\n");break;case"":this.handleCursorErase(!0);break;case"\t":if(this._autocompleteHandlers.length>0){var d=this._input.substr(0,this._cursor),y=c(d),_=function(t,e){var r=(0,s.parse)(e),i=r.length-1,n=r[i]||"";return""===e.trim()?(i=0,n=""):c(e)&&(i+=1,n=""),t.reduce((function(t,e){var n,s=e.fn,a=e.args;try{return t.concat(s.apply(void 0,[i,r].concat(function(t){if(Array.isArray(t))return o(t)}(n=a)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(n)||function(t,e){if(t){if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(t,e):void 0}}(n)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())))}catch(e){return console.error("Auto-complete error:",e),t}}),[]).filter((function(t){return t.startsWith(n)}))}(this._autocompleteHandlers,d);if(_.sort(),0===_.length)y||this.handleCursorInsert(" ");else if(1===_.length){var g=p(d);this.handleCursorInsert(_[0].substr(g.length)+" ")}else if(_.length<=this.maxAutocompleteEntries){var b=f(d,_);if(b){var w=p(d);this.handleCursorInsert(b.substr(w.length))}this.printAndRestartPrompt((function(){e.printWide(_)}))}else this.printAndRestartPrompt((function(){return e.readChar("Display all ".concat(_.length," possibilities? (y or n)")).then((function(t){"y"!=t&&"Y"!=t||e.printWide(_)}))}))}else this.handleCursorInsert("    ");break;case"":this.setCursor(this._input.length),this.term.write("^C\r\n"+((this._activePrompt||{}).prompt||"")),this._input="",this._cursor=0,this.history&&this.history.rewind()}else this.handleCursorInsert(t)}}}],r&&m(e.prototype,r),Object.defineProperty(e,"prototype",{writable:!1}),t}();const y=d})(),LocalEchoController=i.default})();
//# sourceMappingURL=local-echo.js.map