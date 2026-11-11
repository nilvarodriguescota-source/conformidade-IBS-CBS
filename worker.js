"use strict";(()=>{var Cc=Object.create;var xi=Object.defineProperty;var Nc=Object.getOwnPropertyDescriptor;var Rc=Object.getOwnPropertyNames;var Sc=Object.getPrototypeOf,Oc=Object.prototype.hasOwnProperty;var w=(o,e,a)=>()=>{if(a)throw a[0];try{return o&&(e=o(o=0)),e}catch(t){throw a=[t],t}};var So=(o,e)=>()=>{try{return e||o((e={exports:{}}).exports,e),e.exports}catch(a){throw e=0,a}};var yc=(o,e,a,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Rc(e))!Oc.call(o,r)&&r!==a&&xi(o,r,{get:()=>e[r],enumerable:!(t=Nc(e,r))||t.enumerable});return o};var ue=(o,e,a)=>(a=o!=null?Cc(Sc(o)):{},yc(e||!o||!o.__esModule?xi(a,"default",{value:o,enumerable:!0}):a,o));var Ei=So(Oo=>{"use strict";f();Oo.byteLength=Tc;Oo.toByteArray=Lc;Oo.fromByteArray=Mc;var Pe=[],Ce=[],wc=typeof Uint8Array<"u"?Uint8Array:Array,St="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(oa=0,Ai=St.length;oa<Ai;++oa)Pe[oa]=St[oa],Ce[St.charCodeAt(oa)]=oa;var oa,Ai;Ce[45]=62;Ce[95]=63;function Ii(o){var e=o.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var a=o.indexOf("=");a===-1&&(a=e);var t=a===e?0:4-a%4;return[a,t]}function Tc(o){var e=Ii(o),a=e[0],t=e[1];return(a+t)*3/4-t}function _c(o,e,a){return(e+a)*3/4-a}function Lc(o){var e,a=Ii(o),t=a[0],r=a[1],i=new wc(_c(o,t,r)),n=0,s=r>0?t-4:t,c;for(c=0;c<s;c+=4)e=Ce[o.charCodeAt(c)]<<18|Ce[o.charCodeAt(c+1)]<<12|Ce[o.charCodeAt(c+2)]<<6|Ce[o.charCodeAt(c+3)],i[n++]=e>>16&255,i[n++]=e>>8&255,i[n++]=e&255;return r===2&&(e=Ce[o.charCodeAt(c)]<<2|Ce[o.charCodeAt(c+1)]>>4,i[n++]=e&255),r===1&&(e=Ce[o.charCodeAt(c)]<<10|Ce[o.charCodeAt(c+1)]<<4|Ce[o.charCodeAt(c+2)]>>2,i[n++]=e>>8&255,i[n++]=e&255),i}function Dc(o){return Pe[o>>18&63]+Pe[o>>12&63]+Pe[o>>6&63]+Pe[o&63]}function Pc(o,e,a){for(var t,r=[],i=e;i<a;i+=3)t=(o[i]<<16&16711680)+(o[i+1]<<8&65280)+(o[i+2]&255),r.push(Dc(t));return r.join("")}function Mc(o){for(var e,a=o.length,t=a%3,r=[],i=16383,n=0,s=a-t;n<s;n+=i)r.push(Pc(o,n,n+i>s?s:n+i));return t===1?(e=o[a-1],r.push(Pe[e>>2]+Pe[e<<4&63]+"==")):t===2&&(e=(o[a-2]<<8)+o[a-1],r.push(Pe[e>>10]+Pe[e>>4&63]+Pe[e<<2&63]+"=")),r.join("")}});var Ci=So(Ot=>{f();Ot.read=function(o,e,a,t,r){var i,n,s=r*8-t-1,c=(1<<s)-1,l=c>>1,d=-7,u=a?r-1:0,p=a?-1:1,m=o[e+u];for(u+=p,i=m&(1<<-d)-1,m>>=-d,d+=s;d>0;i=i*256+o[e+u],u+=p,d-=8);for(n=i&(1<<-d)-1,i>>=-d,d+=t;d>0;n=n*256+o[e+u],u+=p,d-=8);if(i===0)i=1-l;else{if(i===c)return n?NaN:(m?-1:1)*(1/0);n=n+Math.pow(2,t),i=i-l}return(m?-1:1)*n*Math.pow(2,i-t)};Ot.write=function(o,e,a,t,r,i){var n,s,c,l=i*8-r-1,d=(1<<l)-1,u=d>>1,p=r===23?Math.pow(2,-24)-Math.pow(2,-77):0,m=t?0:i-1,g=t?1:-1,v=e<0||e===0&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(s=isNaN(e)?1:0,n=d):(n=Math.floor(Math.log(e)/Math.LN2),e*(c=Math.pow(2,-n))<1&&(n--,c*=2),n+u>=1?e+=p/c:e+=p*Math.pow(2,1-u),e*c>=2&&(n++,c/=2),n+u>=d?(s=0,n=d):n+u>=1?(s=(e*c-1)*Math.pow(2,r),n=n+u):(s=e*Math.pow(2,u-1)*Math.pow(2,r),n=0));r>=8;o[a+m]=s&255,m+=g,s/=256,r-=8);for(n=n<<r|s,l+=r;l>0;o[a+m]=n&255,m+=g,n/=256,l-=8);o[a+m-g]|=v*128}});var To=So(Aa=>{"use strict";f();var yt=Ei(),ba=Ci(),Ni=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;Aa.Buffer=h;Aa.SlowBuffer=$c;Aa.INSPECT_MAX_BYTES=50;var yo=2147483647;Aa.kMaxLength=yo;h.TYPED_ARRAY_SUPPORT=Fc();!h.TYPED_ARRAY_SUPPORT&&typeof console<"u"&&typeof console.error=="function"&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");function Fc(){try{let o=new Uint8Array(1),e={foo:function(){return 42}};return Object.setPrototypeOf(e,Uint8Array.prototype),Object.setPrototypeOf(o,e),o.foo()===42}catch{return!1}}Object.defineProperty(h.prototype,"parent",{enumerable:!0,get:function(){if(h.isBuffer(this))return this.buffer}});Object.defineProperty(h.prototype,"offset",{enumerable:!0,get:function(){if(h.isBuffer(this))return this.byteOffset}});function $e(o){if(o>yo)throw new RangeError('The value "'+o+'" is invalid for option "size"');let e=new Uint8Array(o);return Object.setPrototypeOf(e,h.prototype),e}function h(o,e,a){if(typeof o=="number"){if(typeof e=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return Lt(o)}return yi(o,e,a)}h.poolSize=8192;function yi(o,e,a){if(typeof o=="string")return Bc(o,e);if(ArrayBuffer.isView(o))return Vc(o);if(o==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof o);if(Me(o,ArrayBuffer)||o&&Me(o.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(Me(o,SharedArrayBuffer)||o&&Me(o.buffer,SharedArrayBuffer)))return Tt(o,e,a);if(typeof o=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');let t=o.valueOf&&o.valueOf();if(t!=null&&t!==o)return h.from(t,e,a);let r=jc(o);if(r)return r;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof o[Symbol.toPrimitive]=="function")return h.from(o[Symbol.toPrimitive]("string"),e,a);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof o)}h.from=function(o,e,a){return yi(o,e,a)};Object.setPrototypeOf(h.prototype,Uint8Array.prototype);Object.setPrototypeOf(h,Uint8Array);function wi(o){if(typeof o!="number")throw new TypeError('"size" argument must be of type number');if(o<0)throw new RangeError('The value "'+o+'" is invalid for option "size"')}function qc(o,e,a){return wi(o),o<=0?$e(o):e!==void 0?typeof a=="string"?$e(o).fill(e,a):$e(o).fill(e):$e(o)}h.alloc=function(o,e,a){return qc(o,e,a)};function Lt(o){return wi(o),$e(o<0?0:Dt(o)|0)}h.allocUnsafe=function(o){return Lt(o)};h.allocUnsafeSlow=function(o){return Lt(o)};function Bc(o,e){if((typeof e!="string"||e==="")&&(e="utf8"),!h.isEncoding(e))throw new TypeError("Unknown encoding: "+e);let a=Ti(o,e)|0,t=$e(a),r=t.write(o,e);return r!==a&&(t=t.slice(0,r)),t}function wt(o){let e=o.length<0?0:Dt(o.length)|0,a=$e(e);for(let t=0;t<e;t+=1)a[t]=o[t]&255;return a}function Vc(o){if(Me(o,Uint8Array)){let e=new Uint8Array(o);return Tt(e.buffer,e.byteOffset,e.byteLength)}return wt(o)}function Tt(o,e,a){if(e<0||o.byteLength<e)throw new RangeError('"offset" is outside of buffer bounds');if(o.byteLength<e+(a||0))throw new RangeError('"length" is outside of buffer bounds');let t;return e===void 0&&a===void 0?t=new Uint8Array(o):a===void 0?t=new Uint8Array(o,e):t=new Uint8Array(o,e,a),Object.setPrototypeOf(t,h.prototype),t}function jc(o){if(h.isBuffer(o)){let e=Dt(o.length)|0,a=$e(e);return a.length===0||o.copy(a,0,0,e),a}if(o.length!==void 0)return typeof o.length!="number"||Mt(o.length)?$e(0):wt(o);if(o.type==="Buffer"&&Array.isArray(o.data))return wt(o.data)}function Dt(o){if(o>=yo)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+yo.toString(16)+" bytes");return o|0}function $c(o){return+o!=o&&(o=0),h.alloc(+o)}h.isBuffer=function(e){return e!=null&&e._isBuffer===!0&&e!==h.prototype};h.compare=function(e,a){if(Me(e,Uint8Array)&&(e=h.from(e,e.offset,e.byteLength)),Me(a,Uint8Array)&&(a=h.from(a,a.offset,a.byteLength)),!h.isBuffer(e)||!h.isBuffer(a))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===a)return 0;let t=e.length,r=a.length;for(let i=0,n=Math.min(t,r);i<n;++i)if(e[i]!==a[i]){t=e[i],r=a[i];break}return t<r?-1:r<t?1:0};h.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}};h.concat=function(e,a){if(!Array.isArray(e))throw new TypeError('"list" argument must be an Array of Buffers');if(e.length===0)return h.alloc(0);let t;if(a===void 0)for(a=0,t=0;t<e.length;++t)a+=e[t].length;let r=h.allocUnsafe(a),i=0;for(t=0;t<e.length;++t){let n=e[t];if(Me(n,Uint8Array))i+n.length>r.length?(h.isBuffer(n)||(n=h.from(n)),n.copy(r,i)):Uint8Array.prototype.set.call(r,n,i);else if(h.isBuffer(n))n.copy(r,i);else throw new TypeError('"list" argument must be an Array of Buffers');i+=n.length}return r};function Ti(o,e){if(h.isBuffer(o))return o.length;if(ArrayBuffer.isView(o)||Me(o,ArrayBuffer))return o.byteLength;if(typeof o!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof o);let a=o.length,t=arguments.length>2&&arguments[2]===!0;if(!t&&a===0)return 0;let r=!1;for(;;)switch(e){case"ascii":case"latin1":case"binary":return a;case"utf8":case"utf-8":return _t(o).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return a*2;case"hex":return a>>>1;case"base64":return Vi(o).length;default:if(r)return t?-1:_t(o).length;e=(""+e).toLowerCase(),r=!0}}h.byteLength=Ti;function Uc(o,e,a){let t=!1;if((e===void 0||e<0)&&(e=0),e>this.length||((a===void 0||a>this.length)&&(a=this.length),a<=0)||(a>>>=0,e>>>=0,a<=e))return"";for(o||(o="utf8");;)switch(o){case"hex":return Yc(this,e,a);case"utf8":case"utf-8":return Li(this,e,a);case"ascii":return Wc(this,e,a);case"latin1":case"binary":return Zc(this,e,a);case"base64":return Qc(this,e,a);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Kc(this,e,a);default:if(t)throw new TypeError("Unknown encoding: "+o);o=(o+"").toLowerCase(),t=!0}}h.prototype._isBuffer=!0;function ta(o,e,a){let t=o[e];o[e]=o[a],o[a]=t}h.prototype.swap16=function(){let e=this.length;if(e%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let a=0;a<e;a+=2)ta(this,a,a+1);return this};h.prototype.swap32=function(){let e=this.length;if(e%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let a=0;a<e;a+=4)ta(this,a,a+3),ta(this,a+1,a+2);return this};h.prototype.swap64=function(){let e=this.length;if(e%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let a=0;a<e;a+=8)ta(this,a,a+7),ta(this,a+1,a+6),ta(this,a+2,a+5),ta(this,a+3,a+4);return this};h.prototype.toString=function(){let e=this.length;return e===0?"":arguments.length===0?Li(this,0,e):Uc.apply(this,arguments)};h.prototype.toLocaleString=h.prototype.toString;h.prototype.equals=function(e){if(!h.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e?!0:h.compare(this,e)===0};h.prototype.inspect=function(){let e="",a=Aa.INSPECT_MAX_BYTES;return e=this.toString("hex",0,a).replace(/(.{2})/g,"$1 ").trim(),this.length>a&&(e+=" ... "),"<Buffer "+e+">"};Ni&&(h.prototype[Ni]=h.prototype.inspect);h.prototype.compare=function(e,a,t,r,i){if(Me(e,Uint8Array)&&(e=h.from(e,e.offset,e.byteLength)),!h.isBuffer(e))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(a===void 0&&(a=0),t===void 0&&(t=e?e.length:0),r===void 0&&(r=0),i===void 0&&(i=this.length),a<0||t>e.length||r<0||i>this.length)throw new RangeError("out of range index");if(r>=i&&a>=t)return 0;if(r>=i)return-1;if(a>=t)return 1;if(a>>>=0,t>>>=0,r>>>=0,i>>>=0,this===e)return 0;let n=i-r,s=t-a,c=Math.min(n,s),l=this.slice(r,i),d=e.slice(a,t);for(let u=0;u<c;++u)if(l[u]!==d[u]){n=l[u],s=d[u];break}return n<s?-1:s<n?1:0};function _i(o,e,a,t,r){if(o.length===0)return-1;if(typeof a=="string"?(t=a,a=0):a>2147483647?a=2147483647:a<-2147483648&&(a=-2147483648),a=+a,Mt(a)&&(a=r?0:o.length-1),a<0&&(a=o.length+a),a>=o.length){if(r)return-1;a=o.length-1}else if(a<0)if(r)a=0;else return-1;if(typeof e=="string"&&(e=h.from(e,t)),h.isBuffer(e))return e.length===0?-1:Ri(o,e,a,t,r);if(typeof e=="number")return e=e&255,typeof Uint8Array.prototype.indexOf=="function"?r?Uint8Array.prototype.indexOf.call(o,e,a):Uint8Array.prototype.lastIndexOf.call(o,e,a):Ri(o,[e],a,t,r);throw new TypeError("val must be string, number or Buffer")}function Ri(o,e,a,t,r){let i=1,n=o.length,s=e.length;if(t!==void 0&&(t=String(t).toLowerCase(),t==="ucs2"||t==="ucs-2"||t==="utf16le"||t==="utf-16le")){if(o.length<2||e.length<2)return-1;i=2,n/=2,s/=2,a/=2}function c(d,u){return i===1?d[u]:d.readUInt16BE(u*i)}let l;if(r){let d=-1;for(l=a;l<n;l++)if(c(o,l)===c(e,d===-1?0:l-d)){if(d===-1&&(d=l),l-d+1===s)return d*i}else d!==-1&&(l-=l-d),d=-1}else for(a+s>n&&(a=n-s),l=a;l>=0;l--){let d=!0;for(let u=0;u<s;u++)if(c(o,l+u)!==c(e,u)){d=!1;break}if(d)return l}return-1}h.prototype.includes=function(e,a,t){return this.indexOf(e,a,t)!==-1};h.prototype.indexOf=function(e,a,t){return _i(this,e,a,t,!0)};h.prototype.lastIndexOf=function(e,a,t){return _i(this,e,a,t,!1)};function kc(o,e,a,t){a=Number(a)||0;let r=o.length-a;t?(t=Number(t),t>r&&(t=r)):t=r;let i=e.length;t>i/2&&(t=i/2);let n;for(n=0;n<t;++n){let s=parseInt(e.substr(n*2,2),16);if(Mt(s))return n;o[a+n]=s}return n}function zc(o,e,a,t){return wo(_t(e,o.length-a),o,a,t)}function Hc(o,e,a,t){return wo(tl(e),o,a,t)}function Gc(o,e,a,t){return wo(Vi(e),o,a,t)}function Xc(o,e,a,t){return wo(rl(e,o.length-a),o,a,t)}h.prototype.write=function(e,a,t,r){if(a===void 0)r="utf8",t=this.length,a=0;else if(t===void 0&&typeof a=="string")r=a,t=this.length,a=0;else if(isFinite(a))a=a>>>0,isFinite(t)?(t=t>>>0,r===void 0&&(r="utf8")):(r=t,t=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");let i=this.length-a;if((t===void 0||t>i)&&(t=i),e.length>0&&(t<0||a<0)||a>this.length)throw new RangeError("Attempt to write outside buffer bounds");r||(r="utf8");let n=!1;for(;;)switch(r){case"hex":return kc(this,e,a,t);case"utf8":case"utf-8":return zc(this,e,a,t);case"ascii":case"latin1":case"binary":return Hc(this,e,a,t);case"base64":return Gc(this,e,a,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Xc(this,e,a,t);default:if(n)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),n=!0}};h.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function Qc(o,e,a){return e===0&&a===o.length?yt.fromByteArray(o):yt.fromByteArray(o.slice(e,a))}function Li(o,e,a){a=Math.min(o.length,a);let t=[],r=e;for(;r<a;){let i=o[r],n=null,s=i>239?4:i>223?3:i>191?2:1;if(r+s<=a){let c,l,d,u;switch(s){case 1:i<128&&(n=i);break;case 2:c=o[r+1],(c&192)===128&&(u=(i&31)<<6|c&63,u>127&&(n=u));break;case 3:c=o[r+1],l=o[r+2],(c&192)===128&&(l&192)===128&&(u=(i&15)<<12|(c&63)<<6|l&63,u>2047&&(u<55296||u>57343)&&(n=u));break;case 4:c=o[r+1],l=o[r+2],d=o[r+3],(c&192)===128&&(l&192)===128&&(d&192)===128&&(u=(i&15)<<18|(c&63)<<12|(l&63)<<6|d&63,u>65535&&u<1114112&&(n=u))}}n===null?(n=65533,s=1):n>65535&&(n-=65536,t.push(n>>>10&1023|55296),n=56320|n&1023),t.push(n),r+=s}return Jc(t)}var Si=4096;function Jc(o){let e=o.length;if(e<=Si)return String.fromCharCode.apply(String,o);let a="",t=0;for(;t<e;)a+=String.fromCharCode.apply(String,o.slice(t,t+=Si));return a}function Wc(o,e,a){let t="";a=Math.min(o.length,a);for(let r=e;r<a;++r)t+=String.fromCharCode(o[r]&127);return t}function Zc(o,e,a){let t="";a=Math.min(o.length,a);for(let r=e;r<a;++r)t+=String.fromCharCode(o[r]);return t}function Yc(o,e,a){let t=o.length;(!e||e<0)&&(e=0),(!a||a<0||a>t)&&(a=t);let r="";for(let i=e;i<a;++i)r+=il[o[i]];return r}function Kc(o,e,a){let t=o.slice(e,a),r="";for(let i=0;i<t.length-1;i+=2)r+=String.fromCharCode(t[i]+t[i+1]*256);return r}h.prototype.slice=function(e,a){let t=this.length;e=~~e,a=a===void 0?t:~~a,e<0?(e+=t,e<0&&(e=0)):e>t&&(e=t),a<0?(a+=t,a<0&&(a=0)):a>t&&(a=t),a<e&&(a=e);let r=this.subarray(e,a);return Object.setPrototypeOf(r,h.prototype),r};function Y(o,e,a){if(o%1!==0||o<0)throw new RangeError("offset is not uint");if(o+e>a)throw new RangeError("Trying to access beyond buffer length")}h.prototype.readUintLE=h.prototype.readUIntLE=function(e,a,t){e=e>>>0,a=a>>>0,t||Y(e,a,this.length);let r=this[e],i=1,n=0;for(;++n<a&&(i*=256);)r+=this[e+n]*i;return r};h.prototype.readUintBE=h.prototype.readUIntBE=function(e,a,t){e=e>>>0,a=a>>>0,t||Y(e,a,this.length);let r=this[e+--a],i=1;for(;a>0&&(i*=256);)r+=this[e+--a]*i;return r};h.prototype.readUint8=h.prototype.readUInt8=function(e,a){return e=e>>>0,a||Y(e,1,this.length),this[e]};h.prototype.readUint16LE=h.prototype.readUInt16LE=function(e,a){return e=e>>>0,a||Y(e,2,this.length),this[e]|this[e+1]<<8};h.prototype.readUint16BE=h.prototype.readUInt16BE=function(e,a){return e=e>>>0,a||Y(e,2,this.length),this[e]<<8|this[e+1]};h.prototype.readUint32LE=h.prototype.readUInt32LE=function(e,a){return e=e>>>0,a||Y(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+this[e+3]*16777216};h.prototype.readUint32BE=h.prototype.readUInt32BE=function(e,a){return e=e>>>0,a||Y(e,4,this.length),this[e]*16777216+(this[e+1]<<16|this[e+2]<<8|this[e+3])};h.prototype.readBigUInt64LE=Xe(function(e){e=e>>>0,xa(e,"offset");let a=this[e],t=this[e+7];(a===void 0||t===void 0)&&Ga(e,this.length-8);let r=a+this[++e]*2**8+this[++e]*2**16+this[++e]*2**24,i=this[++e]+this[++e]*2**8+this[++e]*2**16+t*2**24;return BigInt(r)+(BigInt(i)<<BigInt(32))});h.prototype.readBigUInt64BE=Xe(function(e){e=e>>>0,xa(e,"offset");let a=this[e],t=this[e+7];(a===void 0||t===void 0)&&Ga(e,this.length-8);let r=a*2**24+this[++e]*2**16+this[++e]*2**8+this[++e],i=this[++e]*2**24+this[++e]*2**16+this[++e]*2**8+t;return(BigInt(r)<<BigInt(32))+BigInt(i)});h.prototype.readIntLE=function(e,a,t){e=e>>>0,a=a>>>0,t||Y(e,a,this.length);let r=this[e],i=1,n=0;for(;++n<a&&(i*=256);)r+=this[e+n]*i;return i*=128,r>=i&&(r-=Math.pow(2,8*a)),r};h.prototype.readIntBE=function(e,a,t){e=e>>>0,a=a>>>0,t||Y(e,a,this.length);let r=a,i=1,n=this[e+--r];for(;r>0&&(i*=256);)n+=this[e+--r]*i;return i*=128,n>=i&&(n-=Math.pow(2,8*a)),n};h.prototype.readInt8=function(e,a){return e=e>>>0,a||Y(e,1,this.length),this[e]&128?(255-this[e]+1)*-1:this[e]};h.prototype.readInt16LE=function(e,a){e=e>>>0,a||Y(e,2,this.length);let t=this[e]|this[e+1]<<8;return t&32768?t|4294901760:t};h.prototype.readInt16BE=function(e,a){e=e>>>0,a||Y(e,2,this.length);let t=this[e+1]|this[e]<<8;return t&32768?t|4294901760:t};h.prototype.readInt32LE=function(e,a){return e=e>>>0,a||Y(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24};h.prototype.readInt32BE=function(e,a){return e=e>>>0,a||Y(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]};h.prototype.readBigInt64LE=Xe(function(e){e=e>>>0,xa(e,"offset");let a=this[e],t=this[e+7];(a===void 0||t===void 0)&&Ga(e,this.length-8);let r=this[e+4]+this[e+5]*2**8+this[e+6]*2**16+(t<<24);return(BigInt(r)<<BigInt(32))+BigInt(a+this[++e]*2**8+this[++e]*2**16+this[++e]*2**24)});h.prototype.readBigInt64BE=Xe(function(e){e=e>>>0,xa(e,"offset");let a=this[e],t=this[e+7];(a===void 0||t===void 0)&&Ga(e,this.length-8);let r=(a<<24)+this[++e]*2**16+this[++e]*2**8+this[++e];return(BigInt(r)<<BigInt(32))+BigInt(this[++e]*2**24+this[++e]*2**16+this[++e]*2**8+t)});h.prototype.readFloatLE=function(e,a){return e=e>>>0,a||Y(e,4,this.length),ba.read(this,e,!0,23,4)};h.prototype.readFloatBE=function(e,a){return e=e>>>0,a||Y(e,4,this.length),ba.read(this,e,!1,23,4)};h.prototype.readDoubleLE=function(e,a){return e=e>>>0,a||Y(e,8,this.length),ba.read(this,e,!0,52,8)};h.prototype.readDoubleBE=function(e,a){return e=e>>>0,a||Y(e,8,this.length),ba.read(this,e,!1,52,8)};function pe(o,e,a,t,r,i){if(!h.isBuffer(o))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>r||e<i)throw new RangeError('"value" argument is out of bounds');if(a+t>o.length)throw new RangeError("Index out of range")}h.prototype.writeUintLE=h.prototype.writeUIntLE=function(e,a,t,r){if(e=+e,a=a>>>0,t=t>>>0,!r){let s=Math.pow(2,8*t)-1;pe(this,e,a,t,s,0)}let i=1,n=0;for(this[a]=e&255;++n<t&&(i*=256);)this[a+n]=e/i&255;return a+t};h.prototype.writeUintBE=h.prototype.writeUIntBE=function(e,a,t,r){if(e=+e,a=a>>>0,t=t>>>0,!r){let s=Math.pow(2,8*t)-1;pe(this,e,a,t,s,0)}let i=t-1,n=1;for(this[a+i]=e&255;--i>=0&&(n*=256);)this[a+i]=e/n&255;return a+t};h.prototype.writeUint8=h.prototype.writeUInt8=function(e,a,t){return e=+e,a=a>>>0,t||pe(this,e,a,1,255,0),this[a]=e&255,a+1};h.prototype.writeUint16LE=h.prototype.writeUInt16LE=function(e,a,t){return e=+e,a=a>>>0,t||pe(this,e,a,2,65535,0),this[a]=e&255,this[a+1]=e>>>8,a+2};h.prototype.writeUint16BE=h.prototype.writeUInt16BE=function(e,a,t){return e=+e,a=a>>>0,t||pe(this,e,a,2,65535,0),this[a]=e>>>8,this[a+1]=e&255,a+2};h.prototype.writeUint32LE=h.prototype.writeUInt32LE=function(e,a,t){return e=+e,a=a>>>0,t||pe(this,e,a,4,4294967295,0),this[a+3]=e>>>24,this[a+2]=e>>>16,this[a+1]=e>>>8,this[a]=e&255,a+4};h.prototype.writeUint32BE=h.prototype.writeUInt32BE=function(e,a,t){return e=+e,a=a>>>0,t||pe(this,e,a,4,4294967295,0),this[a]=e>>>24,this[a+1]=e>>>16,this[a+2]=e>>>8,this[a+3]=e&255,a+4};function Di(o,e,a,t,r){Bi(e,t,r,o,a,7);let i=Number(e&BigInt(4294967295));o[a++]=i,i=i>>8,o[a++]=i,i=i>>8,o[a++]=i,i=i>>8,o[a++]=i;let n=Number(e>>BigInt(32)&BigInt(4294967295));return o[a++]=n,n=n>>8,o[a++]=n,n=n>>8,o[a++]=n,n=n>>8,o[a++]=n,a}function Pi(o,e,a,t,r){Bi(e,t,r,o,a,7);let i=Number(e&BigInt(4294967295));o[a+7]=i,i=i>>8,o[a+6]=i,i=i>>8,o[a+5]=i,i=i>>8,o[a+4]=i;let n=Number(e>>BigInt(32)&BigInt(4294967295));return o[a+3]=n,n=n>>8,o[a+2]=n,n=n>>8,o[a+1]=n,n=n>>8,o[a]=n,a+8}h.prototype.writeBigUInt64LE=Xe(function(e,a=0){return Di(this,e,a,BigInt(0),BigInt("0xffffffffffffffff"))});h.prototype.writeBigUInt64BE=Xe(function(e,a=0){return Pi(this,e,a,BigInt(0),BigInt("0xffffffffffffffff"))});h.prototype.writeIntLE=function(e,a,t,r){if(e=+e,a=a>>>0,!r){let c=Math.pow(2,8*t-1);pe(this,e,a,t,c-1,-c)}let i=0,n=1,s=0;for(this[a]=e&255;++i<t&&(n*=256);)e<0&&s===0&&this[a+i-1]!==0&&(s=1),this[a+i]=(e/n>>0)-s&255;return a+t};h.prototype.writeIntBE=function(e,a,t,r){if(e=+e,a=a>>>0,!r){let c=Math.pow(2,8*t-1);pe(this,e,a,t,c-1,-c)}let i=t-1,n=1,s=0;for(this[a+i]=e&255;--i>=0&&(n*=256);)e<0&&s===0&&this[a+i+1]!==0&&(s=1),this[a+i]=(e/n>>0)-s&255;return a+t};h.prototype.writeInt8=function(e,a,t){return e=+e,a=a>>>0,t||pe(this,e,a,1,127,-128),e<0&&(e=255+e+1),this[a]=e&255,a+1};h.prototype.writeInt16LE=function(e,a,t){return e=+e,a=a>>>0,t||pe(this,e,a,2,32767,-32768),this[a]=e&255,this[a+1]=e>>>8,a+2};h.prototype.writeInt16BE=function(e,a,t){return e=+e,a=a>>>0,t||pe(this,e,a,2,32767,-32768),this[a]=e>>>8,this[a+1]=e&255,a+2};h.prototype.writeInt32LE=function(e,a,t){return e=+e,a=a>>>0,t||pe(this,e,a,4,2147483647,-2147483648),this[a]=e&255,this[a+1]=e>>>8,this[a+2]=e>>>16,this[a+3]=e>>>24,a+4};h.prototype.writeInt32BE=function(e,a,t){return e=+e,a=a>>>0,t||pe(this,e,a,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[a]=e>>>24,this[a+1]=e>>>16,this[a+2]=e>>>8,this[a+3]=e&255,a+4};h.prototype.writeBigInt64LE=Xe(function(e,a=0){return Di(this,e,a,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});h.prototype.writeBigInt64BE=Xe(function(e,a=0){return Pi(this,e,a,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});function Mi(o,e,a,t,r,i){if(a+t>o.length)throw new RangeError("Index out of range");if(a<0)throw new RangeError("Index out of range")}function Fi(o,e,a,t,r){return e=+e,a=a>>>0,r||Mi(o,e,a,4,34028234663852886e22,-34028234663852886e22),ba.write(o,e,a,t,23,4),a+4}h.prototype.writeFloatLE=function(e,a,t){return Fi(this,e,a,!0,t)};h.prototype.writeFloatBE=function(e,a,t){return Fi(this,e,a,!1,t)};function qi(o,e,a,t,r){return e=+e,a=a>>>0,r||Mi(o,e,a,8,17976931348623157e292,-17976931348623157e292),ba.write(o,e,a,t,52,8),a+8}h.prototype.writeDoubleLE=function(e,a,t){return qi(this,e,a,!0,t)};h.prototype.writeDoubleBE=function(e,a,t){return qi(this,e,a,!1,t)};h.prototype.copy=function(e,a,t,r){if(!h.isBuffer(e))throw new TypeError("argument should be a Buffer");if(t||(t=0),!r&&r!==0&&(r=this.length),a>=e.length&&(a=e.length),a||(a=0),r>0&&r<t&&(r=t),r===t||e.length===0||this.length===0)return 0;if(a<0)throw new RangeError("targetStart out of bounds");if(t<0||t>=this.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),e.length-a<r-t&&(r=e.length-a+t);let i=r-t;return this===e&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(a,t,r):Uint8Array.prototype.set.call(e,this.subarray(t,r),a),i};h.prototype.fill=function(e,a,t,r){if(typeof e=="string"){if(typeof a=="string"?(r=a,a=0,t=this.length):typeof t=="string"&&(r=t,t=this.length),r!==void 0&&typeof r!="string")throw new TypeError("encoding must be a string");if(typeof r=="string"&&!h.isEncoding(r))throw new TypeError("Unknown encoding: "+r);if(e.length===1){let n=e.charCodeAt(0);(r==="utf8"&&n<128||r==="latin1")&&(e=n)}}else typeof e=="number"?e=e&255:typeof e=="boolean"&&(e=Number(e));if(a<0||this.length<a||this.length<t)throw new RangeError("Out of range index");if(t<=a)return this;a=a>>>0,t=t===void 0?this.length:t>>>0,e||(e=0);let i;if(typeof e=="number")for(i=a;i<t;++i)this[i]=e;else{let n=h.isBuffer(e)?e:h.from(e,r),s=n.length;if(s===0)throw new TypeError('The value "'+e+'" is invalid for argument "value"');for(i=0;i<t-a;++i)this[i+a]=n[i%s]}return this};var va={};function Pt(o,e,a){va[o]=class extends a{constructor(){super(),Object.defineProperty(this,"message",{value:e.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${o}]`,this.stack,delete this.name}get code(){return o}set code(r){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:r,writable:!0})}toString(){return`${this.name} [${o}]: ${this.message}`}}}Pt("ERR_BUFFER_OUT_OF_BOUNDS",function(o){return o?`${o} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError);Pt("ERR_INVALID_ARG_TYPE",function(o,e){return`The "${o}" argument must be of type number. Received type ${typeof e}`},TypeError);Pt("ERR_OUT_OF_RANGE",function(o,e,a){let t=`The value of "${o}" is out of range.`,r=a;return Number.isInteger(a)&&Math.abs(a)>2**32?r=Oi(String(a)):typeof a=="bigint"&&(r=String(a),(a>BigInt(2)**BigInt(32)||a<-(BigInt(2)**BigInt(32)))&&(r=Oi(r)),r+="n"),t+=` It must be ${e}. Received ${r}`,t},RangeError);function Oi(o){let e="",a=o.length,t=o[0]==="-"?1:0;for(;a>=t+4;a-=3)e=`_${o.slice(a-3,a)}${e}`;return`${o.slice(0,a)}${e}`}function el(o,e,a){xa(e,"offset"),(o[e]===void 0||o[e+a]===void 0)&&Ga(e,o.length-(a+1))}function Bi(o,e,a,t,r,i){if(o>a||o<e){let n=typeof e=="bigint"?"n":"",s;throw i>3?e===0||e===BigInt(0)?s=`>= 0${n} and < 2${n} ** ${(i+1)*8}${n}`:s=`>= -(2${n} ** ${(i+1)*8-1}${n}) and < 2 ** ${(i+1)*8-1}${n}`:s=`>= ${e}${n} and <= ${a}${n}`,new va.ERR_OUT_OF_RANGE("value",s,o)}el(t,r,i)}function xa(o,e){if(typeof o!="number")throw new va.ERR_INVALID_ARG_TYPE(e,"number",o)}function Ga(o,e,a){throw Math.floor(o)!==o?(xa(o,a),new va.ERR_OUT_OF_RANGE(a||"offset","an integer",o)):e<0?new va.ERR_BUFFER_OUT_OF_BOUNDS:new va.ERR_OUT_OF_RANGE(a||"offset",`>= ${a?1:0} and <= ${e}`,o)}var al=/[^+/0-9A-Za-z-_]/g;function ol(o){if(o=o.split("=")[0],o=o.trim().replace(al,""),o.length<2)return"";for(;o.length%4!==0;)o=o+"=";return o}function _t(o,e){e=e||1/0;let a,t=o.length,r=null,i=[];for(let n=0;n<t;++n){if(a=o.charCodeAt(n),a>55295&&a<57344){if(!r){if(a>56319){(e-=3)>-1&&i.push(239,191,189);continue}else if(n+1===t){(e-=3)>-1&&i.push(239,191,189);continue}r=a;continue}if(a<56320){(e-=3)>-1&&i.push(239,191,189),r=a;continue}a=(r-55296<<10|a-56320)+65536}else r&&(e-=3)>-1&&i.push(239,191,189);if(r=null,a<128){if((e-=1)<0)break;i.push(a)}else if(a<2048){if((e-=2)<0)break;i.push(a>>6|192,a&63|128)}else if(a<65536){if((e-=3)<0)break;i.push(a>>12|224,a>>6&63|128,a&63|128)}else if(a<1114112){if((e-=4)<0)break;i.push(a>>18|240,a>>12&63|128,a>>6&63|128,a&63|128)}else throw new Error("Invalid code point")}return i}function tl(o){let e=[];for(let a=0;a<o.length;++a)e.push(o.charCodeAt(a)&255);return e}function rl(o,e){let a,t,r,i=[];for(let n=0;n<o.length&&!((e-=2)<0);++n)a=o.charCodeAt(n),t=a>>8,r=a%256,i.push(r),i.push(t);return i}function Vi(o){return yt.toByteArray(ol(o))}function wo(o,e,a,t){let r;for(r=0;r<t&&!(r+a>=e.length||r>=o.length);++r)e[r+a]=o[r];return r}function Me(o,e){return o instanceof e||o!=null&&o.constructor!=null&&o.constructor.name!=null&&o.constructor.name===e.name}function Mt(o){return o!==o}var il=(function(){let o="0123456789abcdef",e=new Array(256);for(let a=0;a<16;++a){let t=a*16;for(let r=0;r<16;++r)e[t+r]=o[a]+o[r]}return e})();function Xe(o){return typeof BigInt>"u"?nl:o}function nl(){throw new Error("BigInt not supported")}});var y,E,f=w(()=>{"use strict";y=ue(To(),1),E={cwd:()=>"/app",env:{NODE_ENV:"production"},argv:[],platform:"browser",versions:{},nextTick:(o,...e)=>queueMicrotask(()=>o(...e))}});function sl(o){return o instanceof Uint8Array||ArrayBuffer.isView(o)&&o.constructor.name==="Uint8Array"}function Xa(o,...e){if(!sl(o))throw new Error("Uint8Array expected");if(e.length>0&&!e.includes(o.length))throw new Error("Uint8Array expected of length "+e+", got length="+o.length)}function Ft(o,e=!0){if(o.destroyed)throw new Error("Hash instance has been destroyed");if(e&&o.finished)throw new Error("Hash#digest() has already been called")}function ji(o,e){Xa(o);let a=e.outputLen;if(o.length<a)throw new Error("digestInto() expects output buffer of length at least "+a)}function Qa(...o){for(let e=0;e<o.length;e++)o[e].fill(0)}function Lo(o){return new DataView(o.buffer,o.byteOffset,o.byteLength)}function we(o,e){return o<<32-e|o>>>e}function Ja(o){if(Xa(o),cl)return o.toHex();let e="";for(let a=0;a<o.length;a++)e+=ll[o[a]];return e}function dl(o){if(typeof o!="string")throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(o))}function qt(o){return typeof o=="string"&&(o=dl(o)),Xa(o),o}function $i(o){let e=t=>o().update(qt(t)).digest(),a=o();return e.outputLen=a.outputLen,e.blockLen=a.blockLen,e.create=()=>o(),e}var cl,ll,_o,Wa=w(()=>{f();cl=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",ll=Array.from({length:256},(o,e)=>e.toString(16).padStart(2,"0"));_o=class{}});function ul(o,e,a,t){if(typeof o.setBigUint64=="function")return o.setBigUint64(e,a,t);let r=BigInt(32),i=BigInt(4294967295),n=Number(a>>r&i),s=Number(a&i),c=t?4:0,l=t?0:4;o.setUint32(e+c,n,t),o.setUint32(e+l,s,t)}function Ui(o,e,a){return o&e^~o&a}function ki(o,e,a){return o&e^o&a^e&a}var Do,Ue,zi=w(()=>{f();Wa();Do=class extends _o{constructor(e,a,t,r){super(),this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.blockLen=e,this.outputLen=a,this.padOffset=t,this.isLE=r,this.buffer=new Uint8Array(e),this.view=Lo(this.buffer)}update(e){Ft(this),e=qt(e),Xa(e);let{view:a,buffer:t,blockLen:r}=this,i=e.length;for(let n=0;n<i;){let s=Math.min(r-this.pos,i-n);if(s===r){let c=Lo(e);for(;r<=i-n;n+=r)this.process(c,n);continue}t.set(e.subarray(n,n+s),this.pos),this.pos+=s,n+=s,this.pos===r&&(this.process(a,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){Ft(this),ji(e,this),this.finished=!0;let{buffer:a,view:t,blockLen:r,isLE:i}=this,{pos:n}=this;a[n++]=128,Qa(this.buffer.subarray(n)),this.padOffset>r-n&&(this.process(t,0),n=0);for(let u=n;u<r;u++)a[u]=0;ul(t,r-8,BigInt(this.length*8),i),this.process(t,0);let s=Lo(e),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen should be aligned to 32bit");let l=c/4,d=this.get();if(l>d.length)throw new Error("_sha2: outputLen bigger than state");for(let u=0;u<l;u++)s.setUint32(4*u,d[u],i)}digest(){let{buffer:e,outputLen:a}=this;this.digestInto(e);let t=e.slice(0,a);return this.destroy(),t}_cloneInto(e){e||(e=new this.constructor),e.set(...this.get());let{blockLen:a,buffer:t,length:r,finished:i,destroyed:n,pos:s}=this;return e.destroyed=n,e.finished=i,e.length=r,e.pos=s,r%a&&e.buffer.set(t),e}clone(){return this._cloneInto()}},Ue=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225])});var pl,Qe,Po,Hi,Gi=w(()=>{f();zi();Wa();pl=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),Qe=new Uint32Array(64),Po=class extends Do{constructor(e=32){super(64,e,8,!1),this.A=Ue[0]|0,this.B=Ue[1]|0,this.C=Ue[2]|0,this.D=Ue[3]|0,this.E=Ue[4]|0,this.F=Ue[5]|0,this.G=Ue[6]|0,this.H=Ue[7]|0}get(){let{A:e,B:a,C:t,D:r,E:i,F:n,G:s,H:c}=this;return[e,a,t,r,i,n,s,c]}set(e,a,t,r,i,n,s,c){this.A=e|0,this.B=a|0,this.C=t|0,this.D=r|0,this.E=i|0,this.F=n|0,this.G=s|0,this.H=c|0}process(e,a){for(let u=0;u<16;u++,a+=4)Qe[u]=e.getUint32(a,!1);for(let u=16;u<64;u++){let p=Qe[u-15],m=Qe[u-2],g=we(p,7)^we(p,18)^p>>>3,v=we(m,17)^we(m,19)^m>>>10;Qe[u]=v+Qe[u-7]+g+Qe[u-16]|0}let{A:t,B:r,C:i,D:n,E:s,F:c,G:l,H:d}=this;for(let u=0;u<64;u++){let p=we(s,6)^we(s,11)^we(s,25),m=d+p+Ui(s,c,l)+pl[u]+Qe[u]|0,v=(we(t,2)^we(t,13)^we(t,22))+ki(t,r,i)|0;d=l,l=c,c=s,s=n+m|0,n=i,i=r,r=t,t=m+v|0}t=t+this.A|0,r=r+this.B|0,i=i+this.C|0,n=n+this.D|0,s=s+this.E|0,c=c+this.F|0,l=l+this.G|0,d=d+this.H|0,this.set(t,r,i,n,s,c,l,d)}roundClean(){Qa(Qe)}destroy(){this.set(0,0,0,0,0,0,0,0),Qa(this.buffer)}},Hi=$i(()=>new Po)});var Za,Bt=w(()=>{f();Gi();Za=Hi});var Ne=So((rm,Qi)=>{"use strict";f();function Fe(o){if(typeof o!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(o))}function Xi(o,e){for(var a="",t=0,r=-1,i=0,n,s=0;s<=o.length;++s){if(s<o.length)n=o.charCodeAt(s);else{if(n===47)break;n=47}if(n===47){if(!(r===s-1||i===1))if(r!==s-1&&i===2){if(a.length<2||t!==2||a.charCodeAt(a.length-1)!==46||a.charCodeAt(a.length-2)!==46){if(a.length>2){var c=a.lastIndexOf("/");if(c!==a.length-1){c===-1?(a="",t=0):(a=a.slice(0,c),t=a.length-1-a.lastIndexOf("/")),r=s,i=0;continue}}else if(a.length===2||a.length===1){a="",t=0,r=s,i=0;continue}}e&&(a.length>0?a+="/..":a="..",t=2)}else a.length>0?a+="/"+o.slice(r+1,s):a=o.slice(r+1,s),t=s-r-1;r=s,i=0}else n===46&&i!==-1?++i:i=-1}return a}function ml(o,e){var a=e.dir||e.root,t=e.base||(e.name||"")+(e.ext||"");return a?a===e.root?a+t:a+o+t:t}var Ia={resolve:function(){for(var e="",a=!1,t,r=arguments.length-1;r>=-1&&!a;r--){var i;r>=0?i=arguments[r]:(t===void 0&&(t=E.cwd()),i=t),Fe(i),i.length!==0&&(e=i+"/"+e,a=i.charCodeAt(0)===47)}return e=Xi(e,!a),a?e.length>0?"/"+e:"/":e.length>0?e:"."},normalize:function(e){if(Fe(e),e.length===0)return".";var a=e.charCodeAt(0)===47,t=e.charCodeAt(e.length-1)===47;return e=Xi(e,!a),e.length===0&&!a&&(e="."),e.length>0&&t&&(e+="/"),a?"/"+e:e},isAbsolute:function(e){return Fe(e),e.length>0&&e.charCodeAt(0)===47},join:function(){if(arguments.length===0)return".";for(var e,a=0;a<arguments.length;++a){var t=arguments[a];Fe(t),t.length>0&&(e===void 0?e=t:e+="/"+t)}return e===void 0?".":Ia.normalize(e)},relative:function(e,a){if(Fe(e),Fe(a),e===a||(e=Ia.resolve(e),a=Ia.resolve(a),e===a))return"";for(var t=1;t<e.length&&e.charCodeAt(t)===47;++t);for(var r=e.length,i=r-t,n=1;n<a.length&&a.charCodeAt(n)===47;++n);for(var s=a.length,c=s-n,l=i<c?i:c,d=-1,u=0;u<=l;++u){if(u===l){if(c>l){if(a.charCodeAt(n+u)===47)return a.slice(n+u+1);if(u===0)return a.slice(n+u)}else i>l&&(e.charCodeAt(t+u)===47?d=u:u===0&&(d=0));break}var p=e.charCodeAt(t+u),m=a.charCodeAt(n+u);if(p!==m)break;p===47&&(d=u)}var g="";for(u=t+d+1;u<=r;++u)(u===r||e.charCodeAt(u)===47)&&(g.length===0?g+="..":g+="/..");return g.length>0?g+a.slice(n+d):(n+=d,a.charCodeAt(n)===47&&++n,a.slice(n))},_makeLong:function(e){return e},dirname:function(e){if(Fe(e),e.length===0)return".";for(var a=e.charCodeAt(0),t=a===47,r=-1,i=!0,n=e.length-1;n>=1;--n)if(a=e.charCodeAt(n),a===47){if(!i){r=n;break}}else i=!1;return r===-1?t?"/":".":t&&r===1?"//":e.slice(0,r)},basename:function(e,a){if(a!==void 0&&typeof a!="string")throw new TypeError('"ext" argument must be a string');Fe(e);var t=0,r=-1,i=!0,n;if(a!==void 0&&a.length>0&&a.length<=e.length){if(a.length===e.length&&a===e)return"";var s=a.length-1,c=-1;for(n=e.length-1;n>=0;--n){var l=e.charCodeAt(n);if(l===47){if(!i){t=n+1;break}}else c===-1&&(i=!1,c=n+1),s>=0&&(l===a.charCodeAt(s)?--s===-1&&(r=n):(s=-1,r=c))}return t===r?r=c:r===-1&&(r=e.length),e.slice(t,r)}else{for(n=e.length-1;n>=0;--n)if(e.charCodeAt(n)===47){if(!i){t=n+1;break}}else r===-1&&(i=!1,r=n+1);return r===-1?"":e.slice(t,r)}},extname:function(e){Fe(e);for(var a=-1,t=0,r=-1,i=!0,n=0,s=e.length-1;s>=0;--s){var c=e.charCodeAt(s);if(c===47){if(!i){t=s+1;break}continue}r===-1&&(i=!1,r=s+1),c===46?a===-1?a=s:n!==1&&(n=1):a!==-1&&(n=-1)}return a===-1||r===-1||n===0||n===1&&a===r-1&&a===t+1?"":e.slice(a,r)},format:function(e){if(e===null||typeof e!="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof e);return ml("/",e)},parse:function(e){Fe(e);var a={root:"",dir:"",base:"",ext:"",name:""};if(e.length===0)return a;var t=e.charCodeAt(0),r=t===47,i;r?(a.root="/",i=1):i=0;for(var n=-1,s=0,c=-1,l=!0,d=e.length-1,u=0;d>=i;--d){if(t=e.charCodeAt(d),t===47){if(!l){s=d+1;break}continue}c===-1&&(l=!1,c=d+1),t===46?n===-1?n=d:u!==1&&(u=1):n!==-1&&(u=-1)}return n===-1||c===-1||u===0||u===1&&n===c-1&&n===s+1?c!==-1&&(s===0&&r?a.base=a.name=e.slice(1,c):a.base=a.name=e.slice(s,c)):(s===0&&r?(a.name=e.slice(1,n),a.base=e.slice(1,c)):(a.name=e.slice(s,n),a.base=e.slice(s,c)),a.ext=e.slice(n,c)),s>0?a.dir=e.slice(0,s-1):r&&(a.dir="/"),a},sep:"/",delimiter:":",win32:null,posix:null};Ia.posix=Ia;Qi.exports=Ia});function Te(o,e,a){let t=new Error(`${o}: ${e} '${a}'`);return t.code=o,t.path=a,t}function Yi(o){return typeof o=="string"?Ji.encode(o):o instanceof Uint8Array?o:o instanceof ArrayBuffer?new Uint8Array(o):ArrayBuffer.isView(o)?new Uint8Array(o.buffer,o.byteOffset,o.byteLength):Ji.encode(String(o))}function hl(o){return typeof o=="string"?o:o&&typeof o=="object"&&"encoding"in o?o.encoding??null:null}function Wi(o,e){let a=new Uint8Array(o.length+e.length);return a.set(o,0),a.set(e,o.length),a}function jt(o){for(let e=o;!ce.has(e);e=Ea.default.dirname(e))ce.add(e),Re.add(e)}function $t(o,e){jt(Ea.default.dirname(o)),G.set(o,e),Re.add(o)}function vl(o,e){return fl.test(o)?{tipo:"resumo",cabeca:e.slice(0,Vt),hash:Za.create().update(e),hashFinal:null,tamanho:e.length,mtimeMs:qo()}:{tipo:"arq",dados:e,mtimeMs:qo()}}function Bo(o){return o.tipo==="arq"?o.dados:o.cabeca}function bl(o){return Zi.Buffer.from(o.buffer,o.byteOffset,o.byteLength)}function k(o){let e=re(o);return G.has(e)||ce.has(e)}function ae(o,e){jt(re(o))}function P(o,e){let a=re(o),t=G.get(a);if(!t)throw Te(ce.has(a)?"EISDIR":"ENOENT","open",a);return hl(e)?gl.decode(Bo(t)):bl(Bo(t))}function $(o,e,a){let t=re(o);$t(t,vl(t,Yi(e)))}function Vo(o,e,a){let t=re(o),r=G.get(t),i=Yi(e);if(!r)return $(t,i);if(r.tipo==="arq"){$t(t,{tipo:"arq",dados:Wi(r.dados,i),mtimeMs:qo()});return}if(!r.hash)throw Te("EPERM","append (resumo sem estado de hash)",t);r.hash.update(i),r.hashFinal=null,r.tamanho+=i.length,r.cabeca.length<Vt&&(r.cabeca=Wi(r.cabeca,i.subarray(0,Vt-r.cabeca.length))),r.mtimeMs=qo(),Re.add(t)}function _e(o){let e=re(o);if(!ce.has(e))throw Te(G.has(e)?"ENOTDIR":"ENOENT","scandir",e);let a=e==="/"?"/":e+"/",t=new Set;for(let r of[...G.keys(),...ce])r!==e&&r.startsWith(a)&&t.add(r.slice(a.length).split("/")[0]);return[...t].sort()}function Ya(o){let e=re(o),a=G.get(e);if(!a&&!ce.has(e))throw Te("ENOENT","stat",e);let t=a?a.tipo==="arq"?a.dados.length:a.tamanho:0,r=a?.mtimeMs??0;return{size:t,mtimeMs:r,mtime:new Date(r),isFile:()=>!!a,isDirectory:()=>!a}}function be(o,e={}){let a=re(o);if(G.delete(a)){Re.add(a);return}if(!ce.has(a)){if(e.force)return;throw Te("ENOENT","rm",a)}let t=a+"/",r=[...G.keys(),...ce].filter(i=>i.startsWith(t));if(r.length&&!e.recursive)throw Te("ENOTEMPTY","rm",a);for(let i of r)G.delete(i),ce.delete(i),Re.add(i);a!=="/"&&(ce.delete(a),Re.add(a))}function Ut(o,e){let a=re(o),t=re(e),r=G.get(a);if(!r)throw Te("ENOENT","rename",a);G.delete(a),Re.add(a),$t(t,r)}function kt(o,e){let a=G.get(re(o));if(!a)throw Te("ENOENT","copyfile",re(o));$(e,Bo(a).slice())}function Ka(o){let e=re(o+Math.random().toString(36).slice(2,8));return jt(e),e}function $o(o,e){let a=re(o);if(!G.has(a))throw Te("ENOENT","open",a);let t=Al++;return jo.set(t,{caminho:a,posicao:0}),t}function Uo(o,e,a,t,r){let i=jo.get(o);if(!i)throw Te("EBADF","read",String(o));let n=Bo(G.get(i.caminho)),s=r??i.posicao,c=n.subarray(s,s+t);return e.set(c,a),r==null&&(i.posicao+=c.length),c.length}function ko(o){jo.delete(o)}function zo(o){let e=re(o),a=G.get(e);if(!a)throw Te("ENOENT","open",e);return a.tipo==="arq"?Ja(Za(a.dados)):(a.hashFinal||(a.hashFinal=Ja(a.hash.clone().digest())),a.hashFinal)}function Ki(o,e){let a=re(o);$(a,e),Mo.add(a),Re.delete(a)}function zt(o,e){e.tipo==="dir"?ce.add(o):e.tipo==="arq"?G.set(o,{tipo:"arq",dados:e.dados,mtimeMs:e.mtimeMs}):G.set(o,{tipo:"resumo",cabeca:e.cabeca,hash:null,hashFinal:e.hashFinal,tamanho:e.tamanho,mtimeMs:e.mtimeMs}),Fo=Math.max(Fo,"mtimeMs"in e?e.mtimeMs:0)}function en(){for(let e of[...G.keys()])Mo.has(e)||G.delete(e);let o=new Set(["/"]);for(let e of Mo)for(let a=Ea.default.dirname(e);!o.has(a);a=Ea.default.dirname(a))o.add(a);for(let e of[...ce])o.has(e)||ce.delete(e);jo.clear(),Re.clear()}function an(o){for(let e of o)Re.add(e)}function on(){let o=[];for(let e of Re){if(Mo.has(e))continue;let a=G.get(e);a?.tipo==="arq"?o.push([e,{tipo:"arq",dados:a.dados,mtimeMs:a.mtimeMs}]):a?o.push([e,{tipo:"resumo",cabeca:a.cabeca,hashFinal:zo(e),tamanho:a.tamanho,mtimeMs:a.mtimeMs}]):ce.has(e)?o.push([e,{tipo:"dir"}]):o.push([e,null])}return Re.clear(),o}var Zi,Ea,fl,Vt,G,ce,Mo,Re,Fo,qo,re,Ji,gl,xl,jo,Al,me,le=w(()=>{"use strict";f();Zi=ue(To(),1);Bt();Wa();Ea=ue(Ne(),1),fl=/\/explicacoes\.json$/,Vt=1024*1024,G=new Map,ce=new Set(["/"]),Mo=new Set,Re=new Set,Fo=Date.now(),qo=()=>Fo=Math.max(Fo+1,Date.now()),re=o=>Ea.default.resolve(String(o)),Ji=new TextEncoder,gl=new TextDecoder;xl=o=>be(o);jo=new Map,Al=10;me={existsSync:k,mkdirSync:ae,readFileSync:P,writeFileSync:$,appendFileSync:Vo,readdirSync:_e,statSync:Ya,rmSync:be,unlinkSync:xl,renameSync:Ut,copyFileSync:kt,mkdtempSync:Ka,openSync:$o,readSync:Uo,closeSync:ko,__sha256:zo}});function Gt(){return{use:(...o)=>{},get:(o,...e)=>{Ht.push({metodo:"GET",caminho:o,handlers:e})},post:(o,...e)=>{Ht.push({metodo:"POST",caminho:o,handlers:e})},listen:(o,e)=>e?.()}}function Xt(o,e,a,t,r){let i=Ht.find(n=>n.metodo===o&&n.caminho===e);return i?new Promise(n=>{let s=p=>{console.error(p),n(Ho(500,{erro:"Erro interno.",detalhe:p instanceof Error?p.message:String(p)}))},c={statusCode:200,status(p){return c.statusCode=p,c},set(){return c},setHeader(){return c},json(p){return n(Ho(c.statusCode,p)),c},send(p){return n(typeof p=="string"?{status:c.statusCode,corpo:p,tipo:"text/html; charset=utf-8"}:Ho(c.statusCode,p)),c}},l={method:o,path:e,query:a,body:t??{},headers:{},__arquivos:r},d=0,u=p=>{if(p)return s(p);let m=i.handlers[d++];if(m)try{let g=m(l,c,u);g&&typeof g.then=="function"&&g.then(void 0,s)}catch(g){s(g)}};u()}):Promise.resolve(Ho(404,{erro:`Rota n\xE3o encontrada: ${o} ${e}`}))}var Ht,Ho,eo,Qt=w(()=>{"use strict";f();Ht=[];Gt.json=()=>(o,e,a)=>a();Gt.static=o=>(e,a,t)=>t();Ho=(o,e)=>({status:o,corpo:JSON.stringify(e),tipo:"application/json; charset=utf-8"});eo=Gt});function Jt(o){return o.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().split(/[^a-z0-9]+/).filter(e=>e.length>=3&&!Il.has(e)&&!/^\d+$/.test(e))}function rn(o){return o.endsWith("oes")||o.endsWith("aes")?o.slice(0,-3)+"ao":o.endsWith("es")&&o.length>4?o.slice(0,-2):o.endsWith("s")&&o.length>3?o.slice(0,-1):o}function Nl(o,e){let a=rn(o),t=rn(e);return a===t||t.length>=4&&a.startsWith(t)||a.length>=4&&t.startsWith(a)}function Wt(o){if(!o)return null;let e=/comumente denominad[oa]s?\s+([^,;(]+)/i.exec(o);if(e)return e[1].trim();let a=o.split(/\s+d[oa]s?\s+c[óo]digos?\b|\s+da NCM\b|\s+classificad|\s+d[aoe]s?\s+(?:sub)?posi[çc]|\(/i)[0].trim();if(/,|;|\s(e|ou)\s/i.test(a))return null;let t=Jt(a);return t.length===0||Cl.has(t[0])?null:t.length<=3?a:null}function Rl(o,e){return o&&/comumente denominad/i.test(o)?!0:!!e&&/^[\s-]*outr[oa]s?\b/i.test(e)}function Go(o,e,a){if(!Rl(e,a))return null;let t=Wt(e);if(!t)return null;let r=Jt(o);if(r.filter(n=>!El.has(n)).length===0)return null;let i=Jt(t).filter(n=>!r.some(s=>Nl(n,s)));return i.length===0?null:{designacaoLegal:t,motivo:`A descri\xE7\xE3o "${o}" n\xE3o corresponde a "${t}", produto definido pela lei para esta regra (falta: ${i.join(", ")}).`}}var Il,El,Cl,Zt=w(()=>{"use strict";f();Il=new Set(["de","do","da","dos","das","e","ou","em","com","para","por","a","o","os","as","um","uma"]),El=new Set(["produto","produtos","item","itens","mercadoria","mercadorias","diversos","diversas","outros","outras","und","unid","unidade","pct","pacote","cxa","caixa","kg","kgs","grs","lt","ltr","litro","especial","tipo"]),Cl=new Set(["produtos","produto","artigos","preparacoes","partes","acessorios","demais","outros","outras","mercadorias"])});function Ol(o,e,a){return Go(o,e,a)?.motivo??null}function nn(o){return o===null?"redu\xE7\xE3o n\xE3o dispon\xEDvel":`${Math.round(o*100)}%`}function sn(o,e,a,t={}){let r=a.map(c=>{let l=Wt(c.descricaoLegal);return{tipo:"REGRA",regraId:c.id,rotulo:l?`\xC9 ${l} (Anexo ${c.anexo??"?"}, item ${c.item??"?"})`:`Atende \xE0 descri\xE7\xE3o legal do Anexo ${c.anexo??"?"}, item ${c.item??"?"}`,resultado:`${c.reducaoAliquota!==null&&c.reducaoAliquota>=1?"Redu\xE7\xE3o de 100%":`Redu\xE7\xE3o de ${nn(c.reducaoAliquota)}`} \xB7 CST ${c.cst??"?"} \xB7 cClassTrib ${c.cClassTrib??"?"}`,explicacao:`${c.fundamentoLegal??"LC 214/2025"}. Vale s\xF3 se o produto corresponder \xE0 descri\xE7\xE3o legal da regra.`,naoRecomendada:Ol(e,c.descricaoLegal,c.descricaoNcmTipi)}});(t.consumoNoLocal||a.some(c=>c.anexo!==null&&Sl.has(c.anexo)))&&r.push({tipo:"CONSUMO_NO_LOCAL",regraId:null,rotulo:"Preparado e servido para consumo no local (bar, restaurante, lanchonete)",resultado:`Redu\xE7\xE3o de 40% \xB7 CST ${Yt.cst} \xB7 cClassTrib ${Yt.cClassTrib}`,explicacao:`Regime espec\xEDfico de bares e restaurantes (${Yt.fundamento}). N\xE3o vale para venda de mercadoria para levar.`,naoRecomendada:null});let i=[...new Set(a.map(c=>c.reducaoAliquota).filter(c=>c!==null))].sort((c,l)=>l-c),n=a.length?`Regras de benef\xEDcio do NCM ${o} verificadas: ${a.map(c=>`Anexo ${c.anexo??"?"} (${nn(c.reducaoAliquota)})`).join(", ")}.`:`Nenhuma regra de benef\xEDcio para o NCM ${o}.`,s=i.some(c=>Math.abs(c-.6)<1e-9)?"":` N\xE3o h\xE1 regra de redu\xE7\xE3o de 60% para o NCM ${o}.`;return r.push({tipo:"MERCADORIA_SEM_BENEFICIO",regraId:null,rotulo:a.length?`Vendido como mercadoria; n\xE3o corresponde \xE0s regras acima; NCM ${o} correto`:`Vendido como mercadoria (revenda ou para levar); NCM ${o} correto`,resultado:"Tributa\xE7\xE3o integral \xB7 CST 000 \xB7 cClassTrib 000001",explicacao:`${n}${s} O regime de bares e restaurantes n\xE3o se aplica a mercadoria.`,naoRecomendada:null}),r.push({tipo:"NCM_INCORRETO",regraId:null,rotulo:"O NCM informado est\xE1 errado",resultado:"Corrigir o NCM no cadastro do ERP e reprocessar com as novas notas",explicacao:"Nenhum benef\xEDcio \xE9 aplicado agora: o benef\xEDcio de outro NCM n\xE3o \xE9 transferido para o NCM informado.",naoRecomendada:null}),r}var Yt,Sl,cn=w(()=>{"use strict";f();Zt();Yt={cst:"200",cClassTrib:"200047",reducao:.4,fundamento:"LC 214/2025, art. 275"},Sl=new Set(["I","VII","XV"])});function Kt(o){return{array(e,a=1/0){return(t,r,i)=>{let n=(t.__arquivos??[]).filter(s=>s.campo===e);if(n.length>a)return i(new Error(`Mais de ${a} arquivos enviados.`));t.files=n.map(s=>{let c=ln.default.join(o.dest,`${Date.now()}-${++yl}`);return $(c,new Uint8Array(s.dados)),{fieldname:e,originalname:s.nome,path:c,size:s.dados.byteLength}}),i()}}}}var ln,yl,dn=w(()=>{"use strict";f();ln=ue(Ne(),1);le();yl=0});function Vl(o,e){return ql(o,{i:2},e&&e.out,e&&e.dictionary)}function Ul(o,e){if(e){for(var a="",t=0;t<o.length;t+=16384)a+=String.fromCharCode.apply(null,o.subarray(t,t+16384));return a}else{if(rr)return rr.decode(o);var r=$l(o),i=r.s,a=r.r;return a.length&&xe(8),i}}function bn(o,e){for(var a={},t=o.length-22;Se(o,t)!=101010256;--t)(!t||o.length-t>65558)&&xe(13);var r=qe(o,t+8);if(!r)return{};var i=Se(o,t+16),n=Se(o,t-20)==117853008;if(n){var s=Se(o,t-12);n=Se(o,s)==101075792,n&&(r=Se(o,s+32),i=Se(o,s+48))}for(var c=e&&e.filter,l=0;l<r;++l){var d=zl(o,i,n),u=d[0],p=d[1],m=d[2],g=d[3],v=d[4],C=d[5],S=kl(o,C);i=v,(!c||c({name:g,size:p,originalSize:m,compression:u}))&&(u?u==8?a[g]=Vl(o.subarray(S,S+p),{out:new Ae(m)}):xe(14,"unknown compression type "+u):a[g]=ir(o,S,S+p))}return a}var Ae,Ca,wl,un,pn,Tl,mn,fn,gn,_l,hn,Ll,xm,tr,ke,F,ao,oo,F,F,F,F,vn,F,Dl,Pl,er,Le,ar,Ml,ir,Fl,xe,ql,Bl,qe,Se,or,rr,jl,$l,kl,zl,Hl,xn=w(()=>{f();Ae=Uint8Array,Ca=Uint16Array,wl=Int32Array,un=new Ae([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),pn=new Ae([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Tl=new Ae([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),mn=function(o,e){for(var a=new Ca(31),t=0;t<31;++t)a[t]=e+=1<<o[t-1];for(var r=new wl(a[30]),t=1;t<30;++t)for(var i=a[t];i<a[t+1];++i)r[i]=i-a[t]<<5|t;return{b:a,r}},fn=mn(un,2),gn=fn.b,_l=fn.r;gn[28]=258,_l[258]=28;hn=mn(pn,0),Ll=hn.b,xm=hn.r,tr=new Ca(32768);for(F=0;F<32768;++F)ke=(F&43690)>>1|(F&21845)<<1,ke=(ke&52428)>>2|(ke&13107)<<2,ke=(ke&61680)>>4|(ke&3855)<<4,tr[F]=((ke&65280)>>8|(ke&255)<<8)>>1;ao=(function(o,e,a){for(var t=o.length,r=0,i=new Ca(e);r<t;++r)o[r]&&++i[o[r]-1];var n=new Ca(e);for(r=1;r<e;++r)n[r]=n[r-1]+i[r-1]<<1;var s;if(a){s=new Ca(1<<e);var c=15-e;for(r=0;r<t;++r)if(o[r])for(var l=r<<4|o[r],d=e-o[r],u=n[o[r]-1]++<<d,p=u|(1<<d)-1;u<=p;++u)s[tr[u]>>c]=l}else for(s=new Ca(t),r=0;r<t;++r)o[r]&&(s[r]=tr[n[o[r]-1]++]>>15-o[r]);return s}),oo=new Ae(288);for(F=0;F<144;++F)oo[F]=8;for(F=144;F<256;++F)oo[F]=9;for(F=256;F<280;++F)oo[F]=7;for(F=280;F<288;++F)oo[F]=8;vn=new Ae(32);for(F=0;F<32;++F)vn[F]=5;Dl=ao(oo,9,1),Pl=ao(vn,5,1),er=function(o){for(var e=o[0],a=1;a<o.length;++a)o[a]>e&&(e=o[a]);return e},Le=function(o,e,a){var t=e/8|0;return(o[t]|o[t+1]<<8)>>(e&7)&a},ar=function(o,e){var a=e/8|0;return(o[a]|o[a+1]<<8|o[a+2]<<16)>>(e&7)},Ml=function(o){return(o+7)/8|0},ir=function(o,e,a){return(e==null||e<0)&&(e=0),(a==null||a>o.length)&&(a=o.length),new Ae(o.subarray(e,a))},Fl=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],xe=function(o,e,a){var t=new Error(e||Fl[o]);if(t.code=o,Error.captureStackTrace&&Error.captureStackTrace(t,xe),!a)throw t;return t},ql=function(o,e,a,t){var r=o.length,i=t?t.length:0;if(!r||e.f&&!e.l)return a||new Ae(0);var n=!a,s=n||e.i!=2,c=e.i;n&&(a=new Ae(r*3));var l=function(se){var Ge=a.length;if(se>Ge){var Ve=new Ae(Math.max(Ge*2,se));Ve.set(a),a=Ve}},d=e.f||0,u=e.p||0,p=e.b||0,m=e.l,g=e.d,v=e.m,C=e.n,S=r*8;do{if(!m){d=Le(o,u,1);var T=Le(o,u+1,3);if(u+=3,T)if(T==1)m=Dl,g=Pl,v=9,C=5;else if(T==2){var O=Le(o,u,31)+257,A=Le(o,u+10,15)+4,x=O+Le(o,u+5,31)+1;u+=14;for(var R=new Ae(x),D=new Ae(19),_=0;_<A;++_)D[Tl[_]]=Le(o,u+_*3,7);u+=A*3;for(var j=er(D),Be=(1<<j)-1,ee=ao(D,j,1),_=0;_<x;){var He=ee[Le(o,u,Be)];u+=He&15;var N=He>>4;if(N<16)R[_++]=N;else{var Q=0,ie=0;for(N==16?(ie=3+Le(o,u,3),u+=2,Q=R[_-1]):N==17?(ie=3+Le(o,u,7),u+=3):N==18&&(ie=11+Le(o,u,127),u+=7);ie--;)R[_++]=Q}}var oe=R.subarray(0,O),te=R.subarray(O);v=er(oe),C=er(te),m=ao(oe,v,1),g=ao(te,C,1)}else xe(1);else{var N=Ml(u)+4,L=o[N-4]|o[N-3]<<8,b=N+L;if(b>r){c&&xe(0);break}s&&l(p+L),a.set(o.subarray(N,b),p),e.b=p+=L,e.p=u=b*8,e.f=d;continue}if(u>S){c&&xe(0);break}}s&&l(p+131072);for(var ne=(1<<v)-1,No=(1<<C)-1,za=u;;za=u){var Q=m[ar(o,u)&ne],ea=Q>>4;if(u+=Q&15,u>S){c&&xe(0);break}if(Q||xe(2),ea<256)a[p++]=ea;else if(ea==256){za=u,m=null;break}else{var Nt=ea-254;if(ea>264){var _=ea-257,ye=un[_];Nt=Le(o,u,(1<<ye)-1)+gn[_],u+=ye}var aa=g[ar(o,u)&No],Ha=aa>>4;aa||xe(3),u+=aa&15;var te=Ll[Ha];if(Ha>3){var ye=pn[Ha];te+=ar(o,u)&(1<<ye)-1,u+=ye}if(u>S){c&&xe(0);break}s&&l(p+131072);var I=p+Nt;if(p<te){var q=i-te,Z=Math.min(te,I);for(q+p<0&&xe(3);p<Z;++p)a[p]=t[q+p]}for(;p<I;++p)a[p]=a[p-te]}}e.l=m,e.p=za,e.b=p,e.f=d,m&&(d=1,e.m=v,e.d=g,e.n=C)}while(!d);return p!=a.length&&n?ir(a,0,p):a.subarray(0,p)},Bl=new Ae(0),qe=function(o,e){return o[e]|o[e+1]<<8},Se=function(o,e){return(o[e]|o[e+1]<<8|o[e+2]<<16|o[e+3]<<24)>>>0},or=function(o,e){return Se(o,e)+Se(o,e+4)*4294967296};rr=typeof TextDecoder<"u"&&new TextDecoder,jl=0;try{rr.decode(Bl,{stream:!0}),jl=1}catch{}$l=function(o){for(var e="",a=0;;){var t=o[a++],r=(t>127)+(t>223)+(t>239);if(a+r>o.length)return{s:e,r:ir(o,a-1)};r?r==3?(t=((t&15)<<18|(o[a++]&63)<<12|(o[a++]&63)<<6|o[a++]&63)-65536,e+=String.fromCharCode(55296|t>>10,56320|t&1023)):r&1?e+=String.fromCharCode((t&31)<<6|o[a++]&63):e+=String.fromCharCode((t&15)<<12|(o[a++]&63)<<6|o[a++]&63):e+=String.fromCharCode(t)}};kl=function(o,e){return e+30+qe(o,e+26)+qe(o,e+28)},zl=function(o,e,a){var t=qe(o,e+28),r=qe(o,e+30),i=Ul(o.subarray(e+46,e+46+t),!(qe(o,e+8)&2048)),n=e+46+t,s=Hl(o,n,r,a,Se(o,e+20),Se(o,e+24),Se(o,e+42)),c=s[0],l=s[1],d=s[2];return[qe(o,e+10),c,l,i,n+r+qe(o,e+32),d]},Hl=function(o,e,a,t,r,i,n){var s=r==4294967295,c=i==4294967295,l=n==4294967295,d=e+a,u=s+c+l;if(t&&u){for(;e+4<d;e+=4+qe(o,e+2))if(qe(o,e)==1)return[s?or(o,e+4+8*c):r,c?or(o,e+4):i,l?or(o,e+4+8*(c+s)):n,1];t<2&&xe(13)}return[r,i,n,0]}});function Qo(o,e){if(o!=="unzip")throw new Error(`comando indispon\xEDvel no navegador: ${o}`);let a=e.indexOf("-d"),t=e[a+1],r=e.find((n,s)=>!n.startsWith("-")&&s!==a+1),i=bn(P(r));for(let[n,s]of Object.entries(i)){if(n.endsWith("/"))continue;let c=Xo.default.join(t,Xo.default.normalize("/"+n));ae(Xo.default.dirname(c),{recursive:!0}),$(c,s)}}var Xo,nr=w(()=>{"use strict";f();xn();Xo=ue(Ne(),1);le()});var Jo,sr=w(()=>{"use strict";f();Jo=()=>"/tmp"});function In(o,e){let a=[],t=e.exec(o);for(;t;){let r=[];r.startIndex=e.lastIndex-t[0].length;let i=t.length;for(let n=0;n<i;n++)r.push(t[n]);a.push(r),t=e.exec(o)}return a}function En(o){return typeof o<"u"}var An,Gl,Xl,Ql,cr,to,Wo,Zo=w(()=>{"use strict";f();An=":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",Gl=An+"\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040",Xl="["+An+"]["+Gl+"]*",Ql=new RegExp("^"+Xl+"$");cr=function(o){let e=Ql.exec(o);return!(e===null||typeof e>"u")};to=["hasOwnProperty","toString","valueOf","__defineGetter__","__defineSetter__","__lookupGetter__","__lookupSetter__"],Wo=["__proto__","constructor","prototype"]});function Sn(o,e){e=Object.assign({},Jl,e);let a=[],t=!1,r=!1;o[0]==="\uFEFF"&&(o=o.substr(1));for(let i=0;i<o.length;i++)if(o[i]==="<"&&o[i+1]==="?"){if(i+=2,i=Cn(o,i),i.err)return i}else if(o[i]==="<"){let n=i;if(i++,o[i]==="!"){i=Nn(o,i);continue}else{let s=!1;o[i]==="/"&&(s=!0,i++);let c="";for(;i<o.length&&o[i]!==">"&&o[i]!==" "&&o[i]!=="	"&&o[i]!==`
`&&o[i]!=="\r";i++)c+=o[i];if(c=c.trim(),c[c.length-1]==="/"&&(c=c.substring(0,c.length-1),i--),!td(c)){let u;return c.trim().length===0?u="Invalid space after '<'.":u="Tag '"+c+"' is an invalid name.",X("InvalidTag",u,de(o,i))}let l=Yl(o,i);if(l===!1)return X("InvalidAttr","Attributes for '"+c+"' have open quote.",de(o,i));let d=l.value;if(i=l.index,d[d.length-1]==="/"){let u=i-d.length;d=d.substring(0,d.length-1);let p=Rn(d,e);if(p===!0)t=!0;else return X(p.err.code,p.err.msg,de(o,u+p.err.line))}else if(s)if(l.tagClosed){if(d.trim().length>0)return X("InvalidTag","Closing tag '"+c+"' can't have attributes or invalid starting.",de(o,n));if(a.length===0)return X("InvalidTag","Closing tag '"+c+"' has not been opened.",de(o,n));{let u=a.pop();if(c!==u.tagName){let p=de(o,u.tagStartPos);return X("InvalidTag","Expected closing tag '"+u.tagName+"' (opened in line "+p.line+", col "+p.col+") instead of closing tag '"+c+"'.",de(o,n))}a.length==0&&(r=!0)}}else return X("InvalidTag","Closing tag '"+c+"' doesn't have proper closing.",de(o,i));else{let u=Rn(d,e);if(u!==!0)return X(u.err.code,u.err.msg,de(o,i-d.length+u.err.line));if(r===!0)return X("InvalidXml","Multiple possible root nodes found.",de(o,i));e.unpairedTags.indexOf(c)!==-1||a.push({tagName:c,tagStartPos:n}),t=!0}for(i++;i<o.length;i++)if(o[i]==="<")if(o[i+1]==="!"){i++,i=Nn(o,i);continue}else if(o[i+1]==="?"){if(i=Cn(o,++i),i.err)return i}else break;else if(o[i]==="&"){let u=ad(o,i);if(u==-1)return X("InvalidChar","char '&' is not expected.",de(o,i));i=u}else if(r===!0&&!Na(o[i]))return X("InvalidXml","Extra text at the end",de(o,i));o[i]==="<"&&i--}}else{if(Na(o[i]))continue;return X("InvalidChar","char '"+o[i]+"' is not expected.",de(o,i))}if(t){if(a.length==1)return X("InvalidTag","Unclosed tag '"+a[0].tagName+"'.",de(o,a[0].tagStartPos));if(a.length>0)return X("InvalidXml","Invalid '"+JSON.stringify(a.map(i=>i.tagName),null,4).replace(/\r?\n/g,"")+"' found.",{line:1,col:1})}else return X("InvalidXml","Start tag expected.",1);return!0}function Na(o){return o===" "||o==="	"||o===`
`||o==="\r"}function Cn(o,e){let a=e;for(;e<o.length;e++)if(o[e]=="?"||o[e]==" "){let t=o.substr(a,e-a);if(e>5&&t==="xml")return X("InvalidXml","XML declaration allowed only at the start of the document.",de(o,e));if(o[e]=="?"&&o[e+1]==">"){e++;break}else continue}return e}function Nn(o,e){if(o.length>e+5&&o[e+1]==="-"&&o[e+2]==="-"){for(e+=3;e<o.length;e++)if(o[e]==="-"&&o[e+1]==="-"&&o[e+2]===">"){e+=2;break}}else if(o.length>e+8&&o[e+1]==="D"&&o[e+2]==="O"&&o[e+3]==="C"&&o[e+4]==="T"&&o[e+5]==="Y"&&o[e+6]==="P"&&o[e+7]==="E"){let a=1;for(e+=8;e<o.length;e++)if(o[e]==="<")a++;else if(o[e]===">"&&(a--,a===0))break}else if(o.length>e+9&&o[e+1]==="["&&o[e+2]==="C"&&o[e+3]==="D"&&o[e+4]==="A"&&o[e+5]==="T"&&o[e+6]==="A"&&o[e+7]==="["){for(e+=8;e<o.length;e++)if(o[e]==="]"&&o[e+1]==="]"&&o[e+2]===">"){e+=2;break}}return e}function Yl(o,e){let a="",t="",r=!1;for(;e<o.length;e++){if(o[e]===Wl||o[e]===Zl)t===""?t=o[e]:t!==o[e]||(t="");else if(o[e]===">"&&t===""){r=!0;break}a+=o[e]}return t!==""?!1:{value:a,index:e,tagClosed:r}}function Kl(o){let e=[],a=o.length,t=0;for(;t<a;){let r=t;for(;t<a&&Na(o[t]);)t++;if(t>=a)break;if(o[t]==="="){t=r+1;continue}let i=o.slice(r,t),n=t;for(;t<a&&!Na(o[t])&&o[t]!=="=";)t++;let s=o.slice(n,t),c,l=t;for(;l<a&&Na(o[l]);)l++;l<a&&o[l]==="="&&(c=o.slice(t,l+1),t=l+1);let d,u,p=t;for(;p<a&&Na(o[p]);)p++;if(p<a&&(o[p]==='"'||o[p]==="'")){let g=p+1,v=o.indexOf(o[p],g);v!==-1&&(d=o[p],u=o.slice(g,v),t=v+1)}let m={startIndex:r};m[1]=i,m[2]=s,m[3]=c,m[4]=d!==void 0?!0:void 0,m[5]=d,m[6]=u,e.push(m)}return e}function Rn(o,e){let a=Kl(o),t={};for(let r=0;r<a.length;r++){if(a[r][1].length===0)return X("InvalidAttr","Attribute '"+a[r][2]+"' has no space in starting.",ro(a[r]));if(a[r][3]!==void 0&&a[r][4]===void 0)return X("InvalidAttr","Attribute '"+a[r][2]+"' is without value.",ro(a[r]));if(a[r][3]===void 0&&!e.allowBooleanAttributes)return X("InvalidAttr","boolean attribute '"+a[r][2]+"' is not allowed.",ro(a[r]));let i=a[r][2];if(!od(i))return X("InvalidAttr","Attribute '"+i+"' is an invalid name.",ro(a[r]));if(!Object.prototype.hasOwnProperty.call(t,i))t[i]=1;else return X("InvalidAttr","Attribute '"+i+"' is repeated.",ro(a[r]))}return!0}function ed(o,e){let a=/\d/;for(o[e]==="x"&&(e++,a=/[\da-fA-F]/);e<o.length;e++){if(o[e]===";")return e;if(!o[e].match(a))break}return-1}function ad(o,e){if(e++,o[e]===";")return-1;if(o[e]==="#")return e++,ed(o,e);let a=0;for(;e<o.length;e++,a++)if(!(o[e].match(/\w/)&&a<20)){if(o[e]===";")break;return-1}return e}function X(o,e,a){return{err:{code:o,msg:e,line:a.line||a,col:a.col}}}function od(o){return cr(o)}function td(o){return cr(o)}function de(o,e){let a=o.substring(0,e).split(/\r?\n/);return{line:a.length,col:a[a.length-1].length+1}}function ro(o){return o.startIndex+o[1].length}var Jl,Wl,Zl,On=w(()=>{"use strict";f();Zo();Jl={allowBooleanAttributes:!1,unpairedTags:[]};Wl='"',Zl="'"});var lr,io,dr,ur=w(()=>{f();lr={cent:"\xA2",pound:"\xA3",curren:"\xA4",yen:"\xA5",euro:"\u20AC",dollar:"$",fnof:"\u0192",inr:"\u20B9",af:"\u060B",birr:"\u1265\u122D",peso:"\u20B1",rub:"\u20BD",won:"\u20A9",yuan:"\xA5",cedil:"\xB8"},io={amp:"&",apos:"'",gt:">",lt:"<",quot:'"'},dr={nbsp:"\xA0",copy:"\xA9",reg:"\xAE",trade:"\u2122",mdash:"\u2014",ndash:"\u2013",hellip:"\u2026",laquo:"\xAB",raquo:"\xBB",lsquo:"\u2018",rsquo:"\u2019",ldquo:"\u201C",rdquo:"\u201D",bull:"\u2022",para:"\xB6",sect:"\xA7",deg:"\xB0",frac12:"\xBD",frac14:"\xBC",frac34:"\xBE"}});function yn(o){if(o[0]==="#")throw new Error(`[EntityReplacer] Invalid character '#' in entity name: "${o}"`);for(let e of o)if(rd.has(e))throw new Error(`[EntityReplacer] Invalid character '${e}' in entity name: "${o}"`);return o}function no(...o){let e=Object.create(null);for(let a of o)if(a)for(let t of Object.keys(a)){let r=a[t];if(typeof r=="string")e[t]=r;else if(r&&typeof r=="object"&&r.val!==void 0){let i=r.val;typeof i=="string"&&(e[t]=i)}}return e}function id(o){return!o||o===ra?new Set([ra]):o===pr?new Set([pr]):o===Yo?new Set([Yo]):Array.isArray(o)?new Set(o):new Set([ra])}function sd(o){if(!o)return{xmlVersion:1,onLevel:fe.allow,nullLevel:fe.remove};let e=o.xmlVersion===1.1?1.1:1,a=fe[o.onNCR]??fe.allow,t=fe[o.nullNCR]??fe.remove,r=Math.max(t,fe.remove);return{xmlVersion:e,onLevel:a,nullLevel:r}}var Ra,rd,ra,Yo,pr,fe,nd,Sa,wn=w(()=>{f();ur();Ra=Object.freeze({ALLOW:"allow",BLOCK:"block",THROW:"throw"}),rd=new Set("!?\\\\/[]$%{}^&*()<>|+");ra="external",Yo="base",pr="all";fe=Object.freeze({allow:0,leave:1,remove:2,throw:3}),nd=new Set([9,10,13]);Sa=class{constructor(e={}){this._limit=e.limit||{},this._maxTotalExpansions=this._limit.maxTotalExpansions||0,this._maxExpandedLength=this._limit.maxExpandedLength||0,this._postCheck=typeof e.postCheck=="function"?e.postCheck:t=>t,this._limitTiers=id(this._limit.applyLimitsTo??ra),this._numericAllowed=e.numericAllowed??!0,this._baseMap=no(io,e.namedEntities||null),this._externalMap=Object.create(null),this._inputMap=Object.create(null),this._totalExpansions=0,this._expandedLength=0,this._removeSet=new Set(e.remove&&Array.isArray(e.remove)?e.remove:[]),this._leaveSet=new Set(e.leave&&Array.isArray(e.leave)?e.leave:[]);let a=sd(e.ncr);this._ncrXmlVersion=a.xmlVersion,this._ncrOnLevel=a.onLevel,this._ncrNullLevel=a.nullLevel,this._onExternalEntity=typeof e.onExternalEntity=="function"?e.onExternalEntity:null,this._onInputEntity=typeof e.onInputEntity=="function"?e.onInputEntity:null}_applyRegistrationHook(e,a,t,r){if(!e)return!0;let i=e(a,t);if(i===Ra.BLOCK)return!1;if(i===Ra.THROW)throw new Error(`[EntityDecoder] Registration of ${r} entity "&${a};" was rejected by hook`);return!0}setExternalEntities(e){if(e)for(let r of Object.keys(e))yn(r);if(!this._onExternalEntity){this._externalMap=no(e);return}let a=no(e),t=Object.create(null);for(let[r,i]of Object.entries(a))this._applyRegistrationHook(this._onExternalEntity,r,i,"external")&&(t[r]=i);this._externalMap=t}addExternalEntity(e,a){yn(e),typeof a=="string"&&a.indexOf("&")===-1&&this._applyRegistrationHook(this._onExternalEntity,e,a,"external")&&(this._externalMap[e]=a)}addInputEntities(e){if(this._totalExpansions=0,this._expandedLength=0,!this._onInputEntity){this._inputMap=no(e);return}let a=no(e),t=Object.create(null);for(let[r,i]of Object.entries(a))this._applyRegistrationHook(this._onInputEntity,r,i,"input")&&(t[r]=i);this._inputMap=t}reset(){return this._inputMap=Object.create(null),this._totalExpansions=0,this._expandedLength=0,this}setXmlVersion(e){this._ncrXmlVersion=e===1.1?1.1:1}decode(e){if(typeof e!="string"||e.length===0||e.indexOf("&")===-1)return e;let a=e,t=[],r=e.length,i=0,n=0,s=this._maxTotalExpansions>0,c=this._maxExpandedLength>0,l=s||c;for(;n<r;){if(e.charCodeAt(n)!==38){n++;continue}let u=n+1;for(;u<r&&e.charCodeAt(u)!==59&&u-n<=32;)u++;if(u>=r||e.charCodeAt(u)!==59){n++;continue}let p=e.slice(n+1,u);if(p.length===0){n++;continue}let m,g;if(this._removeSet.has(p))m="",g===void 0&&(g=ra);else if(this._leaveSet.has(p)){n++;continue}else if(p.charCodeAt(0)===35){let v=this._resolveNCR(p);if(v===void 0){n++;continue}m=v,g=Yo}else{let v=this._resolveName(p);m=v?.value,g=v?.tier}if(m===void 0){n++;continue}if(n>i&&t.push(e.slice(i,n)),t.push(m),i=u+1,n=i,l&&this._tierCounts(g)){if(s&&(this._totalExpansions++,this._totalExpansions>this._maxTotalExpansions))throw new Error(`[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`);if(c){let v=m.length-(p.length+2);if(v>0&&(this._expandedLength+=v,this._expandedLength>this._maxExpandedLength))throw new Error(`[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`)}}}i<r&&t.push(e.slice(i));let d=t.length===0?e:t.join("");return this._postCheck(d,a)}_tierCounts(e){return this._limitTiers.has(pr)?!0:this._limitTiers.has(e)}_resolveName(e){if(e in this._inputMap)return{value:this._inputMap[e],tier:ra};if(e in this._externalMap)return{value:this._externalMap[e],tier:ra};if(e in this._baseMap)return{value:this._baseMap[e],tier:Yo}}_classifyNCR(e){return e===0?this._ncrNullLevel:e>=55296&&e<=57343||this._ncrXmlVersion===1&&e>=1&&e<=31&&!nd.has(e)?fe.remove:-1}_applyNCRAction(e,a,t){switch(e){case fe.allow:return String.fromCodePoint(t);case fe.remove:return"";case fe.leave:return;case fe.throw:throw new Error(`[EntityDecoder] Prohibited numeric character reference &${a}; (U+${t.toString(16).toUpperCase().padStart(4,"0")})`);default:return String.fromCodePoint(t)}}_resolveNCR(e){let a=e.charCodeAt(1),t;if(a===120||a===88?t=parseInt(e.slice(2),16):t=parseInt(e.slice(1),10),Number.isNaN(t)||t<0||t>1114111)return;let r=this._classifyNCR(t);if(!this._numericAllowed&&r<fe.remove)return;let i=r===-1?this._ncrOnLevel:Math.max(this._ncrOnLevel,r);return this._applyNCRAction(i,e,t)}}});var Tn=w(()=>{f();wn();ur()});function ld(o,e){if(typeof o!="string")return;let a=o.toLowerCase();if(to.some(t=>a===t.toLowerCase()))throw new Error(`[SECURITY] Invalid ${e}: "${o}" is a reserved JavaScript keyword that could cause prototype pollution`);if(Wo.some(t=>a===t.toLowerCase()))throw new Error(`[SECURITY] Invalid ${e}: "${o}" is a reserved JavaScript keyword that could cause prototype pollution`)}function Ln(o,e){return typeof o=="boolean"?{enabled:o,maxEntitySize:1e4,maxExpansionDepth:1e4,maxTotalExpansions:1/0,maxExpandedLength:1e5,maxEntityCount:1e3,allowedTags:null,tagFilter:null,appliesTo:"all"}:typeof o=="object"&&o!==null?{enabled:o.enabled!==!1,maxEntitySize:Math.max(1,o.maxEntitySize??1e4),maxExpansionDepth:Math.max(1,o.maxExpansionDepth??1e4),maxTotalExpansions:Math.max(1,o.maxTotalExpansions??1/0),maxExpandedLength:Math.max(1,o.maxExpandedLength??1e5),maxEntityCount:Math.max(1,o.maxEntityCount??1e3),allowedTags:o.allowedTags??null,tagFilter:o.tagFilter??null,appliesTo:o.appliesTo??"all"}:Ln(!0)}var _n,cd,Dn,Pn=w(()=>{f();Zo();_n=o=>to.includes(o)?"__"+o:o,cd={preserveOrder:!1,attributeNamePrefix:"@_",attributesGroupName:!1,textNodeName:"#text",ignoreAttributes:!0,removeNSPrefix:!1,allowBooleanAttributes:!1,parseTagValue:!0,parseAttributeValue:!1,trimValues:!0,cdataPropName:!1,numberParseOptions:{hex:!0,leadingZeros:!0,eNotation:!0,unicode:!1},tagValueProcessor:function(o,e){return e},attributeValueProcessor:function(o,e){return e},stopNodes:[],alwaysCreateTextNode:!1,isArray:()=>!1,commentPropName:!1,unpairedTags:[],processEntities:!0,htmlEntities:!1,entityDecoder:null,ignoreDeclaration:!1,ignorePiTags:!1,transformTagName:!1,transformAttributeName:!1,updateTag:function(o,e,a){return o},captureMetaData:!1,maxNestedTags:100,strictReservedNames:!0,jPath:!0,onDangerousProperty:_n};Dn=function(o){let e=Object.assign({},cd,o),a=[{value:e.attributeNamePrefix,name:"attributeNamePrefix"},{value:e.attributesGroupName,name:"attributesGroupName"},{value:e.textNodeName,name:"textNodeName"},{value:e.cdataPropName,name:"cdataPropName"},{value:e.commentPropName,name:"commentPropName"}];for(let{value:t,name:r}of a)t&&ld(t,r);return e.onDangerousProperty===null&&(e.onDangerousProperty=_n),e.processEntities=Ln(e.processEntities,e.htmlEntities),e.unpairedTagsSet=new Set(e.unpairedTags),e.stopNodes&&Array.isArray(e.stopNodes)&&(e.stopNodes=e.stopNodes.map(t=>typeof t=="string"&&t.startsWith("*.")?".."+t.substring(2):t)),e}});var ia,ge,Ko=w(()=>{"use strict";f();typeof Symbol!="function"?ia="@@xmlMetadata":ia=Symbol("XML Node Metadata");ge=class{constructor(e){this.tagname=e,this.child=[],this[":@"]=Object.create(null)}add(e,a){e==="__proto__"&&(e="#__proto__"),this.child.push({[e]:a})}addChild(e,a){e.tagname==="__proto__"&&(e.tagname="#__proto__"),e[":@"]&&Object.keys(e[":@"]).length>0?this.child.push({[e.tagname]:e.child,":@":e[":@"]}):this.child.push({[e.tagname]:e.child}),this.addStartIndex(a)}addStartIndex(e){e!==void 0&&(this.child[this.child.length-1][ia]={startIndex:e})}addEndIndex(e){let a=this.child[this.child.length-1];a!==void 0&&a[ia]!==void 0&&a[ia].endIndex===void 0&&(a[ia].endIndex=e)}static getMetaDataSymbol(){return ia}}});var Mn,dd,Fn,ud,mr,pd,md,qn,fd,gd,hd,fr,Bn=w(()=>{f();Mn=":A-Za-z_\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u0486\u0488-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",dd=Mn+"\\-\\.\\d\xB7\u0300-\u036F\u203F-\u2040",Fn=":A-Za-z_\xC0-\u02FF\u0370-\u037D\u037F-\u0486\u0488-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}",ud=Fn+"\\-\\.\\d\xB7\u0300-\u036F\u0487\u203F-\u2040",mr=(o,e,a="")=>{let t=o.replace(":",""),r=e.replace(":",""),i=`[${t}][${r}]*`;return{name:new RegExp(`^[${o}][${e}]*$`,a),ncName:new RegExp(`^${i}$`,a),qName:new RegExp(`^${i}(?::${i})?$`,a),nmToken:new RegExp(`^[${e}]+$`,a),nmTokens:new RegExp(`^[${e}]+(?:\\s+[${e}]+)*$`,a)}},pd=mr(Mn,dd),md=mr(Fn,ud,"u"),qn=":A-Za-z_",fd=qn+"\\-\\.\\d",gd=mr(qn,fd),hd=(o="1.0",e=!1)=>e?gd:o==="1.1"?md:pd,fr=(o,{xmlVersion:e="1.0",asciiOnly:a=!1}={})=>hd(e,a).qName.test(o)});function na(o,e,a){for(let t=0;t<e.length;t++)if(e[t]!==o[a+t+1])return!1;return!0}function so(o,e){if(fr(o,{xmlVersion:e}))return o;throw new Error(`Invalid entity name ${o}`)}var co,he,Vn=w(()=>{f();Bn();co=class{constructor(e,a){this.suppressValidationErr=!e,this.options=e,this.xmlVersion=a||1}setXmlVersion(e=1){this.xmlVersion=e}readDocType(e,a){let t=Object.create(null),r=0;if(e[a+3]==="O"&&e[a+4]==="C"&&e[a+5]==="T"&&e[a+6]==="Y"&&e[a+7]==="P"&&e[a+8]==="E"){a=a+9;let i=1,n=!1,s=!1,c=null,l="";for(;a<e.length;a++){if(c!==null){e[a]===c&&(c=null),l+=e[a];continue}if(!n&&!s&&(e[a]==='"'||e[a]==="'")){c=e[a],l+=e[a];continue}if(e[a]==="<"&&!s){if(n&&na(e,"!ENTITY",a)){a+=7;let d,u;if([d,u,a]=this.readEntityExp(e,a+1,this.suppressValidationErr),u.indexOf("&")===-1){if(this.options.enabled!==!1&&this.options.maxEntityCount!=null&&r>=this.options.maxEntityCount)throw new Error(`Entity count (${r+1}) exceeds maximum allowed (${this.options.maxEntityCount})`);t[d]=u,r++}}else if(n&&na(e,"!ELEMENT",a)){a+=8;let{index:d}=this.readElementExp(e,a+1);a=d}else if(n&&na(e,"!ATTLIST",a))a+=8;else if(n&&na(e,"!NOTATION",a)){a+=9;let{index:d}=this.readNotationExp(e,a+1,this.suppressValidationErr);a=d}else if(na(e,"!--",a))s=!0;else throw new Error("Invalid DOCTYPE");i++,l=""}else if(e[a]===">"){if(s?e[a-1]==="-"&&e[a-2]==="-"&&(s=!1,i--):i--,i===0)break}else e[a]==="["?n=!0:l+=e[a]}if(c!==null||i!==0)throw new Error("Unclosed DOCTYPE")}else throw new Error("Invalid Tag instead of DOCTYPE");return{entities:t,i:a}}readEntityExp(e,a){a=he(e,a);let t=a;for(;a<e.length&&!/\s/.test(e[a])&&e[a]!=='"'&&e[a]!=="'";)a++;let r=e.substring(t,a);if(so(r,{xmlVersion:this.xmlVersion}),a=he(e,a),!this.suppressValidationErr){if(e.substring(a,a+6).toUpperCase()==="SYSTEM")throw new Error("External entities are not supported");if(e[a]==="%")throw new Error("Parameter entities are not supported")}let i="";if([a,i]=this.readIdentifierVal(e,a,"entity"),this.options.enabled!==!1&&this.options.maxEntitySize!=null&&i.length>this.options.maxEntitySize)throw new Error(`Entity "${r}" size (${i.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);return a--,[r,i,a]}readNotationExp(e,a){a=he(e,a);let t=a;for(;a<e.length&&!/\s/.test(e[a]);)a++;let r=e.substring(t,a);!this.suppressValidationErr&&so(r,{xmlVersion:this.xmlVersion}),a=he(e,a);let i=e.substring(a,a+6).toUpperCase();if(!this.suppressValidationErr&&i!=="SYSTEM"&&i!=="PUBLIC")throw new Error(`Expected SYSTEM or PUBLIC, found "${i}"`);a+=i.length,a=he(e,a);let n=null,s=null;if(i==="PUBLIC")[a,n]=this.readIdentifierVal(e,a,"publicIdentifier"),a=he(e,a),(e[a]==='"'||e[a]==="'")&&([a,s]=this.readIdentifierVal(e,a,"systemIdentifier"));else if(i==="SYSTEM"&&([a,s]=this.readIdentifierVal(e,a,"systemIdentifier"),!this.suppressValidationErr&&!s))throw new Error("Missing mandatory system identifier for SYSTEM notation");return{notationName:r,publicIdentifier:n,systemIdentifier:s,index:--a}}readIdentifierVal(e,a,t){let r="",i=e[a];if(i!=='"'&&i!=="'")throw new Error(`Expected quoted string, found "${i}"`);a++;let n=a;for(;a<e.length&&e[a]!==i;)a++;if(r=e.substring(n,a),e[a]!==i)throw new Error(`Unterminated ${t} value`);return a++,[a,r]}readElementExp(e,a){a=he(e,a);let t=a;for(;a<e.length&&!/\s/.test(e[a]);)a++;let r=e.substring(t,a);if(!this.suppressValidationErr&&!fr(r,{xmlVersion:this.xmlVersion}))throw new Error(`Invalid element name: "${r}"`);a=he(e,a);let i="";if(e[a]==="E"&&na(e,"MPTY",a))a+=4;else if(e[a]==="A"&&na(e,"NY",a))a+=2;else if(e[a]==="("){a++;let n=a;for(;a<e.length&&e[a]!==")";)a++;if(i=e.substring(n,a),e[a]!==")")throw new Error("Unterminated content model")}else if(!this.suppressValidationErr)throw new Error(`Invalid Element Expression, found "${e[a]}"`);return{elementName:r,contentModel:i.trim(),index:a}}readAttlistExp(e,a){a=he(e,a);let t=a;for(;a<e.length&&!/\s/.test(e[a]);)a++;let r=e.substring(t,a);for(so(r,{xmlVersion:this.xmlVersion}),a=he(e,a),t=a;a<e.length&&!/\s/.test(e[a]);)a++;let i=e.substring(t,a);if(!so(i,{xmlVersion:this.xmlVersion}))throw new Error(`Invalid attribute name: "${i}"`);a=he(e,a);let n="";if(e.substring(a,a+8).toUpperCase()==="NOTATION"){if(n="NOTATION",a+=8,a=he(e,a),e[a]!=="(")throw new Error(`Expected '(', found "${e[a]}"`);a++;let c=[];for(;a<e.length&&e[a]!==")";){let l=a;for(;a<e.length&&e[a]!=="|"&&e[a]!==")";)a++;let d=e.substring(l,a);if(d=d.trim(),!so(d,{xmlVersion:this.xmlVersion}))throw new Error(`Invalid notation name: "${d}"`);c.push(d),e[a]==="|"&&(a++,a=he(e,a))}if(e[a]!==")")throw new Error("Unterminated list of notations");a++,n+=" ("+c.join("|")+")"}else{let c=a;for(;a<e.length&&!/\s/.test(e[a]);)a++;n+=e.substring(c,a);let l=["CDATA","ID","IDREF","IDREFS","ENTITY","ENTITIES","NMTOKEN","NMTOKENS"];if(!this.suppressValidationErr&&!l.includes(n.toUpperCase()))throw new Error(`Invalid attribute type: "${n}"`)}a=he(e,a);let s="";return e.substring(a,a+8).toUpperCase()==="#REQUIRED"?(s="#REQUIRED",a+=8):e.substring(a,a+7).toUpperCase()==="#IMPLIED"?(s="#IMPLIED",a+=7):[a,s]=this.readIdentifierVal(e,a,"ATTLIST"),{elementName:r,attributeName:i,attributeType:n,defaultValue:s,index:a}}},he=(o,e)=>{for(;e<o.length&&/\s/.test(o[e]);)e++;return e}});var vd,et,at,jn,$n,Oa,bd,ot,Un=w(()=>{f();vd=[48,1632,1776,2406,2534,2662,2790,2918,3046,3174,3302,3430,3558,3664,3792,3872,4160,4240,6112,6160,6470,6608,6784,6800,6992,7088,7232,7248,65296,120782,120792,120802,120812,120822,66720,68912,69734,69872,69942,70096,70384,70736,70864,71248,71360,71472,71904,72016,72688,72784,73040,73120,73552,92768,92864,93008,123200,123632,124144,125264,130032],et=255,at=new Map,jn=65535,$n=1632,Oa=$n,bd=jn-$n+1,ot=new Uint8Array(bd).fill(et);for(let o of vd)for(let e=0;e<10;e++){let a=o+e;a<=jn?ot[a-Oa]=e:at.set(a,e)}});function xd(o){if(typeof o!="string")return o;let e=o.length;if(e===0)return o;let a=-1;for(let r=0;r<e;r++){let i=o.charCodeAt(r);if(!(i>=kn&&i<=zn||i===Hn)){if(i<Oa){if(tt.has(i)){a=r;break}continue}if(i>=55296&&i<=56319){if(r+1<e){let n=o.charCodeAt(r+1);if(n>=56320&&n<=57343){let s=65536+(i-55296<<10)+(n-56320);if(at.has(s)){a=r;break}}}continue}if(ot[i-Oa]!==et||tt.has(i)){a=r;break}}}if(a===-1)return o;let t=[];a>0&&t.push(o.slice(0,a));for(let r=a;r<e;r++){let i=o.charCodeAt(r);if(i>=kn&&i<=zn||i===Hn){t.push(o[r]);continue}if(i<Oa){t.push(tt.has(i)?"-":o[r]);continue}if(i>=55296&&i<=56319){if(r+1<e){let s=o.charCodeAt(r+1);if(s>=56320&&s<=57343){let c=65536+(i-55296<<10)+(s-56320),l=at.get(c);if(l!==void 0){t.push(String.fromCharCode(l+48)),r++;continue}}}t.push(o[r]);continue}if(tt.has(i)){t.push("-");continue}let n=ot[i-Oa];t.push(n!==et?String.fromCharCode(n+48):o[r])}return t.join("")}var kn,zn,Hn,tt,Gn,Xn=w(()=>{"use strict";f();Un();kn=48,zn=57,Hn=45,tt=new Set([8722,65293,65123]);Gn=xd});function hr(o,e={}){if(e=Object.assign({},Nd,e),!o||typeof o!="string")return o;let a=o.trim();if(a.length===0)return o;if(e.skipLike!==void 0&&e.skipLike.test(a))return o;if(a==="0"||e.unicode&&(a=Gn(a),a==="0"))return 0;if(e.hex&&Ad.test(a))return gr(a,16);if(e.binary&&Id.test(a))return gr(a,2);if(e.octal&&Ed.test(a))return gr(a,8);if(isFinite(a)){if(a.includes("e")||a.includes("E"))return Sd(o,a,e);{let t=Cd.exec(a);if(t){let r=t[1]||"",i=t[2],n=Od(t[3]),s=r?o[i.length+1]===".":o[i.length]===".";if(!e.leadingZeros&&(i.length>1||i.length===1&&!s))return o;{let c=Number(a),l=String(c);if(c===0)return c;if(l.search(/[eE]/)!==-1)return e.eNotation?c:o;if(a.indexOf(".")!==-1)return l==="0"||l===n||l===`${r}${n}`?c:o;let d=i?n:a;return i?d===l||r+d===l?c:o:d===l||d===r+l?c:o}}else return o}}else return yd(o,Number(a),e)}function Sd(o,e,a){if(!a.eNotation)return o;let t=e.match(Rd);if(t){let r=t[1]||"",i=t[3].indexOf("e")===-1?"E":"e",n=t[2],s=r?o[n.length+1]===i:o[n.length]===i;return n.length>1&&s?o:n.length===1&&(t[3].startsWith(`.${i}`)||t[3][0]===i)?Number(e):n.length>0?a.leadingZeros&&!s?(e=(t[1]||"")+t[3],Number(e)):o:Number(e)}else return o}function Od(o){if(o&&o.indexOf(".")!==-1){let e=o.length;for(;e>0&&o.charCodeAt(e-1)===48;)e--;return o=o.slice(0,e),o==="."?o="0":o[0]==="."?o="0"+o:o[o.length-1]==="."&&(o=o.substring(0,o.length-1)),o}return o}function gr(o,e){let a=o.trim();if((e===2||e===8)&&(o=a.substring(2)),parseInt)return parseInt(o,e);if(Number.parseInt)return Number.parseInt(o,e);if(window&&window.parseInt)return window.parseInt(o,e);throw new Error("parseInt, Number.parseInt, window.parseInt are not supported")}function yd(o,e,a){let t=e===1/0;switch(a.infinity.toLowerCase()){case"null":return null;case"infinity":return e;case"string":return t?"Infinity":"-Infinity";default:return o}}var Ad,Id,Ed,Cd,Nd,Rd,Qn=w(()=>{f();Xn();Ad=/^[-+]?0x[a-fA-F0-9]+$/,Id=/^0b[01]+$/,Ed=/^0o[0-7]+$/,Cd=/^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/,Nd={hex:!0,binary:!1,octal:!1,leadingZeros:!0,decimalPoint:".",eNotation:!0,infinity:"original",unicode:!1};Rd=/^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/});function vr(o){return typeof o=="function"?o:Array.isArray(o)?e=>{for(let a of o)if(typeof a=="string"&&e===a||a instanceof RegExp&&a.test(e))return!0}:()=>!1}var Jn=w(()=>{f()});var sa,Wn=w(()=>{f();sa=class{constructor(e,a={},t){this.pattern=e,this.separator=a.separator||".",this.segments=this._parse(e),this.data=t,this._hasDeepWildcard=this.segments.some(r=>r.type==="deep-wildcard"),this._hasAttributeCondition=this.segments.some(r=>r.attrName!==void 0),this._hasPositionSelector=this.segments.some(r=>r.position!==void 0)}_parse(e){let a=[],t=0,r="";for(;t<e.length;)e[t]===this.separator?t+1<e.length&&e[t+1]===this.separator?(r.trim()&&(a.push(this._parseSegment(r.trim())),r=""),a.push({type:"deep-wildcard"}),t+=2):(r.trim()&&a.push(this._parseSegment(r.trim())),r="",t++):(r+=e[t],t++);return r.trim()&&a.push(this._parseSegment(r.trim())),a}_parseSegment(e){let a={type:"tag"},t=null,r=e,i=e.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);if(i&&(r=i[1]+i[3],i[2])){let d=i[2].slice(1,-1);d&&(t=d)}let n,s=r;if(r.includes("::")){let d=r.indexOf("::");if(n=r.substring(0,d).trim(),s=r.substring(d+2).trim(),!n)throw new Error(`Invalid namespace in pattern: ${e}`)}let c,l=null;if(s.includes(":")){let d=s.lastIndexOf(":"),u=s.substring(0,d).trim(),p=s.substring(d+1).trim();["first","last","odd","even"].includes(p)||/^nth\(\d+\)$/.test(p)?(c=u,l=p):c=s}else c=s;if(!c)throw new Error(`Invalid segment pattern: ${e}`);if(a.tag=c,n&&(a.namespace=n),t)if(t.includes("=")){let d=t.indexOf("=");a.attrName=t.substring(0,d).trim(),a.attrValue=t.substring(d+1).trim()}else a.attrName=t.trim();if(l){let d=l.match(/^nth\((\d+)\)$/);d?(a.position="nth",a.positionValue=parseInt(d[1],10)):a.position=l}return a}get length(){return this.segments.length}hasDeepWildcard(){return this._hasDeepWildcard}hasAttributeCondition(){return this._hasAttributeCondition}hasPositionSelector(){return this._hasPositionSelector}toString(){return this.pattern}}});var ya,Zn=w(()=>{f();ya=class{constructor(){this._byDepthAndTag=new Map,this._wildcardByDepth=new Map,this._deepWildcards=[],this._deepByTerminalTag=new Map,this._patterns=new Set,this._sealed=!1}add(e){if(this._sealed)throw new TypeError("ExpressionSet is sealed. Create a new ExpressionSet to add more expressions.");if(this._patterns.has(e.pattern))return this;if(this._patterns.add(e.pattern),e.hasDeepWildcard()){let i=e.segments[e.segments.length-1];if(i&&i.type!=="deep-wildcard"&&i.tag!=="*"){let n=i.tag;this._deepByTerminalTag.has(n)||this._deepByTerminalTag.set(n,[]),this._deepByTerminalTag.get(n).push(e)}else this._deepWildcards.push(e);return this}let a=e.length,r=e.segments[e.segments.length-1]?.tag;if(!r||r==="*")this._wildcardByDepth.has(a)||this._wildcardByDepth.set(a,[]),this._wildcardByDepth.get(a).push(e);else{let i=`${a}:${r}`;this._byDepthAndTag.has(i)||this._byDepthAndTag.set(i,[]),this._byDepthAndTag.get(i).push(e)}return this}addAll(e){for(let a of e)this.add(a);return this}has(e){return this._patterns.has(e.pattern)}get size(){return this._patterns.size}seal(){return this._sealed=!0,this}get isSealed(){return this._sealed}matchesAny(e){return this.findMatch(e)!==null}findMatch(e){let a=e.getDepth(),t=e.getCurrentTag(),r=`${a}:${t}`,i=this._byDepthAndTag.get(r);if(i){for(let c=0;c<i.length;c++)if(e.matches(i[c]))return i[c]}let n=this._wildcardByDepth.get(a);if(n){for(let c=0;c<n.length;c++)if(e.matches(n[c]))return n[c]}let s=this._deepByTerminalTag.get(t);if(s){for(let c=0;c<s.length;c++)if(e.matches(s[c]))return s[c]}for(let c=0;c<this._deepWildcards.length;c++)if(e.matches(this._deepWildcards[c]))return this._deepWildcards[c];return null}}});var br,wa,Yn=w(()=>{f();br=class{constructor(e){this._matcher=e}get separator(){return this._matcher.separator}getCurrentTag(){let e=this._matcher.path;return e.length>0?e[e.length-1].tag:void 0}getCurrentNamespace(){let e=this._matcher.path;return e.length>0?e[e.length-1].namespace:void 0}getAttrValue(e){let a=this._matcher.path;if(a.length!==0)return a[a.length-1].values?.[e]}hasAttr(e){let a=this._matcher.path;if(a.length===0)return!1;let t=a[a.length-1];return t.values!==void 0&&e in t.values}getAnyParentAttr(e){return this._matcher.getAnyParentAttr(e)}hasAnyParentAttr(e){return this._matcher.hasAnyParentAttr(e)}getPosition(){let e=this._matcher.path;return e.length===0?-1:e[e.length-1].position??0}getCounter(){let e=this._matcher.path;return e.length===0?-1:e[e.length-1].counter??0}getIndex(){return this.getPosition()}getDepth(){return this._matcher.path.length}toString(e,a=!0){return this._matcher.toString(e,a)}toArray(){return this._matcher.path.map(e=>e.tag)}matches(e){return this._matcher.matches(e)}matchesAny(e){return e.matchesAny(this._matcher)}},wa=class{constructor(e={}){this.separator=e.separator||".",this.path=[],this.siblingStacks=[],this._pathStringCache=null,this._view=new br(this),this._keptAttrs=[]}push(e,a=null,t=null,r=null){this._pathStringCache=null,this.path.length>0&&(this.path[this.path.length-1].values=void 0);let i=this.path.length,n=this.siblingStacks[i];n||(n={counts:new Map,total:0},this.siblingStacks[i]=n);let s=t?`${t}:${e}`:e,c=n.counts.get(s)||0,l=n.total;n.counts.set(s,c+1),n.total++;let d={tag:e,position:l,counter:c};t!=null&&(d.namespace=t),a!=null&&(d.values=a),this.path.push(d);let u=this.path.length,p=r!==null?r.keep:null;if(p!=null&&p.length>0&&a)for(let m=0;m<p.length;m++){let g=p[m];a[g]!==void 0&&this._keptAttrs.push({depth:u,name:g,value:a[g]})}}pop(){if(this.path.length===0)return;this._pathStringCache=null;let e=this.path.pop();this.siblingStacks.length>this.path.length+1&&(this.siblingStacks.length=this.path.length+1);let a=this.path.length+1;for(;this._keptAttrs.length>0&&this._keptAttrs[this._keptAttrs.length-1].depth>=a;)this._keptAttrs.pop();return e}updateCurrent(e){if(this.path.length>0){let a=this.path[this.path.length-1];e!=null&&(a.values=e)}}getCurrentTag(){return this.path.length>0?this.path[this.path.length-1].tag:void 0}getCurrentNamespace(){return this.path.length>0?this.path[this.path.length-1].namespace:void 0}getAttrValue(e){if(this.path.length!==0)return this.path[this.path.length-1].values?.[e]}hasAttr(e){if(this.path.length===0)return!1;let a=this.path[this.path.length-1];return a.values!==void 0&&e in a.values}getAnyParentAttr(e){let a=this._keptAttrs;for(let t=a.length-1;t>=0;t--)if(a[t].name===e)return a[t].value}hasAnyParentAttr(e){let a=this._keptAttrs;for(let t=a.length-1;t>=0;t--)if(a[t].name===e)return!0;return!1}getPosition(){return this.path.length===0?-1:this.path[this.path.length-1].position??0}getCounter(){return this.path.length===0?-1:this.path[this.path.length-1].counter??0}getIndex(){return this.getPosition()}getDepth(){return this.path.length}toString(e,a=!0){let t=e||this.separator;if(t===this.separator&&a===!0){if(this._pathStringCache!==null)return this._pathStringCache;let i=this.path.map(n=>n.namespace?`${n.namespace}:${n.tag}`:n.tag).join(t);return this._pathStringCache=i,i}return this.path.map(i=>a&&i.namespace?`${i.namespace}:${i.tag}`:i.tag).join(t)}toArray(){return this.path.map(e=>e.tag)}reset(){this._pathStringCache=null,this.path=[],this.siblingStacks=[],this._keptAttrs=[]}matches(e){let a=e.segments;return a.length===0?!1:e.hasDeepWildcard()?this._matchWithDeepWildcard(a):this._matchSimple(a)}_matchSimple(e){if(this.path.length!==e.length)return!1;for(let a=0;a<e.length;a++)if(!this._matchSegment(e[a],this.path[a],a===this.path.length-1))return!1;return!0}_matchWithDeepWildcard(e){let a=this.path.length-1,t=e.length-1;for(;t>=0&&a>=0;){let r=e[t];if(r.type==="deep-wildcard"){if(t--,t<0)return!0;let i=e[t],n=!1;for(let s=a;s>=0;s--)if(this._matchSegment(i,this.path[s],s===this.path.length-1)){a=s-1,t--,n=!0;break}if(!n)return!1}else{if(!this._matchSegment(r,this.path[a],a===this.path.length-1))return!1;a--,t--}}return t<0}_matchSegment(e,a,t){if(e.tag!=="*"&&e.tag!==a.tag||e.namespace!==void 0&&e.namespace!=="*"&&e.namespace!==a.namespace||e.attrName!==void 0&&(!t||!a.values||!(e.attrName in a.values)||e.attrValue!==void 0&&String(a.values[e.attrName])!==String(e.attrValue)))return!1;if(e.position!==void 0){if(!t)return!1;let r=a.counter??0;if(e.position==="first"&&r!==0)return!1;if(e.position==="odd"&&r%2!==1)return!1;if(e.position==="even"&&r%2!==0)return!1;if(e.position==="nth"&&r!==e.positionValue)return!1}return!0}matchesAny(e){return e.matchesAny(this)}snapshot(){return{path:this.path.map(e=>({...e})),siblingStacks:this.siblingStacks.map(e=>e&&{counts:new Map(e.counts),total:e.total}),keptAttrs:this._keptAttrs.map(e=>({...e}))}}restore(e){this._pathStringCache=null,this.path=e.path.map(a=>({...a})),this.siblingStacks=e.siblingStacks.map(a=>a&&{counts:new Map(a.counts),total:a.total}),this._keptAttrs=(e.keptAttrs||[]).map(a=>({...a}))}readOnly(){return this._view}}});var xr=w(()=>{f();Wn();Yn();Zn()});var wd,Ta,Ar=w(()=>{f();wd=[{id:"html-script-open",description:"<script opening tag",pattern:/<script[\s>/]/i},{id:"html-script-close",description:"<\/script closing tag",pattern:/<\/script[\s>]/i},{id:"html-javascript-protocol",description:"javascript: URI scheme (with optional whitespace/encoding)",pattern:/j[\t\n\r ]*a[\t\n\r ]*v[\t\n\r ]*a[\t\n\r ]*s[\t\n\r ]*c[\t\n\r ]*r[\t\n\r ]*i[\t\n\r ]*p[\t\n\r ]*t[\t\n\r ]*:/i},{id:"html-vbscript-protocol",description:"vbscript: URI scheme",pattern:/vbscript[\t\n\r ]*:/i},{id:"html-data-html",description:"data:text/html URI \u2014 can execute scripts in browsers",pattern:/data[\t\n\r ]*:[\t\n\r ]*text\/html/i},{id:"html-data-xhtml",description:"data:application/xhtml+xml URI",pattern:/data[\t\n\r ]*:[\t\n\r ]*application\/xhtml/i},{id:"html-data-svg",description:"data:image/svg+xml URI \u2014 can execute scripts",pattern:/data[\t\n\r ]*:[\t\n\r ]*image\/svg\+xml/i},{id:"html-inline-event-handler",description:"Inline event handler attributes: onclick=, onerror=, onload=, etc.",pattern:/\bon\w{1,30}\s*=/i},{id:"html-entity-obfuscated-script",description:"HTML-entity-encoded <script (e.g. &#x3C;script or &lt;script)",pattern:/(?:&#x0*3[Cc];?|&#0*60;?|&lt;)\s*script/i},{id:"html-entity-obfuscated-javascript",description:'HTML-entity-encoded javascript: (partial \u2014 catches common &#106; or &#x6a; for "j")',pattern:/(?:&#x0*6[Aa];?|&#0*106;?)\s*(?:&#x0*61;?|a)[\s\S]{0,80}script\s*:/i},{id:"html-style-expression",description:"CSS expression() \u2014 IE-era code execution in style attributes",pattern:/style[\s\S]{0,20}expression\s*\(/i},{id:"html-object-embed",description:"<object or <embed tags that can load active content",pattern:/<(?:object|embed)[\s>/]/i},{id:"html-base-tag",description:"<base href= \u2014 can hijack all relative URLs on a page",pattern:/<base[\s>]/i},{id:"html-meta-refresh",description:'<meta http-equiv="refresh" \u2014 can redirect users',pattern:/<meta[\s\S]{0,40}http-equiv[\s\S]{0,20}refresh/i},{id:"html-srcdoc",description:"srcdoc= attribute on iframes \u2014 embeds HTML that can run scripts",pattern:/srcdoc\s*=/i},{id:"html-iframe",description:"<iframe tag",pattern:/<iframe[\s>/]/i},{id:"html-form",description:"<form tag \u2014 can be used for phishing / credential harvesting injection",pattern:/<form[\s>/]/i}],Ta=wd});var Td,_a,Ir=w(()=>{f();Td=[{id:"xml-cdata-injection",description:"CDATA section injection: <![CDATA[ breaks out of text node context",pattern:/<!\[CDATA\[/i},{id:"xml-cdata-close",description:"CDATA close sequence: ]]> can terminate an enclosing CDATA section",pattern:/\]\]>/},{id:"xml-processing-instruction",description:"XML processing instruction: <?xml-stylesheet or <?php etc.",pattern:/<\?(?:xml[\- ]|php|asp)/i},{id:"xml-doctype-injection",description:"DOCTYPE declaration embedded in content \u2014 can define entities",pattern:/<!DOCTYPE(?:[\s[]|$)/i},{id:"xml-entity-system",description:"SYSTEM keyword \u2014 used in external entity declarations (XXE)",pattern:/\bSYSTEM\s+["']/i},{id:"xml-entity-public",description:"PUBLIC keyword \u2014 used in external entity declarations (XXE)",pattern:/\bPUBLIC\s+["']/i},{id:"xml-entity-declaration",description:"<!ENTITY declaration \u2014 defines entities, potential XXE or entity expansion",pattern:/<!ENTITY[\s%]/i},{id:"xml-billion-laughs",description:"Entity reference chaining / billion laughs: repeated &eX; style references",pattern:/(?:&\w{1,20};){3,}/},{id:"xml-namespace-confusion",description:"xmlns: attribute injection \u2014 can redefine namespaces to confuse parsers",pattern:/\bxmlns(?::\w{1,40})?\s*=/i},{id:"xml-comment-injection",description:"<!-- comment injection \u2014 can hide content from some parsers",pattern:/<!--/},{id:"xml-comment-close",description:"--> closes an enclosing XML comment",pattern:/-->/},{id:"xml-pi-close",description:"?> closes an enclosing processing instruction",pattern:/\?>/}],_a=Td});var _d,Er,Kn=w(()=>{f();_d=[{id:"svg-script-element",description:"<script element inside SVG executes JavaScript",pattern:/<script[\s>/]/i},{id:"svg-xlink-href-javascript",description:"xlink:href with javascript: \u2014 classic SVG XSS via <a> or <use>",pattern:/xlink\s*:\s*href\s*=\s*["']?\s*javascript\s*:/i},{id:"svg-href-javascript",description:"href= with javascript: in SVG context (<a>, <animate>, etc.)",pattern:/href\s*=\s*["']?\s*javascript\s*:/i},{id:"svg-foreignobject",description:"<foreignObject embeds HTML inside SVG \u2014 can execute scripts",pattern:/<foreignObject[\s>/]/i},{id:"svg-use-external",description:"<use xlink:href or href pointing to external resource (non-fragment URL)",pattern:/<use[\s\S]{0,60}(?:xlink\s*:\s*)?href\s*=\s*(?:["'][^#]|[^"'#\s>])/i},{id:"svg-animate-href",description:'<animate attributeName="href" \u2014 can dynamically change href to javascript:',pattern:/<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*href["']/i},{id:"svg-animate-xlinkhref",description:'<animate attributeName="xlink:href"',pattern:/<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*xlink\s*:\s*href["']/i},{id:"svg-set-javascript",description:'<set to="javascript:..." \u2014 sets an attribute to a javascript: URI',pattern:/<set[\s\S]{0,80}to\s*=\s*["']?\s*javascript\s*:/i},{id:"svg-event-handler",description:"SVG-specific event handler attributes: onload=, onerror=, onactivate=, etc.",pattern:/\bon(?:load|error|activate|begin|end|repeat|focus|blur|click|mouse\w{1,20}|key\w{1,20})\s*=/i},{id:"svg-handler-generic",description:"Generic on* handler catch-all for SVG attributes",pattern:/\bon\w{1,30}\s*=/i},{id:"svg-filter-feimage",description:"<feImage href= \u2014 filter primitive that can load external resources",pattern:/<feImage[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=/i},{id:"svg-image-external",description:"<image xlink:href with http/https or javascript protocol",pattern:/<image[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=\s*["']?\s*(?:https?|javascript)\s*:/i},{id:"svg-style-javascript",description:"style= attribute containing javascript: (e.g. background:url(javascript:...))",pattern:/style\s*=[\s\S]{0,60}javascript\s*:/i}],Er=_d});var Ld,lo,Cr=w(()=>{f();Ld=[{id:"sql-block-comment-open",description:"SQL block comment open: /* ... */ \u2014 unusual in legitimate user text",pattern:/\/\*/},{id:"sql-union-select",description:"UNION SELECT \u2014 most common SQL injection aggregation attack",pattern:/\bUNION\s{1,20}(?:ALL\s{1,20})?SELECT\b/i},{id:"sql-drop-table",description:"DROP TABLE \u2014 destructive DDL injection",pattern:/\bDROP\s{1,20}TABLE\b/i},{id:"sql-drop-database",description:"DROP DATABASE \u2014 destructive DDL injection",pattern:/\bDROP\s{1,20}DATABASE\b/i},{id:"sql-insert-into",description:"INSERT INTO \u2014 data injection",pattern:/\bINSERT\s{1,20}INTO\b/i},{id:"sql-delete-from",description:"DELETE FROM \u2014 data deletion injection",pattern:/\bDELETE\s{1,20}FROM\b/i},{id:"sql-update-set",description:"UPDATE ... SET \u2014 data modification injection",pattern:/\bUPDATE\b[\s\S]{1,60}\bSET\b/i},{id:"sql-exec-xp",description:"EXEC xp_ \u2014 MSSQL extended stored procedure execution",pattern:/\bEXEC(?:UTE)?\s{1,20}xp_/i},{id:"sql-tautology-string",description:`Classic string tautology: ' OR '1'='1 or " OR "1"="1"`,pattern:/'\s{0,10}OR\s{0,10}'[^']{0,20}'\s*=\s*'[^']{0,20}/i},{id:"sql-tautology-numeric",description:"Numeric tautology: OR 1=1",pattern:/\bOR\s{1,10}1\s*=\s*1\b/i},{id:"sql-always-true-zero",description:"Numeric tautology: OR 0=0",pattern:/\bOR\s{1,10}0\s*=\s*0\b/i},{id:"sql-sleep-benchmark",description:"Time-based blind injection: SLEEP() or BENCHMARK()",pattern:/\b(?:SLEEP|BENCHMARK)\s*\(/i},{id:"sql-waitfor-delay",description:"MSSQL time-based blind injection: WAITFOR DELAY",pattern:/\bWAITFOR\s{1,20}DELAY\b/i},{id:"sql-char-function",description:"CHAR() function \u2014 used to obfuscate injected strings",pattern:/\bCHAR\s*\(\s*\d{1,3}/i},{id:"sql-information-schema",description:"INFORMATION_SCHEMA \u2014 reconnaissance query for table/column enumeration",pattern:/\bINFORMATION_SCHEMA\b/i}],lo=Ld});var Dd,Nr,es=w(()=>{f();Dd=[{id:"shell-path-traversal-unix",description:"Unix path traversal: ../  \u2014 climbing the directory tree",pattern:/\.\.\//},{id:"shell-path-traversal-windows",description:"Windows path traversal: ..\\ \u2014 climbing the directory tree",pattern:/\.\.\\/},{id:"shell-path-traversal-encoded",description:"URL-encoded path traversal: %2e%2e or %2f variants",pattern:/%2e%2e|%2f\.\.|\.\.%2f/i},{id:"shell-null-byte",description:"Null byte injection: \\x00 or %00 \u2014 truncates strings in C-backed functions",pattern:/\x00|%00/},{id:"shell-semicolon",description:"Semicolon command separator: cmd1; cmd2",pattern:/;/},{id:"shell-pipe",description:"Pipe operator: cmd1 | cmd2",pattern:/\|/},{id:"shell-and-operator",description:"AND operator: cmd1 && cmd2",pattern:/&&/},{id:"shell-or-operator",description:"OR operator: cmd1 || cmd2",pattern:/\|\|/},{id:"shell-backtick",description:"Backtick command substitution: `cmd`",pattern:/`/},{id:"shell-dollar-paren",description:"Dollar-paren command substitution: $(cmd)",pattern:/\$\(/},{id:"shell-dollar-brace",description:"Dollar-brace variable expansion: ${var} \u2014 can be abused for injection",pattern:/\$\{/},{id:"shell-redirect-out",description:"Output redirection: cmd > file or cmd >> file",pattern:/>{1,2}/},{id:"shell-redirect-in",description:"Input redirection: cmd < file",pattern:/</},{id:"shell-newline-injection",description:"Newline injection: \\n or \\r \u2014 can inject new shell commands",pattern:/[\n\r]/},{id:"shell-glob-star",description:"Glob expansion: * or ? \u2014 can expand to unintended files",pattern:/[/\\][*?]/},{id:"shell-absolute-root",description:"Absolute root path injection: string starting with / or \\ (Windows UNC)",pattern:/^(?:\/|\\\\)/},{id:"shell-windows-drive",description:"Windows drive letter path injection: C:\\ or D:/",pattern:/^[a-zA-Z]:[/\\]/},{id:"shell-curl-wget",description:"curl/wget with URL or flags \u2014 can exfiltrate data or download payloads",pattern:/\b(?:curl|wget)\s+(?:https?:\/\/|ftp:\/\/|-)/i}],Nr=Dd});var Pd,Rr,as=w(()=>{f();Pd=[{id:"redos-nested-quantifier-plus",description:"Nested + quantifier inside a group with outer quantifier: (a+)+, (.+b)*, etc.",pattern:/\([^)]*\+[^)]*\)[+*]/},{id:"redos-nested-quantifier-star",description:"Nested * quantifier: (a*)* or (a*)+ \u2014 catastrophic backtracking",pattern:/\([^)]*\*[^)]*\)[*+]/},{id:"redos-nested-groups",description:"Doubly nested quantified groups: ((a+)+) \u2014 guaranteed catastrophic",pattern:/\(\([^)]{0,40}\)[+*]\)[+*]/},{id:"redos-alternation-overlap",description:"Overlapping alternation under quantifier: (a|a)+ \u2014 ambiguous NFA paths",pattern:/\(([^|()]{1,20})\|(?:\1)(?:\|[^|()]{1,20}){0,5}\)[+*?]{1,2}/},{id:"redos-star-plus-concat",description:"(x*x)+ pattern \u2014 triggers super-linear backtracking",pattern:/\([^)]{0,10}\*[^)]{0,10}\)[+*]/},{id:"redos-dot-star-greedy",description:"(.*){n,} or (.+){n,} \u2014 repeated greedy dot quantifiers",pattern:/\(\.[*+]\)\{?\d/},{id:"redos-large-repetition",description:"Very large fixed or range repetition count {1000,} or {1000,n} \u2014 denial of service via backtracking",pattern:/\{\d{4,}(?:,\d*)?\}/},{id:"redos-catastrophic-alternation",description:"Long alternation with many similar branches \u2014 polynomial backtracking risk",pattern:/\([^)]{0,200}(?:\|[^|)]{0,50}){9,}\)/}],Rr=Pd});var Ie,Md,Sr,os=w(()=>{f();Ie=`["'\\s]*:`,Md=[{id:"nosql-where-operator",description:"$where \u2014 executes arbitrary JavaScript server-side in MongoDB",pattern:new RegExp(`\\$where${Ie}`,"i")},{id:"nosql-ne-operator",description:'$ne \u2014 "not equal" operator used to bypass equality checks',pattern:new RegExp(`\\$ne${Ie}`,"i")},{id:"nosql-gt-operator",description:'$gt \u2014 "greater than" used to bypass password/value checks',pattern:new RegExp(`\\$gte?${Ie}`,"i")},{id:"nosql-lt-operator",description:'$lt / $lte \u2014 "less than" bypass variants',pattern:new RegExp(`\\$lte?${Ie}`,"i")},{id:"nosql-regex-operator",description:"$regex \u2014 can be used to extract data character by character (blind injection)",pattern:new RegExp(`\\$regex${Ie}`,"i")},{id:"nosql-or-operator",description:"$or \u2014 logical OR; used to create always-true conditions",pattern:new RegExp(`\\$or${Ie}\\s*\\[`,"i")},{id:"nosql-and-operator",description:"$and \u2014 logical AND operator injection",pattern:new RegExp(`\\$and${Ie}\\s*\\[`,"i")},{id:"nosql-nor-operator",description:"$nor \u2014 logical NOR operator injection",pattern:new RegExp(`\\$nor${Ie}\\s*\\[`,"i")},{id:"nosql-exists-operator",description:"$exists \u2014 can enumerate fields to determine schema",pattern:new RegExp(`\\$exists${Ie}`,"i")},{id:"nosql-in-operator",description:"$in \u2014 matches any value in a list; can enumerate values",pattern:new RegExp(`\\$in${Ie}\\s*\\[`,"i")},{id:"nosql-expr-operator",description:"$expr \u2014 allows aggregation expressions in queries (MongoDB 3.6+)",pattern:new RegExp(`\\$expr${Ie}`,"i")},{id:"nosql-function-operator",description:"$function \u2014 executes arbitrary JavaScript in MongoDB 4.4+",pattern:new RegExp(`\\$function${Ie}`,"i")},{id:"nosql-accumulator-operator",description:"$accumulator \u2014 custom aggregation with arbitrary JS execution",pattern:new RegExp(`\\$accumulator${Ie}`,"i")},{id:"nosql-proto-pollution",description:"__proto__ \u2014 prototype pollution via object key injection",pattern:/__proto__/},{id:"nosql-constructor-prototype",description:"constructor.prototype \u2014 alternative prototype pollution vector (dot notation or JSON key)",pattern:/constructor[\s"':.,{\[]*prototype/i},{id:"nosql-proto-bracket",description:'["__proto__"] \u2014 bracket-notation prototype pollution',pattern:/\[["']__proto__["']\]/}],Sr=Md});var Fd,Or,ts=w(()=>{f();Fd=[{id:"log-crlf-injection",description:"CRLF injection: literal \\r or \\n embeds fake log lines",pattern:/[\r\n]/},{id:"log-url-encoded-crlf",description:"URL-encoded CRLF: %0d, %0a, %0D, %0A \u2014 decoded by some log parsers",pattern:/%0[dDaA]/},{id:"log-unicode-newline",description:"Unicode newline variants: U+2028 (line separator), U+2029 (paragraph separator)",pattern:/[\u2028\u2029]/},{id:"log-log4shell-jndi",description:"Log4Shell: ${jndi:...} triggers remote code execution in Apache Log4j",pattern:/\$\{jndi\s*:/i},{id:"log-log4shell-obfuscated",description:"Obfuscated Log4Shell: ${::-j}... lookup-bypass prefix used to evade WAF detection",pattern:/\$\{::-/},{id:"log-log4j-lookup",description:"Log4j lookup syntax: ${env:...}, ${sys:...}, ${ctx:...} \u2014 data exfiltration",pattern:/\$\{(?:env|sys|ctx|main|map|sd|web|docker|k8s|spring)\s*:/i},{id:"log-ssti-double-brace",description:"SSTI double-brace: {{expression}} \u2014 Jinja2, Twig, Handlebars, etc.",pattern:/\{\{[\s\S]{0,80}\}\}/},{id:"log-ssti-hash-brace",description:"SSTI hash-brace: #{expression} \u2014 Thymeleaf, Velocity, Ruby ERB",pattern:/#\{[\s\S]{0,80}\}/},{id:"log-ssti-dollar-brace",description:"SSTI/EL injection: ${expression with operators or method calls} \u2014 JSP EL, Freemarker, SpEL",pattern:/\$\{[^}]*(?:\.|\(|\*|\+|\bclass\b|\bruntime\b|\bprocess\b|\bexec\b)[^}]{0,80}\}/i},{id:"log-ssti-percent-tag",description:"SSTI ERB/ASP tag: <%= expression %> \u2014 Ruby ERB, ASP",pattern:/<%=[\s\S]{0,80}%>/},{id:"log-null-byte",description:"Null byte: \\x00 or %00 \u2014 can truncate log entries in C-backed loggers",pattern:/\x00|%00/},{id:"log-ansi-escape",description:"ANSI escape sequence: ESC[ \u2014 can manipulate terminal output when logs are tailed",pattern:/\x1b\[/}],Or=Fd});var qd,Bd,yr,rs=w(()=>{f();Cr();qd=[{id:"sql-line-comment",description:"SQL line comment: -- followed by whitespace or end of string",pattern:/--(?:\s|$)/},{id:"sql-stacked-query",description:"Stacked queries: semicolon immediately followed by a SQL keyword",pattern:/;\s{0,10}(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b/i},{id:"sql-hex-encoding",description:"Hex-encoded string injection: 0x41414141 style (MySQL)",pattern:/\b0x[0-9a-f]{4,}/i}],Bd=[...lo,...qd],yr=Bd});function Vd(o){if(typeof o!="string")throw new TypeError(`is-unsafe: first argument must be a string, got ${typeof o}`)}function jd(o){if(!(o instanceof RegExp)){if(Array.isArray(o)){if(o.length===0)throw new TypeError("is-unsafe: context must not be an empty array");if(Array.isArray(o[0])){for(let e of o)if(!Array.isArray(e)||e.length===0)throw new TypeError("is-unsafe: each context in the array must be a non-empty pattern array (PatternList)")}return}throw new TypeError(`is-unsafe: second argument must be a PatternList (e.g. HTML), an array of PatternLists (e.g. [HTML, XML]), or a RegExp. Got: ${typeof o}`)}}function $d(o){return o instanceof RegExp?{lists:null,regex:o}:Array.isArray(o[0])?{lists:o,regex:null}:{lists:[o],regex:null}}function Ud(o,e){let a=e.label??"CUSTOM";for(let t of e)if(t.pattern.test(o))return{context:a,id:t.id,description:t.description,pattern:t.pattern};return null}function is(o,e){Vd(o),jd(e);let{lists:a,regex:t}=$d(e);if(t)return t.test(o);for(let r of a)if(Ud(o,r)!==null)return!0;return!1}var ng,ns=w(()=>{f();Ar();Ir();rs();Ar();Ir();Kn();Cr();es();as();os();ts();Ta.label="HTML";_a.label="XML";Er.label="SVG";lo.label="SQL";yr.label="SQL-STRICT";Nr.label="SHELL";Rr.label="REDOS";Sr.label="NOSQL";Or.label="LOG";ng=Object.freeze({HTML:Ta,XML:_a,SVG:Er,SQL:lo,"SQL-STRICT":yr,SHELL:Nr,REDOS:Rr,NOSQL:Sr,LOG:Or})});function kd(o,e){if(!o)return{};let a=e.attributesGroupName?o[e.attributesGroupName]:o;if(!a)return{};let t={};for(let r in a)if(r.startsWith(e.attributeNamePrefix)){let i=r.substring(e.attributeNamePrefix.length);t[i]=a[r]}else t[r]=a[r];return t}function zd(o){if(!o||typeof o!="string")return;let e=o.indexOf(":");if(e!==-1&&e>0){let a=o.substring(0,e);if(a!=="xmlns")return a}}function Hd(o,e,a,t,r,i,n){let s=this.options;if(o!==void 0&&(s.trimValues&&!t&&(o=o.trim()),o.length>0)){n||(o=this.replaceEntitiesValue(o,e,a));let c=s.jPath?a.toString():a,l=s.tagValueProcessor(e,o,c,r,i);return l==null?o:typeof l!=typeof o||l!==o?l:s.trimValues||o.trim()===o?_r(o,s.parseTagValue,s.numberParseOptions):o}}function Gd(o){if(this.options.removeNSPrefix){let e=o.split(":"),a=o.charAt(0)==="/"?"/":"";if(e[0]==="xmlns")return"";e.length===2&&(o=a+e[1])}return o}function Qd(o,e,a,t=!1){let r=this.options;if(t===!0||r.ignoreAttributes!==!0&&typeof o=="string"){let i=In(o,Xd),n=i.length,s={},c=new Array(n),l=!1,d={};for(let m=0;m<n;m++){let g=this.resolveNameSpace(i[m][1]),v=i[m][4];if(g.length&&v!==void 0){let C=v;r.trimValues&&(C=C.trim()),C=this.replaceEntitiesValue(C,a,this.readonlyMatcher),c[m]=C,d[g]=C,l=!0}}l&&typeof e=="object"&&e.updateCurrent&&e.updateCurrent(d);let u=r.jPath?e.toString():this.readonlyMatcher,p=!1;for(let m=0;m<n;m++){let g=this.resolveNameSpace(i[m][1]);if(this.ignoreAttributesFn(g,u))continue;let v=r.attributeNamePrefix+g;if(g.length)if(r.transformAttributeName&&(v=r.transformAttributeName(v)),v=ss(v,r),i[m][4]!==void 0){let C=c[m],S=r.attributeValueProcessor(g,C,u);S==null?s[v]=C:typeof S!=typeof C||S!==C?s[v]=S:s[v]=_r(C,r.parseAttributeValue,r.numberParseOptions),p=!0}else r.allowBooleanAttributes&&(s[v]=!0,p=!0)}if(!p)return;if(r.attributesGroupName&&!r.preserveOrder){let m={};return m[r.attributesGroupName]=s,m}return s}}function Wd(o,e,a,t){this.options.captureMetaData||(t=void 0);let r=this.options.jPath?a.toString():a,i=this.options.updateTag(e.tagname,r,e[":@"]);i===!1||(typeof i=="string"&&(e.tagname=i),o.addChild(e,t))}function Zd(o,e,a){let t=this.options.processEntities;if(!t||!t.enabled)return o;if(t.allowedTags){let r=this.options.jPath?a.toString():a;if(!(Array.isArray(t.allowedTags)?t.allowedTags.includes(e):t.allowedTags(e,r)))return o}if(t.tagFilter){let r=this.options.jPath?a.toString():a;if(!t.tagFilter(e,r))return o}return this.entityDecoder.decode(o)}function Yd(o,e,a,t){return o&&(t===void 0&&(t=e.child.length===0),o=this.parseTextData(o,e.tagname,a,!1,e[":@"]?Object.keys(e[":@"]).length!==0:!1,t),o!==void 0&&o!==""&&e.add(this.options.textNodeName,o),o=""),o}function Kd(){return this.stopNodeExpressionsSet.size===0?!1:this.matcher.matchesAny(this.stopNodeExpressionsSet)}function eu(o,e,a=">"){let t=0,r=o.length,i=a.charCodeAt(0),n=a.length>1?a.charCodeAt(1):-1,s="",c=e;for(let l=e;l<r;l++){let d=o.charCodeAt(l);if(t)d===t&&(t=0);else if(d===34||d===39)t=d;else if(d===i)if(n!==-1){if(o.charCodeAt(l+1)===n)return s+=o.substring(c,l),{data:s,index:l}}else return s+=o.substring(c,l),{data:s,index:l};else d===9&&!t&&(s+=o.substring(c,l)+" ",c=l+1)}}function La(o,e,a,t){let r=o.indexOf(e,a);if(r===-1)throw new Error(t);return r+e.length-1}function au(o,e,a,t){let r=o.indexOf(e,a);if(r===-1)throw new Error(t);return r}function Tr(o,e,a,t=">"){let r=eu(o,e+1,t);if(!r)return;let i=r.data,n=r.index,s=i.search(/\s/),c=i,l=!0;s!==-1&&(c=i.substring(0,s),i=i.substring(s+1).trimStart());let d=c;if(a){let u=c.indexOf(":");u!==-1&&(c=c.substr(u+1),l=c!==r.data.substr(u+1))}return{tagName:c,tagExp:i,closeIndex:n,attrExpPresent:l,rawTagName:d}}function ou(o,e,a){let t=a,r=1,i=o.length;for(;a<i;a++)if(o[a]==="<"){let n=o.charCodeAt(a+1);if(n===47){let s=au(o,">",a,`${e} is not closed`);if(o.substring(a+2,s).trim()===e&&(r--,r===0))return{tagContent:o.substring(t,a),i:s};a=s}else if(n===63)a=La(o,"?>",a+1,"StopNode is not closed.");else if(n===33&&o.charCodeAt(a+2)===45&&o.charCodeAt(a+3)===45)a=La(o,"-->",a+3,"StopNode is not closed.");else if(n===33&&o.charCodeAt(a+2)===91)a=La(o,"]]>",a,"StopNode is not closed.")-2;else{let s=Tr(o,a,!1);s&&((s&&s.tagName)===e&&s.tagExp[s.tagExp.length-1]!=="/"&&r++,a=s.closeIndex)}}}function _r(o,e,a){if(e&&typeof o=="string"){let t=o.trim();return t==="true"?!0:t==="false"?!1:hr(o,a)}else return En(o)?o:""}function wr(o,e,a,t){if(o){let r=o(e);a===e&&(a=r),e=r}return e=ss(e,t),{tagName:e,tagExp:a}}function ss(o,e){if(Wo.includes(o))throw new Error(`[SECURITY] Invalid name: "${o}" is a reserved JavaScript keyword that could cause prototype pollution`);return to.includes(o)?e.onDangerousProperty(o):o}var uo,Xd,Jd,cs=w(()=>{"use strict";f();Zo();Ko();Vn();Qn();Jn();xr();xr();Tn();ns();uo=class{constructor(e,a){this.options=e,this.currentNode=null,this.tagsNodeStack=[],this.parseXml=Jd,this.parseTextData=Hd,this.resolveNameSpace=Gd,this.buildAttributesMap=Qd,this.isItStopNode=Kd,this.replaceEntitiesValue=Zd,this.readStopNodeData=ou,this.saveTextToParentTag=Yd,this.addChild=Wd,this.ignoreAttributesFn=vr(this.options.ignoreAttributes),this.entityExpansionCount=0,this.currentExpandedLength=0,this.doctypefound=!1;let t={...io};this.options.entityDecoder?this.entityDecoder=this.options.entityDecoder:(typeof this.options.htmlEntities=="object"?t=this.options.htmlEntities:this.options.htmlEntities===!0&&(t={...dr,...lr}),this.entityDecoder=new Sa({namedEntities:{...t,...a},numericAllowed:this.options.htmlEntities,limit:{maxTotalExpansions:this.options.processEntities.maxTotalExpansions,maxExpandedLength:this.options.processEntities.maxExpandedLength,applyLimitsTo:this.options.processEntities.appliesTo},onInputEntity:(i,n)=>is(n,[Ta,_a])?Ra.BLOCK:Ra.ALLOW})),this.matcher=new wa,this.readonlyMatcher=this.matcher.readOnly(),this.isCurrentNodeStopNode=!1,this.stopNodeExpressionsSet=new ya;let r=this.options.stopNodes;if(r&&r.length>0){for(let i=0;i<r.length;i++){let n=r[i];typeof n=="string"?this.stopNodeExpressionsSet.add(new sa(n)):n instanceof sa&&this.stopNodeExpressionsSet.add(n)}this.stopNodeExpressionsSet.seal()}}};Xd=new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`,"gm");Jd=function(o){o=o.replace(/\r\n?/g,`
`);let e=new ge("!xml"),a=e,t="";this.matcher.reset(),this.entityDecoder.reset(),this.entityExpansionCount=0,this.currentExpandedLength=0,this.doctypefound=!1;let r=this.options,i=new co(r.processEntities),n=o.length;for(let s=0;s<n;s++)if(o[s]==="<"){let l=o.charCodeAt(s+1);if(l===47){let d=La(o,">",s,"Closing Tag is not closed."),u=o.substring(s+2,d).trim();if(r.removeNSPrefix){let m=u.indexOf(":");m!==-1&&(u=u.substr(m+1))}u=wr(r.transformTagName,u,"",r).tagName,a&&(t=this.saveTextToParentTag(t,a,this.readonlyMatcher));let p=this.matcher.getCurrentTag();if(u&&r.unpairedTagsSet.has(u))throw new Error(`Unpaired tag can not be used as closing tag: </${u}>`);p&&r.unpairedTagsSet.has(p)&&(this.matcher.pop(),this.tagsNodeStack.pop()),this.matcher.pop(),this.isCurrentNodeStopNode=!1,a=this.tagsNodeStack.pop()||e,r.captureMetaData&&a&&a.addEndIndex(d+1),t="",s=d}else if(l===63){let d=Tr(o,s,!1,"?>");if(!d)throw new Error("Pi Tag is not closed.");t=this.saveTextToParentTag(t,a,this.readonlyMatcher);let u=this.buildAttributesMap(d.tagExp,this.matcher,d.tagName,!0);if(u){let p=u[this.options.attributeNamePrefix+"version"];this.entityDecoder.setXmlVersion(Number(p)||1),i.setXmlVersion(Number(p)||1)}if(!(r.ignoreDeclaration&&d.tagName==="?xml"||r.ignorePiTags)){let p=new ge(d.tagName);p.add(r.textNodeName,""),d.tagName!==d.tagExp&&d.attrExpPresent&&r.ignoreAttributes!==!0&&(p[":@"]=u),this.addChild(a,p,this.readonlyMatcher,s),r.captureMetaData&&a.addEndIndex(d.closeIndex+2)}s=d.closeIndex+1}else if(l===33&&o.charCodeAt(s+2)===45&&o.charCodeAt(s+3)===45){let d=La(o,"-->",s+4,"Comment is not closed.");if(r.commentPropName){let u=o.substring(s+4,d-2);t=this.saveTextToParentTag(t,a,this.readonlyMatcher),a.add(r.commentPropName,[{[r.textNodeName]:u}])}s=d}else if(l===33&&o.charCodeAt(s+2)===68){if(this.doctypefound)throw new Error("Multiple DOCTYPE declarations found.");this.doctypefound=!0;let d=i.readDocType(o,s);this.entityDecoder.addInputEntities(d.entities),s=d.i}else if(l===33&&o.charCodeAt(s+2)===91){let d=La(o,"]]>",s,"CDATA is not closed.")-2,u=o.substring(s+9,d);t=this.saveTextToParentTag(t,a,this.readonlyMatcher);let p=this.parseTextData(u,a.tagname,this.readonlyMatcher,!0,!1,!0,!0);p==null&&(p=""),r.cdataPropName?a.add(r.cdataPropName,[{[r.textNodeName]:u}]):a.add(r.textNodeName,p),s=d+2}else{let d=Tr(o,s,r.removeNSPrefix);if(!d){let O=o.substring(Math.max(0,s-50),Math.min(n,s+50));throw new Error(`readTagExp returned undefined at position ${s}. Context: "${O}"`)}let u=d.tagName,p=d.rawTagName,m=d.tagExp,g=d.attrExpPresent,v=d.closeIndex;if({tagName:u,tagExp:m}=wr(r.transformTagName,u,m,r),r.strictReservedNames&&(u===r.commentPropName||u===r.cdataPropName||u===r.textNodeName||u===r.attributesGroupName))throw new Error(`Invalid tag name: ${u}`);a&&t&&a.tagname!=="!xml"&&(t=this.saveTextToParentTag(t,a,this.readonlyMatcher,!1));let C=a;C&&r.unpairedTagsSet.has(C.tagname)&&(a=this.tagsNodeStack.pop(),this.matcher.pop());let S=!1;m.length>0&&m.lastIndexOf("/")===m.length-1&&(S=!0,u[u.length-1]==="/"?(u=u.substr(0,u.length-1),m=u):m=m.substr(0,m.length-1),g=u!==m);let T=null,N={},L;L=zd(p),u!==e.tagname&&this.matcher.push(u,{},L),u!==m&&g&&(T=this.buildAttributesMap(m,this.matcher,u),T&&(N=kd(T,r))),u!==e.tagname&&(this.isCurrentNodeStopNode=this.isItStopNode());let b=s;if(this.isCurrentNodeStopNode){let O="";if(S)s=d.closeIndex;else if(r.unpairedTagsSet.has(u))s=d.closeIndex;else{let x=this.readStopNodeData(o,p,v+1);if(!x)throw new Error(`Unexpected end of ${p}`);s=x.i,O=x.tagContent}let A=new ge(u);T&&(A[":@"]=T),A.add(r.textNodeName,O),this.matcher.pop(),this.isCurrentNodeStopNode=!1,this.addChild(a,A,this.readonlyMatcher,b),r.captureMetaData&&a.addEndIndex(s+1)}else{if(S){({tagName:u,tagExp:m}=wr(r.transformTagName,u,m,r));let O=new ge(u);T&&(O[":@"]=T),this.addChild(a,O,this.readonlyMatcher,b),r.captureMetaData&&a.addEndIndex(v+1),this.matcher.pop(),this.isCurrentNodeStopNode=!1}else if(r.unpairedTagsSet.has(u)){let O=new ge(u);T&&(O[":@"]=T),this.addChild(a,O,this.readonlyMatcher,b),r.captureMetaData&&a.addEndIndex(d.closeIndex+1),this.matcher.pop(),this.isCurrentNodeStopNode=!1,s=d.closeIndex;continue}else{let O=new ge(u);if(this.tagsNodeStack.length>r.maxNestedTags)throw new Error("Maximum nested tags exceeded");this.tagsNodeStack.push(a),T&&(O[":@"]=T),this.addChild(a,O,this.readonlyMatcher,b),a=O}t="",s=v}}}else t+=o[s];return e.child}});function tu(o,e){if(!o||typeof o!="object")return{};if(!e)return o;let a={};for(let t in o)if(t.startsWith(e)){let r=t.substring(e.length);a[r]=o[t]}else a[t]=o[t];return a}function Dr(o,e,a,t){return ls(o,e,a,t)}function ls(o,e,a,t){let r,i={};for(let n=0;n<o.length;n++){let s=o[n],c=ru(s);if(c!==void 0&&c!==e.textNodeName){let l=tu(s[":@"]||{},e.attributeNamePrefix);a.push(c,l)}if(c===e.textNodeName)r===void 0?r=s[c]:r+=""+s[c];else{if(c===void 0)continue;if(s[c]){let l=ls(s[c],e,a,t),d=nu(l,e);if(Object.keys(l).length===0&&e.alwaysCreateTextNode&&(l[e.textNodeName]=""),s[":@"]?iu(l,s[":@"],t,e):Object.keys(l).length===1&&l[e.textNodeName]!==void 0&&!e.alwaysCreateTextNode?l=l[e.textNodeName]:Object.keys(l).length===0&&(e.alwaysCreateTextNode?l[e.textNodeName]="":l=""),s[Lr]!==void 0&&typeof l=="object"&&l!==null&&(l[Lr]=s[Lr]),i[c]!==void 0&&Object.prototype.hasOwnProperty.call(i,c))Array.isArray(i[c])||(i[c]=[i[c]]),i[c].push(l);else{let u=e.jPath?t.toString():t;e.isArray(c,u,d)?i[c]=[l]:i[c]=l}c!==void 0&&c!==e.textNodeName&&a.pop()}}}return typeof r=="string"?r.length>0&&(i[e.textNodeName]=r):r!==void 0&&(i[e.textNodeName]=r),i}function ru(o){let e=Object.keys(o);for(let a=0;a<e.length;a++){let t=e[a];if(t!==":@")return t}}function iu(o,e,a,t){if(e){let r=Object.keys(e),i=r.length;for(let n=0;n<i;n++){let s=r[n],c=s.startsWith(t.attributeNamePrefix)?s.substring(t.attributeNamePrefix.length):s,l=t.jPath?a.toString()+"."+c:a;t.isArray(s,l,!0,!0)?o[s]=[e[s]]:o[s]=e[s]}}}function nu(o,e){let{textNodeName:a}=e,t=Object.keys(o).length;return!!(t===0||t===1&&(o[a]||typeof o[a]=="boolean"||o[a]===0))}var Lr,ds=w(()=>{"use strict";f();Ko();Lr=ge.getMetaDataSymbol()});var Da,us=w(()=>{f();Pn();cs();ds();On();Ko();Da=class{constructor(e){this.externalEntities={},this.options=Dn(e)}parse(e,a){if(typeof e!="string"&&e.toString)e=e.toString();else if(typeof e!="string")throw new Error("XML data is accepted in String or Bytes[] form.");if(a){a===!0&&(a={});let i=Sn(e,a);if(i!==!0)throw Error(`${i.err.msg}:${i.err.line}:${i.err.col}`)}let t=new uo(this.options,this.externalEntities),r=t.parseXml(e);return this.options.preserveOrder||r===void 0?r:Dr(r,this.options,t.matcher,t.readonlyMatcher)}addEntity(e,a){if(a.indexOf("&")!==-1)throw new Error("Entity value can't have '&'");if(e.indexOf("&")!==-1||e.indexOf(";")!==-1)throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");if(a==="&")throw new Error("An entity with value '&' is not permitted");this.externalEntities[e]=a}static getMetaDataSymbol(){return ge.getMetaDataSymbol()}}});var ps=w(()=>{"use strict";f();us()});function Pr(o){return o==null?[]:Array.isArray(o)?o:[o]}function U(o){if(o==null)return null;let e=String(typeof o=="object"?o["#text"]??"":o).trim();return e===""?null:e}function Ee(o){let e=U(o);if(e===null)return null;let a=Number(e.replace(",","."));return Number.isFinite(a)?a:null}function Pa(o,e){let a=U(o);if(a===null)return null;let t=a.replace(/\D/g,"");return t===""?null:t.length>=e?t.slice(-e):t.padStart(e,"0")}function B(o,e){if(o===null||typeof o!="object")return;let a=o;if(a[e]!==void 0)return a[e];for(let t of Object.keys(a))for(let r of Pr(a[t])){let i=B(r,e);if(i!==void 0)return i}}function po(o,e){let a={documentos:[],cancelamentos:new Set,ignorados:[]},t;try{t=su.parse(o)}catch(S){return{...a,ignorados:[{arquivo:e,motivo:`XML inv\xE1lido: ${S.message}`}]}}let r=B(t,"infEvento");if(r&&!B(t,"infNFe")){let S=U(B(r,"tpEvento")),T=U(B(r,"chNFe")),N=U(B(t,"cStat")),L=N===null||["135","136","155"].includes(N);return S==="110111"&&T&&L?{...a,cancelamentos:new Set([T])}:{...a,ignorados:[{arquivo:e,motivo:`evento ${S??"?"} sem efeito sobre o c\xE1lculo`}]}}let i=B(t,"infNFe");if(!i)return{...a,ignorados:[{arquivo:e,motivo:"n\xE3o \xE9 NF-e/NFC-e nem evento"}]};let n=Pr(i)[0],s=B(n,"ide")??{},c=B(n,"emit")??{},l=B(n,"dest")??{},d=B(t,"protNFe"),u=[],m=U(n["@Id"])?.replace(/^NFe/i,"")??null??U(B(d,"chNFe"));m||u.push("documento sem chave de acesso"),d||u.push("XML sem protocolo de autoriza\xE7\xE3o");let g=U(s.tpNF),v=Pr(n.det).map((S,T)=>{let N=S.prod??{},L=B(S.imposto,"IBSCBS"),b=L?B(L,"gIBSCBS"):void 0,O=b?B(b,"gIBSUF"):void 0,A=b?B(b,"gIBSMun"):void 0,x=b?B(b,"gCBS"):void 0,R=b?B(b,"gRed"):void 0,D=S.imposto?S.imposto.IS:void 0;return{nItem:Number(U(S["@nItem"])??T+1),cProd:U(N.cProd)??"",xProd:U(N.xProd)??"",ncm:Pa(N.NCM,8),cfop:Pa(N.CFOP,4),quantidade:Ee(N.qCom),valorProduto:Ee(N.vProd)??0,desconto:Ee(N.vDesc)??0,baseCalculo:b?Ee(B(b,"vBC")):null,valorIBSInformado:b?Ee(B(b,"vIBS")):null,valorCBSInformado:x?Ee(B(x,"vCBS")):null,cst:L?Pa(B(L,"CST"),3):null,cClassTrib:L?Pa(B(L,"cClassTrib"),6):null,aliquotas:{cbs:x?Ee(B(x,"pCBS"))??void 0:void 0,ibsUF:O?Ee(B(O,"pIBSUF"))??void 0:void 0,ibsMun:A?Ee(B(A,"pIBSMun"))??void 0:void 0,reducao:R?Ee(B(R,"pRedAliq"))??void 0:void 0},unidade:U(N.uCom),impostoSeletivo:D?{cst:Pa(D.CSTIS,3),cClassTrib:Pa(D.cClassTribIS,6),base:Ee(D.vBCIS),aliquota:Ee(D.pIS),valor:Ee(D.vIS)}:null}});return{documentos:[{chave:m,modelo:U(s.mod),numero:U(s.nNF),serie:U(s.serie),dataEmissao:U(s.dhEmi)??U(s.dEmi),tipoOperacao:g==="1"?"saida":g==="0"?"entrada":null,finalidade:U(s.finNFe),situacao:U(B(d,"cStat")),cancelado:!1,emitente:{cnpj:U(c.CNPJ),crt:U(c.CRT),uf:U(B(c,"UF"))},destinatario:{cnpj:U(l.CNPJ),cpf:U(l.CPF),uf:U(B(l,"UF")),indIEDest:U(l.indIEDest)},itens:v,arquivo:e,avisos:u}],cancelamentos:new Set,ignorados:[]}}function ca(o,e={}){let a=new Set;for(let n of o)for(let s of n.cancelamentos)a.add(s);let t=e.cfopsVenda??/^[56][14]\d{2}$/,r=new Map,i=[];for(let n of o){for(let s of n.ignorados)i.push({documento:s.arquivo,motivo:s.motivo});for(let s of n.documentos){let c=s.chave??s.arquivo;if(s.tipoOperacao!=="saida"){i.push({documento:c,motivo:`tpNF ${s.tipoOperacao??"ausente"}: n\xE3o \xE9 sa\xEDda`});continue}if(s.finalidade==="4"){i.push({documento:c,motivo:"finNFe 4: devolu\xE7\xE3o"});continue}if(s.situacao&&!["100","150"].includes(s.situacao)){i.push({documento:c,motivo:`cStat ${s.situacao}: n\xE3o autorizada`});continue}if(s.chave&&a.has(s.chave)){i.push({documento:c,motivo:"cancelada por evento 110111"});continue}if(s.chave&&r.has(s.chave)){i.push({documento:c,motivo:"duplicada: mesma chave j\xE1 lida"});continue}for(let l of s.itens)l.cfop&&!t.test(l.cfop)&&s.avisos.push(`item ${l.nItem}: CFOP ${l.cfop} fora da faixa de venda`);r.set(s.chave??`${s.arquivo}#${r.size}`,s)}}return{documentos:[...r.values()],descartados:i}}var su,rt=w(()=>{"use strict";f();ps();su=new Da({ignoreAttributes:!1,attributeNamePrefix:"@",parseTagValue:!1,parseAttributeValue:!1,removeNSPrefix:!0,trimValues:!0})});function Ma(o,e,a,t=la){let r=e.slice(0,10),i=t.filter(n=>n.tributo===o&&n.inicio<=r&&(n.fim===null||n.fim>=r)&&(a||n.tipo==="vigente"));return i.sort((n,s)=>n.tipo===s.tipo?0:n.tipo==="vigente"?-1:1),i[0]??null}function it(o,e,a){if(!o||!a)return null;let t=cu.find(r=>r.modelo.includes(o)&&r.regimes.includes(e));return t?{obrigatorio:a.slice(0,10)>=t.inicio,fonte:t.fonte}:null}function ms(o,e){return o?lu.filter(a=>a.prefixosNcm.some(t=>o.startsWith(t))).map(a=>({...a,emVigor:e.slice(0,10)>=a.inicio})):[]}function fs(o,e){if(!o)return null;let a=e.normalize("NFD").replace(/[̀-ͯ]/g,"").toUpperCase();if(/\bZERO\b.*\bALCOOL\b|\bSEM ALCOOL\b/.test(a))return null;let t=du.find(r=>r.termo.test(a));return!t||t.posicoes.some(r=>o.startsWith(r))?null:`A descri\xE7\xE3o indica ${t.descricao}, mas o NCM informado \xE9 ${o}; conferir a classifica\xE7\xE3o do produto (${uu}).`}var la,cu,lu,du,uu,nt=w(()=>{"use strict";f();la=[{tributo:"CBS",inicio:"2026-01-01",fim:"2026-12-31",aliquota:.009,tipo:"vigente",fonte:"LC 214/2025, per\xEDodo de teste de 2026: CBS de 0,9%, compens\xE1vel com PIS/Cofins; recolhimento dispensado nos termos do art. 348, \xA7 1\xBA, se cumpridas as obriga\xE7\xF5es acess\xF3rias"},{tributo:"IBS",inicio:"2026-01-01",fim:"2026-12-31",aliquota:.001,tipo:"vigente",fonte:"LC 214/2025, per\xEDodo de teste de 2026: IBS de 0,1%"},{tributo:"CBS",inicio:"2027-01-01",fim:null,aliquota:.0943,tipo:"projecao",fonte:"Estimativa divulgada durante os trabalhos RFB/TCU (set/2026). N\xE3o \xE9 al\xEDquota oficial."}],cu=[{modelo:["55","65"],regimes:["normal"],inicio:"2026-08-03",fonte:"Ato Conjunto RFB/CGIBS n\xBA 4/2026: cronograma em lotes, NF-e e NFC-e a partir de 03/08/2026"},{modelo:["55","65"],regimes:["simples","mei"],inicio:"2027-01-01",fonte:"Cronograma: optantes do Simples Nacional a partir de 01/01/2027"}];lu=[{id:"IS-BEBIDAS-ACUCARADAS",prefixosNcm:["22021000"],inicio:"2027-01-01",texto:"Bebida a\xE7ucarada do Anexo XVII (2202.10.00): sujeita ao Imposto Seletivo, tributo distinto do IBS/CBS, a partir de 1\xBA/1/2027, cobrado uma \xFAnica vez no primeiro fornecimento (fabricante ou importador); a revenda n\xE3o recolhe o imposto e o IBS/CBS segue a regra geral.",fonte:"LC 214/2025, arts. 409, \xA7 1\xBA, V, 410 e 412, I, e Anexo XVII; EC 132/2023 (in\xEDcio em 2027); al\xEDquotas a fixar em lei ordin\xE1ria"},{id:"IS-BEBIDAS-ALCOOLICAS",prefixosNcm:["2203","2204","2205","2206","2208"],inicio:"2027-01-01",texto:"Bebida alco\xF3lica do Anexo XVII: sujeita ao Imposto Seletivo, tributo distinto do IBS/CBS, a partir de 1\xBA/1/2027, cobrado uma \xFAnica vez no primeiro fornecimento; a revenda n\xE3o recolhe o imposto e o IBS/CBS segue a regra geral. Fica fora do regime de bares e restaurantes.",fonte:"LC 214/2025, arts. 273, \xA7 2\xBA, III, 409, \xA7 1\xBA, IV, 410 e 412, I, e Anexo XVII; EC 132/2023 (in\xEDcio em 2027); al\xEDquotas a fixar em lei ordin\xE1ria"}];du=[{termo:/\b(CERVEJA|CHOPP?)\b/,posicoes:["2203"],descricao:"cerveja de malte (posi\xE7\xE3o 22.03)"},{termo:/\bVINHO\b/,posicoes:["2204","2205"],descricao:"vinho (posi\xE7\xF5es 22.04 e 22.05)"},{termo:/\b(VODKA|WHISKY|CACHACA|RUM|GIN|TEQUILA|CAIPIRINHA|CAIPIROSKA|CAIPIRA)\b/,posicoes:["2208"],descricao:"aguardente/destilado (posi\xE7\xE3o 22.08)"},{termo:/\b(REFRIGERANTE|COCA[ -]?COLA|GUARANA|SPRITE|FANTA|PEPSI)\b/,posicoes:["2202","2106"],descricao:"refrigerante (posi\xE7\xE3o 22.02)"},{termo:/\bAGUA MINERAL\b/,posicoes:["2201"],descricao:"\xE1gua mineral (posi\xE7\xE3o 22.01)"}],uu="TIPI (Decreto n\xBA 11.158/2022), Cap\xEDtulo 22"});function qr(o){if(o===null)return null;let e=o.replace(/^0+/,"");return e===""?"0":e}function Je(o,e){return qr(o)===qr(e)}function gs(o,e,a){let t=a.slice(0,10);return o.regras.filter(r=>r.ncm===e&&r.vigenciaInicio<=t&&(r.vigenciaFim===null||r.vigenciaFim>=t))}function pu(o,e,a){if(o.natureza)return o.natureza;let t=a?.get(o.cProd)??a?.get(o.xProd);return t||(e.barOuRestaurante?null:"mercadoria")}function mu(o,e,a){let t=(o??[]).filter(r=>r.ncm===e&&(r.cProd===a.cProd||r.cProd===a.xProd));return t[t.length-1]?.escolha??null}function Fr(o){return`${Math.round(o*100)}%`}function fu(o,e,a,t){let r=t.length===8?`${t.slice(0,4)}.${t.slice(4,6)}.${t.slice(6)}`:t;return`Regra encontrada pelo NCM: CST ${o.cst} / cClassTrib ${o.cClassTrib} / Anexo ${o.anexo} / Item ${o.item||"?"}. Redu\xE7\xE3o prevista na regra: ${Fr(o.reducaoAliquota)} IBS / ${Fr(o.reducaoAliquota)} CBS. Resultado da valida\xE7\xE3o: N\xC3O APLIC\xC1VEL AO PRODUTO. Motivo: o benef\xEDcio do Item ${o.item||"?"} do Anexo ${o.anexo} \xE9 espec\xEDfico para ${e}. Embora o produto esteja classificado no NCM ${r}, a descri\xE7\xE3o informada \xE9 "${a}", que n\xE3o atende, por si s\xF3, \xE0 descri\xE7\xE3o legal da regra. A redu\xE7\xE3o de ${Fr(o.reducaoAliquota)} N\xC3O deve ser aplicada.`}function gu(o){if(o.estado!=="INCORRETO_RISCO")return o;if(o.esperado===null)return{...o,estado:"REQUER_VALIDACAO"};let e=o.exposicao;return{...o,estado:"INCORRETO_ECONOMIA",economiaPotencial:e===null?null:-e,motivo:`Rec\xE1lculo de imposto: ${e===null?"valor a pagar n\xE3o calculado":`valor a pagar de ${e.toFixed(2)}`}. ${o.motivo}`}}function Br(o,e,a){return gu(hu(o,e,a))}function hu(o,e,a){let t=a.agora??new Date().toISOString(),r=[],i=[],n=!1,s=[],c=[...ms(e.ncm,o.dataEmissao??t).map(I=>`${I.texto} Fonte: ${I.fonte}.${I.emVigor?"":" Ainda n\xE3o vigente na data do documento."}`),...[fs(e.ncm,e.xProd)].filter(I=>!!I)],l=I=>c.length?{...I,motivo:`${I.motivo} ${c.join(" ")}`}:I,d=(I,q,Z={})=>l({documento:o.chave??o.arquivo,nItem:e.nItem,cProd:e.cProd,produto:e.xProd,ncm:e.ncm,informado:{cst:e.cst,cClassTrib:e.cClassTrib},esperado:null,estado:I,motivo:q,regraAplicada:null,regrasCandidatas:[],baseCalculo:e.baseCalculo??e.valorProduto-e.desconto,valorIBSInformado:e.valorIBSInformado??null,valorCBSInformado:e.valorCBSInformado??null,valorInformadoTotal:e.valorIBSInformado==null&&e.valorCBSInformado==null?null:Number(((e.valorIBSInformado??0)+(e.valorCBSInformado??0)).toFixed(2)),valorPago:null,valorCorreto:null,economiaPotencial:null,economiaSujeitaValidacao:null,exposicao:null,aliquotaUsada:[],dadosFaltantes:r,versaoBase:a.base.versao,calculadoEm:t,...Z,...n?{ncmACorrigir:!0}:{},...s.length?{regrasNaoAplicaveis:s}:{},...i.length?{regrasBloqueadas:i,motivo:q.includes(Mr)?q:`${q} ${Mr}: ${i.join(", ")}.`}:{}});if(o.dataEmissao||r.push("data de emiss\xE3o do documento"),e.ncm||r.push("NCM do item"),r.length>0)return d("REQUER_VALIDACAO",`Falta: ${r.join("; ")}. O enquadramento depende de valida\xE7\xE3o humana.`);let u=o.dataEmissao??t,p=e.ncm??"",m=e.cst!==null||e.cClassTrib!==null;if(!m){let I=it(o.modelo,a.empresa.regime,u);if(I===null)return r.push("modelo do documento ou regime do emitente"),d("REQUER_VALIDACAO","Grupo IBS/CBS ausente e n\xE3o d\xE1 para saber se o preenchimento j\xE1 era exigido: valida\xE7\xE3o humana.");if(!I.obrigatorio)return d("NAO_OBRIGATORIO",`Grupo IBS/CBS ainda n\xE3o exigido nesta data. ${I.fonte}`)}let g=mu(a.validacoes,p,e);n=g==="NCM_INCORRETO";let v=(a.validacoes??[]).some(I=>I.ncm===p&&(I.cProd===e.cProd||I.cProd===e.xProd)),C=g==="CONSUMO_NO_LOCAL"?"preparado_no_local":pu(e,a.empresa,a.naturezaPorProduto)??(v?"mercadoria":null);if(C===null){r.push(`natureza do item ${e.cProd||e.xProd} (preparado no local, bebida alco\xF3lica ou mercadoria)`);let I=gs(a.base,p,u).filter(q=>!a.regrasBloqueadas?.has(`${q.id}|${q.ncm}`));return d("REQUER_VALIDACAO","Emitente atende consumo no local e a natureza do item n\xE3o foi informada: valida\xE7\xE3o humana (consumo no local, bebida alco\xF3lica ou mercadoria).",{regrasCandidatas:I.map(q=>q.id)})}let S=()=>{let I=[],q=0;for(let Z of["CBS","IBS"]){let se=Ma(Z,u,a.aceitarProjecao??!1,a.aliquotas??la);se?(I.push({tributo:Z,aliquota:se.aliquota,fonte:se.fonte,tipo:se.tipo}),q+=se.aliquota):r.push(`al\xEDquota de refer\xEAncia de ${Z} vigente em ${u.slice(0,10)}`)}return{usadas:I,total:q}};if(C==="preparado_no_local"){let I={cst:K.cst,cClassTrib:K.cClassTrib},q=Je(e.cst,I.cst)&&Je(e.cClassTrib,I.cClassTrib),Z=`Regime espec\xEDfico de bares e restaurantes (${K.fundamento}): redu\xE7\xE3o de 40%.`,{usadas:se,total:Ge}=S(),Ve=e.baseCalculo??e.valorProduto-e.desconto,je=se.length===2?Ve*Ge:null,Ro={esperado:I,regraAplicada:K.fundamento,baseCalculo:Ve,aliquotaUsada:se};if(!m)return d("INCORRETO_RISCO",`Grupo IBS/CBS exigido e n\xE3o informado no documento. ${Z}`,Ro);if(q)return d("CORRETO",Z,{...Ro,valorPago:je,valorCorreto:je,economiaPotencial:0});if(Je(e.cClassTrib,da.cClassTrib)){let Rt=je===null?null:je*K.reducao;return d("INCORRETO_ECONOMIA",`${Z} O documento usa tributa\xE7\xE3o integral.`,{...Ro,valorPago:je,valorCorreto:je===null||Rt===null?null:je-Rt,economiaPotencial:Rt})}let bi=e.cClassTrib?a.base.catalogoCodigos[qr(e.cClassTrib).padStart(6,"0")]:void 0,Ec=je!==null&&bi?je*Math.max(0,bi.reducao-K.reducao):null;return d("INCORRETO_RISCO",`C\xF3digo ${e.cClassTrib} informado no lugar do regime espec\xEDfico. ${Z}`,{...Ro,exposicao:Ec})}let T=C==="bebida_alcoolica"||C==="servico"?[]:gs(a.base,p,u),N=a.regrasBloqueadas?T.filter(I=>a.regrasBloqueadas.has(`${I.id}|${I.ncm}`)):[],L=N.length?T.filter(I=>!N.includes(I)):T;i=N.map(I=>I.id);let b=(a.validacoes??[]).filter(I=>I.ncm===p&&(I.cProd===e.cProd||I.cProd===e.xProd)),O=new Set(b.filter(I=>I.resposta==="NAO").map(I=>I.regraId)),A=new Set(b.filter(I=>I.resposta==="SIM").map(I=>I.regraId)),x=L.filter(I=>!O.has(I.id)),R=x.filter(I=>!A.has(I.id)).map(I=>({r:I,req:Go(e.xProd,I.descricaoLegal,I.descricaoNcmTipi)})).filter(I=>I.req!==null);s=R.map(({r:I,req:q})=>({regraId:I.id,cst:I.cst,cClassTrib:I.cClassTrib,anexo:I.anexo,item:I.item,fundamentoLegal:I.fundamentoLegal,reducaoPrevista:I.reducaoAliquota,designacaoLegal:q.designacaoLegal,motivo:fu(I,q.designacaoLegal,e.xProd,p)}));let D=x.filter(I=>!R.some(q=>q.r===I)),_=D.filter(I=>A.has(I.id)),j=s.map(I=>I.motivo).join(" "),Be=L.map(I=>I.id),ee=null,He=null,Q="";if(D.length===0&&R.length>0)He="REQUER_VALIDACAO",Q=`${j} Nenhuma outra regra de benef\xEDcio do NCM ${p} se aplica automaticamente: o enquadramento aguarda valida\xE7\xE3o humana (consumo no local pelo regime de bares e restaurantes, mercadoria sem benef\xEDcio ou NCM incorreto).`;else if(D.length===0)ee=null,Q=L.length>0?"Todas as regras do NCM foram descartadas na valida\xE7\xE3o: o produto n\xE3o se enquadra na descri\xE7\xE3o legal."+(g==="MERCADORIA_SEM_BENEFICIO"?" Verificado na valida\xE7\xE3o: vendido como mercadoria, com o NCM informado correto; nenhuma outra regra de benef\xEDcio do NCM se aplica e o regime de bares e restaurantes (art. 275) n\xE3o vale para mercadoria.":g==="NCM_INCORRETO"?" A valida\xE7\xE3o indicou que o NCM informado est\xE1 errado: corrigir o NCM no ERP e reprocessar com as novas notas. Nenhum benef\xEDcio de outro NCM \xE9 aplicado ao NCM informado.":""):N.length>0?`Nenhuma regra de benef\xEDcio aplic\xE1vel: ${Mr} (${i.join(", ")}).`:"Nenhuma regra de benef\xEDcio cadastrada para este NCM nesta data.";else if(_.length===1)ee=_[0],Q=`Benef\xEDcio confirmado na valida\xE7\xE3o: ${ee.rotulo} (${ee.fundamentoLegal}).`;else if(_.length>1)He="REQUER_VALIDACAO",Q=`Mais de um benef\xEDcio confirmado para o mesmo item: ${_.map(I=>`${I.cClassTrib} (Anexo ${I.anexo})`).join(", ")}. \xC9 preciso escolher um.`;else{He="REQUER_VALIDACAO";let I=D.map(q=>`${q.cClassTrib} (Anexo ${q.anexo}, item ${q.item||"?"})`);Q=D.length>1?`NCM com ${D.length} enquadramentos poss\xEDveis: ${I.join(", ")}. A composi\xE7\xE3o do produto decide qual vale.`:`Enquadramento poss\xEDvel em ${I[0]}, sujeito \xE0 confer\xEAncia da descri\xE7\xE3o legal.`}if(g==="NCM_INCORRETO")return d("INCORRETO_NCM",`AJUSTAR O NCM: a valida\xE7\xE3o indicou que o NCM ${p} informado para "${e.xProd}" est\xE1 errado. Corrigir o NCM no cadastro do produto no ERP e reprocessar com as novas notas. Nenhum enquadramento \xE9 proposto para o NCM informado e nenhum benef\xEDcio de outro NCM \xE9 aplicado.`,{regrasCandidatas:Be,baseCalculo:e.baseCalculo??e.valorProduto-e.desconto});R.length>0&&D.length>0&&(Q=`${j} Reenquadramento entre as demais regras do NCM: ${Q}`);let ie=ee?{cst:ee.cst,cClassTrib:ee.cClassTrib}:da,{usadas:oe,total:te}=S(),ne=e.baseCalculo??e.valorProduto-e.desconto,No=ee?.reducaoAliquota??0,za=Je(e.cst,ie.cst)&&Je(e.cClassTrib,ie.cClassTrib);if(!m){let I="Grupo IBS/CBS exigido e n\xE3o informado no documento.";if(He==="REQUER_VALIDACAO"){let Z=D.length?Math.max(...D.map(se=>se.reducaoAliquota)):0;return d("INCORRETO_RISCO",`${I} Enquadramento esperado: depende da valida\xE7\xE3o. ${Q}`,{esperado:null,regrasCandidatas:Be,baseCalculo:ne,exposicao:oe.length===2?ne*te*(1-Z):null,aliquotaUsada:oe})}let q=ee?`${ie.cst}/${ie.cClassTrib} (${ee.rotulo}, ${ee.fundamentoLegal}).`:`${ie.cst}/${ie.cClassTrib} (regra geral, sem benef\xEDcio aplic\xE1vel).`;return d("INCORRETO_RISCO",`${I} Enquadramento esperado: ${q} ${Q}`,{esperado:ie,regraAplicada:ee?.id??null,regrasCandidatas:Be,baseCalculo:ne,exposicao:oe.length===2?ne*te*(1-No):null,aliquotaUsada:oe})}if(He==="REQUER_VALIDACAO"){let I=D.length?Math.min(...D.map(Ve=>Ve.reducaoAliquota)):0,q=Je(e.cClassTrib,da.cClassTrib),Z=D.find(Ve=>Je(e.cClassTrib,Ve.cClassTrib)),se=Z?` O documento j\xE1 usa ${Z.cClassTrib}: falta confirmar que o produto atende \xE0 descri\xE7\xE3o legal e \xE0s veda\xE7\xF5es do Anexo ${Z.anexo}.`:"",Ge=oe.length===2?ne*te:null;return d("REQUER_VALIDACAO",Q+se,{esperado:null,regrasCandidatas:Be,baseCalculo:ne,valorPago:Ge,valorCorreto:null,economiaPotencial:null,economiaSujeitaValidacao:q&&Ge!==null?Ge*I:null,aliquotaUsada:oe})}if(za)return d("CORRETO",Q||"C\xF3digos conferem com a regra aplic\xE1vel.",{esperado:ie,regraAplicada:ee?.id??null,regrasCandidatas:Be,baseCalculo:ne,valorPago:oe.length===2?ne*te:null,valorCorreto:oe.length===2?ne*te:null,economiaPotencial:0,aliquotaUsada:oe});if(!Je(e.cClassTrib,da.cClassTrib)&&!(ee!==null)){let I=oe.length===2?ne*te:null;return d("INCORRETO_RISCO",`C\xF3digo ${e.cClassTrib} informado sem regra que o ampare para o NCM ${p}. ${Q}`,{esperado:ie,regrasCandidatas:Be,baseCalculo:ne,exposicao:I,aliquotaUsada:oe})}let ye=oe.length===2?ne*te:null,aa=ye===null?null:ye*No,Ha=ye===null||aa===null?null:ye-aa;return d("INCORRETO_ECONOMIA",Q||"Benef\xEDcio aplic\xE1vel n\xE3o foi utilizado.",{esperado:ie,regraAplicada:ee?.id??null,regrasCandidatas:Be,baseCalculo:ne,valorPago:ye,valorCorreto:Ha,economiaPotencial:aa,aliquotaUsada:oe})}function st(o,e){let a=[];for(let t of o)for(let r of t.itens)a.push(Br(t,r,e));return a}var da,K,Mr,Fa=w(()=>{"use strict";f();Zt();nt();da={cst:"000",cClassTrib:"000001"},K={cst:"200",cClassTrib:"200047",reducao:.4,fundamento:"LC 214/2025, art. 275"},Mr="Regra bloqueada por incompatibilidade oficial do NCM com este enquadramento"});function We(o){if(o.toLowerCase()!=="sha256")throw new Error(`hash n\xE3o suportado no navegador: ${o}`);let e=Za.create(),a={update(t){return e.update(typeof t=="string"?new TextEncoder().encode(t):t),a},digest(t){let r=e.digest();return t==="hex"?Ja(r):hs.Buffer.from(r)}};return a}var hs,mo=w(()=>{"use strict";f();hs=ue(To(),1);Bt();Wa()});function vu(o){return o.situacaoNcmSvrs==="VEDADO"?o.ncmNaListaDoAnexoI===!0?"VEDADO_ANEXO_I":o.excluidoDoItemDaRegra?"VEDADO_EXCECAO_ITEM":"VEDADO_EXCECAO_LEI":o.status==="NAO_LOCALIZADA"&&o.excecaoNaLeiEmItens.length>0?"EXCLUSAO_LEGAL":null}function jr(o){let e=new Map;for(let a of o.regras){let t=vu(a);t&&e.set(fo(a.regraId,a.ncm),{regraId:a.regraId,ncm:a.ncm,cClassTrib:a.cClassTrib,item:a.item,tipo:t,mensagem:Vr,motivo:bu[t],motivosDaAuditoria:a.motivos,situacaoNcmSvrs:a.situacaoNcmSvrs,excecaoNaLeiEmItens:a.excecaoNaLeiEmItens,fatosF1:a.fatosF1,fatosF2:a.fatosF2,fontes:{F1:{url:o.entradas.F1.url??"",arquivo:o.entradas.F1.arquivo,sha256:o.entradas.F1.sha256},F2:{url:o.entradas.F2.url??"",arquivo:o.entradas.F2.arquivo,sha256:o.entradas.F2.sha256}}})}return e}function ua(o){let e=(0,ct.join)((0,ct.dirname)(o),"auditoria-oficial.json");if(!k(e))return new Map;let a=bs(P(o)),t=P(e),r=`${a}|${bs(t)}`,i=vs.get(r);if(i)return i;let n=JSON.parse(t.toString("utf8"));if(n.entradas.base.sha256!==a)throw new Error(`${e} n\xE3o corresponde a ${o}: rode node scripts/auditoria_oficial.mjs antes de processar (os bloqueios oficiais dependem dela).`);let s=jr(n);return vs.set(r,s),s}function qa(o){return new Set(o.keys())}var ct,Vr,fo,bu,vs,bs,Ba=w(()=>{"use strict";f();mo();le();ct=ue(Ne(),1),Vr="Regra bloqueada por incompatibilidade oficial do NCM com este enquadramento.",fo=(o,e)=>`${o}|${e}`;bu={VEDADO_ANEXO_I:'O SVRS lista o NCM como VEDADO para este c\xF3digo, com a ressalva "Produtos relacionados no Anexo I"; o NCM consta da lista oficial do Anexo I (200003).',VEDADO_EXCECAO_ITEM:"O SVRS lista o NCM como VEDADO para este c\xF3digo e o pr\xF3prio item da regra na LC 214/2025 exclui expressamente o NCM.",VEDADO_EXCECAO_LEI:"O SVRS lista o NCM como VEDADO para este c\xF3digo e a LC 214/2025 exclui expressamente o NCM no item do anexo que o abrange.",EXCLUSAO_LEGAL:"A LC 214/2025 exclui expressamente o NCM do item da regra, e o SVRS n\xE3o o lista para este c\xF3digo."};vs=new Map,bs=o=>We("sha256").update(o).digest("hex")});function ut(o){let e=P(o.base),a=P(o.v2),t=JSON.parse(e.toString("utf8")),r=JSON.parse(a.toString("utf8")),i=P(o.matriz),n=JSON.parse(i.toString("utf8")),s=JSON.parse(P(o.empresa,"utf8")),c=[],l=null,d=r.fontes?.registros?.F2?.arquivos.find(p=>p.id==="F2.extracao");if(d?.caminho){let p=P(d.caminho);lt(p)===d.sha256?l=JSON.parse(p.toString("utf8")).cst200.ClassificacoesTributarias:c.push("A extra\xE7\xE3o F2 n\xE3o confere com o hash registrado na v2; informa\xE7\xF5es do SVRS sobre condi\xE7\xF5es n\xE3o foram exibidas.")}else c.push("A extra\xE7\xE3o F2 n\xE3o est\xE1 registrada na v2; informa\xE7\xF5es do SVRS sobre condi\xE7\xF5es n\xE3o foram exibidas.");let u=xu(o.auditoria??(0,dt.join)((0,dt.dirname)(o.v2),"auditoria-oficial.json"),lt(e),lt(a),r,c);return{base:t,v2:r,validacoes:s.validacoes??[],matriz:{versao:n.versao,hash:lt(i)},f2:l,avisos:c,auditoria:u}}function xu(o,e,a,t,r){if(!k(o))return null;let i=JSON.parse(P(o,"utf8")),n=l=>Object.values(t.fontes?.registros??{}).flatMap(d=>d.arquivos).find(d=>d.id===l)?.sha256;if(i.entradas.base.sha256!==e||i.entradas.v2.sha256!==a||i.entradas.F1.sha256!==n("F1.html")||i.entradas.F2.sha256!==n("F2.html"))return r.push("A auditoria oficial n\xE3o corresponde \xE0 base, \xE0 v2 ou aos snapshots atuais; a confer\xEAncia com as fontes oficiais n\xE3o foi exibida."),null;let s=l=>({url:i.entradas[l].url??"",arquivo:i.entradas[l].arquivo,sha256:i.entradas[l].sha256,natureza:i.entradas[l].natureza??""}),c=new Map;for(let l of i.lacunas)c.set(l.ncm,[...c.get(l.ncm)??[],l]);return{porIndice:new Map(i.regras.map(l=>[l.indice,l])),lacunasPorNcm:c,codigos:i.codigos,fontes:{F1:s("F1"),F2:s("F2")},bloqueios:jr(i)}}function Au(o,e,a,t){let r=o.auditoria?.porIndice.get(e);if(!o.auditoria||!r||r.regraId!==a||r.ncm!==t)return null;let{indice:i,regraId:n,ncm:s,item:c,...l}=r,d=o.auditoria.codigos[r.cClassTrib];return d?{...l,itemDaBase:c,codigo:d,fontes:o.auditoria.fontes}:null}function Nu(o){let e=xs.get(o);if(e)return e;let a={porIdENcm:new Map,contagemId:new Map,vinculoPorIndice:new Map,codigo:new Map,lacunasPorNcm:new Map,codigosPorNcm:new Map,f2PorCodigo:new Map};o.base.regras.forEach((t,r)=>{let i=`${t.id}|${t.ncm}`;a.porIdENcm.set(i,[...a.porIdENcm.get(i)??[],r]),a.contagemId.set(t.id,(a.contagemId.get(t.id)??0)+1),a.codigosPorNcm.has(t.ncm)||a.codigosPorNcm.set(t.ncm,new Set),a.codigosPorNcm.get(t.ncm).add(t.cClassTrib)});for(let t of o.v2.vinculacoes?.regras??[])a.vinculoPorIndice.set(t.regra.indice,t);for(let t of[...o.v2.vinculacoes?.codigo??[],...o.v2.evidenciasOficiais?.codigo??[]]){if(a.codigo.has(t.id))throw new Error(`v\xEDnculo de c\xF3digo duplicado na v2: ${t.id}`);a.codigo.set(t.id,t)}for(let t of o.v2.vinculacoes?.ncmsOficiaisSemRegra??[])a.lacunasPorNcm.set(t.ncm,[...a.lacunasPorNcm.get(t.ncm)??[],t]);for(let t of o.f2??[])a.f2PorCodigo.set(t.CodClassTrib,t);return xs.set(o,a),a}function Is(o,e,a,t){let r=o.v2.fontes?.registros?.[e],i=r?.arquivos.find(n=>n.id===a);return!r||!i?null:{camada:"FONTE_DIZ",fonte:e,arquivo:a,sha256:i.sha256,natureza:t,versao:r.versao,dataConsulta:r.dataConsulta}}function Ru(o,e){let a=o.v2.regras[e]?.original,t=Is(o,"PLANILHA","PLANILHA.base-de-dados","base interna da planilha V4.1; n\xE3o oficial");return!a||a.fonte!=="PLANILHA"||!t?[]:["Fundamento legal","Descri\xE7\xE3o legal do benef\xEDcio"].flatMap(r=>{let i=a.valores[r];return i==null?[]:[{...t,localizacao:{aba:"Base de dados",linha:a.linha,coluna:r},trecho:i}]})}function $r(o,e,a){return{camada:"SISTEMA_INFERE",regra:o,premissas:e,conclusao:a}}function Ur(o){return{valor:null,origem:null,regraIndice:null,linhaPlanilha:null,evidencia:"nao_determinada",comparacao:null,fatos:[],motivo:o}}function Ou(o,e,a,t){let r={valor:t.reducaoAliquota,origem:"base_normativa",regraIndice:e,linhaPlanilha:a},i=o.codigo.get(`C-${t.cClassTrib}-reducaoAliquota`),n=!!i&&(i.alcance??[]).some(d=>d.indice===e);if(!i||!n)return{...r,evidencia:"sem_evidencia_oficial",comparacao:null,fatos:[],motivo:i?`O v\xEDnculo ${i.id} n\xE3o alcan\xE7a esta regra; o percentual vem s\xF3 da base normativa.`:`O c\xF3digo ${t.cClassTrib} est\xE1 fora do escopo auditado; o percentual vem s\xF3 da base normativa, sem confer\xEAncia com fonte oficial.`};let s=i.fatos.map(Va),c=typeof i.valorRegra!="number"||i.valorRegra===t.reducaoAliquota,l=i.comparacao.resultado==="concorda"&&c;return{...r,evidencia:l?"oficial_confirmada":"oficial_divergente",comparacao:i.comparacao.resultado,fatos:s,motivo:l?`O v\xEDnculo ${i.id} confere o percentual com as fontes oficiais (resultado "${i.comparacao.resultado}").`:`O v\xEDnculo ${i.id} n\xE3o confirma o percentual da regra (resultado "${i.comparacao.resultado}"${c?"":`; valor do v\xEDnculo ${String(i.valorRegra)}`}).`}}function go(o){return{status:"pendente",decisao:o}}function yu(o,e,a,t,r){let i=e.codigo.get(`C-${a}-anexo`)?.fatos.find(m=>m.fonte==="F1");if(!i||a!=="200033"&&a!=="200043")return{condicoes:[],fatosF2:[]};let n=[],s=e.f2PorCodigo.get(a),c=Is(o,"F2","F2.extracao","tabela de apoio do portal da Conformidade F\xE1cil (SVRS); n\xE3o \xE9 texto legal"),l;if(s&&c){let m=s.Anexos.find(g=>g.CodNcmNbs===t);m?.DescCondicao&&(l={...c,localizacao:{cst:"200",cClassTrib:a,anexo:{CodIntProdServ:m.CodIntProdServ}},valor:{DescCondicao:m.DescCondicao}},n.push(l)),a==="200043"&&n.push({...c,localizacao:{cst:"200",cClassTrib:a,campo:"IndNfce"},valor:s.IndNfce})}let d=a==="200033"?{id:"COND-200033-DESTINACAO",cClassTrib:a,natureza:"destinacao",textoOficial:Va(i),verificavelPeloXml:"nao",chaveDeValidacao:"produto"}:{id:"COND-200043-ADQUIRENTE",cClassTrib:a,natureza:"adquirente",textoOficial:Va(i),verificavelPeloXml:"nao",chaveDeValidacao:"adquirente",combinacaoDosTipos:go("D2"),estadoSeContrariada:go("D4")};l&&(d.textoOperacional=l);let u=o.v2.regras[r]?.original,p=u?.fonte==="PLANILHA"?u.valores.Observa\u00E7\u00E3o:null;return a==="200043"&&u?.fonte==="PLANILHA"&&p&&(d.textoPlanilha={fonte:"PLANILHA",aba:"Base de dados",linha:u.linha,coluna:"Observa\xE7\xE3o",valor:p}),{condicoes:[d],fatosF2:n}}function wu(o,e,a,t){let r=b=>({regraIdInformado:a,vinculo:b,referencia:null,statusNormativo:null,fonteDiz:[],sistemaInfere:[],sinalizadores:[],condicoes:[],divergencias:[]}),i=t.ncm??"",n=e.porIdENcm.get(`${a}|${i}`)??[];if(n.length>1){let b=r("ambiguo_regraid_duplicado");b.sinalizadores=["REGRAID_DUPLICADO"],b.reducao=Ur(`A regra n\xE3o p\xF4de ser identificada com seguran\xE7a: o regraId ${a} corresponde a ${n.length} regras da base.`);let O=n.map(A=>({indice:A,linha:o.v2.regras[A]?.original?.linha??-1,regraId:a,ncm:i}));return b.divergencias=[{id:`DIV-regraid_duplicado-${a}`,tipo:"regraid_duplicado",regras:O,valores:[{fonte:"BASE_ATUAL",valor:a}],impacto:"identificacao",status:"aberta",resolucao:null}],{explicacao:b,decisoes:["D7"],ausencias:["REGRA_NAO_LOCALIZADA_COM_SEGURANCA"],situacoes:[13],limitacoes:[`O regraId ${a} corresponde a ${n.length} regras da base (linhas ${O.map(A=>A.linha).join(" e ")}); nenhuma evid\xEAncia foi vinculada e nenhuma delas foi escolhida.`]}}let s=n[0],c=s===void 0?void 0:o.v2.regras[s],l=s===void 0?void 0:o.base.regras[s],d=!!c&&!!l&&Cu.every(b=>JSON.stringify(c[b])===JSON.stringify(l[b]))&&!!c.original;if(s===void 0||!d||!l||!c?.original){let b=r("nao_localizado");return b.reducao=Ur(`A regra n\xE3o p\xF4de ser identificada com seguran\xE7a: o identificador ${a} n\xE3o corresponde, de forma conferida, a uma regra da base para a NCM ${i||"(sem NCM)"}.`),{explicacao:b,decisoes:[],ausencias:["REGRA_NAO_LOCALIZADA_COM_SEGURANCA"],situacoes:[],limitacoes:[s===void 0?`O identificador informado pelo motor (${a}) n\xE3o corresponde a uma regra da base para a NCM ${i||"(sem NCM)"}; nenhuma evid\xEAncia foi vinculada.`:`A regra ${a} (\xEDndice ${s}) n\xE3o confere entre a base atual e a v2; nenhuma evid\xEAncia foi vinculada.`]}}let u={indice:s,linha:c.original.linha,regraId:a,ncm:i},p=r("seguro");p.referencia=u,p.reducao=Ou(e,s,u.linha,l),p.auditoriaOficial=Au(o,s,a,i),p.bloqueio=o.auditoria?.bloqueios.get(fo(a,i))??null;let m={explicacao:p,limitacoes:[],decisoes:[],ausencias:[],situacoes:[]},g=l.cClassTrib,v=e.vinculoPorIndice.get(s);if(p.fonteDiz.push(...Ru(o,s)),(e.codigosPorNcm.get(l.ncm)?.size??0)>1&&p.sinalizadores.push("NCM_EM_OUTROS_CODIGOS"),!v)return p.statusNormativo="SEM_EVIDENCIA_OFICIAL",m.ausencias.push("SEM_EVIDENCIA_OFICIAL"),!p.bloqueio&&!As(o,p,null)&&m.decisoes.push("D3"),m.situacoes.push(4),m.limitacoes.push(u.linha===null?`A regra ${a} foi inclu\xEDda pela decis\xE3o D5 a partir da LC 214/2025 e do SVRS; o c\xF3digo ${g} est\xE1 fora do escopo das vincula\xE7\xF5es (${o.v2.vinculacoes.escopo.join(", ")}), e a confer\xEAncia da regra est\xE1 na auditoria oficial.`:`A regra ${a} (linha ${u.linha}) s\xF3 tem a planilha como origem; o c\xF3digo ${g} est\xE1 fora do escopo auditado (${o.v2.vinculacoes.escopo.join(", ")}).`),m;let C=Iu[v.comparacao.resultado];p.statusNormativo=C??null,C&&m.situacoes.push(Eu[C]);let S=v.fatos.map(Va);p.fonteDiz.push(...S);let T=v.dadoExtraido,N=v.comparacao.resultado.startsWith("ncm_so_")?"comparacao_presenca_ncm":"comparacao_item";p.sistemaInfere.push($r(N,S,`O sistema comparou o item da regra (${l.item}) com as fontes: resultado "${v.comparacao.resultado}".`+(v.interpretacao?` Leitura do sistema: ${v.interpretacao}`:""))),T.coberturaF1.some(b=>!b.exata)&&p.sistemaInfere.push($r("cobertura_ncm_por_prefixo",S.filter(b=>b.fonte==="F1"),`O sistema considerou que ${T.coberturaF1.filter(b=>!b.exata).map(b=>`o c\xF3digo ${b.codigo} (item ${b.item})`).join(" e ")} cobre a NCM ${l.ncm} por prefixo.`)),T.itensF1QueCobremONcm.length>1&&(p.sinalizadores.push("DEPENDE_COMPOSICAO_PRODUTO"),m.situacoes.push(10));for(let b of["anexo","reducaoAliquota","fundamentoLegal","vigenciaInicio"]){let O=e.codigo.get(`C-${g}-${b}`);if(!O)continue;let A=O.fatos.map(Va);for(let _ of A)p.fonteDiz.some(j=>JSON.stringify(j.localizacao)===JSON.stringify(_.localizacao)&&j.arquivo===_.arquivo)||p.fonteDiz.push(_);let x=Su[b];x&&p.sistemaInfere.push($r(x,A,`O sistema comparou o campo ${b} da regra com as fontes: resultado "${O.comparacao.resultado}".`+(O.comparacao.detalhe?` ${O.comparacao.detalhe}`:"")+(O.interpretacao?` Leitura do sistema: ${O.interpretacao}`:"")));let R={fonte:"BASE_ATUAL",valor:l[b]},D=A.filter(_=>_.fonte!=="PLANILHA").map(_=>({fonte:_.fonte,valor:_.trecho??_.valor,fato:_}));if(b==="fundamentoLegal"&&(O.status==="conflito"||O.status==="ambiguo")){let _=O.status==="conflito";p.sinalizadores.push(_?"FUNDAMENTO_DIVERGENTE":"FUNDAMENTO_A_REVISAR"),p.divergencias.push({id:`DIV-${_?"fundamento_legal":"fundamento_a_revisar"}-${g}`,tipo:_?"fundamento_legal":"fundamento_a_revisar",cClassTrib:g,regras:[u],valores:[R,...D],impacto:"texto",status:_?"aberta":"a_revisar",resolucao:null}),m.situacoes.push(8)}b==="vigenciaInicio"&&O.status==="ambiguo"&&(p.sinalizadores.push("VIGENCIA_AMBIGUA"),p.divergencias.push({id:`DIV-vigencia-${g}`,tipo:"vigencia",cClassTrib:g,regras:[u],valores:[R,...D],impacto:"calculo",status:"a_revisar",resolucao:null}),m.situacoes.push(7))}if(v.comparacao.resultado==="item_divergente"){let b=S.filter(O=>O.fonte==="F1");p.divergencias.push({id:`DIV-item_divergente-${s}`,tipo:"item_divergente",cClassTrib:g,regras:[u],impacto:"enquadramento",status:"aberta",resolucao:null,valores:[{fonte:"BASE_ATUAL",valor:l.item},...b.map(O=>({fonte:O.fonte,valor:O.trecho,fato:O})),{fonte:"F2",valor:T.descricoesF2}]})}if(v.comparacao.resultado==="ncm_so_na_F1"||v.comparacao.resultado==="ncm_so_na_F2"){let b=v.comparacao.resultado==="ncm_so_na_F1",O=S.find(A=>A.fonte===(b?"F1":"F2"));p.divergencias.push({id:`DIV-${v.comparacao.resultado}-${g}-${l.ncm}`,tipo:b?"ncm_so_na_F1":"ncm_so_na_F2",cClassTrib:g,regras:[u],impacto:"enquadramento",status:"aberta",resolucao:null,valores:[{fonte:b?"F1":"F2",valor:"presente",...O?{fato:O}:{}},{fonte:b?"F2":"F1",valor:`ausente da lista do ${g}`}]}),m.limitacoes.push(`As fontes oficiais divergem sobre a NCM ${l.ncm} no ${g}; nenhuma fonte foi escolhida e a diverg\xEAncia n\xE3o foi resolvida.`)}let L=yu(o,e,g,l.ncm,s);return p.condicoes=L.condicoes,p.fonteDiz.push(...L.fatosF2),L.condicoes.length&&(p.sinalizadores.push("CONDICAO_NAO_VERIFICAVEL_NO_XML"),m.situacoes.push(10)),g==="200043"&&(m.decisoes.push("D2","D4"),m.situacoes.push(9)),(g==="200033"||g==="200043")&&!e.f2PorCodigo.size&&m.limitacoes.push(...o.avisos),!p.bloqueio&&!As(o,p,v)&&m.decisoes.push("D3"),m}function As(o,e,a){return o.auditoria?e.auditoriaOficial?.status==="CONFIRMADA":a?.comparacao.resultado==="concorda"}function Tu(o,e,a){return a.autor==="Sistema"?"autor_sistema_nao_e_confirmacao_humana":a.justificativa?(e.contagemId.get(a.regraId)??0)>1?"chave_por_regraid_duplicado":o.base.regras.some(t=>t.id===a.regraId&&t.cClassTrib==="200043")?"chave_por_produto_em_condicao_de_adquirente":a.autor.trim()!==""?"sem_hash_das_fontes_na_data":null:"autor_humano_sem_justificativa"}function kr(o,e,a){let t=Nu(e),r=o.regraAplicada&&o.regraAplicada!==K.fundamento?o.regraAplicada:null,n=[...new Set([...o.regrasCandidatas,...r&&!o.regrasCandidatas.includes(r)?[r]:[],...o.regrasBloqueadas??[]])].map(A=>wu(e,t,A,o)),s=n.map(A=>A.explicacao),c=n.flatMap(A=>A.limitacoes),l=new Set(n.flatMap(A=>A.decisoes)),d=new Set(n.flatMap(A=>A.ausencias)),u=new Set(n.flatMap(A=>A.situacoes));o.regrasCandidatas.length===0&&d.add("SEM_REGRA_NA_BASE");let p=(t.lacunasPorNcm.get(o.ncm??"")??[]).map(A=>({id:A.id,status:"LACUNA_FONTE_SEM_REGRA",cClassTrib:A.cClassTrib,ncm:A.ncm,fatos:A.fatos.map(Va),regrasDeOutrosCodigosComEstaNcm:A.regrasDeOutrosCodigosComEstaNcm,inclusaoComoRegra:go("D5")}));p.length&&(l.add("D5"),u.add(3),c.push(`A fonte oficial lista a NCM ${o.ncm} para ${p.map(A=>A.cClassTrib).join(", ")}, e a base atual n\xE3o tem regra correspondente. O estado ${o.estado} foi produzido pelo motor sem essa informa\xE7\xE3o e n\xE3o foi alterado.`));let m=e.validacoes.filter(A=>A.ncm===o.ncm&&(A.cProd===o.cProd||A.cProd===o.produto)),g=[];for(let A of m){let x=Tu(e,t,A);x?g.push({origem:"empresa.json",registro:A,classificacao:x,tratamento:go("D6")}):c.push(`Resposta do empresa.json sem autor identific\xE1vel (cProd ${A.cProd}, regraId ${A.regraId}): n\xE3o \xE9 HUMANO_CONFIRMOU e nenhuma classifica\xE7\xE3o de ValidacaoLegada se aplica a ela.`)}g.length&&l.add("D6"),g.some(A=>A.classificacao==="autor_sistema_nao_e_confirmacao_humana")&&c.push('Resposta do empresa.json com autor "Sistema": a tela de valida\xE7\xE3o envia o autor fixo "Sistema" (servidor.ts, fun\xE7\xE3o validar), e a rota /api/validar grava "Sistema" quando n\xE3o recebe autor (autor || "Sistema"). A autoria n\xE3o foi coletada e n\xE3o foi reconstru\xEDda: o registro n\xE3o indica decis\xE3o autom\xE1tica do sistema nem valida\xE7\xE3o humana comprovada.'),g.some(A=>A.classificacao==="sem_hash_das_fontes_na_data")&&c.push("Resposta do empresa.json com autor humano e justificativa, mas sem o hash das fontes na data da resposta: permanece ValidacaoLegada e n\xE3o \xE9 HUMANO_CONFIRMOU."),m.length&&(u.add(11),c.push("A rota /api/validar substitui a resposta anterior para a mesma chave; n\xE3o h\xE1 hist\xF3rico de respostas."));let v=s.some(A=>A.vinculo!=="nao_localizado");(v||m.length)&&(d.add("VALIDACAO_HUMANA_NAO_DISPONIVEL"),u.add(12));let C=null;if(v){let A=s.flatMap(R=>R.condicoes);C={status:"BENEFICIO_PENDENTE_VALIDACAO",pergunta:(A.length?`O produto e a opera\xE7\xE3o atendem \xE0 descri\xE7\xE3o do item e \xE0 condi\xE7\xE3o da norma (${[...new Set(A.map(R=>"dispositivo"in R.textoOficial.localizacao?`LC 214/2025, ${R.textoOficial.localizacao.dispositivo}`:R.id))].join("; ")})? Ver o texto literal nas evid\xEAncias.`+(A.some(R=>R.combinacaoDosTipos)?" A combina\xE7\xE3o dos tipos de adquirente depende da decis\xE3o D2, pendente.":""):"O produto atende \xE0 descri\xE7\xE3o legal da regra? Ver as evid\xEAncias.")+(m.length?" H\xE1 resposta registrada no empresa.json, mas ela n\xE3o comprova valida\xE7\xE3o humana.":"")}}a?.modelo==="65"&&s.some(A=>A.referencia&&e.base.regras[A.referencia.indice]?.cClassTrib==="200043")&&c.push("Documento modelo 65 (NFC-e) com regra do 200043; o SVRS registra IndNfce = false para o 200043. S\xF3 informa\xE7\xE3o: o tratamento depende da decis\xE3o D4, pendente."),o.aliquotaUsada.some(A=>A.tipo==="projecao")&&u.add(14);let S=A=>A==="NORMA_CONFIRMADA"||A==="NORMA_POSSIVEL_MULTIPLOS_ITENS"?"oficial":A==="SEM_EVIDENCIA_OFICIAL"?"planilha":"pendente",T=s.map(A=>A.statusNormativo),N=new Set(T.map(S)),L=T.some(A=>A==="CONFLITO_PLANILHA_FONTE"||A==="CONFLITO_ENTRE_FONTES")?"divergente":N.size===0?"pendente":N.size===1?[...N][0]:"misto",b=["D2","D3","D4","D5","D6","D7"],O={fase:"A_INFORMATIVA",regras:s,statusBeneficio:C,humanoConfirmou:[],ausencias:[...d],validacoesLegadas:g,lacunas:p,decisoesPendentes:b.filter(A=>l.has(A)).map(A=>go(A)),matriz:{versao:e.matriz.versao,hash:e.matriz.hash,situacoes:[...u].sort((A,x)=>A-x),efeito:"somente_explicacao"},nivelEvidencia:L,limitacoes:[...new Set(c)],reducaoDoItem:Lu(o,s),lacunasDeCobertura:e.auditoria?e.auditoria.lacunasPorNcm.get(o.ncm??"")??[]:[]};return{...o,explicacaoInformativa:O}}function Lu(o,e){let a=t=>{let r=e.find(i=>i.regraIdInformado===t);return{regraId:t,...r?.reducao??Ur(`A regra ${t} n\xE3o foi identificada pelo explicador.`)}};if(o.regraAplicada===K.fundamento)return{situacao:"regime_especifico",opcoes:[],coerenciaEconomia:null,regimeEspecifico:{valor:K.reducao,fundamento:K.fundamento,origem:"regime_especifico_motor"}};if(o.regraAplicada){let t=a(o.regraAplicada),r=null;return o.estado==="INCORRETO_ECONOMIA"&&t.valor!==null&&o.valorPago!==null&&o.economiaPotencial!==null&&(r=Math.abs(o.economiaPotencial-o.valorPago*t.valor)<=_u),{situacao:"aplicada",opcoes:[t],regimeEspecifico:null,coerenciaEconomia:r}}if(o.estado==="REQUER_VALIDACAO"&&o.regrasCandidatas.length){let t=new Set((o.regrasNaoAplicaveis??[]).map(i=>i.regraId)),r=[...new Set(o.regrasCandidatas)].filter(i=>!t.has(i));return r.length?{situacao:"prevista",opcoes:r.map(a),regimeEspecifico:null,coerenciaEconomia:null}:null}return null}function Es(o,e,a=[]){let t=new Map(a.map(r=>[r.chave??r.arquivo,r]));return o.map(r=>kr(r,e,t.get(r.documento)))}var dt,lt,Iu,Eu,Cu,xs,Va,Su,_u,pt=w(()=>{"use strict";f();mo();le();dt=ue(Ne(),1);Fa();Ba();lt=o=>We("sha256").update(o).digest("hex");Iu={concorda:"NORMA_CONFIRMADA",item_entre_varios:"NORMA_POSSIVEL_MULTIPLOS_ITENS",item_divergente:"CONFLITO_PLANILHA_FONTE",ncm_so_na_F1:"CONFLITO_ENTRE_FONTES",ncm_so_na_F2:"CONFLITO_ENTRE_FONTES"},Eu={NORMA_CONFIRMADA:1,NORMA_POSSIVEL_MULTIPLOS_ITENS:2,CONFLITO_PLANILHA_FONTE:5,CONFLITO_ENTRE_FONTES:6,SEM_EVIDENCIA_OFICIAL:4},Cu=["id","ncm","cst","cClassTrib","tratamento","reducaoAliquota","anexo","item","fundamentoLegal","rotulo","descricaoLegal","descricaoNcmTipi","ncmCitadoNaLei","origemRegistro","observacao","vigenciaInicio","vigenciaFim","fonte"],xs=new WeakMap;Va=o=>({camada:"FONTE_DIZ",...o});Su={anexo:"anexo_arabico_romano",reducaoAliquota:"percentual_para_fracao",fundamentoLegal:"comparacao_fundamento",vigenciaInicio:"vigencia_art544_por_exclusao"};_u=.005});function Rs(o){let e=o.valores.find(c=>c.fonte==="F2"&&typeof c.valor=="string")?.valor,a=e?.split("#")[1],t=o.valores.map(c=>c.fato).filter(c=>!!c&&c.fonte==="F1"),r=[...new Set(t.map(ma).filter(c=>!!c))],i=t.find(c=>$u(c)===a),n=[e?`o SVRS apresenta o link ${e}`:"o SVRS n\xE3o apresenta link nas evid\xEAncias",r.length?`as evid\xEAncias da LC 214/2025 citam ${r.join("; ")}`:"n\xE3o h\xE1 dispositivo da LC 214/2025 nas evid\xEAncias"],s=i&&a?`O sistema relacionou a \xE2ncora "${a}" do link ao dispositivo ${ma(i)} da LC 214/2025; o link, sozinho, n\xE3o identifica par\xE1grafo nem inciso.`:"O sistema n\xE3o relacionou o link a um dispositivo da LC 214/2025.";return{fonte:`Nas fontes, ${n.join(", e ")}.`,inferencia:s}}function Uu(o){let e=o.explicacaoInformativa;if(!e)return[];let a=[],t=new Set,r=(n,s,c,l={})=>{let d=`${n}:${o.documento}:${o.nItem}:${s}`;if(t.has(d))return;t.add(d);let u=Pu[n];a.push({id:d,codigo:n,categoria:Ss[n],camada:Os[n],titulo:Du[n],mensagem:c,item:{documento:o.documento,nItem:o.nItem,cProd:o.cProd,ncm:o.ncm},estadoDoVeredito:o.estado,regras:l.regras??[],nivelEvidencia:e.nivelEvidencia,limitacao:l.limitacao??null,situacoesMatriz:u&&e.matriz.situacoes.includes(u)?[u]:[],origem:l.origem??[],...l.decisoes?{decisoes:l.decisoes}:{},efeito:"somente_exibicao"})};if(e.regras.length>1){let n=new Map;for(let c of e.regras){let l=Ns(c.regraIdInformado)??"c\xF3digo n\xE3o identificado";n.set(l,(n.get(l)??0)+1)}let s=[...n].map(([c,l])=>`${l} do ${c}`).join(" e ");r("MULTIPLAS_REGRAS_CANDIDATAS","regras",`H\xE1 ${e.regras.length} regras candidatas para este item (${s}).`,{regras:e.regras.map(Oe),origem:["regras"]})}if(e.regras.forEach((n,s)=>{let c=`regras[${s}]`;if(n.sinalizadores.includes("DEPENDE_COMPOSICAO_PRODUTO")){let l=[...new Set(n.fonteDiz.filter(p=>p.fonte==="F1").map(ma).filter(p=>!!p&&p.startsWith("Anexo")))],d=l[0]?.match(/^Anexo (\S+),/)?.[1]??"",u=l.map(p=>p.replace(/^Anexo \S+, item /,""));r("MULTIPLOS_ITENS_DO_ANEXO",`anexo-${d}-${u.join(",")}`,`A NCM aparece em ${u.length} itens do Anexo ${d} (${u.join(", ")}); o item depende da composi\xE7\xE3o do produto.`,{regras:[Oe(n)],origem:[`${c}.fonteDiz`,`${c}.sinalizadores`]})}if(n.vinculo==="nao_localizado"&&r("REGRA_NAO_LOCALIZADA",n.regraIdInformado,`O identificador ${n.regraIdInformado} n\xE3o corresponde a uma \xFAnica regra da base; nenhuma evid\xEAncia foi vinculada.`,{regras:[Oe(n)],origem:[`${c}.vinculo`],limitacao:pa(e,n.regraIdInformado)}),n.vinculo==="ambiguo_regraid_duplicado"){let l=n.divergencias.find(u=>u.tipo==="regraid_duplicado"),d=l?.regras.map(u=>u.linha)??[];r("REGRAID_AMBIGUO",n.regraIdInformado,`O identificador ${n.regraIdInformado} corresponde a ${d.length} regras (linhas ${d.join(" e ")}); nenhuma foi escolhida.`,{regras:l?.regras.map(u=>({regraId:u.regraId,indice:u.indice,linha:u.linha}))??[Oe(n)],origem:[`${c}.vinculo`,`${c}.divergencias`],limitacao:pa(e,n.regraIdInformado)})}if(n.statusNormativo==="CONFLITO_ENTRE_FONTES"){let l=n.divergencias.find(d=>d.tipo==="ncm_so_na_F1"||d.tipo==="ncm_so_na_F2");r("CONFLITO_ENTRE_FONTES",n.regraIdInformado,`A LC 214 e o SVRS divergem sobre a NCM ${o.ncm} no ${l?.cClassTrib??Ns(n.regraIdInformado)??""}; nenhuma fonte foi escolhida.`,{regras:[Oe(n)],origem:[`${c}.statusNormativo`,`${c}.divergencias`],limitacao:pa(e,"fontes oficiais divergem")})}n.divergencias.forEach((l,d)=>{let u=`${c}.divergencias[${d}]`,p=l.valores.find(m=>m.fonte==="BASE_ATUAL")?.valor;if(l.tipo==="item_divergente"){let m=[...new Set(l.valores.filter(g=>g.fonte==="F1"&&typeof g.valor=="string").map(g=>g.valor.split(" | ")[0]))].join(", ");r("CONFLITO_PLANILHA_FONTE",n.regraIdInformado,`LC 214 e SVRS associam a NCM ao item ${m}; a base (planilha) traz o item ${String(p)}.`,{regras:[Oe(n)],origem:[u]})}if(l.tipo==="fundamento_legal"){let m=Rs(l);r("FUNDAMENTO_DIVERGENTE",l.cClassTrib??n.regraIdInformado,`A base cita ${String(p)}. ${m.fonte} ${m.inferencia} Diferen\xE7a de texto do fundamento; nenhuma cita\xE7\xE3o foi escolhida.`,{regras:[Oe(n)],origem:[u]})}if(l.tipo==="fundamento_a_revisar"){let m=Rs(l);r("FUNDAMENTO_A_REVISAR",l.cClassTrib??n.regraIdInformado,`A base cita ${String(p)}. ${m.fonte} ${m.inferencia}`,{regras:[Oe(n)],origem:[u]})}if(l.tipo==="vigencia"){let m=l.valores.map(g=>g.fonte==="BASE_ATUAL"?`base: ${String(g.valor)}`:g.fonte==="F1"?`LC 214/2025${g.fato&&ma(g.fato)?`, ${ma(g.fato)}`:""}: \u201C${String(g.valor)}\u201D`:`SVRS, in\xEDcio do c\xF3digo: ${String(g.valor)}`);r("VIGENCIA_A_REVISAR",l.cClassTrib??n.regraIdInformado,`As fontes trazem datas diferentes para atributos diferentes (${m.join("; ")}).`,{regras:[Oe(n)],origem:[u]})}}),n.condicoes.forEach((l,d)=>{let u=ma(l.textoOficial),p=`O benef\xEDcio depende de uma condi\xE7\xE3o da norma: \u201C${l.textoOficial.trecho??""}\u201D (${u?`LC 214/2025, ${u}`:l.id}). O XML n\xE3o comprova essa condi\xE7\xE3o.`;p+=" Isso importa porque o benef\xEDcio s\xF3 se aplica se a condi\xE7\xE3o for atendida, e s\xF3 uma pessoa pode confirmar isso.",l.textoPlanilha&&(p+=` Texto da planilha (linha ${l.textoPlanilha.linha}, ${l.textoPlanilha.coluna}): \u201C${l.textoPlanilha.valor}\u201D.`),l.combinacaoDosTipos?.status==="pendente"&&(p+=" A combina\xE7\xE3o dos tipos de comprador ainda n\xE3o foi definida (refer\xEAncia t\xE9cnica: D2)."),p+=` ${ws(o)?Fu:qu}`,r("CONDICAO_NAO_COMPROVADA",l.id,p,{regras:e.regras.filter(m=>m.condicoes.some(g=>g.id===l.id)).map(Oe),origem:[`${c}.condicoes[${d}]`],...l.combinacaoDosTipos?.status==="pendente"?{decisoes:["D2"]}:{}})})}),e.lacunas.length?e.lacunas.forEach((n,s)=>{let c=[...new Set(n.fatos.filter(d=>d.fonte==="F1").map(ma).filter(d=>!!d))],l=[...n.fatos.some(d=>d.fonte==="F2")?[`SVRS, lista do ${n.cClassTrib}`]:[],...c.map(d=>`LC 214/2025, ${d}`)];r("LACUNA_FONTE_SEM_REGRA",n.id,`A NCM ${n.ncm} consta da fonte oficial para o ${n.cClassTrib} (${l.join("; ")}), e a base n\xE3o tem regra correspondente. O estado ${o.estado} foi produzido pelo motor e n\xE3o foi alterado.`,{origem:[`lacunas[${s}]`],limitacao:pa(e,"a base atual n\xE3o tem regra correspondente"),decisoes:["D5"]})}):e.ausencias.includes("SEM_REGRA_NA_BASE")&&o.informado.cst!=="000"&&r("SEM_REGRA_NA_BASE","ausencia","A base n\xE3o tem regra de benef\xEDcio para esta NCM.",{origem:["ausencias"]}),e.nivelEvidencia==="misto"){let n=[...new Set(e.regras.map(s=>s.statusNormativo==="SEM_EVIDENCIA_OFICIAL"?"s\xF3 planilha":s.statusNormativo?"oficial":"pendente"))];r("EVIDENCIA_MISTA","nivel",`As regras candidatas t\xEAm n\xEDveis de evid\xEAncia diferentes (${n.join(" e ")}).`,{regras:e.regras.map(Oe),origem:["nivelEvidencia"]})}e.validacoesLegadas.forEach((n,s)=>{let c=n.registro,l=o.regraAplicada===c.regraId||o.regrasCandidatas.includes(c.regraId),d=`Este item possui uma resposta hist\xF3rica ${c.resposta==="NAO"?"N\xC3O":"SIM"}, registrada em ${Bu(c.data)}, `+(l?"que foi utilizada no c\xE1lculo deste resultado.":"que n\xE3o corresponde \xE0s regras candidatas deste item e n\xE3o foi utilizada no c\xE1lculo.");d+=` A resposta \xE9 mantida como registro hist\xF3rico e n\xE3o equivale a uma confirma\xE7\xE3o humana atual: n\xE3o h\xE1 confirma\xE7\xE3o humana com autoria registrada (${Vu[n.classificacao]??n.classificacao}).`,d+=" Para uma confirma\xE7\xE3o formal com autoria, ser\xE1 necess\xE1rio utilizar o fluxo de valida\xE7\xE3o humana quando essa funcionalidade estiver dispon\xEDvel.",d+=` ${Hr("D6")}`,r("VALIDACAO_LEGADA",`${c.ncm}|${c.cProd}|${c.regraId}`,d,{regras:e.regras.filter(u=>u.regraIdInformado===c.regraId).map(Oe),origem:[`validacoesLegadas[${s}]`],decisoes:["D6"],limitacao:n.classificacao==="autor_sistema_nao_e_confirmacao_humana"?pa(e,'autor fixo "Sistema"'):n.classificacao==="sem_hash_das_fontes_na_data"?pa(e,"sem o hash das fontes"):null})}),e.decisoesPendentes.forEach((n,s)=>{if(n.decisao==="D3")return;let c=zr[n.decisao];r("DECISAO_PENDENTE",n.decisao,`${c.situacao} ${c.motivo} ${ys} ${Hr(n.decisao)}`,{origem:[`decisoesPendentes[${s}]`],decisoes:[n.decisao]})});let i=pa(e,"IndNfce = false");return i&&r("INFORMACAO_OPERACIONAL_SVRS","IndNfce","O SVRS indica que o c\xF3digo 200043 n\xE3o \xE9 habilitado para NFC-e (IndNfce = false), e este documento \xE9 uma NFC-e (modelo 65). O tratamento desse caso ainda n\xE3o foi definido (refer\xEAncia t\xE9cnica: D4).",{limitacao:i,origem:["limitacoes"],decisoes:["D4"]}),e.matriz.situacoes.includes(14)&&r("ALIQUOTA_PROJETADA","aliquota","Valores calculados com al\xEDquota projetada, n\xE3o oficial.",{origem:["matriz.situacoes"]}),a.sort((n,s)=>Cs.indexOf(n.categoria)-Cs.indexOf(s.categoria))}function zu(o){let e=[{chave:"VALIDACAO_HUMANA_NAO_DISPONIVEL",codigo:"VALIDACAO_HUMANA_NAO_DISPONIVEL",titulo:"Lote: valida\xE7\xE3o humana n\xE3o registrada",filtro:t=>t.ausencias.includes("VALIDACAO_HUMANA_NAO_DISPONIVEL"),mensagem:(t,r)=>{let i=r.filter(ws).length,n=i?`A\xE7\xE3o dispon\xEDvel: ${i} destes itens aparecem na tela de Pend\xEAncias, onde \xE9 poss\xEDvel responder SIM ou N\xC3O para a regra; essa resposta passa a ser usada no c\xE1lculo, mas hoje \xE9 gravada sem autoria (autor fixo "Sistema") e n\xE3o equivale a confirma\xE7\xE3o humana. Para os demais ${t-i} itens, a interface n\xE3o permite concluir essa confirma\xE7\xE3o.`:"Nenhum destes itens aparece na tela de Pend\xEAncias, e a interface n\xE3o permite concluir essa confirma\xE7\xE3o; a situa\xE7\xE3o permanece pendente at\xE9 que o fluxo de valida\xE7\xE3o correspondente esteja dispon\xEDvel.";return`Alerta de lote (${t} itens): estes itens t\xEAm regra de benef\xEDcio que depende de o produto atender \xE0 descri\xE7\xE3o e \xE0s condi\xE7\xF5es da regra, mas n\xE3o h\xE1 valida\xE7\xE3o humana com autoria registrada para eles. Isso importa porque s\xF3 uma pessoa pode confirmar se o produto atende \xE0 regra. ${n}`}},{chave:"DECISAO_PENDENTE:D3",codigo:"DECISAO_PENDENTE",titulo:"Lote: pol\xEDtica pendente para regras com v\xEDnculo NCM \xD7 item n\xE3o CONFIRMADO",decisoes:["D3"],filtro:t=>t.decisoesPendentes.some(r=>r.decisao==="D3"),mensagem:(t,r)=>{let i=new Map;for(let s of r)i.set(s.explicacaoInformativa.nivelEvidencia,(i.get(s.explicacaoInformativa.nivelEvidencia)??0)+1);let n=[...i].sort((s,c)=>c[1]-s[1]).map(([s,c])=>`${c} ${ku[s]}`).join("; ");return`Alerta de lote (${t} itens): ${zr.D3.situacao} ${zr.D3.motivo} N\xEDvel de evid\xEAncia registrado nos itens: ${n}. ${ys} ${Hr("D3")}`}},{chave:"SEM_REGRA_NA_BASE",codigo:"SEM_REGRA_NA_BASE",titulo:"Lote: sem regra de benef\xEDcio na base",filtro:t=>t.ausencias.includes("SEM_REGRA_NA_BASE")&&t.lacunas.length===0,mensagem:t=>`Alerta de lote (${t} itens): a base n\xE3o tem regra de benef\xEDcio para a NCM destes itens.`}],a=[];for(let t of e){if(!ju.has(t.chave))continue;let r=o.filter(n=>n.explicacaoInformativa&&t.filtro(n.explicacaoInformativa));if(!r.length)continue;let i=r.map(n=>({documento:n.documento,nItem:n.nItem}));a.push({codigo:t.codigo,categoria:Ss[t.codigo],camada:Os[t.codigo],titulo:t.titulo,mensagem:t.mensagem(i.length,r),itens:i.length,exemplos:i.slice(0,5),itensAfetados:i,...t.decisoes?{decisoes:t.decisoes}:{},efeito:"somente_exibicao"})}return a}function mt(o){return{porItem:o.flatMap(Uu),lote:zu(o)}}var Du,Ss,Os,Pu,Mu,zr,Hr,ys,Fu,qu,ws,Bu,Vu,ju,Cs,Ns,ma,$u,Oe,pa,ku,Gr=w(()=>{"use strict";f();Du={MULTIPLAS_REGRAS_CANDIDATAS:"Mais de uma regra candidata",MULTIPLOS_ITENS_DO_ANEXO:"NCM em mais de um item do anexo",REGRA_NAO_LOCALIZADA:"Regra n\xE3o localizada com seguran\xE7a",REGRAID_AMBIGUO:"Identificador de regra repetido",SEM_REGRA_NA_BASE:"Sem regra de benef\xEDcio na base",LACUNA_FONTE_SEM_REGRA:"NCM na fonte oficial sem regra na base",CONFLITO_ENTRE_FONTES:"Fontes oficiais divergentes",CONFLITO_PLANILHA_FONTE:"Item da base diferente das fontes oficiais",FUNDAMENTO_DIVERGENTE:"Fundamento legal diferente das fontes oficiais",FUNDAMENTO_A_REVISAR:"Fundamento legal a revisar",VIGENCIA_A_REVISAR:"Datas de vig\xEAncia diferentes nas fontes",EVIDENCIA_MISTA:"N\xEDveis de evid\xEAncia diferentes entre as candidatas",VALIDACAO_LEGADA:"Resposta hist\xF3rica utilizada",VALIDACAO_HUMANA_NAO_DISPONIVEL:"Valida\xE7\xE3o humana n\xE3o registrada",DECISAO_PENDENTE:"Defini\xE7\xE3o pendente (a\xE7\xE3o ainda n\xE3o dispon\xEDvel)",CONDICAO_NAO_COMPROVADA:"Condi\xE7\xE3o da norma n\xE3o comprovada pelo XML",INFORMACAO_OPERACIONAL_SVRS:"Informa\xE7\xE3o operacional do SVRS",ALIQUOTA_PROJETADA:"Al\xEDquota projetada"},Ss={MULTIPLAS_REGRAS_CANDIDATAS:"ATENCAO",MULTIPLOS_ITENS_DO_ANEXO:"ATENCAO",REGRA_NAO_LOCALIZADA:"ATENCAO",REGRAID_AMBIGUO:"ATENCAO",SEM_REGRA_NA_BASE:"INFORMACAO",LACUNA_FONTE_SEM_REGRA:"LACUNA",CONFLITO_ENTRE_FONTES:"CONFLITO",CONFLITO_PLANILHA_FONTE:"CONFLITO",FUNDAMENTO_DIVERGENTE:"CONFLITO",FUNDAMENTO_A_REVISAR:"ATENCAO",VIGENCIA_A_REVISAR:"ATENCAO",EVIDENCIA_MISTA:"INFORMACAO",VALIDACAO_LEGADA:"ATENCAO",VALIDACAO_HUMANA_NAO_DISPONIVEL:"PENDENCIA",DECISAO_PENDENTE:"PENDENCIA",CONDICAO_NAO_COMPROVADA:"PENDENCIA",INFORMACAO_OPERACIONAL_SVRS:"INFORMACAO",ALIQUOTA_PROJETADA:"INFORMACAO"},Os={MULTIPLAS_REGRAS_CANDIDATAS:"SISTEMA_INFERE",MULTIPLOS_ITENS_DO_ANEXO:"FONTE_DIZ",REGRA_NAO_LOCALIZADA:"SISTEMA_INFERE",REGRAID_AMBIGUO:"SISTEMA_INFERE",SEM_REGRA_NA_BASE:"SISTEMA_INFERE",LACUNA_FONTE_SEM_REGRA:"FONTE_DIZ",CONFLITO_ENTRE_FONTES:"FONTE_DIZ",CONFLITO_PLANILHA_FONTE:"FONTE_DIZ",FUNDAMENTO_DIVERGENTE:"FONTE_DIZ",FUNDAMENTO_A_REVISAR:"FONTE_DIZ",VIGENCIA_A_REVISAR:"FONTE_DIZ",EVIDENCIA_MISTA:"SISTEMA_INFERE",VALIDACAO_LEGADA:"SISTEMA_INFERE",VALIDACAO_HUMANA_NAO_DISPONIVEL:"SISTEMA_INFERE",DECISAO_PENDENTE:"SISTEMA_PODE_DECIDIR",CONDICAO_NAO_COMPROVADA:"FONTE_DIZ",INFORMACAO_OPERACIONAL_SVRS:"FONTE_DIZ",ALIQUOTA_PROJETADA:"FONTE_DIZ"},Pu={MULTIPLOS_ITENS_DO_ANEXO:2,LACUNA_FONTE_SEM_REGRA:3,CONFLITO_PLANILHA_FONTE:5,CONFLITO_ENTRE_FONTES:6,VIGENCIA_A_REVISAR:7,FUNDAMENTO_DIVERGENTE:8,FUNDAMENTO_A_REVISAR:8,INFORMACAO_OPERACIONAL_SVRS:9,CONDICAO_NAO_COMPROVADA:10,VALIDACAO_LEGADA:11,VALIDACAO_HUMANA_NAO_DISPONIVEL:12,REGRAID_AMBIGUO:13,ALIQUOTA_PROJETADA:14},Mu={D2:'combina\xE7\xE3o dos tipos de adquirente do 200043: "e" na lei, "ou" na planilha',D3:"pol\xEDtica para regras cujo v\xEDnculo NCM \xD7 item com a fonte oficial n\xE3o est\xE1 CONFIRMADO",D4:"tratamento do 200043 em NFC-e",D5:"inclus\xE3o ou n\xE3o das NCMs oficiais sem regra",D6:"tratamento das valida\xE7\xF5es legadas",D7:"formato da chave est\xE1vel da regra"},zr={D2:{situacao:"A lei e a planilha descrevem de forma diferente quem pode ser o comprador neste benef\xEDcio: a lei usa \u201Ce\u201D e a planilha usa \u201Cou\u201D ao listar administra\xE7\xE3o p\xFAblica direta, autarquias e funda\xE7\xF5es.",motivo:"Essa defini\xE7\xE3o determina quais compradores d\xE3o direito \xE0 redu\xE7\xE3o."},D3:{situacao:"estes itens t\xEAm ao menos uma regra candidata cujo v\xEDnculo NCM \xD7 item com a fonte oficial n\xE3o est\xE1 CONFIRMADO (a confer\xEAncia apontou diverg\xEAncia, mais de um item poss\xEDvel, aus\xEAncia nas fontes ou n\xE3o p\xF4de ser feita).",motivo:"Ainda n\xE3o foi definida a pol\xEDtica para esses casos, o que afeta a confian\xE7a nos resultados desses itens."},D4:{situacao:"Ainda n\xE3o foi definido como tratar este c\xF3digo quando usado em NFC-e: o SVRS indica que ele n\xE3o \xE9 habilitado para esse modelo de documento.",motivo:"Isso afeta apenas documentos modelo 65 (NFC-e)."},D5:{situacao:"A NCM consta da fonte oficial para este benef\xEDcio, mas a base n\xE3o tem regra correspondente.",motivo:"Sem uma regra na base, a avalia\xE7\xE3o deste item n\xE3o considera essa fonte oficial; falta definir se a regra deve ser inclu\xEDda."},D6:{situacao:"Existe uma resposta hist\xF3rica para este item, mas ela n\xE3o possui confirma\xE7\xE3o humana com autoria registrada.",motivo:"Falta definir como essas respostas hist\xF3ricas devem ser tratadas; hoje o c\xE1lculo usa as que correspondem \xE0s regras do item."},D7:{situacao:"Duas regras da base t\xEAm o mesmo identificador, e o sistema n\xE3o consegue saber a qual delas uma resposta se refere.",motivo:"Isso impede associar com seguran\xE7a uma resposta de valida\xE7\xE3o a uma \xFAnica regra."}},Hr=o=>`Refer\xEAncia t\xE9cnica: ${o} \u2014 ${Mu[o]}.`,ys="No momento, a interface n\xE3o permite registrar essa defini\xE7\xE3o; a situa\xE7\xE3o permanece pendente at\xE9 que o fluxo correspondente esteja dispon\xEDvel.",Fu='A\xE7\xE3o dispon\xEDvel: este item aparece na tela de Pend\xEAncias, onde \xE9 poss\xEDvel responder SIM ou N\xC3O para a regra. Essa resposta passa a ser usada no c\xE1lculo, mas hoje \xE9 gravada sem autoria (autor fixo "Sistema") e n\xE3o equivale a confirma\xE7\xE3o humana.',qu="No momento, a interface n\xE3o permite concluir essa confirma\xE7\xE3o para este item; a situa\xE7\xE3o permanece pendente at\xE9 que o fluxo de valida\xE7\xE3o correspondente esteja dispon\xEDvel.",ws=o=>o.estado==="REQUER_VALIDACAO"&&!!o.ncm,Bu=o=>{let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(o);return e?`${e[3]}/${e[2]}/${e[1]}`:o},Vu={autor_sistema_nao_e_confirmacao_humana:'a tela de valida\xE7\xE3o envia o autor fixo "Sistema" e a rota tamb\xE9m grava "Sistema" quando n\xE3o recebe autor; a autoria n\xE3o foi coletada e n\xE3o foi reconstru\xEDda; o registro n\xE3o indica decis\xE3o autom\xE1tica do sistema nem valida\xE7\xE3o humana comprovada',sem_hash_das_fontes_na_data:"h\xE1 autor e justificativa, mas o registro n\xE3o guarda o hash das fontes na data da resposta",autor_humano_sem_justificativa:"h\xE1 autor, mas o registro n\xE3o tem justificativa",chave_por_regraid_duplicado:"o registro usa um identificador de regra que corresponde a mais de uma regra",chave_por_produto_em_condicao_de_adquirente:"o registro est\xE1 por produto, e a condi\xE7\xE3o do c\xF3digo \xE9 do adquirente"},ju=new Set(["VALIDACAO_HUMANA_NAO_DISPONIVEL","DECISAO_PENDENTE:D3","SEM_REGRA_NA_BASE"]),Cs=["CONFLITO","LACUNA","PENDENCIA","ATENCAO","INFORMACAO"],Ns=o=>/^\d{8}-(\d{6})-/.exec(o)?.[1]??null,ma=o=>"dispositivo"in o.localizacao?o.localizacao.dispositivo:null,$u=o=>"ancora"in o.localizacao?o.localizacao.ancora:null,Oe=o=>({regraId:o.regraIdInformado,indice:o.referencia?.indice??null,linha:o.referencia?.linha??null}),pa=(o,e)=>o.limitacoes.find(a=>a.includes(e))??null;ku={planilha:"s\xF3 planilha",misto:"misto (regras com evid\xEAncia oficial e regras s\xF3 da planilha)",oficial:"oficial",divergente:"divergente",pendente:"pendente"}});function fa(o){let e=zo;if(e)return e(o);let a=We("sha256"),t=$o(o,"r");try{let r=y.Buffer.alloc(Ts),i;for(;(i=Uo(t,r,0,Ts,null))>0;)a.update(r.subarray(0,i))}finally{ko(t)}return a.digest("hex")}function _s(o,e,a=1024*1024){if(!k(o))return null;let t=$o(o,"r");try{let r=y.Buffer.alloc(a),i=Uo(t,r,0,a,0),n=r.subarray(0,i).toString("utf8"),s=n.indexOf(`"${e}"`);return s<0?null:JSON.parse(n.slice(0,s).replace(/,\s*$/,"")+"}")}catch{return null}finally{ko(t)}}var Ts,ho=w(()=>{"use strict";f();le();mo();Ts=4*1024*1024});function Xr(o){let e=[];for(let a of _e(o)){let t=(0,ze.join)(o,a);if(Ya(t).isDirectory())e.push(...Xr(t));else if((0,ze.extname)(a).toLowerCase()===".xml")e.push(t);else if((0,ze.extname)(a).toLowerCase()===".zip"){let r=Ka((0,ze.join)(Jo(),"xmlzip-"));Qo("unzip",["-qq","-o",t,"-d",r]),e.push(...Xr(r))}}return e}function Qr(o,e){let a=r=>{let{calculadoEm:i,...n}=r;return delete n.explicacaoInformativa,JSON.stringify(n)},t=[];o.length!==e.length&&t.push(`quantidade de vereditos: ${o.length} \xD7 ${e.length}`);for(let r=0;r<Math.min(o.length,e.length);r++)a(o[r])!==a(e[r])&&t.push(`veredito ${r} (${o[r].documento}, item ${o[r].nItem})`);return t}function Ls(o){let e=o.arquivoBase??"data/base-normativa.json",a=o.arquivoV2??"data/base-normativa.v2.json",t=o.arquivoMatriz??"docs/etapa6/matriz-decisao.json",r=(0,ze.join)(o.saida,"explicacoes.json"),i=(0,ze.join)(o.saida,"reducoes-exibicao.json"),n=(0,ze.join)(o.saida,"alertas.json"),s=()=>{be(n,{force:!0}),be(r,{force:!0}),be(i,{force:!0})};o.limparAntes&&s();let c=JSON.parse(P(e,"utf8")),l=JSON.parse(P(o.arquivoEmpresa,"utf8")),d=o.lidos?.arquivos??Xr(o.pastaXml),u=o.lidos?.leituras??d.map(x=>po(P(x,"utf8"),x)),p=ca(u),m=st(p.documentos,{base:c,empresa:l,validacoes:l.validacoes??[],naturezaPorProduto:new Map(Object.entries(l.naturezaPorProduto??{})),aceitarProjecao:l.aceitarProjecao??!1,regrasBloqueadas:qa(ua(e))});if(o.vereditosDeReferencia){let x=k(o.vereditosDeReferencia)?JSON.parse(P(o.vereditosDeReferencia,"utf8")):null,R=x?Qr(x,m):["vereditos.json de refer\xEAncia ausente"];if(R.length)throw s(),new Error(`Alertas n\xE3o publicados: os vereditos desta execu\xE7\xE3o divergem do vereditos.json (${R.slice(0,3).join("; ")}${R.length>3?"; \u2026":""}).`)}let g=o.arquivoEmpresaExplicacao??o.arquivoEmpresa,v=ut({base:e,v2:a,matriz:t,empresa:g}),C=Es(m,v,p.documentos);ae(o.saida,{recursive:!0});let S={fase:"A_INFORMATIVA",aviso:"Explica\xE7\xE3o somente informativa. O estado de cada veredito foi produzido pelo motor atual e n\xE3o foi alterado. A matriz \xE9 s\xF3 citada.",entradas:{base:{caminho:e,sha256:vo(e)},v2:{caminho:a,sha256:vo(a)},matriz:{caminho:t,sha256:v.matriz.hash,versao:v.matriz.versao},empresa:{caminho:g,sha256:vo(g)}},avisos:v.avisos},T=[],N=new Map,L=C.map(x=>{let R={reducao:x.explicacaoInformativa?.reducaoDoItem??null,auditoria:Object.fromEntries((x.explicacaoInformativa?.regras??[]).filter(j=>j.auditoriaOficial).map(j=>[j.regraIdInformado,j.auditoriaOficial])),lacunas:x.explicacaoInformativa?.lacunasDeCobertura??[],bloqueios:Object.fromEntries((x.explicacaoInformativa?.regras??[]).filter(j=>j.bloqueio).map(j=>[j.regraIdInformado,j.bloqueio]))},D=JSON.stringify(R),_=N.get(D);return _===void 0&&(_=T.push(R)-1,N.set(D,_)),{documento:x.documento,nItem:x.nItem,ncm:x.ncm,cProd:x.cProd,produto:x.produto,estado:x.estado,exibicao:_}});$(i,JSON.stringify({formato:2,exibicoes:T,itens:L}),"utf8");let b=JSON.stringify(S,null,1).slice(0,-1)+`,
  "vereditos": [
`;$(r,b,"utf8");for(let x=0;x<C.length;x++){let R=JSON.stringify(C[x],null,1)+(x<C.length-1?`,
`:`
`);Vo(r,R,"utf8")}Vo(r,`  ]
}
`,"utf8");let O=mt(C),A=(x,R)=>x.reduce((D,_)=>(D[R(_)]=(D[R(_)]??0)+1,D),{});return $(n,JSON.stringify({fase:"B1_ALERTAS",aviso:"Alertas somente para exibi\xE7\xE3o, derivados de explicacoes.json. N\xE3o alteram o estado dos vereditos nem decidem pelo usu\xE1rio.",origem:{explicacoes:r,sha256:vo(r),...o.vereditosDeReferencia&&k(o.vereditosDeReferencia)?{vereditosSha256:vo(o.vereditosDeReferencia)}:{}},totais:{porItem:O.porItem.length,lote:O.lote.length,itensComAlertaDeItem:new Set(O.porItem.map(x=>`${x.item.documento}|${x.item.nItem}`)).size,porCategoria:A(O.porItem,x=>x.categoria),porCodigo:A(O.porItem,x=>x.codigo),lotePorCodigo:Object.fromEntries(O.lote.map(x=>[x.codigo+(x.decisoes?`:${x.decisoes.join(",")}`:""),x.itens]))},lote:O.lote,porItem:O.porItem},null,1)),{xmls:d.length,vereditos:C.length,arquivoExplicacoes:r,arquivoAlertas:n,alertasPorItem:O.porItem.length,alertasDeLote:O.lote.length,nivelEvidencia:A(C,x=>x.explicacaoInformativa.nivelEvidencia)}}var ze,vo,Jr=w(()=>{"use strict";f();le();ze=ue(Ne(),1);nr();sr();rt();Fa();Ba();pt();Gr();ho();vo=fa});function Ze(o){return String(o??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}function bo(o){return o.map((e,a)=>[e,a]).sort((e,a)=>Wr.indexOf(e[0].categoria)-Wr.indexOf(a[0].categoria)||e[1]-a[1]).map(([e])=>e)}function Gu(o){let e=new Map;for(let a of o){let t=Zr(a.item.documento,a.item.nItem);e.has(t)||e.set(t,[]),e.get(t).push(a)}for(let[a,t]of e)e.set(a,bo(t));return e}function Xu(o,e){let a=new Map;for(let r of e)r.estado!=="REQUER_VALIDACAO"||!r.ncm||a.set(Zr(r.documento,r.nItem),Hu(r.ncm,r.cProd,r.produto));let t=new Map;for(let r of o){let i=a.get(Zr(r.item.documento,r.item.nItem));if(!i)continue;t.has(i)||t.set(i,new Map);let n=t.get(i),s=`${r.codigo}\0${r.mensagem}`,c=n.get(s);c?(c.itens+=1,c.ocorrencias.push({documento:r.item.documento,nItem:r.item.nItem})):n.set(s,{codigo:r.codigo,categoria:r.categoria,titulo:r.titulo,mensagem:r.mensagem,itens:1,ocorrencias:[{documento:r.item.documento,nItem:r.item.nItem}],efeito:"somente_exibicao"})}return new Map([...t].map(([r,i])=>[r,bo([...i.values()])]))}function Qu(o,e){return Wr.map(a=>({categoria:a,rotulo:Ds[a],alertasDeItem:o.filter(t=>t.categoria===a).length,alertasDeLote:e.filter(t=>t.categoria===a).length}))}function Ju(o){if(!o.length)return"";let e=bo(o).map(a=>`<li>${gt(a.categoria)} <strong>${Ze(a.titulo)}</strong>: ${Ze(a.mensagem)}</li>`).join("");return`<details class="alertas-item"><summary>${o.length} alerta(s)</summary><ul>${e}</ul></details>`}function Wu(o){return o.length?`<div class="alertas-cartao"><div class="small">Alertas (somente exibi\xE7\xE3o; n\xE3o alteram o resultado nem a valida\xE7\xE3o)</div><ul>${bo(o).map(a=>`<li>${gt(a.categoria)} <strong>${Ze(a.titulo)}</strong>: ${Ze(a.mensagem)}`+(a.itens>1?` <span class="small">(em ${a.itens} itens)</span>`:"")+"</li>").join("")}</ul></div>`:""}function Zu(o,e){let a=o.map(r=>`<tr><td>${gt(r.categoria)}</td><td>${r.alertasDeItem}</td><td>${r.alertasDeLote}</td></tr>`).join(""),t=bo(e).map(r=>`<li>${gt(r.categoria)} <strong>${Ze(r.titulo)}</strong>: ${Ze(r.mensagem)}</li>`).join("");return`<h3>Alertas (somente exibi\xE7\xE3o)</h3><p class="small">Estes n\xFAmeros n\xE3o fazem parte dos indicadores acima e n\xE3o alteram nenhum resultado.</p><table class="alertas-totais"><thead><tr><th>Categoria</th><th>Alertas de item</th><th>Alertas de lote</th></tr></thead><tbody>${a}</tbody></table>`+(t?`<h4>Alertas de lote</h4><ul class="alertas-lote">${t}</ul>`:"")}function Yu(o){return`<h3>Alertas (somente exibi\xE7\xE3o)</h3><p class="small">Alertas indispon\xEDveis: ${Ze(o)} Os resultados continuam v\xE1lidos e n\xE3o dependem dos alertas.</p>`}function Ku(o,e){let a=Gu(o.porItem),t=Xu(o.porItem,e),r=Qu(o.porItem,o.lote);return{disponivel:!0,efeito:"somente_exibicao",origem:o.origem,totais:o.totais,totaisPorCategoria:r,porItemHtml:Object.fromEntries([...a].map(([i,n])=>[i,Ju(n)])),porCartaoHtml:Object.fromEntries([...t].map(([i,n])=>[i,Wu(n)])),painelHtml:Zu(r,o.lote),lote:o.lote,porItem:o.porItem}}function Ps(o){let e=(0,ft.join)(o,"alertas.json"),a=(0,ft.join)(o,"explicacoes.json"),t=(0,ft.join)(o,"vereditos.json");if(!k(e))return ja("o arquivo alertas.json n\xE3o existe para os resultados atuais.");if(!k(a))return ja("o arquivo explicacoes.json n\xE3o existe para os resultados atuais.");if(!k(t))return ja("o arquivo vereditos.json n\xE3o existe.");try{let r=JSON.parse(P(e,"utf8"));if(fa(a)!==r.origem?.sha256)return ja("o alertas.json n\xE3o corresponde ao explicacoes.json atual.");let i=ja("os alertas foram gerados para resultados diferentes dos atuais.");if(r.origem.vereditosSha256){if(fa(t)!==r.origem.vereditosSha256)return i}else{let s=JSON.parse(P(a,"utf8")).vereditos;if(Qr(JSON.parse(P(t,"utf8")),s).length)return i}let n=JSON.parse(P(t,"utf8"));return Ku(r,n)}catch(r){return ja(`n\xE3o foi poss\xEDvel ler os alertas (${r instanceof Error?r.message:String(r)}).`)}}var ft,Wr,Ds,Zr,Hu,gt,ja,Ms=w(()=>{"use strict";f();le();ft=ue(Ne(),1);Jr();ho();Wr=["CONFLITO","LACUNA","PENDENCIA","ATENCAO","INFORMACAO"],Ds={CONFLITO:"Conflito",LACUNA:"Lacuna",PENDENCIA:"Pend\xEAncia",ATENCAO:"Aten\xE7\xE3o",INFORMACAO:"Informa\xE7\xE3o"};Zr=(o,e)=>`${o}|${e}`,Hu=(o,e,a)=>`${o}|${e}|${a}`;gt=o=>`<span class="alerta-cat alerta-cat-${o}">${Ze(Ds[o])}</span>`;ja=o=>({disponivel:!1,motivo:o,painelHtml:Yu(o)})});function Fs(o){let e=Object.fromEntries(ep.map(R=>[R,{itens:0,base:0}])),a=0,t=0,r=0,i=0,n=0,s=0,c=0,l=0,d=!1,u=!1,p=0,m=0,g=new Map,v=new Map,C=new Map;for(let R of o){e[R.estado].itens+=1,e[R.estado].base+=R.baseCalculo,a+=R.baseCalculo,t+=R.economiaPotencial??0,(R.economiaPotencial??0)>0&&(n+=R.economiaPotencial),(R.economiaPotencial??0)<0&&(s-=R.economiaPotencial),r+=R.economiaSujeitaValidacao??0,i+=R.exposicao??0,R.valorIBSInformado!=null&&(c+=R.valorIBSInformado,d=!0),R.valorCBSInformado!=null&&(l+=R.valorCBSInformado,u=!0),p+=R.valorPago??0,m+=R.valorCorreto??0;for(let j of R.aliquotaUsada)g.set(`${j.tributo}|${j.aliquota}|${j.tipo}`,j);for(let j of R.dadosFaltantes)v.set(j,(v.get(j)??0)+1);let D=R.cProd||`${R.ncm}|${R.produto}`,_=C.get(D)??{correto:!1,incorreto:!1,ncm:!1,pendente:!1,avaliavel:!1};R.estado==="CORRETO"&&(_.correto=!0,_.avaliavel=!0),(R.estado==="INCORRETO_ECONOMIA"||R.estado==="INCORRETO_RISCO")&&(_.incorreto=!0,_.avaliavel=!0),R.estado==="INCORRETO_NCM"&&(_.ncm=!0,_.avaliavel=!0),R.estado==="REQUER_VALIDACAO"&&(_.pendente=!0,_.avaliavel=!0),C.set(D,_)}let S=0,T=0,N=0,L=0;for(let R of C.values())R.pendente?L+=1:R.ncm?N+=1:R.incorreto?T+=1:R.correto&&(S+=1);let b=N,O=S+T+N+L,A=e.CORRETO.itens+e.INCORRETO_ECONOMIA.itens+e.INCORRETO_RISCO.itens+e.INCORRETO_NCM.itens+e.REQUER_VALIDACAO.itens,x=[];for(let[R,D]of[...v].sort((_,j)=>j[1]-_[1]))x.push(`${D} ${D===1?"item depende":"itens dependem"} de: ${R}`);return[...g.values()].some(R=>R.tipo==="projecao")&&x.push("Ha valores calculados com aliquota de projecao, nao com aliquota publicada."),{itens:o.length,faturamento:Number(a.toFixed(2)),porEstado:e,itensAvaliados:A,codigosAvaliados:O,codigosCorretos:S,codigosIncorretos:b,codigosRecalculo:T,codigosNcmAjustar:N,codigosPendentes:L,valorIBSInformadoTotal:d?Number(c.toFixed(2)):null,valorCBSInformadoTotal:u?Number(l.toFixed(2)):null,valorInformadoTotal:d||u?Number((c+l).toFixed(2)):null,valorPagoTotal:Number(p.toFixed(2)),valorCorretoTotal:Number(m.toFixed(2)),percentualConformidade:O===0?null:S/O,economiaPotencial:Number(t.toFixed(2)),economiaRecalculo:Number(n.toFixed(2)),valorAPagarRecalculo:Number(s.toFixed(2)),economiaSujeitaValidacao:Number(r.toFixed(2)),exposicao:Number(i.toFixed(2)),pendentesDeValidacao:L,aliquotasUsadas:[...g.values()],alertas:x,versaoBase:o[0]?.versaoBase??null}}function qs(o){let e=new Map;for(let a of o){let t=a.estado==="INCORRETO_RISCO"&&a.esperado===null&&a.regrasCandidatas.length>0;if(a.estado!=="REQUER_VALIDACAO"&&!t||!a.ncm)continue;let r=a.cProd,i=e.get(r);if(i){i.itens+=1,i.base=Number((i.base+a.baseCalculo).toFixed(2)),i.regras=[...new Set([...i.regras,...a.regrasCandidatas])];for(let n of a.regrasNaoAplicaveis??[])i.regrasNaoAplicaveis.some(s=>s.regraId===n.regraId)||i.regrasNaoAplicaveis.push(n)}else e.set(r,{ncm:a.ncm,cProd:a.cProd,produto:a.produto,itens:1,base:a.baseCalculo,regras:a.regrasCandidatas,regrasNaoAplicaveis:[...a.regrasNaoAplicaveis??[]],motivo:a.motivo})}return[...e.values()].sort((a,t)=>t.base-a.base)}var ep,Bs=w(()=>{"use strict";f();ep=["CORRETO","INCORRETO_ECONOMIA","INCORRETO_RISCO","REQUER_VALIDACAO","NAO_OBRIGATORIO","INCORRETO_NCM","INDETERMINADO"]});function ht(o){let e=[];for(let a of _e(o)){let t=(0,De.join)(o,a);if(Ya(t).isDirectory())e.push(...ht(t));else if((0,De.extname)(a).toLowerCase()===".xml")e.push(t);else if((0,De.extname)(a).toLowerCase()===".zip"){let r=Ka((0,De.join)(Jo(),"xmlzip-"));Qo("unzip",["-qq","-o",t,"-d",r]),e.push(...ht(r))}}return e}function Vs(o){let a=o.filter(r=>k(r)).flatMap(ht).map(r=>po(P(r,"utf8"),r)),t=ca(a).documentos.map(r=>We("sha256").update(`conformidade-ibs-cbs:${r.chave??`arquivo:${fa(r.arquivo)}`}`).digest("hex"));return[...new Set(t)]}function ap(o,e,a){let t=c=>c.split(/[\\/]/).pop()??c,r=e.flatMap((c,l)=>c.documentos.length===0&&c.cancelamentos.size>0?[{arquivo:t(o[l]),tipo:"evento de cancelamento (tpEvento 110111)",chaves:[...c.cancelamentos]}]:[]),i=e.flatMap(c=>c.ignorados.map(l=>({arquivo:t(l.arquivo),motivo:l.motivo}))),n=a.descartados.filter(c=>!i.some(l=>l.arquivo===t(c.documento))),s={};for(let c of n)s[c.motivo]=(s[c.motivo]??0)+1;return{arquivos:o.length,documentosLidos:e.reduce((c,l)=>c+l.documentos.length,0),documentosAnalisados:a.documentos.length,eventos:r,naoReconhecidos:i,descartados:n,descartadosPorMotivo:s}}function Yr(o){let e=ht(o);return{arquivos:e,leituras:e.map(a=>po(P(a,"utf8"),a))}}function js(o,e,a,t="data/base-normativa.json",r){let i=JSON.parse(P(t,"utf8")),n=JSON.parse(P(e,"utf8")),{arquivos:s,leituras:c}=r??Yr(o),l=ca(c),d=st(l.documentos,{base:i,empresa:n,validacoes:n.validacoes??[],naturezaPorProduto:new Map(Object.entries(n.naturezaPorProduto??{})),aceitarProjecao:n.aceitarProjecao??!1,regrasBloqueadas:qa(ua(t))}),u=Fs(d),p=qs(d);return ae(a,{recursive:!0}),$((0,De.join)(a,"vereditos.json"),JSON.stringify(d,null,1),"utf8"),$((0,De.join)(a,"indicadores.json"),JSON.stringify(u,null,1),"utf8"),$((0,De.join)(a,"fila-validacao.json"),JSON.stringify(p,null,1),"utf8"),$((0,De.join)(a,"descartados.json"),JSON.stringify(l.descartados,null,1),"utf8"),$((0,De.join)(a,"composicao.json"),JSON.stringify(ap(s,c,l),null,1),"utf8"),{xmls:s.length,documentos:l.documentos.length,descartados:l.descartados.length,indicadores:u,fila:p}}var De,Kr=w(()=>{"use strict";f();le();mo();De=ue(Ne(),1);nr();le();sr();rt();Fa();Ba();ho();Bs()});function bt(o){return JSON.parse(P(o,"utf8"))}function Us(o,e){if(!e)return null;for(let a of o.categorias)if(!a.excluidos?.some(t=>e.startsWith(t))&&a.codigos.some(t=>e.startsWith(t)))return a;return null}function ei(o,e,a){if(!e)return{principal:null,alternativas:[]};let t=s=>s.vigenciaInicio<=a&&(s.vigenciaFim===null||a<=s.vigenciaFim)&&!s.excluidos?.some(c=>e.startsWith(c))&&s.codigos.some(c=>e.startsWith(c)),r=s=>Math.max(...s.codigos.filter(c=>e.startsWith(c)).map(c=>c.length)),i=o.aliquotas.filter(t);return{principal:i.filter(s=>!s.condicao).sort((s,c)=>r(c)-r(s))[0]??null,alternativas:i.filter(s=>!!s.condicao)}}function $s(o,e,a){let t=o.fundamentos,r=ka((e.valorProduto??0)-(e.desconto??0)),i=(g,v,C,S={})=>{let T=[...S.alertas??[]],N=e.impostoSeletivo;return N&&(N.valor??0)>0&&g==="NAO_INCIDENCIA"&&T.push(`O XML informa IS de R$ ${N.valor.toFixed(2)} numa opera\xE7\xE3o sem incid\xEAncia.`),!N&&g==="INCIDENCIA"&&T.push("O XML n\xE3o traz o grupo IS, mas a opera\xE7\xE3o tem incid\xEAncia."),{situacao:g,categoria:S.categoria??null,motivo:v,fundamentos:C,aliquota:S.aliquota??null,base:r,valor:S.valor??null,alertas:T}};if(!e.ncm)return i("VALIDACAO","Item sem NCM: n\xE3o \xE9 poss\xEDvel verificar o Anexo XVII.",[t.INCIDENCIA]);let n=Us(o,e.ncm);if(!n)return i("NAO_INCIDENCIA",`O NCM ${e.ncm} n\xE3o consta do Anexo XVII da LC 214/2025 (bens sujeitos ao IS).`,[t.INCIDENCIA]);let s={categoria:n.id};if(!a)return i("VALIDACAO","Documento sem data de emiss\xE3o: a vig\xEAncia n\xE3o pode ser verificada.",[n.fundamento,t.INICIO_COBRANCA],s);if(a<o.vigencia.inicioAliquotas)return i("NAO_INCIDENCIA",`${n.nome}: opera\xE7\xE3o anterior ao in\xEDcio das al\xEDquotas do IS (${vt(o.vigencia.inicioAliquotas)}); nenhuma al\xEDquota de 2027 \xE9 aplicada a ela.`,[n.fundamento,t.INICIO_COBRANCA],s);if(a>o.vigencia.fimRegimeTransitorio)return i("VALIDACAO",`${n.nome}: opera\xE7\xE3o posterior ao fim do regime de 2027 (${vt(o.vigencia.fimRegimeTransitorio)}). ${o.vigencia.aposFim}`,[n.fundamento,t.INICIO_COBRANCA],s);let c=e.cfop??"";if(o.cfops.revenda.includes(c))return i("NAO_INCIDENCIA",`${n.nome}: revenda (CFOP ${c}). O IS incide uma \xFAnica vez, no primeiro fornecimento pelo fabricante ou na importa\xE7\xE3o; n\xE3o h\xE1 IS nesta opera\xE7\xE3o.`,[n.fundamento,t.MONOFASICO,t.FATO_GERADOR,t.CONTRIBUINTE,o.cfops.fundamento],s);if(!o.cfops.producaoPropria.includes(c))return i("VALIDACAO",`${n.nome}: o CFOP ${c||"(ausente)"} n\xE3o indica se o estabelecimento \xE9 o fabricante (contribuinte do IS).`,[n.fundamento,t.CONTRIBUINTE,o.cfops.fundamento],s);let{principal:l,alternativas:d}=ei(o,e.ncm,a),u={...s,aliquota:l},p=d.map(g=>`${g.aliquota!=null?Ua(g.aliquota):"\u2014"} se ${g.condicao}`).join("; ");if(e.cst==="200")return i("VALIDACAO",`${n.nome}: o item tem IBS/CBS com al\xEDquota reduzida (CST 200). Verifique a n\xE3o incid\xEAncia do IS do art. 413, III, da LC 214/2025.`,[n.fundamento,t.NAO_INCIDENCIA_REDUCAO],u);if(n.baseValorReferencia)return i("VALIDACAO",`${n.nome}: a base de c\xE1lculo \xE9 o valor de refer\xEAncia definido em ato do Poder Executivo, que n\xE3o est\xE1 no XML.`,[n.fundamento,t.BASE_CALCULO],u);if(n.excecoesNoAnexo)return i("VALIDACAO",`${n.nome}: o Anexo XVII traz exce\xE7\xF5es para esta categoria; confirme o enquadramento do bem.`,[n.fundamento],u);if(n.embalagemPrimaria)return i("VALIDACAO",`${n.nome}: venda de produ\xE7\xE3o pr\xF3pria (CFOP ${c}). Confirme se o produto sai em embalagem prim\xE1ria destinada ao consumidor final (art. 409, \xA7 2\xBA, da LC 214/2025)${n.id==="FUMIGENOS"?"":" e se o estabelecimento \xE9 pequeno produtor (redu\xE7\xE3o do Anexo VI da MP 1.399/2026)"}${p?`; al\xEDquota ${l?.aliquota!=null?Ua(l.aliquota):"\u2014"}, ou ${p}`:""}.`,[n.fundamento,t.EMBALAGEM_PRIMARIA,t.CONTRIBUINTE,...n.id==="FUMIGENOS"?[]:[t.PEQUENOS_PRODUTORES],t.ALIQUOTAS].filter(Boolean),u);if(!l)return i("VALIDACAO",`${n.nome}: n\xE3o h\xE1 al\xEDquota do IS cadastrada para ${vt(a)}.`,[n.fundamento,t.ALIQUOTAS],s);if(d.length)return i("VALIDACAO",`${n.nome}: a al\xEDquota depende do produto \u2014 ${Ua(l.aliquota??0)} na regra geral, ou ${p}.`,[n.fundamento,t.ALIQUOTAS,l.dispositivo],u);if(l.situacao!=="conferida")return i("VALIDACAO",`${n.nome}: al\xEDquota de ${l.aliquota!=null?Ua(l.aliquota):"(n\xE3o informada)"} cadastrada a partir de ${o.fontes[l.fonte]?.titulo??l.fonte}, ainda n\xE3o conferida com ${l.dispositivo}. O valor n\xE3o \xE9 calculado at\xE9 a confer\xEAncia.`,[n.fundamento,t.ALIQUOTAS],u);let m=ks(l,n,r,e.quantidade);return m.valor===null?i("VALIDACAO",`${n.nome}: ${m.pendencia}`,[n.fundamento,t.ALIQUOTAS,t.BASE_CALCULO],u):i("INCIDENCIA",`${n.nome}: venda de produ\xE7\xE3o pr\xF3pria (CFOP ${c}), fato gerador do IS. ${l.regraCalculo}.`,[n.fundamento,t.FATO_GERADOR,t.CONTRIBUINTE,t.BASE_CALCULO,t.ALIQUOTAS,l.dispositivo],{...u,valor:m.valor})}function ks(o,e,a,t){let r=0;if(o.modalidade==="ajustes_por_veiculo")return{valor:null,pendencia:"a al\xEDquota depende dos ajustes dos Anexos I a III da MP 1.399/2026 (propuls\xE3o, efici\xEAncia, pot\xEAncia, desempenho e reciclabilidade do ve\xEDculo)."};if(o.modalidade==="ad_valorem"||o.modalidade==="ad_valorem_e_especifica"){if(o.aliquota==null)return{valor:null,pendencia:"al\xEDquota ad valorem n\xE3o informada."};r+=a*o.aliquota}if(o.modalidade!=="ad_valorem"||e.exigeAliquotaEspecifica){if(!o.especifica)return{valor:null,pendencia:"a parcela espec\xEDfica exigida pela lei (art. 422, \xA7 1\xBA, da LC 214/2025) n\xE3o est\xE1 cadastrada."};if(o.especifica.valor===0)return{valor:ka(r),pendencia:""};if(t==null)return{valor:null,pendencia:`a parcela espec\xEDfica (R$ ${o.especifica.valor.toFixed(2).replace(".",",")} por ${o.especifica.unidade}) depende da quantidade nessa unidade, que o XML n\xE3o traz.`};r+=t*o.especifica.valor}return{valor:ka(r),pendencia:""}}function zs(o,e){let a=new Map,t=o.vigencia.inicioAliquotas;for(let r of e){let i=r.dataEmissao?r.dataEmissao.slice(0,10):null;for(let n of r.itens){let s=$s(o,n,i),c=`${n.ncm??""}|${n.cProd}`,l=a.get(c);if(!l){let d=Us(o,n.ncm);l={chave:c,ncm:n.ncm,cProd:n.cProd,produto:n.xProd,categoria:d?{id:d.id,nome:d.nome,descricaoLegal:d.descricaoLegal,fundamento:d.fundamento}:null,itens:0,base:0,situacao:"NAO_INCIDENCIA",porSituacao:{INCIDENCIA:0,NAO_INCIDENCIA:0,VALIDACAO:0},motivos:[],fundamentos:[],aliquota:null,alternativas:[],valor:null,baseNaVigencia:0,cfops:[],periodo:{de:null,ate:null},informadoNoXml:0,alertas:[],projecaoVigencia:null,_aliqs:new Set,_motivos:new Map,_fund:new Set,_alertas:new Set,_cfops:new Set,_valores:[],_proj:new Map},a.set(c,l)}if(l.itens++,l.base=ka(l.base+s.base),l.porSituacao[s.situacao]++,$a[s.situacao]>$a[l.situacao]&&(l.situacao=s.situacao),l._motivos.set(s.motivo,(l._motivos.get(s.motivo)??0)+1),s.fundamentos.forEach(d=>l._fund.add(d)),s.alertas.forEach(d=>l._alertas.add(d)),n.cfop&&l._cfops.add(n.cfop),n.impostoSeletivo&&l.informadoNoXml++,i&&((!l.periodo.de||i<l.periodo.de)&&(l.periodo.de=i),(!l.periodo.ate||i>l.periodo.ate)&&(l.periodo.ate=i)),s.categoria&&i){let d=ei(o,n.ncm,i),u=d.principal||d.alternativas.length?d:i<t?ei(o,n.ncm,t):d;u.principal&&(l._aliqs.add(u.principal.id),l.aliquota=u.principal);for(let p of u.alternativas)l.alternativas.some(m=>m.condicao===p.condicao)||l.alternativas.push({aliquota:p.aliquota,condicao:p.condicao});d.principal&&(l.baseNaVigencia=ka(l.baseNaVigencia+s.base))}if(l._valores.push(s.situacao==="INCIDENCIA"?s.valor:null),s.categoria&&i&&i<t){let d=$s(o,n,t);l._proj.set(d.motivo,d.situacao)}}}return[...a.values()].map(r=>{let{_aliqs:i,_motivos:n,_fund:s,_alertas:c,_cfops:l,_valores:d,_proj:u,...p}=r,m=[...u.values()].reduce((v,C)=>v===null||$a[C]>$a[v]?C:v,null),g=d.length>0&&d.every(v=>v!==null);return{...p,aliquota:i.size===1?p.aliquota:null,valor:g?ka(d.reduce((v,C)=>v+(C??0),0)):null,motivos:[...n].map(([v,C])=>({motivo:v,itens:C})).sort((v,C)=>C.itens-v.itens),fundamentos:[...s],alertas:[...c],cfops:[...l].sort(),projecaoVigencia:m?{data:t,situacao:m,motivos:[...u.keys()]}:null}}).sort((r,i)=>$a[i.situacao]-$a[r.situacao]||(i.categoria?1:0)-(r.categoria?1:0)||i.base-r.base)}function ai(o,e,a){let t=e?e.escolha:o.situacao,r=e&&e.escolha!=="VALIDACAO"?"CONFIRMADA":t==="VALIDACAO"?"PENDENTE":"SUGESTAO",i=null,n="";if(t==="NAO_INCIDENCIA")n="Sem IS nesta opera\xE7\xE3o.";else if(t==="VALIDACAO")n="Pendente de valida\xE7\xE3o fiscal: nenhuma al\xEDquota \xE9 aplicada.";else if(o.valor!==null&&o.situacao==="INCIDENCIA")i=o.valor,n=o.aliquota?.regraCalculo??"";else if(!o.aliquota)n="Valor n\xE3o calculado: n\xE3o h\xE1 al\xEDquota cadastrada para o NCM.";else if(o.baseNaVigencia===0)n=`Valor n\xE3o calculado: as opera\xE7\xF5es s\xE3o anteriores \xE0 vig\xEAncia das al\xEDquotas do IS (a partir de ${vt(o.aliquota.vigenciaInicio)}).`;else if(o.aliquota.situacao!=="conferida")n=`Valor n\xE3o calculado: al\xEDquota de ${o.aliquota.aliquota!=null?Ua(o.aliquota.aliquota):"(n\xE3o informada)"} pendente de confer\xEAncia com ${o.aliquota.dispositivo}.`;else{let s=a.categorias.find(d=>d.id===o.aliquota.categoria),c=s?ks(o.aliquota,s,o.baseNaVigencia,null):{valor:null,pendencia:"categoria n\xE3o encontrada."};i=c.valor;let l=o.alternativas.length?` Aten\xE7\xE3o: ${o.alternativas.map(d=>`${d.aliquota!=null?Ua(d.aliquota):"\u2014"} se ${d.condicao}`).join("; ")}.`:"";n=c.valor===null?`Valor n\xE3o calculado: ${c.pendencia}`:`${o.aliquota.regraCalculo} (base na vig\xEAncia: R$ ${o.baseNaVigencia.toFixed(2)}).${l}`}return{...o,sugestao:o.situacao,escolha:e,situacaoFinal:t,validacao:r,valorFinal:i,calculo:n}}var vt,Ua,ka,$a,xt,oi=w(()=>{"use strict";f();le();vt=o=>`${o.slice(8,10)}/${o.slice(5,7)}/${o.slice(0,4)}`,Ua=o=>`${(o*100).toLocaleString("pt-BR",{maximumFractionDigits:4})}%`,ka=o=>Math.round(o*100)/100;$a={NAO_INCIDENCIA:0,INCIDENCIA:1,VALIDACAO:2};xt=["INCIDENCIA","NAO_INCIDENCIA","VALIDACAO"]});function J(o){return{raiz:o,aguardando:(0,H.join)(o,"aguardando"),xmls:(0,H.join)(o,"xmls"),respostas:(0,H.join)(o,"respostas.json"),atividade:(0,H.join)(o,"atividade.json"),empresaAnalise:(0,H.join)(o,"empresa-analise.json"),empresaConfig:(0,H.join)(o,"empresa-config.json"),versoes:(0,H.join)(o,"versoes.json"),respondidas:(0,H.join)(o,"pendencias-respondidas.json"),respostasIS:(0,H.join)(o,"respostas-is.json")}}function ti(o,e){be(o,{recursive:!0,force:!0}),ae(J(o).xmls,{recursive:!0}),ae(J(o).aguardando,{recursive:!0});for(let a of At)be((0,H.join)(e,a),{force:!0})}function Hs(o,e){try{Ut(o,e)}catch{kt(o,e),be(o,{force:!0})}}function Gs(o,e){let a=J(o);ae(a.aguardando,{recursive:!0});for(let t of e)Hs(t.caminho,(0,H.join)(a.aguardando,(0,H.basename)(t.nome)));return e.length}function Xs(o){let e=J(o);if(!k(e.aguardando))return 0;ae(e.xmls,{recursive:!0});let a=_e(e.aguardando);for(let t of a)Hs((0,H.join)(e.aguardando,t),(0,H.join)(e.xmls,t));return a.length}function Ye(o){let e=J(o);return k(e.xmls)?_e(e.xmls).length:0}function xo(o){let e=J(o);return k(e.aguardando)?_e(e.aguardando).length:0}function ga(o){let e=J(o);return k(e.respostas)?JSON.parse(P(e.respostas,"utf8")):[]}function Qs(o,e){let a=J(o);ae(o,{recursive:!0});let t=s=>`${s.ncm}|${s.cProd}|${s.regraId}`,r=new Set(e.map(t)),i=ga(o).filter(s=>!r.has(t(s)));i.push(...e),$(a.respostas,JSON.stringify(i,null,2),"utf8");let n=ri(o);return Js(o,{...n,respostas:n.respostas+1}),i}function ri(o){let e=J(o);if(!k(e.versoes))return{respostas:0,processada:0};let a=JSON.parse(P(e.versoes,"utf8"));return{respostas:Number(a.respostas)||0,processada:Number(a.processada)||0}}function Js(o,e){$(J(o).versoes,JSON.stringify(e),"utf8")}function Ao(o){if(Ye(o)===0)return!1;let e=ri(o);return e.respostas>e.processada}function ii(o){let e=J(o);return k(e.respostasIS)?JSON.parse(P(e.respostasIS,"utf8")):{}}function Ws(o,e,a,t){if(!xt.includes(a))throw new Error(`Escolha de Imposto Seletivo inv\xE1lida: ${String(a)}`);let r=ii(o),i={escolha:a,autor:t||"Sistema",data:new Date().toISOString().slice(0,10)};return r[e]=i,ae(o,{recursive:!0}),$(J(o).respostasIS,JSON.stringify(r,null,2),"utf8"),i}function ni(o){let e=J(o);return k(e.respondidas)?JSON.parse(P(e.respondidas,"utf8")):{}}function Zs(o,e,a){let t=ni(o);t[e]||(t[e]=a,ae(o,{recursive:!0}),$(J(o).respondidas,JSON.stringify(t),"utf8"))}function op(o){let e=J(o);if(!k(e.atividade))return{};let a=JSON.parse(P(e.atividade,"utf8"));return typeof a.barOuRestaurante=="boolean"?{barOuRestaurante:a.barOuRestaurante}:{}}function Ys(o,e){ae(o,{recursive:!0}),$(J(o).atividade,JSON.stringify({barOuRestaurante:e.barOuRestaurante},null,2),"utf8")}function si(o,e){let{validacoes:a,...t}=JSON.parse(P(e,"utf8"));return{...t,...op(o)}}function tp(o,e){let a=J(o);ae(o,{recursive:!0});let t=si(o,e);return $(a.empresaConfig,JSON.stringify({...t,validacoes:[]},null,2),"utf8"),$(a.empresaAnalise,JSON.stringify({...t,validacoes:ga(o)},null,2),"utf8"),{empresaAnalise:a.empresaAnalise,empresaConfig:a.empresaConfig}}function rp(o,e,a){let t=(0,H.join)(e,"imposto-seletivo.json");try{let r=bt(a),i=zs(r,ca(o).documentos);$(t,JSON.stringify({disponivel:!0,versaoBase:r.versao,produtos:i}),"utf8")}catch(r){$(t,JSON.stringify({disponivel:!1,motivo:r instanceof Error?r.message:String(r),produtos:[]}),"utf8")}}function Ks(o){let e=J(o.raiz);if(Ye(o.raiz)===0){for(let c of At)be((0,H.join)(o.pastaSaida,c),{force:!0});return{xmls:0,documentos:0,descartados:0,pendencias:0,indicadores:{},alertas:{disponivel:!1,motivo:"an\xE1lise sem XMLs"}}}let a=ri(o.raiz),{empresaAnalise:t,empresaConfig:r}=tp(o.raiz,o.arquivoEmpresa),i=Yr(e.xmls),n=js(e.xmls,t,o.pastaSaida,o.arquivoBase,i);rp(i.leituras,o.pastaSaida,o.arquivoIS??(0,H.join)((0,H.dirname)(o.arquivoBase),"imposto-seletivo.json"));let s;try{Ls({pastaXml:e.xmls,arquivoEmpresa:t,arquivoEmpresaExplicacao:r,saida:o.pastaSaida,arquivoBase:o.arquivoBase,arquivoV2:o.arquivoV2,arquivoMatriz:o.arquivoMatriz,limparAntes:!0,vereditosDeReferencia:(0,H.join)(o.pastaSaida,"vereditos.json"),lidos:i}),s={disponivel:!0}}catch(c){s={disponivel:!1,motivo:c instanceof Error?c.message:String(c)}}return Js(o.raiz,{...a,processada:a.respostas}),{xmls:n.xmls,documentos:n.documentos,descartados:n.descartados,pendencias:n.fila.length,indicadores:n.indicadores,alertas:s}}var H,At,ci=w(()=>{"use strict";f();le();H=ue(Ne(),1);Kr();rt();oi();Jr();At=["vereditos.json","indicadores.json","fila-validacao.json","descartados.json","composicao.json","explicacoes.json","reducoes-exibicao.json","alertas.json","imposto-seletivo.json"]});function ec(o=""){return`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#2C4233">
<link rel="icon" type="image/png" href="marca/icone.png">
<link rel="preload" href="vendor/cormorant-garamond-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="vendor/cormorant-garamond-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
${o}<script src="vendor/chart.umd.js"><\/script><script src="vendor/chartjs-plugin-datalabels.min.js"><\/script>
<script src="vendor/xlsx-mini.js"><\/script>
<script src="vendor/jspdf.umd.min.js"><\/script>
<script src="vendor/jspdf.plugin.autotable.min.js"><\/script>
<title>Conformidade IBS/CBS \xB7 Sabores Estrat\xE9gicos</title>
<style>
/* ============ Identidade visual Sabores Estrat\xE9gicos ============
   Verde da coruja (#2C4233) como cor institucional, dourado (#AC9368) nos detalhes e
   fundos off-white. S\xF3 apar\xEAncia: regras, textos dos resultados e a\xE7\xF5es n\xE3o dependem daqui. */
@font-face{font-family:"Cormorant Garamond";font-style:normal;font-weight:600;font-display:swap;src:url(vendor/cormorant-garamond-latin-600-normal.woff2) format("woff2")}
@font-face{font-family:"Cormorant Garamond";font-style:normal;font-weight:700;font-display:swap;src:url(vendor/cormorant-garamond-latin-700-normal.woff2) format("woff2")}
:root{
 --verde-900:#1B2B21;--verde-800:#23372B;--verde-700:#2C4233;--verde-600:#3A5543;--verde-500:#557060;
 --verde-300:#A8BBAD;--verde-200:#CBD8CE;--verde-100:#E4ECE6;--verde-50:#F1F5F1;
 --ouro-800:#6B5427;--ouro-700:#7E6531;--ouro-600:#96794A;--ouro-500:#AC9368;--ouro-400:#C9AE7C;
 --ouro-300:#DCC9A3;--ouro-200:#EADDC2;--ouro-100:#F4ECDC;--ouro-50:#FAF6EC;
 --creme:#F4EEE2;--papel:#F6F3EC;--papel-2:#EFEAE0;--superficie:#FFFDF9;--superficie-2:#FAF8F3;
 --linha:#E6E0D3;--linha-2:#D9D1C1;
 --texto:#1D2922;--texto-2:#46544B;--texto-3:#626E66;
 --ok:#2E6B45;--ok-fundo:#EAF3EC;--ok-borda:#BFD8C6;--ok-forte:#3A7A52;
 --economia:#8F5316;--economia-fundo:#FBF1E4;--economia-borda:#EBCFA6;--economia-forte:#B26B26;
 --risco:#9C2F25;--risco-fundo:#FAEDEA;--risco-borda:#EBC5BE;--risco-forte:#A53E33;
 --pendente:#7A5E24;--pendente-fundo:#F8F1E0;--pendente-borda:#E4D0A2;--pendente-forte:#A8863F;
 --neutro:#5A665F;--neutro-fundo:#F0EFEA;--neutro-borda:#D8D6CC;
 --info:#44544B;--info-fundo:#F2F0E9;--info-borda:#DCD5C6;
 --sombra-1:0 1px 2px rgba(29,41,34,.05);
 --sombra-2:0 1px 2px rgba(29,41,34,.04),0 10px 28px -14px rgba(29,41,34,.20);
 --serif:"Cormorant Garamond","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif;
 --sans:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
*{box-sizing:border-box}
[hidden]{display:none!important}
html{scroll-padding-top:72px}
body{margin:0;font-family:var(--sans);font-size:15px;line-height:1.5;font-variant-numeric:lining-nums;background:var(--papel);color:var(--texto);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
::selection{background:var(--ouro-200);color:var(--verde-900)}
a{color:var(--verde-600);text-decoration-color:var(--ouro-400);text-underline-offset:2px}
a:hover{color:var(--verde-900)}
.ico{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;vertical-align:middle}

/* ---------- Cabe\xE7alho ---------- */
header.topo{position:relative;display:flex;align-items:center;gap:28px;padding:18px max(32px,calc((100% - 1500px) / 2 + 32px));background:linear-gradient(115deg,var(--verde-700) 0%,var(--verde-800) 62%,#1E3125 100%);color:var(--creme);overflow:hidden}
.marca{display:flex;align-items:center;gap:14px;flex:none}
.marca-coruja{display:block;height:56px;width:auto}
.marca-assinatura{display:block;height:42px;width:auto}
.topo-titulo{min-width:0;padding-left:28px;border-left:1px solid rgba(201,174,124,.45)}
header.topo h1{margin:0;font-family:var(--serif);font-weight:600;font-size:30px;line-height:1.05;letter-spacing:.01em;color:#FBF7EE}
header.topo p{margin:5px 0 0;font-size:13.5px;color:rgba(244,238,226,.74)}
.cabecalho-impressao{display:none}

/* ---------- Navega\xE7\xE3o ---------- */
nav{position:sticky;top:0;z-index:40;display:flex;gap:2px;padding:0 max(16px,calc((100% - 1500px) / 2 + 16px));background:var(--verde-800);border-top:1px solid rgba(244,238,226,.07);box-shadow:inset 0 -1px 0 rgba(201,174,124,.38),0 8px 18px -12px rgba(15,25,19,.55);overflow-x:auto;scrollbar-width:none}
nav::-webkit-scrollbar{display:none}
nav button{position:relative;display:inline-flex;align-items:center;gap:8px;flex:none;border:0;background:transparent;padding:14px 16px 15px;cursor:pointer;font-family:var(--sans);font-size:14px;font-weight:600;letter-spacing:.01em;color:rgba(244,238,226,.74);white-space:nowrap;transition:color .15s,background-color .15s}
nav button .ico{width:17px;height:17px;opacity:.85}
nav button:hover{color:#FBF7EE;background:rgba(244,238,226,.06)}
nav button.active{color:#FFFDF6;background:rgba(244,238,226,.08)}
nav button.active .ico{color:var(--ouro-400);opacity:1}
nav button.active::after{content:"";position:absolute;left:10px;right:10px;bottom:0;height:3px;border-radius:3px 3px 0 0;background:var(--ouro-400)}
nav button:focus-visible{outline:2px solid var(--ouro-400);outline-offset:-4px;border-radius:8px}

/* ---------- Estrutura ---------- */
main{max-width:1500px;margin:0 auto;padding:30px 32px 40px}
.tela{display:none}
.tela.active{display:block;animation:surgir .28s ease-out}
@keyframes surgir{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.card{background:var(--superficie);border:1px solid var(--linha);border-radius:14px;padding:26px 28px;margin-bottom:22px;box-shadow:var(--sombra-2)}
.card .card{background:var(--superficie-2);box-shadow:none;border-radius:12px;padding:20px 22px}
h1,h2,h3,h4{color:var(--verde-900)}
h2{margin:0 0 20px;font-family:var(--serif);font-weight:700;font-size:34px;line-height:1.05;letter-spacing:.005em}
h2::after{content:"";display:block;width:46px;height:2px;margin-top:12px;background:linear-gradient(90deg,var(--ouro-500),var(--ouro-300))}
h3{margin:0 0 14px;font-family:var(--serif);font-weight:700;font-size:23px;line-height:1.15}
h4{margin:0 0 8px;font-size:14px;font-weight:700;letter-spacing:.01em}
p{margin:0 0 10px}
.small{font-size:12px;color:var(--texto-3)}
.rotulo{display:block;color:var(--texto-3);font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.06em}
.valor{font-weight:700}
.rodape{display:flex;align-items:center;justify-content:center;gap:10px;padding:22px 16px 30px;color:var(--texto-3);font-size:12.5px;letter-spacing:.02em}
.rodape img{height:24px;width:auto;opacity:.9}
.rodape strong{font-family:var(--serif);font-size:16px;font-weight:700;color:var(--verde-700);letter-spacing:.04em}
.rodape-sep{width:1px;height:14px;background:var(--linha-2)}

/* ---------- Bot\xF5es ---------- */
button{font-family:var(--sans)}
button.primary,button.secondary,button.perigo{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:9px 18px;border-radius:10px;font-size:14px;font-weight:600;letter-spacing:.01em;line-height:1.2;cursor:pointer;transition:background-color .15s,border-color .15s,color .15s,box-shadow .15s}
button.primary{background:var(--verde-700);color:#FBF8F1;border:1px solid var(--verde-700);box-shadow:0 1px 2px rgba(29,41,34,.2),inset 0 1px 0 rgba(255,255,255,.07)}
button.primary:hover:not(:disabled){background:var(--verde-800);border-color:var(--verde-800)}
button.primary:active:not(:disabled){background:var(--verde-900);border-color:var(--verde-900)}
button.secondary{background:var(--superficie);color:var(--verde-800);border:1px solid var(--linha-2);box-shadow:var(--sombra-1)}
button.secondary:hover:not(:disabled){background:var(--verde-50);border-color:var(--verde-500)}
button.secondary:active:not(:disabled){background:var(--verde-100)}
button.perigo{background:var(--risco-fundo);color:var(--risco);border:1px solid var(--risco-borda)}
button.perigo:hover:not(:disabled){background:#F5DFDA;border-color:#DDA59B}
button.relatorio-final-selecionado,button.relatorio-final-selecionado:hover:not(:disabled),
button.validacao-selecionada,button.validacao-selecionada:hover:not(:disabled){background:var(--verde-700);color:#FBF8F1;border-color:var(--verde-700);box-shadow:0 0 0 3px var(--ouro-200)}
button.link{background:none;border:0;color:var(--verde-600);cursor:pointer;padding:4px;font-size:13px}
button:disabled{opacity:.45;cursor:not-allowed}
button:focus-visible{outline:2px solid var(--ouro-500);outline-offset:2px}
.segmentado{display:inline-flex;flex-wrap:wrap;gap:4px;padding:4px;border:1px solid var(--linha-2);border-radius:12px;background:var(--papel)}
.segmentado button.secondary{min-height:36px;padding:7px 14px;border-color:transparent;background:transparent;box-shadow:none;font-size:13px;letter-spacing:.04em;color:var(--texto-2)}
.segmentado button.secondary:hover:not(:disabled){background:var(--superficie);border-color:var(--linha);color:var(--verde-900)}
.segmentado button.relatorio-final-selecionado,.segmentado button.relatorio-final-selecionado:hover:not(:disabled){background:var(--verde-700);border-color:var(--verde-700);color:#FBF8F1;box-shadow:0 1px 3px rgba(29,41,34,.25)}

/* ---------- Campos ---------- */
input,select{font-family:var(--sans);font-size:14px;color:var(--texto);background-color:var(--superficie);padding:10px 12px;border:1px solid var(--linha-2);border-radius:10px;width:100%;min-height:42px;transition:border-color .15s,box-shadow .15s}
input::placeholder{color:#8A938D}
input:hover,select:hover{border-color:var(--verde-300)}
input:focus,select:focus{outline:none;border-color:var(--verde-600);box-shadow:0 0 0 3px var(--ouro-100)}
select{appearance:none;-webkit-appearance:none;padding-right:38px;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232C4233' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;background-size:16px}
.filters{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:12px;margin-bottom:14px}
.barra{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
.barra .small{margin-left:4px}

/* ---------- An\xE1lise atual ---------- */
.painel-analise{position:relative;overflow:hidden;padding:30px 32px}
.painel-analise::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--verde-700),var(--ouro-500))}
.estado-analise{display:flex;align-items:center;gap:12px;margin:0 0 22px;padding:12px 16px;border:1px solid var(--verde-100);border-radius:10px;background:var(--verde-50);font-size:14.5px;font-weight:600;color:var(--verde-900)}
.estado-analise::before{content:"";flex:none;width:9px;height:9px;border-radius:50%;background:var(--ouro-500);box-shadow:0 0 0 4px var(--ouro-100)}
.upload{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);gap:18px;margin-bottom:18px}
.upload-zona{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:178px;padding:26px 22px;text-align:center;border:1.5px dashed var(--ouro-400);border-radius:14px;background:linear-gradient(180deg,var(--ouro-50),var(--superficie));cursor:pointer;transition:border-color .15s,background-color .15s,box-shadow .15s}
.upload-zona:hover,.upload-zona.arrastando{border-color:var(--verde-600);background:var(--verde-50)}
.upload-zona:focus-within,.upload-zona.arrastando{box-shadow:0 0 0 4px var(--ouro-100);border-color:var(--verde-600)}
.upload-zona input[type=file]{position:absolute;inset:0;width:100%;height:100%;min-height:0;margin:0;padding:0;border:0;opacity:0;cursor:pointer}
.upload-icone{display:flex;align-items:center;justify-content:center;width:48px;height:48px;margin-bottom:4px;border-radius:50%;background:var(--verde-700);color:var(--creme);box-shadow:0 0 0 6px var(--verde-100)}
.upload-icone .ico{width:22px;height:22px}
.upload-titulo{font-size:15.5px;font-weight:700;color:var(--verde-900)}
.upload-detalhe{font-size:12.5px;color:var(--texto-3)}
.upload-selecao{margin-top:8px;max-width:100%;padding:4px 14px;border:1px solid var(--linha);border-radius:999px;background:var(--superficie);font-size:12.5px;font-weight:600;color:var(--texto-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.upload-zona.com-arquivos{border-style:solid;border-color:var(--verde-500)}
.upload-zona.com-arquivos .upload-selecao{background:var(--verde-700);border-color:var(--verde-700);color:#FBF8F1}
.upload-passos{display:flex;flex-direction:column;justify-content:center;gap:14px;margin:0;padding:20px 22px;list-style:none;counter-reset:passo;border:1px solid var(--linha);border-radius:14px;background:var(--superficie-2)}
.upload-passos li{counter-increment:passo;display:grid;grid-template-columns:28px minmax(0,1fr);gap:12px;align-items:start;font-size:13.5px;line-height:1.45;color:var(--texto-2)}
.upload-passos li::before{content:counter(passo);display:flex;align-items:center;justify-content:center;width:28px;height:28px;margin-top:-4px;border:1.5px solid var(--ouro-500);border-radius:50%;background:var(--superficie);font-family:var(--serif);font-size:16px;font-weight:700;color:var(--ouro-700)}
.upload-passos strong{color:var(--verde-900)}
.acoes-analise{margin-bottom:8px}
.acoes-analise .perigo{margin-left:auto}
.nota-analise{margin:0}
#status:not(:empty){margin-top:14px;padding:10px 14px;border-left:3px solid var(--ouro-500);border-radius:8px;background:var(--ouro-50);font-size:14px;font-weight:600;color:var(--verde-900)}
#resumoProcessamento:not(:empty){margin-top:24px;padding-top:24px;border-top:1px solid var(--linha)}
#resumoProcessamento h3{margin-top:28px}
.analise-complementos{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);gap:20px;align-items:start;margin-top:24px}
.analise-complementos .card{margin:0}
.aliquota-item{display:grid;grid-template-columns:64px 104px minmax(0,1fr);gap:16px;align-items:center;padding:14px 0;border-bottom:1px solid var(--linha)}
.aliquota-item:last-child{border-bottom:0;padding-bottom:0}
.aliquota-item>strong{display:flex;align-items:center;justify-content:center;height:30px;border-radius:8px;background:var(--verde-700);color:#FBF8F1;font-size:12.5px;letter-spacing:.1em}
.aliquota-percentual{font-family:var(--serif);font-size:30px;font-weight:700;line-height:1;color:var(--ouro-700)}
.aliquota-descricao{font-size:13px;line-height:1.55;color:var(--texto-2)}
#beneficioAtividadeConteudo .aliquota-descricao{padding:5px 0}
#beneficioAtividadeConteudo>.selo{margin:0 0 10px}
.atividade-declaracao{display:grid;gap:6px;margin:10px 0 12px}
.atividade-declaracao button{justify-self:start}

/* ---------- Indicadores ---------- */
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px}
#resumoProcessamento h3+.grid{grid-template-columns:repeat(4,minmax(0,1fr))}
.metric{position:relative;overflow:hidden;background:var(--superficie);border:1px solid var(--linha);border-radius:12px;padding:16px 18px 15px 20px;box-shadow:var(--sombra-1);text-align:left}
.metric::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ouro-300)}
.metric .label{font-size:12.5px;font-weight:600;color:var(--texto-3);letter-spacing:.01em;text-align:left}
.metric .numero{margin-top:6px;font-family:var(--serif);font-size:34px;font-weight:700;line-height:1.05;color:var(--verde-900);text-align:left;font-variant-numeric:lining-nums}
.metric .numero .small{margin-top:4px;font-family:var(--sans);font-size:12px;font-weight:600;line-height:1.35;color:var(--texto-3)}
.metric .numero.CORRETO{color:var(--ok)}.metric .numero.INCORRETO{color:var(--risco)}.metric .numero.REQUER_VALIDACAO{color:var(--pendente)}
.metric:has(.numero.CORRETO)::before{background:var(--ok-forte)}
.metric:has(.numero.INCORRETO)::before{background:var(--risco-forte)}
.metric:has(.numero.REQUER_VALIDACAO)::before{background:var(--pendente-forte)}
#resumoProcessamento h3+.grid .metric:nth-child(2)::before{background:var(--ok-forte)}
#resumoProcessamento h3+.grid .metric:nth-child(3)::before{background:var(--risco-forte)}
#resumoProcessamento h3+.grid .metric:nth-child(4)::before{background:var(--pendente-forte)}
#resumoProcessamento h3+.grid .metric:nth-child(7){background:linear-gradient(180deg,var(--ouro-50),var(--superficie));border-color:var(--ouro-200)}
#resumoProcessamento h3+.grid .metric:nth-child(7)::before{background:var(--ouro-500)}
#resumoProcessamento h3+.grid .metric:nth-child(7) .numero{color:var(--ouro-700)}
#resumoProcessamento h3+.grid .metric:nth-child(8){background:linear-gradient(180deg,var(--verde-50),var(--superficie));border-color:var(--verde-200)}
#resumoProcessamento h3+.grid .metric:nth-child(8)::before{background:var(--verde-700)}

/* ---------- Avisos e selos ---------- */
.aviso{background:var(--ouro-50);border:1px solid var(--ouro-200);border-left:4px solid var(--ouro-500);color:#584521;padding:12px 16px;border-radius:10px;margin-bottom:14px;font-size:14px}
.aviso.composicao-xmls{margin-top:16px;margin-bottom:0}
.aviso-validacoes{display:flex;flex-wrap:wrap;align-items:center;gap:10px;justify-content:space-between}
.aviso-validacoes.erro{background:#FBEDEC;border-color:#E9B8B3;border-left-color:#9B2C2C;color:#7A1F1F}
.estado-validacao{margin-top:10px;font-size:13px;color:var(--verde-700)}
.estado-validacao.salvando{color:#584521}
.estado-validacao.erro{color:#9B2C2C;font-weight:600}
.selo-validado{display:inline-block;margin-left:8px;padding:2px 8px;border-radius:999px;background:var(--verde-700);color:#FBF8F1;font-size:12px;vertical-align:middle}
.titulo-validados{margin-top:28px}
.aviso-info{margin-top:6px;padding:7px 10px;background:var(--info-fundo);border:1px solid var(--info-borda);border-radius:8px;font-size:12px;color:var(--info)}
.aviso-regra{margin-top:6px;padding:7px 10px;background:var(--risco-fundo);border:1px solid var(--risco-borda);border-radius:8px;font-size:12px;color:#7E271F}
.selo{display:inline-flex;align-items:center;gap:5px;margin:4px 6px 0 0;padding:2px 10px;border:1px solid transparent;border-radius:999px;font-size:12px;font-weight:600;line-height:1.5}
.selo-oficial{background:var(--ok-fundo);color:var(--ok);border-color:var(--ok-borda)}
.selo-aviso{background:#F6F1E5;color:#6A5629;border-color:#E2D6B8}
.selo-humano{background:var(--verde-700);color:#FBF8F1;border-color:var(--verde-700)}
.selo-pendente{background:var(--superficie);color:var(--ouro-800);border-color:var(--ouro-400)}
.selo-pendente::before{content:"";flex:none;width:6px;height:6px;border-radius:50%;background:var(--ouro-500)}
.selo-sem-cadastro,.selo-bloqueio{background:var(--risco-fundo);color:var(--risco);border-color:var(--risco-borda)}
.selo-info{background:var(--info-fundo);color:var(--info);border-color:var(--info-borda)}
.selos-produto{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.selos-produto .selo{margin:0}

/* ---------- Estados ---------- */
.status{font-weight:700}
.CORRETO{color:var(--ok)}
.INCORRETO_ECONOMIA{color:var(--economia)}
.INCORRETO_RISCO{color:var(--risco)}
.REQUER_VALIDACAO{color:var(--pendente)}
.NAO_OBRIGATORIO{color:var(--neutro)}
.INDETERMINADO{color:var(--risco)}
.INCORRETO_NCM{color:var(--risco)}
.r-a-pagar{color:var(--risco);font-weight:600}
.aviso-ncm{display:flex;flex-direction:column;gap:4px;margin:0 0 10px;padding:12px 14px;border:2px solid #B3261E;border-radius:10px;background:#FDECEA;color:#7A1A13}
.aviso-ncm strong{font-size:1.05em;letter-spacing:.02em}

/* ---------- Tabelas ---------- */
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{padding:11px 12px;border-bottom:1px solid var(--linha);text-align:left;vertical-align:top}
th{background:var(--papel-2);color:var(--verde-900);font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.tabela-wrap{overflow-x:auto;border:1px solid var(--linha);border-radius:12px;background:var(--superficie)}
.tabela-wrap th{border-bottom:1.5px solid var(--ouro-300)}
.tabela-wrap td:nth-child(2){width:190px}
.tabela-wrap table:has(th:nth-child(8)){min-width:3000px}
.tabela-wrap table:has(th:nth-child(8)) th{white-space:nowrap}
.tabela-wrap tbody tr:nth-child(even) td{background:#FCFAF6}
.tabela-wrap tbody tr:hover td{background:var(--ouro-50)}
.tabela-wrap tbody tr:last-child td{border-bottom:0}
.tabela-wrap td:first-child{font-weight:600;color:var(--verde-800);font-variant-numeric:lining-nums tabular-nums}
table.confronto{width:100%;border-collapse:separate;border-spacing:0;font-size:13px;border:1px solid var(--linha);border-radius:8px;overflow:hidden}
table.confronto th,table.confronto td{padding:5px 8px;border-bottom:1px solid var(--linha);white-space:nowrap}
table.confronto tr:last-child td{border-bottom:0}
table.confronto th{background:var(--papel-2);font-size:11px;text-transform:uppercase;color:var(--texto-2)}
table.confronto td:first-child{color:var(--texto-3)}
table.confronto td.igual{background:var(--ok-fundo);color:var(--ok);font-weight:700}
table.confronto td.difere{background:var(--risco-fundo);color:var(--risco);font-weight:700}
table.confronto td.indefinido{color:var(--pendente);font-style:italic;white-space:normal}
.confronto-legenda{font-size:11px;color:var(--texto-3);margin-top:4px}

/* ---------- Resultados ---------- */
.itens-resultado{display:flex;flex-direction:column;gap:10px}
.item-res{border:1px solid var(--linha);border-left:4px solid #A9ADA3;border-radius:12px;background:var(--superficie);padding:12px 16px;font-size:13px;overflow-wrap:anywhere;break-inside:avoid;box-shadow:var(--sombra-1);transition:box-shadow .15s,border-color .15s}
.item-res:hover{box-shadow:0 1px 2px rgba(29,41,34,.05),0 8px 20px -14px rgba(29,41,34,.35)}
.item-res[data-estado=CORRETO]{border-left-color:var(--ok-forte)}
.item-res[data-estado=INCORRETO_ECONOMIA]{border-left-color:var(--economia-forte)}
.item-res[data-estado=INCORRETO_RISCO],.item-res[data-estado=INCORRETO_NCM],.item-res[data-estado=INDETERMINADO]{border-left-color:var(--risco-forte)}
.item-res[data-estado=REQUER_VALIDACAO]{border-left-color:var(--pendente-forte)}
.item-topo{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding-bottom:8px;border-bottom:1px solid var(--linha)}
.item-produto{font-weight:700;font-size:14px}
.item-selo{text-align:right;white-space:nowrap}
.item-selo .status{font-size:14px}
.item-corpo{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr) minmax(0,1.35fr);gap:14px;margin-top:10px}
.dados{display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;align-content:start}
.dados div{min-width:0}
.explica div{margin-bottom:5px}
@media(max-width:1100px){.item-corpo{grid-template-columns:minmax(0,1fr) minmax(0,1.25fr)}.item-corpo .explica{grid-column:1 / -1}}
@media(max-width:700px){.item-corpo{grid-template-columns:1fr}}
#listaResultados{gap:8px}
.item-res.compacto{padding:10px 14px 8px;font-size:12.5px}
.r-linha{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin-top:4px}
.r-topo{margin-top:0}
.r-prod{font-weight:700;font-size:14px;color:var(--verde-900)}
.r-lbl{color:var(--texto-3);font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-right:3px}
.r-seta{color:var(--ouro-500)}
.chip{display:inline-block;padding:0 7px;border:1px solid var(--linha);border-radius:6px;background:var(--papel);white-space:nowrap;line-height:20px;font-variant-numeric:lining-nums tabular-nums}
.chip-r{color:var(--texto-3)}
.chip-igual{background:var(--ok-fundo);border-color:var(--ok-borda)}
.chip-difere{background:var(--risco-fundo);border-color:var(--risco-borda)}
.chip-indef{background:var(--pendente-fundo);border-color:var(--pendente-borda)}
.r-red{font-size:14px;color:var(--verde-700)}
.r-valores>span{margin-right:12px;white-space:nowrap}
.r-div{width:1px;height:14px;background:var(--linha-2);margin:0 4px}
.r-economia{color:var(--economia);font-weight:700}
.r-exposicao{color:var(--risco);font-weight:700}
.r-motivo{margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.compacto .selo{margin:0;padding:0 8px;line-height:19px}
.r-cab{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding-bottom:6px}
.r-cab-esq{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;min-width:0}
.r-cab-dir{display:flex;align-items:center;flex:0 0 auto;gap:10px}
.compacto .status-selo{padding:3px 12px;border:1.5px solid currentColor;border-radius:999px;background:var(--superficie);font-size:11.5px;font-weight:700;letter-spacing:.05em;white-space:nowrap}
.status-selo.CORRETO{background:var(--ok-fundo)}
.status-selo.INCORRETO_ECONOMIA{background:var(--economia-fundo)}
.status-selo.INCORRETO_RISCO,.status-selo.INCORRETO_NCM,.status-selo.INDETERMINADO{background:var(--risco-fundo)}
.status-selo.REQUER_VALIDACAO{background:var(--pendente-fundo)}
.status-selo.NAO_OBRIGATORIO{background:var(--neutro-fundo)}
.r-par{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 12px;align-items:center;padding:3px 8px;border-radius:6px;background:var(--superficie-2)}
.r-inf{margin-top:4px;border-left:3px solid var(--linha-2)}
.r-enq{margin-top:3px;border-left:3px solid var(--verde-500)}
.r-esq{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;min-width:0}
.r-dir{display:flex;gap:14px;justify-content:flex-end;white-space:nowrap;font-variant-numeric:lining-nums tabular-nums}
.r-reducao .r-humano{margin-left:auto}
.aud-det summary{margin-top:8px;font-size:13px;font-weight:700;cursor:pointer}
.item-res[data-estado=CORRETO] .aud-det summary{color:var(--ok)}
.item-res[data-estado=REQUER_VALIDACAO] .aud-det summary{color:var(--pendente)}
.aud-det[open]{border-top:1px dashed var(--linha-2);margin-top:6px;padding-top:4px}
.item-res .alertas-item{margin-top:8px;padding-top:6px;border-top:1px dashed var(--linha)}

/* ---------- Redu\xE7\xE3o, auditoria e regras ---------- */
.reducao{display:grid;grid-template-columns:1fr;gap:4px;background:var(--verde-50);border:1px solid var(--verde-200);border-radius:10px;padding:8px 12px;margin-bottom:8px}
.reducao .valor{font-size:15px;color:var(--verde-700)}
.reducao.sem-evidencia{background:var(--pendente-fundo);border-color:var(--pendente-borda)}
.reducao.sem-evidencia .valor{color:var(--pendente)}
.reducao.nao-determinada{background:var(--neutro-fundo);border-color:var(--neutro-borda)}
.reducao.regime{background:var(--ouro-50);border-color:var(--ouro-300)}
.reducao .aviso-d3{font-size:12px;font-weight:700;color:var(--economia)}
.reducao ul.fatos,.reducao-prev ul.fatos{margin:2px 0 0;padding-left:16px;font-size:11px;color:var(--texto-2)}
.reducao div{margin-bottom:0}
.bloco{margin-top:8px}
.aud{border:1px solid var(--linha-2);border-radius:10px;padding:8px 12px;background:var(--superficie-2)}
.aud-CONFIRMADA{border-color:var(--ok-borda);background:var(--ok-fundo)}
.aud-DIVERGENTE,.aud-NAO_LOCALIZADA{border-color:var(--risco-borda);background:var(--risco-fundo)}
.aud-NAO_DETERMINADA{border-color:var(--pendente-borda);background:var(--pendente-fundo)}
.aud-status{font-weight:700;font-size:14px;margin-bottom:4px;color:var(--verde-900)}
.aud .small{margin-top:3px}
.aud-nota{font-style:italic}
.bloqueio{border:1.5px solid var(--risco-forte);border-radius:10px;padding:10px 12px;background:var(--risco-fundo);margin-top:8px}
.bloq-titulo{font-weight:700;color:var(--risco);font-size:14px;letter-spacing:.02em}
.quadro-regra{border:1.5px solid var(--verde-200);border-radius:12px;padding:10px 14px;background:var(--verde-50)}
.quadro-regra>.rotulo{color:var(--verde-700)}
.quadro-campos{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px 10px;margin:6px 0 8px}
.red-destaque{margin-top:2px;font-size:17px;font-weight:700;color:var(--verde-700)}
.red-partes{font-size:13px;font-weight:700;color:var(--verde-600)}
@media(max-width:900px){.quadro-campos{grid-template-columns:repeat(3,minmax(0,1fr))}}
.item-res .quadro-campos{grid-template-columns:repeat(3,minmax(0,1fr))}
.card.aud-risco,.card.aud-resposta{margin:8px 0;padding:14px 16px;background:var(--superficie)}
.card.aud-risco{border-left:4px solid var(--risco-forte)}
.card.aud-resposta{border-left:4px solid var(--verde-700)}
.card.aud-risco ul{margin:4px 0 0;padding-left:18px}
.card.aud-resposta .barra{margin:8px 0 4px}

/* ---------- Pend\xEAncias e consulta por NCM ---------- */
.pendente{border:1px solid var(--linha);border-radius:14px;padding:18px 20px;margin-bottom:14px;background:var(--superficie);box-shadow:var(--sombra-1)}
.pend-topo{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding-bottom:12px;border-bottom:1px solid var(--linha)}
.pend-topo strong{display:block;margin:2px 0 3px;font-size:16px;color:var(--verde-900)}
.pend-ncm{flex:none;text-align:right;white-space:nowrap;padding:6px 12px;border:1px solid var(--ouro-200);border-radius:10px;background:var(--ouro-50)}
.pend-ncm .valor{display:block;font-size:17px;letter-spacing:.03em;color:var(--verde-800);font-variant-numeric:lining-nums tabular-nums}
.regra-cand,.enq-agrupados{margin-top:12px;padding:12px 16px;border:1px solid var(--linha);border-left:4px solid var(--ouro-500);border-radius:10px;background:var(--superficie-2)}
.regra-cand .bloco{margin-top:10px}
.enq-agrupados>.rotulo{color:var(--ouro-700)}
.enq-agrupados>ol{margin:8px 0 0;padding-left:24px}
.enq-agrupados>ol>li::marker{font-family:var(--serif);font-weight:700;font-size:17px;font-variant-numeric:lining-nums tabular-nums;color:var(--ouro-600)}
.enq-opcao{margin:0 0 12px;padding-bottom:12px;border-bottom:1px dashed var(--linha-2)}
.enq-opcao:last-child{border-bottom:0;margin-bottom:0}
.enq-cab{font-weight:700;color:var(--verde-900)}
.enq-opcao .descricao-legal{margin-top:6px}
.descricao-legal{font-size:14px;line-height:1.55;padding:8px 12px;background:var(--superficie);border:1px solid var(--linha);border-left:3px solid var(--ouro-300);border-radius:6px;overflow-wrap:anywhere}
ul.descricoes{margin:4px 0 0;padding-left:18px;font-size:13px}
.proposto{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px 12px}
.reducao-prev{padding:8px 12px;border:1px solid var(--ok-borda);background:var(--ok-fundo);border-radius:10px}
.reducao-prev.sem-evidencia{border-color:var(--pendente-borda);background:var(--pendente-fundo)}
.reducao-prev.nao-determinada{border-color:var(--neutro-borda);background:var(--neutro-fundo)}
.valor-grande{font-family:var(--serif);font-size:24px;font-weight:700;line-height:1.1;color:var(--verde-800)}
.pergunta-validacao{margin-top:14px;font-weight:700;color:var(--verde-900)}
table.relatorio-centralizado th,table.relatorio-centralizado td{text-align:center;vertical-align:middle;padding:12px 14px}
table.relatorio-centralizado td{white-space:pre-line;line-height:1.45}
table.relatorio-centralizado td:nth-child(2){font-weight:600}
table.relatorio-centralizado td:last-child{min-width:320px;max-width:460px}
table.relatorio-centralizado tbody tr:nth-child(even) td{background:var(--superficie)}
.mc-opcoes{margin:8px 0 6px;padding-left:22px}
.mc-opcao{margin:0 0 10px}
.mc-opcao button{text-align:left;white-space:normal}
.mc-resultado{font-weight:700;color:var(--verde-900);margin-top:3px}
.mc-nao-recomendada button{opacity:.75}
.mc-alerta{color:var(--ouro-700)}
.regra-nao-aplicavel{border-left-color:#9B3B2E}
.nao-aplicavel-quadro{display:grid;gap:6px;padding:10px 12px;border:1px solid var(--linha-2);border-radius:10px;background:#FBF3F1}
.selo-nao-aplicavel{background:#F6E1DC;color:#7A2618;border:1px solid #E3B4A8;font-weight:700;width:fit-content}
.pergunta-validacao .rotulo{color:var(--ouro-700)}
.resposta-registrada{margin-top:8px;font-weight:700;color:var(--verde-800)}
@media(max-width:700px){.proposto{grid-template-columns:repeat(2,minmax(0,1fr))}}
.pergunta{margin-top:10px;padding-top:10px;border-top:1px solid var(--linha)}
.acoes{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
details>summary{display:inline-flex;align-items:center;gap:7px;margin-top:8px;cursor:pointer;list-style:none;color:var(--verde-600);font-size:13px;font-weight:600}
details>summary::-webkit-details-marker{display:none}
details>summary::before{content:"";flex:none;width:6px;height:6px;margin:0 2px 0 1px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(-45deg);transition:transform .15s}
details[open]>summary::before{transform:rotate(45deg)}
details>summary:hover{color:var(--verde-900)}
.alertas-item ul,.alertas-cartao ul,.alertas-lote{margin:6px 0 0;padding-left:18px}
.alertas-item li,.alertas-cartao li,.alertas-lote li{margin-bottom:4px}
.alertas-cartao{border:1px dashed var(--linha-2);border-radius:10px;padding:10px 12px;margin-top:10px;background:var(--superficie-2)}
.alertas-totais{width:auto;margin-bottom:10px}
.alerta-cat{display:inline-block;padding:1px 8px;border:1px solid var(--linha-2);border-radius:999px;background:var(--papel);font-size:11px;font-weight:700;letter-spacing:.03em;color:var(--texto-2)}
.alerta-cat-CONFLITO{background:var(--risco-fundo);color:var(--risco);border-color:var(--risco-borda)}
.alerta-cat-LACUNA{background:var(--economia-fundo);color:var(--economia);border-color:var(--economia-borda)}
.alerta-cat-PENDENCIA{background:var(--pendente-fundo);color:var(--pendente);border-color:var(--pendente-borda)}
.alerta-cat-ATENCAO{background:var(--ouro-50);color:var(--ouro-800);border-color:var(--ouro-300)}
.alerta-cat-INFORMACAO{background:var(--info-fundo);color:var(--info);border-color:var(--info-borda)}
#consultaNcmResultado .pendente>.bloco{margin-top:18px;padding-top:14px;border-top:1px solid var(--linha)}
#consultaNcmResultado .pend-topo+.bloco{margin-top:4px;border-top:0}
#consultaNcmResultado .pendente>.bloco>.rotulo{display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:12.5px;font-weight:700;letter-spacing:.08em;color:var(--verde-700)}
#consultaNcmResultado .pendente>.bloco>.rotulo::before{content:"";width:18px;height:2px;background:var(--ouro-500)}
#consultaNcmResultado .valor{font-size:14px}
#consultaNcmResultado .pendente>.bloco>div{margin-bottom:6px}
#consultaNcmResultado .regra-cand>div{margin-bottom:4px}
#consultaNcmResultado .pend-topo strong{font-family:var(--serif);font-size:22px;letter-spacing:.01em}
.consulta-ncm-filtros{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) minmax(0,1.5fr) auto}

/* ---------- Dashboard ---------- */
.dashboard-resumo,.dashboard-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;margin-bottom:22px}
.dashboard-resumo .card,.dashboard-grid .card{margin-bottom:0}
.card.destaque{position:relative;overflow:hidden;padding-top:28px}
.card.destaque::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--verde-700),var(--ouro-500))}
.card.destaque p{color:var(--texto-2)}
.subtitulo{margin:-8px 0 16px;color:var(--texto-3);font-size:13px}
.chart-container{position:relative;height:280px}
.chart-container-wide{height:300px}
.valores-grafico{margin-top:14px;padding:10px 12px;border-top:1px solid var(--linha);font-size:13.5px;line-height:1.5;text-align:center;color:var(--texto-2);font-variant-numeric:lining-nums tabular-nums}
.valores-grafico strong{font-weight:700;color:var(--verde-900)}
#economiaResumo>p:first-of-type{margin-top:12px}
#detalhesBeneficios{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
#detalhesBeneficios p{margin:0;padding:7px 14px;border:1px solid var(--linha);border-radius:999px;background:var(--superficie-2);font-size:13px;color:var(--texto-2)}
#detalhesBeneficios strong{color:var(--verde-900)}
#aliquotas p{margin:0;padding:10px 0;border-bottom:1px solid var(--linha);font-size:14px;color:var(--texto-2)}
#aliquotas p:last-child{border-bottom:0}
#aliquotas strong{color:var(--verde-800);letter-spacing:.04em}
.icone-situacao .ico{width:24px;height:24px;stroke-width:2.2}
#painelPesquisaNcm>div:first-child select{width:auto;min-width:180px}
#painelPesquisaNcm>div:first-child input{flex:1;min-width:220px}

/* ---------- Telas menores ---------- */
@media(max-width:1100px){.analise-complementos{grid-template-columns:1fr}}
@media(max-width:760px){#resumoProcessamento h3+.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:1000px){.dashboard-resumo,.dashboard-grid{grid-template-columns:1fr}}
@media(max-width:900px){
 header.topo{flex-direction:column;align-items:flex-start;gap:12px;padding:16px 20px}
 .topo-titulo{padding-left:0;border-left:0}
 header.topo h1{font-size:25px}
 nav{padding:0 8px}
 main{padding:20px 14px 32px}
 .card{padding:20px 18px}
 .painel-analise{padding:22px 18px}
 .filters,.consulta-ncm-filtros{grid-template-columns:1fr 1fr}
 .upload{grid-template-columns:1fr}
 .acoes-analise .perigo{margin-left:0}
 h2{font-size:30px}
}
@media(max-width:560px){
 .marca-coruja{height:46px}
 .marca-assinatura{height:34px}
 .filters,.consulta-ncm-filtros{grid-template-columns:1fr}
 .grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
 .metric{padding:12px 12px 12px 15px}
 .metric .numero{font-size:27px}
 .aliquota-item{grid-template-columns:56px 1fr}
 .aliquota-item .aliquota-descricao{grid-column:1 / -1}
 .r-par{grid-template-columns:1fr}
 .r-dir{justify-content:flex-start;flex-wrap:wrap}
 .r-cab{flex-direction:column}
 .pend-topo{flex-direction:column}
 .pend-ncm{text-align:left}
}
@media (prefers-reduced-motion:reduce){.tela.active{animation:none}}

/* ---------- Impress\xE3o ---------- */
@media print{
 header,nav,.barra,.filters,button,.nao-imprimir,.upload,.nota-analise,.rodape{display:none!important}
 .cabecalho-impressao{display:flex!important;align-items:center;gap:18px;padding:0 0 12px;margin-bottom:16px;border-bottom:1.5px solid #AC9368}
 .cabecalho-impressao img{height:44px;width:auto}
 .cabecalho-impressao strong{display:block;font-family:var(--serif);font-size:20px;color:#2C4233}
 .cabecalho-impressao span{font-size:11px;color:#555}
 body{background:#fff}
 .tela{display:none!important}.tela.active{display:block!important;animation:none}
 main{padding:0;max-width:none}
 .card{box-shadow:none}
 .item-res{box-shadow:none}
}
</style>
</head>
<body>
<header class="topo">
<div class="marca">
<img class="marca-coruja" src="marca/coruja-negativa.png" alt="" width="48" height="56">
<img class="marca-assinatura" src="marca/assinatura-negativa.png" alt="Sabores Estrat\xE9gicos" width="172" height="42">
</div>
<div class="topo-titulo">
<h1>Conformidade IBS/CBS</h1>
<p>An\xE1lise tribut\xE1ria, valida\xE7\xE3o e acompanhamento de conformidade</p>
</div>
</header>
<div class="cabecalho-impressao" aria-hidden="true">
<img id="marcaPositiva" src="marca/marca-positiva.png" alt="" width="545" height="168">
<div><strong>Conformidade IBS/CBS</strong><span>An\xE1lise tribut\xE1ria, valida\xE7\xE3o e acompanhamento de conformidade</span></div>
</div>

<nav aria-label="Se\xE7\xF5es do sistema">
<button class="active" onclick="abrirTela('importar',this)"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>An\xE1lise</button>
<button onclick="abrirTela('dashboard',this)"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>Dashboard</button>
<button onclick="abrirTela('resultados',this)"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>Resultados</button>
<button onclick="abrirTela('pendentes',this)"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Pend\xEAncias</button>
<button onclick="abrirTela('relatorio-final',this)"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>Relat\xF3rio Final</button>
<button onclick="abrirTela('consulta-ncm',this)"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>Consulta Tribut\xE1ria por NCM</button>
</nav>
<div class="aviso aviso-validacoes" id="avisoValidacoes" role="status" hidden><span id="textoAvisoValidacoes"></span><button class="secondary" id="btnAtualizarResultados" onclick="atualizarResultadosAgora()">Atualizar resultados agora</button></div>

<main>

<section id="importar" class="tela active">
<div class="card painel-analise">
<h2>An\xE1lise atual</h2>
<p id="resumoAnalise" class="estado-analise">Carregando...</p>
<div class="upload">
<label class="upload-zona" id="zonaUpload">
<input id="arquivos" type="file" multiple accept=".xml,.zip">
<span class="upload-icone"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></svg></span>
<span class="upload-titulo">Arraste os XMLs aqui ou clique para escolher</span>
<span class="upload-detalhe">Arquivos .xml ou .zip \xB7 Limite m\xE1ximo: 10.000 arquivos XML por envio.</span>
<span class="upload-selecao" id="selecaoArquivos">Nenhum arquivo escolhido</span>
</label>
<ol class="upload-passos">
<li><span>Escolha os arquivos.</span></li>
<li><span><strong>"Adicionar XMLs"</strong> coloca os arquivos na an\xE1lise atual, sem processar.</span></li>
<li><span><strong>"Processar an\xE1lise"</strong> analisa todos os XMLs da an\xE1lise atual.</span></li>
</ol>
</div>
<div class="barra acoes-analise">
<button class="secondary" id="btnAdicionar" onclick="adicionarXmls()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>Adicionar XMLs</button>
<button class="primary" id="btnProcessar" onclick="processarAnalise()" disabled>\u25B6 Processar an\xE1lise</button>
<button class="perigo" id="btnNovaAnalise" onclick="iniciarNovaAnalise()">Nova an\xE1lise (limpar dados)</button>
</div>
<p class="small nota-analise">"Nova an\xE1lise" apaga XMLs, resultados, pend\xEAncias e respostas da an\xE1lise atual.</p>
<div id="status"></div>
<div id="resumoProcessamento"></div>
<div class="analise-complementos">
<div class="card aliquotas-analise">
<h3>Al\xEDquotas utilizadas</h3>
<div class="aliquota-item">
<strong>CBS</strong>
<div class="aliquota-percentual">0,90%</div>
<div class="aliquota-descricao">LC 214/2025, per\xEDodo de teste de 2026: CBS de 0,9%, compens\xE1vel com PIS/Cofins; recolhimento dispensado nos termos do art. 348, \xA7 1\xBA, se cumpridas as obriga\xE7\xF5es acess\xF3rias.</div>
</div>
<div class="aliquota-item">
<strong>IBS</strong>
<div class="aliquota-percentual">0,10%</div>
<div class="aliquota-descricao">LC 214/2025, per\xEDodo de teste de 2026: IBS de 0,1%.</div>
</div>
</div>
<div class="card aliquotas-analise" id="beneficioAtividade">
<h3>Benef\xEDcio ou redu\xE7\xE3o de al\xEDquota por atividade</h3>
<div id="beneficioAtividadeConteudo" class="small">Carregando...</div>
</div>
</div>
</div>
</section>

<section id="dashboard" class="tela">
<h2>Dashboard</h2>
<div class="aviso" id="avisoDashboard" hidden></div>

<div class="dashboard-resumo">
  <div class="card destaque">
    <h3>Situa\xE7\xE3o da empresa</h3>
    <div id="situacaoResumo"></div>
  </div>

  <div class="card destaque">
    <h3>Economia potencial</h3>
    <div id="economiaResumo"></div>
  </div>
</div>

<div class="dashboard-grid">

  <div class="card chart-card">
    <h3>Resultados apurados</h3>
    <p class="subtitulo">Quantidade de itens por situa\xE7\xE3o</p>
    <div class="chart-container"><canvas id="chartResultados"></canvas></div><div id="valoresResultados" class="valores-grafico"></div>
  </div>

  <div class="card chart-card">
    <h3>Conformidade</h3>
    <p class="subtitulo">Distribui\xE7\xE3o dos itens avaliados</p>
    <div class="chart-container"><canvas id="chartConformidade"></canvas></div><div id="valoresConformidade" class="valores-grafico"></div>
  </div>

</div>

<div class="card chart-card">
  <h3>Produtos e benef\xEDcios fiscais</h3>
  <p class="subtitulo">
    Identifica\xE7\xE3o de benef\xEDcios, redu\xE7\xF5es previstas e itens sem benef\xEDcio identificado
  </p>

  <div class="chart-container chart-container-wide">
    <canvas id="chartProdutos"></canvas>
  </div>

  <div id="detalhesBeneficios"></div>
</div>

<div class="card">
  <h3>Resultados por NCM</h3>
  <div id="tabelaNcm"></div>
</div>


<div class="card">
  <h3>Al\xEDquotas utilizadas</h3>
  <div id="aliquotas"></div>
</div>

</section>

<section id="resultados" class="tela">
<div class="card">
<h2>Resultados</h2>
<div class="aviso" id="avisoResultados" hidden></div>
<div class="filters">
<input id="busca" placeholder="Produto, cProd ou NCM" oninput="renderResultados()">
<select id="filtroResultado" onchange="renderResultados()">
<option value="">Todos os resultados</option>
<option value="CORRETO">Correto</option>
<option value="INCORRETO_ECONOMIA">Corretos c/ recal impostos</option>
<option value="INCORRETO_NCM">Incorreto - ajustar NCM</option>
<option value="REQUER_VALIDACAO">Precisa validar</option>
<option value="NAO_OBRIGATORIO">N\xE3o obrigat\xF3rio</option>
</select>
<input id="filtroClass" placeholder="cClassTrib" oninput="renderResultados()">
<input id="filtroCst" placeholder="CST" oninput="renderResultados()">
</div>
<div class="barra"><button class="secondary" onclick="window.print()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/></svg>Imprimir</button><button class="secondary" onclick="exportarResultados()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>Exportar CSV</button><span id="contagemResultados" class="small"></span></div>
<div id="listaResultados" class="itens-resultado"></div>
</div>
</section>

<section id="pendentes" class="tela">
<div class="card">
<h2>Pend\xEAncias da an\xE1lise atual</h2>
<div class="barra"><div class="segmentado" role="group" aria-label="Pend\xEAncias">
<button class="secondary relatorio-final-selecionado" id="btnPendenciasIbsCbs" onclick="mostrarPendencias('ibscbs')">IBS/CBS</button>
<button class="secondary" id="btnPendenciasIS" onclick="mostrarPendencias('is')">IMPOSTO SELETIVO</button>
</div></div>
<div id="pendenciasIbsCbs">
<div class="aviso" id="avisoPendencias" hidden></div>
<div class="filters">
<input id="buscaPendenteProduto" placeholder="Pesquisar por produto">
<input id="buscaPendenteCprod" placeholder="Pesquisar por cProd">
<input id="buscaPendenteNcm" placeholder="Pesquisar por NCM">
</div>
<div class="barra"><button class="secondary" onclick="window.print()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/></svg>Imprimir</button><button class="secondary" onclick="exportarPendencias()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>Exportar CSV</button><span id="contagemPendencias" class="small"></span></div>
<div id="listaPendentes"></div>
</div>
<div id="pendenciasIS" hidden>
<div class="filters">
<input id="buscaPendISProduto" placeholder="Pesquisar por produto" oninput="renderPendenciasIS()">
<input id="buscaPendISCprod" placeholder="Pesquisar por cProd" oninput="renderPendenciasIS()">
<input id="buscaPendISNcm" placeholder="Pesquisar por NCM" oninput="renderPendenciasIS()">
</div>
<div class="barra"><button class="secondary" onclick="exportarPendenciasIS()">Exportar CSV</button><span id="contagemPendenciasIS" class="small"></span></div>
<div id="listaPendenciasIS"></div>
</div>
</div>
</section>

<section id="relatorio-final" class="tela">
<div class="card">
<h2>Relat\xF3rio Final</h2>
<p class="small">Relat\xF3rio operacional dos produtos que precisam ter o cadastro IBS/CBS ajustado.</p>

<div class="barra">
<div class="segmentado" role="group" aria-label="Relat\xF3rio">
<button class="secondary relatorio-final-selecionado" id="btnRelatorioComValidacao" onclick="selecionarModoRelatorio('com')">CORRETOS VALIDADOS</button>
<button class="secondary" id="btnRelatorioSemValidacao" onclick="selecionarModoRelatorio('sem')">SEM VALIDA\xC7\xC3O</button>
<button class="secondary" id="btnRelatorioRecal" onclick="selecionarModoRelatorio('recal')">CORRETOS C/ RECAL IMPOSTOS</button>
<button class="secondary" id="btnRelatorioCorretos" onclick="selecionarModoRelatorio('corretos')">CORRETOS</button>
<button class="secondary" id="btnRelatorioIS" onclick="selecionarModoRelatorio('is')">IMPOSTO SELETIVO</button>
</div>
<span id="contagemRelatorioFinal" class="small"></span>
</div>

<div class="barra">
<button class="secondary" onclick="exportarRelatorioFinal('csv')"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>Exportar CSV</button>
<button class="secondary" onclick="exportarRelatorioFinal('excel')"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>Exportar Excel</button>
<button class="secondary" onclick="exportarRelatorioFinal('pdf')"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>Exportar PDF</button>
</div>

<div id="explicacaoRelatorioFinal" class="aviso"></div>

<div class="tabela-wrap">
<table>
<thead id="cabecalhoRelatorioFinal">
<tr>
<th>C\xF3digo produto</th>
<th>Descri\xE7\xE3o</th>
<th>NCM</th>
<th>cClassTrib a utilizar</th>
<th>CST a utilizar</th>
<th>Al\xEDquota de registro IBS/CBS</th>
<th>Instru\xE7\xE3o</th>
</tr>
</thead>
<tbody id="listaRelatorioFinal"></tbody>
</table>
</div>

</div>
</section>

<section id="consulta-ncm" class="tela">
<div class="card">
<h2>Consulta Tribut\xE1ria por NCM</h2>
<p class="small">Consulta preventiva, sem XML: o NCM informado passa pelo mesmo motor tribut\xE1rio, pelas mesmas regras e pela mesma auditoria usados na an\xE1lise dos XMLs. Nada \xE9 gravado e a an\xE1lise atual n\xE3o \xE9 alterada.</p>
<div class="filters consulta-ncm-filtros">
<input id="consultaNcmEntrada" placeholder="NCM (ex.: 1901.20.90 ou 19012090)" onkeydown="if(event.key==='Enter')consultarNcmTela()">
<select id="consultaNcmModelo" aria-label="Modelo do documento">
<option value="65">NFC-e (modelo 65)</option>
<option value="55">NF-e (modelo 55)</option>
</select>
<select id="consultaNcmNatureza" aria-label="Natureza do produto">
<option value="">Natureza: conforme cadastro da empresa</option>
<option value="mercadoria">Mercadoria</option>
<option value="preparado_no_local">Preparado e servido no local (bar/restaurante)</option>
<option value="bebida_alcoolica">Bebida alco\xF3lica</option>
<option value="servico">Servi\xE7o</option>
</select>
<button class="primary" id="btnConsultarNcm" onclick="consultarNcmTela()">CONSULTAR NCM</button>
</div>
<div id="consultaNcmResultado"></div>
</div>
</section>
</main>
<footer class="rodape"><img src="marca/coruja-positiva.png" alt="" width="20" height="24"><strong>Sabores Estrat\xE9gicos</strong><span class="rodape-sep"></span><span>Conformidade IBS/CBS</span></footer>

<script>
if(window.Chart&&window.ChartDataLabels) Chart.register(ChartDataLabels);
// Gr\xE1ficos na identidade da marca (s\xF3 apar\xEAncia)
try{
 if(window.Chart){
   Chart.defaults.font.family=getComputedStyle(document.body).fontFamily;
   Chart.defaults.color='#46544B';
   Chart.defaults.borderColor='#ECE6DA';
   Chart.defaults.elements.bar.borderRadius=6;
   Chart.defaults.elements.arc.borderColor='#FFFDF9';
   Chart.defaults.elements.arc.borderWidth=2;
   Chart.defaults.datasets.bar.maxBarThickness=150;
   Chart.defaults.plugins.legend.labels.usePointStyle=true;
   Object.assign(Chart.defaults.plugins.tooltip,{backgroundColor:'#1B2B21',titleColor:'#F4EEE2',bodyColor:'#F4EEE2',padding:10,cornerRadius:8});
 }
}catch(e){ console.warn('Estilo padr\xE3o dos gr\xE1ficos n\xE3o aplicado:',e); }
let resultados=[];
let pendentes=[];
let respostas=[];
let alertasUI={disponivel:false,porItemHtml:{},porCartaoHtml:{},painelHtml:''};
let pendentesFiltradas=[];
let resultadosFiltrados=[];
let regrasUI={};
let modoRelatorioFinal='com';
let linhasRelatorioFinal=[];
const COLUNAS_RELATORIO_FINAL=['C\xF3digo produto','Descri\xE7\xE3o','NCM','cClassTrib a utilizar','CST a utilizar','Al\xEDquota de registro IBS/CBS','Instru\xE7\xE3o'];
const COLUNAS_RELATORIO_RISCO=['cProd','Descri\xE7\xE3o','NCM informado','NCM adequado / poss\xEDvel enquadramento','CST atual','CST esperado','cClassTrib atual','cClassTrib esperado','Redu\xE7\xE3o IBS','Redu\xE7\xE3o CBS','Al\xEDquota aplic\xE1vel','Al\xEDquota atualmente considerada','Diferen\xE7a (R$)','Motivo do INCORRETO \u2014 risco','Fundamento legal','Fonte','Instru\xE7\xE3o'];
/** Rec\xE1lculo e Corretos: as colunas do relat\xF3rio final mais o resultado e o impacto do rec\xE1lculo. */
const COLUNAS_RELATORIO_IMPACTO=COLUNAS_RELATORIO_FINAL.concat(['Resultado','Economia (R$)','Valor a pagar (R$)']);
/** Imposto Seletivo: mesmo formato do relat\xF3rio final, s\xF3 com os produtos validados em Pend\xEAncias \u2192 Imposto Seletivo. */
const COLUNAS_RELATORIO_IS=['C\xF3digo produto','Descri\xE7\xE3o','NCM','Imposto Seletivo','Al\xEDquota de registro IS','Valor do IS (R$)','Instru\xE7\xE3o'];
const colunasRelatorio=()=>modoRelatorioFinal==='is'?COLUNAS_RELATORIO_IS:modoRelatorioFinal==='corretos'?COLUNAS_RELATORIO_IMPACTO:COLUNAS_RELATORIO_FINAL;
/** Norma que define o enquadramento (e a al\xEDquota) a utilizar: regra aplicada, regime do art. 275 ou regra geral. */
function normaDoEnquadramento(v){
 if(v.regraAplicada&&/art\\. 275/.test(v.regraAplicada)) return 'LC 214/2025, art. 275 (regime espec\xEDfico de bares e restaurantes: redu\xE7\xE3o de 40%)';
 const g=v.regraAplicada&&regrasUI[v.regraAplicada+'|'+v.ncm];
 if(g){
   const partes=['LC 214/2025'];
   if(g.fundamentoLegal) partes.push(g.fundamentoLegal.replace(/^Art\\./,'art.'));
   if(g.anexo) partes.push('Anexo '+g.anexo+(g.item?', item '+g.item:''));
   return partes.join(', ')+(g.rotulo?' ('+g.rotulo+')':'');
 }
 if(v.esperado&&v.esperado.cClassTrib==='000001') return 'LC 214/2025, art. 4\xBA (tributa\xE7\xE3o integral: nenhuma regra de redu\xE7\xE3o aplic\xE1vel ao NCM)';
 return 'Norma n\xE3o identificada na base';
}
/** Linha dos Corretos validados e dos Corretos c/ recal impostos: enquadramento a utilizar e instru\xE7\xE3o com a norma. */
function linhaCorretoComNorma(itens){
 const v=itens[0], cst=v.esperado?.cst||'', cClassTrib=v.esperado?.cClassTrib||'', reducao=reducaoRelatorioFinal(v);
 const integral=cClassTrib==='000001';
 const acao=!ehRecalculo(v)?'Cadastro correto: manter o CST '+cst+' e o cClassTrib '+cClassTrib+'.'
  :integral?'Alterar o cadastro do produto para o CST '+cst+' e cClassTrib '+cClassTrib+' (tributa\xE7\xE3o integral, sem redu\xE7\xE3o de IBS/CBS).'
  :instrucaoRelatorioFinal(cst,cClassTrib,reducao,true);
 return [v.cProd,v.produto,v.ncm||'',cClassTrib,cst,reducao,acao+'\\nNorma: '+normaDoEnquadramento(v)];
}
const TITULO_RELATORIO={com:'CORRETOS VALIDADOS',sem:'SEM VALIDA\xC7\xC3O',recal:'CORRETOS C/ RECAL IMPOSTOS',corretos:'CORRETOS',is:'IMPOSTO SELETIVO'};
/** Corretos com rec\xE1lculo: enquadramento determinado e imposto recalculado (economia ou valor a pagar). */
const ehRecalculo=v=>(v.estado==='INCORRETO_ECONOMIA'||v.estado==='INCORRETO_RISCO')&&!!v.esperado;
/** Uma linha por produto: enquadramento a utilizar, instru\xE7\xE3o, resultado e impacto somado dos itens. */
function linhaRelatorioImpacto(itens){
 const v=itens[0], cst=v.esperado?.cst||'', cClassTrib=v.esperado?.cClassTrib||'';
 const reducao=reducaoRelatorioFinal(v);
 const recal=ehRecalculo(v);
 const instrucao=recal?instrucaoRelatorioFinal(cst,cClassTrib,reducao,true):'Cadastro correto: manter o CST '+cst+' e o cClassTrib '+cClassTrib+'.';
 // Rec\xE1lculo: economia positiva = imposto pago a mais; negativa = valor a pagar
 const economia=itens.reduce((s,x)=>s+Math.max(0,x.economiaPotencial||0),0);
 const aPagar=itens.reduce((s,x)=>s+Math.max(0,-(x.economiaPotencial||0)),0);
 const num=n=>n?n.toFixed(2).replace('.',','):'0,00';
 return [v.cProd,v.produto,v.ncm||'',cClassTrib,cst,reducao,instrucao,recal?'CORRETO C/ RECAL IMPOSTOS':'CORRETO',num(economia),num(aPagar)];
}
/** Al\xEDquota IBS + CBS vigente no item (as mesmas usadas pelo motor), com a redu\xE7\xE3o. */
function aliquotaComReducao(v,red){
 const t=(v.aliquotaUsada||[]).reduce((s,a)=>s+a.aliquota,0);
 if(!(v.aliquotaUsada||[]).length||red==null) return '-';
 return (t*(1-red)*100).toLocaleString('pt-BR',{maximumFractionDigits:3})+'% ('+(v.aliquotaUsada||[]).map(a=>a.tributo+' '+(a.aliquota*100).toLocaleString('pt-BR',{maximumFractionDigits:3})+'%').join(' + ')+(red?' com redu\xE7\xE3o de '+textoPct(red):'')+')';
}
/** Uma linha por produto em INCORRETO \u2014 risco, s\xF3 com dados do veredito e da base. */
function linhaRelatorioRisco(v,itens){
 const inf=v.informado||{}, esp=v.esperado;
 const ausente=inf.cst==null&&inf.cClassTrib==null;
 const regraEsp=v.regraAplicada&&regrasUI[v.regraAplicada+'|'+v.ncm];
 const cands=(v.regrasCandidatas||[]).map(id=>regrasUI[id+'|'+v.ncm]).filter(Boolean);
 const red=esp?(regraEsp?regraEsp.reducao:(v.regraAplicada&&/art. 275/.test(v.regraAplicada)?0.4:0)):null;
 const reducoes=esp?textoPct(red):(cands.length?'depende da valida\xE7\xE3o: '+[...new Set(cands.map(g=>textoPct(g.reducao)))].join(' ou ')+' (ou 0% sem benef\xEDcio)':'-');
 const dif=itens.reduce((s,x)=>s+(x.exposicao||0),0);
 const enquadramento=v.motivo.includes('A descri\xE7\xE3o indica')
  ?'REQUER VALIDA\xC7\xC3O do NCM: '+v.motivo.slice(v.motivo.indexOf('A descri\xE7\xE3o indica')).split('(TIPI')[0].trim()
  :esp?'NCM '+v.ncm+' mantido; enquadramento '+esp.cst+'/'+esp.cClassTrib:'REQUER VALIDA\xC7\xC3O: '+(cands.length?cands.map(g=>g.cst+'/'+g.cClassTrib+' (Anexo '+g.anexo+', item '+g.item+')').join(' \xB7 '):'sem regra candidata');
 const fundamento=[ausente?'Ato Conjunto RFB/CGIBS n\xBA 4/2026 (grupo obrigat\xF3rio desde 03/08/2026)':'',
  regraEsp?(regraEsp.fundamentoLegal||'')+' \u2014 '+(regraEsp.rotulo||''):esp?'LC 214/2025 \u2014 regra geral (nenhuma regra de benef\xEDcio aplic\xE1vel ao NCM)':cands.map(g=>g.fundamentoLegal+' ('+g.rotulo+')').join(' \xB7 ')].filter(Boolean).join('; ');
 const fonte=[...new Set([regraEsp&&regraEsp.fonte,...(esp?[]:cands.map(g=>g.fonte)),'LC 214/2025 (Planalto)','Portal da Conformidade F\xE1cil (SVRS)'].filter(Boolean))].join('; ');
 const instrucao=ausente
  ?(esp?'Informar o grupo IBS/CBS no cadastro do produto com CST '+esp.cst+' e cClassTrib '+esp.cClassTrib+'.':'Responder SIM/N\xC3O em Pend\xEAncias; depois informar o grupo IBS/CBS no cadastro com o enquadramento confirmado (sem benef\xEDcio: CST 000 e cClassTrib 000001).')
  :(esp?'Alterar o cadastro do produto para o CST '+esp.cst+' e cClassTrib '+esp.cClassTrib+'.':'Validar o enquadramento em Pend\xEAncias antes de alterar o cadastro.');
 return [v.cProd,v.produto,v.ncm||'',enquadramento,inf.cst??'ausente',esp?esp.cst:'REQUER VALIDA\xC7\xC3O',inf.cClassTrib??'ausente',esp?esp.cClassTrib:'REQUER VALIDA\xC7\xC3O',
  reducoes,reducoes,esp?aliquotaComReducao(v,red):'depende da valida\xE7\xE3o',ausente?'n\xE3o informada no XML (grupo IBS/CBS ausente)':(inf.cClassTrib==='000001'?aliquotaComReducao(v,0):((cands.find(g=>g.cClassTrib===inf.cClassTrib)||{}).reducao!=null?aliquotaComReducao(v,cands.find(g=>g.cClassTrib===inf.cClassTrib).reducao):'cClassTrib '+inf.cClassTrib+' (redu\xE7\xE3o sem regra na base para o NCM)')),
  dif?formatarNumero(dif)+(esp?'':' (m\xEDnimo)'):'-',v.motivo,fundamento,fonte,instrucao];
}
const ROTULO_ESTADO={CORRETO:'CORRETO',INCORRETO_ECONOMIA:'CORRETOS C/ RECAL IMPOSTOS',INCORRETO_RISCO:'INCORRETO \u2014 risco',INCORRETO_NCM:'INCORRETO \u2014 AJUSTAR NCM',REQUER_VALIDACAO:'PRECISA VALIDAR',NAO_OBRIGATORIO:'N\xC3O OBRIGAT\xD3RIO',INDETERMINADO:'INDETERMINADO'};

async function abrirTela(id,botao){
 document.querySelectorAll('.tela').forEach(x=>x.classList.remove('active'));
 document.getElementById(id).classList.add('active');
 document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
 botao.classList.add('active');
 // Escolhas feitas em Pend\xEAncias entram nos resultados antes de mostr\xE1-los (o relat\xF3rio faz o mesmo)
 if((id==='importar'||id==='dashboard'||id==='resultados')&&(resultadosDesatualizadosUI||validacoesSalvando())){
   try{ await garantirResultadosAtualizados(); }catch(e){ /* o aviso no topo mostra o erro */ }
   if(!document.getElementById(id).classList.contains('active')) return;
 }
 if(id==='importar') carregarAnalise();
 if(id==='dashboard'){ carregarDashboard(); carregarAlertas(); }
 if(id==='resultados') carregarResultados();
 if(id==='pendentes'){ carregarPendentes(); carregarPendenciasIS(); }
 if(id==='relatorio-final') carregarRelatorioFinal();
}

function escaparRelatorio(v){
 return esc(v==null?'':String(v));
}

function reducaoRelatorioFinal(v){
 if(v&&v.esperado&&v.esperado.cClassTrib==='000001') return '0% (tributa\xE7\xE3o integral)';
 const r=v&&v.reducaoExibicao;
 if(!r) return 'N\xE3o determinada';

 if(r.situacao==='regime_especifico'&&r.regimeEspecifico){
   return pct(r.regimeEspecifico.valor);
 }

 const opcoes=(r.opcoes||[]).filter(o=>o&&o.valor!=null&&o.evidencia!=='nao_determinada');
 const valores=[...new Set(opcoes.map(o=>o.valor))];

 if(valores.length===1) return textoReducao(valores[0]);
 if(valores.length>1) return valores.map(textoReducao).join(' \xB7 ');

 return 'N\xE3o determinada';
}

function instrucaoRelatorioFinal(cst,cClassTrib,reducao,validado){
 if(!cst||!cClassTrib){
   return validado
     ? 'N\xE3o foi poss\xEDvel determinar o CST e o cClassTrib com seguran\xE7a.'
     : 'Validar o enquadramento antes de alterar o cadastro do produto.';
 }

 const red=reducao&&reducao!=='N\xE3o determinada'
   ? ' \u2014 '+reducao+' IBS/CBS'
   : '';

 return 'Alterar o cadastro do produto para o CST '+cst+' e cClassTrib '+cClassTrib+red+'.';
}

function selecionarModoRelatorio(modo){
 modoRelatorioFinal=TITULO_RELATORIO[modo]?modo:'com';
 const botoes={com:'btnRelatorioComValidacao',sem:'btnRelatorioSemValidacao',recal:'btnRelatorioRecal',corretos:'btnRelatorioCorretos',is:'btnRelatorioIS'};
 for(const [m,id] of Object.entries(botoes)){
   const b=document.getElementById(id);
   if(b) b.classList.toggle('relatorio-final-selecionado',modoRelatorioFinal===m);
 }
 carregarRelatorioFinal();
}

async function carregarRelatorioFinal(){
 const corpo=document.getElementById('listaRelatorioFinal');
 const contador=document.getElementById('contagemRelatorioFinal');
 const explicacao=document.getElementById('explicacaoRelatorioFinal');

 if(!corpo) return;

 const modo=modoRelatorioFinal;
 const ncol=colunasRelatorio().length;
 linhasRelatorioFinal=[];
 const cab=document.getElementById('cabecalhoRelatorioFinal');
 const tabelaRel=corpo.closest('table');
 if(tabelaRel) tabelaRel.classList.toggle('relatorio-centralizado',modo==='com'||modo==='recal');
 if(cab) cab.innerHTML='<tr>'+colunasRelatorio().map(c=>'<th>'+escaparRelatorio(c)+'</th>').join('')+'</tr>';
 corpo.innerHTML='<tr><td colspan="'+ncol+'">Carregando relat\xF3rio...</td></tr>';
 // A contagem do relat\xF3rio anterior n\xE3o fica na tela enquanto este carrega
 if(contador) contador.textContent='';
 const t0=Date.now();
 // As escolhas feitas em Pend\xEAncias precisam estar nos resultados: atualiza antes de montar o relat\xF3rio
 if(resultadosDesatualizadosUI||validacoesSalvando()){
   corpo.innerHTML='<tr><td colspan="'+ncol+'">Atualizando os resultados com as valida\xE7\xF5es registradas antes de gerar o relat\xF3rio. Com muitos XMLs isso pode levar cerca de 1 minuto...</td></tr>';
   try{ await garantirResultadosAtualizados(); }
   catch(e){
     console.error('[relatorio] atualiza\xE7\xE3o dos resultados falhou',e);
     if(modo!==modoRelatorioFinal) return;
     corpo.innerHTML='<tr><td colspan="'+ncol+'">O relat\xF3rio n\xE3o foi gerado: n\xE3o foi poss\xEDvel atualizar os resultados com as valida\xE7\xF5es ('+escaparRelatorio(e.message)+'). Use "Atualizar resultados agora" no aviso acima ou abra o relat\xF3rio de novo.</td></tr>';
     contador.textContent='';
     return;
   }
   if(modo!==modoRelatorioFinal) return;
   corpo.innerHTML='<tr><td colspan="'+ncol+'">Carregando relat\xF3rio...</td></tr>';
 }

 const renderizar=(linhas,vazio)=>{
   if(modo!==modoRelatorioFinal) return;
   linhasRelatorioFinal=linhas;
   console.info('[relatorio] '+modo+': '+linhas.length+' produto(s) em '+(Date.now()-t0)+' ms');
   corpo.innerHTML=linhas.length
     ? linhas.map(l=>'<tr>'+l.map(c=>'<td>'+escaparRelatorio(c)+'</td>').join('')+'</tr>').join('')
     : '<tr><td colspan="'+ncol+'">'+vazio+'</td></tr>';
   contador.textContent=linhas.length+' produto(s)';
 };

 try{
   if(modo==='is'){
     await carregarDadosIS();
     if(modo!==modoRelatorioFinal) return;
     explicacao.textContent='Imposto Seletivo: produtos com o Imposto Seletivo validado em Pend\xEAncias \u2192 Imposto Seletivo. O IS \xE9 um tributo separado: n\xE3o altera o CST, o cClassTrib nem a al\xEDquota de IBS/CBS.';
     renderizar(isProdutos.filter(validadoIS).map(linhaRelatorioIS),'Nenhum produto com o Imposto Seletivo validado. Valide em Pend\xEAncias \u2192 Imposto Seletivo.');
     return;
   }
   if(modo==='recal'||modo==='corretos'||modo==='com'){
     if(!Object.keys(regrasUI).length){ try{ regrasUI=await (await fetch('/api/regras')).json(); }catch(e){ regrasUI={}; } }
     const resultadosApi=await buscarResultados();
     let respostas=[];
     if(modo==='com'){
       const rr=await fetch('/api/respostas');
       respostas=await rr.json();
       if(!rr.ok) throw new Error(respostas.detalhe||respostas.erro||'as respostas de valida\xE7\xE3o n\xE3o puderam ser lidas');
     }
     const validado=new Set((Array.isArray(respostas)?respostas:[]).map(r=>r.ncm+'|'+r.cProd));
     const incluir=v=>{
       if(modo==='recal') return ehRecalculo(v);
       const correto=v.estado==='CORRETO'||ehRecalculo(v);
       if(modo==='corretos') return correto;
       // Corretos validados: produto com resposta de valida\xE7\xE3o que, ap\xF3s o reprocessamento, voltou como correto
       return correto&&(validado.has(v.ncm+'|'+v.cProd)||validado.has(v.ncm+'|'+v.produto));
     };
     const porProduto=new Map();
     resultadosApi.filter(incluir).forEach(v=>{
       const k=v.cProd||v.ncm+'|'+v.produto;
       if(!porProduto.has(k)) porProduto.set(k,[]);
       porProduto.get(k).push(v);
     });
     if(modo==='com'){
       explicacao.textContent='Corretos validados: produtos que passaram pela valida\xE7\xE3o e, ap\xF3s o reprocessamento, retornaram como CORRETOS (cadastro j\xE1 correto ou correto com rec\xE1lculo de impostos).';
       renderizar([...porProduto.values()].map(linhaCorretoComNorma),'Nenhum produto validado retornou como correto.');
       return;
     }
     explicacao.textContent=modo==='recal'
       ?'Corretos c/ recal impostos: produtos com enquadramento determinado cujo imposto foi recalculado. A instru\xE7\xE3o traz o cadastro a utilizar e a norma que define a al\xEDquota.'
       :'Corretos: todos os produtos corretos, somando os que j\xE1 estavam corretos e os corretos com rec\xE1lculo de impostos.';
     renderizar([...porProduto.values()].map(modo==='recal'?linhaCorretoComNorma:linhaRelatorioImpacto),modo==='recal'?'Nenhum produto correto com rec\xE1lculo de impostos.':'Nenhum produto correto.');
     return;
   }

   const respFila=await fetch('/api/fila-validacao');
   const fila=await respFila.json();
   if(!respFila.ok) throw new Error(fila.detalhe||fila.erro||'a lista de pend\xEAncias n\xE3o p\xF4de ser lida');
   const mapa=new Map();

   if(Array.isArray(fila)){
     fila.forEach(p=>{
       // Produto j\xE1 validado nesta an\xE1lise n\xE3o est\xE1 mais "sem valida\xE7\xE3o"
       if(!p.cProd||p.respondida) return;
       if(!mapa.has(p.cProd)) mapa.set(p.cProd,p);
     });
   }

   explicacao.textContent='Sem valida\xE7\xE3o: produtos pendentes de enquadramento. A regra candidata aparece s\xF3 como refer\xEAncia: nenhum cadastro deve ser alterado antes da valida\xE7\xE3o em Pend\xEAncias. Regras que o NCM encontra, mas que n\xE3o se aplicam \xE0 descri\xE7\xE3o do produto, ficam de fora.';

   const linhas=[...mapa.values()].map(p=>{
     // Regra rejeitada pelo motor para este produto (descri\xE7\xE3o legal n\xE3o atendida) n\xE3o \xE9 candidata a nada
     const rejeitadas=new Set((p.regrasNaoAplicaveis||[]).map(x=>x.regraId));
     const regras=(p.regrasDetalhe||[]).filter(r=>r&&!rejeitadas.has(r.id));

     const csts=[...new Set(regras.map(r=>r.cst).filter(Boolean))];
     const classes=[...new Set(regras.map(r=>r.cClassTrib).filter(Boolean))];
     const reducoes=[...new Set(regras
       .map(r=>r.reducao&&r.reducao.valor!=null&&r.reducao.evidencia!=='nao_determinada'
         ? textoReducao(r.reducao.valor)
         : null)
       .filter(Boolean))];

     const cst=csts.length===1?csts[0]:'Depende da valida\xE7\xE3o';
     const cClassTrib=classes.length===1?classes[0]:'Depende da valida\xE7\xE3o';
     const reducao=reducoes.length===1
       ? reducoes[0]
       : reducoes.length>1
         ? reducoes.join(' \xB7 ')
         : 'N\xE3o determinada';

     const determinado=csts.length===1&&classes.length===1;
     const red=reducao&&reducao!=='N\xE3o determinada'?' \u2014 '+reducao+' IBS/CBS':'';
     const instrucao=!regras.length
       ? (rejeitadas.size
         ? 'Validar em Pend\xEAncias antes de alterar o cadastro: a regra encontrada pelo NCM n\xE3o se aplica \xE0 descri\xE7\xE3o do produto.'
         : 'Validar em Pend\xEAncias antes de alterar o cadastro: o enquadramento depende do que o produto \xE9.')
       : determinado
         ? 'Validar em Pend\xEAncias antes de alterar o cadastro (regra candidata: CST '+cst+' e cClassTrib '+cClassTrib+red+').'
         : 'Validar o enquadramento entre as regras candidatas antes de alterar o cadastro do produto.';

     return [p.cProd,p.produto,p.ncm||'',cClassTrib,cst,reducao,instrucao];
   });

   renderizar(linhas,'Nenhum produto pendente foi encontrado.');
 }catch(e){
   console.error('[relatorio] '+modo+' falhou',e);
   if(modo!==modoRelatorioFinal) return;
   corpo.innerHTML='<tr><td colspan="'+ncol+'">N\xE3o foi poss\xEDvel carregar o Relat\xF3rio Final: '+escaparRelatorio(e&&e.message?e.message:String(e))+'. Abra o relat\xF3rio de novo; se continuar, recarregue a p\xE1gina.</td></tr>';
   contador.textContent='';
 }
}

/** Marca Sabores Estrat\xE9gicos no topo do PDF (s\xF3 apar\xEAncia; se a imagem n\xE3o estiver carregada, o PDF sai sem ela). */
function marcaNoPdf(doc){
 try{
   const largura=doc.internal.pageSize.getWidth();
   doc.setDrawColor(172,147,104);
   doc.setLineWidth(0.8);
   doc.line(40,64,largura-40,64);
   const img=document.getElementById('marcaPositiva');
   if(!img||!img.complete||!img.naturalWidth) return;
   const tela=document.createElement('canvas');
   tela.width=img.naturalWidth;
   tela.height=img.naturalHeight;
   tela.getContext('2d').drawImage(img,0,0);
   const h=34, w=h*img.naturalWidth/img.naturalHeight;
   doc.addImage(tela.toDataURL('image/png'),'PNG',largura-40-w,20,w,h,'marca','FAST');
 }catch(e){ console.warn('Marca n\xE3o inclu\xEDda no PDF:',e); }
}

function exportarRelatorioFinal(formato){
 if(!linhasRelatorioFinal.length){
   alert('N\xE3o h\xE1 dados no relat\xF3rio selecionado para exportar.');
   return;
 }
 const impacto=modoRelatorioFinal==='recal'||modoRelatorioFinal==='corretos';
 const titulo='Relat\xF3rio Final \u2014 '+TITULO_RELATORIO[modoRelatorioFinal];
 const nome={com:'relatorio-final-corretos-validados',sem:'relatorio-final-sem-validacao',recal:'relatorio-final-corretos-recal-impostos',corretos:'relatorio-final-corretos',is:'relatorio-final-imposto-seletivo'}[modoRelatorioFinal];
 const colunas=colunasRelatorio();
 const tabela=[colunas].concat(linhasRelatorioFinal);

 if(formato==='csv'){
   baixar(nome+'.csv',csv(tabela));
   return;
 }

 if(formato==='excel'){
   if(typeof gerarXlsx!=='function'){ alert('N\xE3o foi poss\xEDvel carregar o gerador de Excel. Recarregue a p\xE1gina.'); return; }
   baixarArquivo(nome+'.xlsx',gerarXlsx(tabela,{aba:TITULO_RELATORIO[modoRelatorioFinal].slice(0,31),larguras:impacto?[16,45,12,16,12,22,70,26,14,16]:[16,45,12,16,12,22,70]}),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
   return;
 }

 if(formato==='pdf'){
   if(!window.jspdf||!window.jspdf.jsPDF){ alert('N\xE3o foi poss\xEDvel carregar o gerador de PDF. Recarregue a p\xE1gina.'); return; }
   // A fonte padr\xE3o do jsPDF s\xF3 cobre Latin-1; o travess\xE3o sairia corrompido.
   const latin1=c=>(c==null?'':String(c)).replace(/[\\u2013\\u2014]/g,'-');
   const doc=new window.jspdf.jsPDF({orientation:'landscape',unit:'pt',format:'a4'});
   doc.setTextColor(44,66,51);
   doc.setFontSize(14);
   doc.text(latin1(titulo),40,40);
   doc.setTextColor(90,102,95);
   doc.setFontSize(9);
   doc.text('Gerado em '+new Date().toLocaleString('pt-BR')+' - '+linhasRelatorioFinal.length+' produto(s)',40,58);
   marcaNoPdf(doc);
   const opcoesTabela={
     head:[colunas],
     body:linhasRelatorioFinal.map(l=>l.map(latin1)),
     startY:70,
     styles:{fontSize:7,cellPadding:3,overflow:'linebreak'},
     headStyles:{fillColor:[44,66,51],textColor:[251,248,241]},
     alternateRowStyles:{fillColor:[250,248,243]},
     columnStyles:impacto?{1:{cellWidth:120},6:{cellWidth:170}}:{1:{cellWidth:150},6:{cellWidth:220}},
     ...(impacto?{styles:{fontSize:7,cellPadding:3,overflow:'linebreak'}}:{})
   };
   window.jspdf.autoTable?window.jspdf.autoTable(doc,opcoesTabela):doc.autoTable(opcoesTabela);
   doc.save(nome+'.pdf');
 }
}

async function carregarAnalise(){
 carregarBeneficioAtividade();
 try{
   const d=await (await fetch('/api/analise')).json();
   let texto;
   if(!d.processados&&!d.aguardando) texto='An\xE1lise vazia. Adicione XMLs para come\xE7ar.';
   else if(d.aguardando&&!d.processada) texto=d.aguardando+' XML(s) carregado(s) \u2014 aguardando processamento.';
   else if(d.aguardando) texto=d.aguardando+' novo(s) XML(s) carregado(s) \u2014 aguardando processamento. Os resultados atuais consideram '+d.processados+' XML(s) j\xE1 processado(s).';
   else if(d.processada) texto='Processamento conclu\xEDdo. '+d.respostas+' resposta(s) registrada(s) nesta an\xE1lise.';
   else texto='A an\xE1lise ainda n\xE3o tem resultado. Clique em "Processar an\xE1lise".';
   document.getElementById('resumoAnalise').textContent=texto;
   document.getElementById('btnProcessar').disabled=!(d.processados||d.aguardando);
   const aviso=d.aguardando
     ?d.aguardando+' XML(s) carregado(s) aguardando processamento: '+(d.processada?'os dados abaixo ainda n\xE3o os incluem.':'ainda n\xE3o h\xE1 resultados.')+' Use "Processar an\xE1lise" na tela An\xE1lise.'
     :'';
   ['avisoDashboard','avisoResultados','avisoPendencias'].forEach(id=>{const el=document.getElementById(id);el.textContent=aviso;el.hidden=!aviso;});
   document.getElementById('resumoProcessamento').innerHTML=d.processada?renderResumo(d):'';
   if(!atualizacaoResultados) marcarResultadosDesatualizados(!!d.resultadosDesatualizados);
 }catch(e){
   document.getElementById('resumoAnalise').textContent='N\xE3o foi poss\xEDvel carregar a an\xE1lise atual.';
 }
}

function htmlCards(cards){
 return cards.map(x=>'<div class="metric"><div class="label">'+x[0]+'</div><div class="numero '+(x[2]||'')+'">'+x[1]+'</div></div>').join('');
}

function renderResumo(d){
 const r=d.resumo;
 const cards=[
  ['XMLs processados',r.xmls],
  ['Documentos',r.documentos],
  ['Itens avaliados',r.itens],
  ['CORRETOS',r.corretos,'CORRETO'],
  ['CORRETOS C/ RECAL IMPOSTOS',r.recalculo??0,'CORRETO'],
  ['INCORRETOS \u2014 AJUSTAR NCM',r.ncmAAjustar??0,'INCORRETO'],
  ['PRECISAM VALIDAR',r.precisamValidar,'REQUER_VALIDACAO']];
 if(r.naoObrigatorio) cards.push(['N\xE3o obrigat\xF3rios',r.naoObrigatorio]);
 if(r.indeterminado) cards.push(['Indeterminados',r.indeterminado]);
 return '<div class="grid">'+htmlCards(cards)+'</div>'+explicacaoComposicao(d.composicao,r)+
  '<h3>Demais indicadores</h3><div class="grid">'+htmlCards(cardsIndicadores(d.indicadores||{}).slice(3))+'</div>';
}

async function processarAnalise(){
 const botao=document.getElementById('btnProcessar');
 const status=document.getElementById('status');
 botao.disabled=true;
 status.textContent='Processando a an\xE1lise...';
 try{
   const r=await fetch('/api/processar',{method:'POST'});
   const d=await r.json();
   // Processamento interrompido por "Nova an\xE1lise": quem atualiza a tela \xE9 a limpeza
   if(d.interrompido) return;
   if(!r.ok) throw new Error(d.detalhe||d.erro||'Erro no processamento.');
   status.textContent='';
   await recarregarTudo();
 }catch(erro){
   status.textContent='Erro: '+erro.message;
   await carregarAnalise();
 }
}

async function recarregarTudo(){
 await carregarAlertas();
 await carregarRespostas();
 carregarAnalise();
 carregarDashboard();
 carregarResultados();
 carregarPendentes();
}

/** \xC1rea de envio: quantos arquivos foram escolhidos (s\xF3 exibi\xE7\xE3o; o envio continua lendo o pr\xF3prio campo). */
function atualizarSelecaoXml(){
 const input=document.getElementById('arquivos'), alvo=document.getElementById('selecaoArquivos');
 if(!input||!alvo) return;
 const n=input.files?input.files.length:0;
 alvo.textContent=!n?'Nenhum arquivo escolhido':n===1?'1 arquivo escolhido: '+input.files[0].name:n.toLocaleString('pt-BR')+' arquivos escolhidos';
 alvo.parentElement.classList.toggle('com-arquivos',n>0);
}
(function(){
 const zona=document.getElementById('zonaUpload'), input=document.getElementById('arquivos');
 if(!zona||!input) return;
 input.addEventListener('change',atualizarSelecaoXml);
 ['dragenter','dragover'].forEach(t=>zona.addEventListener(t,()=>zona.classList.add('arrastando')));
 ['dragleave','dragend','drop'].forEach(t=>zona.addEventListener(t,()=>zona.classList.remove('arrastando')));
})();

async function adicionarXmls(){
 const input=document.getElementById('arquivos');
 const status=document.getElementById('status');
 if(!input.files.length){
   status.textContent='Selecione pelo menos um arquivo XML.';
   return;
 }
 if(input.files.length>10000){
   status.textContent='Foram selecionados '+input.files.length.toLocaleString('pt-BR')+' arquivos. O limite m\xE1ximo \xE9 de 10.000 arquivos XML por envio.';
   return;
 }
 // Envio em lotes: cada lote \xE9 lido, enviado e gravado separadamente, com o progresso na tela.
 // Com tudo num pedido s\xF3, a tela ficava em "Carregando XMLs..." sem sinal de andamento at\xE9 o fim
 // (ou para sempre, se algo falhasse no meio).
 const arquivos=[...input.files];
 const total=arquivos.length;
 const botao=document.getElementById('btnAdicionar');
 botao.disabled=true;
 const milhar=n=>n.toLocaleString('pt-BR');
 let enviados=0;
 status.textContent='Carregando XMLs... 0 de '+milhar(total)+' (0%)';
 try{
   for(let inicio=0;inicio<total;inicio+=XMLS_POR_LOTE){
     const form=new FormData();
     for(const arquivo of arquivos.slice(inicio,inicio+XMLS_POR_LOTE)) form.append('arquivos',arquivo);
     const resposta=await fetch('/api/importar',{method:'POST',body:form});
     const dados=await resposta.json();
     // Envio interrompido por "Nova an\xE1lise": quem atualiza a tela \xE9 a limpeza
     if(dados.interrompido) return;
     if(!resposta.ok){
       const motivo=dados.detalhe||dados.erro||'Erro ao carregar os XMLs.';
       throw new Error(enviados?milhar(enviados)+' de '+milhar(total)+' XMLs foram adicionados antes da falha; os demais n\xE3o. '+motivo+' Envie os arquivos de novo (os j\xE1 adicionados s\xE3o substitu\xEDdos, sem duplicar).':motivo);
     }
     enviados+=dados.adicionados;
     status.textContent='Carregando XMLs... '+milhar(enviados)+' de '+milhar(total)+' ('+Math.floor(enviados*100/total)+'%)';
   }
   status.textContent=enviados+' XML(s) adicionado(s) \xE0 an\xE1lise atual, ainda n\xE3o processado(s).';
   input.value='';
   atualizarSelecaoXml();
   await carregarAnalise();
 }catch(erro){
   status.textContent='Erro: '+erro.message;
   await carregarAnalise();
 }finally{
   botao.disabled=false;
 }
}
/** XMLs por pedido de "Adicionar XMLs" (o limite por sele\xE7\xE3o continua 10.000). */
const XMLS_POR_LOTE=500;

let limpandoAnalise=false;
async function iniciarNovaAnalise(){
 if(limpandoAnalise) return;
 if(!confirm('Iniciar uma nova an\xE1lise? XMLs, resultados, pend\xEAncias e respostas da an\xE1lise atual ser\xE3o apagados.')) return;
 const status=document.getElementById('status');
 const botoes=['btnNovaAnalise','btnAdicionar','btnProcessar'].map(id=>document.getElementById(id));
 limpandoAnalise=true;
 botoes.forEach(b=>{ if(b) b.disabled=true; });
 status.textContent='Limpando os dados da an\xE1lise atual...';
 try{
   // Um processamento em andamento \xE9 interrompido; a resposta s\xF3 chega depois de tudo apagado
   const r=await fetch('/api/nova-analise',{method:'POST'});
   const d=await r.json();
   if(!r.ok) throw new Error(d.detalhe||d.erro||'Erro ao iniciar nova an\xE1lise.');
   // Confirma que a an\xE1lise ficou vazia antes de avisar
   const a=await (await fetch('/api/analise')).json();
   if(a.processados||a.aguardando||a.processada) throw new Error('a limpeza n\xE3o foi conclu\xEDda. Tente de novo.');
   // Tela de volta ao estado inicial: sele\xE7\xE3o de arquivos, listas e filtros
   const input=document.getElementById('arquivos');
   if(input){ input.value=''; atualizarSelecaoXml(); }
   resultados=[]; resultadosFiltrados=[]; respostas=[]; pendentes=[]; pendentesFiltradas=[];
   validacoes.clear(); marcarResultadosDesatualizados(false);
   isProdutos=[]; isPorChave=new Map(); estadoIS.clear();
   ['busca','filtroClass','filtroCst'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
   const filtro=document.getElementById('filtroResultado'); if(filtro) filtro.value='';
   await recarregarTudo();
   await carregarAnalise();
   status.textContent='Nova an\xE1lise iniciada. Adicione os XMLs.';
 }catch(erro){
   status.textContent='Erro: '+erro.message;
   await carregarAnalise();
 }
 limpandoAnalise=false;
 botoes.forEach(b=>{ if(b&&b.id!=='btnProcessar') b.disabled=false; });
}

async function carregarDashboard(){
  try{
    const r=await fetch('/api/dashboard');
    const d=await r.json();

    const i=d.indicadores||{};
    const vereditos=Array.isArray(d.vereditos)?d.vereditos:[];
    const explicacoes=d.explicacoes||{};

    const economia=Number(i.economiaPotencial||0);
    const conformidade=Number(i.percentualConformidade||0);

    const situacao=document.getElementById('situacaoResumo');

if(situacao){

  let classificacao='';
  let cor='#9C2F25';
  let fundo='#FAEDEA';

  if(conformidade>=0.98){
    classificacao='EXCELENTE';
    cor='#2E6B45';
    fundo='#EAF3EC';
  }else if(conformidade>=0.95){
    classificacao='MUITO BOA';
    cor='#3A7A52';
    fundo='#EDF4EE';
  }else if(conformidade>=0.90){
    classificacao='BOA';
    cor='#56703A';
    fundo='#F0F4E8';
  }else if(conformidade>=0.80){
    classificacao='ATEN\xC7\xC3O';
    cor='#8F5316';
    fundo='#FBF1E4';
  }else{
    classificacao='CR\xCDTICA';
    cor='#9C2F25';
    fundo='#FAEDEA';
  }

  situacao.innerHTML=
    '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">'+
      '<div style="font-family:var(--serif);font-size:48px;font-weight:700;line-height:1;color:var(--verde-900)">'+
        formatarPercentual(conformidade)+
      '</div>'+
      '<div style="display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:999px;background:'+fundo+';border:1px solid '+cor+';color:'+cor+';font-size:12.5px;font-weight:700;letter-spacing:.08em">'+
        '<span style="font-size:10px">\u25CF</span>'+
        classificacao+
      '</div>'+
    '</div>'+
    '<p style="margin-top:8px">dos itens avaliados est\xE3o em conformidade.</p>';
}

    const economiaResumo=document.getElementById('economiaResumo');
    if(economiaResumo){
      economiaResumo.innerHTML=
        '<div style="font-family:var(--serif);font-size:48px;font-weight:700;line-height:1;color:var(--ouro-700)">'+
        formatarNumero(economia)+
        '</div>'+
        '<p>economia potencial identificada na an\xE1lise (confirmada: itens validados ou com regra aplic\xE1vel).</p>'+
        (Number(i.economiaSujeitaValidacao||0)>0
          ? '<p class="small" title="Estimativa dos itens pendentes que usam tributa\xE7\xE3o integral, com a menor redu\xE7\xE3o entre as regras candidatas. N\xE3o est\xE1 somada ao valor acima.">+ '+formatarNumero(i.economiaSujeitaValidacao)+' sujeita \xE0 valida\xE7\xE3o (respostas SIM/N\xC3O pendentes).</p>'
          : '');
    }

    // Gr\xE1fico: corretos inclui os corretos c/ recal impostos; incorretos s\xE3o s\xF3 os de NCM a ajustar
    const corretos=Number(i.codigosCorretos||0)+Number(i.codigosRecalculo||0);
    const incorretos=Number(i.codigosNcmAjustar??i.codigosIncorretos??0);
    const pendentes=Number(i.codigosPendentes||0);
    const total=corretos+incorretos+pendentes;

    if(window._chartResultados){
      window._chartResultados.destroy();
    }

    if(window._chartConformidade){
      window._chartConformidade.destroy();
    }

    if(window._chartProdutos){
      window._chartProdutos.destroy();
    }

    const ctxResultados=document.getElementById('chartResultados');

    if(ctxResultados){

      const pluginValoresResultados={
        id:'pluginValoresResultados',

        afterDatasetsDraw:function(chart){

          const ctx=chart.ctx;
          const meta=chart.getDatasetMeta(0);

          ctx.save();

          ctx.textAlign='center';
          ctx.textBaseline='middle';

          meta.data.forEach(function(bar,index){

            const valor=Number(chart.data.datasets[0].data[index]||0);

            const percentual=total
              ? ((valor/total)*100).toFixed(2)
              : '0.00';

            const centroY=(bar.y+bar.base)/2;

            ctx.fillStyle='#ffffff';

            ctx.font='bold 14px Arial';

            ctx.fillText(
              String(valor),
              bar.x,
              centroY-8
            );

            ctx.font='bold 11px Arial';

            ctx.fillText(
              percentual+'%',
              bar.x,
              centroY+9
            );

          });

          ctx.restore();
        }
      };

      window._chartResultados=new Chart(ctxResultados,{
        type:'bar',

        plugins:[ChartDataLabels],

        data:{
          labels:[
            'Corretos',
            'Incorretos',
            'Pendentes'
          ],

          datasets:[{
            label:'Quantidade de itens',

            data:[
              corretos,
              incorretos,
              pendentes
            ],

            backgroundColor:[
              '#3A7A52',
              '#A53E33',
              '#8F7137'
            ]
          }]
        },

        options:{
          responsive:true,
          maintainAspectRatio:false,

          plugins:{datalabels:{display:true,color:'#ffffff',font:{weight:'bold',size:13},formatter:function(value,context){var total=context.dataset.data.reduce(function(a,b){return a+Number(b||0);},0);var p=total?((Number(value)/total)*100).toFixed(2):'0.00';return String(value)+' / '+p+'%';}},legend:{display:false},

            tooltip:{
              callbacks:{
                label:function(context){

                  const valor=Number(context.raw||0);

                  const percentual=total
                    ? ((valor/total)*100).toFixed(2)
                    : '0.00';

                  return ' '+valor+' item(ns) \u2014 '+percentual+'%';
                }
              }
            }
          },

          scales:{
            y:{
              beginAtZero:true,

              ticks:{
                precision:0
              }
            }
          }
        }
      });
    }
    const valoresResultados=document.getElementById('valoresResultados');

    if(valoresResultados){
      valoresResultados.innerHTML=
        '<strong>Corretos:</strong> '+corretos+' ('+(total?((corretos/total)*100).toFixed(2):'0.00')+'%) &nbsp; '+
        '<strong>Incorretos:</strong> '+incorretos+' ('+(total?((incorretos/total)*100).toFixed(2):'0.00')+'%) &nbsp; '+
        '<strong>Pendentes:</strong> '+pendentes+' ('+(total?((pendentes/total)*100).toFixed(2):'0.00')+'%)';
    }

    const ctxConformidade=document.getElementById('chartConformidade');

    if(ctxConformidade){

      const pluginValoresConformidade={
        id:'pluginValoresConformidade',

        afterDatasetsDraw:function(chart){

          const ctx=chart.ctx;
          const meta=chart.getDatasetMeta(0);
          const dados=chart.data.datasets[0].data;

          const totalGrafico=dados.reduce(function(soma,valor){
            return soma+Number(valor||0);
          },0);

          ctx.save();
          ctx.textAlign='center';
          ctx.textBaseline='middle';

          meta.data.forEach(function(arco,index){

            const valor=Number(dados[index]||0);

            if(!valor){return;}

            const percentual=totalGrafico
              ? ((valor/totalGrafico)*100).toFixed(2)
              : '0.00';

            const angulo=(arco.startAngle+arco.endAngle)/2;
            const raio=(arco.outerRadius+arco.innerRadius)/2;

            const x=arco.x+Math.cos(angulo)*raio;
            const y=arco.y+Math.sin(angulo)*raio;

            ctx.fillStyle='#ffffff';
            ctx.font='bold 14px Arial';
            ctx.fillText(String(valor),x,y-8);

            ctx.font='bold 11px Arial';
            ctx.fillText(percentual+'%',x,y+9);
          });

          ctx.restore();
        }
      };

      window._chartConformidade=new Chart(ctxConformidade,{
        type:'doughnut',
        plugins:[ChartDataLabels],

        data:{
          labels:['Corretos','Incorretos','Pendentes'],
          datasets:[{
            data:[corretos,incorretos,pendentes],
            backgroundColor:['#3A7A52','#A53E33','#8F7137']
          }]
        },

        options:{
          responsive:true,
          maintainAspectRatio:false,

          plugins:{
            datalabels:{display:true,color:'#ffffff',backgroundColor:'rgba(27,43,33,.78)',borderRadius:6,padding:{top:3,bottom:3,left:7,right:7},font:{weight:'bold',size:13},formatter:function(value,context){var total=context.dataset.data.reduce(function(a,b){return a+Number(b||0);},0);var p=total?((Number(value)/total)*100).toFixed(2):'0.00';return String(value)+' / '+p+'%';}},legend:{position:'bottom'},

            tooltip:{
              callbacks:{
                label:function(context){
                  const valor=Number(context.raw||0);
                  const percentual=total
                    ? ((valor/total)*100).toFixed(2)
                    : '0.00';

                  return ' '+valor+' item(ns) \u2014 '+percentual+'%';
                }
              }
            }
          }
        }
      });
    }
    const valoresConformidade=document.getElementById('valoresConformidade');

    if(valoresConformidade){
      valoresConformidade.innerHTML=
        '<strong>Corretos:</strong> '+corretos+' ('+(total?((corretos/total)*100).toFixed(2):'0.00')+'%) &nbsp; '+
        '<strong>Incorretos:</strong> '+incorretos+' ('+(total?((incorretos/total)*100).toFixed(2):'0.00')+'%) &nbsp; '+
        '<strong>Pendentes:</strong> '+pendentes+' ('+(total?((pendentes/total)*100).toFixed(2):'0.00')+'%)';
    }

    const comBeneficio=vereditos.filter(function(v){
      return !!v.regraAplicada;
    }).length;

    const pendenteBeneficio=vereditos.filter(function(v){
      return v.estado==='REQUER_VALIDACAO' &&
        (v.regrasCandidatas||[]).length>0;
    }).length;

    const semBeneficio=Math.max(
      vereditos.length-comBeneficio-pendenteBeneficio,
      0
    );

    const ctxProdutos=document.getElementById('chartProdutos');

    if(ctxProdutos){
      window._chartProdutos=new Chart(ctxProdutos,{
        type:'bar',
        data:{
          labels:[
            'Benef\xEDcio identificado',
            'Benef\xEDcio pendente',
            'Sem benef\xEDcio identificado'
          ],
          datasets:[{
            label:'Quantidade de produtos',
            data:[
              comBeneficio,
              pendenteBeneficio,
              semBeneficio
            ],
            backgroundColor:[
              '#3A7A52',
              '#8F7137',
              '#737870'
            ]
          }]
        },
        options:{
          responsive:true,
          maintainAspectRatio:false,
          plugins:{datalabels:{display:true,color:'#ffffff',font:{weight:'bold',size:13},formatter:function(value,context){var total=context.dataset.data.reduce(function(a,b){return a+Number(b||0);},0);var p=total?((Number(value)/total)*100).toFixed(2):'0.00';return String(value)+' / '+p+'%';}},legend:{display:false},
            tooltip:{
              callbacks:{
                label:function(context){
                  return ' '+Number(context.raw||0)+' produto(s)';
                }
              }
            }
          },
          scales:{
            y:{
              beginAtZero:true,
              ticks:{precision:0}
            }
          }
        }
      });
    }

    const tabelaNcm=document.getElementById('tabelaNcm');

    if(tabelaNcm){
      // Mesma divis\xE3o dos outros gr\xE1ficos: correto com rec\xE1lculo de impostos \xE9 correto; incorreto \xE9 s\xF3 o NCM a ajustar
      const situacaoNcm=function(v){
        const estado=String(v.estado||'').toUpperCase();
        if(estado==='CORRETO'||ehRecalculo(v)) return 'CORRETO';
        if(estado==='INCORRETO_NCM') return 'INCORRETO';
        if(estado==='REQUER_VALIDACAO'||estado.indexOf('INCORRETO')===0) return 'REQUER_VALIDACAO';
        return null;
      };
      const grupos={CORRETO:[],INCORRETO:[],REQUER_VALIDACAO:[]};

      vereditos.forEach(function(v){
        const s=situacaoNcm(v);
        if(s) grupos[s].push(v);
      });

      function ncmDistintos(lista){
        return [...new Set(lista.map(function(v){
          return String(v.ncm||'').trim();
        }).filter(Boolean))];
      }

      const ncmCorretos=ncmDistintos(grupos.CORRETO);
      const ncmIncorretos=ncmDistintos(grupos.INCORRETO);
      const ncmPendentes=ncmDistintos(grupos.REQUER_VALIDACAO);

      function cartaoNcm(titulo,quantidade,classe){
  const configuracao={
    'Corretos':{
      simbolo:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
      cor:'#2E6B45',
      fundo:'#EAF3EC',
      borda:'#BFD8C6'
    },
    'Incorretos':{
      simbolo:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v6"/><path d="M12 17h.01"/></svg>',
      cor:'#9C2F25',
      fundo:'#FAEDEA',
      borda:'#EBC5BE'
    },
    'Requer valida\xE7\xE3o':{
      simbolo:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22"/><path d="M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2"/></svg>',
      cor:'#8F7137',
      fundo:'#F8F1E0',
      borda:'#E4D0A2'
    }
  };

  const cfg=configuracao[titulo]||{
    simbolo:'\u2022',
    cor:'#46544B',
    fundo:'#F2F0E9',
    borda:'#DCD5C6'
  };

  return '<div class="card" style="margin:0;text-align:center;padding:20px 14px;border-radius:14px;border:1px solid '+cfg.borda+';background:'+cfg.fundo+';box-shadow:0 1px 2px rgba(29,41,34,.05);min-height:150px;display:flex;flex-direction:column;justify-content:center">'+
    '<div class="icone-situacao" style="width:46px;height:46px;margin:0 auto 10px;border-radius:50%;background:'+cfg.cor+';color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,.12)">'+
      cfg.simbolo+
    '</div>'+
    '<div style="font-size:14px;font-weight:700;letter-spacing:.02em;color:var(--verde-900)">'+
      titulo+
    '</div>'+
    '<div style="font-family:var(--serif);font-size:42px;font-weight:700;line-height:1.05;margin-top:6px;color:'+cfg.cor+'">'+
      quantidade+
    '</div>'+
    '<div class="small" style="margin-top:2px;color:var(--texto-3)">NCM(s)</div>'+
  '</div>';
}
      function listaNcm(lista){
        if(!lista.length){
          return '<p class="small">Nenhum NCM encontrado para esta situa\xE7\xE3o.</p>';
        }

        return '<div style="display:grid;gap:8px;margin-top:12px">'+
          lista.map(function(v){
            return '<div class="card" style="margin:0">'+
              '<strong>NCM '+esc(v.ncm||'-')+'</strong>'+
              '<div class="small">'+esc(v.produto||'-')+'</div>'+
              '<div class="small">Situa\xE7\xE3o: <strong>'+esc(ROTULO_ESTADO[v.estado]||v.estado||'-')+'</strong></div>'+
              '<div class="small">Base: '+formatarNumero(v.baseCalculo||v.base||0)+'</div>'+
              '</div>';
          }).join('')+
          '</div>';
      }

      tabelaNcm.innerHTML=
        '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:16px">'+
          cartaoNcm('Corretos',ncmCorretos.length,'resultado-correto')+
          cartaoNcm('Incorretos',ncmIncorretos.length,'resultado-incorreto')+
          cartaoNcm('Requer valida\xE7\xE3o',ncmPendentes.length,'resultado-pendente')+
        '</div>'+
        '<button type="button" class="secondary" id="btnPesquisarNcm"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>Pesquisar NCM por situa\xE7\xE3o</button>'+
        '<div id="painelPesquisaNcm" hidden style="margin-top:14px">'+
          '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">'+
            '<select id="filtroSituacaoNcm">'+
              '<option value="TODOS">Todos</option>'+
              '<option value="CORRETO">Corretos</option>'+
              '<option value="INCORRETO">Incorretos</option>'+
              '<option value="REQUER_VALIDACAO">Requer valida\xE7\xE3o</option>'+
            '</select>'+
            '<input id="campoPesquisaNcm" placeholder="Digite o NCM ou produto">'+
          '</div>'+
          '<div id="listaPesquisaNcm"></div>'+
        '</div>';

      const btnPesquisarNcm=document.getElementById('btnPesquisarNcm');
      const painelPesquisaNcm=document.getElementById('painelPesquisaNcm');
      const filtroSituacaoNcm=document.getElementById('filtroSituacaoNcm');
      const campoPesquisaNcm=document.getElementById('campoPesquisaNcm');
      const listaPesquisaNcm=document.getElementById('listaPesquisaNcm');

      function atualizarPesquisaNcm(){
        if(!listaPesquisaNcm) return;

        const filtro=filtroSituacaoNcm ? filtroSituacaoNcm.value : 'TODOS';
        const busca=campoPesquisaNcm ?
          String(campoPesquisaNcm.value||'').toLowerCase().trim() : '';

        let lista=vereditos.filter(function(v){
          const pertence=filtro==='TODOS'||situacaoNcm(v)===filtro;

          if(!pertence) return false;

          if(!busca) return true;

          return String(v.ncm||'').toLowerCase().includes(busca) ||
            String(v.produto||'').toLowerCase().includes(busca);
        });

        listaPesquisaNcm.innerHTML=listaNcm(lista);
      }

      if(btnPesquisarNcm){
        btnPesquisarNcm.onclick=function(){
          if(painelPesquisaNcm){
            painelPesquisaNcm.hidden=!painelPesquisaNcm.hidden;

            if(!painelPesquisaNcm.hidden){
              atualizarPesquisaNcm();
            }
          }
        };
      }

      if(filtroSituacaoNcm){
        filtroSituacaoNcm.onchange=atualizarPesquisaNcm;
      }

      if(campoPesquisaNcm){
        campoPesquisaNcm.oninput=atualizarPesquisaNcm;
      }
    }
    const beneficiosFiscais=document.getElementById('beneficiosFiscais');

    if(beneficiosFiscais){
      const entradas=Object.values(explicacoes.entradas||{});
      const beneficios=entradas.filter(function(e){
        return e.reducao;
      });

      if(beneficios.length){
        beneficiosFiscais.innerHTML=beneficios.map(function(e){
          const reducao=Number(e.reducao.valor||0)*100;

          return '<div class="card" style="margin-top:10px">'+
            '<strong>'+esc(e.produto||'-')+'</strong>'+
            '<p>Redu\xE7\xE3o da al\xEDquota: '+reducao.toFixed(0)+'%</p>'+
            '</div>';
        }).join('');
      }else{
        beneficiosFiscais.innerHTML=
          '<p>Nenhum benef\xEDcio fiscal identificado.</p>';
      }
    }

    const aliquotas=document.getElementById('aliquotas');

    if(aliquotas){
      aliquotas.innerHTML=
        (i.aliquotasUsadas||[]).map(function(a){
          return '<p><strong>'+
            esc(a.tributo)+
            '</strong>: '+
            formatarPercentual(a.aliquota)+
            ' \u2014 '+
            esc(a.fonte)+
            '</p>';
        }).join('')||
        '<p>Sem dados.</p>';
    }

    const detalhesBeneficios=document.getElementById('detalhesBeneficios');

    if(detalhesBeneficios){
      detalhesBeneficios.innerHTML=
        '<p><strong>Produtos avaliados:</strong> '+
        vereditos.length+
        '</p>'+
        '<p><strong>Benef\xEDcio identificado:</strong> '+
        comBeneficio+
        '</p>'+
        '<p><strong>Benef\xEDcio pendente:</strong> '+
        pendenteBeneficio+
        '</p>';
    }

  }catch(e){
    console.error('Erro ao carregar Dashboard:',e);

    const aviso=document.getElementById('avisoDashboard');

    if(aviso){
      aviso.hidden=false;
      aviso.textContent=
        'N\xE3o foi poss\xEDvel carregar os dados do Dashboard.';
    }
  }
}
function cardsIndicadores(i){
 return [
    ['XMLs processados',i.xmls??'-'],
    ['Documentos',i.documentos??'-'],
    ['Itens / linhas avaliados',i.itensAvaliados??i.itens??'-'],
    ['C\xF3digos \xFAnicos avaliados',i.codigosAvaliados??0],
    ['C\xF3digos corretos',i.codigosCorretos??0],
    ['C\xF3digos corretos c/ recal impostos',i.codigosRecalculo??0],
    ['C\xF3digos com NCM a ajustar',i.codigosNcmAjustar??0],
    ['C\xF3digos pendentes',i.codigosPendentes??0],
    ['Valor calculado como pago',formatarNumero(i.valorPagoTotal??0)],
    ['Valor correto',formatarNumero(i.valorCorretoTotal??0)],
    ['Economia potencial',formatarNumero(i.economiaPotencial??0)+(Number(i.valorAPagarRecalculo||0)>0?'<div class="small">economia '+formatarNumero(i.economiaRecalculo??0)+' \u2212 valor a pagar '+formatarNumero(i.valorAPagarRecalculo)+'</div>':'')+(Number(i.economiaSujeitaValidacao||0)>0?'<div class="small">+ '+formatarNumero(i.economiaSujeitaValidacao)+' sujeita \xE0 valida\xE7\xE3o</div>':'')],
    ['Conformidade',formatarPercentual(i.percentualConformidade??0)]];
}

async function carregarRespostas(){
 try{ respostas=await (await fetch('/api/respostas')).json(); }catch(e){ respostas=[]; }
}

/**
 * Resultados por item. O servidor manda cada exibi\xE7\xE3o diferente (redu\xE7\xE3o, confer\xEAncia com as fontes, lacunas,
 * bloqueios) uma vez s\xF3 e, em cada item, a posi\xE7\xE3o da sua; aqui as duas partes s\xE3o juntadas de novo.
 */
async function buscarResultados(){
 const r=await fetch('/api/resultados?compacto=1');
 const d=await r.json();
 if(!r.ok) throw new Error(d.erro||'N\xE3o foi poss\xEDvel carregar os resultados.');
 if(Array.isArray(d)) return d;
 return d.vereditos.map(v=>{ const x=d.exibicoes[v.exibicao]||{}; delete v.exibicao; return Object.assign(v,x); });
}

async function carregarResultados(){
 try{
   resultados=await buscarResultados();
   await carregarRespostas();
   if(!Object.keys(regrasUI).length){ try{ regrasUI=await (await fetch('/api/regras')).json(); }catch(e){ regrasUI={}; } }
   renderResultados();
 }catch(e){
   document.getElementById('listaResultados').innerHTML='<p>N\xE3o foi poss\xEDvel carregar os resultados.</p>';
 }
}

/** Resposta desta an\xE1lise para o item (mesma regra de associa\xE7\xE3o do motor: NCM + cProd ou descri\xE7\xE3o). */
function validacaoDoItem(v){
 const rs=respostas.filter(x=>x.ncm===v.ncm&&(x.cProd===v.cProd||x.cProd===v.produto));
 if(rs.length) return rs.map(x=>x.resposta==='NAO'?'N\xC3O':'SIM').join(', ')+' (nesta an\xE1lise)';
 if(v.estado==='REQUER_VALIDACAO') return 'Pendente';
 return '\u2014';
}

function renderResultados(){
 const busca=(document.getElementById('busca').value||'').toLowerCase();
 const filtro=document.getElementById('filtroResultado').value;
 const classe=(document.getElementById('filtroClass').value||'').toLowerCase();
 const cst=(document.getElementById('filtroCst').value||'').toLowerCase();

 resultadosFiltrados=resultados.filter(v=>{
   const texto=[v.produto,v.cProd,v.ncm].join(' ').toLowerCase();
   const informadoClass=(v.informado?.cClassTrib||'').toLowerCase();
   const informadoCst=(v.informado?.cst||'').toLowerCase();
   return (!busca||texto.includes(busca))
     &&(!filtro||v.estado===filtro)
     &&(!classe||informadoClass.includes(classe))
     &&(!cst||informadoCst.includes(cst));
 });
 const unicosPorProduto=new Map();
 resultadosFiltrados=resultadosFiltrados.filter(v=>{if(unicosPorProduto.has(v.cProd)) return false; unicosPorProduto.set(v.cProd,true); return true;});
 document.getElementById('contagemResultados').textContent=resultadosFiltrados.length+' item(ns)';

 document.getElementById('listaResultados').innerHTML=resultadosFiltrados.map(cartaoResultado).join('')||'<p>Nenhum resultado encontrado.</p>';
}

/** Descri\xE7\xE3o da regra (r\xF3tulo, anexo, item), s\xF3 para exibi\xE7\xE3o; vem da base normativa. */
function nomeRegra(id,ncm){
 const g=regrasUI[id+'|'+ncm];
 return g?textoRegra(Object.assign({id},g)):id;
}

function beneficioDoItem(v){
 if(v.regraAplicada) return 'Aplicado: '+nomeRegra(v.regraAplicada,v.ncm);
 const cand=v.regrasCandidatas||[];
 if(!cand.length) return (v.regrasBloqueadas||[]).length?'Nenhuma regra de benef\xEDcio aplic\xE1vel: regra do NCM bloqueada por incompatibilidade oficial':'Nenhum benef\xEDcio cadastrado para este NCM';
 const nomes=cand.map(id=>nomeRegra(id,v.ncm)).join('; ');
 if(v.estado==='REQUER_VALIDACAO') return 'Enquadramento poss\xEDvel (depende de valida\xE7\xE3o): '+nomes;
 return 'Enquadramento poss\xEDvel, n\xE3o aplicado: '+nomes;
}

function pct(x){ return (Math.round(x*10000)/100).toLocaleString('pt-BR',{maximumFractionDigits:2})+'%'; }
function textoReducao(r){ return pct(r)+(r===1?' (al\xEDquota zero)':''); }
function textoResultante(r){ return pct(1-r)+' da al\xEDquota padr\xE3o'; }

/**
 * Redu\xE7\xE3o do item: vem pronta em v.reducaoExibicao (/api/resultados), resolvida pelo explicador a partir da
 * regra efetivamente identificada. A tela n\xE3o busca redu\xE7\xE3o por regraId.
 */
function linhaRed(rotulo,valor){ return '<div><span class="rotulo">'+rotulo+'</span><span class="valor">'+esc(valor)+'</span></div>'; }
function textoFato(f){
 const l=f.localizacao||{};
 const onde=l.dispositivo?'LC 214/2025, '+l.dispositivo:l.campo?'SVRS, '+l.campo+(l.cClassTrib?' ('+l.cClassTrib+')':''):'';
 const conteudo=f.trecho!=null?f.trecho:f.valor!=null?String(f.valor):'';
 return f.fonte+(onde?' \u2014 '+onde:'')+(conteudo?': '+conteudo:'');
}
function listaFatos(fatos){
 if(!fatos||!fatos.length) return '';
 return '<ul class="fatos">'+fatos.map(f=>'<li>'+esc(textoFato(f))+'</li>').join('')+'</ul>';
}

/** Bloco de uma regra; sufixo "(se o enquadramento for confirmado)" quando a regra ainda n\xE3o foi escolhida. */
function blocoOpcaoReducao(o,prevista,coerencia,v,varias){
 const suf=prevista?' (se o enquadramento for confirmado)':'';
 const cab=varias?'<div class="small"><strong>'+esc(nomeRegra(o.regraId,v.ncm))+'</strong></div>':'';
 if(o.evidencia==='nao_determinada'||o.valor==null){
   return '<div class="reducao nao-determinada">'+cab+
    '<div><span class="rotulo">Redu\xE7\xE3o da al\xEDquota IBS/CBS'+suf+'</span>N\xE3o exibida: a regra n\xE3o p\xF4de ser identificada com seguran\xE7a.</div>'+
    '<div class="small">'+esc(o.motivo||'')+'</div></div>';
 }
 if(coerencia===false){
   return '<div class="reducao nao-determinada">'+cab+
    '<div><span class="rotulo">Redu\xE7\xE3o da al\xEDquota IBS/CBS</span>N\xE3o confirmada para este item: a economia calculada pelo motor n\xE3o corresponde ao percentual da regra '+esc(o.regraId)+'.</div></div>';
 }
 const origem='Base normativa \u2014 regra '+o.regraId+(o.linhaPlanilha!=null?' (planilha Base de dados, linha '+o.linhaPlanilha+')':'');
 let corpo=linhaRed('Redu\xE7\xE3o da al\xEDquota IBS/CBS'+suf,textoReducao(o.valor))+
  linhaRed('Al\xEDquota resultante'+suf,textoResultante(o.valor))+
  '<div class="small">Origem: '+esc(origem)+'</div>';
 if(o.evidencia==='oficial_confirmada'){
   corpo+='<div><span class="rotulo">Evid\xEAncia da redu\xE7\xE3o</span><span class="valor">confirmada</span></div>'+
    '<div class="small">Fontes oficiais:</div>'+listaFatos(o.fatos);
   return '<div class="reducao">'+cab+corpo+'</div>';
 }
 if(o.evidencia==='oficial_divergente'){
   corpo+='<div><span class="rotulo">Evid\xEAncia da redu\xE7\xE3o</span><span class="valor">divergente das fontes oficiais</span></div>'+
    '<div class="small">'+esc(o.motivo||'')+'</div>'+listaFatos(o.fatos);
   return '<div class="reducao sem-evidencia">'+cab+corpo+'</div>';
 }
 // sem_evidencia_oficial
 const foraEscopo=(o.motivo||'').indexOf('fora do escopo auditado')>=0;
 const aud=(v.auditoriaExibicao||{})[o.regraId];
 corpo+='<div><span class="rotulo">Evid\xEAncia da redu\xE7\xE3o (v\xEDnculo registrado)</span><span class="valor">n\xE3o conferida</span></div>'+
  '<div class="small">'+esc(foraEscopo?(aud?'C\xF3digo fora do escopo do v\xEDnculo formal registrado (Etapa 5: 200033 e 200043)':'C\xF3digo fora do escopo auditado'):(o.motivo||''))+'</div>'+
  (reducaoConfereNaAuditoria(aud)?'':'<div class="aviso-d3">Percentual e valores calculados com base em dado n\xE3o confirmado oficialmente.</div>')+
  linhasAuditoriaReducao(aud);
 return '<div class="reducao sem-evidencia">'+cab+corpo+'</div>';
}

function blocoReducao(v){
 const r=v.reducaoExibicao;
 if(!r){
   if(v.reducaoIndisponivel&&(v.regraAplicada||(v.regrasCandidatas||[]).length)) return '<div class="small">Redu\xE7\xE3o indispon\xEDvel: '+esc(v.reducaoIndisponivel)+'.</div>';
   return '';
 }
 if(r.situacao==='regime_especifico'&&r.regimeEspecifico){
   const g=r.regimeEspecifico;
   return '<div class="reducao regime">'+linhaRed('Redu\xE7\xE3o da al\xEDquota IBS/CBS',textoReducao(g.valor))+
    linhaRed('Al\xEDquota resultante',textoResultante(g.valor))+
    '<div class="small">Origem: Regime espec\xEDfico do motor ('+esc(g.fundamento)+')</div></div>';
 }
 const prevista=r.situacao==='prevista';
 if(!r.opcoes.length) return '';
 return r.opcoes.map(o=>blocoOpcaoReducao(o,prevista,r.coerenciaEconomia,v,r.opcoes.length>1)).join('');
}

/** CORRETO com benef\xEDcio: o motor calcula este valor sem a redu\xE7\xE3o, ent\xE3o n\xE3o \xE9 chamado de "valor correto". */
function rotuloValorCorreto(v){
 return v.estado==='CORRETO'&&v.regraAplicada?'Valor calculado pelo motor (sem redu\xE7\xE3o)':'Valor correto segundo a regra';
}

/* ---------- Confer\xEAncia com as fontes oficiais (data/auditoria-oficial.json, via explicador). S\xF3 exibi\xE7\xE3o. ---------- */
const ROTULO_AUDITORIA={
 CONFIRMADA:'Regra conferida com a fonte oficial',
 DIVERGENTE:'Regra diverge da fonte oficial',
 NAO_LOCALIZADA:'Regra n\xE3o localizada nas fontes oficiais',
 NAO_DETERMINADA:'Confer\xEAncia com a fonte oficial n\xE3o determinada'
};
const ROTULO_SVRS={PERMITIDO:'PERMITIDO',VEDADO:'VEDADO',PERMITIDO_E_VEDADO:'PERMITIDO e VEDADO',AUSENTE:'n\xE3o listado para o c\xF3digo'};
function curto(sha){ return String(sha||'').slice(0,12)+'\u2B26'; }

/** Alertas da regra frente \xE0s fontes; nada \xE9 bloqueado nesta fase. */
function alertasDaAuditoria(a){
 const ved=(a.fatosF2||[]).filter(f=>f.TipoPermissao==='VEDADO');
 const al=[];
 if(a.situacaoNcmSvrs==='VEDADO'||a.excluidoDoItemDaRegra){
   al.push('A fonte oficial exclui este NCM deste enquadramento'+
    (ved.length?' \u2014 SVRS: VEDADO'+(ved[0].DescExcecao?' (exce\xE7\xE3o: '+ved[0].DescExcecao+')':''):'')+
    (a.excluidoDoItemDaRegra?' \u2014 Lei: o item '+a.itemDaBase+' exclui expressamente este NCM':'')+
    '. Nesta fase o sistema ainda permite a valida\xE7\xE3o; o bloqueio autom\xE1tico est\xE1 reservado para a Fase 2.');
 }
 if(a.situacaoNcmSvrs==='PERMITIDO_E_VEDADO') al.push('O SVRS lista este NCM como PERMITIDO e tamb\xE9m como VEDADO para o c\xF3digo; confira as duas entradas.');
 if(a.motivos.some(m=>m.indexOf('NCM s\xF3 na lei')===0)) al.push('As fontes oficiais divergem: a lei (fonte jur\xEDdica prim\xE1ria) cobre este NCM, mas o SVRS (fonte operacional) n\xE3o o lista para o c\xF3digo. Nenhuma das fontes foi escolhida automaticamente.');
 if(a.motivos.some(m=>m.indexOf('NCM s\xF3 no SVRS')===0)) al.push('As fontes oficiais divergem: o SVRS (fonte operacional) lista este NCM, mas nenhum item da lei (fonte jur\xEDdica prim\xE1ria) o cobre'+(a.excecaoNaLeiEmItens.length?'; a lei o exclui no item '+a.excecaoNaLeiEmItens.join(', '):'')+'. Nenhuma das fontes foi escolhida automaticamente.');
 if(a.itensOficiais.length>1) al.push('O NCM aparece em '+a.itensOficiais.length+' itens da lei ('+a.itensOficiais.join(', ')+'); o item depende do produto.');
 if(a.itensOficiais.length&&!a.itemDaRegraEntreOsOficiais) al.push('O item da base ('+(a.itemDaBase||'vazio')+') n\xE3o est\xE1 entre os itens da lei que cobrem o NCM ('+a.itensOficiais.join(', ')+').');
 return al;
}

function blocoAuditoria(a){
 if(!a) return '<div class="bloco aud aud-indisponivel"><span class="rotulo">Confer\xEAncia com a fonte oficial</span><div class="small">Sem confer\xEAncia dispon\xEDvel para esta regra (auditoria ausente, desatualizada ou regra n\xE3o identificada com seguran\xE7a).</div></div>';
 const lei=(a.fatosF1||[]).filter(f=>f.papel==='cobre o NCM');
 const exclui=(a.fatosF1||[]).filter(f=>f.papel==='exclui o NCM');
 const svrs=a.fatosF2||[];
 const c=a.codigo||{};
 const item='Item da base: '+(a.itemDaBase||'vazio')+
  (a.itemOficial!=null?' \xB7 Item oficial: '+a.itemOficial:a.itensOficiais.length>1?' \xB7 Itens oficiais poss\xEDveis: '+a.itensOficiais.join(', '):' \xB7 Item oficial: n\xE3o identificado');
 const svrsTxt='Situa\xE7\xE3o do NCM no SVRS: '+(ROTULO_SVRS[a.situacaoNcmSvrs]||a.situacaoNcmSvrs)+
  (svrs.length?' \u2014 '+[...new Set(svrs.map(f=>(f.TipoPermissao!==a.situacaoNcmSvrs?f.TipoPermissao+': ':'')+f.DescItemAnexo+(f.DescExcecao?' (exce\xE7\xE3o: '+f.DescExcecao+')':'')))].join(' | '):'');
 const codigoTxt=c.F2?'C\xF3digo no SVRS: CST '+c.F2.cst+' \xB7 cClassTrib '+(a.cClassTrib||'')+' \xB7 Anexo '+c.F2.nroAnexo+' \xB7 redu\xE7\xE3o '+c.F2.percRedIbs+'% IBS / '+c.F2.percRedCbs+'% CBS':'';
 const fund=c.F1&&c.F1.dispositivo?'Fundamento na lei: '+c.F1.dispositivo+' (fundamento na base: '+(c.comparacao?c.comparacao.fundamento:'\u2014')+')':'';
 const fontes=a.fontes?'Fontes: <a href="'+esc(a.fontes.F1.url+(c.F1&&c.F1.ancora?'#'+c.F1.ancora:''))+'" target="_blank" rel="noopener">LC 214/2025 (Planalto)</a> \u2014 texto legal, snapshot '+esc(curto(a.fontes.F1.sha256))+
  ' \xB7 <a href="'+esc(a.fontes.F2.url)+'" target="_blank" rel="noopener">SVRS \u2014 Classifica\xE7\xE3o Tribut\xE1ria</a> \u2014 tabela de apoio, snapshot '+esc(curto(a.fontes.F2.sha256)):'';
 const alertas=alertasDaAuditoria(a);
 return '<div class="bloco aud aud-'+esc(a.status)+'">'+
  '<span class="rotulo">Confer\xEAncia com a fonte oficial</span>'+
  '<div class="aud-status">'+esc(ROTULO_AUDITORIA[a.status]||a.status)+'</div>'+
  alertas.map(t=>'<div class="aviso-regra">'+esc(t)+'</div>').join('')+
  (lei.length?'<div class="small"><strong>'+esc(lei[0].dispositivo)+':</strong> \u201C'+esc(lei[0].trecho)+'\u2B1D</div>':exclui.length?'':'<div class="small">Nenhum item da lei cobre este NCM.</div>')+
  exclui.map(f=>'<div class="small"><strong>'+esc(f.dispositivo)+' (exclui o NCM):</strong> \u201C'+esc(f.trecho)+'\u2B1D</div>').join('')+
  '<div class="small">'+esc(svrsTxt)+'</div>'+
  '<div class="small">'+esc(item)+'</div>'+
  (codigoTxt?'<div class="small">'+esc(codigoTxt)+'</div>':'')+
  (fund?'<div class="small">'+esc(fund)+'</div>':'')+
  (a.status!=='CONFIRMADA'&&a.motivos.length?'<details class="nao-imprimir"><summary>Motivos da confer\xEAncia</summary><ul class="fatos">'+a.motivos.map(m=>'<li>'+esc(m)+'</li>').join('')+'</ul></details>':'')+
  (lei.length>1?'<details class="nao-imprimir"><summary>Todos os itens da lei que cobrem o NCM</summary><ul class="fatos">'+lei.map(f=>'<li>'+esc(f.dispositivo+': '+f.trecho)+'</li>').join('')+'</ul></details>':'')+
  (fontes?'<div class="small">'+fontes+'</div>':'')+
  '<div class="small aud-nota">A confer\xEAncia \xE9 da regra. Se o produto atende \xE0 descri\xE7\xE3o legal continua sendo decis\xE3o humana.</div>'+
 '</div>';
}

/** Linhas sobre a redu\xE7\xE3o sem v\xEDnculo formal: resultado da auditoria do c\xF3digo e D3 (defini\xE7\xE3o aprovada). */
function linhasAuditoriaReducao(a){
 if(!a) return '<div class="small">D3: pol\xEDtica pendente</div>';
 const c=a.codigo||{};
 let h='';
 if(c.comparacao&&c.comparacao.reducao==='concorda'&&c.F2) h+='<div class="small aud-red">Auditoria oficial: o percentual confere com '+esc(c.F1&&c.F1.dispositivo||'a lei')+' e com o SVRS ('+esc(c.F2.percRedIbs)+'% IBS / '+esc(c.F2.percRedCbs)+'% CBS). V\xEDnculo formal ainda n\xE3o registrado (Fase 3).</div>';
 else if(c.comparacao) h+='<div class="aviso-regra">Auditoria oficial: o percentual da base n\xE3o confere com as fontes (redu\xE7\xE3o: '+esc(c.comparacao.reducao)+').</div>';
 h+=a.status==='CONFIRMADA'
  ?'<div class="small">D3: n\xE3o se aplica \u2014 v\xEDnculo NCM \xD7 item conferido na auditoria oficial.</div>'
  :'<div class="small">D3: pol\xEDtica pendente (v\xEDnculo NCM \xD7 item n\xE3o CONFIRMADO).</div>';
 return h;
}

/**
 * Motivo exibido. O motor grava "Benef\xEDcio confirmado na valida\xE7\xE3o" quando h\xE1 resposta SIM; na tela isso \xE9 a
 * valida\xE7\xE3o humana do enquadramento, que \xE9 diferente da confer\xEAncia oficial da regra. O texto gravado n\xE3o muda.
 */
const PREFIXO_SIM='Benef\xEDcio confirmado na valida\xE7\xE3o: ', PREFIXO_VARIOS='Mais de um benef\xEDcio confirmado para o mesmo item: ';
function reformularMotivo(m){
 m=m||'';
 if(m.indexOf(PREFIXO_SIM)===0) return 'Enquadramento confirmado na valida\xE7\xE3o humana: '+m.slice(PREFIXO_SIM.length);
 if(m.indexOf(PREFIXO_VARIOS)===0) return 'Mais de um enquadramento confirmado na valida\xE7\xE3o humana para o mesmo item: '+m.slice(PREFIXO_VARIOS.length);
 return m;
}
function textoMotivo(v){
 const m=v.motivo||'-';
 if(m.indexOf(PREFIXO_SIM)!==0) return reformularMotivo(m);
 const a=v.regraAplicada&&(v.auditoriaExibicao||{})[v.regraAplicada];
 const lei=a&&(a.fatosF1||[]).find(f=>f.papel==='cobre o NCM');
 const oficial=!a?' N\xE3o h\xE1 confer\xEAncia da regra com a fonte oficial dispon\xEDvel.'
  :a.status==='CONFIRMADA'?' A regra foi conferida com a fonte oficial'+(lei?' ('+lei.dispositivo+')':'')+'.'
  :' A regra n\xE3o est\xE1 conferida com a fonte oficial ('+(ROTULO_AUDITORIA[a.status]||a.status)+').';
 return reformularMotivo(m)+' A aplica\xE7\xE3o ao caso concreto foi confirmada pela valida\xE7\xE3o humana (resposta SIM).'+oficial;
}

/* ---------- Fase 2: regra bloqueada por incompatibilidade oficial (s\xF3 exibi\xE7\xE3o; sem SIM/N\xC3O) ---------- */
function blocoBloqueio(b){
 if(!b) return '';
 const lei=(b.fatosF1||[]);
 const svrs=(b.fatosF2||[]);
 return '<div class="bloco bloqueio">'+
  '<div class="bloq-titulo">BLOQUEADA \u2014 incompatibilidade oficial</div>'+
  '<div>Esta regra n\xE3o pode ser selecionada porque o NCM n\xE3o \xE9 compat\xEDvel com este enquadramento segundo a fonte oficial.</div>'+
  '<div class="small">Regra '+esc(b.regraId)+' \xB7 NCM '+esc(b.ncm)+' \xB7 cClassTrib '+esc(b.cClassTrib)+' \xB7 item da base '+esc(b.item||'vazio')+'</div>'+
  '<div class="small">Motivo do bloqueio: '+esc(b.motivo)+'</div>'+
  lei.map(f=>'<div class="small"><strong>'+esc(f.dispositivo)+(f.papel==='exclui o NCM'?' (exclui o NCM)':'')+':</strong> \u201C'+esc(f.trecho)+'\u2B1D</div>').join('')+
  (svrs.length?'<div class="small">SVRS: '+esc([...new Set(svrs.map(f=>f.TipoPermissao+' \u2014 '+f.DescItemAnexo+(f.DescExcecao?' (exce\xE7\xE3o: '+f.DescExcecao+')':'')))].join(' | '))+'</div>':'<div class="small">SVRS: NCM n\xE3o listado para este c\xF3digo.</div>')+
  (b.fontes?'<div class="small">Fontes: <a href="'+esc(b.fontes.F1.url)+'" target="_blank" rel="noopener">LC 214/2025 (Planalto)</a> \u2014 snapshot '+esc(curto(b.fontes.F1.sha256))+' \xB7 <a href="'+esc(b.fontes.F2.url)+'" target="_blank" rel="noopener">SVRS \u2014 Classifica\xE7\xE3o Tribut\xE1ria</a> \u2014 snapshot '+esc(curto(b.fontes.F2.sha256))+'</div>':'')+
  '<div class="small aud-nota">O bloqueio \xE9 da regra para este NCM. Se o produto se enquadra em outra regra continua sendo avaliado pelas demais regras e pela valida\xE7\xE3o humana.</div>'+
 '</div>';
}
function blocosBloqueioDoItem(v){
 const bs=Object.values(v.bloqueiosExibicao||{});
 return bs.map(blocoBloqueio).join('');
}

/* ---------- Quadro da regra: dados do enquadramento e redu\xE7\xE3o da al\xEDquota em destaque (s\xF3 exibi\xE7\xE3o) ---------- */
function pctInteiro(n){ return Number(n).toLocaleString('pt-BR',{maximumFractionDigits:2})+'%'; }
function campoQuadro(rotulo,valor){ return '<div><span class="rotulo">'+rotulo+'</span><span class="valor">'+esc(valor==null||valor===''?'\u2014':valor)+'</span></div>'; }
/**
 * d: { cst, cClassTrib, anexo, item, fundamento, reducao (ReducaoExplicada da regra), auditoria, humano: 'confirmado' | 'pendente' | null }
 * A redu\xE7\xE3o exibida \xE9 a da regra (reducaoAliquota da base, a mesma do motor); IBS e CBS v\xEAm do SVRS quando conferidos.
 */
function quadroRegra(d){
 const a=d.auditoria, o=d.reducao;
 const f2=a&&a.codigo&&a.codigo.F2;
 const item=a&&a.itemOficial!=null
  ?(a.itemOficial===d.item?d.item:(d.item||'vazio')+' (item oficial: '+a.itemOficial+')')
  :a&&a.itensOficiais&&a.itensOficiais.length>1?(d.item||'vazio')+' (itens oficiais poss\xEDveis: '+a.itensOficiais.join(', ')+')':d.item;
 let red='';
 if(o&&o.valor!=null&&o.evidencia!=='nao_determinada'){
   const ibs=f2?f2.percRedIbs:null, cbs=f2?f2.percRedCbs:null;
   const iguais=ibs==null||cbs==null||ibs===cbs;
   red=(iguais?'<div class="red-destaque">Redu\xE7\xE3o da al\xEDquota: '+esc(pct(o.valor))+'</div>':'')+
    (ibs!=null&&cbs!=null?'<div class="'+(iguais?'red-partes':'red-destaque')+'">Redu\xE7\xE3o IBS: '+esc(pctInteiro(ibs))+(iguais?' \xB7 ':'</div><div class="red-destaque">')+'Redu\xE7\xE3o CBS: '+esc(pctInteiro(cbs))+'</div>':'')+
    '<div class="selo '+(o.evidencia==='oficial_confirmada'?'selo-oficial':'selo-aviso')+'">'+
     (o.evidencia==='oficial_confirmada'?'Redu\xE7\xE3o da al\xEDquota \u2014 confirmada oficialmente'
      :o.evidencia==='oficial_divergente'?'Redu\xE7\xE3o da al\xEDquota \u2014 divergente das fontes oficiais'
      :'Redu\xE7\xE3o da al\xEDquota \u2014 n\xE3o confirmada oficialmente (prevista na base normativa)')+'</div>';
 }else if(o){
   red='<div class="small">Redu\xE7\xE3o da al\xEDquota: n\xE3o exibida \u2014 a regra n\xE3o p\xF4de ser identificada com seguran\xE7a.</div>';
 }
 const regra=a?(a.status==='CONFIRMADA'?'Regra conferida com a fonte oficial':(ROTULO_AUDITORIA[a.status]||a.status)):'Sem confer\xEAncia da regra com a fonte oficial';
 const humano=d.humano==='confirmado'?'<div class="selo selo-humano">Enquadramento confirmado na valida\xE7\xE3o humana (resposta SIM nesta an\xE1lise)</div>'
  :d.humano==='pendente'?'<div class="selo selo-pendente">Enquadramento do produto: aguardando valida\xE7\xE3o humana</div>':'';
 const semCadastro=d.semCadastro&&d.semCadastro.total?'<div class="selo selo-sem-cadastro" title="Vendas deste produto sa\xEDram sem o grupo IBS/CBS no XML: o cadastro do produto n\xE3o tem CST nem cClassTrib.">Produto sem informa\xE7\xE3o tribut\xE1ria no cadastro: '+d.semCadastro.total+' venda(s) sem CST/cClassTrib'+(d.semCadastro.naoObrigatorios?' ('+d.semCadastro.naoObrigatorios+' n\xE3o obrigat\xF3ria(s) na data)':'')+'</div>':'';
 return '<div class="bloco quadro-regra">'+
  '<span class="rotulo">'+esc(d.titulo||'Enquadramento da regra')+'</span>'+
  '<div class="quadro-campos">'+campoQuadro('CST',d.cst)+campoQuadro('cClassTrib',d.cClassTrib)+campoQuadro('Anexo',d.anexo)+campoQuadro('Item',item)+campoQuadro('Fundamento',d.fundamento)+'</div>'+
  red+
  '<div class="selo '+(a&&a.status==='CONFIRMADA'?'selo-oficial':'selo-aviso')+'">'+esc(regra)+'</div>'+
  humano+semCadastro+
  '<div class="small aud-nota">A confer\xEAncia \xE9 da regra. Se o produto atende \xE0 descri\xE7\xE3o legal continua sendo decis\xE3o humana.</div>'+
 '</div>';
}
/** Resultados: quadro da regra aplicada (base de regra), ou da \xFAnica candidata pendente. */
function quadroRegraResultado(v){
 const r=v.reducaoExibicao;
 if(!r||r.situacao==='regime_especifico') return '';
 let id=null, humano=null;
 if(r.situacao==='aplicada'){
   id=v.regraAplicada;
   humano=(respostas||[]).some(x=>x.resposta==='SIM'&&x.regraId===id&&x.ncm===v.ncm&&(x.cProd===v.cProd||x.cProd===v.produto))?'confirmado':null;
 }else if(r.situacao==='prevista'&&r.opcoes.length===1){ id=r.opcoes[0].regraId; humano='pendente'; }
 if(!id) return '';
 const g=regrasUI[id+'|'+v.ncm]||{};
 const o=r.opcoes.find(x=>x.regraId===id)||null;
 return quadroRegra({cst:(r.situacao==='aplicada'&&v.esperado?v.esperado.cst:g.cst),cClassTrib:(r.situacao==='aplicada'&&v.esperado?v.esperado.cClassTrib:g.cClassTrib),
  anexo:g.anexo,item:g.item,fundamento:g.fundamentoLegal,reducao:o,auditoria:(v.auditoriaExibicao||{})[id],humano:humano,
  titulo:r.situacao==='aplicada'?'Enquadramento da regra aplicada':'Enquadramento proposto (regra candidata)'});
}
function reducaoConfereNaAuditoria(a){ return !!(a&&a.codigo&&a.codigo.comparacao&&a.codigo.comparacao.reducao==='concorda'); }

/** Candidatas com tratamentos diferentes (ex.: 60% e al\xEDquota zero): a escolha muda o resultado fiscal. */
function alertaReducoesDiferentes(valores){
 const vs=[...new Set(valores.filter(x=>x!=null))];
 if(vs.length<2) return '';
 return '<div class="aviso-regra">As regras candidatas t\xEAm tratamentos diferentes \u2014 '+esc(vs.map(textoReducao).join(' e '))+' \u2014: a escolha muda o resultado fiscal. As descri\xE7\xF5es oficiais n\xE3o correspondem automaticamente ao produto \u2014 confira se o produto e o NCM informado no XML correspondem \xE0 descri\xE7\xE3o legal antes de responder.</div>';
}
/** Lacuna de cobertura: previs\xE3o oficial para o NCM sem regra correspondente na base (nenhuma regra \xE9 criada). */
function alertaLacunas(ls){
 if(!ls||!ls.length) return '';
 return '<div class="aviso-info">H\xE1 previs\xE3o no SVRS para este NCM em '+esc([...new Set(ls.map(l=>l.cClassTrib))].join(', '))+' sem regra correspondente na base normativa (lacuna de cobertura; D5 pendente). Nenhuma regra foi criada.</div>';
}
/** Resultados: confer\xEAncia da regra aplicada, ou resumo das candidatas. */
function blocoAuditoriaResultado(v){
 const au=v.auditoriaExibicao||{};
 const r=v.reducaoExibicao;
 let h='';
 if(v.regraAplicada&&au[v.regraAplicada]) h+=blocoAuditoria(au[v.regraAplicada]);
 else if(r&&r.situacao==='prevista'&&r.opcoes.length){
   h+='<div class="bloco aud"><span class="rotulo">Confer\xEAncia das regras candidatas com a fonte oficial</span>'+
    r.opcoes.map(o=>{const a=au[o.regraId];return '<div class="small">'+esc(o.regraId)+' \u2014 '+esc(a?(ROTULO_AUDITORIA[a.status]||a.status):'sem confer\xEAncia dispon\xEDvel')+(a?alertasDaAuditoria(a).map(t=>'<div class="aviso-regra">'+esc(t)+'</div>').join(''):'')+'</div>';}).join('')+
    '<div class="small aud-nota">A confer\xEAncia \xE9 da regra. Se o produto atende \xE0 descri\xE7\xE3o legal continua sendo decis\xE3o humana (tela Pend\xEAncias).</div></div>';
   h+=alertaReducoesDiferentes(r.opcoes.map(o=>o.valor));
 }
 h+=alertaLacunas(v.lacunasDeCobertura);
 return h;
}

function celulaEsperada(inf,esp,v){
 if(esp==null) return '<td class="indefinido">'+(v.estado==='REQUER_VALIDACAO'?'depende da valida\xE7\xE3o':'-')+'</td>';
 return '<td class="'+((inf||'')===esp?'igual':'difere')+'">'+esc(esp)+'</td>';
}

/**
 * Resultados em lista compacta: produto e situa\xE7\xE3o (\xE0 direita) \u2192 informado (base, atual) \u2192 enquadramento (correto, economia) \u2192 redu\xE7\xE3o. A auditoria (origem,
 * evid\xEAncia, fontes, textos da lei e do SVRS, bloqueios completos, alertas) fica recolhida e s\xF3 \xE9 montada ao abrir.
 * Os dados recebidos da API n\xE3o mudam.
 */
function chip(rotulo,valor,classe){ return '<span class="chip'+(classe?' '+classe:'')+'"><span class="chip-r">'+rotulo+'</span> '+esc(valor==null||valor===''?'\u2014':valor)+'</span>'; }
function classeComparada(inf,esp,v){
 if(esp==null) return v.estado==='REQUER_VALIDACAO'?'chip-indef':'';
 return (inf||'')===esp?'chip-igual':'chip-difere';
}
/** Regra que o cart\xE3o resume: a aplicada, ou a \xFAnica candidata pendente. */
function regraDoCartao(v){
 const r=v.reducaoExibicao;
 if(v.regraAplicada&&r&&r.situacao==='aplicada') return {id:v.regraAplicada,situacao:'aplicada',opcao:r.opcoes[0]||null};
 if(r&&r.situacao==='prevista'&&r.opcoes.length===1) return {id:r.opcoes[0].regraId,situacao:'prevista',opcao:r.opcoes[0]};
 return null;
}
function linhaInformado(v){
 const inf=v.informado||{};
 return '<span class="r-lbl">Informado</span>'+chip('CST',inf.cst)+chip('cClassTrib',inf.cClassTrib);
}
function linhaEnquadramento(v){
 if(v.estado==='INCORRETO_NCM') return '<span class="r-lbl">Esperado</span><strong class="INCORRETO_NCM">AJUSTAR O NCM \u2014 sem enquadramento para o NCM informado</strong>';
 const inf=v.informado||{};
 const r=v.reducaoExibicao, rc=regraDoCartao(v);
 if(r&&r.situacao==='regime_especifico'&&r.regimeEspecifico){
   return '<span class="r-lbl">Esperado</span>'+chip('CST',v.esperado&&v.esperado.cst,classeComparada(inf.cst,v.esperado&&v.esperado.cst,v))+chip('cClassTrib',v.esperado&&v.esperado.cClassTrib,classeComparada(inf.cClassTrib,v.esperado&&v.esperado.cClassTrib,v))+chip('Regime',r.regimeEspecifico.fundamento);
 }
 if(rc){
   const g=regrasUI[rc.id+'|'+v.ncm]||{};
   const a=(v.auditoriaExibicao||{})[rc.id];
   const item=a&&a.itemOficial!=null&&a.itemOficial!==g.item?(g.item||'vazio')+' (oficial '+a.itemOficial+')':g.item;
   const cst=rc.situacao==='aplicada'&&v.esperado?v.esperado.cst:g.cst, cls=rc.situacao==='aplicada'&&v.esperado?v.esperado.cClassTrib:g.cClassTrib;
   return '<span class="r-lbl">'+(rc.situacao==='aplicada'?'Enquadramento':'Proposto')+'</span>'+
    chip('CST',cst,rc.situacao==='aplicada'?classeComparada(inf.cst,cst,v):'chip-indef')+chip('cClassTrib',cls,rc.situacao==='aplicada'?classeComparada(inf.cClassTrib,cls,v):'chip-indef')+
    chip('Anexo',g.anexo)+chip('Item',item)+chip('Fund.',g.fundamentoLegal);
 }
 if(r&&r.situacao==='prevista'&&r.opcoes.length>1) return '<span class="r-lbl">'+r.opcoes.length+' regras candidatas</span><span class="small">(escolha na tela Pend\xEAncias)</span>';
 const esp=v.esperado;
 if(!esp&&(v.regrasCandidatas||[]).length) return '<span class="r-lbl">Esperado</span><span class="small">REQUER VALIDA\xC7\xC3O \u2014 '+v.regrasCandidatas.length+' regra(s) candidata(s) (escolha na tela Pend\xEAncias)</span>';
 return esp?'<span class="r-lbl">Esperado</span>'+chip('CST',esp.cst,classeComparada(inf.cst,esp.cst,v))+chip('cClassTrib',esp.cClassTrib,classeComparada(inf.cClassTrib,esp.cClassTrib,v)):'<span class="small">sem enquadramento esperado</span>';
}
function linhaReducao(v){
 const r=v.reducaoExibicao;
 if(!r) return '';
 if(r.situacao==='regime_especifico'&&r.regimeEspecifico) return '<span class="r-lbl">Redu\xE7\xE3o da al\xEDquota</span><b class="r-red">'+esc(pct(r.regimeEspecifico.valor))+'</b><span class="small">regime espec\xEDfico do motor</span>';
 const rc=regraDoCartao(v);
 if(!rc){
   const vs=[...new Set(r.opcoes.filter(o=>o.valor!=null&&o.evidencia!=='nao_determinada').map(o=>o.valor))];
   if(!vs.length) return '';
   return '<span class="r-lbl">Redu\xE7\xF5es poss\xEDveis</span><b class="r-red">'+esc(vs.map(pct).join(' \xB7 '))+'</b>'+(vs.length>1?'<span class="selo selo-aviso">tratamentos diferentes: a escolha muda o resultado</span>':'');
 }
 const o=rc.opcao, a=(v.auditoriaExibicao||{})[rc.id], f2=a&&a.codigo&&a.codigo.F2;
 if(!o||o.valor==null||o.evidencia==='nao_determinada') return '<span class="r-lbl">Redu\xE7\xE3o da al\xEDquota</span><span class="small">n\xE3o exibida (regra n\xE3o identificada com seguran\xE7a)</span>';
 if(v.estado==='INCORRETO_ECONOMIA'&&r.coerenciaEconomia===false) return '<span class="r-lbl">Redu\xE7\xE3o da al\xEDquota</span><span class="small">n\xE3o confirmada para este item (economia do motor n\xE3o confere com o percentual)</span>';
 const ibsCbs=f2?(f2.percRedIbs===f2.percRedCbs?' \xB7 IBS '+pctInteiro(f2.percRedIbs)+' \xB7 CBS '+pctInteiro(f2.percRedCbs):' \xB7 <b>IBS '+pctInteiro(f2.percRedIbs)+'</b> \xB7 <b>CBS '+pctInteiro(f2.percRedCbs)+'</b>'):'';
 const oficial=a&&a.status==='CONFIRMADA'&&o.evidencia==='oficial_confirmada'?'<span class="selo selo-oficial">\u2713 conferida com a fonte oficial</span>'
  :'<span class="selo selo-aviso">'+esc(a?(ROTULO_AUDITORIA[a.status]||a.status):'sem confer\xEAncia oficial')+'</span>';
 const sim=rc.situacao==='aplicada'&&(respostas||[]).some(x=>x.resposta==='SIM'&&x.regraId===rc.id&&x.ncm===v.ncm&&(x.cProd===v.cProd||x.cProd===v.produto));
 const humano=sim?'<span class="selo selo-humano r-humano">\u2713 enquadramento confirmado na valida\xE7\xE3o humana</span>':rc.situacao==='prevista'?'<span class="selo selo-pendente r-humano">aguardando valida\xE7\xE3o humana</span>':'';
 return '<span class="r-lbl">Redu\xE7\xE3o da al\xEDquota</span><b class="r-red">'+esc(pct(o.valor))+'</b>'+ibsCbs+oficial+humano;
}
function valoresInformados(v){
 const vv=x=>x==null?'\u2014':formatarNumero(x);
 return '<span><span class="r-lbl">Base</span>'+formatarNumero(v.baseCalculo||0)+'</span>'+'<span><span class="r-lbl">Atual</span>'+vv(v.valorInformadoTotal)+'</span>';
}
function valoresEnquadramento(v){
 const vv=x=>x==null?'\u2014':formatarNumero(x);
 const partes=['<span><span class="r-lbl">'+(v.estado==='CORRETO'&&v.regraAplicada?'Calculado (sem redu\xE7\xE3o)':'Correto')+'</span>'+vv(v.valorCorreto)+'</span>'];
 if(v.economiaPotencial!=null) partes.push(v.economiaPotencial<0
   ?'<span class="r-a-pagar"><span class="r-lbl">Valor a pagar</span>'+formatarNumero(-v.economiaPotencial)+'</span>'
   :'<span class="'+(v.economiaPotencial>0?'r-economia':'')+'"><span class="r-lbl">Economia</span>'+formatarNumero(v.economiaPotencial)+'</span>');
 // No rec\xE1lculo com valor a pagar, a exposi\xE7\xE3o \xE9 o pr\xF3prio valor a pagar (j\xE1 exibido acima)
 if(v.exposicao!=null&&!(v.economiaPotencial!=null&&v.economiaPotencial<0)) partes.push('<span class="r-exposicao"><span class="r-lbl">Exposi\xE7\xE3o</span>'+formatarNumero(v.exposicao)+'</span>');
 return partes.join('');
}
function avisosCompactos(v){
 const av=[];
 const bl=Object.values(v.bloqueiosExibicao||{});
 if(bl.length) av.push('<span class="selo selo-bloqueio">BLOQUEADA \u2014 incompatibilidade oficial: '+esc(bl.map(b=>b.regraId).join(', '))+'</span>');
 if((v.lacunasDeCobertura||[]).length) av.push('<span class="selo selo-info">previs\xE3o oficial sem regra na base ('+esc([...new Set(v.lacunasDeCobertura.map(l=>l.cClassTrib))].join(', '))+'; D5)</span>');
 if(v.reducaoIndisponivel&&(v.regraAplicada||(v.regrasCandidatas||[]).length)) av.push('<span class="small">Redu\xE7\xE3o indispon\xEDvel: '+esc(v.reducaoIndisponivel)+'</span>');
 return av.length?'<div class="r-linha">'+av.join('')+'</div>':'';
}
/** Conte\xFAdo da auditoria do item, montado s\xF3 quando o usu\xE1rio abre "Auditoria e fontes". */
const FONTES_LEGAIS={
 lc214:'LC 214/2025 (texto do Planalto, com as altera\xE7\xF5es da LC 227/2026): https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm',
 svrs:'Portal da Conformidade F\xE1cil (SVRS) \u2014 Classifica\xE7\xE3o Tribut\xE1ria: https://dfe-portal.svrs.rs.gov.br/Cff/ClassificacaoTributaria',
 obrigatoriedade:'Ato Conjunto RFB/CGIBS n\xBA 4/2026: grupo IBS/CBS obrigat\xF3rio na NF-e/NFC-e do regime normal desde 03/08/2026',
 dispensa:'LC 214/2025, art. 348, \xA7 1\xBA: em 2026 o recolhimento s\xF3 \xE9 dispensado se cumpridas as obriga\xE7\xF5es acess\xF3rias'
};
function textoPct(x){ return x==null?'-':Math.round(x*100)+'%'; }
function textoRegraCandidata(id,ncm){
 const g=regrasUI[id+'|'+ncm]||{};
 return (g.cst||'?')+'/'+(g.cClassTrib||'?')+' \u2014 '+(g.rotulo||id)+' (Anexo '+(g.anexo||'?')+', item '+(g.item||'?')+'; redu\xE7\xE3o '+textoPct(g.reducao)+'; '+(g.fundamentoLegal||'fundamento n\xE3o informado')+(g.vigenciaInicio?'; vig\xEAncia desde '+g.vigenciaInicio:'')+')';
}
/** Produto \u2192 XML \u2192 problema \u2192 enquadramento esperado \u2192 fundamento \u2192 impacto, s\xF3 com o que o veredito e a base trazem. */
function blocoDiagnosticoRisco(v){
 if(v.estado!=='INCORRETO_RISCO') return '';
 const inf=v.informado||{};
 const ausente=inf.cst==null&&inf.cClassTrib==null;
 const problema=ausente
  ?'Grupo IBS/CBS ausente no item: o documento n\xE3o informa CST nem cClassTrib, obrigat\xF3rios na data de emiss\xE3o.'
  :/^C\xF3digo .* no lugar do regime/.test(v.motivo)
   ?'O documento usa outro benef\xEDcio no lugar do regime espec\xEDfico de bares e restaurantes.'
   :'O documento usa o cClassTrib '+(inf.cClassTrib||'?')+', sem regra que o ampare para o NCM '+(v.ncm||'?')+'.';
 const cands=(v.regrasCandidatas||[]);
 const esperado=v.esperado
  ?esc(v.esperado.cst+'/'+v.esperado.cClassTrib)+(v.regraAplicada&&regrasUI[v.regraAplicada+'|'+v.ncm]?' \u2014 '+esc(textoRegraCandidata(v.regraAplicada,v.ncm)):(v.regraAplicada&&/^LC/.test(v.regraAplicada)?' \u2014 '+esc(v.regraAplicada):' \u2014 regra geral (sem benef\xEDcio aplic\xE1vel)'))
  :'<strong>REQUER VALIDA\xC7\xC3O</strong>: '+(cands.length?'o NCM admite '+cands.length+' enquadramento(s) com benef\xEDcio; sem confirma\xE7\xE3o, vale a regra geral 000/000001. Candidatas:<ul>'+cands.map(id=>'<li>'+esc(textoRegraCandidata(id,v.ncm))+'</li>').join('')+'</ul>Responda SIM/N\xC3O na tela Pend\xEAncias.':'sem regra candidata.');
 const fundamentos=[];
 if(ausente){ fundamentos.push(FONTES_LEGAIS.obrigatoriedade); fundamentos.push(FONTES_LEGAIS.dispensa); }
 if(v.regraAplicada&&regrasUI[v.regraAplicada+'|'+v.ncm]) fundamentos.push((regrasUI[v.regraAplicada+'|'+v.ncm].fonte||'')+' \u2014 '+(regrasUI[v.regraAplicada+'|'+v.ncm].fundamentoLegal||''));
 cands.forEach(id=>{ const g=regrasUI[id+'|'+v.ncm]; if(g&&g.fonte) fundamentos.push(g.fonte+' \u2014 '+(g.fundamentoLegal||'')); });
 fundamentos.push(FONTES_LEGAIS.lc214); fundamentos.push(FONTES_LEGAIS.svrs);
 const impacto=v.exposicao!=null
  ?formatarNumero(v.exposicao)+(v.esperado?' de IBS/CBS devido pelo enquadramento esperado, sem destaque no documento.':' de IBS/CBS devido no m\xEDnimo (considerando a maior redu\xE7\xE3o entre as candidatas); o valor final depende da valida\xE7\xE3o.')
  :'n\xE3o calculado (sem al\xEDquota vigente ou sem enquadramento determin\xE1vel).';
 return '<div class="card aud-risco"><h4>Diagn\xF3stico do INCORRETO \u2014 risco</h4>'+
  '<div class="small"><strong>No XML:</strong> NCM '+esc(v.ncm||'-')+' \xB7 CST '+esc(inf.cst??'ausente')+' \xB7 cClassTrib '+esc(inf.cClassTrib??'ausente')+' \xB7 base '+formatarNumero(v.baseCalculo)+' \xB7 IBS/CBS informado '+(v.valorInformadoTotal==null?'n\xE3o informado':formatarNumero(v.valorInformadoTotal))+'</div>'+
  '<div class="small"><strong>Problema identificado:</strong> '+esc(problema)+'</div>'+
  '<div class="small"><strong>Enquadramento esperado:</strong> '+esperado+'</div>'+
  '<div class="small"><strong>NCM:</strong> '+esc(v.motivo.includes('A descri\xE7\xE3o indica')?'poss\xEDvel diverg\xEAncia entre a descri\xE7\xE3o e o NCM (ver motivo); REQUER VALIDA\xC7\xC3O do NCM.':'sem ind\xEDcio de NCM incorreto na descri\xE7\xE3o; mantido '+(v.ncm||'-')+'.')+'</div>'+
  '<div class="small"><strong>Impacto tribut\xE1rio potencial:</strong> '+impacto+'</div>'+
  '<div class="small"><strong>Fontes:</strong><ul>'+[...new Set(fundamentos)].map(f=>'<li>'+esc(f)+'</li>').join('')+'</ul></div>'+
 '</div>';
}
/** Respostas SIM/N\xC3O j\xE1 registradas para o produto, com os mesmos bot\xF5es para revisar a resposta. */
function blocoRespostasRegistradas(v){
 const rs=(respostas||[]).filter(r=>r.ncm===v.ncm&&(r.cProd===v.cProd||r.cProd===v.produto));
 if(!rs.length) return '';
 return '<div class="card aud-resposta"><h4>Resposta registrada nesta an\xE1lise</h4>'+rs.map(r=>{
  const g=regrasUI[r.regraId+'|'+r.ncm]||{};
  return '<div class="small"><strong>'+(r.resposta==='NAO'?'N\xC3O':'SIM')+'</strong> para '+esc(textoRegraCandidata(r.regraId,r.ncm))+' \xB7 '+esc(r.autor||'')+' \xB7 '+esc(r.data||'')+'</div>'+
   (g.descricaoLegal?'<div class="small">A regra exige: \u201C'+esc(g.descricaoLegal)+'\u201D. Confira se o produto \u201C'+esc(v.produto)+'\u201D atende a essa descri\xE7\xE3o.</div>':'')+
   '<div class="barra"><span class="small">Revisar a resposta:</span>'+
   '<button class="secondary'+(r.resposta==='SIM'?' validacao-selecionada':'')+'" data-validar="SIM" data-ncm="'+esc(r.ncm)+'" data-cprod="'+esc(r.cProd)+'" data-regra="'+esc(r.regraId)+'">SIM</button>'+
   '<button class="secondary'+(r.resposta==='NAO'?' validacao-selecionada':'')+'" data-validar="NAO" data-ncm="'+esc(r.ncm)+'" data-cprod="'+esc(r.cProd)+'" data-regra="'+esc(r.regraId)+'">N\xC3O</button></div>';
 }).join('')+'</div>';
}
function explicacaoComposicao(c,r){
 if(!c||r.xmls===r.documentos&&!c.eventos.length&&!c.descartados.length&&!c.naoReconhecidos.length) return '';
 const partes=[];
 if(c.eventos.length) partes.push(c.eventos.length+' XML(s) de evento (n\xE3o s\xE3o documentos de venda): '+c.eventos.map(e=>e.arquivo+' \u2014 '+e.tipo).join('; '));
 if(c.naoReconhecidos.length) partes.push(c.naoReconhecidos.length+' XML(s) n\xE3o reconhecido(s): '+c.naoReconhecidos.map(x=>x.arquivo+' \u2014 '+x.motivo).join('; '));
 Object.entries(c.descartadosPorMotivo||{}).forEach(([m,n])=>partes.push(n+' documento(s) descartado(s): '+m));
 const lidos=c.documentosLidos;
 return '<div class="aviso composicao-xmls"><strong>XMLs processados: '+c.arquivos+' \xB7 Documentos analisados: '+c.documentosAnalisados+' \xB7 Diferen\xE7a: '+(c.arquivos-c.documentosAnalisados)+'</strong>'+
  '<div class="small">'+c.arquivos+' XML(s) lidos = '+lidos+' documento(s) fiscal(is)'+(c.eventos.length?' + '+c.eventos.length+' evento(s)':'')+(c.naoReconhecidos.length?' + '+c.naoReconhecidos.length+' n\xE3o reconhecido(s)':'')+'. Dos '+lidos+' documentos, '+(lidos-c.documentosAnalisados)+' foram descartados e '+c.documentosAnalisados+' analisados.</div>'+
  '<details><summary>Ver o motivo de cada diferen\xE7a</summary><ul>'+partes.map(p=>'<li class="small">'+esc(p)+'</li>').join('')+
  (c.descartados.length?'<li class="small">Documentos descartados: '+c.descartados.map(d=>esc(d.documento+' ('+d.motivo+')')).join('; ')+'</li>':'')+'</ul></details></div>';
}
function auditoriaDetalhadaResultado(v){
 return blocoDiagnosticoRisco(v)+blocoRespostasRegistradas(v)+
  '<div class="small">Documento '+esc(v.documento)+' \xB7 item '+esc(v.nItem)+' \xB7 regra aplicada: '+esc(v.regraAplicada||'nenhuma')+'</div>'+
  '<div class="small">Benef\xEDcio / enquadramento: '+esc(beneficioDoItem(v))+'</div>'+
  quadroRegraResultado(v)+blocoReducao(v)+blocoAuditoriaResultado(v)+blocosBloqueioDoItem(v)+
  '<div class="small">Por que este resultado: '+esc(textoMotivo(v))+'</div>'+
  (v.dadosFaltantes&&v.dadosFaltantes.length?'<div class="small">Dados faltantes: '+esc(v.dadosFaltantes.join(', '))+'</div>':'')+
  (alertasUI.porItemHtml[v.documento+'|'+v.nItem]||'');
}
/** Aviso destacado: a valida\xE7\xE3o indicou NCM errado; o cadastro do produto precisa ser ajustado no ERP. */
function avisoAjusteNcm(v){
 if(v.estado!=='INCORRETO_NCM'&&!v.ncmACorrigir) return '';
 return '<div class="aviso-ncm" role="alert"><strong>\u26A0 AJUSTAR O NCM DO PRODUTO</strong>'+
  '<span>A valida\xE7\xE3o indicou que o NCM '+esc(v.ncm||'')+' informado est\xE1 errado. Corrija o NCM no cadastro do produto no ERP e reprocesse com as novas notas. Nenhum benef\xEDcio de outro NCM \xE9 aplicado.</span></div>';
}
function cartaoResultado(v,i){
 const red=linhaReducao(v);
 return '<div class="item-res compacto" data-estado="'+esc(v.estado)+'">'+avisoAjusteNcm(v)+
  '<div class="r-cab">'+
   '<div class="r-cab-esq"><span class="r-prod">'+esc(v.produto)+'</span><span class="small">cProd '+esc(v.cProd||'-')+'</span>'+chip('NCM',v.ncm)+'</div>'+
   '<div class="r-cab-dir"><span class="small">Valida\xE7\xE3o: '+esc(validacaoDoItem(v))+'</span><span class="status status-selo '+esc(v.estado)+'" title="'+esc(v.estado)+'">'+esc(ROTULO_ESTADO[v.estado]||v.estado)+'</span></div>'+
  '</div>'+
  '<div class="r-par r-inf"><div class="r-esq">'+linhaInformado(v)+'</div><div class="r-dir">'+valoresInformados(v)+'</div></div>'+
  '<div class="r-par r-enq"><div class="r-esq"><span class="r-seta">\u21B3</span>'+linhaEnquadramento(v)+'</div><div class="r-dir">'+valoresEnquadramento(v)+'</div></div>'+
  (red?'<div class="r-linha r-reducao">'+red+'</div>':'')+
  avisosCompactos(v)+
  '<div class="r-motivo small" title="'+esc(textoMotivo(v))+'">'+esc(reformularMotivo(v.motivo))+'</div>'+
  '<details class="nao-imprimir aud-det" data-aud="'+i+'"><summary>Auditoria e fontes</summary><div class="aud-conteudo"></div></details>'+
 '</div>';
}
document.addEventListener('toggle',e=>{
 const d=e.target;
 if(!d||!d.matches||!d.matches('details[data-aud]')||!d.open) return;
 const c=d.querySelector('.aud-conteudo');
 if(c&&!c.dataset.pronto){ const v=resultadosFiltrados[+d.dataset.aud]; if(v){ c.innerHTML=auditoriaDetalhadaResultado(v); c.dataset.pronto='1'; } }
},true);


let geracaoPendentes=0;
async function carregarPendentes(){
 const minha=++geracaoPendentes;
 const seqAoBuscar=seqValidacao;
 const t0=Date.now();
 // Contagem de uma lista anterior n\xE3o fica na tela enquanto esta carrega
 document.getElementById('contagemPendencias').textContent='Carregando pend\xEAncias...';
 if(!pendentes.length) document.getElementById('listaPendentes').innerHTML='<p>Carregando pend\xEAncias...</p>';
 try{
   const r=await fetch('/api/fila-validacao');
   const lista=await r.json();
   if(!r.ok) throw new Error(lista.detalhe||lista.erro||'HTTP '+r.status);
   // Resposta de uma busca mais antiga que outra j\xE1 mostrada: descartada
   if(minha!==geracaoPendentes) return;
   for(const p of lista){
     const e=validacoes.get(chaveValidacao(p.ncm,p.cProd));
     if(!e) continue;
     // Escolha sendo gravada, ou feita depois do in\xEDcio desta busca: vale a da tela, n\xE3o a do servidor
     if(e.salvando>0||e.alteradoEm>seqAoBuscar) p.respostasDestaAnalise=e.exibidas.slice();
     else e.confirmadas=e.exibidas=(p.respostasDestaAnalise||[]).slice();
   }
   pendentes=lista;
   console.info('[pendencias] '+lista.length+' produto(s) em '+(Date.now()-t0)+' ms');
   renderPendentes();
 }catch(e){
   console.error('[pendencias] falhou',e);
   if(minha!==geracaoPendentes) return;
   document.getElementById('listaPendentes').innerHTML='<p>N\xE3o foi poss\xEDvel carregar as pend\xEAncias: '+esc(e.message)+'. Abra a aba de novo; se continuar, recarregue a p\xE1gina.</p>';
 }
}

function textoRegra(g){
 if(!g.rotulo) return g.id;
 const anexo=g.anexo?'Anexo '+g.anexo:'';
 const local=(anexo&&!g.rotulo.includes(anexo)?anexo:'')+(g.item?(anexo&&!g.rotulo.includes(anexo)?', ':'')+'item '+g.item:'');
 return g.rotulo+(local?' ('+local+')':'');
}
function descricaoRegra(g){ return esc(textoRegra(g)); }

/** Status da evid\xEAncia da redu\xE7\xE3o, a partir da estrutura do explicador (sem outra l\xF3gica). */
function statusEvidenciaReducao(o){
 if(o.evidencia==='oficial_confirmada') return {texto:'Confirmada oficialmente para este cClassTrib',fatos:o.fatos,extra:''};
 if(o.evidencia==='oficial_divergente') return {texto:'Divergente das fontes oficiais para este cClassTrib',fatos:o.fatos,extra:o.motivo||''};
 return {texto:'N\xE3o confirmada oficialmente para este cClassTrib (benef\xEDcio previsto na base normativa)',fatos:[],extra:''};
}

/** Bloco da redu\xE7\xE3o prevista na regra candidata. Nada \xE9 recalculado: o valor vem de regrasDetalhe[].reducao. */
function blocoReducaoPrevista(g,p){
 const o=g.reducao;
 if(!o){
   return '<div class="bloco"><span class="rotulo">Redu\xE7\xE3o da al\xEDquota IBS/CBS prevista na regra</span>'+
    '<div class="small">Redu\xE7\xE3o indispon\xEDvel'+(p.reducaoIndisponivel?': '+esc(p.reducaoIndisponivel):'')+'.</div></div>';
 }
 if(o.evidencia==='nao_determinada'||o.valor==null){
   return '<div class="bloco reducao-prev nao-determinada"><span class="rotulo">Redu\xE7\xE3o da al\xEDquota IBS/CBS prevista na regra</span>'+
    '<div>N\xE3o exibida: a regra n\xE3o p\xF4de ser identificada com seguran\xE7a.</div><div class="small">'+esc(o.motivo||'')+'</div></div>';
 }
 const st=statusEvidenciaReducao(o);
 return '<div class="bloco reducao-prev'+(o.evidencia==='oficial_confirmada'?'':' sem-evidencia')+'">'+
  '<span class="rotulo">Redu\xE7\xE3o da al\xEDquota IBS/CBS prevista na regra</span>'+
  '<div class="valor-grande">'+esc(textoReducao(o.valor))+'</div>'+
  '<div class="small">Al\xEDquota resultante prevista: '+esc(textoResultante(o.valor))+'</div>'+
  '<div><span class="rotulo">Status da evid\xEAncia da redu\xE7\xE3o</span>'+esc(st.texto)+'</div>'+
  (st.extra?'<div class="small">'+esc(st.extra)+'</div>':'')+
  (st.fatos.length?'<div class="small">Fontes oficiais:</div>'+listaFatos(st.fatos):'')+
  (o.evidencia==='sem_evidencia_oficial'?linhasAuditoriaReducao(g.auditoria):'')+
 '</div>';
}

function campoProposto(rotulo,valor){
 return '<div><span class="rotulo">'+rotulo+'</span><span class="valor">'+esc(valor==null?'n\xE3o dispon\xEDvel na base':valor)+'</span></div>';
}

/** Regra encontrada pelo NCM e rejeitada para o produto: mostra a regra, a redu\xE7\xE3o prevista e por que n\xE3o se aplica. */
function regraNaoAplicavel(g,p){ return (p.regrasNaoAplicaveis||[]).find(x=>x.regraId===g.id)||null; }
function blocoRegraNaoAplicavel(g,x,p){
 const pc=v=>Math.round((v||0)*100)+'%';
 return '<div class="regra-cand regra-nao-aplicavel">'+
  '<div class="small">Regra encontrada pelo NCM: '+esc(g.id)+'</div>'+
  '<div class="bloco"><span class="rotulo">Descri\xE7\xE3o legal do benef\xEDcio</span><div class="descricao-legal">'+esc(g.descricaoLegal||'')+'</div></div>'+
  '<div class="nao-aplicavel-quadro">'+
   '<div><span class="rotulo">Regra encontrada pelo NCM</span>CST '+esc(x.cst)+' / cClassTrib '+esc(x.cClassTrib)+' / Anexo '+esc(x.anexo)+' / Item '+esc(x.item||'?')+'</div>'+
   '<div><span class="rotulo">Redu\xE7\xE3o prevista na regra</span>'+pc(x.reducaoPrevista)+' IBS / '+pc(x.reducaoPrevista)+' CBS</div>'+
   '<div class="selo selo-nao-aplicavel">Resultado da valida\xE7\xE3o: N\xC3O APLIC\xC1VEL AO PRODUTO</div>'+
   '<div class="small"><strong>Motivo:</strong> o benef\xEDcio \xE9 espec\xEDfico para '+esc(x.designacaoLegal)+'. A descri\xE7\xE3o do produto ("'+esc(p.produto)+'") n\xE3o atende, por si s\xF3, \xE0 descri\xE7\xE3o legal. A redu\xE7\xE3o de '+pc(x.reducaoPrevista)+' n\xE3o \xE9 aplicada; o enquadramento correto \xE9 procurado entre as demais hip\xF3teses.</div>'+
  '</div>'+
 '</div>';
}
/** Uma regra candidata: descri\xE7\xE3o legal, enquadramento proposto, redu\xE7\xE3o prevista e a pergunta. */
function blocoRegraCandidata(g,p,i,total){
 const naoAplicavel=regraNaoAplicavel(g,p);
 if(naoAplicavel) return blocoRegraNaoAplicavel(g,naoAplicavel,p);
 const resp=(p.respostasDestaAnalise||[]).filter(x=>x.regraId===g.id);
 const respostaAtual=resp.length?resp[resp.length-1].resposta:null;
 const classeSim=respostaAtual==='SIM'?' validacao-selecionada':'';
 const classeNao=respostaAtual==='NAO'?' validacao-selecionada':'';
 const descricao=g.descricaoLegal!=null
  ?'<div class="descricao-legal">'+esc(g.descricaoLegal)+'</div>'
  :(g.descricoesLegaisDivergentes&&g.descricoesLegaisDivergentes.length
    ?'<div class="small">A base tem '+esc(g.regrasComEsteIdentificador)+' regras com este identificador, com descri\xE7\xF5es legais diferentes:</div><ul class="descricoes">'+g.descricoesLegaisDivergentes.map(d=>'<li>'+esc(d)+'</li>').join('')+'</ul>'
    :'<div class="small">Descri\xE7\xE3o legal n\xE3o dispon\xEDvel na base para esta regra.</div>');
 const duplicado=g.identificadorRepetido
  ?'<div class="aviso-regra">Aten\xE7\xE3o: o identificador '+esc(g.id)+' corresponde a '+esc(g.regrasComEsteIdentificador)+' regras na base; a regra n\xE3o p\xF4de ser identificada com seguran\xE7a. Pelo comportamento atual do motor, um SIM confirma todas elas ao mesmo tempo e o item continua pendente (mais de um benef\xEDcio confirmado).</div>'
  :'';
 return '<div class="regra-cand">'+
  '<div class="small">'+(total>1?'<strong>'+esc(p.produto)+'</strong> (cProd '+esc(p.cProd)+') \xB7 ':'')+'Regra candidata'+(total>1?' '+(i+1)+' de '+total:'')+': '+esc(g.id)+' \u2014 aguardando valida\xE7\xE3o</div>'+
  duplicado+
  '<div class="bloco"><span class="rotulo">Descri\xE7\xE3o legal do benef\xEDcio</span>'+descricao+'</div>'+
  quadroRegra({cst:g.cst,cClassTrib:g.cClassTrib,anexo:g.anexo,item:g.item,fundamento:g.fundamentoLegal,reducao:g.reducao,auditoria:g.auditoria,humano:'pendente',semCadastro:{total:p.itensSemInformacaoTributaria||0,naoObrigatorios:p.itensNaoObrigatoriosSemInformacao||0},titulo:'Enquadramento proposto'})+
    '<details>'+
  '<summary>Detalhes</summary>'+
  blocoAuditoria(g.auditoria)+
  blocoReducaoPrevista(g,p)+
  '</details>'+
  (resp.length?'<div class="small resposta-registrada">Resposta registrada nesta an\xE1lise: '+esc(resp.map(x=>(x.resposta==='NAO'?'N\xC3O':'SIM')+' ('+x.data+')').join(', '))+'</div>':'')+
  (total>1||temMultipla(p)?'':
  '<div class="pergunta-validacao"><span class="rotulo">Pergunta</span>Com base na descri\xE7\xE3o legal acima, o produto atende aos requisitos para este enquadramento?</div>'+
  '<div class="acoes">'+
   '<button class="secondary'+classeSim+'" data-validar="SIM" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">SIM</button>'+
   '<button class="secondary'+classeNao+'" data-validar="NAO" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">N\xC3O</button>'+
  '</div>')+
 '</div>';
}
/** Selos do produto (uma vez por cart\xE3o quando h\xE1 v\xE1rias regras candidatas). */
function selosDoProduto(p){
 const sc=p.itensSemInformacaoTributaria||0, nob=p.itensNaoObrigatoriosSemInformacao||0;
 return '<div class="selos-produto">'+
  '<div class="selo selo-pendente">Enquadramento do produto: aguardando valida\xE7\xE3o humana</div>'+
  (sc?'<div class="selo selo-sem-cadastro" title="Vendas deste produto sa\xEDram sem o grupo IBS/CBS no XML: o cadastro do produto n\xE3o tem CST nem cClassTrib.">Produto sem informa\xE7\xE3o tribut\xE1ria no cadastro: '+sc+' venda(s) sem CST/cClassTrib'+(nob?' ('+nob+' n\xE3o obrigat\xF3ria(s) na data)':'')+'</div>':'')+
 '</div>';
}
/** Uma possibilidade legal dentro do produto agrupado: descri\xE7\xE3o, enquadramento, redu\xE7\xE3o e o SIM desta hip\xF3tese. */
function opcaoEnquadramento(g,p,i){
 const naoAplicavel=regraNaoAplicavel(g,p);
 if(naoAplicavel) return '<li class="enq-opcao">'+blocoRegraNaoAplicavel(g,naoAplicavel,p)+'</li>';
 const resp=(p.respostasDestaAnalise||[]).filter(x=>x.regraId===g.id);
 const respostaAtual=resp.length?resp[resp.length-1].resposta:null;
 const o=g.reducao;
 const red=o&&o.valor!=null&&o.evidencia!=='nao_determinada'?' \xB7 Redu\xE7\xE3o da al\xEDquota: '+pct(o.valor):'';
 const descricao=g.descricaoLegal!=null
  ?'<div class="descricao-legal">'+esc(g.descricaoLegal)+'</div>'
  :(g.descricoesLegaisDivergentes&&g.descricoesLegaisDivergentes.length
    ?'<div class="small">A base tem '+esc(g.regrasComEsteIdentificador)+' regras com este identificador, com descri\xE7\xF5es legais diferentes:</div><ul class="descricoes">'+g.descricoesLegaisDivergentes.map(d=>'<li>'+esc(d)+'</li>').join('')+'</ul>'
    :'<div class="small">Descri\xE7\xE3o legal n\xE3o dispon\xEDvel na base para esta regra.</div>');
 const duplicado=g.identificadorRepetido
  ?'<div class="aviso-regra">Aten\xE7\xE3o: o identificador '+esc(g.id)+' corresponde a '+esc(g.regrasComEsteIdentificador)+' regras na base; a regra n\xE3o p\xF4de ser identificada com seguran\xE7a. Pelo comportamento atual do motor, um SIM confirma todas elas ao mesmo tempo e o item continua pendente (mais de um benef\xEDcio confirmado).</div>'
  :'';
 return '<li class="enq-opcao">'+
  '<div class="enq-cab">CST '+esc(g.cst||'\u2014')+' \xB7 cClassTrib '+esc(g.cClassTrib||'\u2014')+' \xB7 Anexo '+esc(g.anexo||'\u2014')+', item '+esc(g.item||'\u2014')+esc(red)+'</div>'+
  '<div class="small">Regra '+esc(g.id)+(g.fundamentoLegal?' \xB7 Fundamento: '+esc(g.fundamentoLegal):'')+'</div>'+
  duplicado+descricao+
  '<details><summary>Detalhes</summary>'+
   quadroRegra({cst:g.cst,cClassTrib:g.cClassTrib,anexo:g.anexo,item:g.item,fundamento:g.fundamentoLegal,reducao:g.reducao,auditoria:g.auditoria,humano:null,titulo:'Enquadramento proposto'})+
   blocoAuditoria(g.auditoria)+
   blocoReducaoPrevista(g,p)+
  '</details>'+
  (resp.length?'<div class="small resposta-registrada">Resposta registrada nesta an\xE1lise: '+esc(resp.map(x=>(x.resposta==='NAO'?'N\xC3O':'SIM')+' ('+x.data+')').join(', '))+'</div>':'')+
  (temMultipla(p)?'':'<div class="acoes"><button class="secondary'+(respostaAtual==='SIM'?' validacao-selecionada':'')+'" data-validar="SIM" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">SIM \u2014 este enquadramento ('+(i+1)+')</button></div>')+
 '</li>';
}
/** Produto com v\xE1rias regras candidatas: aparece uma vez, com todas as possibilidades legais e uma \xFAnica valida\xE7\xE3o. */
function enquadramentosAgrupados(p,regras){
 const ids=regras.map(g=>g.id);
 return '<div class="enq-agrupados">'+
  '<span class="rotulo">Poss\xEDveis enquadramentos/benef\xEDcios legais ('+regras.length+')</span>'+
  '<ol>'+regras.map((g,i)=>opcaoEnquadramento(g,p,i)).join('')+'</ol>'+
  (temMultipla(p)?'':
  '<div class="pergunta-validacao"><span class="rotulo">Valida\xE7\xE3o</span>'+
  'Com base nas descri\xE7\xF5es legais acima, o produto atende aos requisitos de algum destes enquadramentos? Responda SIM no enquadramento aplic\xE1vel, ou N\xC3O se nenhum se aplica.</div>'+
  '<div class="acoes">'+
   '<button class="secondary" data-validar-lote="NAO" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regras="'+esc(ids.join(','))+'">N\xC3O \u2014 nenhum se aplica</button>'+
  '</div>')+'</div>';
}

/** H\xE1 pergunta de m\xFAltipla escolha para o produto ("O que \xE9 este produto?"). */
function temMultipla(p){ return !!(p&&p.opcoesValidacao&&p.opcoesValidacao.length); }
/** Pergunta de m\xFAltipla escolha: cada op\xE7\xE3o mostra o resultado e o porqu\xEA antes do clique. */
function perguntaMultiplaEscolha(p){
 if(!temMultipla(p)) return '';
 const resp=p.respostasDestaAnalise||[];
 const ult=resp.length?resp[resp.length-1]:null;
 const marcada=o=>!!ult&&(o.tipo==='REGRA'?(ult.resposta==='SIM'&&ult.regraId===o.regraId):ult.escolha===o.tipo);
 const ids=(p.regras||[]).join(',');
 return '<div class="pergunta-multipla">'+
  '<div class="pergunta-validacao"><span class="rotulo">Pergunta</span>O que \xE9 este produto? Escolha a op\xE7\xE3o que corresponde \xE0 realidade. O resultado de cada op\xE7\xE3o aparece ao lado.</div>'+
  '<ol class="mc-opcoes">'+p.opcoesValidacao.map(o=>
   '<li class="mc-opcao'+(o.naoRecomendada?' mc-nao-recomendada':'')+'">'+
    '<button class="secondary'+(marcada(o)?' validacao-selecionada':'')+'" data-escolha="'+esc(o.tipo)+'" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(o.regraId||'')+'" data-regras="'+esc(ids)+'">'+esc(o.rotulo)+'</button>'+
    '<div class="mc-resultado">\u2192 '+esc(o.resultado)+'</div>'+
    '<div class="small">'+esc(o.explicacao)+'</div>'+
    (o.naoRecomendada?'<div class="small mc-alerta">N\xE3o recomendada: '+esc(o.naoRecomendada)+'</div>':'')+
   '</li>').join('')+'</ol>'+
  '<div class="small">N\xE3o sabe? Deixe sem resposta: o produto continua pendente.</div>'+
 '</div>';
}

/* ---------------- Pend\xEAncias do Imposto Seletivo ----------------
 * Funcionam como as pend\xEAncias de IBS/CBS: cada produto do Anexo XVII da LC 214/2025 aguarda a valida\xE7\xE3o; a escolha
 * \xE9 marcada na hora e gravada em seguida (sem reprocessar); na falha volta para a escolha gravada e o card mostra o
 * erro. Os validados ficam em "Validados nesta an\xE1lise", com a escolha marcada e alter\xE1vel. O Relat\xF3rio Final do IS
 * s\xF3 traz os produtos validados. O IS n\xE3o altera nada de IBS/CBS.
 */
let isProdutos=[], isPorChave=new Map(), isGeracao=0;
const estadoIS=new Map();
let seqIS=0;
const ROTULO_IS={INCIDENCIA:'Incide Imposto Seletivo',NAO_INCIDENCIA:'N\xE3o incide Imposto Seletivo',VALIDACAO:'Necessita de valida\xE7\xE3o fiscal'};
/** Validado: o usu\xE1rio respondeu incid\xEAncia ou n\xE3o incid\xEAncia (valida\xE7\xE3o fiscal continua pendente). */
const validadoIS=p=>!!p.escolha&&p.escolha.escolha!=='VALIDACAO';
function mostrarPendencias(qual){
 document.getElementById('pendenciasIbsCbs').hidden=qual!=='ibscbs';
 document.getElementById('pendenciasIS').hidden=qual!=='is';
 document.getElementById('btnPendenciasIbsCbs').classList.toggle('relatorio-final-selecionado',qual==='ibscbs');
 document.getElementById('btnPendenciasIS').classList.toggle('relatorio-final-selecionado',qual==='is');
}
async function carregarDadosIS(){
 const minha=++isGeracao;
 const r=await fetch('/api/imposto-seletivo');
 const d=await lerRespostaJson(r);
 if(!r.ok) throw new Error(d.detalhe||d.erro||'HTTP '+r.status);
 if(minha!==isGeracao) return;
 // Escolha sendo gravada vale sobre a lista rec\xE9m-chegada (resposta fora de ordem n\xE3o desmarca o clique)
 isProdutos=(d.produtos||[]).map(p=>{ const e=estadoIS.get(p.chave); if(e&&e.salvando>0) p.escolhaExibida=e.exibida; return p; });
 isPorChave=new Map(isProdutos.map(p=>[p.chave,p]));
}
/** Pend\xEAncias do IS: s\xF3 produtos cujo NCM est\xE1 no Anexo XVII (os demais n\xE3o t\xEAm IS) ou que o sistema n\xE3o conseguiu enquadrar. */
const pendenciaIS=p=>!!p.categoria||p.situacao==='VALIDACAO';
async function carregarPendenciasIS(){
 const contagem=document.getElementById('contagemPendenciasIS');
 contagem.textContent='Carregando pend\xEAncias...';
 if(!isProdutos.length) document.getElementById('listaPendenciasIS').innerHTML='<p>Carregando pend\xEAncias...</p>';
 const t0=Date.now();
 try{
   await carregarDadosIS();
   // O grupo (aguardando \xD7 validados) \xE9 o da carga, como em IBS/CBS: o card n\xE3o muda de lugar ao clicar
   for(const p of isProdutos) p.validadoNaCarga=validadoIS(p);
   console.info('[pendencias-is] '+isProdutos.filter(pendenciaIS).length+' produto(s) em '+(Date.now()-t0)+' ms');
   renderPendenciasIS();
 }catch(e){
   console.error('[pendencias-is] falhou',e);
   contagem.textContent='';
   document.getElementById('listaPendenciasIS').innerHTML='<p>N\xE3o foi poss\xEDvel carregar as pend\xEAncias do Imposto Seletivo: '+esc(e.message)+'. Abra a aba de novo; se continuar, recarregue a p\xE1gina.</p>';
 }
}
function filtradasIS(){
 const produto=(document.getElementById('buscaPendISProduto').value||'').toLowerCase().trim();
 const cProd=(document.getElementById('buscaPendISCprod').value||'').toLowerCase().trim();
 const ncm=(document.getElementById('buscaPendISNcm').value||'').toLowerCase().trim();
 return isProdutos.filter(p=>pendenciaIS(p)&&
   (!produto||(p.produto||'').toLowerCase().includes(produto))&&
   (!cProd||(p.cProd||'').toLowerCase().includes(cProd))&&
   (!ncm||(p.ncm||'').toLowerCase().includes(ncm)));
}
function renderPendenciasIS(){
 const lista=filtradasIS();
 const aguardando=lista.filter(p=>!p.validadoNaCarga), validados=lista.filter(p=>p.validadoNaCarga);
 document.getElementById('contagemPendenciasIS').textContent=aguardando.length+' pend\xEAncia(s)'+(validados.length?' \xB7 '+validados.length+' validado(s) nesta an\xE1lise':'');
 document.getElementById('listaPendenciasIS').innerHTML=
  (aguardando.length?aguardando.map(cartaoPendenteIS).join(''):'<p>Nenhuma pend\xEAncia de Imposto Seletivo na an\xE1lise atual.</p>')+
  (validados.length?'<h3 class="titulo-validados">Validados nesta an\xE1lise ('+validados.length+')</h3><p class="small">A escolha de cada produto continua marcada e pode ser alterada: clique em outra op\xE7\xE3o.</p>'+validados.map(cartaoPendenteIS).join(''):'');
}
/** Al\xEDquota do IS no formato do relat\xF3rio final (como a al\xEDquota de IBS/CBS). */
const aliquotaIS=p=>p.aliquota&&p.aliquota.aliquota!=null?pct(p.aliquota.aliquota):'N\xE3o determinada';
/** Al\xEDquotas que dependem de condi\xE7\xE3o do produto (MP 1.399/2026, Anexo IV), ex.: "16% se vinho do porto". */
const alternativasIS=p=>(p.alternativas||[]).map(x=>(x.aliquota!=null?pct(x.aliquota):'\u2014')+' se '+x.condicao).join('; ');
function opcoesIS(p){
 const motivo=p.motivos&&p.motivos[0]?p.motivos[0].motivo:'';
 return [
  {tipo:'INCIDENCIA',resultado:'Incide IS'+(p.aliquota&&p.aliquota.aliquota!=null?' \u2014 al\xEDquota '+aliquotaIS(p):'')+(alternativasIS(p)?' (ou '+alternativasIS(p)+')':''),
   explicacao:(p.categoria?p.categoria.nome+': ':'')+'o estabelecimento \xE9 o fabricante ou o importador do produto (primeiro fornecimento).'},
  {tipo:'NAO_INCIDENCIA',resultado:'N\xE3o incide IS',explicacao:p.situacao==='NAO_INCIDENCIA'&&motivo?motivo:'Revenda de mercadoria de terceiros: o IS j\xE1 foi cobrado do fabricante ou do importador.'},
  {tipo:'VALIDACAO',resultado:'Continua pendente',explicacao:'Necessita de valida\xE7\xE3o fiscal: nenhuma al\xEDquota \xE9 atribu\xEDda.'},
 ];
}
function cartaoPendenteIS(p){
 const marcada=p.escolhaExibida!==undefined?p.escolhaExibida:(p.escolha?p.escolha.escolha:null);
 const e=estadoIS.get(p.chave);
 const msg=e&&e.mensagem?'<div class="estado-validacao'+(e.erro?' erro':e.salvando>0?' salvando':'')+'" role="'+(e.erro?'alert':'status')+'">'+esc(e.mensagem)+'</div>':'';
 return '<div class="pendente" data-is-produto="'+esc(p.chave)+'">'+
  '<div class="pend-topo">'+
   '<div><span class="rotulo">Valida\xE7\xE3o do Imposto Seletivo</span>'+
    '<span class="rotulo">Produto</span><strong>'+esc(p.produto)+'</strong>'+(validadoIS(p)?'<span class="selo-validado">Validado nesta an\xE1lise</span>':'')+
    '<div class="small">cProd '+esc(p.cProd)+' \xB7 '+p.itens+' item(ns) \xB7 base '+formatarNumero(p.base)+'</div></div>'+
   '<div class="pend-ncm"><span class="rotulo">NCM</span><span class="valor">'+esc(p.ncm||'\u2014')+'</span></div>'+
  '</div>'+
  '<div class="bloco"><span class="rotulo">Enquadramento no Imposto Seletivo</span>'+
   '<div class="descricao-legal">'+esc(p.categoria?p.categoria.descricaoLegal:'NCM fora do Anexo XVII da LC 214/2025')+'</div>'+
   '<div class="small">Sugest\xE3o do sistema: '+esc(ROTULO_IS[p.sugestao])+'.</div></div>'+
  '<div class="pergunta-multipla">'+
   '<div class="pergunta-validacao"><span class="rotulo">Pergunta</span>Este produto tem incid\xEAncia de Imposto Seletivo nas vendas desta an\xE1lise? O resultado de cada op\xE7\xE3o aparece ao lado.</div>'+
   '<ol class="mc-opcoes">'+opcoesIS(p).map(o=>
    '<li class="mc-opcao">'+
     '<button class="secondary'+(marcada===o.tipo?' validacao-selecionada':'')+'" data-is="'+o.tipo+'" data-chave="'+esc(p.chave)+'">'+esc(ROTULO_IS[o.tipo])+'</button>'+
     '<div class="mc-resultado">\u2192 '+esc(o.resultado)+'</div>'+
     '<div class="small">'+esc(o.explicacao)+'</div>'+
    '</li>').join('')+'</ol>'+
   '<div class="small">N\xE3o sabe? Deixe sem resposta: o produto continua pendente.</div>'+
  '</div>'+
  msg+
  '<details class="nao-imprimir"><summary>Detalhes</summary>'+
   (p.motivos||[]).map(m=>'<p class="small">'+esc(m.motivo)+'</p>').join('')+
   '<p class="small"><strong>Fundamento:</strong> '+esc((p.fundamentos||[]).join('; '))+'</p>'+
   (p.aliquota?'<p class="small"><strong>Al\xEDquota de registro IS:</strong> '+esc(aliquotaIS(p))+' \u2014 '+esc(p.aliquota.regraCalculo)+' Vig\xEAncia: a partir de '+esc(p.aliquota.vigenciaInicio.split('-').reverse().join('/'))+'.'+' Norma: '+esc(p.aliquota.dispositivo)+'.'+(alternativasIS(p)?' Outras al\xEDquotas do c\xF3digo: '+esc(alternativasIS(p))+'.':'')+(p.baseNaVigencia===0?' As vendas desta an\xE1lise s\xE3o anteriores a essa vig\xEAncia: a al\xEDquota n\xE3o \xE9 aplicada a elas.':'')+'</p>':'')+
  '</details>'+
 '</div>';
}
/** Linha do relat\xF3rio final do IS (7 colunas, no formato das demais). */
function linhaRelatorioIS(p){
 const s=p.situacaoFinal;
 const norma=p.categoria?p.categoria.fundamento:'LC 214/2025, art. 409, \xA7 1\xBA, e Anexo XVII';
 if(s==='NAO_INCIDENCIA'){
   const motivo=p.motivos&&p.motivos[0]?p.motivos[0].motivo:'';
   return [p.cProd,p.produto,p.ncm||'','N\xE3o incide','0% (n\xE3o incide)','0,00','N\xE3o destacar o Imposto Seletivo no documento fiscal. '+motivo+'\\nNorma: '+norma];
 }
 const valor=p.valorFinal!=null?p.valorFinal.toFixed(2).replace('.',','):'N\xE3o calculado';
 const obs=p.valorFinal!=null?'':' '+p.calculo;
 return [p.cProd,p.produto,p.ncm||'','Incide',aliquotaIS(p),valor,'Destacar o Imposto Seletivo no documento fiscal (grupo IS da NF-e/NFC-e)'+(p.aliquota?' com al\xEDquota de '+aliquotaIS(p):'')+(alternativasIS(p)?' (ou '+alternativasIS(p)+')':'')+'.'+obs+'\\nNorma: '+norma+(p.aliquota?'; '+p.aliquota.dispositivo:'')];
}
function atualizarCartaoIS(chave){
 const p=isPorChave.get(chave);
 if(!p) return;
 document.querySelectorAll('#listaPendenciasIS .pendente').forEach(el=>{ if(el.dataset.isProduto===chave) el.outerHTML=cartaoPendenteIS(p); });
}
/** Clique numa op\xE7\xE3o do IS: marca na hora, grava em seguida; na falha volta para a escolha gravada e mostra o erro. */
function escolherIS(chave,escolha){
 const p=isPorChave.get(chave);
 if(!p) return;
 let e=estadoIS.get(chave);
 if(!e){ e={seq:0,salvando:0,erro:false,mensagem:'',exibida:undefined,fila:Promise.resolve()}; estadoIS.set(chave,e); }
 const atual=p.escolhaExibida!==undefined?p.escolhaExibida:(p.escolha?p.escolha.escolha:null);
 // Clique repetido na op\xE7\xE3o j\xE1 gravada: nada a fazer (sem pedido duplicado)
 if(!e.erro&&e.salvando===0&&atual===escolha&&p.escolha&&p.escolha.escolha===escolha) return;
 const seq=++seqIS, t0=Date.now();
 e.seq=seq; e.salvando++; e.erro=false; e.mensagem='Gravando a escolha...'; e.exibida=escolha; p.escolhaExibida=escolha;
 atualizarCartaoIS(chave);
 const i=chave.indexOf('|'), ncm=chave.slice(0,i), cProd=chave.slice(i+1);
 e.fila=e.fila.then(async()=>{
   let r;
   try{ r=await fetch('/api/imposto-seletivo/validar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ncm:ncm||null,cProd,escolha,autor:'Sistema'})}); }
   catch(x){ throw new Error('sem comunica\xE7\xE3o com o processamento ('+(x&&x.message?x.message:x)+').'); }
   const d=await lerRespostaJson(r);
   if(d.interrompido) throw new Error('a an\xE1lise foi reiniciada por "Nova an\xE1lise".');
   if(!r.ok||!d.produto) throw new Error((d.detalhe||d.erro||'erro HTTP '+r.status)+'.');
   return d.produto;
 }).then(novo=>{
   console.info('[pendencias-is] escolha gravada '+chave+' '+escolha+' em '+(Date.now()-t0)+' ms');
   if(e.seq===seq){
     const naCarga=p.validadoNaCarga;
     Object.keys(p).forEach(k=>delete p[k]); Object.assign(p,novo,{validadoNaCarga:naCarga});
     e.mensagem='Escolha gravada.';
   }else{ p.escolha=novo.escolha; }
 },x=>{
   console.error('[pendencias-is] falhou '+chave+' '+escolha,x);
   if(e.seq===seq){
     delete p.escolhaExibida; e.exibida=undefined; e.erro=true;
     e.mensagem='A escolha N\xC3O foi gravada: '+x.message+' A marca\xE7\xE3o voltou para a \xFAltima escolha gravada. Clique de novo para tentar.';
   }
 }).finally(()=>{ e.salvando--; atualizarCartaoIS(chave); });
}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-is]');
 if(!b||b.disabled) return;
 escolherIS(b.dataset.chave,b.dataset.is);
});
function exportarPendenciasIS(){
 baixar('pendencias-imposto-seletivo.csv',csv([['Produto','cProd','NCM','Base','Itens (vendas)','Enquadramento (Anexo XVII)','Sugest\xE3o do sistema','Motivo','Al\xEDquota de registro IS','Resposta nesta an\xE1lise']].concat(
  filtradasIS().map(p=>[p.produto,p.cProd,p.ncm,p.base,p.itens,p.categoria?p.categoria.nome:'',ROTULO_IS[p.sugestao],(p.motivos||[]).map(m=>m.motivo).join(' | '),aliquotaIS(p),p.escolha?ROTULO_IS[p.escolha.escolha]:'']))));
}

/* ---------------- Valida\xE7\xE3o: escolha imediata, grava\xE7\xE3o confi\xE1vel ----------------
 * Cada clique marca a op\xE7\xE3o na hora e \xE9 gravado em seguida (um pedido por vez para cada produto, na ordem dos
 * cliques). A grava\xE7\xE3o N\xC3O reprocessa a an\xE1lise: os resultados ficam "desatualizados" e s\xE3o refeitos uma vez
 * (atualizarResultados) antes de mostrar An\xE1lise, Dashboard, Resultados e Relat\xF3rio Final, ou pelo bot\xE3o do aviso.
 * Se a grava\xE7\xE3o falhar, a marca\xE7\xE3o volta para a \xFAltima escolha gravada e o card mostra o erro.
 * Uma busca da lista iniciada antes de um clique nunca desfaz esse clique (carregarPendentes).
 */
const validacoes=new Map();
let seqValidacao=0;
let resultadosDesatualizadosUI=false;
let atualizacaoResultados=null;
const chaveValidacao=(ncm,cProd)=>ncm+'|'+cProd;
function validacoesSalvando(){ for(const e of validacoes.values()) if(e.salvando>0) return true; return false; }
function respostasDoProduto(ncm,cProd){
 const p=pendentes.find(x=>x.ncm===ncm&&x.cProd===cProd);
 if(p) return (p.respostasDestaAnalise||[]).slice();
 return (respostas||[]).filter(x=>x.ncm===ncm&&x.cProd===cProd);
}
/** Mesma regra do servidor (registrarRespostas): cada resposta substitui a anterior da mesma regra. */
function aplicarRespostas(lista,ncm,cProd,pedido){
 const ids=new Set(pedido.regraIds);
 const hoje=new Date().toISOString().slice(0,10);
 return lista.filter(x=>!ids.has(x.regraId)).concat(pedido.regraIds.map(regraId=>Object.assign({ncm,cProd,regraId,resposta:pedido.resposta,autor:'Sistema',data:hoje},pedido.escolha?{escolha:pedido.escolha}:{})));
}
function assinaturaRespostas(lista){
 const ult=lista.length?lista[lista.length-1]:null;
 return lista.map(x=>x.regraId+':'+x.resposta+':'+(x.escolha||'')).sort().join('|')+'#'+(ult?ult.regraId+':'+ult.resposta+':'+(ult.escolha||''):'');
}
function definirRespostasDoProduto(ncm,cProd,lista){
 const e=validacoes.get(chaveValidacao(ncm,cProd));
 if(e) e.exibidas=lista.slice();
 for(const p of pendentes) if(p.ncm===ncm&&p.cProd===cProd) p.respostasDestaAnalise=lista.slice();
 respostas=(respostas||[]).filter(x=>!(x.ncm===ncm&&x.cProd===cProd)).concat(lista);
}
function estadoValidacaoHtml(p){
 const e=validacoes.get(chaveValidacao(p.ncm,p.cProd));
 if(!e||!e.mensagem) return '';
 const classe=e.erro?' erro':e.salvando>0?' salvando':'';
 return '<div class="estado-validacao'+classe+'" role="'+(e.erro?'alert':'status')+'">'+esc(e.mensagem)+'</div>';
}
/** Redesenha s\xF3 o card do produto (Pend\xEAncias) e, se aberta, a lista de Resultados. */
function atualizarCartaoValidacao(ncm,cProd){
 const p=pendentes.find(x=>x.ncm===ncm&&x.cProd===cProd);
 const chave=chaveValidacao(ncm,cProd);
 if(p) document.querySelectorAll('#listaPendentes .pendente').forEach(el=>{ if(el.dataset.produto===chave) el.outerHTML=cartaoPendente(p); });
 if(document.getElementById('resultados').classList.contains('active')) renderResultados();
}
async function lerRespostaJson(r){
 const texto=await r.text();
 try{ return JSON.parse(texto); }catch(e){ return {erro:'resposta inv\xE1lida do processamento (HTTP '+r.status+')'}; }
}
async function enviarValidacao(ncm,cProd,pedido){
 let r;
 try{
   r=await fetch('/api/validar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({ncm,cProd,autor:'Sistema'},pedido))});
 }catch(e){
   throw new Error('sem comunica\xE7\xE3o com o processamento ('+(e&&e.message?e.message:e)+').');
 }
 const d=await lerRespostaJson(r);
 if(d.interrompido) throw new Error('a an\xE1lise foi reiniciada por "Nova an\xE1lise".');
 if(!r.ok) throw new Error((d.detalhe||d.erro||'erro HTTP '+r.status)+'.');
 if(!Array.isArray(d.respostas)) throw new Error('o processamento n\xE3o confirmou a grava\xE7\xE3o.');
 return d;
}
/** Clique numa op\xE7\xE3o de valida\xE7\xE3o: marca na hora, grava em seguida e confirma (ou desfaz, com o erro). */
function escolherValidacao(ncm,cProd,pedido){
 const chave=chaveValidacao(ncm,cProd);
 const atuais=respostasDoProduto(ncm,cProd);
 let e=validacoes.get(chave);
 if(!e){ e={seq:0,alteradoEm:0,confirmadas:atuais.slice(),exibidas:atuais.slice(),salvando:0,erro:false,mensagem:'',fila:Promise.resolve()}; validacoes.set(chave,e); }
 const novas=aplicarRespostas(atuais,ncm,cProd,pedido);
 // Clique repetido na op\xE7\xE3o que j\xE1 est\xE1 marcada e gravada: nada a fazer (sem pedido duplicado)
 if(!e.erro&&e.salvando===0&&assinaturaRespostas(novas)===assinaturaRespostas(atuais)&&assinaturaRespostas(atuais)===assinaturaRespostas(e.confirmadas)) return;
 const seq=++seqValidacao;
 e.seq=seq; e.alteradoEm=seq; e.salvando++; e.erro=false; e.mensagem='Gravando a escolha...';
 definirRespostasDoProduto(ncm,cProd,novas);
 atualizarCartaoValidacao(ncm,cProd);
 const t0=Date.now();
 e.fila=e.fila.then(()=>enviarValidacao(ncm,cProd,pedido)).then(d=>{
   e.confirmadas=d.respostas.slice();
   console.info('[validacao] gravada '+chave+' '+JSON.stringify(pedido)+' em '+(Date.now()-t0)+' ms');
   if(e.seq===seq){ definirRespostasDoProduto(ncm,cProd,d.respostas); e.mensagem='Escolha gravada.'+(d.resultadosDesatualizados?' Os resultados e relat\xF3rios ser\xE3o atualizados com ela.':''); }
   marcarResultadosDesatualizados(!!d.resultadosDesatualizados||resultadosDesatualizadosUI);
 },erro=>{
   console.error('[validacao] falhou '+chave+' '+JSON.stringify(pedido),erro);
   if(e.seq===seq){
     definirRespostasDoProduto(ncm,cProd,e.confirmadas);
     e.erro=true;
     e.mensagem='A escolha N\xC3O foi gravada: '+erro.message+' A marca\xE7\xE3o voltou para a \xFAltima escolha gravada. Clique de novo para tentar.';
   }
 }).finally(()=>{ e.salvando--; atualizarCartaoValidacao(ncm,cProd); });
}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-escolha],[data-validar],[data-validar-lote]');
 if(!b||b.disabled) return;
 const ncm=b.dataset.ncm, cProd=b.dataset.cprod;
 let pedido;
 if(b.dataset.escolha!==undefined){
   pedido=b.dataset.escolha==='REGRA'
     ?{regraIds:[b.dataset.regra],resposta:'SIM'}
     :{regraIds:(b.dataset.regras||'').split(',').filter(Boolean),resposta:'NAO',escolha:b.dataset.escolha};
   // Produto sem regra candidata (s\xF3 a natureza do item em aberto): o servidor grava a escolha com este identificador
   if(!pedido.regraIds.length) pedido.regraIds=['NATUREZA_DO_ITEM'];
 }else if(b.dataset.validar!==undefined){
   pedido={regraIds:[b.dataset.regra],resposta:b.dataset.validar};
 }else{
   pedido={regraIds:(b.dataset.regras||'').split(',').filter(Boolean),resposta:'NAO'};
 }
 if(!pedido.regraIds.length&&!pedido.escolha) return;
 escolherValidacao(ncm,cProd,pedido);
});

/* ---------------- Resultados desatualizados ---------------- */
function marcarResultadosDesatualizados(sim){
 resultadosDesatualizadosUI=!!sim;
 if(!atualizacaoResultados) mostrarAvisoValidacoes(resultadosDesatualizadosUI?'H\xE1 valida\xE7\xF5es registradas que ainda n\xE3o est\xE3o nos resultados. Elas entram automaticamente ao abrir An\xE1lise, Dashboard, Resultados ou o Relat\xF3rio Final.':'',false,true);
}
function mostrarAvisoValidacoes(texto,erro,botao){
 const el=document.getElementById('avisoValidacoes');
 if(!el) return;
 document.getElementById('textoAvisoValidacoes').textContent=texto;
 el.classList.toggle('erro',!!erro);
 el.hidden=!texto;
 const b=document.getElementById('btnAtualizarResultados');
 b.hidden=!botao; b.disabled=!!atualizacaoResultados;
}
/** Reprocessa uma vez com todas as valida\xE7\xF5es registradas (espera as grava\xE7\xF5es em andamento). Pedidos simult\xE2neos usam a mesma atualiza\xE7\xE3o. */
function garantirResultadosAtualizados(){
 if(atualizacaoResultados) return atualizacaoResultados;
 atualizacaoResultados=(async()=>{
   await Promise.allSettled([...validacoes.values()].map(e=>e.fila));
   const t0=Date.now();
   mostrarAvisoValidacoes('Atualizando os resultados com as valida\xE7\xF5es registradas. Com muitos XMLs isso pode levar cerca de 1 minuto; as escolhas j\xE1 est\xE3o gravadas.',false,false);
   let r;
   try{ r=await fetch('/api/atualizar-resultados',{method:'POST'}); }
   catch(e){ throw new Error('sem comunica\xE7\xE3o com o processamento ('+(e&&e.message?e.message:e)+')'); }
   const d=await lerRespostaJson(r);
   if(d.interrompido) throw new Error('a an\xE1lise foi reiniciada por "Nova an\xE1lise"');
   if(!r.ok) throw new Error(d.detalhe||d.erro||'erro HTTP '+r.status);
   console.info('[resultados] '+(d.atualizado?'atualizados com as valida\xE7\xF5es':'j\xE1 estavam atualizados')+' em '+(Date.now()-t0)+' ms');
   resultadosDesatualizadosUI=false;
   return !!d.atualizado;
 })();
 atualizacaoResultados.then(()=>{
   atualizacaoResultados=null;
   mostrarAvisoValidacoes('',false,false);
 },e=>{
   atualizacaoResultados=null;
   console.error('[resultados] atualiza\xE7\xE3o falhou',e);
   mostrarAvisoValidacoes('Os resultados n\xE3o foram atualizados com as valida\xE7\xF5es: '+e.message+'. As escolhas continuam gravadas. Tente de novo.',true,true);
 });
 return atualizacaoResultados;
}
async function atualizarResultadosAgora(){
 try{
   await garantirResultadosAtualizados();
   carregarAnalise();
   if(document.getElementById('pendentes').classList.contains('active')) carregarPendentes();
   if(document.getElementById('resultados').classList.contains('active')) carregarResultados();
   if(document.getElementById('dashboard').classList.contains('active')){ carregarDashboard(); carregarAlertas(); }
   if(document.getElementById('relatorio-final').classList.contains('active')) carregarRelatorioFinal();
 }catch(e){ /* o aviso mostra o erro */ }
}

/** Card de um produto em Pend\xEAncias (tamb\xE9m usado para atualizar s\xF3 esse card depois de uma escolha). */
function cartaoPendente(p){
    const regras=p.regrasDetalhe||(p.regras||[]).map(id=>({id}));
    return '<div class="pendente" data-produto="'+esc(chaveValidacao(p.ncm,p.cProd))+'">'+
     '<div class="pend-topo">'+
      '<div><span class="rotulo">Valida\xE7\xE3o do benef\xEDcio</span>'+
       '<span class="rotulo">Produto</span><strong>'+esc(p.produto)+'</strong>'+((p.respostasDestaAnalise||[]).length?'<span class="selo-validado">Validado nesta an\xE1lise</span>':'')+
       '<div class="small">cProd '+esc(p.cProd)+' \xB7 '+p.itens+' item(ns) \xB7 base '+formatarNumero(p.base)+'</div></div>'+
      '<div class="pend-ncm"><span class="rotulo">NCM</span><span class="valor">'+esc(p.ncm)+'</span></div>'+
     '</div>'+
     alertaReducoesDiferentes(regras.map(g=>g.reducao&&g.reducao.evidencia!=='nao_determinada'?g.reducao.valor:null))+
     alertaLacunas(p.lacunasDeCobertura)+
     (regras.length>1
      ?selosDoProduto(p)+enquadramentosAgrupados(p,regras)
      :regras.map((g,i)=>blocoRegraCandidata(g,p,i,regras.length)).join(''))+
     perguntaMultiplaEscolha(p)+
     estadoValidacaoHtml(p)+
     (p.regrasBloqueadasDetalhe||[]).map(blocoBloqueio).join('')+
     '<details class="nao-imprimir"><summary>Detalhes</summary>'+
      '<p class="small">'+esc(reformularMotivo(p.motivo))+'</p>'+
      regras.map(g=>'<p class="small"><strong>'+esc(g.id)+'</strong>'+(g.rotulo?': '+descricaoRegra(g):'')+'</p>').join('')+
      (alertasUI.porCartaoHtml[p.ncm+'|'+p.cProd+'|'+p.produto]||'')+
     '</details>'+
    '</div>';
}
function renderPendentes(){
 const produto=(document.getElementById('buscaPendenteProduto').value||'').toLowerCase().trim();
 const cProd=(document.getElementById('buscaPendenteCprod').value||'').toLowerCase().trim();
 const ncm=(document.getElementById('buscaPendenteNcm').value||'').toLowerCase().trim();
 pendentesFiltradas=pendentes.filter(p=>
   (!produto||(p.produto||'').toLowerCase().includes(produto)) &&
   (!cProd||(p.cProd||'').toLowerCase().includes(cProd)) &&
   (!ncm||(p.ncm||'').toLowerCase().includes(ncm))
 );
 const aguardando=pendentesFiltradas.filter(p=>!p.respondida), validados=pendentesFiltradas.filter(p=>p.respondida);
 document.getElementById('contagemPendencias').textContent=aguardando.length+' pend\xEAncia(s)'+(validados.length?' \xB7 '+validados.length+' validado(s) nesta an\xE1lise':'');
 document.getElementById('listaPendentes').innerHTML=
  (aguardando.length?aguardando.map(cartaoPendente).join(''):'<p>Nenhuma pend\xEAncia na an\xE1lise atual.</p>')+
  (validados.length?'<h3 class="titulo-validados">Validados nesta an\xE1lise ('+validados.length+')</h3><p class="small">A escolha de cada produto continua marcada e pode ser alterada: clique em outra op\xE7\xE3o.</p>'+validados.map(cartaoPendente).join(''):'');
}

['buscaPendenteProduto','buscaPendenteCprod','buscaPendenteNcm'].forEach(id=>{
 document.getElementById(id).addEventListener('input',renderPendentes);
});


/* ---------- Benef\xEDcio ou redu\xE7\xE3o de al\xEDquota por atividade (aba An\xE1lise; independe do produto/NCM) ---------- */
const CLASSE_BENEFICIO_ATIVIDADE={CONFIRMADO:'selo-oficial',REQUER_VALIDACAO:'selo-pendente',NENHUM:'selo-aviso'};
function pctAtividade(x){ return x==null?'\u2014':(x*100).toLocaleString('pt-BR',{maximumFractionDigits:3})+'%'; }
function beneficioAtividadeHtml(d){
 const b=d.beneficio;
 const linha=(r,v)=>'<div class="aliquota-descricao"><strong>'+esc(r)+':</strong> '+esc(v)+'</div>';
 const aud=(d.auditoria||[]).map(p=>'<li class="small"><strong>'+esc(p.camada)+'</strong> \xB7 '+esc(p.texto)+'</li>').join('');
 const f=d.fonte||{};
 return '<div class="selo '+(CLASSE_BENEFICIO_ATIVIDADE[d.classificacao]||'selo-aviso')+'">'+esc(d.rotulo)+'</div>'+
  linha('Atividade',d.atividade.descricao)+
  linha('Atividade confirmada (bar, restaurante ou lanchonete)',d.atividade.declaradaNoCadastro?'sim':'n\xE3o')+
  '<div class="atividade-declaracao">'+
   (d.atividade.declaradaNoCadastro
    ?'<button type="button" class="secondary" data-atividade="false">A empresa n\xE3o atende consumo no local</button>'+
     '<div class="small">Confirmado: cada produto vendido tem a pergunta "preparado e servido no local ou mercadoria" em Pend\xEAncias.</div>'
    :'<button type="button" class="secondary" data-atividade="true">A empresa atende consumo no local (bar, restaurante, lanchonete)</button>'+
     '<div class="small">Ao confirmar, cada produto vendido recebe a pergunta "preparado e servido no local ou mercadoria" em Pend\xEAncias, inclusive os que n\xE3o t\xEAm redu\xE7\xE3o no NCM. Vale s\xF3 para esta an\xE1lise.</div>')+
  '</div>'+
  (b?linha('Benef\xEDcio',b.descricao+' Atividade da lei: '+b.atividadeDaLei+'.')+
   linha('Percentual de redu\xE7\xE3o',pctAtividade(b.percentualReducao))+
   linha('Al\xEDquota geral',b.aliquotaGeral==null?'sem al\xEDquota vigente':pctAtividade(b.aliquotaGeral)+' ('+b.aliquotas.map(a=>a.tributo+' '+pctAtividade(a.aliquota)).join(' + ')+', em '+b.dataAliquotas+')')+
   linha('Al\xEDquota ap\xF3s redu\xE7\xE3o',b.aliquotaAposReducao==null?'\u2014':pctAtividade(b.aliquotaAposReducao)+' ('+b.aliquotas.map(a=>a.tributo+' '+pctAtividade(a.aliquota*(1-b.percentualReducao))).join(' + ')+')')+
   linha('Fundamento legal',b.fundamentoLegal)+
   '<div class="aliquota-descricao"><strong>Condi\xE7\xF5es para aplica\xE7\xE3o:</strong></div><ul class="fatos">'+b.condicoes.map(c=>'<li class="small">'+esc(c.texto)+'</li>').join('')+'</ul>':'')+
  '<details><summary>Auditoria e fontes</summary>'+
   '<div class="small"><strong>Atividade da empresa \u2192 benef\xEDcio \u2192 percentual \u2192 fundamento \u2192 condi\xE7\xF5es \u2192 fonte</strong></div>'+
   '<ul class="fatos">'+aud+'</ul>'+
   (b?'<div class="small"><strong>Texto legal (literal)</strong></div><ul class="fatos">'+b.textoLegal.map(t=>'<li class="small"><a href="'+esc(t.url)+'" target="_blank" rel="noopener">'+esc(t.dispositivo)+'</a>: '+esc(t.texto)+'</li>').join('')+'</ul>':'')+
   '<div class="small">Fonte: '+esc(f.nome||'')+' \u2014 <a href="'+esc(f.url||'')+'" target="_blank" rel="noopener">'+esc(f.url||'')+'</a> \xB7 '+esc(f.versao||'')+' \xB7 consultado em '+esc(f.dataConsulta||'')+' \xB7 arquivo '+esc(f.arquivo||'')+' \xB7 snapshot '+esc(curto(f.sha256))+'</div>'+
   '<div class="small aud-nota">Esta verifica\xE7\xE3o \xE9 s\xF3 da atividade da empresa. A tributa\xE7\xE3o de cada produto/NCM continua sendo a do motor, mostrada nas demais telas, e n\xE3o \xE9 alterada aqui.</div>'+
  '</details>';
}
document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-atividade]');
 if(!b) return;
 b.disabled=true;
 try{
   const r=await fetch('/api/atividade',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({barOuRestaurante:b.dataset.atividade==='true'})});
   const d=await r.json();
   if(!r.ok){alert(d.erro||'N\xE3o foi poss\xEDvel gravar a atividade da empresa.');b.disabled=false;return;}
   await carregarBeneficioAtividade();
   await recarregarTudo();
 }catch(erro){
   alert('N\xE3o foi poss\xEDvel gravar a atividade da empresa.');
   b.disabled=false;
 }
});
async function carregarBeneficioAtividade(){
 const alvo=document.getElementById('beneficioAtividadeConteudo');
 if(!alvo) return;
 try{
   const r=await fetch('/api/beneficio-atividade');
   const d=await r.json();
   alvo.innerHTML=r.ok?beneficioAtividadeHtml(d):'<div class="aviso-regra">'+esc(d.erro||'N\xE3o foi poss\xEDvel verificar o benef\xEDcio por atividade.')+'</div>';
 }catch(erro){
   alvo.innerHTML='<div class="aviso-regra">N\xE3o foi poss\xEDvel verificar o benef\xEDcio por atividade.</div>';
 }
}

/* ---------- Consulta Tribut\xE1ria por NCM (aba nova; s\xF3 exibi\xE7\xE3o do que o motor e o explicador devolvem) ---------- */
const ROTULO_CONCLUSAO_NCM={
 ENQUADRAMENTO_DETERMINADO:'Enquadramento determinado pelo motor',
 REQUER_VALIDACAO_HUMANA:'REQUER VALIDA\xC7\xC3O HUMANA',
 REGRA_GERAL_SEM_BENEFICIO:'Regra geral \u2014 sem benef\xEDcio aplic\xE1vel na base',
 INDETERMINADO:'INDETERMINADO \u2014 o motor n\xE3o classificou',
 NAO_OBRIGATORIO:'Grupo IBS/CBS ainda n\xE3o exigido na data'
};
const ROTULO_SITUACAO_REGRA_NCM={aplicada:'Regra aplicada pelo motor',candidata:'Regra candidata (aguarda confirma\xE7\xE3o humana)',bloqueada:'BLOQUEADA \u2014 incompatibilidade oficial',fora_da_vigencia:'Fora da vig\xEAncia na data da consulta',nao_considerada:'N\xE3o considerada pelo motor para a natureza informada'};
const ROTULO_STATUS_NORMATIVO={NORMA_CONFIRMADA:'NORMA_CONFIRMADA \u2014 a regra coincide com as fontes oficiais (n\xE3o confirma o benef\xEDcio para o produto)',NORMA_POSSIVEL_MULTIPLOS_ITENS:'NORMA_POSSIVEL_MULTIPLOS_ITENS \u2014 o NCM aparece em mais de um item da norma',CONFLITO_PLANILHA_FONTE:'CONFLITO_PLANILHA_FONTE \u2014 a base diverge da fonte oficial',CONFLITO_ENTRE_FONTES:'CONFLITO_ENTRE_FONTES \u2014 as fontes oficiais divergem entre si',SEM_EVIDENCIA_OFICIAL:'SEM_EVIDENCIA_OFICIAL \u2014 regra s\xF3 da planilha, sem v\xEDnculo oficial registrado'};
function secaoNcm(n,titulo,corpo){ return '<div class="bloco"><span class="rotulo">'+n+'. '+esc(titulo)+'</span>'+corpo+'</div>'; }
function linhaNcm(rotulo,valor){ return '<div><span class="rotulo">'+esc(rotulo)+'</span><span class="valor">'+esc(valor==null||valor===''?'\u2014':valor)+'</span></div>'; }
function pctNcm(x){ return x==null?'\u2014':(x*100).toLocaleString('pt-BR',{maximumFractionDigits:3})+'%'; }
function fatoNcm(f){
 return '<li><span class="small"><strong>FONTE_DIZ</strong> \xB7 '+esc(textoFato(f))+'</span>'+
  '<div class="small">Arquivo '+esc(f.arquivo||'')+(f.versao?' \xB7 vers\xE3o '+esc(f.versao):'')+(f.dataConsulta?' \xB7 consultado em '+esc(f.dataConsulta):'')+(f.sha256?' \xB7 snapshot '+esc(curto(f.sha256)):'')+'</div></li>';
}
function inferenciaNcm(i){
 return '<li><span class="small"><strong>SISTEMA_INFERE</strong> ('+esc(i.regra)+') \xB7 '+esc(i.conclusao)+'</span>'+
  ((i.premissas||[]).length?'<ul class="fatos">'+i.premissas.map(fatoNcm).join('')+'</ul>':'')+'</li>';
}
/** R\xF3tulo da evid\xEAncia da redu\xE7\xE3o, como o explicador a classificou. */
const ROTULO_EVIDENCIA_REDUCAO={oficial_confirmada:'confirmada nas fontes oficiais',oficial_divergente:'divergente das fontes oficiais',sem_evidencia_oficial:'n\xE3o confirmada oficialmente (prevista na base normativa)',nao_determinada:'n\xE3o determinada'};
function listaNcm(titulo,itens){ return itens?'<div class="small"><strong>'+esc(titulo)+'</strong></div><ul class="fatos">'+itens+'</ul>':''; }
function itemNcm(t){ return '<li class="small">'+esc(t)+'</li>'; }
/** Auditoria de UMA regra: fonte, infer\xEAncia, confirma\xE7\xE3o humana, crit\xE9rios do motor, candidatura e pend\xEAncias. */
function auditoriaRegraNcm(g,e,r){
 const a=e&&e.auditoriaOficial, b=e&&e.bloqueio, p=r.parametros;
 const leiCobre=a?(a.fatosF1||[]).filter(f=>f.papel==='cobre o NCM'):[];
 const fonte=(e&&(e.fonteDiz||[]).length)
  ?e.fonteDiz.map(fatoNcm).join('')
  :leiCobre.map(f=>itemNcm('FONTE_DIZ \xB7 LC 214/2025, '+f.dispositivo+': '+f.trecho)).join('')+
   (a?[...new Set((a.fatosF2||[]).map(f=>'FONTE_DIZ \xB7 SVRS: '+f.TipoPermissao+' \u2014 '+f.DescItemAnexo+(f.DescExcecao?' (exce\xE7\xE3o: '+f.DescExcecao+')':'')))].map(itemNcm).join(''):'');
 const inferido=(e?(e.sistemaInfere||[]).map(inferenciaNcm).join(''):'')+
  (a?itemNcm('Confer\xEAncia da regra com a fonte oficial: '+(ROTULO_AUDITORIA[a.status]||a.status))+alertasDaAuditoria(a).map(itemNcm).join('')+(a.status!=='CONFIRMADA'?(a.motivos||[]).map(m=>itemNcm('Motivo da confer\xEAncia: '+m)).join(''):''):itemNcm('Sem confer\xEAncia da regra com a fonte oficial.'))+
  (e&&e.statusNormativo?itemNcm('Status normativo: '+(ROTULO_STATUS_NORMATIVO[e.statusNormativo]||e.statusNormativo)):'')+
  (e&&(e.sinalizadores||[]).length?itemNcm('Sinalizadores: '+e.sinalizadores.join(', ')):'');
 const condNaoXml=(e?(e.condicoes||[]):[]).filter(c=>c.verificavelPeloXml!=='sim');
 const humano=g.situacao==='candidata'
  ?itemNcm('Se o produto atende \xE0 descri\xE7\xE3o legal desta regra (Anexo '+g.anexo+', item '+g.item+'): "'+g.descricaoLegal+'".')+
   condNaoXml.map(c=>itemNcm('Condi\xE7\xE3o da norma que o XML n\xE3o comprova ('+c.natureza+'): '+textoFato(c.textoOficial))).join('')+
   itemNcm('HUMANO_CONFIRMOU: nenhuma confirma\xE7\xE3o \u2014 a consulta n\xE3o tem produto, ent\xE3o nenhuma resposta SIM/N\xC3O \xE9 aproveitada. NORMA_CONFIRMADA n\xE3o confirma o benef\xEDcio para o produto.')
  :g.situacao==='aplicada'?itemNcm('Regra aplicada pelo motor.')
  :itemNcm('Nada: a regra n\xE3o \xE9 candidata ('+(ROTULO_SITUACAO_REGRA_NCM[g.situacao]||g.situacao)+').');
 const noPeriodo=g.vigenciaInicio<=p.data&&(g.vigenciaFim===null||g.vigenciaFim>=p.data);
 const criterios=itemNcm('NCM da regra ('+g.ncmRegra+') igual ao NCM consultado ('+r.ncm+').')+
  itemNcm('Vig\xEAncia da regra ('+g.vigenciaInicio+' a '+(g.vigenciaFim||'sem data final')+') \xD7 data da consulta ('+p.data+'): '+(noPeriodo?'dentro da vig\xEAncia':'fora da vig\xEAncia')+'.')+
  itemNcm('Bloqueio por incompatibilidade oficial do NCM com o enquadramento: '+(b?'sim':'n\xE3o')+'.')+
  itemNcm('Natureza do item: '+(p.natureza||(p.naturezaOrigem==='deduzida_pelo_motor'?'mercadoria (deduzida pelo motor)':'n\xE3o informada'))+'.')+
  itemNcm('Respostas SIM/N\xC3O consideradas: nenhuma.');
 const just=g.situacao==='candidata'?'O motor mant\xE9m a regra como candidata: regra da base para o NCM, vigente na data, n\xE3o bloqueada e sem resposta humana. Sem a confirma\xE7\xE3o, ela n\xE3o \xE9 aplicada nem descartada.'
  :g.situacao==='aplicada'?'Regra aplicada pelo motor.'
  :g.situacao==='bloqueada'?'O motor excluiu a regra das candidatas: '+(b?b.motivo:'regra bloqueada por incompatibilidade oficial.')
  :g.situacao==='fora_da_vigencia'?'O motor excluiu a regra das candidatas: fora da vig\xEAncia na data da consulta.'
  :'O motor n\xE3o considera regras de benef\xEDcio da base para a natureza informada.';
 const pend=(e?(e.divergencias||[]):[]).map(d=>itemNcm('Diverg\xEAncia '+d.tipo+' ('+d.status+'; impacto: '+d.impacto+'): '+(d.valores||[]).map(x=>x.fonte+' = '+(typeof x.valor==='string'?x.valor:JSON.stringify(x.valor))).join(' \xB7 '))).join('')+
  (r.alertas||[]).filter(al=>(al.regras||[]).some(x=>x.regraId===g.id)).map(al=>itemNcm(al.titulo+' ['+al.categoria+' \xB7 '+al.camada+']: '+al.mensagem)).join('');
 return listaNcm('O que a fonte informa',fonte||itemNcm('Nenhum fato de fonte oficial registrado para esta regra.'))+
  listaNcm('O que o sistema inferiu',inferido)+
  listaNcm('O que depende de confirma\xE7\xE3o humana',humano)+
  listaNcm('Crit\xE9rios utilizados pelo motor',criterios)+
  listaNcm('Justificativa',itemNcm(just))+
  listaNcm('Pend\xEAncias ou lacunas',pend||itemNcm('Nenhuma pend\xEAncia ou diverg\xEAncia registrada para esta regra.'));
}
/** Fontes de UMA regra: registro na base, fundamento, refer\xEAncia na lei, URLs e arquivos das evid\xEAncias. */
function fontesRegraNcm(g,e){
 const a=e&&e.auditoriaOficial, c=a&&a.codigo||{};
 const arquivos=[...new Set((e?(e.fonteDiz||[]):[]).map(f=>f.fonte+' \u2014 arquivo '+f.arquivo+(f.versao?', vers\xE3o '+f.versao:'')+(f.dataConsulta?', consultado em '+f.dataConsulta:'')+', snapshot '+curto(f.sha256)))];
 return '<ul class="fatos">'+
  itemNcm('Fonte do registro na base: '+g.fonte+(g.origemRegistro?' ('+g.origemRegistro+')':''))+
  itemNcm('Fundamento legal da regra: '+g.fundamentoLegal)+
  (c.F1&&c.F1.dispositivo?itemNcm('Refer\xEAncia normativa (fonte oficial): LC 214/2025, '+c.F1.dispositivo):'')+
  (a&&a.fontes?'<li class="small"><a href="'+esc(a.fontes.F1.url+(c.F1&&c.F1.ancora?'#'+c.F1.ancora:''))+'" target="_blank" rel="noopener">LC 214/2025 (Planalto)</a> \u2014 texto legal, snapshot '+esc(curto(a.fontes.F1.sha256))+'</li>'+
   '<li class="small"><a href="'+esc(a.fontes.F2.url)+'" target="_blank" rel="noopener">SVRS \u2014 Classifica\xE7\xE3o Tribut\xE1ria</a> \u2014 tabela de apoio, snapshot '+esc(curto(a.fontes.F2.sha256))+'</li>':'')+
  arquivos.map(t=>itemNcm('Documento da evid\xEAncia: '+t)).join('')+
 '</ul>';
}
/** Uma regra: identifica\xE7\xE3o, classifica\xE7\xE3o, enquadramento, condi\xE7\xF5es, exce\xE7\xF5es, veda\xE7\xF5es; auditoria e fontes dela. */
function regraNcmHtml(g,e,r){
 const a=e&&e.auditoriaOficial, b=e&&e.bloqueio;
 const cond=(e?(e.condicoes||[]):[]).map(c=>itemNcm('('+c.natureza+'; verific\xE1vel pelo XML: '+c.verificavelPeloXml+') '+textoFato(c.textoOficial)+(c.textoOperacional?' \u2014 SVRS: '+textoFato(c.textoOperacional):''))).join('');
 const excecoes=(a?(a.fatosF1||[]).filter(f=>f.papel==='exclui o NCM').map(f=>itemNcm('LC 214/2025, '+f.dispositivo+' (exclui o NCM): '+f.trecho)).join('')+
  [...new Set((a.fatosF2||[]).filter(f=>f.DescExcecao).map(f=>'SVRS: '+f.DescExcecao))].map(itemNcm).join('')+
  ((a.excecaoNaLeiEmItens||[]).length?itemNcm('Exce\xE7\xE3o na lei nos itens: '+a.excecaoNaLeiEmItens.join(', ')):''):'');
 const vedSvrs=a?[...new Set((a.fatosF2||[]).filter(f=>f.TipoPermissao==='VEDADO').map(f=>'SVRS: VEDADO \u2014 '+f.DescItemAnexo))].map(itemNcm).join(''):'';
 return '<div class="regra-cand">'+
  '<div class="enq-cab">'+esc(g.id)+' \u2014 '+esc(ROTULO_SITUACAO_REGRA_NCM[g.situacao]||g.situacao)+'</div>'+
  '<div class="quadro-campos">'+campoQuadro('CST',g.cst)+campoQuadro('cClassTrib',g.cClassTrib)+campoQuadro('Anexo',g.anexo)+campoQuadro('Item',g.item)+campoQuadro('Fundamento',g.fundamentoLegal)+'</div>'+
  linhaNcm('Classifica\xE7\xE3o tribut\xE1ria',g.rotulo)+
  linhaNcm('C\xF3digo CBS / IBS','CST '+g.cst+' \xB7 cClassTrib '+g.cClassTrib+' (o grupo IBSCBS usa o mesmo par para CBS e IBS)')+
  linhaNcm('Enquadramento','Anexo '+g.anexo+', item '+g.item+' ('+g.fundamentoLegal+')')+
  '<div class="bloco"><span class="rotulo">Descri\xE7\xE3o do enquadramento (descri\xE7\xE3o legal)</span><div class="descricao-legal">'+esc(g.descricaoLegal||'Descri\xE7\xE3o legal n\xE3o dispon\xEDvel na base para esta regra.')+'</div></div>'+
  linhaNcm('Vig\xEAncia',g.vigenciaInicio+' a '+(g.vigenciaFim||'sem data final'))+
  (g.observacao?linhaNcm('Observa\xE7\xE3o da base',g.observacao):'')+
  listaNcm('Condi\xE7\xF5es de aplica\xE7\xE3o',cond||itemNcm('Nenhuma condi\xE7\xE3o registrada al\xE9m da descri\xE7\xE3o legal.'))+
  listaNcm('Exce\xE7\xF5es',excecoes||itemNcm('Nenhuma exce\xE7\xE3o registrada para esta regra.'))+
  (b?'<div class="small"><strong>Veda\xE7\xF5es</strong></div>'+blocoBloqueio(b):listaNcm('Veda\xE7\xF5es',vedSvrs||itemNcm('Nenhuma veda\xE7\xE3o registrada para esta regra.')))+
  '<details><summary>Fontes da regra</summary>'+fontesRegraNcm(g,e)+'</details>'+
 '</div>';
}
/** Dados tribut\xE1rios de uma regra: s\xF3 o que est\xE1 na base, no motor ou na auditoria. */
function dadosTributariosRegraNcm(g,e,r){
 const a=e&&e.auditoriaOficial, f2=a&&a.codigo&&a.codigo.F2, red=e&&e.reducao;
 return '<div class="regra-cand">'+
  '<div class="enq-cab">'+esc(g.id)+' \u2014 CST '+esc(g.cst)+' \xB7 cClassTrib '+esc(g.cClassTrib)+'</div>'+
  linhaNcm('Redu\xE7\xE3o da al\xEDquota (base normativa)',pctNcm(g.reducaoAliquota))+
  (f2?linhaNcm('Redu\xE7\xE3o no SVRS','IBS '+pctInteiro(f2.percRedIbs)+' \xB7 CBS '+pctInteiro(f2.percRedCbs)):'')+
  (red?linhaNcm('Evid\xEAncia da redu\xE7\xE3o',ROTULO_EVIDENCIA_REDUCAO[red.evidencia]||red.evidencia):'')+
  linhaNcm('Al\xEDquota IBS + CBS com a redu\xE7\xE3o, na data da consulta',g.aliquotaEfetiva==null?'sem al\xEDquota vigente':pctNcm(g.aliquotaEfetiva))+
 '</div>';
}
function resultadoConsultaNcmHtml(r){
 const v=r.veredito, x=v.explicacaoInformativa||{}, p=r.parametros;
 const porId={}; (x.regras||[]).forEach(e=>{porId[e.regraIdInformado]=e;});
 const regras=r.regras.map(g=>Object.assign({ncmRegra:r.ncm},g));
 const esp=v.esperado;
 const regime=v.regraAplicada&&!regras.some(g=>g.id===v.regraAplicada);
 const regimeRed=x.reducaoDoItem&&x.reducaoDoItem.regimeEspecifico;
 // Enquadramento do motor sem regra de benef\xEDcio da base: regra geral ou regime espec\xEDfico (texto do motor)
 const doMotor=esp&&(!v.regraAplicada||regime)
  ?'<div class="regra-cand"><div class="enq-cab">'+esc(regime?'Regime espec\xEDfico aplicado pelo motor: '+v.regraAplicada:'Regra geral indicada pelo motor')+'</div>'+
   '<div class="quadro-campos">'+campoQuadro('CST',esp.cst)+campoQuadro('cClassTrib',esp.cClassTrib)+'</div>'+
   linhaNcm('C\xF3digo CBS / IBS','CST '+esp.cst+' \xB7 cClassTrib '+esp.cClassTrib+' (o grupo IBSCBS usa o mesmo par para CBS e IBS)')+
   linhaNcm('Motivo do motor',reformularMotivo(v.motivo))+'</div>'
  :'';
 const lacunas=(x.lacunas||[]).map(l=>'<li><span class="small"><strong>'+esc(l.status)+'</strong> \xB7 cClassTrib '+esc(l.cClassTrib)+' \xB7 inclus\xE3o como regra: '+esc(l.inclusaoComoRegra&&l.inclusaoComoRegra.status)+' (D5)</span><ul class="fatos">'+(l.fatos||[]).map(fatoNcm).join('')+'</ul></li>').join('');
 const semRegra=!regras.length
  ?'<div class="small">Nenhuma regra de benef\xEDcio na base para este NCM.'+(r.encontradoNaBase?'':' O NCM n\xE3o consta da base normativa: nenhuma regra de outro NCM foi usada e nada foi aproximado.')+'</div>'
  :'';
 const aliq=(v.aliquotaUsada||[]).length?v.aliquotaUsada:r.aliquotas;
 const aliqTxt=aliq.length?aliq.map(a=>a.tributo+' '+pctNcm(a.aliquota)).join(' + ')+(aliq.length===2?' = '+pctNcm(aliq.reduce((s,a)=>s+a.aliquota,0)):''):'nenhuma al\xEDquota vigente na data';
 const comDados=regras.filter(g=>g.situacao==='aplicada'||g.situacao==='candidata');
 return '<div class="pendente">'+
  '<div class="pend-topo"><div><span class="rotulo">Resultado da consulta</span><strong>'+esc(ROTULO_CONCLUSAO_NCM[r.conclusao.tipo]||r.conclusao.tipo)+'</strong><div class="small">'+esc(r.conclusao.texto)+'</div></div>'+
  '<div class="pend-ncm"><span class="rotulo">NCM</span><span class="valor">'+esc(r.ncm)+'</span></div></div>'+
  secaoNcm(1,'Identifica\xE7\xE3o do NCM',linhaNcm('NCM consultado',r.ncm)+linhaNcm('Informado como',p.entrada)+
   linhaNcm('Descri\xE7\xE3o do NCM',r.descricaoNcm.length?r.descricaoNcm.join(' | '):'n\xE3o dispon\xEDvel na base normativa (a base n\xE3o cont\xE9m a TIPI completa)'))+
  secaoNcm(2,'Regras aplicadas e candidatas',doMotor+semRegra+regras.map(g=>regraNcmHtml(g,porId[g.id],r)).join('')+
   listaNcm('Lacunas da fonte',lacunas)+alertaLacunas(x.lacunasDeCobertura))+
  secaoNcm(3,'Dados tribut\xE1rios',linhaNcm('Al\xEDquotas vigentes na data da consulta ('+p.data+')',aliqTxt)+
   (regime&&regimeRed?linhaNcm('Redu\xE7\xE3o do regime espec\xEDfico ('+regimeRed.fundamento+')',pctNcm(regimeRed.valor)):'')+
   comDados.map(g=>dadosTributariosRegraNcm(g,porId[g.id],r)).join(''))+
 '</div>';
}
async function consultarNcmTela(){
 const alvo=document.getElementById('consultaNcmResultado');
 const botao=document.getElementById('btnConsultarNcm');
 const ncm=(document.getElementById('consultaNcmEntrada').value||'').trim();
 const digitos=ncm.split('.').join('').split(' ').join('');
 if(!ncm){ alvo.innerHTML='<div class="aviso-regra">Informe o NCM.</div>'; return; }
 if(!/^[0-9]{8}$/.test(digitos)){ alvo.innerHTML='<div class="aviso-regra">NCM inv\xE1lido: informe 8 d\xEDgitos, com ou sem pontos (ex.: 1901.20.90 ou 19012090).</div>'; return; }
 botao.disabled=true;
 alvo.innerHTML='<p class="small">Consultando...</p>';
 try{
   const resp=await fetch('/api/consulta-ncm',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ncm,modelo:document.getElementById('consultaNcmModelo').value,natureza:document.getElementById('consultaNcmNatureza').value})});
   const d=await resp.json();
   alvo.innerHTML=resp.ok?resultadoConsultaNcmHtml(d):'<div class="aviso-regra">'+esc(d.erro||'N\xE3o foi poss\xEDvel consultar o NCM.')+'</div>';
 }catch(erro){
   alvo.innerHTML='<div class="aviso-regra">N\xE3o foi poss\xEDvel consultar o NCM.</div>';
 }finally{
   botao.disabled=false;
 }
}

async function carregarAlertas(){
 const vazio={disponivel:false,porItemHtml:{},porCartaoHtml:{},painelHtml:''};
 try{
   const r=await fetch('/api/alertas');
   const d=await r.json();
   alertasUI=d&&d.disponivel?d:Object.assign(vazio,{painelHtml:(d&&d.painelHtml)||''});
 }catch(e){
   alertasUI=Object.assign(vazio,{painelHtml:'<h3>Alertas (somente exibi\xE7\xE3o)</h3><p class="small">Alertas indispon\xEDveis. Os resultados continuam v\xE1lidos e n\xE3o dependem dos alertas.</p>'});
 }
 
 if(resultados.length) renderResultados();
 if(pendentes.length) renderPendentes();
}

function csv(linhas){
 return linhas.map(l=>l.map(c=>'"'+String(c??'').split('"').join('""')+'"').join(';')).join('\\r\\n');
}
function baixar(nome,conteudo){
 baixarArquivo(nome,'\\ufeff'+conteudo,'text/csv;charset=utf-8');
}
function baixarArquivo(nome,conteudo,tipo){
 const a=document.createElement('a');
 const url=URL.createObjectURL(new Blob([conteudo],{type:tipo}));
 a.href=url;
 a.download=nome;
 document.body.appendChild(a);
 a.click();
 a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
/** Colunas de redu\xE7\xE3o do CSV, com a mesma regra da tela (nada exibido quando n\xE3o determinada ou incoerente). */
function reducaoCsv(v,campo){
 const r=v.reducaoExibicao;
 if(!r) return '';
 if(r.situacao==='regime_especifico'&&r.regimeEspecifico){
   const g=r.regimeEspecifico;
   return campo==='reducao'?textoReducao(g.valor):campo==='resultante'?textoResultante(g.valor):campo==='evidencia'?'':'Regime espec\xEDfico do motor ('+g.fundamento+')';
 }
 const suf=r.situacao==='prevista'?' (se o enquadramento for confirmado)':'';
 return r.opcoes.map(o=>{
   const exibe=o.evidencia!=='nao_determinada'&&o.valor!=null&&r.coerenciaEconomia!==false;
   if(campo==='evidencia') return o.regraId+': '+(!exibe?'n\xE3o determinada':o.evidencia==='oficial_confirmada'?'confirmada':o.evidencia==='oficial_divergente'?'divergente':'n\xE3o conferida (D3 pendente)');
   if(campo==='origem') return exibe?'Base normativa \u2014 regra '+o.regraId+(o.linhaPlanilha!=null?' (linha '+o.linhaPlanilha+')':''):'';
   if(!exibe) return '';
   return (campo==='reducao'?textoReducao(o.valor):textoResultante(o.valor))+suf;
 }).filter(x=>x).join(' | ');
}
function exportarResultados(){
 baixar('resultados.csv',csv([['Produto','cProd','NCM','Base','Resultado','Valida\xE7\xE3o','CST informado','CST esperado','cClassTrib informado','cClassTrib esperado','IBS/CBS informado no XML','Valor correto segundo a regra','Valor calculado pelo motor (sem redu\xE7\xE3o)','Regra aplicada','Benef\xEDcio / enquadramento','Redu\xE7\xE3o da al\xEDquota IBS/CBS','Al\xEDquota resultante','Evid\xEAncia da redu\xE7\xE3o','Origem da redu\xE7\xE3o','Economia potencial','Exposi\xE7\xE3o','Motivo','Documento','Item']].concat(
  resultadosFiltrados.map(v=>[v.produto,v.cProd,v.ncm,v.baseCalculo,v.estado,validacaoDoItem(v),v.informado?.cst,v.esperado?.cst,v.informado?.cClassTrib,v.esperado?.cClassTrib,v.valorInformadoTotal,rotuloValorCorreto(v)==='Valor correto segundo a regra'?v.valorCorreto:'',rotuloValorCorreto(v)==='Valor correto segundo a regra'?'':v.valorCorreto,v.regraAplicada,beneficioDoItem(v),reducaoCsv(v,'reducao'),reducaoCsv(v,'resultante'),reducaoCsv(v,'evidencia'),reducaoCsv(v,'origem'),v.economiaPotencial,v.exposicao,textoMotivo(v),v.documento,v.nItem]))));
}
function exportarPendencias(){
 // Uma linha por pend\xEAncia exibida (mesma lista e mesma chave dos cards: pendentesFiltradas, um card por cProd);
 // as regras candidatas do card ficam na mesma linha, numeradas na ordem em que aparecem na tela.
 const reducaoPrev=g=>{const o=g.reducao;return !o||o.evidencia==='nao_determinada'||o.valor==null?'':textoReducao(o.valor);};
 const evidencia=g=>{const o=g.reducao;return !o?'indispon\xEDvel':o.evidencia==='nao_determinada'||o.valor==null?'n\xE3o determinada':statusEvidenciaReducao(o).texto;};
 const juntar=(regras,f)=>regras.length>1?regras.map((g,i)=>(i+1)+') '+(f(g)??'')).join(' | '):(regras[0]?(f(regras[0])??''):'');
 baixar('pendencias.csv',csv([['Produto','cProd','NCM','Base','Itens (vendas)','Quantidade de regras candidatas','Regra candidata','Descri\xE7\xE3o legal do benef\xEDcio','CST IBS/CBS proposto','cClassTrib proposto','Anexo','Item','Redu\xE7\xE3o prevista na regra','Status da evid\xEAncia da redu\xE7\xE3o','Resposta nesta an\xE1lise','Pergunta']].concat(
  pendentesFiltradas.map(p=>{
   const regras=p.regrasDetalhe||(p.regras||[]).map(id=>({id}));
   return [p.produto,p.cProd,p.ncm,p.base,p.itens,regras.length,
    juntar(regras,g=>g.id),
    juntar(regras,g=>g.descricaoLegal!=null?g.descricaoLegal:(g.descricoesLegaisDivergentes||[]).join(' / ')),
    juntar(regras,g=>g.cst),juntar(regras,g=>g.cClassTrib),juntar(regras,g=>g.anexo),juntar(regras,g=>g.item),
    juntar(regras,reducaoPrev),juntar(regras,evidencia),
    juntar(regras,g=>(p.respostasDestaAnalise||[]).filter(x=>x.regraId===g.id).map(x=>x.resposta).join(', ')),
    'Com base na descri\xE7\xE3o legal acima, o produto atende aos requisitos para este enquadramento?'];
  }))));
}

function formatarNumero(v){
 return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}
function formatarPercentual(v){
 return (Number(v||0)*100).toFixed(2)+'%';
}
function esc(v){
 return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

carregarAnalise();
carregarDashboard();
carregarAlertas();
carregarRespostas();
<\/script>
</body>
</html>`}var ac=w(()=>{"use strict";f()});function sp(o){let e=String(o??"").trim();if(!e)return{ok:!1,erro:"Informe o NCM."};if(!/^[\d.\s-]+$/.test(e))return{ok:!1,erro:`NCM "${e}" inv\xE1lido: use somente n\xFAmeros, com ou sem pontos (ex.: 1901.20.90 ou 19012090).`};let a=e.replace(/[.\s-]/g,"");return a.length!==8?{ok:!1,erro:`NCM "${e}" inv\xE1lido: o NCM tem 8 d\xEDgitos (foram informados ${a.length}).`}:{ok:!0,ncm:a}}function cp(o){let e=oc.get(o);return e||(e={...o,validacoes:[]},oc.set(o,e)),e}function tc(o,e){let a=sp(o.ncm);if(!a.ok)return a;let t=o.modelo==null||o.modelo===""?"65":String(o.modelo);if(t!=="55"&&t!=="65")return{ok:!1,erro:"Modelo do documento inv\xE1lido: use 55 (NF-e) ou 65 (NFC-e)."};let r=o.natureza==null||o.natureza===""?null:String(o.natureza);if(r!==null&&!np.includes(r))return{ok:!1,erro:"Natureza do produto inv\xE1lida."};let i=e.agora??new Date().toISOString(),n={chave:null,modelo:t,numero:null,serie:null,dataEmissao:i,tipoOperacao:"saida",finalidade:"1",situacao:null,cancelado:!1,emitente:{cnpj:e.empresa.cnpj??null,crt:null,uf:e.empresa.uf??null},destinatario:{cnpj:null,cpf:null,uf:null,indIEDest:null},itens:[],arquivo:`consulta-ncm-${a.ncm}`,avisos:[]},s={nItem:1,cProd:ip,xProd:"",ncm:a.ncm,cfop:null,quantidade:null,valorProduto:0,desconto:0,baseCalculo:0,cst:null,cClassTrib:null,aliquotas:{},...r?{natureza:r}:{}};n.itens.push(s);let c=Br(n,s,{base:e.base,empresa:e.empresa,validacoes:[],agora:i,regrasBloqueadas:e.regrasBloqueadas}),l=kr(c,cp(e.explicacao),n),d=mt([l]).porItem,u=["CBS","IBS"].map(x=>Ma(x,i,!1,la)).filter(x=>!!x).map(x=>({tributo:x.tributo,aliquota:x.aliquota,fonte:x.fonte,tipo:x.tipo})),p=u.length===2?u.reduce((x,R)=>x+R.aliquota,0):null,m=e.base.regras.filter(x=>x.ncm===a.ncm),g=new Set(c.regrasBloqueadas??[]),v=x=>x.vigenciaInicio<=li(i)&&(x.vigenciaFim===null||x.vigenciaFim>=li(i)),C=x=>x.id===c.regraAplicada?"aplicada":g.has(x.id)?"bloqueada":c.regrasCandidatas.includes(x.id)?"candidata":v(x)?"nao_considerada":"fora_da_vigencia",S=m.map(x=>({id:x.id,cst:x.cst,cClassTrib:x.cClassTrib,anexo:x.anexo,item:x.item,rotulo:x.rotulo,fundamentoLegal:x.fundamentoLegal,descricaoLegal:x.descricaoLegal,descricaoNcmTipi:x.descricaoNcmTipi??null,observacao:x.observacao??null,reducaoAliquota:x.reducaoAliquota,vigenciaInicio:x.vigenciaInicio,vigenciaFim:x.vigenciaFim,fonte:x.fonte,origemRegistro:x.origemRegistro??null,situacao:C(x),aliquotaEfetiva:p===null?null:Number((p*(1-x.reducaoAliquota)).toFixed(6))})),T=r?"informada_na_consulta":e.empresa.barOuRestaurante?"nao_informada":"deduzida_pelo_motor",N=it(t,e.empresa.regime,i),L=l.explicacaoInformativa,b=(L?.lacunas.length??0)>0||(L?.lacunasDeCobertura?.length??0)>0,O=m.length>0||b||[...e.bloqueios.values()].some(x=>x.ncm===a.ncm),A;return c.estado==="INDETERMINADO"?A={tipo:"INDETERMINADO",texto:`O motor n\xE3o classificou: ${c.motivo}`}:c.estado==="NAO_OBRIGATORIO"?A={tipo:"NAO_OBRIGATORIO",texto:`Na data da consulta o grupo IBS/CBS ainda n\xE3o \xE9 exigido para este modelo e regime. ${c.motivo}`}:c.esperado===null?A={tipo:"REQUER_VALIDACAO_HUMANA",texto:`O motor encontrou ${c.regrasCandidatas.length} enquadramento(s) poss\xEDvel(is) e n\xE3o escolhe entre eles: a decis\xE3o depende de confirma\xE7\xE3o humana de que o produto atende \xE0 descri\xE7\xE3o legal.`}:c.regraAplicada?A={tipo:"ENQUADRAMENTO_DETERMINADO",texto:`Enquadramento determinado pelo motor: CST ${c.esperado.cst} e cClassTrib ${c.esperado.cClassTrib} (${c.regraAplicada}).`}:c.esperado.cst===da.cst&&c.esperado.cClassTrib===da.cClassTrib?A={tipo:"REGRA_GERAL_SEM_BENEFICIO",texto:`Nenhuma regra de benef\xEDcio aplic\xE1vel a este NCM na base, na data da consulta: o motor indica a regra geral, CST ${c.esperado.cst} e cClassTrib ${c.esperado.cClassTrib}.`+(b?" Aten\xE7\xE3o: a fonte oficial lista este NCM em c\xF3digo(s) sem regra correspondente na base (lacuna da fonte); nenhuma regra foi criada por isso.":"")}:A={tipo:"ENQUADRAMENTO_DETERMINADO",texto:`Enquadramento determinado pelo motor: CST ${c.esperado.cst} e cClassTrib ${c.esperado.cClassTrib}.`},{ok:!0,ncm:a.ncm,parametros:{data:li(i),modelo:t,regime:e.empresa.regime,barOuRestaurante:!!e.empresa.barOuRestaurante,natureza:r,naturezaOrigem:T,entrada:String(o.ncm),versaoBase:e.base.versao},obrigatoriedade:N?{obrigatorio:N.obrigatorio,fonte:N.fonte}:null,conclusao:A,encontradoNaBase:O,descricaoNcm:[...new Set(m.map(x=>x.descricaoNcmTipi).filter(x=>!!x))],regras:S,veredito:l,alertas:d,aliquotas:u}}var ip,np,li,oc,rc=w(()=>{"use strict";f();Fa();pt();Gr();nt();ip="CONSULTA-NCM",np=["mercadoria","preparado_no_local","bebida_alcoolica","servico"];li=o=>o.slice(0,10),oc=new WeakMap});function nc(o){let e=new Map,a=[];try{a=_e(o).filter(t=>t.toLowerCase().endsWith(".xml"))}catch{return[]}for(let t of a){let r=P((0,ic.join)(o,t),"utf8"),i=/<emit>([\s\S]*?)<\/emit>/.exec(r)?.[1],n=i?/<CNAE>(\d+)<\/CNAE>/.exec(i)?.[1]:void 0;n&&e.set(n,(e.get(n)??0)+1)}return[...e].map(([t,r])=>({cnae:t,xmls:r})).sort((t,r)=>r.xmls-t.xmls)}function sc(o){let e=o.agora??new Date().toISOString(),a=b=>o.lei.artigos.find(O=>O.dispositivo===b),t=a("Art. 273"),r=a("Art. 275");if(!t||!r)throw new Error("Texto legal do regime de bares e restaurantes incompleto (arts. 273 e 275).");let i=o.cnaes.map(b=>({...b,formatado:mp(b.cnae),descricao:dp[b.cnae]??null,corresponde:b.cnae.startsWith(lp),excluido:b.cnae===up})),n=o.empresa.barOuRestaurante===!0,s=i.filter(b=>b.corresponde),c=i.filter(b=>b.excluido),l=i.filter(b=>!b.corresponde&&!b.excluido),d=/reduzidas em (\d+(?:,\d+)?)%/.exec(r.texto),u=d?Number(d[1].replace(",","."))/100:null,p=["CBS","IBS"].map(b=>Ma(b,e,!1,la)).filter(b=>!!b).map(b=>({tributo:b.tributo,aliquota:b.aliquota,fonte:b.fonte})),m=p.length===2?Number(p.reduce((b,O)=>b+O.aliquota,0).toFixed(6)):null,g=b=>`${o.lei.fonte.url}#${b}`,v=b=>b.split(/\s(?=§ \d+º)/),C={atividadeDaLei:"Bares e restaurantes, inclusive lanchonetes",descricao:"Regime espec\xEDfico de incid\xEAncia do IBS e da CBS, com redu\xE7\xE3o das al\xEDquotas.",percentualReducao:K.reducao,percentualNaLei:u,aliquotas:p,aliquotaGeral:m,aliquotaAposReducao:m===null?null:Number((m*(1-K.reducao)).toFixed(6)),dataAliquotas:e.slice(0,10),fundamentoLegal:"LC 214/2025, arts. 273 a 276 (redu\xE7\xE3o: art. 275)",condicoes:v(t.texto).slice(1).map(b=>({dispositivo:`Art. 273, ${b.slice(0,4).trim()}`,texto:b})),textoLegal:o.lei.artigos.map(b=>({...b,url:g(b.ancora)}))},S=[];S.push(i.length?{camada:"FONTE_DIZ",texto:`CNAE do emitente nos XMLs da an\xE1lise (campo emit/CNAE): ${i.map(b=>`${b.formatado}${b.descricao?` (${b.descricao})`:""} em ${b.xmls} XML(s)`).join("; ")}.`}:{camada:"PENDENTE",texto:"Os XMLs da an\xE1lise n\xE3o informam o CNAE do emitente (ou a an\xE1lise n\xE3o tem XMLs)."}),S.push({camada:n?"HUMANO_CONFIRMOU":"PENDENTE",texto:n?"Atividade confirmada: a empresa atende consumo no local (bar, restaurante ou lanchonete), declarada nesta an\xE1lise ou no cadastro da empresa (barOuRestaurante = true).":"Atividade n\xE3o confirmada: a empresa n\xE3o foi declarada bar, restaurante ou lanchonete, nem nesta an\xE1lise nem no cadastro da empresa (barOuRestaurante ausente ou false)."}),s.length&&S.push({camada:"SISTEMA_INFERE",texto:`O sistema associou o CNAE ${s.map(b=>b.formatado).join(", ")} (classe 56.11-2, restaurantes e outros estabelecimentos de servi\xE7os de alimenta\xE7\xE3o e bebidas) \xE0 atividade "bares e restaurantes, inclusive lanchonetes" do art. 273. A lei n\xE3o lista CNAEs para o regime; o v\xEDnculo \xE9 do sistema.`}),c.length&&S.push({camada:"FONTE_DIZ",texto:'LC 214/2025, art. 273, \xA7 2\xBA, I: o fornecimento "por empresa classificada na posi\xE7\xE3o 5620-1/01 da Classifica\xE7\xE3o Nacional de Atividades Econ\xF4micas (CNAE)" n\xE3o est\xE1 sujeito ao regime.'}),S.push({camada:"FONTE_DIZ",texto:`LC 214/2025, art. 275: "${r.texto.replace(/^Art\. 275\.\s*/,"")}"`}),S.push(u===K.reducao?{camada:"SISTEMA_INFERE",texto:`O percentual do regime usado pelo motor (${K.reducao*100}%, ${K.fundamento}) confere com o texto do art. 275.`}:{camada:"PENDENTE",texto:`O percentual do motor (${K.reducao*100}%) n\xE3o p\xF4de ser conferido com o texto do art. 275.`}),S.push({camada:"PENDENTE",texto:"Condi\xE7\xF5es do art. 273, \xA7\xA7 1\xBA e 2\xBA, dependem de cada fornecimento (preparo no estabelecimento, bebida alco\xF3lica, produto de terceiros, alimenta\xE7\xE3o para pessoa jur\xEDdica sob contrato) e n\xE3o s\xE3o comprovadas pelo XML. A aplica\xE7\xE3o item a item continua com o motor, pela natureza do item; nada aqui altera a tributa\xE7\xE3o do produto."});let T,N;c.length&&!s.length&&!n?(T="NENHUM",N="O CNAE do emitente \xE9 5620-1/01, exclu\xEDdo do regime de bares e restaurantes pelo art. 273, \xA7 2\xBA, I."):n&&s.length&&!l.length&&!c.length?(T="CONFIRMADO",N="A atividade est\xE1 confirmada no cadastro da empresa e o CNAE dos XMLs corresponde a bares e restaurantes. O regime da atividade se aplica aos fornecimentos que atendem ao art. 273; cada item continua classificado pelo motor."):n||s.length?(T="REQUER_VALIDACAO",N=n?`A empresa foi declarada bar ou restaurante, mas ${i.length?`o CNAE dos XMLs (${l.concat(c).map(b=>b.formatado).join(", ")}) n\xE3o confirma a atividade`:"os XMLs n\xE3o informam o CNAE"}.`:`O CNAE dos XMLs (${s.map(b=>b.formatado).join(", ")}) indica bares e restaurantes, mas a atividade n\xE3o foi confirmada. Enquanto n\xE3o for confirmada (bot\xE3o "A empresa atende consumo no local"), o motor trata os itens como mercadoria.`):(T="NENHUM",N=i.length?`O CNAE dos XMLs (${i.map(b=>b.formatado).join(", ")}) n\xE3o corresponde a nenhum regime por atividade da base consultada (bares e restaurantes, arts. 273 a 276).`:"Sem CNAE nos XMLs e sem marca\xE7\xE3o de atividade no cadastro: nenhum regime por atividade da base consultada foi identificado.");let L=s.length?s.map(b=>`${b.formatado}${b.descricao?` \u2014 ${b.descricao}`:""}`).join("; "):i.length?i.map(b=>`${b.formatado}${b.descricao?` \u2014 ${b.descricao}`:""}`).join("; "):n?"Bar ou restaurante (declarado pela empresa)":"n\xE3o identificada";return{classificacao:T,rotulo:pp[T],atividade:{cnaes:i,declaradaNoCadastro:n,descricao:L},beneficio:T==="NENHUM"?null:C,motivo:N,auditoria:S,fonte:o.lei.fonte}}var ic,lp,dp,up,pp,mp,cc=w(()=>{"use strict";f();le();ic=ue(Ne(),1);Fa();nt();lp="5611",dp={5611201:"Restaurantes e similares",5611203:"Lanchonetes, casas de ch\xE1, de sucos e similares",5611204:"Bares e outros estabelecimentos especializados em servir bebidas, sem entretenimento",5611205:"Bares e outros estabelecimentos especializados em servir bebidas, com entretenimento"},up="5620101",pp={CONFIRMADO:"BENEF\xCDCIO CONFIRMADO",REQUER_VALIDACAO:"BENEF\xCDCIO POTENCIALMENTE APLIC\xC1VEL \u2014 REQUER VALIDA\xC7\xC3O",NENHUM:"NENHUM BENEF\xCDCIO POR ATIVIDADE IDENTIFICADO"},mp=o=>/^\d{7}$/.test(o)?`${o.slice(0,4)}-${o.slice(4,5)}/${o.slice(5)}`:o});var Ep={};function Io(o,e,a={}){console.log(`[${new Date().toISOString()}] ${o} ${Date.now()-e} ms ${JSON.stringify(a)}`)}function fi(){return Ks({raiz:M,arquivoEmpresa:mi,pastaSaida:W,arquivoBase:Ke,arquivoV2:V.default.join(E.cwd(),"data","base-normativa.v2.json"),arquivoMatriz:V.default.join(E.cwd(),"docs","etapa6","matriz-decisao.json")})}function gi(){try{return si(M,mi)}catch{return{}}}function ve(o,e=[]){try{return JSON.parse(me.readFileSync(o,"utf8"))}catch{return e}}function bp(){let o=me.existsSync(Ke)?me.statSync(Ke):null,e=o?`${o.mtimeMs}:${o.size}`:"ausente";if(di?.chave===e)return di.porIdENcm;let a=ve(Ke,{regras:[]}),t=new Map;for(let r of a.regras){let i=`${r.id}|${r.ncm}`;t.has(i)||t.set(i,[]),t.get(i).push(r)}return di={chave:e,porIdENcm:t},t}function xp(o,e){let a=bp();return e.map(t=>{let r=a.get(`${t}|${o}`)??[],i=n=>{let s=[...new Set(r.map(c=>c[n]??null))];return s.length===1?s[0]:null};return{id:t,cst:i("cst"),cClassTrib:i("cClassTrib"),rotulo:i("rotulo"),anexo:i("anexo"),item:i("item"),descricaoLegal:i("descricaoLegal"),fundamentoLegal:i("fundamentoLegal"),reducao:i("reducao"),reducaoAliquota:i("reducaoAliquota"),descricaoNcmTipi:i("descricaoNcmTipi"),identificadorRepetido:r.length>1,regrasComEsteIdentificador:r.length,descricoesLegaisDivergentes:r.length>1&&i("descricaoLegal")===null?[...new Set(r.map(n=>n.descricaoLegal))]:[]}})}function hi(o){let e=V.default.join(W,"reducoes-exibicao.json"),a=V.default.join(W,"vereditos.json"),t=V.default.join(W,"vereditos.json");if(!me.existsSync(e)||!me.existsSync(t))return{disponivel:!1,motivo:"\xEDndice de redu\xE7\xF5es indispon\xEDvel para os resultados atuais"};let r=s=>{let c=me.statSync(s);return`${c.mtimeMs}:${c.size}`},i=`${r(e)}|${r(t)}`;if(It?.chave===i)return It.valor;let n;try{let s=JSON.parse(me.readFileSync(e,"utf8")),c=new Map,l=m=>{let g=JSON.stringify(m);return c.has(g)||c.set(g,m),c.get(g)},d=Array.isArray(s)?s.map(m=>({...m,exibicao:l(m.exibicao)})):s.itens.map(m=>({...m,exibicao:s.exibicoes[m.exibicao]})),u=new Map(d.map(m=>[`${m.documento}|${m.nItem}`,m.exibicao])),p=new Map(d.filter(m=>m.estado==="REQUER_VALIDACAO").reverse().map(m=>[`${m.ncm}|${m.cProd}|${m.produto}`,m.exibicao]));n={disponivel:!0,porItem:u,porPendencia:p}}catch{n={disponivel:!1,motivo:"n\xE3o foi poss\xEDvel ler o \xEDndice de redu\xE7\xF5es"}}return It={chave:i,valor:n},n}function mc(o,e){return new Set(e.filter(a=>a.resposta==="NAO"&&a.ncm===o.ncm&&(a.cProd===o.cProd||a.cProd===o.produto)).map(a=>a.regraId))}function Ap(o,e,a){if(!o||o.situacao!=="prevista")return o;let t=mc(e,a);return{...o,opcoes:o.opcoes.filter(r=>!t.has(r.regraId))}}function Ip(o,e){let t=ve(pc,[]).find(n=>n.ncm===o&&(n.cProd===e||n.produto===e));if(!t)return;let r=hi([]),i=r.disponivel?r.porPendencia.get(`${t.ncm}|${t.cProd}|${t.produto}`)??null:null;Zs(M,fc(t.ncm,t.cProd),{pendencia:t,exibicao:i,respondidaEm:new Date().toISOString()})}function gc(){let o=me.statSync(uc),e=`${o.mtimeMs}:${o.size}`;return pi?.chave!==e&&(pi={chave:e,base:bt(uc)}),pi.base}var V,z,lc,fp,gp,mi,W,pc,M,Ke,hp,vp,di,It,fc,dc,ui,Et,uc,pi,hc=w(()=>{"use strict";f();cn();Qt();le();V=ue(Ne(),1);dn();Ms();ci();Kr();ho();ac();Ba();rc();pt();Ba();cc();oi();ci();z=eo(),lc=Number(E.env.PORT)||3e3;z.use(eo.json());fp=1e4,gp=Kt({dest:V.default.join(E.cwd(),"uploads")}),mi=V.default.join(E.cwd(),"empresa.json"),W=V.default.join(E.cwd(),"saida-teste"),pc=V.default.join(W,"fila-validacao.json"),M=V.default.join(E.cwd(),"analise-atual"),Ke=V.default.join(E.cwd(),"data","base-normativa.json");me.existsSync(M)||(ti(M,W),console.log("Nova an\xE1lise iniciada (sem dados de an\xE1lises anteriores)."));hp=["CONSUMO_NO_LOCAL","MERCADORIA_SEM_BENEFICIO","NCM_INCORRETO"],vp="NATUREZA_DO_ITEM",di=null;z.use("/vendor",eo.static(V.default.join(E.cwd(),"public","vendor")));z.use("/marca",eo.static(V.default.join(E.cwd(),"public","marca")));z.get("/",(o,e)=>{e.send(ec())});z.get("/api/analise",(o,e)=>{let a=Ye(M),t=V.default.join(W,"vereditos.json"),r=a>0&&me.existsSync(t),i={},n=new Set;if(r)for(let c of ve(t,[]))i[c.estado]=(i[c.estado]??0)+1,n.add(c.documento);let s=c=>i[c]??0;e.json({processados:a,aguardando:xo(M),respostas:ga(M).length,processada:r,resultadosDesatualizados:r&&Ao(M),resumo:r?{xmls:a,documentos:n.size,itens:Object.values(i).reduce((c,l)=>c+l,0),corretos:s("CORRETO"),recalculo:s("INCORRETO_ECONOMIA")+s("INCORRETO_RISCO"),incorretos:s("INCORRETO_NCM"),ncmAAjustar:s("INCORRETO_NCM"),precisamValidar:s("REQUER_VALIDACAO"),naoObrigatorio:s("NAO_OBRIGATORIO"),indeterminado:s("INDETERMINADO"),porEstado:i}:null,indicadores:r?ve(V.default.join(W,"indicadores.json"),{}):null,composicao:r?ve(V.default.join(W,"composicao.json"),null):null})});z.post("/api/nova-analise",(o,e)=>{try{ti(M,W),It=null,Et=null;let a=Ye(M)+xo(M)+At.filter(t=>me.existsSync(V.default.join(W,t))).length;if(a>0)throw new Error(`${a} arquivo(s) da an\xE1lise anterior n\xE3o foram apagados`);e.json({sucesso:!0})}catch(a){console.error("Erro ao iniciar nova an\xE1lise:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel iniciar a nova an\xE1lise."})}});z.get("/api/respostas",(o,e)=>{e.json(ga(M))});z.post("/api/validar",(o,e)=>{let a=Date.now();try{let{ncm:t,cProd:r,regraId:i,regraIds:n,resposta:s,autor:c,justificativa:l,escolha:d}=o.body;if(d!==void 0&&(!hp.includes(d)||s!=="NAO"))return e.status(400).json({erro:"Escolha de valida\xE7\xE3o inv\xE1lida."});let u=Array.isArray(n)&&n.length?n.map(String):i?[String(i)]:[];if(!u.length&&d!==void 0&&u.push(vp),!t||!r||!u.length||!["SIM","NAO"].includes(s))return e.status(400).json({erro:"Dados de valida\xE7\xE3o inv\xE1lidos."});let p=ua(Ke);if(u.some(S=>p.has(fo(S,t))))return e.status(400).json({erro:`${Vr} A valida\xE7\xE3o n\xE3o est\xE1 dispon\xEDvel para esta regra.`,bloqueada:!0});let m=new Date().toISOString().slice(0,10),g=u.map(S=>({ncm:t,cProd:r,regraId:S,resposta:s,autor:c||"Sistema",data:m,...l?{justificativa:l}:{},...d?{escolha:d}:{}}));Ip(String(t),String(r));let C=Qs(M,g).filter(S=>S.ncm===t&&S.cProd===r);Io("validacao",a,{ncm:t,cProd:r,resposta:s,escolha:d??null,regras:u.length}),e.json({sucesso:!0,mensagem:"Valida\xE7\xE3o gravada com sucesso.",respostas:C,resultadosDesatualizados:Ao(M)})}catch(t){console.error("Erro ao gravar valida\xE7\xE3o:",t),e.status(500).json({erro:"N\xE3o foi poss\xEDvel gravar a valida\xE7\xE3o.",detalhe:t instanceof Error?t.message:String(t)})}});z.post("/api/atualizar-resultados",(o,e)=>{let a=Date.now();try{if(!Ao(M)){e.json({sucesso:!0,atualizado:!1});return}let t=fi();Io("atualizar-resultados",a,{xmls:t.xmls,pendencias:t.pendencias,alertas:t.alertas.disponivel}),e.json({sucesso:!0,atualizado:!0,pendencias:t.pendencias,alertas:t.alertas})}catch(t){console.error("Erro ao atualizar os resultados:",t),e.status(500).json({erro:"N\xE3o foi poss\xEDvel atualizar os resultados com as valida\xE7\xF5es.",detalhe:t instanceof Error?t.message:String(t)})}});z.post("/api/importar",gp.array("arquivos",fp),(o,e)=>{try{let a=o.files??[];if(a.length===0)return e.status(400).json({erro:"Nenhum arquivo XML foi enviado."});let t=Gs(M,a.map(r=>({nome:r.originalname,caminho:r.path})));e.json({sucesso:!0,adicionados:t,aguardando:xo(M),processados:Ye(M)})}catch(a){console.error("Erro ao adicionar XMLs:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel adicionar os XMLs.",detalhe:a instanceof Error?a.message:String(a)})}});z.get("/api/notas-da-analise",(o,e)=>{try{let a=J(M);e.json({notas:Vs([a.xmls,a.aguardando])})}catch(a){console.error("Erro ao listar as notas da an\xE1lise:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel ler as notas da an\xE1lise.",detalhe:a instanceof Error?a.message:String(a)})}});z.post("/api/processar",(o,e)=>{try{if(Ye(M)+xo(M)===0)return e.status(400).json({erro:"A an\xE1lise atual n\xE3o tem XMLs. Adicione XMLs antes de processar."});let a=Xs(M),t=fi();e.json({sucesso:!0,incorporados:a,xmls:t.xmls,documentos:t.documentos,descartados:t.descartados,indicadores:t.indicadores,pendencias:t.pendencias,alertas:t.alertas})}catch(a){console.error("Erro ao processar a an\xE1lise:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel processar a an\xE1lise.",detalhe:a instanceof Error?a.message:String(a)})}});z.get("/api/dashboard",(o,e)=>{try{e.json({indicadores:ve(V.default.join(W,"indicadores.json"),{}),vereditos:ve(V.default.join(W,"vereditos.json"),[]),explicacoes:_s(V.default.join(W,"explicacoes.json"),"vereditos")??{}})}catch{e.status(500).json({erro:"N\xE3o foi poss\xEDvel carregar o dashboard."})}});It=null;z.get("/api/resultados",(o,e)=>{try{let a=ve(V.default.join(W,"vereditos.json"),[]),t=hi(a),r=ga(M),i=l=>{if(!t.disponivel)return{reducaoExibicao:null,reducaoIndisponivel:t.motivo,auditoriaExibicao:null,lacunasDeCobertura:[],bloqueiosExibicao:{}};let d=t.porItem.get(`${l.documento}|${l.nItem}`);return{reducaoExibicao:Ap(d?.reducao??null,l,r),auditoriaExibicao:d?.auditoria??{},lacunasDeCobertura:d?.lacunas??[],bloqueiosExibicao:d?.bloqueios??{}}};if(o.query?.compacto!=="1"){e.json(a.map(l=>({...l,...i(l)})));return}let n=[],s=new Map,c=a.map(l=>{let d=t.disponivel?t.porItem.get(`${l.documento}|${l.nItem}`):void 0,u=d?.reducao?.situacao==="prevista"?[...mc(l,r)].sort().join("|"):"",p=s.get(d);p||s.set(d,p=new Map);let m=p.get(u);return m===void 0&&(m=n.push(i(l))-1,p.set(u,m)),{...l,exibicao:m}});e.json({compacto:!0,exibicoes:n,vereditos:c})}catch{e.status(500).json({erro:"N\xE3o foi poss\xEDvel carregar os resultados."})}});z.get("/api/regras",(o,e)=>{var r;let a=ve(Ke,{regras:[]}),t={};for(let i of a.regras)t[r=`${i.id}|${i.ncm}`]??(t[r]={rotulo:i.rotulo??null,anexo:i.anexo??null,item:i.item??null,cClassTrib:i.cClassTrib??null,cst:i.cst??null,fundamentoLegal:i.fundamentoLegal??null,reducao:i.reducaoAliquota??null,vigenciaInicio:i.vigenciaInicio??null,fonte:i.fonte??null,descricaoLegal:i.descricaoLegal??null});e.json(t)});fc=(o,e)=>`${o}|${e}`,dc=(o,e)=>o.some(a=>a.ncm===e.ncm&&(a.cProd===e.cProd||a.cProd===e.produto));z.get("/api/fila-validacao",(o,e)=>{let a=Date.now();try{let t=ve(pc,[]),r=ve(V.default.join(W,"vereditos.json"),[]),i=hi(r),n=ga(M),s=Ao(M),c=gi().barOuRestaurante,l=new Map;for(let v of r){if(v.informado.cst!==null||v.informado.cClassTrib!==null)continue;let C=l.get(v.cProd)??{total:0,naoObrigatorios:0};C.total+=1,v.estado==="NAO_OBRIGATORIO"&&(C.naoObrigatorios+=1),l.set(v.cProd,C)}let d=(v,C,S)=>{let T=xp(v.ncm,v.regras??[]);return{...v,respondida:S,regrasDetalhe:T.map(N=>({...N,reducao:C?.reducao?.opcoes.find(L=>L.regraId===N.id)??null,auditoria:C?.auditoria[N.id]??null})),lacunasDeCobertura:C?.lacunas??[],opcoesValidacao:sn(v.ncm,v.produto,T.map(N=>({id:N.id,cst:N.cst,cClassTrib:N.cClassTrib,anexo:N.anexo,item:N.item,descricaoLegal:N.descricaoLegal,fundamentoLegal:N.fundamentoLegal,reducaoAliquota:typeof N.reducaoAliquota=="number"?N.reducaoAliquota:null,descricaoNcmTipi:typeof N.descricaoNcmTipi=="string"?N.descricaoNcmTipi:null})),{consumoNoLocal:c===!0}),regrasBloqueadasDetalhe:Object.values(C?.bloqueios??{}),reducaoIndisponivel:i.disponivel?null:i.motivo,respostasDestaAnalise:n.filter(N=>N.ncm===v.ncm&&(N.cProd===v.cProd||N.cProd===v.produto)),itensSemInformacaoTributaria:l.get(v.cProd)?.total??0,itensNaoObrigatoriosSemInformacao:l.get(v.cProd)?.naoObrigatorios??0}},u=v=>i.disponivel?i.porPendencia.get(`${v.ncm}|${v.cProd}|${v.produto}`)??null:null,p=[],m=new Set;for(let v of t)m.add(fc(v.ncm,v.cProd)),p.push(d(v,u(v),s&&dc(n,v)));let g=ni(M);for(let[v,C]of Object.entries(g))m.has(v)||!dc(n,C.pendencia)||p.push(d(C.pendencia,C.exibicao,!0));Io("fila-validacao",a,{pendentes:p.filter(v=>!v.respondida).length,respondidas:p.filter(v=>v.respondida).length}),e.json(p)}catch(t){console.error("Erro ao ler fila-validacao.json:",t),e.status(500).json({erro:"N\xE3o foi poss\xEDvel ler a fila de valida\xE7\xE3o.",detalhe:t instanceof Error?t.message:String(t)})}});z.get("/api/alertas",(o,e)=>{e.json(Ps(W))});ui=null;z.post("/api/consulta-ncm",(o,e)=>{try{if(!ui){let s=ut({base:Ke,v2:V.default.join(E.cwd(),"data","base-normativa.v2.json"),matriz:V.default.join(E.cwd(),"docs","etapa6","matriz-decisao.json"),empresa:mi}),c=ua(Ke);ui={base:s.base,explicacao:s,bloqueios:c,regrasBloqueadas:qa(c)}}let a=gi();if(!a.regime){e.status(400).json({erro:"empresa.json sem o regime do emitente: a consulta precisa dele para saber se o grupo IBS/CBS \xE9 exigido."});return}let{ncm:t,modelo:r,natureza:i}=o.body??{},n=tc({ncm:t,modelo:r,natureza:i},{...ui,empresa:a});if(!n.ok){e.status(400).json({erro:n.erro});return}e.json(n)}catch(a){console.error("Erro na consulta por NCM:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel consultar o NCM."})}});Et=null;z.get("/api/beneficio-atividade",(o,e)=>{try{let a=V.default.join(M,"xmls"),t=me.existsSync(a)?me.readdirSync(a).filter(s=>s.toLowerCase().endsWith(".xml")).sort():[],r=`${t.length}|${t[0]??""}|${t[t.length-1]??""}`;Et?.chave!==r&&(Et={chave:r,valor:nc(a)});let i=ve(V.default.join(E.cwd(),"data","fontes","lc214","regime-bares-restaurantes.json"),null);if(!i){e.status(500).json({erro:"Texto legal do regime por atividade n\xE3o encontrado (data/fontes/lc214/regime-bares-restaurantes.json)."});return}let n=gi();e.json(sc({empresa:n,cnaes:Et.valor,lei:i}))}catch(a){console.error("Erro no benef\xEDcio por atividade:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel verificar o benef\xEDcio por atividade."})}});z.post("/api/atividade",(o,e)=>{try{let{barOuRestaurante:a}=o.body??{};if(typeof a!="boolean"){e.status(400).json({erro:"Informe barOuRestaurante: true ou false."});return}Ys(M,{barOuRestaurante:a});let t=Ye(M)>0?fi():null;e.json({sucesso:!0,barOuRestaurante:a,pendencias:t?.pendencias??0})}catch(a){console.error("Erro ao gravar a atividade da empresa:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel gravar a atividade da empresa."})}});uc=V.default.join(E.cwd(),"data","imposto-seletivo.json"),pi=null;z.get("/api/imposto-seletivo",(o,e)=>{let a=Date.now();try{let t=gc(),r=ve(V.default.join(W,"imposto-seletivo.json"),null),i=ii(M),n=(r?.produtos??[]).map(s=>ai(s,i[s.chave]??null,t));Io("imposto-seletivo",a,{produtos:n.length}),e.json({disponivel:r?.disponivel??!1,motivo:r?r.motivo??null:"an\xE1lise ainda n\xE3o processada",baseDesatualizada:!!r?.versaoBase&&r.versaoBase!==t.versao,base:{versao:t.versao,historico:t.historico,fontes:t.fontes,vigencia:t.vigencia,aliquotas:t.aliquotas,categorias:t.categorias.map(s=>({id:s.id,nome:s.nome,codigos:s.codigos,fundamento:s.fundamento}))},produtos:n})}catch(t){console.error("Erro no Imposto Seletivo:",t),e.status(500).json({erro:"N\xE3o foi poss\xEDvel carregar o Imposto Seletivo.",detalhe:t instanceof Error?t.message:String(t)})}});z.post("/api/imposto-seletivo/validar",(o,e)=>{let a=Date.now();try{let{ncm:t,cProd:r,escolha:i,autor:n}=o.body??{};if(typeof r!="string"||!r||t!==null&&typeof t!="string"||!xt.includes(i)){e.status(400).json({erro:"Dados da escolha do Imposto Seletivo inv\xE1lidos."});return}let s=`${t??""}|${r}`,l=ve(V.default.join(W,"imposto-seletivo.json"),null)?.produtos.find(u=>u.chave===s);if(!l){e.status(404).json({erro:"Produto n\xE3o encontrado no Imposto Seletivo desta an\xE1lise. Processe a an\xE1lise e tente de novo."});return}let d=Ws(M,s,i,n);Io("imposto-seletivo-validacao",a,{chave:s,escolha:i}),e.json({sucesso:!0,produto:ai(l,d,gc())})}catch(t){console.error("Erro ao gravar a escolha do Imposto Seletivo:",t),e.status(500).json({erro:"N\xE3o foi poss\xEDvel gravar a escolha do Imposto Seletivo.",detalhe:t instanceof Error?t.message:String(t)})}});z.listen(lc,()=>{console.log(`Servidor iniciado em http://localhost:${lc}`)})});f();le();Qt();var Cp="conformidade-ibs-cbs",ha="arquivos",Np=24*1024*1024,Rp=2e3,Eo=16*1024*1024,Ct="\0";function Sp(){return new Promise(o=>{try{let e=indexedDB.open(Cp,1);e.onupgradeneeded=()=>e.result.createObjectStore(ha),e.onsuccess=()=>o(e.result),e.onerror=()=>o(null)}catch{o(null)}})}function xc(o){return new Promise((e,a)=>{o.oncomplete=()=>e(),o.onerror=()=>a(o.error),o.onabort=()=>a(o.error??new Error("grava\xE7\xE3o interrompida pelo navegador"))})}var Co=new Set;async function Op(o){let a=o.transaction(ha,"readonly").objectStore(ha),t=new Map;await new Promise((r,i)=>{let n=a.openCursor();n.onsuccess=()=>{let s=n.result;if(!s)return r();let c=String(s.key),l=s.value,d=c.indexOf(Ct);if(d>=0){let u=t.get(c.slice(0,d));u&&l instanceof Uint8Array&&(u.partes[Number(c.slice(d+1))]=l)}else!(l instanceof Uint8Array)&&l.tipo==="partes"?(t.set(c,{registro:l,partes:[]}),Co.add(c)):l instanceof Uint8Array||zt(c,l);s.continue()},n.onerror=()=>i(n.error)});for(let[r,{registro:i,partes:n}]of t){let s=new Uint8Array(i.tamanho),c=0,l=!0;for(let d=0;d<i.partes;d++){let u=n[d];if(!u||c+u.length>s.length){l=!1;break}s.set(u,c),c+=u.length}l&&c===s.length&&zt(r,{tipo:"arq",dados:s,mtimeMs:i.mtimeMs})}}var vc=o=>IDBKeyRange.bound(o+Ct,o+Ct+"\uFFFF");async function vi(o){be("/tmp",{recursive:!0,force:!0});let e=on();if(!o||!e.length)return!0;let a=0;try{for(;a<e.length;){let t=o.transaction(ha,"readwrite"),r=t.objectStore(ha),i=xc(t),n=0,s=0,c=a;try{for(;c<e.length&&(c===a||n<Np&&s<Rp);){let[l,d]=e[c];if(Co.has(l)&&r.delete(vc(l)),!d)r.delete(l);else if(d.tipo==="arq"&&d.dados.length>Eo){if(c>a)break;let u=Math.ceil(d.dados.length/Eo);r.delete(vc(l)),r.put({tipo:"partes",partes:u,tamanho:d.dados.length,mtimeMs:d.mtimeMs},l);for(let p=0;p<u;p++)r.put(d.dados.slice(p*Eo,(p+1)*Eo),l+Ct+String(p));c++;break}else r.put(d,l),n+=d.tipo==="arq"?d.dados.length:d.tipo==="resumo"?d.cabeca.length:0;s++,c++}}catch(l){try{t.abort()}catch{}throw await i.catch(()=>{}),l}await i;for(let l=a;l<c;l++){let[d,u]=e[l];u?.tipo==="arq"&&u.dados.length>Eo?Co.add(d):Co.delete(d)}a=c}return!0}catch(t){return console.error("N\xE3o foi poss\xEDvel salvar a an\xE1lise no navegador:",t),an(e.slice(a).map(([r])=>r)),!1}}async function Ac(o){if(Co.clear(),!o)return;let e=o.transaction(ha,"readwrite"),a=e.objectStore(ha);a.clear();let t=a.count();if(await xc(e),t.result!==0)throw new Error(`${t.result} registro(s) continuam guardados no navegador`)}async function yp(){let o=new URL("dados/",self.location.href),e=await(await fetch(new URL("manifesto.json",o))).json();await Promise.all(e.map(async a=>{let t=await fetch(new URL(a,o));if(!t.ok)throw new Error(`Falha ao baixar ${a}: HTTP ${t.status}`);Ki("/app/"+a,new Uint8Array(await t.arrayBuffer()))}))}var wp=self.location.hash==="#limpar",Tp=(async()=>{let o=await Sp();return wp?await Ac(o):o&&await Op(o),await yp(),await Promise.resolve().then(()=>(hc(),Ep)),await vi(o),o})(),Ic=(o,e)=>({status:500,corpo:JSON.stringify({erro:o,detalhe:e instanceof Error?e.message:String(e)}),tipo:"application/json; charset=utf-8"});async function _p(o,e){en(),await Ac(o);let a=await Xt(e.metodo,e.caminho,e.query,e.corpo,e.arquivos);return a.status!==200||await vi(o)?a:Ic("N\xE3o foi poss\xEDvel concluir a limpeza.","as pastas da nova an\xE1lise n\xE3o puderam ser gravadas no navegador")}var bc=Promise.resolve();self.onmessage=o=>{let e=o.data;bc=bc.then(async()=>{let a;try{let t=await Tp;e.metodo==="POST"&&e.caminho==="/api/nova-analise"?a=await _p(t,e):(a=await Xt(e.metodo,e.caminho,e.query,e.corpo,e.arquivos),await vi(t))}catch(t){console.error(t),a=Ic(e.caminho==="/api/nova-analise"?"N\xE3o foi poss\xEDvel concluir a limpeza.":"Falha ao executar o sistema no navegador.",t)}self.postMessage({id:e.id,...a})})};})();
