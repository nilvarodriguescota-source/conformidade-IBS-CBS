"use strict";(()=>{var js=Object.create;var Gr=Object.defineProperty;var Vs=Object.getOwnPropertyDescriptor;var Us=Object.getOwnPropertyNames;var ks=Object.getPrototypeOf,$s=Object.prototype.hasOwnProperty;var O=(o,e,a)=>()=>{if(a)throw a[0];try{return o&&(e=o(o=0)),e}catch(t){throw a=[t],t}};var ho=(o,e)=>()=>{try{return e||o((e={exports:{}}).exports,e),e.exports}catch(a){throw e=0,a}};var zs=(o,e,a,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Us(e))!$s.call(o,r)&&r!==a&&Gr(o,r,{get:()=>e[r],enumerable:!(t=Vs(e,r))||t.enumerable});return o};var ce=(o,e,a)=>(a=o!=null?js(ks(o)):{},zs(e||!o||!o.__esModule?Gr(a,"default",{value:o,enumerable:!0}):a,o));var Jr=ho(vo=>{"use strict";m();vo.byteLength=Gs;vo.toByteArray=Qs;vo.fromByteArray=Zs;var Te=[],xe=[],Hs=typeof Uint8Array<"u"?Uint8Array:Array,lt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(ea=0,Xr=lt.length;ea<Xr;++ea)Te[ea]=lt[ea],xe[lt.charCodeAt(ea)]=ea;var ea,Xr;xe[45]=62;xe[95]=63;function Qr(o){var e=o.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var a=o.indexOf("=");a===-1&&(a=e);var t=a===e?0:4-a%4;return[a,t]}function Gs(o){var e=Qr(o),a=e[0],t=e[1];return(a+t)*3/4-t}function Xs(o,e,a){return(e+a)*3/4-a}function Qs(o){var e,a=Qr(o),t=a[0],r=a[1],i=new Hs(Xs(o,t,r)),n=0,s=r>0?t-4:t,c;for(c=0;c<s;c+=4)e=xe[o.charCodeAt(c)]<<18|xe[o.charCodeAt(c+1)]<<12|xe[o.charCodeAt(c+2)]<<6|xe[o.charCodeAt(c+3)],i[n++]=e>>16&255,i[n++]=e>>8&255,i[n++]=e&255;return r===2&&(e=xe[o.charCodeAt(c)]<<2|xe[o.charCodeAt(c+1)]>>4,i[n++]=e&255),r===1&&(e=xe[o.charCodeAt(c)]<<10|xe[o.charCodeAt(c+1)]<<4|xe[o.charCodeAt(c+2)]>>2,i[n++]=e>>8&255,i[n++]=e&255),i}function Js(o){return Te[o>>18&63]+Te[o>>12&63]+Te[o>>6&63]+Te[o&63]}function Ws(o,e,a){for(var t,r=[],i=e;i<a;i+=3)t=(o[i]<<16&16711680)+(o[i+1]<<8&65280)+(o[i+2]&255),r.push(Js(t));return r.join("")}function Zs(o){for(var e,a=o.length,t=a%3,r=[],i=16383,n=0,s=a-t;n<s;n+=i)r.push(Ws(o,n,n+i>s?s:n+i));return t===1?(e=o[a-1],r.push(Te[e>>2]+Te[e<<4&63]+"==")):t===2&&(e=(o[a-2]<<8)+o[a-1],r.push(Te[e>>10]+Te[e>>4&63]+Te[e<<2&63]+"=")),r.join("")}});var Wr=ho(dt=>{m();dt.read=function(o,e,a,t,r){var i,n,s=r*8-t-1,c=(1<<s)-1,l=c>>1,d=-7,u=a?r-1:0,p=a?-1:1,f=o[e+u];for(u+=p,i=f&(1<<-d)-1,f>>=-d,d+=s;d>0;i=i*256+o[e+u],u+=p,d-=8);for(n=i&(1<<-d)-1,i>>=-d,d+=t;d>0;n=n*256+o[e+u],u+=p,d-=8);if(i===0)i=1-l;else{if(i===c)return n?NaN:(f?-1:1)*(1/0);n=n+Math.pow(2,t),i=i-l}return(f?-1:1)*n*Math.pow(2,i-t)};dt.write=function(o,e,a,t,r,i){var n,s,c,l=i*8-r-1,d=(1<<l)-1,u=d>>1,p=r===23?Math.pow(2,-24)-Math.pow(2,-77):0,f=t?0:i-1,v=t?1:-1,C=e<0||e===0&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(s=isNaN(e)?1:0,n=d):(n=Math.floor(Math.log(e)/Math.LN2),e*(c=Math.pow(2,-n))<1&&(n--,c*=2),n+u>=1?e+=p/c:e+=p*Math.pow(2,1-u),e*c>=2&&(n++,c/=2),n+u>=d?(s=0,n=d):n+u>=1?(s=(e*c-1)*Math.pow(2,r),n=n+u):(s=e*Math.pow(2,u-1)*Math.pow(2,r),n=0));r>=8;o[a+f]=s&255,f+=v,s/=256,r-=8);for(n=n<<r|s,l+=r;l>0;o[a+f]=n&255,f+=v,n/=256,l-=8);o[a+f-v]|=C*128}});var Ao=ho(ha=>{"use strict";m();var ut=Jr(),ma=Wr(),Zr=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;ha.Buffer=h;ha.SlowBuffer=tc;ha.INSPECT_MAX_BYTES=50;var bo=2147483647;ha.kMaxLength=bo;h.TYPED_ARRAY_SUPPORT=Ys();!h.TYPED_ARRAY_SUPPORT&&typeof console<"u"&&typeof console.error=="function"&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");function Ys(){try{let o=new Uint8Array(1),e={foo:function(){return 42}};return Object.setPrototypeOf(e,Uint8Array.prototype),Object.setPrototypeOf(o,e),o.foo()===42}catch{return!1}}Object.defineProperty(h.prototype,"parent",{enumerable:!0,get:function(){if(h.isBuffer(this))return this.buffer}});Object.defineProperty(h.prototype,"offset",{enumerable:!0,get:function(){if(h.isBuffer(this))return this.byteOffset}});function Ue(o){if(o>bo)throw new RangeError('The value "'+o+'" is invalid for option "size"');let e=new Uint8Array(o);return Object.setPrototypeOf(e,h.prototype),e}function h(o,e,a){if(typeof o=="number"){if(typeof e=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return gt(o)}return ai(o,e,a)}h.poolSize=8192;function ai(o,e,a){if(typeof o=="string")return ec(o,e);if(ArrayBuffer.isView(o))return ac(o);if(o==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof o);if(_e(o,ArrayBuffer)||o&&_e(o.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(_e(o,SharedArrayBuffer)||o&&_e(o.buffer,SharedArrayBuffer)))return ft(o,e,a);if(typeof o=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');let t=o.valueOf&&o.valueOf();if(t!=null&&t!==o)return h.from(t,e,a);let r=oc(o);if(r)return r;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof o[Symbol.toPrimitive]=="function")return h.from(o[Symbol.toPrimitive]("string"),e,a);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof o)}h.from=function(o,e,a){return ai(o,e,a)};Object.setPrototypeOf(h.prototype,Uint8Array.prototype);Object.setPrototypeOf(h,Uint8Array);function oi(o){if(typeof o!="number")throw new TypeError('"size" argument must be of type number');if(o<0)throw new RangeError('The value "'+o+'" is invalid for option "size"')}function Ks(o,e,a){return oi(o),o<=0?Ue(o):e!==void 0?typeof a=="string"?Ue(o).fill(e,a):Ue(o).fill(e):Ue(o)}h.alloc=function(o,e,a){return Ks(o,e,a)};function gt(o){return oi(o),Ue(o<0?0:ht(o)|0)}h.allocUnsafe=function(o){return gt(o)};h.allocUnsafeSlow=function(o){return gt(o)};function ec(o,e){if((typeof e!="string"||e==="")&&(e="utf8"),!h.isEncoding(e))throw new TypeError("Unknown encoding: "+e);let a=ti(o,e)|0,t=Ue(a),r=t.write(o,e);return r!==a&&(t=t.slice(0,r)),t}function pt(o){let e=o.length<0?0:ht(o.length)|0,a=Ue(e);for(let t=0;t<e;t+=1)a[t]=o[t]&255;return a}function ac(o){if(_e(o,Uint8Array)){let e=new Uint8Array(o);return ft(e.buffer,e.byteOffset,e.byteLength)}return pt(o)}function ft(o,e,a){if(e<0||o.byteLength<e)throw new RangeError('"offset" is outside of buffer bounds');if(o.byteLength<e+(a||0))throw new RangeError('"length" is outside of buffer bounds');let t;return e===void 0&&a===void 0?t=new Uint8Array(o):a===void 0?t=new Uint8Array(o,e):t=new Uint8Array(o,e,a),Object.setPrototypeOf(t,h.prototype),t}function oc(o){if(h.isBuffer(o)){let e=ht(o.length)|0,a=Ue(e);return a.length===0||o.copy(a,0,0,e),a}if(o.length!==void 0)return typeof o.length!="number"||bt(o.length)?Ue(0):pt(o);if(o.type==="Buffer"&&Array.isArray(o.data))return pt(o.data)}function ht(o){if(o>=bo)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+bo.toString(16)+" bytes");return o|0}function tc(o){return+o!=o&&(o=0),h.alloc(+o)}h.isBuffer=function(e){return e!=null&&e._isBuffer===!0&&e!==h.prototype};h.compare=function(e,a){if(_e(e,Uint8Array)&&(e=h.from(e,e.offset,e.byteLength)),_e(a,Uint8Array)&&(a=h.from(a,a.offset,a.byteLength)),!h.isBuffer(e)||!h.isBuffer(a))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===a)return 0;let t=e.length,r=a.length;for(let i=0,n=Math.min(t,r);i<n;++i)if(e[i]!==a[i]){t=e[i],r=a[i];break}return t<r?-1:r<t?1:0};h.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}};h.concat=function(e,a){if(!Array.isArray(e))throw new TypeError('"list" argument must be an Array of Buffers');if(e.length===0)return h.alloc(0);let t;if(a===void 0)for(a=0,t=0;t<e.length;++t)a+=e[t].length;let r=h.allocUnsafe(a),i=0;for(t=0;t<e.length;++t){let n=e[t];if(_e(n,Uint8Array))i+n.length>r.length?(h.isBuffer(n)||(n=h.from(n)),n.copy(r,i)):Uint8Array.prototype.set.call(r,n,i);else if(h.isBuffer(n))n.copy(r,i);else throw new TypeError('"list" argument must be an Array of Buffers');i+=n.length}return r};function ti(o,e){if(h.isBuffer(o))return o.length;if(ArrayBuffer.isView(o)||_e(o,ArrayBuffer))return o.byteLength;if(typeof o!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof o);let a=o.length,t=arguments.length>2&&arguments[2]===!0;if(!t&&a===0)return 0;let r=!1;for(;;)switch(e){case"ascii":case"latin1":case"binary":return a;case"utf8":case"utf-8":return mt(o).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return a*2;case"hex":return a>>>1;case"base64":return pi(o).length;default:if(r)return t?-1:mt(o).length;e=(""+e).toLowerCase(),r=!0}}h.byteLength=ti;function rc(o,e,a){let t=!1;if((e===void 0||e<0)&&(e=0),e>this.length||((a===void 0||a>this.length)&&(a=this.length),a<=0)||(a>>>=0,e>>>=0,a<=e))return"";for(o||(o="utf8");;)switch(o){case"hex":return mc(this,e,a);case"utf8":case"utf-8":return ii(this,e,a);case"ascii":return pc(this,e,a);case"latin1":case"binary":return fc(this,e,a);case"base64":return dc(this,e,a);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return gc(this,e,a);default:if(t)throw new TypeError("Unknown encoding: "+o);o=(o+"").toLowerCase(),t=!0}}h.prototype._isBuffer=!0;function aa(o,e,a){let t=o[e];o[e]=o[a],o[a]=t}h.prototype.swap16=function(){let e=this.length;if(e%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let a=0;a<e;a+=2)aa(this,a,a+1);return this};h.prototype.swap32=function(){let e=this.length;if(e%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let a=0;a<e;a+=4)aa(this,a,a+3),aa(this,a+1,a+2);return this};h.prototype.swap64=function(){let e=this.length;if(e%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let a=0;a<e;a+=8)aa(this,a,a+7),aa(this,a+1,a+6),aa(this,a+2,a+5),aa(this,a+3,a+4);return this};h.prototype.toString=function(){let e=this.length;return e===0?"":arguments.length===0?ii(this,0,e):rc.apply(this,arguments)};h.prototype.toLocaleString=h.prototype.toString;h.prototype.equals=function(e){if(!h.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e?!0:h.compare(this,e)===0};h.prototype.inspect=function(){let e="",a=ha.INSPECT_MAX_BYTES;return e=this.toString("hex",0,a).replace(/(.{2})/g,"$1 ").trim(),this.length>a&&(e+=" ... "),"<Buffer "+e+">"};Zr&&(h.prototype[Zr]=h.prototype.inspect);h.prototype.compare=function(e,a,t,r,i){if(_e(e,Uint8Array)&&(e=h.from(e,e.offset,e.byteLength)),!h.isBuffer(e))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(a===void 0&&(a=0),t===void 0&&(t=e?e.length:0),r===void 0&&(r=0),i===void 0&&(i=this.length),a<0||t>e.length||r<0||i>this.length)throw new RangeError("out of range index");if(r>=i&&a>=t)return 0;if(r>=i)return-1;if(a>=t)return 1;if(a>>>=0,t>>>=0,r>>>=0,i>>>=0,this===e)return 0;let n=i-r,s=t-a,c=Math.min(n,s),l=this.slice(r,i),d=e.slice(a,t);for(let u=0;u<c;++u)if(l[u]!==d[u]){n=l[u],s=d[u];break}return n<s?-1:s<n?1:0};function ri(o,e,a,t,r){if(o.length===0)return-1;if(typeof a=="string"?(t=a,a=0):a>2147483647?a=2147483647:a<-2147483648&&(a=-2147483648),a=+a,bt(a)&&(a=r?0:o.length-1),a<0&&(a=o.length+a),a>=o.length){if(r)return-1;a=o.length-1}else if(a<0)if(r)a=0;else return-1;if(typeof e=="string"&&(e=h.from(e,t)),h.isBuffer(e))return e.length===0?-1:Yr(o,e,a,t,r);if(typeof e=="number")return e=e&255,typeof Uint8Array.prototype.indexOf=="function"?r?Uint8Array.prototype.indexOf.call(o,e,a):Uint8Array.prototype.lastIndexOf.call(o,e,a):Yr(o,[e],a,t,r);throw new TypeError("val must be string, number or Buffer")}function Yr(o,e,a,t,r){let i=1,n=o.length,s=e.length;if(t!==void 0&&(t=String(t).toLowerCase(),t==="ucs2"||t==="ucs-2"||t==="utf16le"||t==="utf-16le")){if(o.length<2||e.length<2)return-1;i=2,n/=2,s/=2,a/=2}function c(d,u){return i===1?d[u]:d.readUInt16BE(u*i)}let l;if(r){let d=-1;for(l=a;l<n;l++)if(c(o,l)===c(e,d===-1?0:l-d)){if(d===-1&&(d=l),l-d+1===s)return d*i}else d!==-1&&(l-=l-d),d=-1}else for(a+s>n&&(a=n-s),l=a;l>=0;l--){let d=!0;for(let u=0;u<s;u++)if(c(o,l+u)!==c(e,u)){d=!1;break}if(d)return l}return-1}h.prototype.includes=function(e,a,t){return this.indexOf(e,a,t)!==-1};h.prototype.indexOf=function(e,a,t){return ri(this,e,a,t,!0)};h.prototype.lastIndexOf=function(e,a,t){return ri(this,e,a,t,!1)};function ic(o,e,a,t){a=Number(a)||0;let r=o.length-a;t?(t=Number(t),t>r&&(t=r)):t=r;let i=e.length;t>i/2&&(t=i/2);let n;for(n=0;n<t;++n){let s=parseInt(e.substr(n*2,2),16);if(bt(s))return n;o[a+n]=s}return n}function nc(o,e,a,t){return xo(mt(e,o.length-a),o,a,t)}function sc(o,e,a,t){return xo(xc(e),o,a,t)}function cc(o,e,a,t){return xo(pi(e),o,a,t)}function lc(o,e,a,t){return xo(Ac(e,o.length-a),o,a,t)}h.prototype.write=function(e,a,t,r){if(a===void 0)r="utf8",t=this.length,a=0;else if(t===void 0&&typeof a=="string")r=a,t=this.length,a=0;else if(isFinite(a))a=a>>>0,isFinite(t)?(t=t>>>0,r===void 0&&(r="utf8")):(r=t,t=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");let i=this.length-a;if((t===void 0||t>i)&&(t=i),e.length>0&&(t<0||a<0)||a>this.length)throw new RangeError("Attempt to write outside buffer bounds");r||(r="utf8");let n=!1;for(;;)switch(r){case"hex":return ic(this,e,a,t);case"utf8":case"utf-8":return nc(this,e,a,t);case"ascii":case"latin1":case"binary":return sc(this,e,a,t);case"base64":return cc(this,e,a,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return lc(this,e,a,t);default:if(n)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),n=!0}};h.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function dc(o,e,a){return e===0&&a===o.length?ut.fromByteArray(o):ut.fromByteArray(o.slice(e,a))}function ii(o,e,a){a=Math.min(o.length,a);let t=[],r=e;for(;r<a;){let i=o[r],n=null,s=i>239?4:i>223?3:i>191?2:1;if(r+s<=a){let c,l,d,u;switch(s){case 1:i<128&&(n=i);break;case 2:c=o[r+1],(c&192)===128&&(u=(i&31)<<6|c&63,u>127&&(n=u));break;case 3:c=o[r+1],l=o[r+2],(c&192)===128&&(l&192)===128&&(u=(i&15)<<12|(c&63)<<6|l&63,u>2047&&(u<55296||u>57343)&&(n=u));break;case 4:c=o[r+1],l=o[r+2],d=o[r+3],(c&192)===128&&(l&192)===128&&(d&192)===128&&(u=(i&15)<<18|(c&63)<<12|(l&63)<<6|d&63,u>65535&&u<1114112&&(n=u))}}n===null?(n=65533,s=1):n>65535&&(n-=65536,t.push(n>>>10&1023|55296),n=56320|n&1023),t.push(n),r+=s}return uc(t)}var Kr=4096;function uc(o){let e=o.length;if(e<=Kr)return String.fromCharCode.apply(String,o);let a="",t=0;for(;t<e;)a+=String.fromCharCode.apply(String,o.slice(t,t+=Kr));return a}function pc(o,e,a){let t="";a=Math.min(o.length,a);for(let r=e;r<a;++r)t+=String.fromCharCode(o[r]&127);return t}function fc(o,e,a){let t="";a=Math.min(o.length,a);for(let r=e;r<a;++r)t+=String.fromCharCode(o[r]);return t}function mc(o,e,a){let t=o.length;(!e||e<0)&&(e=0),(!a||a<0||a>t)&&(a=t);let r="";for(let i=e;i<a;++i)r+=Ec[o[i]];return r}function gc(o,e,a){let t=o.slice(e,a),r="";for(let i=0;i<t.length-1;i+=2)r+=String.fromCharCode(t[i]+t[i+1]*256);return r}h.prototype.slice=function(e,a){let t=this.length;e=~~e,a=a===void 0?t:~~a,e<0?(e+=t,e<0&&(e=0)):e>t&&(e=t),a<0?(a+=t,a<0&&(a=0)):a>t&&(a=t),a<e&&(a=e);let r=this.subarray(e,a);return Object.setPrototypeOf(r,h.prototype),r};function J(o,e,a){if(o%1!==0||o<0)throw new RangeError("offset is not uint");if(o+e>a)throw new RangeError("Trying to access beyond buffer length")}h.prototype.readUintLE=h.prototype.readUIntLE=function(e,a,t){e=e>>>0,a=a>>>0,t||J(e,a,this.length);let r=this[e],i=1,n=0;for(;++n<a&&(i*=256);)r+=this[e+n]*i;return r};h.prototype.readUintBE=h.prototype.readUIntBE=function(e,a,t){e=e>>>0,a=a>>>0,t||J(e,a,this.length);let r=this[e+--a],i=1;for(;a>0&&(i*=256);)r+=this[e+--a]*i;return r};h.prototype.readUint8=h.prototype.readUInt8=function(e,a){return e=e>>>0,a||J(e,1,this.length),this[e]};h.prototype.readUint16LE=h.prototype.readUInt16LE=function(e,a){return e=e>>>0,a||J(e,2,this.length),this[e]|this[e+1]<<8};h.prototype.readUint16BE=h.prototype.readUInt16BE=function(e,a){return e=e>>>0,a||J(e,2,this.length),this[e]<<8|this[e+1]};h.prototype.readUint32LE=h.prototype.readUInt32LE=function(e,a){return e=e>>>0,a||J(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+this[e+3]*16777216};h.prototype.readUint32BE=h.prototype.readUInt32BE=function(e,a){return e=e>>>0,a||J(e,4,this.length),this[e]*16777216+(this[e+1]<<16|this[e+2]<<8|this[e+3])};h.prototype.readBigUInt64LE=Xe(function(e){e=e>>>0,ga(e,"offset");let a=this[e],t=this[e+7];(a===void 0||t===void 0)&&ja(e,this.length-8);let r=a+this[++e]*2**8+this[++e]*2**16+this[++e]*2**24,i=this[++e]+this[++e]*2**8+this[++e]*2**16+t*2**24;return BigInt(r)+(BigInt(i)<<BigInt(32))});h.prototype.readBigUInt64BE=Xe(function(e){e=e>>>0,ga(e,"offset");let a=this[e],t=this[e+7];(a===void 0||t===void 0)&&ja(e,this.length-8);let r=a*2**24+this[++e]*2**16+this[++e]*2**8+this[++e],i=this[++e]*2**24+this[++e]*2**16+this[++e]*2**8+t;return(BigInt(r)<<BigInt(32))+BigInt(i)});h.prototype.readIntLE=function(e,a,t){e=e>>>0,a=a>>>0,t||J(e,a,this.length);let r=this[e],i=1,n=0;for(;++n<a&&(i*=256);)r+=this[e+n]*i;return i*=128,r>=i&&(r-=Math.pow(2,8*a)),r};h.prototype.readIntBE=function(e,a,t){e=e>>>0,a=a>>>0,t||J(e,a,this.length);let r=a,i=1,n=this[e+--r];for(;r>0&&(i*=256);)n+=this[e+--r]*i;return i*=128,n>=i&&(n-=Math.pow(2,8*a)),n};h.prototype.readInt8=function(e,a){return e=e>>>0,a||J(e,1,this.length),this[e]&128?(255-this[e]+1)*-1:this[e]};h.prototype.readInt16LE=function(e,a){e=e>>>0,a||J(e,2,this.length);let t=this[e]|this[e+1]<<8;return t&32768?t|4294901760:t};h.prototype.readInt16BE=function(e,a){e=e>>>0,a||J(e,2,this.length);let t=this[e+1]|this[e]<<8;return t&32768?t|4294901760:t};h.prototype.readInt32LE=function(e,a){return e=e>>>0,a||J(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24};h.prototype.readInt32BE=function(e,a){return e=e>>>0,a||J(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]};h.prototype.readBigInt64LE=Xe(function(e){e=e>>>0,ga(e,"offset");let a=this[e],t=this[e+7];(a===void 0||t===void 0)&&ja(e,this.length-8);let r=this[e+4]+this[e+5]*2**8+this[e+6]*2**16+(t<<24);return(BigInt(r)<<BigInt(32))+BigInt(a+this[++e]*2**8+this[++e]*2**16+this[++e]*2**24)});h.prototype.readBigInt64BE=Xe(function(e){e=e>>>0,ga(e,"offset");let a=this[e],t=this[e+7];(a===void 0||t===void 0)&&ja(e,this.length-8);let r=(a<<24)+this[++e]*2**16+this[++e]*2**8+this[++e];return(BigInt(r)<<BigInt(32))+BigInt(this[++e]*2**24+this[++e]*2**16+this[++e]*2**8+t)});h.prototype.readFloatLE=function(e,a){return e=e>>>0,a||J(e,4,this.length),ma.read(this,e,!0,23,4)};h.prototype.readFloatBE=function(e,a){return e=e>>>0,a||J(e,4,this.length),ma.read(this,e,!1,23,4)};h.prototype.readDoubleLE=function(e,a){return e=e>>>0,a||J(e,8,this.length),ma.read(this,e,!0,52,8)};h.prototype.readDoubleBE=function(e,a){return e=e>>>0,a||J(e,8,this.length),ma.read(this,e,!1,52,8)};function le(o,e,a,t,r,i){if(!h.isBuffer(o))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>r||e<i)throw new RangeError('"value" argument is out of bounds');if(a+t>o.length)throw new RangeError("Index out of range")}h.prototype.writeUintLE=h.prototype.writeUIntLE=function(e,a,t,r){if(e=+e,a=a>>>0,t=t>>>0,!r){let s=Math.pow(2,8*t)-1;le(this,e,a,t,s,0)}let i=1,n=0;for(this[a]=e&255;++n<t&&(i*=256);)this[a+n]=e/i&255;return a+t};h.prototype.writeUintBE=h.prototype.writeUIntBE=function(e,a,t,r){if(e=+e,a=a>>>0,t=t>>>0,!r){let s=Math.pow(2,8*t)-1;le(this,e,a,t,s,0)}let i=t-1,n=1;for(this[a+i]=e&255;--i>=0&&(n*=256);)this[a+i]=e/n&255;return a+t};h.prototype.writeUint8=h.prototype.writeUInt8=function(e,a,t){return e=+e,a=a>>>0,t||le(this,e,a,1,255,0),this[a]=e&255,a+1};h.prototype.writeUint16LE=h.prototype.writeUInt16LE=function(e,a,t){return e=+e,a=a>>>0,t||le(this,e,a,2,65535,0),this[a]=e&255,this[a+1]=e>>>8,a+2};h.prototype.writeUint16BE=h.prototype.writeUInt16BE=function(e,a,t){return e=+e,a=a>>>0,t||le(this,e,a,2,65535,0),this[a]=e>>>8,this[a+1]=e&255,a+2};h.prototype.writeUint32LE=h.prototype.writeUInt32LE=function(e,a,t){return e=+e,a=a>>>0,t||le(this,e,a,4,4294967295,0),this[a+3]=e>>>24,this[a+2]=e>>>16,this[a+1]=e>>>8,this[a]=e&255,a+4};h.prototype.writeUint32BE=h.prototype.writeUInt32BE=function(e,a,t){return e=+e,a=a>>>0,t||le(this,e,a,4,4294967295,0),this[a]=e>>>24,this[a+1]=e>>>16,this[a+2]=e>>>8,this[a+3]=e&255,a+4};function ni(o,e,a,t,r){ui(e,t,r,o,a,7);let i=Number(e&BigInt(4294967295));o[a++]=i,i=i>>8,o[a++]=i,i=i>>8,o[a++]=i,i=i>>8,o[a++]=i;let n=Number(e>>BigInt(32)&BigInt(4294967295));return o[a++]=n,n=n>>8,o[a++]=n,n=n>>8,o[a++]=n,n=n>>8,o[a++]=n,a}function si(o,e,a,t,r){ui(e,t,r,o,a,7);let i=Number(e&BigInt(4294967295));o[a+7]=i,i=i>>8,o[a+6]=i,i=i>>8,o[a+5]=i,i=i>>8,o[a+4]=i;let n=Number(e>>BigInt(32)&BigInt(4294967295));return o[a+3]=n,n=n>>8,o[a+2]=n,n=n>>8,o[a+1]=n,n=n>>8,o[a]=n,a+8}h.prototype.writeBigUInt64LE=Xe(function(e,a=0){return ni(this,e,a,BigInt(0),BigInt("0xffffffffffffffff"))});h.prototype.writeBigUInt64BE=Xe(function(e,a=0){return si(this,e,a,BigInt(0),BigInt("0xffffffffffffffff"))});h.prototype.writeIntLE=function(e,a,t,r){if(e=+e,a=a>>>0,!r){let c=Math.pow(2,8*t-1);le(this,e,a,t,c-1,-c)}let i=0,n=1,s=0;for(this[a]=e&255;++i<t&&(n*=256);)e<0&&s===0&&this[a+i-1]!==0&&(s=1),this[a+i]=(e/n>>0)-s&255;return a+t};h.prototype.writeIntBE=function(e,a,t,r){if(e=+e,a=a>>>0,!r){let c=Math.pow(2,8*t-1);le(this,e,a,t,c-1,-c)}let i=t-1,n=1,s=0;for(this[a+i]=e&255;--i>=0&&(n*=256);)e<0&&s===0&&this[a+i+1]!==0&&(s=1),this[a+i]=(e/n>>0)-s&255;return a+t};h.prototype.writeInt8=function(e,a,t){return e=+e,a=a>>>0,t||le(this,e,a,1,127,-128),e<0&&(e=255+e+1),this[a]=e&255,a+1};h.prototype.writeInt16LE=function(e,a,t){return e=+e,a=a>>>0,t||le(this,e,a,2,32767,-32768),this[a]=e&255,this[a+1]=e>>>8,a+2};h.prototype.writeInt16BE=function(e,a,t){return e=+e,a=a>>>0,t||le(this,e,a,2,32767,-32768),this[a]=e>>>8,this[a+1]=e&255,a+2};h.prototype.writeInt32LE=function(e,a,t){return e=+e,a=a>>>0,t||le(this,e,a,4,2147483647,-2147483648),this[a]=e&255,this[a+1]=e>>>8,this[a+2]=e>>>16,this[a+3]=e>>>24,a+4};h.prototype.writeInt32BE=function(e,a,t){return e=+e,a=a>>>0,t||le(this,e,a,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[a]=e>>>24,this[a+1]=e>>>16,this[a+2]=e>>>8,this[a+3]=e&255,a+4};h.prototype.writeBigInt64LE=Xe(function(e,a=0){return ni(this,e,a,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});h.prototype.writeBigInt64BE=Xe(function(e,a=0){return si(this,e,a,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});function ci(o,e,a,t,r,i){if(a+t>o.length)throw new RangeError("Index out of range");if(a<0)throw new RangeError("Index out of range")}function li(o,e,a,t,r){return e=+e,a=a>>>0,r||ci(o,e,a,4,34028234663852886e22,-34028234663852886e22),ma.write(o,e,a,t,23,4),a+4}h.prototype.writeFloatLE=function(e,a,t){return li(this,e,a,!0,t)};h.prototype.writeFloatBE=function(e,a,t){return li(this,e,a,!1,t)};function di(o,e,a,t,r){return e=+e,a=a>>>0,r||ci(o,e,a,8,17976931348623157e292,-17976931348623157e292),ma.write(o,e,a,t,52,8),a+8}h.prototype.writeDoubleLE=function(e,a,t){return di(this,e,a,!0,t)};h.prototype.writeDoubleBE=function(e,a,t){return di(this,e,a,!1,t)};h.prototype.copy=function(e,a,t,r){if(!h.isBuffer(e))throw new TypeError("argument should be a Buffer");if(t||(t=0),!r&&r!==0&&(r=this.length),a>=e.length&&(a=e.length),a||(a=0),r>0&&r<t&&(r=t),r===t||e.length===0||this.length===0)return 0;if(a<0)throw new RangeError("targetStart out of bounds");if(t<0||t>=this.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),e.length-a<r-t&&(r=e.length-a+t);let i=r-t;return this===e&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(a,t,r):Uint8Array.prototype.set.call(e,this.subarray(t,r),a),i};h.prototype.fill=function(e,a,t,r){if(typeof e=="string"){if(typeof a=="string"?(r=a,a=0,t=this.length):typeof t=="string"&&(r=t,t=this.length),r!==void 0&&typeof r!="string")throw new TypeError("encoding must be a string");if(typeof r=="string"&&!h.isEncoding(r))throw new TypeError("Unknown encoding: "+r);if(e.length===1){let n=e.charCodeAt(0);(r==="utf8"&&n<128||r==="latin1")&&(e=n)}}else typeof e=="number"?e=e&255:typeof e=="boolean"&&(e=Number(e));if(a<0||this.length<a||this.length<t)throw new RangeError("Out of range index");if(t<=a)return this;a=a>>>0,t=t===void 0?this.length:t>>>0,e||(e=0);let i;if(typeof e=="number")for(i=a;i<t;++i)this[i]=e;else{let n=h.isBuffer(e)?e:h.from(e,r),s=n.length;if(s===0)throw new TypeError('The value "'+e+'" is invalid for argument "value"');for(i=0;i<t-a;++i)this[i+a]=n[i%s]}return this};var fa={};function vt(o,e,a){fa[o]=class extends a{constructor(){super(),Object.defineProperty(this,"message",{value:e.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${o}]`,this.stack,delete this.name}get code(){return o}set code(r){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:r,writable:!0})}toString(){return`${this.name} [${o}]: ${this.message}`}}}vt("ERR_BUFFER_OUT_OF_BOUNDS",function(o){return o?`${o} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError);vt("ERR_INVALID_ARG_TYPE",function(o,e){return`The "${o}" argument must be of type number. Received type ${typeof e}`},TypeError);vt("ERR_OUT_OF_RANGE",function(o,e,a){let t=`The value of "${o}" is out of range.`,r=a;return Number.isInteger(a)&&Math.abs(a)>2**32?r=ei(String(a)):typeof a=="bigint"&&(r=String(a),(a>BigInt(2)**BigInt(32)||a<-(BigInt(2)**BigInt(32)))&&(r=ei(r)),r+="n"),t+=` It must be ${e}. Received ${r}`,t},RangeError);function ei(o){let e="",a=o.length,t=o[0]==="-"?1:0;for(;a>=t+4;a-=3)e=`_${o.slice(a-3,a)}${e}`;return`${o.slice(0,a)}${e}`}function hc(o,e,a){ga(e,"offset"),(o[e]===void 0||o[e+a]===void 0)&&ja(e,o.length-(a+1))}function ui(o,e,a,t,r,i){if(o>a||o<e){let n=typeof e=="bigint"?"n":"",s;throw i>3?e===0||e===BigInt(0)?s=`>= 0${n} and < 2${n} ** ${(i+1)*8}${n}`:s=`>= -(2${n} ** ${(i+1)*8-1}${n}) and < 2 ** ${(i+1)*8-1}${n}`:s=`>= ${e}${n} and <= ${a}${n}`,new fa.ERR_OUT_OF_RANGE("value",s,o)}hc(t,r,i)}function ga(o,e){if(typeof o!="number")throw new fa.ERR_INVALID_ARG_TYPE(e,"number",o)}function ja(o,e,a){throw Math.floor(o)!==o?(ga(o,a),new fa.ERR_OUT_OF_RANGE(a||"offset","an integer",o)):e<0?new fa.ERR_BUFFER_OUT_OF_BOUNDS:new fa.ERR_OUT_OF_RANGE(a||"offset",`>= ${a?1:0} and <= ${e}`,o)}var vc=/[^+/0-9A-Za-z-_]/g;function bc(o){if(o=o.split("=")[0],o=o.trim().replace(vc,""),o.length<2)return"";for(;o.length%4!==0;)o=o+"=";return o}function mt(o,e){e=e||1/0;let a,t=o.length,r=null,i=[];for(let n=0;n<t;++n){if(a=o.charCodeAt(n),a>55295&&a<57344){if(!r){if(a>56319){(e-=3)>-1&&i.push(239,191,189);continue}else if(n+1===t){(e-=3)>-1&&i.push(239,191,189);continue}r=a;continue}if(a<56320){(e-=3)>-1&&i.push(239,191,189),r=a;continue}a=(r-55296<<10|a-56320)+65536}else r&&(e-=3)>-1&&i.push(239,191,189);if(r=null,a<128){if((e-=1)<0)break;i.push(a)}else if(a<2048){if((e-=2)<0)break;i.push(a>>6|192,a&63|128)}else if(a<65536){if((e-=3)<0)break;i.push(a>>12|224,a>>6&63|128,a&63|128)}else if(a<1114112){if((e-=4)<0)break;i.push(a>>18|240,a>>12&63|128,a>>6&63|128,a&63|128)}else throw new Error("Invalid code point")}return i}function xc(o){let e=[];for(let a=0;a<o.length;++a)e.push(o.charCodeAt(a)&255);return e}function Ac(o,e){let a,t,r,i=[];for(let n=0;n<o.length&&!((e-=2)<0);++n)a=o.charCodeAt(n),t=a>>8,r=a%256,i.push(r),i.push(t);return i}function pi(o){return ut.toByteArray(bc(o))}function xo(o,e,a,t){let r;for(r=0;r<t&&!(r+a>=e.length||r>=o.length);++r)e[r+a]=o[r];return r}function _e(o,e){return o instanceof e||o!=null&&o.constructor!=null&&o.constructor.name!=null&&o.constructor.name===e.name}function bt(o){return o!==o}var Ec=(function(){let o="0123456789abcdef",e=new Array(256);for(let a=0;a<16;++a){let t=a*16;for(let r=0;r<16;++r)e[t+r]=o[a]+o[r]}return e})();function Xe(o){return typeof BigInt>"u"?Cc:o}function Cc(){throw new Error("BigInt not supported")}});var R,E,m=O(()=>{"use strict";R=ce(Ao(),1),E={cwd:()=>"/app",env:{NODE_ENV:"production"},argv:[],platform:"browser",versions:{},nextTick:(o,...e)=>queueMicrotask(()=>o(...e))}});function Ic(o){return o instanceof Uint8Array||ArrayBuffer.isView(o)&&o.constructor.name==="Uint8Array"}function Va(o,...e){if(!Ic(o))throw new Error("Uint8Array expected");if(e.length>0&&!e.includes(o.length))throw new Error("Uint8Array expected of length "+e+", got length="+o.length)}function xt(o,e=!0){if(o.destroyed)throw new Error("Hash instance has been destroyed");if(e&&o.finished)throw new Error("Hash#digest() has already been called")}function fi(o,e){Va(o);let a=e.outputLen;if(o.length<a)throw new Error("digestInto() expects output buffer of length at least "+a)}function Ua(...o){for(let e=0;e<o.length;e++)o[e].fill(0)}function Co(o){return new DataView(o.buffer,o.byteOffset,o.byteLength)}function Ne(o,e){return o<<32-e|o>>>e}function ka(o){if(Va(o),Nc)return o.toHex();let e="";for(let a=0;a<o.length;a++)e+=Rc[o[a]];return e}function Oc(o){if(typeof o!="string")throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(o))}function At(o){return typeof o=="string"&&(o=Oc(o)),Va(o),o}function mi(o){let e=t=>o().update(At(t)).digest(),a=o();return e.outputLen=a.outputLen,e.blockLen=a.blockLen,e.create=()=>o(),e}var Nc,Rc,Eo,$a=O(()=>{m();Nc=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",Rc=Array.from({length:256},(o,e)=>e.toString(16).padStart(2,"0"));Eo=class{}});function yc(o,e,a,t){if(typeof o.setBigUint64=="function")return o.setBigUint64(e,a,t);let r=BigInt(32),i=BigInt(4294967295),n=Number(a>>r&i),s=Number(a&i),c=t?4:0,l=t?0:4;o.setUint32(e+c,n,t),o.setUint32(e+l,s,t)}function gi(o,e,a){return o&e^~o&a}function hi(o,e,a){return o&e^o&a^e&a}var Io,ke,vi=O(()=>{m();$a();Io=class extends Eo{constructor(e,a,t,r){super(),this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.blockLen=e,this.outputLen=a,this.padOffset=t,this.isLE=r,this.buffer=new Uint8Array(e),this.view=Co(this.buffer)}update(e){xt(this),e=At(e),Va(e);let{view:a,buffer:t,blockLen:r}=this,i=e.length;for(let n=0;n<i;){let s=Math.min(r-this.pos,i-n);if(s===r){let c=Co(e);for(;r<=i-n;n+=r)this.process(c,n);continue}t.set(e.subarray(n,n+s),this.pos),this.pos+=s,n+=s,this.pos===r&&(this.process(a,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){xt(this),fi(e,this),this.finished=!0;let{buffer:a,view:t,blockLen:r,isLE:i}=this,{pos:n}=this;a[n++]=128,Ua(this.buffer.subarray(n)),this.padOffset>r-n&&(this.process(t,0),n=0);for(let u=n;u<r;u++)a[u]=0;yc(t,r-8,BigInt(this.length*8),i),this.process(t,0);let s=Co(e),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen should be aligned to 32bit");let l=c/4,d=this.get();if(l>d.length)throw new Error("_sha2: outputLen bigger than state");for(let u=0;u<l;u++)s.setUint32(4*u,d[u],i)}digest(){let{buffer:e,outputLen:a}=this;this.digestInto(e);let t=e.slice(0,a);return this.destroy(),t}_cloneInto(e){e||(e=new this.constructor),e.set(...this.get());let{blockLen:a,buffer:t,length:r,finished:i,destroyed:n,pos:s}=this;return e.destroyed=n,e.finished=i,e.length=r,e.pos=s,r%a&&e.buffer.set(t),e}clone(){return this._cloneInto()}},ke=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225])});var Sc,Qe,No,bi,xi=O(()=>{m();vi();$a();Sc=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),Qe=new Uint32Array(64),No=class extends Io{constructor(e=32){super(64,e,8,!1),this.A=ke[0]|0,this.B=ke[1]|0,this.C=ke[2]|0,this.D=ke[3]|0,this.E=ke[4]|0,this.F=ke[5]|0,this.G=ke[6]|0,this.H=ke[7]|0}get(){let{A:e,B:a,C:t,D:r,E:i,F:n,G:s,H:c}=this;return[e,a,t,r,i,n,s,c]}set(e,a,t,r,i,n,s,c){this.A=e|0,this.B=a|0,this.C=t|0,this.D=r|0,this.E=i|0,this.F=n|0,this.G=s|0,this.H=c|0}process(e,a){for(let u=0;u<16;u++,a+=4)Qe[u]=e.getUint32(a,!1);for(let u=16;u<64;u++){let p=Qe[u-15],f=Qe[u-2],v=Ne(p,7)^Ne(p,18)^p>>>3,C=Ne(f,17)^Ne(f,19)^f>>>10;Qe[u]=C+Qe[u-7]+v+Qe[u-16]|0}let{A:t,B:r,C:i,D:n,E:s,F:c,G:l,H:d}=this;for(let u=0;u<64;u++){let p=Ne(s,6)^Ne(s,11)^Ne(s,25),f=d+p+gi(s,c,l)+Sc[u]+Qe[u]|0,C=(Ne(t,2)^Ne(t,13)^Ne(t,22))+hi(t,r,i)|0;d=l,l=c,c=s,s=n+f|0,n=i,i=r,r=t,t=f+C|0}t=t+this.A|0,r=r+this.B|0,i=i+this.C|0,n=n+this.D|0,s=s+this.E|0,c=c+this.F|0,l=l+this.G|0,d=d+this.H|0,this.set(t,r,i,n,s,c,l,d)}roundClean(){Ua(Qe)}destroy(){this.set(0,0,0,0,0,0,0,0),Ua(this.buffer)}},bi=mi(()=>new No)});var za,Et=O(()=>{m();xi();za=bi});var Ae=ho((mp,Ei)=>{"use strict";m();function Me(o){if(typeof o!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(o))}function Ai(o,e){for(var a="",t=0,r=-1,i=0,n,s=0;s<=o.length;++s){if(s<o.length)n=o.charCodeAt(s);else{if(n===47)break;n=47}if(n===47){if(!(r===s-1||i===1))if(r!==s-1&&i===2){if(a.length<2||t!==2||a.charCodeAt(a.length-1)!==46||a.charCodeAt(a.length-2)!==46){if(a.length>2){var c=a.lastIndexOf("/");if(c!==a.length-1){c===-1?(a="",t=0):(a=a.slice(0,c),t=a.length-1-a.lastIndexOf("/")),r=s,i=0;continue}}else if(a.length===2||a.length===1){a="",t=0,r=s,i=0;continue}}e&&(a.length>0?a+="/..":a="..",t=2)}else a.length>0?a+="/"+o.slice(r+1,s):a=o.slice(r+1,s),t=s-r-1;r=s,i=0}else n===46&&i!==-1?++i:i=-1}return a}function wc(o,e){var a=e.dir||e.root,t=e.base||(e.name||"")+(e.ext||"");return a?a===e.root?a+t:a+o+t:t}var va={resolve:function(){for(var e="",a=!1,t,r=arguments.length-1;r>=-1&&!a;r--){var i;r>=0?i=arguments[r]:(t===void 0&&(t=E.cwd()),i=t),Me(i),i.length!==0&&(e=i+"/"+e,a=i.charCodeAt(0)===47)}return e=Ai(e,!a),a?e.length>0?"/"+e:"/":e.length>0?e:"."},normalize:function(e){if(Me(e),e.length===0)return".";var a=e.charCodeAt(0)===47,t=e.charCodeAt(e.length-1)===47;return e=Ai(e,!a),e.length===0&&!a&&(e="."),e.length>0&&t&&(e+="/"),a?"/"+e:e},isAbsolute:function(e){return Me(e),e.length>0&&e.charCodeAt(0)===47},join:function(){if(arguments.length===0)return".";for(var e,a=0;a<arguments.length;++a){var t=arguments[a];Me(t),t.length>0&&(e===void 0?e=t:e+="/"+t)}return e===void 0?".":va.normalize(e)},relative:function(e,a){if(Me(e),Me(a),e===a||(e=va.resolve(e),a=va.resolve(a),e===a))return"";for(var t=1;t<e.length&&e.charCodeAt(t)===47;++t);for(var r=e.length,i=r-t,n=1;n<a.length&&a.charCodeAt(n)===47;++n);for(var s=a.length,c=s-n,l=i<c?i:c,d=-1,u=0;u<=l;++u){if(u===l){if(c>l){if(a.charCodeAt(n+u)===47)return a.slice(n+u+1);if(u===0)return a.slice(n+u)}else i>l&&(e.charCodeAt(t+u)===47?d=u:u===0&&(d=0));break}var p=e.charCodeAt(t+u),f=a.charCodeAt(n+u);if(p!==f)break;p===47&&(d=u)}var v="";for(u=t+d+1;u<=r;++u)(u===r||e.charCodeAt(u)===47)&&(v.length===0?v+="..":v+="/..");return v.length>0?v+a.slice(n+d):(n+=d,a.charCodeAt(n)===47&&++n,a.slice(n))},_makeLong:function(e){return e},dirname:function(e){if(Me(e),e.length===0)return".";for(var a=e.charCodeAt(0),t=a===47,r=-1,i=!0,n=e.length-1;n>=1;--n)if(a=e.charCodeAt(n),a===47){if(!i){r=n;break}}else i=!1;return r===-1?t?"/":".":t&&r===1?"//":e.slice(0,r)},basename:function(e,a){if(a!==void 0&&typeof a!="string")throw new TypeError('"ext" argument must be a string');Me(e);var t=0,r=-1,i=!0,n;if(a!==void 0&&a.length>0&&a.length<=e.length){if(a.length===e.length&&a===e)return"";var s=a.length-1,c=-1;for(n=e.length-1;n>=0;--n){var l=e.charCodeAt(n);if(l===47){if(!i){t=n+1;break}}else c===-1&&(i=!1,c=n+1),s>=0&&(l===a.charCodeAt(s)?--s===-1&&(r=n):(s=-1,r=c))}return t===r?r=c:r===-1&&(r=e.length),e.slice(t,r)}else{for(n=e.length-1;n>=0;--n)if(e.charCodeAt(n)===47){if(!i){t=n+1;break}}else r===-1&&(i=!1,r=n+1);return r===-1?"":e.slice(t,r)}},extname:function(e){Me(e);for(var a=-1,t=0,r=-1,i=!0,n=0,s=e.length-1;s>=0;--s){var c=e.charCodeAt(s);if(c===47){if(!i){t=s+1;break}continue}r===-1&&(i=!1,r=s+1),c===46?a===-1?a=s:n!==1&&(n=1):a!==-1&&(n=-1)}return a===-1||r===-1||n===0||n===1&&a===r-1&&a===t+1?"":e.slice(a,r)},format:function(e){if(e===null||typeof e!="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof e);return wc("/",e)},parse:function(e){Me(e);var a={root:"",dir:"",base:"",ext:"",name:""};if(e.length===0)return a;var t=e.charCodeAt(0),r=t===47,i;r?(a.root="/",i=1):i=0;for(var n=-1,s=0,c=-1,l=!0,d=e.length-1,u=0;d>=i;--d){if(t=e.charCodeAt(d),t===47){if(!l){s=d+1;break}continue}c===-1&&(l=!1,c=d+1),t===46?n===-1?n=d:u!==1&&(u=1):n!==-1&&(u=-1)}return n===-1||c===-1||u===0||u===1&&n===c-1&&n===s+1?c!==-1&&(s===0&&r?a.base=a.name=e.slice(1,c):a.base=a.name=e.slice(s,c)):(s===0&&r?(a.name=e.slice(1,n),a.base=e.slice(1,c)):(a.name=e.slice(s,n),a.base=e.slice(s,c)),a.ext=e.slice(n,c)),s>0?a.dir=e.slice(0,s-1):r&&(a.dir="/"),a},sep:"/",delimiter:":",win32:null,posix:null};va.posix=va;Ei.exports=va});function Re(o,e,a){let t=new Error(`${o}: ${e} '${a}'`);return t.code=o,t.path=a,t}function Oi(o){return typeof o=="string"?Ci.encode(o):o instanceof Uint8Array?o:o instanceof ArrayBuffer?new Uint8Array(o):ArrayBuffer.isView(o)?new Uint8Array(o.buffer,o.byteOffset,o.byteLength):Ci.encode(String(o))}function Mc(o){return typeof o=="string"?o:o&&typeof o=="object"&&"encoding"in o?o.encoding??null:null}function Ii(o,e){let a=new Uint8Array(o.length+e.length);return a.set(o,0),a.set(e,o.length),a}function It(o){for(let e=o;!ge.has(e);e=So.default.dirname(e))ge.add(e),Le.add(e)}function Nt(o,e){It(So.default.dirname(o)),G.set(o,e),Le.add(o)}function Lc(o,e){return Tc.test(o)?{tipo:"resumo",cabeca:e.slice(0,Ct),hash:za.create().update(e),hashFinal:null,tamanho:e.length,mtimeMs:Oo()}:{tipo:"arq",dados:e,mtimeMs:Oo()}}function yo(o){return o.tipo==="arq"?o.dados:o.cabeca}function Fc(o){return Ni.Buffer.from(o.buffer,o.byteOffset,o.byteLength)}function U(o){let e=ee(o);return G.has(e)||ge.has(e)}function ie(o,e){It(ee(o))}function L(o,e){let a=ee(o),t=G.get(a);if(!t)throw Re(ge.has(a)?"EISDIR":"ENOENT","open",a);return Mc(e)?_c.decode(yo(t)):Fc(yo(t))}function V(o,e,a){let t=ee(o);Nt(t,Lc(t,Oi(e)))}function wo(o,e,a){let t=ee(o),r=G.get(t),i=Oi(e);if(!r)return V(t,i);if(r.tipo==="arq"){Nt(t,{tipo:"arq",dados:Ii(r.dados,i),mtimeMs:Oo()});return}if(!r.hash)throw Re("EPERM","append (resumo sem estado de hash)",t);r.hash.update(i),r.hashFinal=null,r.tamanho+=i.length,r.cabeca.length<Ct&&(r.cabeca=Ii(r.cabeca,i.subarray(0,Ct-r.cabeca.length))),r.mtimeMs=Oo(),Le.add(t)}function Oe(o){let e=ee(o);if(!ge.has(e))throw Re(G.has(e)?"ENOTDIR":"ENOENT","scandir",e);let a=e==="/"?"/":e+"/",t=new Set;for(let r of[...G.keys(),...ge])r!==e&&r.startsWith(a)&&t.add(r.slice(a.length).split("/")[0]);return[...t].sort()}function Ha(o){let e=ee(o),a=G.get(e);if(!a&&!ge.has(e))throw Re("ENOENT","stat",e);let t=a?a.tipo==="arq"?a.dados.length:a.tamanho:0,r=a?.mtimeMs??0;return{size:t,mtimeMs:r,mtime:new Date(r),isFile:()=>!!a,isDirectory:()=>!a}}function Fe(o,e={}){let a=ee(o);if(G.delete(a)){Le.add(a);return}if(!ge.has(a)){if(e.force)return;throw Re("ENOENT","rm",a)}let t=a+"/",r=[...G.keys(),...ge].filter(i=>i.startsWith(t));if(r.length&&!e.recursive)throw Re("ENOTEMPTY","rm",a);for(let i of r)G.delete(i),ge.delete(i),Le.add(i);a!=="/"&&(ge.delete(a),Le.add(a))}function Rt(o,e){let a=ee(o),t=ee(e),r=G.get(a);if(!r)throw Re("ENOENT","rename",a);G.delete(a),Le.add(a),Nt(t,r)}function Ot(o,e){let a=G.get(ee(o));if(!a)throw Re("ENOENT","copyfile",ee(o));V(e,yo(a).slice())}function Ga(o){let e=ee(o+Math.random().toString(36).slice(2,8));return It(e),e}function To(o,e){let a=ee(o);if(!G.has(a))throw Re("ENOENT","open",a);let t=Pc++;return yt.set(t,{caminho:a,posicao:0}),t}function _o(o,e,a,t,r){let i=yt.get(o);if(!i)throw Re("EBADF","read",String(o));let n=yo(G.get(i.caminho)),s=r??i.posicao,c=n.subarray(s,s+t);return e.set(c,a),r==null&&(i.posicao+=c.length),c.length}function Mo(o){yt.delete(o)}function Lo(o){let e=ee(o),a=G.get(e);if(!a)throw Re("ENOENT","open",e);return a.tipo==="arq"?ka(za(a.dados)):(a.hashFinal||(a.hashFinal=ka(a.hash.clone().digest())),a.hashFinal)}function yi(o,e){let a=ee(o);V(a,e),Ri.add(a),Le.delete(a)}function Si(o,e){e.tipo==="dir"?ge.add(o):e.tipo==="arq"?G.set(o,{tipo:"arq",dados:e.dados,mtimeMs:e.mtimeMs}):G.set(o,{tipo:"resumo",cabeca:e.cabeca,hash:null,hashFinal:e.hashFinal,tamanho:e.tamanho,mtimeMs:e.mtimeMs}),Ro=Math.max(Ro,"mtimeMs"in e?e.mtimeMs:0)}function wi(){let o=[];for(let e of Le){if(Ri.has(e))continue;let a=G.get(e);a?.tipo==="arq"?o.push([e,{tipo:"arq",dados:a.dados,mtimeMs:a.mtimeMs}]):a?o.push([e,{tipo:"resumo",cabeca:a.cabeca,hashFinal:Lo(e),tamanho:a.tamanho,mtimeMs:a.mtimeMs}]):ge.has(e)?o.push([e,{tipo:"dir"}]):o.push([e,null])}return Le.clear(),o}var Ni,So,Tc,Ct,G,ge,Ri,Le,Ro,Oo,ee,Ci,_c,Dc,yt,Pc,De,de=O(()=>{"use strict";m();Ni=ce(Ao(),1);Et();$a();So=ce(Ae(),1),Tc=/\/explicacoes\.json$/,Ct=1024*1024,G=new Map,ge=new Set(["/"]),Ri=new Set,Le=new Set,Ro=Date.now(),Oo=()=>Ro=Math.max(Ro+1,Date.now()),ee=o=>So.default.resolve(String(o)),Ci=new TextEncoder,_c=new TextDecoder;Dc=o=>Fe(o);yt=new Map,Pc=10;De={existsSync:U,mkdirSync:ie,readFileSync:L,writeFileSync:V,appendFileSync:wo,readdirSync:Oe,statSync:Ha,rmSync:Fe,unlinkSync:Dc,renameSync:Rt,copyFileSync:Ot,mkdtempSync:Ga,openSync:To,readSync:_o,closeSync:Mo,__sha256:Lo}});function wt(){return{use:(...o)=>{},get:(o,...e)=>{St.push({metodo:"GET",caminho:o,handlers:e})},post:(o,...e)=>{St.push({metodo:"POST",caminho:o,handlers:e})},listen:(o,e)=>e?.()}}function _i(o,e,a,t,r){let i=St.find(n=>n.metodo===o&&n.caminho===e);return i?new Promise(n=>{let s=p=>{console.error(p),n(Fo(500,{erro:"Erro interno.",detalhe:p instanceof Error?p.message:String(p)}))},c={statusCode:200,status(p){return c.statusCode=p,c},set(){return c},setHeader(){return c},json(p){return n(Fo(c.statusCode,p)),c},send(p){return n(typeof p=="string"?{status:c.statusCode,corpo:p,tipo:"text/html; charset=utf-8"}:Fo(c.statusCode,p)),c}},l={method:o,path:e,query:a,body:t??{},headers:{},__arquivos:r},d=0,u=p=>{if(p)return s(p);let f=i.handlers[d++];if(f)try{let v=f(l,c,u);v&&typeof v.then=="function"&&v.then(void 0,s)}catch(v){s(v)}};u()}):Promise.resolve(Fo(404,{erro:`Rota n\xE3o encontrada: ${o} ${e}`}))}var St,Fo,Xa,Tt=O(()=>{"use strict";m();St=[];wt.json=()=>(o,e,a)=>a();wt.static=o=>(e,a,t)=>t();Fo=(o,e)=>({status:o,corpo:JSON.stringify(e),tipo:"application/json; charset=utf-8"});Xa=wt});function _t(o){return o.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().split(/[^a-z0-9]+/).filter(e=>e.length>=3&&!qc.has(e)&&!/^\d+$/.test(e))}function Mi(o){return o.endsWith("oes")||o.endsWith("aes")?o.slice(0,-3)+"ao":o.endsWith("es")&&o.length>4?o.slice(0,-2):o.endsWith("s")&&o.length>3?o.slice(0,-1):o}function Vc(o,e){let a=Mi(o),t=Mi(e);return a===t||t.length>=4&&a.startsWith(t)||a.length>=4&&t.startsWith(a)}function Mt(o){if(!o)return null;let e=/comumente denominad[oa]s?\s+([^,;(]+)/i.exec(o);if(e)return e[1].trim();let a=o.split(/\s+d[oa]s?\s+c[óo]digos?\b|\s+da NCM\b|\s+classificad|\s+d[aoe]s?\s+(?:sub)?posi[çc]|\(/i)[0].trim();if(/,|;|\s(e|ou)\s/i.test(a))return null;let t=_t(a);return t.length===0||jc.has(t[0])?null:t.length<=3?a:null}function Uc(o,e){return o&&/comumente denominad/i.test(o)?!0:!!e&&/^[\s-]*outr[oa]s?\b/i.test(e)}function Do(o,e,a){if(!Uc(e,a))return null;let t=Mt(e);if(!t)return null;let r=_t(o);if(r.filter(n=>!Bc.has(n)).length===0)return null;let i=_t(t).filter(n=>!r.some(s=>Vc(n,s)));return i.length===0?null:{designacaoLegal:t,motivo:`A descri\xE7\xE3o "${o}" n\xE3o corresponde a "${t}", produto definido pela lei para esta regra (falta: ${i.join(", ")}).`}}var qc,Bc,jc,Lt=O(()=>{"use strict";m();qc=new Set(["de","do","da","dos","das","e","ou","em","com","para","por","a","o","os","as","um","uma"]),Bc=new Set(["produto","produtos","item","itens","mercadoria","mercadorias","diversos","diversas","outros","outras","und","unid","unidade","pct","pacote","cxa","caixa","kg","kgs","grs","lt","ltr","litro","especial","tipo"]),jc=new Set(["produtos","produto","artigos","preparacoes","partes","acessorios","demais","outros","outras","mercadorias"])});function $c(o,e,a){return Do(o,e,a)?.motivo??null}function Li(o){return o===null?"redu\xE7\xE3o n\xE3o dispon\xEDvel":`${Math.round(o*100)}%`}function Fi(o,e,a,t={}){let r=a.map(c=>{let l=Mt(c.descricaoLegal);return{tipo:"REGRA",regraId:c.id,rotulo:l?`\xC9 ${l} (Anexo ${c.anexo??"?"}, item ${c.item??"?"})`:`Atende \xE0 descri\xE7\xE3o legal do Anexo ${c.anexo??"?"}, item ${c.item??"?"}`,resultado:`${c.reducaoAliquota!==null&&c.reducaoAliquota>=1?"Redu\xE7\xE3o de 100%":`Redu\xE7\xE3o de ${Li(c.reducaoAliquota)}`} \xB7 CST ${c.cst??"?"} \xB7 cClassTrib ${c.cClassTrib??"?"}`,explicacao:`${c.fundamentoLegal??"LC 214/2025"}. Vale s\xF3 se o produto corresponder \xE0 descri\xE7\xE3o legal da regra.`,naoRecomendada:$c(e,c.descricaoLegal,c.descricaoNcmTipi)}});(t.consumoNoLocal||a.some(c=>c.anexo!==null&&kc.has(c.anexo)))&&r.push({tipo:"CONSUMO_NO_LOCAL",regraId:null,rotulo:"Preparado e servido para consumo no local (bar, restaurante, lanchonete)",resultado:`Redu\xE7\xE3o de 40% \xB7 CST ${Ft.cst} \xB7 cClassTrib ${Ft.cClassTrib}`,explicacao:`Regime espec\xEDfico de bares e restaurantes (${Ft.fundamento}). N\xE3o vale para venda de mercadoria para levar.`,naoRecomendada:null});let i=[...new Set(a.map(c=>c.reducaoAliquota).filter(c=>c!==null))].sort((c,l)=>l-c),n=a.length?`Regras de benef\xEDcio do NCM ${o} verificadas: ${a.map(c=>`Anexo ${c.anexo??"?"} (${Li(c.reducaoAliquota)})`).join(", ")}.`:`Nenhuma regra de benef\xEDcio para o NCM ${o}.`,s=i.some(c=>Math.abs(c-.6)<1e-9)?"":` N\xE3o h\xE1 regra de redu\xE7\xE3o de 60% para o NCM ${o}.`;return r.push({tipo:"MERCADORIA_SEM_BENEFICIO",regraId:null,rotulo:a.length?`Vendido como mercadoria; n\xE3o corresponde \xE0s regras acima; NCM ${o} correto`:`Vendido como mercadoria (revenda ou para levar); NCM ${o} correto`,resultado:"Tributa\xE7\xE3o integral \xB7 CST 000 \xB7 cClassTrib 000001",explicacao:`${n}${s} O regime de bares e restaurantes n\xE3o se aplica a mercadoria.`,naoRecomendada:null}),r.push({tipo:"NCM_INCORRETO",regraId:null,rotulo:"O NCM informado est\xE1 errado",resultado:"Corrigir o NCM no cadastro do ERP e reprocessar com as novas notas",explicacao:"Nenhum benef\xEDcio \xE9 aplicado agora: o benef\xEDcio de outro NCM n\xE3o \xE9 transferido para o NCM informado.",naoRecomendada:null}),r}var Ft,kc,Di=O(()=>{"use strict";m();Lt();Ft={cst:"200",cClassTrib:"200047",reducao:.4,fundamento:"LC 214/2025, art. 275"},kc=new Set(["I","VII","XV"])});function Dt(o){return{array(e,a=1/0){return(t,r,i)=>{let n=(t.__arquivos??[]).filter(s=>s.campo===e);if(n.length>a)return i(new Error(`Mais de ${a} arquivos enviados.`));t.files=n.map(s=>{let c=Pi.default.join(o.dest,`${Date.now()}-${++zc}`);return V(c,new Uint8Array(s.dados)),{fieldname:e,originalname:s.nome,path:c,size:s.dados.byteLength}}),i()}}}}var Pi,zc,qi=O(()=>{"use strict";m();Pi=ce(Ae(),1);de();zc=0});function al(o,e){return Kc(o,{i:2},e&&e.out,e&&e.dictionary)}function rl(o,e){if(e){for(var a="",t=0;t<o.length;t+=16384)a+=String.fromCharCode.apply(null,o.subarray(t,t+16384));return a}else{if(Vt)return Vt.decode(o);var r=tl(o),i=r.s,a=r.r;return a.length&&he(8),i}}function Hi(o,e){for(var a={},t=o.length-22;Ee(o,t)!=101010256;--t)(!t||o.length-t>65558)&&he(13);var r=Pe(o,t+8);if(!r)return{};var i=Ee(o,t+16),n=Ee(o,t-20)==117853008;if(n){var s=Ee(o,t-12);n=Ee(o,s)==101075792,n&&(r=Ee(o,s+32),i=Ee(o,s+48))}for(var c=e&&e.filter,l=0;l<r;++l){var d=nl(o,i,n),u=d[0],p=d[1],f=d[2],v=d[3],C=d[4],S=d[5],y=il(o,S);i=C,(!c||c({name:v,size:p,originalSize:f,compression:u}))&&(u?u==8?a[v]=al(o.subarray(y,y+p),{out:new ve(f)}):he(14,"unknown compression type "+u):a[v]=Ut(o,y,y+p))}return a}var ve,ba,Hc,Bi,ji,Gc,Vi,Ui,ki,Xc,$i,Qc,wp,jt,$e,F,Qa,Ja,F,F,F,F,zi,F,Jc,Wc,Pt,ye,qt,Zc,Ut,Yc,he,Kc,el,Pe,Ee,Bt,Vt,ol,tl,il,nl,sl,Gi=O(()=>{m();ve=Uint8Array,ba=Uint16Array,Hc=Int32Array,Bi=new ve([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),ji=new ve([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Gc=new ve([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Vi=function(o,e){for(var a=new ba(31),t=0;t<31;++t)a[t]=e+=1<<o[t-1];for(var r=new Hc(a[30]),t=1;t<30;++t)for(var i=a[t];i<a[t+1];++i)r[i]=i-a[t]<<5|t;return{b:a,r}},Ui=Vi(Bi,2),ki=Ui.b,Xc=Ui.r;ki[28]=258,Xc[258]=28;$i=Vi(ji,0),Qc=$i.b,wp=$i.r,jt=new ba(32768);for(F=0;F<32768;++F)$e=(F&43690)>>1|(F&21845)<<1,$e=($e&52428)>>2|($e&13107)<<2,$e=($e&61680)>>4|($e&3855)<<4,jt[F]=(($e&65280)>>8|($e&255)<<8)>>1;Qa=(function(o,e,a){for(var t=o.length,r=0,i=new ba(e);r<t;++r)o[r]&&++i[o[r]-1];var n=new ba(e);for(r=1;r<e;++r)n[r]=n[r-1]+i[r-1]<<1;var s;if(a){s=new ba(1<<e);var c=15-e;for(r=0;r<t;++r)if(o[r])for(var l=r<<4|o[r],d=e-o[r],u=n[o[r]-1]++<<d,p=u|(1<<d)-1;u<=p;++u)s[jt[u]>>c]=l}else for(s=new ba(t),r=0;r<t;++r)o[r]&&(s[r]=jt[n[o[r]-1]++]>>15-o[r]);return s}),Ja=new ve(288);for(F=0;F<144;++F)Ja[F]=8;for(F=144;F<256;++F)Ja[F]=9;for(F=256;F<280;++F)Ja[F]=7;for(F=280;F<288;++F)Ja[F]=8;zi=new ve(32);for(F=0;F<32;++F)zi[F]=5;Jc=Qa(Ja,9,1),Wc=Qa(zi,5,1),Pt=function(o){for(var e=o[0],a=1;a<o.length;++a)o[a]>e&&(e=o[a]);return e},ye=function(o,e,a){var t=e/8|0;return(o[t]|o[t+1]<<8)>>(e&7)&a},qt=function(o,e){var a=e/8|0;return(o[a]|o[a+1]<<8|o[a+2]<<16)>>(e&7)},Zc=function(o){return(o+7)/8|0},Ut=function(o,e,a){return(e==null||e<0)&&(e=0),(a==null||a>o.length)&&(a=o.length),new ve(o.subarray(e,a))},Yc=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],he=function(o,e,a){var t=new Error(e||Yc[o]);if(t.code=o,Error.captureStackTrace&&Error.captureStackTrace(t,he),!a)throw t;return t},Kc=function(o,e,a,t){var r=o.length,i=t?t.length:0;if(!r||e.f&&!e.l)return a||new ve(0);var n=!a,s=n||e.i!=2,c=e.i;n&&(a=new ve(r*3));var l=function(re){var Ge=a.length;if(re>Ge){var je=new ve(Math.max(Ge*2,re));je.set(a),a=je}},d=e.f||0,u=e.p||0,p=e.b||0,f=e.l,v=e.d,C=e.m,S=e.n,y=r*8;do{if(!f){d=ye(o,u,1);var T=ye(o,u+1,3);if(u+=3,T)if(T==1)f=Jc,v=Wc,C=9,S=5;else if(T==2){var x=ye(o,u,31)+257,b=ye(o,u+10,15)+4,I=x+ye(o,u+5,31)+1;u+=14;for(var N=new ve(I),B=new ve(19),M=0;M<b;++M)B[Gc[M]]=ye(o,u+M*3,7);u+=b*3;for(var X=Pt(B),Be=(1<<X)-1,Z=Qa(B,X,1),M=0;M<I;){var He=Z[ye(o,u,Be)];u+=He&15;var w=He>>4;if(w<16)N[M++]=w;else{var z=0,oe=0;for(w==16?(oe=3+ye(o,u,3),u+=2,z=N[M-1]):w==17?(oe=3+ye(o,u,7),u+=3):w==18&&(oe=11+ye(o,u,127),u+=7);oe--;)N[M++]=z}}var Y=N.subarray(0,x),K=N.subarray(x);C=Pt(Y),S=Pt(K),f=Qa(Y,C,1),v=Qa(K,S,1)}else he(1);else{var w=Zc(u)+4,_=o[w-4]|o[w-3]<<8,g=w+_;if(g>r){c&&he(0);break}s&&l(p+_),a.set(o.subarray(w,g),p),e.b=p+=_,e.p=u=g*8,e.f=d;continue}if(u>y){c&&he(0);break}}s&&l(p+131072);for(var te=(1<<C)-1,mo=(1<<S)-1,qa=u;;qa=u){var z=f[qt(o,u)&te],Ye=z>>4;if(u+=z&15,u>y){c&&he(0);break}if(z||he(2),Ye<256)a[p++]=Ye;else if(Ye==256){qa=u,f=null;break}else{var st=Ye-254;if(Ye>264){var M=Ye-257,Ie=Bi[M];st=ye(o,u,(1<<Ie)-1)+ki[M],u+=Ie}var Ke=v[qt(o,u)&mo],Ba=Ke>>4;Ke||he(3),u+=Ke&15;var K=Qc[Ba];if(Ba>3){var Ie=ji[Ba];K+=qt(o,u)&(1<<Ie)-1,u+=Ie}if(u>y){c&&he(0);break}s&&l(p+131072);var A=p+st;if(p<K){var D=i-K,Q=Math.min(K,A);for(D+p<0&&he(3);p<Q;++p)a[p]=t[D+p]}for(;p<A;++p)a[p]=a[p-K]}}e.l=f,e.p=qa,e.b=p,e.f=d,f&&(d=1,e.m=C,e.d=v,e.n=S)}while(!d);return p!=a.length&&n?Ut(a,0,p):a.subarray(0,p)},el=new ve(0),Pe=function(o,e){return o[e]|o[e+1]<<8},Ee=function(o,e){return(o[e]|o[e+1]<<8|o[e+2]<<16|o[e+3]<<24)>>>0},Bt=function(o,e){return Ee(o,e)+Ee(o,e+4)*4294967296};Vt=typeof TextDecoder<"u"&&new TextDecoder,ol=0;try{Vt.decode(el,{stream:!0}),ol=1}catch{}tl=function(o){for(var e="",a=0;;){var t=o[a++],r=(t>127)+(t>223)+(t>239);if(a+r>o.length)return{s:e,r:Ut(o,a-1)};r?r==3?(t=((t&15)<<18|(o[a++]&63)<<12|(o[a++]&63)<<6|o[a++]&63)-65536,e+=String.fromCharCode(55296|t>>10,56320|t&1023)):r&1?e+=String.fromCharCode((t&31)<<6|o[a++]&63):e+=String.fromCharCode((t&15)<<12|(o[a++]&63)<<6|o[a++]&63):e+=String.fromCharCode(t)}};il=function(o,e){return e+30+Pe(o,e+26)+Pe(o,e+28)},nl=function(o,e,a){var t=Pe(o,e+28),r=Pe(o,e+30),i=rl(o.subarray(e+46,e+46+t),!(Pe(o,e+8)&2048)),n=e+46+t,s=sl(o,n,r,a,Ee(o,e+20),Ee(o,e+24),Ee(o,e+42)),c=s[0],l=s[1],d=s[2];return[Pe(o,e+10),c,l,i,n+r+Pe(o,e+32),d]},sl=function(o,e,a,t,r,i,n){var s=r==4294967295,c=i==4294967295,l=n==4294967295,d=e+a,u=s+c+l;if(t&&u){for(;e+4<d;e+=4+Pe(o,e+2))if(Pe(o,e)==1)return[s?Bt(o,e+4+8*c):r,c?Bt(o,e+4):i,l?Bt(o,e+4+8*(c+s)):n,1];t<2&&he(13)}return[r,i,n,0]}});function qo(o,e){if(o!=="unzip")throw new Error(`comando indispon\xEDvel no navegador: ${o}`);let a=e.indexOf("-d"),t=e[a+1],r=e.find((n,s)=>!n.startsWith("-")&&s!==a+1),i=Hi(L(r));for(let[n,s]of Object.entries(i)){if(n.endsWith("/"))continue;let c=Po.default.join(t,Po.default.normalize("/"+n));ie(Po.default.dirname(c),{recursive:!0}),V(c,s)}}var Po,kt=O(()=>{"use strict";m();Gi();Po=ce(Ae(),1);de()});var Bo,$t=O(()=>{"use strict";m();Bo=()=>"/tmp"});function Qi(o,e){let a=[],t=e.exec(o);for(;t;){let r=[];r.startIndex=e.lastIndex-t[0].length;let i=t.length;for(let n=0;n<i;n++)r.push(t[n]);a.push(r),t=e.exec(o)}return a}function Ji(o){return typeof o<"u"}var Xi,cl,ll,dl,zt,Wa,jo,Vo=O(()=>{"use strict";m();Xi=":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",cl=Xi+"\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040",ll="["+Xi+"]["+cl+"]*",dl=new RegExp("^"+ll+"$");zt=function(o){let e=dl.exec(o);return!(e===null||typeof e>"u")};Wa=["hasOwnProperty","toString","valueOf","__defineGetter__","__defineSetter__","__lookupGetter__","__lookupSetter__"],jo=["__proto__","constructor","prototype"]});function Ki(o,e){e=Object.assign({},ul,e);let a=[],t=!1,r=!1;o[0]==="\uFEFF"&&(o=o.substr(1));for(let i=0;i<o.length;i++)if(o[i]==="<"&&o[i+1]==="?"){if(i+=2,i=Wi(o,i),i.err)return i}else if(o[i]==="<"){let n=i;if(i++,o[i]==="!"){i=Zi(o,i);continue}else{let s=!1;o[i]==="/"&&(s=!0,i++);let c="";for(;i<o.length&&o[i]!==">"&&o[i]!==" "&&o[i]!=="	"&&o[i]!==`
`&&o[i]!=="\r";i++)c+=o[i];if(c=c.trim(),c[c.length-1]==="/"&&(c=c.substring(0,c.length-1),i--),!xl(c)){let u;return c.trim().length===0?u="Invalid space after '<'.":u="Tag '"+c+"' is an invalid name.",$("InvalidTag",u,ne(o,i))}let l=ml(o,i);if(l===!1)return $("InvalidAttr","Attributes for '"+c+"' have open quote.",ne(o,i));let d=l.value;if(i=l.index,d[d.length-1]==="/"){let u=i-d.length;d=d.substring(0,d.length-1);let p=Yi(d,e);if(p===!0)t=!0;else return $(p.err.code,p.err.msg,ne(o,u+p.err.line))}else if(s)if(l.tagClosed){if(d.trim().length>0)return $("InvalidTag","Closing tag '"+c+"' can't have attributes or invalid starting.",ne(o,n));if(a.length===0)return $("InvalidTag","Closing tag '"+c+"' has not been opened.",ne(o,n));{let u=a.pop();if(c!==u.tagName){let p=ne(o,u.tagStartPos);return $("InvalidTag","Expected closing tag '"+u.tagName+"' (opened in line "+p.line+", col "+p.col+") instead of closing tag '"+c+"'.",ne(o,n))}a.length==0&&(r=!0)}}else return $("InvalidTag","Closing tag '"+c+"' doesn't have proper closing.",ne(o,i));else{let u=Yi(d,e);if(u!==!0)return $(u.err.code,u.err.msg,ne(o,i-d.length+u.err.line));if(r===!0)return $("InvalidXml","Multiple possible root nodes found.",ne(o,i));e.unpairedTags.indexOf(c)!==-1||a.push({tagName:c,tagStartPos:n}),t=!0}for(i++;i<o.length;i++)if(o[i]==="<")if(o[i+1]==="!"){i++,i=Zi(o,i);continue}else if(o[i+1]==="?"){if(i=Wi(o,++i),i.err)return i}else break;else if(o[i]==="&"){let u=vl(o,i);if(u==-1)return $("InvalidChar","char '&' is not expected.",ne(o,i));i=u}else if(r===!0&&!xa(o[i]))return $("InvalidXml","Extra text at the end",ne(o,i));o[i]==="<"&&i--}}else{if(xa(o[i]))continue;return $("InvalidChar","char '"+o[i]+"' is not expected.",ne(o,i))}if(t){if(a.length==1)return $("InvalidTag","Unclosed tag '"+a[0].tagName+"'.",ne(o,a[0].tagStartPos));if(a.length>0)return $("InvalidXml","Invalid '"+JSON.stringify(a.map(i=>i.tagName),null,4).replace(/\r?\n/g,"")+"' found.",{line:1,col:1})}else return $("InvalidXml","Start tag expected.",1);return!0}function xa(o){return o===" "||o==="	"||o===`
`||o==="\r"}function Wi(o,e){let a=e;for(;e<o.length;e++)if(o[e]=="?"||o[e]==" "){let t=o.substr(a,e-a);if(e>5&&t==="xml")return $("InvalidXml","XML declaration allowed only at the start of the document.",ne(o,e));if(o[e]=="?"&&o[e+1]==">"){e++;break}else continue}return e}function Zi(o,e){if(o.length>e+5&&o[e+1]==="-"&&o[e+2]==="-"){for(e+=3;e<o.length;e++)if(o[e]==="-"&&o[e+1]==="-"&&o[e+2]===">"){e+=2;break}}else if(o.length>e+8&&o[e+1]==="D"&&o[e+2]==="O"&&o[e+3]==="C"&&o[e+4]==="T"&&o[e+5]==="Y"&&o[e+6]==="P"&&o[e+7]==="E"){let a=1;for(e+=8;e<o.length;e++)if(o[e]==="<")a++;else if(o[e]===">"&&(a--,a===0))break}else if(o.length>e+9&&o[e+1]==="["&&o[e+2]==="C"&&o[e+3]==="D"&&o[e+4]==="A"&&o[e+5]==="T"&&o[e+6]==="A"&&o[e+7]==="["){for(e+=8;e<o.length;e++)if(o[e]==="]"&&o[e+1]==="]"&&o[e+2]===">"){e+=2;break}}return e}function ml(o,e){let a="",t="",r=!1;for(;e<o.length;e++){if(o[e]===pl||o[e]===fl)t===""?t=o[e]:t!==o[e]||(t="");else if(o[e]===">"&&t===""){r=!0;break}a+=o[e]}return t!==""?!1:{value:a,index:e,tagClosed:r}}function gl(o){let e=[],a=o.length,t=0;for(;t<a;){let r=t;for(;t<a&&xa(o[t]);)t++;if(t>=a)break;if(o[t]==="="){t=r+1;continue}let i=o.slice(r,t),n=t;for(;t<a&&!xa(o[t])&&o[t]!=="=";)t++;let s=o.slice(n,t),c,l=t;for(;l<a&&xa(o[l]);)l++;l<a&&o[l]==="="&&(c=o.slice(t,l+1),t=l+1);let d,u,p=t;for(;p<a&&xa(o[p]);)p++;if(p<a&&(o[p]==='"'||o[p]==="'")){let v=p+1,C=o.indexOf(o[p],v);C!==-1&&(d=o[p],u=o.slice(v,C),t=C+1)}let f={startIndex:r};f[1]=i,f[2]=s,f[3]=c,f[4]=d!==void 0?!0:void 0,f[5]=d,f[6]=u,e.push(f)}return e}function Yi(o,e){let a=gl(o),t={};for(let r=0;r<a.length;r++){if(a[r][1].length===0)return $("InvalidAttr","Attribute '"+a[r][2]+"' has no space in starting.",Za(a[r]));if(a[r][3]!==void 0&&a[r][4]===void 0)return $("InvalidAttr","Attribute '"+a[r][2]+"' is without value.",Za(a[r]));if(a[r][3]===void 0&&!e.allowBooleanAttributes)return $("InvalidAttr","boolean attribute '"+a[r][2]+"' is not allowed.",Za(a[r]));let i=a[r][2];if(!bl(i))return $("InvalidAttr","Attribute '"+i+"' is an invalid name.",Za(a[r]));if(!Object.prototype.hasOwnProperty.call(t,i))t[i]=1;else return $("InvalidAttr","Attribute '"+i+"' is repeated.",Za(a[r]))}return!0}function hl(o,e){let a=/\d/;for(o[e]==="x"&&(e++,a=/[\da-fA-F]/);e<o.length;e++){if(o[e]===";")return e;if(!o[e].match(a))break}return-1}function vl(o,e){if(e++,o[e]===";")return-1;if(o[e]==="#")return e++,hl(o,e);let a=0;for(;e<o.length;e++,a++)if(!(o[e].match(/\w/)&&a<20)){if(o[e]===";")break;return-1}return e}function $(o,e,a){return{err:{code:o,msg:e,line:a.line||a,col:a.col}}}function bl(o){return zt(o)}function xl(o){return zt(o)}function ne(o,e){let a=o.substring(0,e).split(/\r?\n/);return{line:a.length,col:a[a.length-1].length+1}}function Za(o){return o.startIndex+o[1].length}var ul,pl,fl,en=O(()=>{"use strict";m();Vo();ul={allowBooleanAttributes:!1,unpairedTags:[]};pl='"',fl="'"});var Ht,Ya,Gt,Xt=O(()=>{m();Ht={cent:"\xA2",pound:"\xA3",curren:"\xA4",yen:"\xA5",euro:"\u20AC",dollar:"$",fnof:"\u0192",inr:"\u20B9",af:"\u060B",birr:"\u1265\u122D",peso:"\u20B1",rub:"\u20BD",won:"\u20A9",yuan:"\xA5",cedil:"\xB8"},Ya={amp:"&",apos:"'",gt:">",lt:"<",quot:'"'},Gt={nbsp:"\xA0",copy:"\xA9",reg:"\xAE",trade:"\u2122",mdash:"\u2014",ndash:"\u2013",hellip:"\u2026",laquo:"\xAB",raquo:"\xBB",lsquo:"\u2018",rsquo:"\u2019",ldquo:"\u201C",rdquo:"\u201D",bull:"\u2022",para:"\xB6",sect:"\xA7",deg:"\xB0",frac12:"\xBD",frac14:"\xBC",frac34:"\xBE"}});function an(o){if(o[0]==="#")throw new Error(`[EntityReplacer] Invalid character '#' in entity name: "${o}"`);for(let e of o)if(Al.has(e))throw new Error(`[EntityReplacer] Invalid character '${e}' in entity name: "${o}"`);return o}function Ka(...o){let e=Object.create(null);for(let a of o)if(a)for(let t of Object.keys(a)){let r=a[t];if(typeof r=="string")e[t]=r;else if(r&&typeof r=="object"&&r.val!==void 0){let i=r.val;typeof i=="string"&&(e[t]=i)}}return e}function El(o){return!o||o===oa?new Set([oa]):o===Qt?new Set([Qt]):o===Uo?new Set([Uo]):Array.isArray(o)?new Set(o):new Set([oa])}function Il(o){if(!o)return{xmlVersion:1,onLevel:ue.allow,nullLevel:ue.remove};let e=o.xmlVersion===1.1?1.1:1,a=ue[o.onNCR]??ue.allow,t=ue[o.nullNCR]??ue.remove,r=Math.max(t,ue.remove);return{xmlVersion:e,onLevel:a,nullLevel:r}}var Aa,Al,oa,Uo,Qt,ue,Cl,Ea,on=O(()=>{m();Xt();Aa=Object.freeze({ALLOW:"allow",BLOCK:"block",THROW:"throw"}),Al=new Set("!?\\\\/[]$%{}^&*()<>|+");oa="external",Uo="base",Qt="all";ue=Object.freeze({allow:0,leave:1,remove:2,throw:3}),Cl=new Set([9,10,13]);Ea=class{constructor(e={}){this._limit=e.limit||{},this._maxTotalExpansions=this._limit.maxTotalExpansions||0,this._maxExpandedLength=this._limit.maxExpandedLength||0,this._postCheck=typeof e.postCheck=="function"?e.postCheck:t=>t,this._limitTiers=El(this._limit.applyLimitsTo??oa),this._numericAllowed=e.numericAllowed??!0,this._baseMap=Ka(Ya,e.namedEntities||null),this._externalMap=Object.create(null),this._inputMap=Object.create(null),this._totalExpansions=0,this._expandedLength=0,this._removeSet=new Set(e.remove&&Array.isArray(e.remove)?e.remove:[]),this._leaveSet=new Set(e.leave&&Array.isArray(e.leave)?e.leave:[]);let a=Il(e.ncr);this._ncrXmlVersion=a.xmlVersion,this._ncrOnLevel=a.onLevel,this._ncrNullLevel=a.nullLevel,this._onExternalEntity=typeof e.onExternalEntity=="function"?e.onExternalEntity:null,this._onInputEntity=typeof e.onInputEntity=="function"?e.onInputEntity:null}_applyRegistrationHook(e,a,t,r){if(!e)return!0;let i=e(a,t);if(i===Aa.BLOCK)return!1;if(i===Aa.THROW)throw new Error(`[EntityDecoder] Registration of ${r} entity "&${a};" was rejected by hook`);return!0}setExternalEntities(e){if(e)for(let r of Object.keys(e))an(r);if(!this._onExternalEntity){this._externalMap=Ka(e);return}let a=Ka(e),t=Object.create(null);for(let[r,i]of Object.entries(a))this._applyRegistrationHook(this._onExternalEntity,r,i,"external")&&(t[r]=i);this._externalMap=t}addExternalEntity(e,a){an(e),typeof a=="string"&&a.indexOf("&")===-1&&this._applyRegistrationHook(this._onExternalEntity,e,a,"external")&&(this._externalMap[e]=a)}addInputEntities(e){if(this._totalExpansions=0,this._expandedLength=0,!this._onInputEntity){this._inputMap=Ka(e);return}let a=Ka(e),t=Object.create(null);for(let[r,i]of Object.entries(a))this._applyRegistrationHook(this._onInputEntity,r,i,"input")&&(t[r]=i);this._inputMap=t}reset(){return this._inputMap=Object.create(null),this._totalExpansions=0,this._expandedLength=0,this}setXmlVersion(e){this._ncrXmlVersion=e===1.1?1.1:1}decode(e){if(typeof e!="string"||e.length===0||e.indexOf("&")===-1)return e;let a=e,t=[],r=e.length,i=0,n=0,s=this._maxTotalExpansions>0,c=this._maxExpandedLength>0,l=s||c;for(;n<r;){if(e.charCodeAt(n)!==38){n++;continue}let u=n+1;for(;u<r&&e.charCodeAt(u)!==59&&u-n<=32;)u++;if(u>=r||e.charCodeAt(u)!==59){n++;continue}let p=e.slice(n+1,u);if(p.length===0){n++;continue}let f,v;if(this._removeSet.has(p))f="",v===void 0&&(v=oa);else if(this._leaveSet.has(p)){n++;continue}else if(p.charCodeAt(0)===35){let C=this._resolveNCR(p);if(C===void 0){n++;continue}f=C,v=Uo}else{let C=this._resolveName(p);f=C?.value,v=C?.tier}if(f===void 0){n++;continue}if(n>i&&t.push(e.slice(i,n)),t.push(f),i=u+1,n=i,l&&this._tierCounts(v)){if(s&&(this._totalExpansions++,this._totalExpansions>this._maxTotalExpansions))throw new Error(`[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`);if(c){let C=f.length-(p.length+2);if(C>0&&(this._expandedLength+=C,this._expandedLength>this._maxExpandedLength))throw new Error(`[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`)}}}i<r&&t.push(e.slice(i));let d=t.length===0?e:t.join("");return this._postCheck(d,a)}_tierCounts(e){return this._limitTiers.has(Qt)?!0:this._limitTiers.has(e)}_resolveName(e){if(e in this._inputMap)return{value:this._inputMap[e],tier:oa};if(e in this._externalMap)return{value:this._externalMap[e],tier:oa};if(e in this._baseMap)return{value:this._baseMap[e],tier:Uo}}_classifyNCR(e){return e===0?this._ncrNullLevel:e>=55296&&e<=57343||this._ncrXmlVersion===1&&e>=1&&e<=31&&!Cl.has(e)?ue.remove:-1}_applyNCRAction(e,a,t){switch(e){case ue.allow:return String.fromCodePoint(t);case ue.remove:return"";case ue.leave:return;case ue.throw:throw new Error(`[EntityDecoder] Prohibited numeric character reference &${a}; (U+${t.toString(16).toUpperCase().padStart(4,"0")})`);default:return String.fromCodePoint(t)}}_resolveNCR(e){let a=e.charCodeAt(1),t;if(a===120||a===88?t=parseInt(e.slice(2),16):t=parseInt(e.slice(1),10),Number.isNaN(t)||t<0||t>1114111)return;let r=this._classifyNCR(t);if(!this._numericAllowed&&r<ue.remove)return;let i=r===-1?this._ncrOnLevel:Math.max(this._ncrOnLevel,r);return this._applyNCRAction(i,e,t)}}});var tn=O(()=>{m();on();Xt()});function Rl(o,e){if(typeof o!="string")return;let a=o.toLowerCase();if(Wa.some(t=>a===t.toLowerCase()))throw new Error(`[SECURITY] Invalid ${e}: "${o}" is a reserved JavaScript keyword that could cause prototype pollution`);if(jo.some(t=>a===t.toLowerCase()))throw new Error(`[SECURITY] Invalid ${e}: "${o}" is a reserved JavaScript keyword that could cause prototype pollution`)}function nn(o,e){return typeof o=="boolean"?{enabled:o,maxEntitySize:1e4,maxExpansionDepth:1e4,maxTotalExpansions:1/0,maxExpandedLength:1e5,maxEntityCount:1e3,allowedTags:null,tagFilter:null,appliesTo:"all"}:typeof o=="object"&&o!==null?{enabled:o.enabled!==!1,maxEntitySize:Math.max(1,o.maxEntitySize??1e4),maxExpansionDepth:Math.max(1,o.maxExpansionDepth??1e4),maxTotalExpansions:Math.max(1,o.maxTotalExpansions??1/0),maxExpandedLength:Math.max(1,o.maxExpandedLength??1e5),maxEntityCount:Math.max(1,o.maxEntityCount??1e3),allowedTags:o.allowedTags??null,tagFilter:o.tagFilter??null,appliesTo:o.appliesTo??"all"}:nn(!0)}var rn,Nl,sn,cn=O(()=>{m();Vo();rn=o=>Wa.includes(o)?"__"+o:o,Nl={preserveOrder:!1,attributeNamePrefix:"@_",attributesGroupName:!1,textNodeName:"#text",ignoreAttributes:!0,removeNSPrefix:!1,allowBooleanAttributes:!1,parseTagValue:!0,parseAttributeValue:!1,trimValues:!0,cdataPropName:!1,numberParseOptions:{hex:!0,leadingZeros:!0,eNotation:!0,unicode:!1},tagValueProcessor:function(o,e){return e},attributeValueProcessor:function(o,e){return e},stopNodes:[],alwaysCreateTextNode:!1,isArray:()=>!1,commentPropName:!1,unpairedTags:[],processEntities:!0,htmlEntities:!1,entityDecoder:null,ignoreDeclaration:!1,ignorePiTags:!1,transformTagName:!1,transformAttributeName:!1,updateTag:function(o,e,a){return o},captureMetaData:!1,maxNestedTags:100,strictReservedNames:!0,jPath:!0,onDangerousProperty:rn};sn=function(o){let e=Object.assign({},Nl,o),a=[{value:e.attributeNamePrefix,name:"attributeNamePrefix"},{value:e.attributesGroupName,name:"attributesGroupName"},{value:e.textNodeName,name:"textNodeName"},{value:e.cdataPropName,name:"cdataPropName"},{value:e.commentPropName,name:"commentPropName"}];for(let{value:t,name:r}of a)t&&Rl(t,r);return e.onDangerousProperty===null&&(e.onDangerousProperty=rn),e.processEntities=nn(e.processEntities,e.htmlEntities),e.unpairedTagsSet=new Set(e.unpairedTags),e.stopNodes&&Array.isArray(e.stopNodes)&&(e.stopNodes=e.stopNodes.map(t=>typeof t=="string"&&t.startsWith("*.")?".."+t.substring(2):t)),e}});var ta,pe,ko=O(()=>{"use strict";m();typeof Symbol!="function"?ta="@@xmlMetadata":ta=Symbol("XML Node Metadata");pe=class{constructor(e){this.tagname=e,this.child=[],this[":@"]=Object.create(null)}add(e,a){e==="__proto__"&&(e="#__proto__"),this.child.push({[e]:a})}addChild(e,a){e.tagname==="__proto__"&&(e.tagname="#__proto__"),e[":@"]&&Object.keys(e[":@"]).length>0?this.child.push({[e.tagname]:e.child,":@":e[":@"]}):this.child.push({[e.tagname]:e.child}),this.addStartIndex(a)}addStartIndex(e){e!==void 0&&(this.child[this.child.length-1][ta]={startIndex:e})}addEndIndex(e){let a=this.child[this.child.length-1];a!==void 0&&a[ta]!==void 0&&a[ta].endIndex===void 0&&(a[ta].endIndex=e)}static getMetaDataSymbol(){return ta}}});var ln,Ol,dn,yl,Jt,Sl,wl,un,Tl,_l,Ml,Wt,pn=O(()=>{m();ln=":A-Za-z_\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u0486\u0488-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",Ol=ln+"\\-\\.\\d\xB7\u0300-\u036F\u203F-\u2040",dn=":A-Za-z_\xC0-\u02FF\u0370-\u037D\u037F-\u0486\u0488-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}",yl=dn+"\\-\\.\\d\xB7\u0300-\u036F\u0487\u203F-\u2040",Jt=(o,e,a="")=>{let t=o.replace(":",""),r=e.replace(":",""),i=`[${t}][${r}]*`;return{name:new RegExp(`^[${o}][${e}]*$`,a),ncName:new RegExp(`^${i}$`,a),qName:new RegExp(`^${i}(?::${i})?$`,a),nmToken:new RegExp(`^[${e}]+$`,a),nmTokens:new RegExp(`^[${e}]+(?:\\s+[${e}]+)*$`,a)}},Sl=Jt(ln,Ol),wl=Jt(dn,yl,"u"),un=":A-Za-z_",Tl=un+"\\-\\.\\d",_l=Jt(un,Tl),Ml=(o="1.0",e=!1)=>e?_l:o==="1.1"?wl:Sl,Wt=(o,{xmlVersion:e="1.0",asciiOnly:a=!1}={})=>Ml(e,a).qName.test(o)});function ra(o,e,a){for(let t=0;t<e.length;t++)if(e[t]!==o[a+t+1])return!1;return!0}function eo(o,e){if(Wt(o,{xmlVersion:e}))return o;throw new Error(`Invalid entity name ${o}`)}var ao,fe,fn=O(()=>{m();pn();ao=class{constructor(e,a){this.suppressValidationErr=!e,this.options=e,this.xmlVersion=a||1}setXmlVersion(e=1){this.xmlVersion=e}readDocType(e,a){let t=Object.create(null),r=0;if(e[a+3]==="O"&&e[a+4]==="C"&&e[a+5]==="T"&&e[a+6]==="Y"&&e[a+7]==="P"&&e[a+8]==="E"){a=a+9;let i=1,n=!1,s=!1,c=null,l="";for(;a<e.length;a++){if(c!==null){e[a]===c&&(c=null),l+=e[a];continue}if(!n&&!s&&(e[a]==='"'||e[a]==="'")){c=e[a],l+=e[a];continue}if(e[a]==="<"&&!s){if(n&&ra(e,"!ENTITY",a)){a+=7;let d,u;if([d,u,a]=this.readEntityExp(e,a+1,this.suppressValidationErr),u.indexOf("&")===-1){if(this.options.enabled!==!1&&this.options.maxEntityCount!=null&&r>=this.options.maxEntityCount)throw new Error(`Entity count (${r+1}) exceeds maximum allowed (${this.options.maxEntityCount})`);t[d]=u,r++}}else if(n&&ra(e,"!ELEMENT",a)){a+=8;let{index:d}=this.readElementExp(e,a+1);a=d}else if(n&&ra(e,"!ATTLIST",a))a+=8;else if(n&&ra(e,"!NOTATION",a)){a+=9;let{index:d}=this.readNotationExp(e,a+1,this.suppressValidationErr);a=d}else if(ra(e,"!--",a))s=!0;else throw new Error("Invalid DOCTYPE");i++,l=""}else if(e[a]===">"){if(s?e[a-1]==="-"&&e[a-2]==="-"&&(s=!1,i--):i--,i===0)break}else e[a]==="["?n=!0:l+=e[a]}if(c!==null||i!==0)throw new Error("Unclosed DOCTYPE")}else throw new Error("Invalid Tag instead of DOCTYPE");return{entities:t,i:a}}readEntityExp(e,a){a=fe(e,a);let t=a;for(;a<e.length&&!/\s/.test(e[a])&&e[a]!=='"'&&e[a]!=="'";)a++;let r=e.substring(t,a);if(eo(r,{xmlVersion:this.xmlVersion}),a=fe(e,a),!this.suppressValidationErr){if(e.substring(a,a+6).toUpperCase()==="SYSTEM")throw new Error("External entities are not supported");if(e[a]==="%")throw new Error("Parameter entities are not supported")}let i="";if([a,i]=this.readIdentifierVal(e,a,"entity"),this.options.enabled!==!1&&this.options.maxEntitySize!=null&&i.length>this.options.maxEntitySize)throw new Error(`Entity "${r}" size (${i.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);return a--,[r,i,a]}readNotationExp(e,a){a=fe(e,a);let t=a;for(;a<e.length&&!/\s/.test(e[a]);)a++;let r=e.substring(t,a);!this.suppressValidationErr&&eo(r,{xmlVersion:this.xmlVersion}),a=fe(e,a);let i=e.substring(a,a+6).toUpperCase();if(!this.suppressValidationErr&&i!=="SYSTEM"&&i!=="PUBLIC")throw new Error(`Expected SYSTEM or PUBLIC, found "${i}"`);a+=i.length,a=fe(e,a);let n=null,s=null;if(i==="PUBLIC")[a,n]=this.readIdentifierVal(e,a,"publicIdentifier"),a=fe(e,a),(e[a]==='"'||e[a]==="'")&&([a,s]=this.readIdentifierVal(e,a,"systemIdentifier"));else if(i==="SYSTEM"&&([a,s]=this.readIdentifierVal(e,a,"systemIdentifier"),!this.suppressValidationErr&&!s))throw new Error("Missing mandatory system identifier for SYSTEM notation");return{notationName:r,publicIdentifier:n,systemIdentifier:s,index:--a}}readIdentifierVal(e,a,t){let r="",i=e[a];if(i!=='"'&&i!=="'")throw new Error(`Expected quoted string, found "${i}"`);a++;let n=a;for(;a<e.length&&e[a]!==i;)a++;if(r=e.substring(n,a),e[a]!==i)throw new Error(`Unterminated ${t} value`);return a++,[a,r]}readElementExp(e,a){a=fe(e,a);let t=a;for(;a<e.length&&!/\s/.test(e[a]);)a++;let r=e.substring(t,a);if(!this.suppressValidationErr&&!Wt(r,{xmlVersion:this.xmlVersion}))throw new Error(`Invalid element name: "${r}"`);a=fe(e,a);let i="";if(e[a]==="E"&&ra(e,"MPTY",a))a+=4;else if(e[a]==="A"&&ra(e,"NY",a))a+=2;else if(e[a]==="("){a++;let n=a;for(;a<e.length&&e[a]!==")";)a++;if(i=e.substring(n,a),e[a]!==")")throw new Error("Unterminated content model")}else if(!this.suppressValidationErr)throw new Error(`Invalid Element Expression, found "${e[a]}"`);return{elementName:r,contentModel:i.trim(),index:a}}readAttlistExp(e,a){a=fe(e,a);let t=a;for(;a<e.length&&!/\s/.test(e[a]);)a++;let r=e.substring(t,a);for(eo(r,{xmlVersion:this.xmlVersion}),a=fe(e,a),t=a;a<e.length&&!/\s/.test(e[a]);)a++;let i=e.substring(t,a);if(!eo(i,{xmlVersion:this.xmlVersion}))throw new Error(`Invalid attribute name: "${i}"`);a=fe(e,a);let n="";if(e.substring(a,a+8).toUpperCase()==="NOTATION"){if(n="NOTATION",a+=8,a=fe(e,a),e[a]!=="(")throw new Error(`Expected '(', found "${e[a]}"`);a++;let c=[];for(;a<e.length&&e[a]!==")";){let l=a;for(;a<e.length&&e[a]!=="|"&&e[a]!==")";)a++;let d=e.substring(l,a);if(d=d.trim(),!eo(d,{xmlVersion:this.xmlVersion}))throw new Error(`Invalid notation name: "${d}"`);c.push(d),e[a]==="|"&&(a++,a=fe(e,a))}if(e[a]!==")")throw new Error("Unterminated list of notations");a++,n+=" ("+c.join("|")+")"}else{let c=a;for(;a<e.length&&!/\s/.test(e[a]);)a++;n+=e.substring(c,a);let l=["CDATA","ID","IDREF","IDREFS","ENTITY","ENTITIES","NMTOKEN","NMTOKENS"];if(!this.suppressValidationErr&&!l.includes(n.toUpperCase()))throw new Error(`Invalid attribute type: "${n}"`)}a=fe(e,a);let s="";return e.substring(a,a+8).toUpperCase()==="#REQUIRED"?(s="#REQUIRED",a+=8):e.substring(a,a+7).toUpperCase()==="#IMPLIED"?(s="#IMPLIED",a+=7):[a,s]=this.readIdentifierVal(e,a,"ATTLIST"),{elementName:r,attributeName:i,attributeType:n,defaultValue:s,index:a}}},fe=(o,e)=>{for(;e<o.length&&/\s/.test(o[e]);)e++;return e}});var Ll,$o,zo,mn,gn,Ca,Fl,Ho,hn=O(()=>{m();Ll=[48,1632,1776,2406,2534,2662,2790,2918,3046,3174,3302,3430,3558,3664,3792,3872,4160,4240,6112,6160,6470,6608,6784,6800,6992,7088,7232,7248,65296,120782,120792,120802,120812,120822,66720,68912,69734,69872,69942,70096,70384,70736,70864,71248,71360,71472,71904,72016,72688,72784,73040,73120,73552,92768,92864,93008,123200,123632,124144,125264,130032],$o=255,zo=new Map,mn=65535,gn=1632,Ca=gn,Fl=mn-gn+1,Ho=new Uint8Array(Fl).fill($o);for(let o of Ll)for(let e=0;e<10;e++){let a=o+e;a<=mn?Ho[a-Ca]=e:zo.set(a,e)}});function Dl(o){if(typeof o!="string")return o;let e=o.length;if(e===0)return o;let a=-1;for(let r=0;r<e;r++){let i=o.charCodeAt(r);if(!(i>=vn&&i<=bn||i===xn)){if(i<Ca){if(Go.has(i)){a=r;break}continue}if(i>=55296&&i<=56319){if(r+1<e){let n=o.charCodeAt(r+1);if(n>=56320&&n<=57343){let s=65536+(i-55296<<10)+(n-56320);if(zo.has(s)){a=r;break}}}continue}if(Ho[i-Ca]!==$o||Go.has(i)){a=r;break}}}if(a===-1)return o;let t=[];a>0&&t.push(o.slice(0,a));for(let r=a;r<e;r++){let i=o.charCodeAt(r);if(i>=vn&&i<=bn||i===xn){t.push(o[r]);continue}if(i<Ca){t.push(Go.has(i)?"-":o[r]);continue}if(i>=55296&&i<=56319){if(r+1<e){let s=o.charCodeAt(r+1);if(s>=56320&&s<=57343){let c=65536+(i-55296<<10)+(s-56320),l=zo.get(c);if(l!==void 0){t.push(String.fromCharCode(l+48)),r++;continue}}}t.push(o[r]);continue}if(Go.has(i)){t.push("-");continue}let n=Ho[i-Ca];t.push(n!==$o?String.fromCharCode(n+48):o[r])}return t.join("")}var vn,bn,xn,Go,An,En=O(()=>{"use strict";m();hn();vn=48,bn=57,xn=45,Go=new Set([8722,65293,65123]);An=Dl});function Yt(o,e={}){if(e=Object.assign({},Vl,e),!o||typeof o!="string")return o;let a=o.trim();if(a.length===0)return o;if(e.skipLike!==void 0&&e.skipLike.test(a))return o;if(a==="0"||e.unicode&&(a=An(a),a==="0"))return 0;if(e.hex&&Pl.test(a))return Zt(a,16);if(e.binary&&ql.test(a))return Zt(a,2);if(e.octal&&Bl.test(a))return Zt(a,8);if(isFinite(a)){if(a.includes("e")||a.includes("E"))return kl(o,a,e);{let t=jl.exec(a);if(t){let r=t[1]||"",i=t[2],n=$l(t[3]),s=r?o[i.length+1]===".":o[i.length]===".";if(!e.leadingZeros&&(i.length>1||i.length===1&&!s))return o;{let c=Number(a),l=String(c);if(c===0)return c;if(l.search(/[eE]/)!==-1)return e.eNotation?c:o;if(a.indexOf(".")!==-1)return l==="0"||l===n||l===`${r}${n}`?c:o;let d=i?n:a;return i?d===l||r+d===l?c:o:d===l||d===r+l?c:o}}else return o}}else return zl(o,Number(a),e)}function kl(o,e,a){if(!a.eNotation)return o;let t=e.match(Ul);if(t){let r=t[1]||"",i=t[3].indexOf("e")===-1?"E":"e",n=t[2],s=r?o[n.length+1]===i:o[n.length]===i;return n.length>1&&s?o:n.length===1&&(t[3].startsWith(`.${i}`)||t[3][0]===i)?Number(e):n.length>0?a.leadingZeros&&!s?(e=(t[1]||"")+t[3],Number(e)):o:Number(e)}else return o}function $l(o){if(o&&o.indexOf(".")!==-1){let e=o.length;for(;e>0&&o.charCodeAt(e-1)===48;)e--;return o=o.slice(0,e),o==="."?o="0":o[0]==="."?o="0"+o:o[o.length-1]==="."&&(o=o.substring(0,o.length-1)),o}return o}function Zt(o,e){let a=o.trim();if((e===2||e===8)&&(o=a.substring(2)),parseInt)return parseInt(o,e);if(Number.parseInt)return Number.parseInt(o,e);if(window&&window.parseInt)return window.parseInt(o,e);throw new Error("parseInt, Number.parseInt, window.parseInt are not supported")}function zl(o,e,a){let t=e===1/0;switch(a.infinity.toLowerCase()){case"null":return null;case"infinity":return e;case"string":return t?"Infinity":"-Infinity";default:return o}}var Pl,ql,Bl,jl,Vl,Ul,Cn=O(()=>{m();En();Pl=/^[-+]?0x[a-fA-F0-9]+$/,ql=/^0b[01]+$/,Bl=/^0o[0-7]+$/,jl=/^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/,Vl={hex:!0,binary:!1,octal:!1,leadingZeros:!0,decimalPoint:".",eNotation:!0,infinity:"original",unicode:!1};Ul=/^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/});function Kt(o){return typeof o=="function"?o:Array.isArray(o)?e=>{for(let a of o)if(typeof a=="string"&&e===a||a instanceof RegExp&&a.test(e))return!0}:()=>!1}var In=O(()=>{m()});var ia,Nn=O(()=>{m();ia=class{constructor(e,a={},t){this.pattern=e,this.separator=a.separator||".",this.segments=this._parse(e),this.data=t,this._hasDeepWildcard=this.segments.some(r=>r.type==="deep-wildcard"),this._hasAttributeCondition=this.segments.some(r=>r.attrName!==void 0),this._hasPositionSelector=this.segments.some(r=>r.position!==void 0)}_parse(e){let a=[],t=0,r="";for(;t<e.length;)e[t]===this.separator?t+1<e.length&&e[t+1]===this.separator?(r.trim()&&(a.push(this._parseSegment(r.trim())),r=""),a.push({type:"deep-wildcard"}),t+=2):(r.trim()&&a.push(this._parseSegment(r.trim())),r="",t++):(r+=e[t],t++);return r.trim()&&a.push(this._parseSegment(r.trim())),a}_parseSegment(e){let a={type:"tag"},t=null,r=e,i=e.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);if(i&&(r=i[1]+i[3],i[2])){let d=i[2].slice(1,-1);d&&(t=d)}let n,s=r;if(r.includes("::")){let d=r.indexOf("::");if(n=r.substring(0,d).trim(),s=r.substring(d+2).trim(),!n)throw new Error(`Invalid namespace in pattern: ${e}`)}let c,l=null;if(s.includes(":")){let d=s.lastIndexOf(":"),u=s.substring(0,d).trim(),p=s.substring(d+1).trim();["first","last","odd","even"].includes(p)||/^nth\(\d+\)$/.test(p)?(c=u,l=p):c=s}else c=s;if(!c)throw new Error(`Invalid segment pattern: ${e}`);if(a.tag=c,n&&(a.namespace=n),t)if(t.includes("=")){let d=t.indexOf("=");a.attrName=t.substring(0,d).trim(),a.attrValue=t.substring(d+1).trim()}else a.attrName=t.trim();if(l){let d=l.match(/^nth\((\d+)\)$/);d?(a.position="nth",a.positionValue=parseInt(d[1],10)):a.position=l}return a}get length(){return this.segments.length}hasDeepWildcard(){return this._hasDeepWildcard}hasAttributeCondition(){return this._hasAttributeCondition}hasPositionSelector(){return this._hasPositionSelector}toString(){return this.pattern}}});var Ia,Rn=O(()=>{m();Ia=class{constructor(){this._byDepthAndTag=new Map,this._wildcardByDepth=new Map,this._deepWildcards=[],this._deepByTerminalTag=new Map,this._patterns=new Set,this._sealed=!1}add(e){if(this._sealed)throw new TypeError("ExpressionSet is sealed. Create a new ExpressionSet to add more expressions.");if(this._patterns.has(e.pattern))return this;if(this._patterns.add(e.pattern),e.hasDeepWildcard()){let i=e.segments[e.segments.length-1];if(i&&i.type!=="deep-wildcard"&&i.tag!=="*"){let n=i.tag;this._deepByTerminalTag.has(n)||this._deepByTerminalTag.set(n,[]),this._deepByTerminalTag.get(n).push(e)}else this._deepWildcards.push(e);return this}let a=e.length,r=e.segments[e.segments.length-1]?.tag;if(!r||r==="*")this._wildcardByDepth.has(a)||this._wildcardByDepth.set(a,[]),this._wildcardByDepth.get(a).push(e);else{let i=`${a}:${r}`;this._byDepthAndTag.has(i)||this._byDepthAndTag.set(i,[]),this._byDepthAndTag.get(i).push(e)}return this}addAll(e){for(let a of e)this.add(a);return this}has(e){return this._patterns.has(e.pattern)}get size(){return this._patterns.size}seal(){return this._sealed=!0,this}get isSealed(){return this._sealed}matchesAny(e){return this.findMatch(e)!==null}findMatch(e){let a=e.getDepth(),t=e.getCurrentTag(),r=`${a}:${t}`,i=this._byDepthAndTag.get(r);if(i){for(let c=0;c<i.length;c++)if(e.matches(i[c]))return i[c]}let n=this._wildcardByDepth.get(a);if(n){for(let c=0;c<n.length;c++)if(e.matches(n[c]))return n[c]}let s=this._deepByTerminalTag.get(t);if(s){for(let c=0;c<s.length;c++)if(e.matches(s[c]))return s[c]}for(let c=0;c<this._deepWildcards.length;c++)if(e.matches(this._deepWildcards[c]))return this._deepWildcards[c];return null}}});var er,Na,On=O(()=>{m();er=class{constructor(e){this._matcher=e}get separator(){return this._matcher.separator}getCurrentTag(){let e=this._matcher.path;return e.length>0?e[e.length-1].tag:void 0}getCurrentNamespace(){let e=this._matcher.path;return e.length>0?e[e.length-1].namespace:void 0}getAttrValue(e){let a=this._matcher.path;if(a.length!==0)return a[a.length-1].values?.[e]}hasAttr(e){let a=this._matcher.path;if(a.length===0)return!1;let t=a[a.length-1];return t.values!==void 0&&e in t.values}getAnyParentAttr(e){return this._matcher.getAnyParentAttr(e)}hasAnyParentAttr(e){return this._matcher.hasAnyParentAttr(e)}getPosition(){let e=this._matcher.path;return e.length===0?-1:e[e.length-1].position??0}getCounter(){let e=this._matcher.path;return e.length===0?-1:e[e.length-1].counter??0}getIndex(){return this.getPosition()}getDepth(){return this._matcher.path.length}toString(e,a=!0){return this._matcher.toString(e,a)}toArray(){return this._matcher.path.map(e=>e.tag)}matches(e){return this._matcher.matches(e)}matchesAny(e){return e.matchesAny(this._matcher)}},Na=class{constructor(e={}){this.separator=e.separator||".",this.path=[],this.siblingStacks=[],this._pathStringCache=null,this._view=new er(this),this._keptAttrs=[]}push(e,a=null,t=null,r=null){this._pathStringCache=null,this.path.length>0&&(this.path[this.path.length-1].values=void 0);let i=this.path.length,n=this.siblingStacks[i];n||(n={counts:new Map,total:0},this.siblingStacks[i]=n);let s=t?`${t}:${e}`:e,c=n.counts.get(s)||0,l=n.total;n.counts.set(s,c+1),n.total++;let d={tag:e,position:l,counter:c};t!=null&&(d.namespace=t),a!=null&&(d.values=a),this.path.push(d);let u=this.path.length,p=r!==null?r.keep:null;if(p!=null&&p.length>0&&a)for(let f=0;f<p.length;f++){let v=p[f];a[v]!==void 0&&this._keptAttrs.push({depth:u,name:v,value:a[v]})}}pop(){if(this.path.length===0)return;this._pathStringCache=null;let e=this.path.pop();this.siblingStacks.length>this.path.length+1&&(this.siblingStacks.length=this.path.length+1);let a=this.path.length+1;for(;this._keptAttrs.length>0&&this._keptAttrs[this._keptAttrs.length-1].depth>=a;)this._keptAttrs.pop();return e}updateCurrent(e){if(this.path.length>0){let a=this.path[this.path.length-1];e!=null&&(a.values=e)}}getCurrentTag(){return this.path.length>0?this.path[this.path.length-1].tag:void 0}getCurrentNamespace(){return this.path.length>0?this.path[this.path.length-1].namespace:void 0}getAttrValue(e){if(this.path.length!==0)return this.path[this.path.length-1].values?.[e]}hasAttr(e){if(this.path.length===0)return!1;let a=this.path[this.path.length-1];return a.values!==void 0&&e in a.values}getAnyParentAttr(e){let a=this._keptAttrs;for(let t=a.length-1;t>=0;t--)if(a[t].name===e)return a[t].value}hasAnyParentAttr(e){let a=this._keptAttrs;for(let t=a.length-1;t>=0;t--)if(a[t].name===e)return!0;return!1}getPosition(){return this.path.length===0?-1:this.path[this.path.length-1].position??0}getCounter(){return this.path.length===0?-1:this.path[this.path.length-1].counter??0}getIndex(){return this.getPosition()}getDepth(){return this.path.length}toString(e,a=!0){let t=e||this.separator;if(t===this.separator&&a===!0){if(this._pathStringCache!==null)return this._pathStringCache;let i=this.path.map(n=>n.namespace?`${n.namespace}:${n.tag}`:n.tag).join(t);return this._pathStringCache=i,i}return this.path.map(i=>a&&i.namespace?`${i.namespace}:${i.tag}`:i.tag).join(t)}toArray(){return this.path.map(e=>e.tag)}reset(){this._pathStringCache=null,this.path=[],this.siblingStacks=[],this._keptAttrs=[]}matches(e){let a=e.segments;return a.length===0?!1:e.hasDeepWildcard()?this._matchWithDeepWildcard(a):this._matchSimple(a)}_matchSimple(e){if(this.path.length!==e.length)return!1;for(let a=0;a<e.length;a++)if(!this._matchSegment(e[a],this.path[a],a===this.path.length-1))return!1;return!0}_matchWithDeepWildcard(e){let a=this.path.length-1,t=e.length-1;for(;t>=0&&a>=0;){let r=e[t];if(r.type==="deep-wildcard"){if(t--,t<0)return!0;let i=e[t],n=!1;for(let s=a;s>=0;s--)if(this._matchSegment(i,this.path[s],s===this.path.length-1)){a=s-1,t--,n=!0;break}if(!n)return!1}else{if(!this._matchSegment(r,this.path[a],a===this.path.length-1))return!1;a--,t--}}return t<0}_matchSegment(e,a,t){if(e.tag!=="*"&&e.tag!==a.tag||e.namespace!==void 0&&e.namespace!=="*"&&e.namespace!==a.namespace||e.attrName!==void 0&&(!t||!a.values||!(e.attrName in a.values)||e.attrValue!==void 0&&String(a.values[e.attrName])!==String(e.attrValue)))return!1;if(e.position!==void 0){if(!t)return!1;let r=a.counter??0;if(e.position==="first"&&r!==0)return!1;if(e.position==="odd"&&r%2!==1)return!1;if(e.position==="even"&&r%2!==0)return!1;if(e.position==="nth"&&r!==e.positionValue)return!1}return!0}matchesAny(e){return e.matchesAny(this)}snapshot(){return{path:this.path.map(e=>({...e})),siblingStacks:this.siblingStacks.map(e=>e&&{counts:new Map(e.counts),total:e.total}),keptAttrs:this._keptAttrs.map(e=>({...e}))}}restore(e){this._pathStringCache=null,this.path=e.path.map(a=>({...a})),this.siblingStacks=e.siblingStacks.map(a=>a&&{counts:new Map(a.counts),total:a.total}),this._keptAttrs=(e.keptAttrs||[]).map(a=>({...a}))}readOnly(){return this._view}}});var ar=O(()=>{m();Nn();On();Rn()});var Hl,Ra,or=O(()=>{m();Hl=[{id:"html-script-open",description:"<script opening tag",pattern:/<script[\s>/]/i},{id:"html-script-close",description:"<\/script closing tag",pattern:/<\/script[\s>]/i},{id:"html-javascript-protocol",description:"javascript: URI scheme (with optional whitespace/encoding)",pattern:/j[\t\n\r ]*a[\t\n\r ]*v[\t\n\r ]*a[\t\n\r ]*s[\t\n\r ]*c[\t\n\r ]*r[\t\n\r ]*i[\t\n\r ]*p[\t\n\r ]*t[\t\n\r ]*:/i},{id:"html-vbscript-protocol",description:"vbscript: URI scheme",pattern:/vbscript[\t\n\r ]*:/i},{id:"html-data-html",description:"data:text/html URI \u2014 can execute scripts in browsers",pattern:/data[\t\n\r ]*:[\t\n\r ]*text\/html/i},{id:"html-data-xhtml",description:"data:application/xhtml+xml URI",pattern:/data[\t\n\r ]*:[\t\n\r ]*application\/xhtml/i},{id:"html-data-svg",description:"data:image/svg+xml URI \u2014 can execute scripts",pattern:/data[\t\n\r ]*:[\t\n\r ]*image\/svg\+xml/i},{id:"html-inline-event-handler",description:"Inline event handler attributes: onclick=, onerror=, onload=, etc.",pattern:/\bon\w{1,30}\s*=/i},{id:"html-entity-obfuscated-script",description:"HTML-entity-encoded <script (e.g. &#x3C;script or &lt;script)",pattern:/(?:&#x0*3[Cc];?|&#0*60;?|&lt;)\s*script/i},{id:"html-entity-obfuscated-javascript",description:'HTML-entity-encoded javascript: (partial \u2014 catches common &#106; or &#x6a; for "j")',pattern:/(?:&#x0*6[Aa];?|&#0*106;?)\s*(?:&#x0*61;?|a)[\s\S]{0,80}script\s*:/i},{id:"html-style-expression",description:"CSS expression() \u2014 IE-era code execution in style attributes",pattern:/style[\s\S]{0,20}expression\s*\(/i},{id:"html-object-embed",description:"<object or <embed tags that can load active content",pattern:/<(?:object|embed)[\s>/]/i},{id:"html-base-tag",description:"<base href= \u2014 can hijack all relative URLs on a page",pattern:/<base[\s>]/i},{id:"html-meta-refresh",description:'<meta http-equiv="refresh" \u2014 can redirect users',pattern:/<meta[\s\S]{0,40}http-equiv[\s\S]{0,20}refresh/i},{id:"html-srcdoc",description:"srcdoc= attribute on iframes \u2014 embeds HTML that can run scripts",pattern:/srcdoc\s*=/i},{id:"html-iframe",description:"<iframe tag",pattern:/<iframe[\s>/]/i},{id:"html-form",description:"<form tag \u2014 can be used for phishing / credential harvesting injection",pattern:/<form[\s>/]/i}],Ra=Hl});var Gl,Oa,tr=O(()=>{m();Gl=[{id:"xml-cdata-injection",description:"CDATA section injection: <![CDATA[ breaks out of text node context",pattern:/<!\[CDATA\[/i},{id:"xml-cdata-close",description:"CDATA close sequence: ]]> can terminate an enclosing CDATA section",pattern:/\]\]>/},{id:"xml-processing-instruction",description:"XML processing instruction: <?xml-stylesheet or <?php etc.",pattern:/<\?(?:xml[\- ]|php|asp)/i},{id:"xml-doctype-injection",description:"DOCTYPE declaration embedded in content \u2014 can define entities",pattern:/<!DOCTYPE(?:[\s[]|$)/i},{id:"xml-entity-system",description:"SYSTEM keyword \u2014 used in external entity declarations (XXE)",pattern:/\bSYSTEM\s+["']/i},{id:"xml-entity-public",description:"PUBLIC keyword \u2014 used in external entity declarations (XXE)",pattern:/\bPUBLIC\s+["']/i},{id:"xml-entity-declaration",description:"<!ENTITY declaration \u2014 defines entities, potential XXE or entity expansion",pattern:/<!ENTITY[\s%]/i},{id:"xml-billion-laughs",description:"Entity reference chaining / billion laughs: repeated &eX; style references",pattern:/(?:&\w{1,20};){3,}/},{id:"xml-namespace-confusion",description:"xmlns: attribute injection \u2014 can redefine namespaces to confuse parsers",pattern:/\bxmlns(?::\w{1,40})?\s*=/i},{id:"xml-comment-injection",description:"<!-- comment injection \u2014 can hide content from some parsers",pattern:/<!--/},{id:"xml-comment-close",description:"--> closes an enclosing XML comment",pattern:/-->/},{id:"xml-pi-close",description:"?> closes an enclosing processing instruction",pattern:/\?>/}],Oa=Gl});var Xl,rr,yn=O(()=>{m();Xl=[{id:"svg-script-element",description:"<script element inside SVG executes JavaScript",pattern:/<script[\s>/]/i},{id:"svg-xlink-href-javascript",description:"xlink:href with javascript: \u2014 classic SVG XSS via <a> or <use>",pattern:/xlink\s*:\s*href\s*=\s*["']?\s*javascript\s*:/i},{id:"svg-href-javascript",description:"href= with javascript: in SVG context (<a>, <animate>, etc.)",pattern:/href\s*=\s*["']?\s*javascript\s*:/i},{id:"svg-foreignobject",description:"<foreignObject embeds HTML inside SVG \u2014 can execute scripts",pattern:/<foreignObject[\s>/]/i},{id:"svg-use-external",description:"<use xlink:href or href pointing to external resource (non-fragment URL)",pattern:/<use[\s\S]{0,60}(?:xlink\s*:\s*)?href\s*=\s*(?:["'][^#]|[^"'#\s>])/i},{id:"svg-animate-href",description:'<animate attributeName="href" \u2014 can dynamically change href to javascript:',pattern:/<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*href["']/i},{id:"svg-animate-xlinkhref",description:'<animate attributeName="xlink:href"',pattern:/<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*xlink\s*:\s*href["']/i},{id:"svg-set-javascript",description:'<set to="javascript:..." \u2014 sets an attribute to a javascript: URI',pattern:/<set[\s\S]{0,80}to\s*=\s*["']?\s*javascript\s*:/i},{id:"svg-event-handler",description:"SVG-specific event handler attributes: onload=, onerror=, onactivate=, etc.",pattern:/\bon(?:load|error|activate|begin|end|repeat|focus|blur|click|mouse\w{1,20}|key\w{1,20})\s*=/i},{id:"svg-handler-generic",description:"Generic on* handler catch-all for SVG attributes",pattern:/\bon\w{1,30}\s*=/i},{id:"svg-filter-feimage",description:"<feImage href= \u2014 filter primitive that can load external resources",pattern:/<feImage[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=/i},{id:"svg-image-external",description:"<image xlink:href with http/https or javascript protocol",pattern:/<image[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=\s*["']?\s*(?:https?|javascript)\s*:/i},{id:"svg-style-javascript",description:"style= attribute containing javascript: (e.g. background:url(javascript:...))",pattern:/style\s*=[\s\S]{0,60}javascript\s*:/i}],rr=Xl});var Ql,oo,ir=O(()=>{m();Ql=[{id:"sql-block-comment-open",description:"SQL block comment open: /* ... */ \u2014 unusual in legitimate user text",pattern:/\/\*/},{id:"sql-union-select",description:"UNION SELECT \u2014 most common SQL injection aggregation attack",pattern:/\bUNION\s{1,20}(?:ALL\s{1,20})?SELECT\b/i},{id:"sql-drop-table",description:"DROP TABLE \u2014 destructive DDL injection",pattern:/\bDROP\s{1,20}TABLE\b/i},{id:"sql-drop-database",description:"DROP DATABASE \u2014 destructive DDL injection",pattern:/\bDROP\s{1,20}DATABASE\b/i},{id:"sql-insert-into",description:"INSERT INTO \u2014 data injection",pattern:/\bINSERT\s{1,20}INTO\b/i},{id:"sql-delete-from",description:"DELETE FROM \u2014 data deletion injection",pattern:/\bDELETE\s{1,20}FROM\b/i},{id:"sql-update-set",description:"UPDATE ... SET \u2014 data modification injection",pattern:/\bUPDATE\b[\s\S]{1,60}\bSET\b/i},{id:"sql-exec-xp",description:"EXEC xp_ \u2014 MSSQL extended stored procedure execution",pattern:/\bEXEC(?:UTE)?\s{1,20}xp_/i},{id:"sql-tautology-string",description:`Classic string tautology: ' OR '1'='1 or " OR "1"="1"`,pattern:/'\s{0,10}OR\s{0,10}'[^']{0,20}'\s*=\s*'[^']{0,20}/i},{id:"sql-tautology-numeric",description:"Numeric tautology: OR 1=1",pattern:/\bOR\s{1,10}1\s*=\s*1\b/i},{id:"sql-always-true-zero",description:"Numeric tautology: OR 0=0",pattern:/\bOR\s{1,10}0\s*=\s*0\b/i},{id:"sql-sleep-benchmark",description:"Time-based blind injection: SLEEP() or BENCHMARK()",pattern:/\b(?:SLEEP|BENCHMARK)\s*\(/i},{id:"sql-waitfor-delay",description:"MSSQL time-based blind injection: WAITFOR DELAY",pattern:/\bWAITFOR\s{1,20}DELAY\b/i},{id:"sql-char-function",description:"CHAR() function \u2014 used to obfuscate injected strings",pattern:/\bCHAR\s*\(\s*\d{1,3}/i},{id:"sql-information-schema",description:"INFORMATION_SCHEMA \u2014 reconnaissance query for table/column enumeration",pattern:/\bINFORMATION_SCHEMA\b/i}],oo=Ql});var Jl,nr,Sn=O(()=>{m();Jl=[{id:"shell-path-traversal-unix",description:"Unix path traversal: ../  \u2014 climbing the directory tree",pattern:/\.\.\//},{id:"shell-path-traversal-windows",description:"Windows path traversal: ..\\ \u2014 climbing the directory tree",pattern:/\.\.\\/},{id:"shell-path-traversal-encoded",description:"URL-encoded path traversal: %2e%2e or %2f variants",pattern:/%2e%2e|%2f\.\.|\.\.%2f/i},{id:"shell-null-byte",description:"Null byte injection: \\x00 or %00 \u2014 truncates strings in C-backed functions",pattern:/\x00|%00/},{id:"shell-semicolon",description:"Semicolon command separator: cmd1; cmd2",pattern:/;/},{id:"shell-pipe",description:"Pipe operator: cmd1 | cmd2",pattern:/\|/},{id:"shell-and-operator",description:"AND operator: cmd1 && cmd2",pattern:/&&/},{id:"shell-or-operator",description:"OR operator: cmd1 || cmd2",pattern:/\|\|/},{id:"shell-backtick",description:"Backtick command substitution: `cmd`",pattern:/`/},{id:"shell-dollar-paren",description:"Dollar-paren command substitution: $(cmd)",pattern:/\$\(/},{id:"shell-dollar-brace",description:"Dollar-brace variable expansion: ${var} \u2014 can be abused for injection",pattern:/\$\{/},{id:"shell-redirect-out",description:"Output redirection: cmd > file or cmd >> file",pattern:/>{1,2}/},{id:"shell-redirect-in",description:"Input redirection: cmd < file",pattern:/</},{id:"shell-newline-injection",description:"Newline injection: \\n or \\r \u2014 can inject new shell commands",pattern:/[\n\r]/},{id:"shell-glob-star",description:"Glob expansion: * or ? \u2014 can expand to unintended files",pattern:/[/\\][*?]/},{id:"shell-absolute-root",description:"Absolute root path injection: string starting with / or \\ (Windows UNC)",pattern:/^(?:\/|\\\\)/},{id:"shell-windows-drive",description:"Windows drive letter path injection: C:\\ or D:/",pattern:/^[a-zA-Z]:[/\\]/},{id:"shell-curl-wget",description:"curl/wget with URL or flags \u2014 can exfiltrate data or download payloads",pattern:/\b(?:curl|wget)\s+(?:https?:\/\/|ftp:\/\/|-)/i}],nr=Jl});var Wl,sr,wn=O(()=>{m();Wl=[{id:"redos-nested-quantifier-plus",description:"Nested + quantifier inside a group with outer quantifier: (a+)+, (.+b)*, etc.",pattern:/\([^)]*\+[^)]*\)[+*]/},{id:"redos-nested-quantifier-star",description:"Nested * quantifier: (a*)* or (a*)+ \u2014 catastrophic backtracking",pattern:/\([^)]*\*[^)]*\)[*+]/},{id:"redos-nested-groups",description:"Doubly nested quantified groups: ((a+)+) \u2014 guaranteed catastrophic",pattern:/\(\([^)]{0,40}\)[+*]\)[+*]/},{id:"redos-alternation-overlap",description:"Overlapping alternation under quantifier: (a|a)+ \u2014 ambiguous NFA paths",pattern:/\(([^|()]{1,20})\|(?:\1)(?:\|[^|()]{1,20}){0,5}\)[+*?]{1,2}/},{id:"redos-star-plus-concat",description:"(x*x)+ pattern \u2014 triggers super-linear backtracking",pattern:/\([^)]{0,10}\*[^)]{0,10}\)[+*]/},{id:"redos-dot-star-greedy",description:"(.*){n,} or (.+){n,} \u2014 repeated greedy dot quantifiers",pattern:/\(\.[*+]\)\{?\d/},{id:"redos-large-repetition",description:"Very large fixed or range repetition count {1000,} or {1000,n} \u2014 denial of service via backtracking",pattern:/\{\d{4,}(?:,\d*)?\}/},{id:"redos-catastrophic-alternation",description:"Long alternation with many similar branches \u2014 polynomial backtracking risk",pattern:/\([^)]{0,200}(?:\|[^|)]{0,50}){9,}\)/}],sr=Wl});var be,Zl,cr,Tn=O(()=>{m();be=`["'\\s]*:`,Zl=[{id:"nosql-where-operator",description:"$where \u2014 executes arbitrary JavaScript server-side in MongoDB",pattern:new RegExp(`\\$where${be}`,"i")},{id:"nosql-ne-operator",description:'$ne \u2014 "not equal" operator used to bypass equality checks',pattern:new RegExp(`\\$ne${be}`,"i")},{id:"nosql-gt-operator",description:'$gt \u2014 "greater than" used to bypass password/value checks',pattern:new RegExp(`\\$gte?${be}`,"i")},{id:"nosql-lt-operator",description:'$lt / $lte \u2014 "less than" bypass variants',pattern:new RegExp(`\\$lte?${be}`,"i")},{id:"nosql-regex-operator",description:"$regex \u2014 can be used to extract data character by character (blind injection)",pattern:new RegExp(`\\$regex${be}`,"i")},{id:"nosql-or-operator",description:"$or \u2014 logical OR; used to create always-true conditions",pattern:new RegExp(`\\$or${be}\\s*\\[`,"i")},{id:"nosql-and-operator",description:"$and \u2014 logical AND operator injection",pattern:new RegExp(`\\$and${be}\\s*\\[`,"i")},{id:"nosql-nor-operator",description:"$nor \u2014 logical NOR operator injection",pattern:new RegExp(`\\$nor${be}\\s*\\[`,"i")},{id:"nosql-exists-operator",description:"$exists \u2014 can enumerate fields to determine schema",pattern:new RegExp(`\\$exists${be}`,"i")},{id:"nosql-in-operator",description:"$in \u2014 matches any value in a list; can enumerate values",pattern:new RegExp(`\\$in${be}\\s*\\[`,"i")},{id:"nosql-expr-operator",description:"$expr \u2014 allows aggregation expressions in queries (MongoDB 3.6+)",pattern:new RegExp(`\\$expr${be}`,"i")},{id:"nosql-function-operator",description:"$function \u2014 executes arbitrary JavaScript in MongoDB 4.4+",pattern:new RegExp(`\\$function${be}`,"i")},{id:"nosql-accumulator-operator",description:"$accumulator \u2014 custom aggregation with arbitrary JS execution",pattern:new RegExp(`\\$accumulator${be}`,"i")},{id:"nosql-proto-pollution",description:"__proto__ \u2014 prototype pollution via object key injection",pattern:/__proto__/},{id:"nosql-constructor-prototype",description:"constructor.prototype \u2014 alternative prototype pollution vector (dot notation or JSON key)",pattern:/constructor[\s"':.,{\[]*prototype/i},{id:"nosql-proto-bracket",description:'["__proto__"] \u2014 bracket-notation prototype pollution',pattern:/\[["']__proto__["']\]/}],cr=Zl});var Yl,lr,_n=O(()=>{m();Yl=[{id:"log-crlf-injection",description:"CRLF injection: literal \\r or \\n embeds fake log lines",pattern:/[\r\n]/},{id:"log-url-encoded-crlf",description:"URL-encoded CRLF: %0d, %0a, %0D, %0A \u2014 decoded by some log parsers",pattern:/%0[dDaA]/},{id:"log-unicode-newline",description:"Unicode newline variants: U+2028 (line separator), U+2029 (paragraph separator)",pattern:/[\u2028\u2029]/},{id:"log-log4shell-jndi",description:"Log4Shell: ${jndi:...} triggers remote code execution in Apache Log4j",pattern:/\$\{jndi\s*:/i},{id:"log-log4shell-obfuscated",description:"Obfuscated Log4Shell: ${::-j}... lookup-bypass prefix used to evade WAF detection",pattern:/\$\{::-/},{id:"log-log4j-lookup",description:"Log4j lookup syntax: ${env:...}, ${sys:...}, ${ctx:...} \u2014 data exfiltration",pattern:/\$\{(?:env|sys|ctx|main|map|sd|web|docker|k8s|spring)\s*:/i},{id:"log-ssti-double-brace",description:"SSTI double-brace: {{expression}} \u2014 Jinja2, Twig, Handlebars, etc.",pattern:/\{\{[\s\S]{0,80}\}\}/},{id:"log-ssti-hash-brace",description:"SSTI hash-brace: #{expression} \u2014 Thymeleaf, Velocity, Ruby ERB",pattern:/#\{[\s\S]{0,80}\}/},{id:"log-ssti-dollar-brace",description:"SSTI/EL injection: ${expression with operators or method calls} \u2014 JSP EL, Freemarker, SpEL",pattern:/\$\{[^}]*(?:\.|\(|\*|\+|\bclass\b|\bruntime\b|\bprocess\b|\bexec\b)[^}]{0,80}\}/i},{id:"log-ssti-percent-tag",description:"SSTI ERB/ASP tag: <%= expression %> \u2014 Ruby ERB, ASP",pattern:/<%=[\s\S]{0,80}%>/},{id:"log-null-byte",description:"Null byte: \\x00 or %00 \u2014 can truncate log entries in C-backed loggers",pattern:/\x00|%00/},{id:"log-ansi-escape",description:"ANSI escape sequence: ESC[ \u2014 can manipulate terminal output when logs are tailed",pattern:/\x1b\[/}],lr=Yl});var Kl,ed,dr,Mn=O(()=>{m();ir();Kl=[{id:"sql-line-comment",description:"SQL line comment: -- followed by whitespace or end of string",pattern:/--(?:\s|$)/},{id:"sql-stacked-query",description:"Stacked queries: semicolon immediately followed by a SQL keyword",pattern:/;\s{0,10}(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b/i},{id:"sql-hex-encoding",description:"Hex-encoded string injection: 0x41414141 style (MySQL)",pattern:/\b0x[0-9a-f]{4,}/i}],ed=[...oo,...Kl],dr=ed});function ad(o){if(typeof o!="string")throw new TypeError(`is-unsafe: first argument must be a string, got ${typeof o}`)}function od(o){if(!(o instanceof RegExp)){if(Array.isArray(o)){if(o.length===0)throw new TypeError("is-unsafe: context must not be an empty array");if(Array.isArray(o[0])){for(let e of o)if(!Array.isArray(e)||e.length===0)throw new TypeError("is-unsafe: each context in the array must be a non-empty pattern array (PatternList)")}return}throw new TypeError(`is-unsafe: second argument must be a PatternList (e.g. HTML), an array of PatternLists (e.g. [HTML, XML]), or a RegExp. Got: ${typeof o}`)}}function td(o){return o instanceof RegExp?{lists:null,regex:o}:Array.isArray(o[0])?{lists:o,regex:null}:{lists:[o],regex:null}}function rd(o,e){let a=e.label??"CUSTOM";for(let t of e)if(t.pattern.test(o))return{context:a,id:t.id,description:t.description,pattern:t.pattern};return null}function Ln(o,e){ad(o),od(e);let{lists:a,regex:t}=td(e);if(t)return t.test(o);for(let r of a)if(rd(o,r)!==null)return!0;return!1}var hm,Fn=O(()=>{m();or();tr();Mn();or();tr();yn();ir();Sn();wn();Tn();_n();Ra.label="HTML";Oa.label="XML";rr.label="SVG";oo.label="SQL";dr.label="SQL-STRICT";nr.label="SHELL";sr.label="REDOS";cr.label="NOSQL";lr.label="LOG";hm=Object.freeze({HTML:Ra,XML:Oa,SVG:rr,SQL:oo,"SQL-STRICT":dr,SHELL:nr,REDOS:sr,NOSQL:cr,LOG:lr})});function id(o,e){if(!o)return{};let a=e.attributesGroupName?o[e.attributesGroupName]:o;if(!a)return{};let t={};for(let r in a)if(r.startsWith(e.attributeNamePrefix)){let i=r.substring(e.attributeNamePrefix.length);t[i]=a[r]}else t[r]=a[r];return t}function nd(o){if(!o||typeof o!="string")return;let e=o.indexOf(":");if(e!==-1&&e>0){let a=o.substring(0,e);if(a!=="xmlns")return a}}function sd(o,e,a,t,r,i,n){let s=this.options;if(o!==void 0&&(s.trimValues&&!t&&(o=o.trim()),o.length>0)){n||(o=this.replaceEntitiesValue(o,e,a));let c=s.jPath?a.toString():a,l=s.tagValueProcessor(e,o,c,r,i);return l==null?o:typeof l!=typeof o||l!==o?l:s.trimValues||o.trim()===o?fr(o,s.parseTagValue,s.numberParseOptions):o}}function cd(o){if(this.options.removeNSPrefix){let e=o.split(":"),a=o.charAt(0)==="/"?"/":"";if(e[0]==="xmlns")return"";e.length===2&&(o=a+e[1])}return o}function dd(o,e,a,t=!1){let r=this.options;if(t===!0||r.ignoreAttributes!==!0&&typeof o=="string"){let i=Qi(o,ld),n=i.length,s={},c=new Array(n),l=!1,d={};for(let f=0;f<n;f++){let v=this.resolveNameSpace(i[f][1]),C=i[f][4];if(v.length&&C!==void 0){let S=C;r.trimValues&&(S=S.trim()),S=this.replaceEntitiesValue(S,a,this.readonlyMatcher),c[f]=S,d[v]=S,l=!0}}l&&typeof e=="object"&&e.updateCurrent&&e.updateCurrent(d);let u=r.jPath?e.toString():this.readonlyMatcher,p=!1;for(let f=0;f<n;f++){let v=this.resolveNameSpace(i[f][1]);if(this.ignoreAttributesFn(v,u))continue;let C=r.attributeNamePrefix+v;if(v.length)if(r.transformAttributeName&&(C=r.transformAttributeName(C)),C=Dn(C,r),i[f][4]!==void 0){let S=c[f],y=r.attributeValueProcessor(v,S,u);y==null?s[C]=S:typeof y!=typeof S||y!==S?s[C]=y:s[C]=fr(S,r.parseAttributeValue,r.numberParseOptions),p=!0}else r.allowBooleanAttributes&&(s[C]=!0,p=!0)}if(!p)return;if(r.attributesGroupName&&!r.preserveOrder){let f={};return f[r.attributesGroupName]=s,f}return s}}function pd(o,e,a,t){this.options.captureMetaData||(t=void 0);let r=this.options.jPath?a.toString():a,i=this.options.updateTag(e.tagname,r,e[":@"]);i===!1||(typeof i=="string"&&(e.tagname=i),o.addChild(e,t))}function fd(o,e,a){let t=this.options.processEntities;if(!t||!t.enabled)return o;if(t.allowedTags){let r=this.options.jPath?a.toString():a;if(!(Array.isArray(t.allowedTags)?t.allowedTags.includes(e):t.allowedTags(e,r)))return o}if(t.tagFilter){let r=this.options.jPath?a.toString():a;if(!t.tagFilter(e,r))return o}return this.entityDecoder.decode(o)}function md(o,e,a,t){return o&&(t===void 0&&(t=e.child.length===0),o=this.parseTextData(o,e.tagname,a,!1,e[":@"]?Object.keys(e[":@"]).length!==0:!1,t),o!==void 0&&o!==""&&e.add(this.options.textNodeName,o),o=""),o}function gd(){return this.stopNodeExpressionsSet.size===0?!1:this.matcher.matchesAny(this.stopNodeExpressionsSet)}function hd(o,e,a=">"){let t=0,r=o.length,i=a.charCodeAt(0),n=a.length>1?a.charCodeAt(1):-1,s="",c=e;for(let l=e;l<r;l++){let d=o.charCodeAt(l);if(t)d===t&&(t=0);else if(d===34||d===39)t=d;else if(d===i)if(n!==-1){if(o.charCodeAt(l+1)===n)return s+=o.substring(c,l),{data:s,index:l}}else return s+=o.substring(c,l),{data:s,index:l};else d===9&&!t&&(s+=o.substring(c,l)+" ",c=l+1)}}function ya(o,e,a,t){let r=o.indexOf(e,a);if(r===-1)throw new Error(t);return r+e.length-1}function vd(o,e,a,t){let r=o.indexOf(e,a);if(r===-1)throw new Error(t);return r}function pr(o,e,a,t=">"){let r=hd(o,e+1,t);if(!r)return;let i=r.data,n=r.index,s=i.search(/\s/),c=i,l=!0;s!==-1&&(c=i.substring(0,s),i=i.substring(s+1).trimStart());let d=c;if(a){let u=c.indexOf(":");u!==-1&&(c=c.substr(u+1),l=c!==r.data.substr(u+1))}return{tagName:c,tagExp:i,closeIndex:n,attrExpPresent:l,rawTagName:d}}function bd(o,e,a){let t=a,r=1,i=o.length;for(;a<i;a++)if(o[a]==="<"){let n=o.charCodeAt(a+1);if(n===47){let s=vd(o,">",a,`${e} is not closed`);if(o.substring(a+2,s).trim()===e&&(r--,r===0))return{tagContent:o.substring(t,a),i:s};a=s}else if(n===63)a=ya(o,"?>",a+1,"StopNode is not closed.");else if(n===33&&o.charCodeAt(a+2)===45&&o.charCodeAt(a+3)===45)a=ya(o,"-->",a+3,"StopNode is not closed.");else if(n===33&&o.charCodeAt(a+2)===91)a=ya(o,"]]>",a,"StopNode is not closed.")-2;else{let s=pr(o,a,!1);s&&((s&&s.tagName)===e&&s.tagExp[s.tagExp.length-1]!=="/"&&r++,a=s.closeIndex)}}}function fr(o,e,a){if(e&&typeof o=="string"){let t=o.trim();return t==="true"?!0:t==="false"?!1:Yt(o,a)}else return Ji(o)?o:""}function ur(o,e,a,t){if(o){let r=o(e);a===e&&(a=r),e=r}return e=Dn(e,t),{tagName:e,tagExp:a}}function Dn(o,e){if(jo.includes(o))throw new Error(`[SECURITY] Invalid name: "${o}" is a reserved JavaScript keyword that could cause prototype pollution`);return Wa.includes(o)?e.onDangerousProperty(o):o}var to,ld,ud,Pn=O(()=>{"use strict";m();Vo();ko();fn();Cn();In();ar();ar();tn();Fn();to=class{constructor(e,a){this.options=e,this.currentNode=null,this.tagsNodeStack=[],this.parseXml=ud,this.parseTextData=sd,this.resolveNameSpace=cd,this.buildAttributesMap=dd,this.isItStopNode=gd,this.replaceEntitiesValue=fd,this.readStopNodeData=bd,this.saveTextToParentTag=md,this.addChild=pd,this.ignoreAttributesFn=Kt(this.options.ignoreAttributes),this.entityExpansionCount=0,this.currentExpandedLength=0,this.doctypefound=!1;let t={...Ya};this.options.entityDecoder?this.entityDecoder=this.options.entityDecoder:(typeof this.options.htmlEntities=="object"?t=this.options.htmlEntities:this.options.htmlEntities===!0&&(t={...Gt,...Ht}),this.entityDecoder=new Ea({namedEntities:{...t,...a},numericAllowed:this.options.htmlEntities,limit:{maxTotalExpansions:this.options.processEntities.maxTotalExpansions,maxExpandedLength:this.options.processEntities.maxExpandedLength,applyLimitsTo:this.options.processEntities.appliesTo},onInputEntity:(i,n)=>Ln(n,[Ra,Oa])?Aa.BLOCK:Aa.ALLOW})),this.matcher=new Na,this.readonlyMatcher=this.matcher.readOnly(),this.isCurrentNodeStopNode=!1,this.stopNodeExpressionsSet=new Ia;let r=this.options.stopNodes;if(r&&r.length>0){for(let i=0;i<r.length;i++){let n=r[i];typeof n=="string"?this.stopNodeExpressionsSet.add(new ia(n)):n instanceof ia&&this.stopNodeExpressionsSet.add(n)}this.stopNodeExpressionsSet.seal()}}};ld=new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`,"gm");ud=function(o){o=o.replace(/\r\n?/g,`
`);let e=new pe("!xml"),a=e,t="";this.matcher.reset(),this.entityDecoder.reset(),this.entityExpansionCount=0,this.currentExpandedLength=0,this.doctypefound=!1;let r=this.options,i=new ao(r.processEntities),n=o.length;for(let s=0;s<n;s++)if(o[s]==="<"){let l=o.charCodeAt(s+1);if(l===47){let d=ya(o,">",s,"Closing Tag is not closed."),u=o.substring(s+2,d).trim();if(r.removeNSPrefix){let f=u.indexOf(":");f!==-1&&(u=u.substr(f+1))}u=ur(r.transformTagName,u,"",r).tagName,a&&(t=this.saveTextToParentTag(t,a,this.readonlyMatcher));let p=this.matcher.getCurrentTag();if(u&&r.unpairedTagsSet.has(u))throw new Error(`Unpaired tag can not be used as closing tag: </${u}>`);p&&r.unpairedTagsSet.has(p)&&(this.matcher.pop(),this.tagsNodeStack.pop()),this.matcher.pop(),this.isCurrentNodeStopNode=!1,a=this.tagsNodeStack.pop()||e,r.captureMetaData&&a&&a.addEndIndex(d+1),t="",s=d}else if(l===63){let d=pr(o,s,!1,"?>");if(!d)throw new Error("Pi Tag is not closed.");t=this.saveTextToParentTag(t,a,this.readonlyMatcher);let u=this.buildAttributesMap(d.tagExp,this.matcher,d.tagName,!0);if(u){let p=u[this.options.attributeNamePrefix+"version"];this.entityDecoder.setXmlVersion(Number(p)||1),i.setXmlVersion(Number(p)||1)}if(!(r.ignoreDeclaration&&d.tagName==="?xml"||r.ignorePiTags)){let p=new pe(d.tagName);p.add(r.textNodeName,""),d.tagName!==d.tagExp&&d.attrExpPresent&&r.ignoreAttributes!==!0&&(p[":@"]=u),this.addChild(a,p,this.readonlyMatcher,s),r.captureMetaData&&a.addEndIndex(d.closeIndex+2)}s=d.closeIndex+1}else if(l===33&&o.charCodeAt(s+2)===45&&o.charCodeAt(s+3)===45){let d=ya(o,"-->",s+4,"Comment is not closed.");if(r.commentPropName){let u=o.substring(s+4,d-2);t=this.saveTextToParentTag(t,a,this.readonlyMatcher),a.add(r.commentPropName,[{[r.textNodeName]:u}])}s=d}else if(l===33&&o.charCodeAt(s+2)===68){if(this.doctypefound)throw new Error("Multiple DOCTYPE declarations found.");this.doctypefound=!0;let d=i.readDocType(o,s);this.entityDecoder.addInputEntities(d.entities),s=d.i}else if(l===33&&o.charCodeAt(s+2)===91){let d=ya(o,"]]>",s,"CDATA is not closed.")-2,u=o.substring(s+9,d);t=this.saveTextToParentTag(t,a,this.readonlyMatcher);let p=this.parseTextData(u,a.tagname,this.readonlyMatcher,!0,!1,!0,!0);p==null&&(p=""),r.cdataPropName?a.add(r.cdataPropName,[{[r.textNodeName]:u}]):a.add(r.textNodeName,p),s=d+2}else{let d=pr(o,s,r.removeNSPrefix);if(!d){let x=o.substring(Math.max(0,s-50),Math.min(n,s+50));throw new Error(`readTagExp returned undefined at position ${s}. Context: "${x}"`)}let u=d.tagName,p=d.rawTagName,f=d.tagExp,v=d.attrExpPresent,C=d.closeIndex;if({tagName:u,tagExp:f}=ur(r.transformTagName,u,f,r),r.strictReservedNames&&(u===r.commentPropName||u===r.cdataPropName||u===r.textNodeName||u===r.attributesGroupName))throw new Error(`Invalid tag name: ${u}`);a&&t&&a.tagname!=="!xml"&&(t=this.saveTextToParentTag(t,a,this.readonlyMatcher,!1));let S=a;S&&r.unpairedTagsSet.has(S.tagname)&&(a=this.tagsNodeStack.pop(),this.matcher.pop());let y=!1;f.length>0&&f.lastIndexOf("/")===f.length-1&&(y=!0,u[u.length-1]==="/"?(u=u.substr(0,u.length-1),f=u):f=f.substr(0,f.length-1),v=u!==f);let T=null,w={},_;_=nd(p),u!==e.tagname&&this.matcher.push(u,{},_),u!==f&&v&&(T=this.buildAttributesMap(f,this.matcher,u),T&&(w=id(T,r))),u!==e.tagname&&(this.isCurrentNodeStopNode=this.isItStopNode());let g=s;if(this.isCurrentNodeStopNode){let x="";if(y)s=d.closeIndex;else if(r.unpairedTagsSet.has(u))s=d.closeIndex;else{let I=this.readStopNodeData(o,p,C+1);if(!I)throw new Error(`Unexpected end of ${p}`);s=I.i,x=I.tagContent}let b=new pe(u);T&&(b[":@"]=T),b.add(r.textNodeName,x),this.matcher.pop(),this.isCurrentNodeStopNode=!1,this.addChild(a,b,this.readonlyMatcher,g),r.captureMetaData&&a.addEndIndex(s+1)}else{if(y){({tagName:u,tagExp:f}=ur(r.transformTagName,u,f,r));let x=new pe(u);T&&(x[":@"]=T),this.addChild(a,x,this.readonlyMatcher,g),r.captureMetaData&&a.addEndIndex(C+1),this.matcher.pop(),this.isCurrentNodeStopNode=!1}else if(r.unpairedTagsSet.has(u)){let x=new pe(u);T&&(x[":@"]=T),this.addChild(a,x,this.readonlyMatcher,g),r.captureMetaData&&a.addEndIndex(d.closeIndex+1),this.matcher.pop(),this.isCurrentNodeStopNode=!1,s=d.closeIndex;continue}else{let x=new pe(u);if(this.tagsNodeStack.length>r.maxNestedTags)throw new Error("Maximum nested tags exceeded");this.tagsNodeStack.push(a),T&&(x[":@"]=T),this.addChild(a,x,this.readonlyMatcher,g),a=x}t="",s=C}}}else t+=o[s];return e.child}});function xd(o,e){if(!o||typeof o!="object")return{};if(!e)return o;let a={};for(let t in o)if(t.startsWith(e)){let r=t.substring(e.length);a[r]=o[t]}else a[t]=o[t];return a}function gr(o,e,a,t){return qn(o,e,a,t)}function qn(o,e,a,t){let r,i={};for(let n=0;n<o.length;n++){let s=o[n],c=Ad(s);if(c!==void 0&&c!==e.textNodeName){let l=xd(s[":@"]||{},e.attributeNamePrefix);a.push(c,l)}if(c===e.textNodeName)r===void 0?r=s[c]:r+=""+s[c];else{if(c===void 0)continue;if(s[c]){let l=qn(s[c],e,a,t),d=Cd(l,e);if(Object.keys(l).length===0&&e.alwaysCreateTextNode&&(l[e.textNodeName]=""),s[":@"]?Ed(l,s[":@"],t,e):Object.keys(l).length===1&&l[e.textNodeName]!==void 0&&!e.alwaysCreateTextNode?l=l[e.textNodeName]:Object.keys(l).length===0&&(e.alwaysCreateTextNode?l[e.textNodeName]="":l=""),s[mr]!==void 0&&typeof l=="object"&&l!==null&&(l[mr]=s[mr]),i[c]!==void 0&&Object.prototype.hasOwnProperty.call(i,c))Array.isArray(i[c])||(i[c]=[i[c]]),i[c].push(l);else{let u=e.jPath?t.toString():t;e.isArray(c,u,d)?i[c]=[l]:i[c]=l}c!==void 0&&c!==e.textNodeName&&a.pop()}}}return typeof r=="string"?r.length>0&&(i[e.textNodeName]=r):r!==void 0&&(i[e.textNodeName]=r),i}function Ad(o){let e=Object.keys(o);for(let a=0;a<e.length;a++){let t=e[a];if(t!==":@")return t}}function Ed(o,e,a,t){if(e){let r=Object.keys(e),i=r.length;for(let n=0;n<i;n++){let s=r[n],c=s.startsWith(t.attributeNamePrefix)?s.substring(t.attributeNamePrefix.length):s,l=t.jPath?a.toString()+"."+c:a;t.isArray(s,l,!0,!0)?o[s]=[e[s]]:o[s]=e[s]}}}function Cd(o,e){let{textNodeName:a}=e,t=Object.keys(o).length;return!!(t===0||t===1&&(o[a]||typeof o[a]=="boolean"||o[a]===0))}var mr,Bn=O(()=>{"use strict";m();ko();mr=pe.getMetaDataSymbol()});var Sa,jn=O(()=>{m();cn();Pn();Bn();en();ko();Sa=class{constructor(e){this.externalEntities={},this.options=sn(e)}parse(e,a){if(typeof e!="string"&&e.toString)e=e.toString();else if(typeof e!="string")throw new Error("XML data is accepted in String or Bytes[] form.");if(a){a===!0&&(a={});let i=Ki(e,a);if(i!==!0)throw Error(`${i.err.msg}:${i.err.line}:${i.err.col}`)}let t=new to(this.options,this.externalEntities),r=t.parseXml(e);return this.options.preserveOrder||r===void 0?r:gr(r,this.options,t.matcher,t.readonlyMatcher)}addEntity(e,a){if(a.indexOf("&")!==-1)throw new Error("Entity value can't have '&'");if(e.indexOf("&")!==-1||e.indexOf(";")!==-1)throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");if(a==="&")throw new Error("An entity with value '&' is not permitted");this.externalEntities[e]=a}static getMetaDataSymbol(){return pe.getMetaDataSymbol()}}});var Vn=O(()=>{"use strict";m();jn()});function hr(o){return o==null?[]:Array.isArray(o)?o:[o]}function j(o){if(o==null)return null;let e=String(typeof o=="object"?o["#text"]??"":o).trim();return e===""?null:e}function qe(o){let e=j(o);if(e===null)return null;let a=Number(e.replace(",","."));return Number.isFinite(a)?a:null}function Xo(o,e){let a=j(o);if(a===null)return null;let t=a.replace(/\D/g,"");return t===""?null:t.length>=e?t.slice(-e):t.padStart(e,"0")}function P(o,e){if(o===null||typeof o!="object")return;let a=o;if(a[e]!==void 0)return a[e];for(let t of Object.keys(a))for(let r of hr(a[t])){let i=P(r,e);if(i!==void 0)return i}}function ro(o,e){let a={documentos:[],cancelamentos:new Set,ignorados:[]},t;try{t=Id.parse(o)}catch(y){return{...a,ignorados:[{arquivo:e,motivo:`XML inv\xE1lido: ${y.message}`}]}}let r=P(t,"infEvento");if(r&&!P(t,"infNFe")){let y=j(P(r,"tpEvento")),T=j(P(r,"chNFe")),w=j(P(t,"cStat")),_=w===null||["135","136","155"].includes(w);return y==="110111"&&T&&_?{...a,cancelamentos:new Set([T])}:{...a,ignorados:[{arquivo:e,motivo:`evento ${y??"?"} sem efeito sobre o c\xE1lculo`}]}}let i=P(t,"infNFe");if(!i)return{...a,ignorados:[{arquivo:e,motivo:"n\xE3o \xE9 NF-e/NFC-e nem evento"}]};let n=hr(i)[0],s=P(n,"ide")??{},c=P(n,"emit")??{},l=P(n,"dest")??{},d=P(t,"protNFe"),u=[],f=j(n["@Id"])?.replace(/^NFe/i,"")??null??j(P(d,"chNFe"));f||u.push("documento sem chave de acesso"),d||u.push("XML sem protocolo de autoriza\xE7\xE3o");let v=j(s.tpNF),C=hr(n.det).map((y,T)=>{let w=y.prod??{},_=P(y.imposto,"IBSCBS"),g=_?P(_,"gIBSCBS"):void 0,x=g?P(g,"gIBSUF"):void 0,b=g?P(g,"gIBSMun"):void 0,I=g?P(g,"gCBS"):void 0,N=g?P(g,"gRed"):void 0;return{nItem:Number(j(y["@nItem"])??T+1),cProd:j(w.cProd)??"",xProd:j(w.xProd)??"",ncm:Xo(w.NCM,8),cfop:Xo(w.CFOP,4),quantidade:qe(w.qCom),valorProduto:qe(w.vProd)??0,desconto:qe(w.vDesc)??0,baseCalculo:g?qe(P(g,"vBC")):null,valorIBSInformado:g?qe(P(g,"vIBS")):null,valorCBSInformado:I?qe(P(I,"vCBS")):null,cst:_?Xo(P(_,"CST"),3):null,cClassTrib:_?Xo(P(_,"cClassTrib"),6):null,aliquotas:{cbs:I?qe(P(I,"pCBS"))??void 0:void 0,ibsUF:x?qe(P(x,"pIBSUF"))??void 0:void 0,ibsMun:b?qe(P(b,"pIBSMun"))??void 0:void 0,reducao:N?qe(P(N,"pRedAliq"))??void 0:void 0}}});return{documentos:[{chave:f,modelo:j(s.mod),numero:j(s.nNF),serie:j(s.serie),dataEmissao:j(s.dhEmi)??j(s.dEmi),tipoOperacao:v==="1"?"saida":v==="0"?"entrada":null,finalidade:j(s.finNFe),situacao:j(P(d,"cStat")),cancelado:!1,emitente:{cnpj:j(c.CNPJ),crt:j(c.CRT),uf:j(P(c,"UF"))},destinatario:{cnpj:j(l.CNPJ),cpf:j(l.CPF),uf:j(P(l,"UF")),indIEDest:j(l.indIEDest)},itens:C,arquivo:e,avisos:u}],cancelamentos:new Set,ignorados:[]}}function io(o,e={}){let a=new Set;for(let n of o)for(let s of n.cancelamentos)a.add(s);let t=e.cfopsVenda??/^[56][14]\d{2}$/,r=new Map,i=[];for(let n of o){for(let s of n.ignorados)i.push({documento:s.arquivo,motivo:s.motivo});for(let s of n.documentos){let c=s.chave??s.arquivo;if(s.tipoOperacao!=="saida"){i.push({documento:c,motivo:`tpNF ${s.tipoOperacao??"ausente"}: n\xE3o \xE9 sa\xEDda`});continue}if(s.finalidade==="4"){i.push({documento:c,motivo:"finNFe 4: devolu\xE7\xE3o"});continue}if(s.situacao&&!["100","150"].includes(s.situacao)){i.push({documento:c,motivo:`cStat ${s.situacao}: n\xE3o autorizada`});continue}if(s.chave&&a.has(s.chave)){i.push({documento:c,motivo:"cancelada por evento 110111"});continue}if(s.chave&&r.has(s.chave)){i.push({documento:c,motivo:"duplicada: mesma chave j\xE1 lida"});continue}for(let l of s.itens)l.cfop&&!t.test(l.cfop)&&s.avisos.push(`item ${l.nItem}: CFOP ${l.cfop} fora da faixa de venda`);r.set(s.chave??`${s.arquivo}#${r.size}`,s)}}return{documentos:[...r.values()],descartados:i}}var Id,vr=O(()=>{"use strict";m();Vn();Id=new Sa({ignoreAttributes:!1,attributeNamePrefix:"@",parseTagValue:!1,parseAttributeValue:!1,removeNSPrefix:!0,trimValues:!0})});function wa(o,e,a,t=na){let r=e.slice(0,10),i=t.filter(n=>n.tributo===o&&n.inicio<=r&&(n.fim===null||n.fim>=r)&&(a||n.tipo==="vigente"));return i.sort((n,s)=>n.tipo===s.tipo?0:n.tipo==="vigente"?-1:1),i[0]??null}function Qo(o,e,a){if(!o||!a)return null;let t=Nd.find(r=>r.modelo.includes(o)&&r.regimes.includes(e));return t?{obrigatorio:a.slice(0,10)>=t.inicio,fonte:t.fonte}:null}function Un(o,e){return o?Rd.filter(a=>a.prefixosNcm.some(t=>o.startsWith(t))).map(a=>({...a,emVigor:e.slice(0,10)>=a.inicio})):[]}function kn(o,e){if(!o)return null;let a=e.normalize("NFD").replace(/[̀-ͯ]/g,"").toUpperCase();if(/\bZERO\b.*\bALCOOL\b|\bSEM ALCOOL\b/.test(a))return null;let t=Od.find(r=>r.termo.test(a));return!t||t.posicoes.some(r=>o.startsWith(r))?null:`A descri\xE7\xE3o indica ${t.descricao}, mas o NCM informado \xE9 ${o}; conferir a classifica\xE7\xE3o do produto (${yd}).`}var na,Nd,Rd,Od,yd,Jo=O(()=>{"use strict";m();na=[{tributo:"CBS",inicio:"2026-01-01",fim:"2026-12-31",aliquota:.009,tipo:"vigente",fonte:"LC 214/2025, per\xEDodo de teste de 2026: CBS de 0,9%, compens\xE1vel com PIS/Cofins; recolhimento dispensado nos termos do art. 348, \xA7 1\xBA, se cumpridas as obriga\xE7\xF5es acess\xF3rias"},{tributo:"IBS",inicio:"2026-01-01",fim:"2026-12-31",aliquota:.001,tipo:"vigente",fonte:"LC 214/2025, per\xEDodo de teste de 2026: IBS de 0,1%"},{tributo:"CBS",inicio:"2027-01-01",fim:null,aliquota:.0943,tipo:"projecao",fonte:"Estimativa divulgada durante os trabalhos RFB/TCU (set/2026). N\xE3o \xE9 al\xEDquota oficial."}],Nd=[{modelo:["55","65"],regimes:["normal"],inicio:"2026-08-03",fonte:"Ato Conjunto RFB/CGIBS n\xBA 4/2026: cronograma em lotes, NF-e e NFC-e a partir de 03/08/2026"},{modelo:["55","65"],regimes:["simples","mei"],inicio:"2027-01-01",fonte:"Cronograma: optantes do Simples Nacional a partir de 01/01/2027"}];Rd=[{id:"IS-BEBIDAS-ACUCARADAS",prefixosNcm:["22021000"],inicio:"2027-01-01",texto:"Bebida a\xE7ucarada do Anexo XVII (2202.10.00): sujeita ao Imposto Seletivo, tributo distinto do IBS/CBS, a partir de 1\xBA/1/2027, cobrado uma \xFAnica vez no primeiro fornecimento (fabricante ou importador); a revenda n\xE3o recolhe o imposto e o IBS/CBS segue a regra geral.",fonte:"LC 214/2025, arts. 409, \xA7 1\xBA, V, 410 e 412, I, e Anexo XVII; EC 132/2023 (in\xEDcio em 2027); al\xEDquotas a fixar em lei ordin\xE1ria"},{id:"IS-BEBIDAS-ALCOOLICAS",prefixosNcm:["2203","2204","2205","2206","2208"],inicio:"2027-01-01",texto:"Bebida alco\xF3lica do Anexo XVII: sujeita ao Imposto Seletivo, tributo distinto do IBS/CBS, a partir de 1\xBA/1/2027, cobrado uma \xFAnica vez no primeiro fornecimento; a revenda n\xE3o recolhe o imposto e o IBS/CBS segue a regra geral. Fica fora do regime de bares e restaurantes.",fonte:"LC 214/2025, arts. 273, \xA7 2\xBA, III, 409, \xA7 1\xBA, IV, 410 e 412, I, e Anexo XVII; EC 132/2023 (in\xEDcio em 2027); al\xEDquotas a fixar em lei ordin\xE1ria"}];Od=[{termo:/\b(CERVEJA|CHOPP?)\b/,posicoes:["2203"],descricao:"cerveja de malte (posi\xE7\xE3o 22.03)"},{termo:/\bVINHO\b/,posicoes:["2204","2205"],descricao:"vinho (posi\xE7\xF5es 22.04 e 22.05)"},{termo:/\b(VODKA|WHISKY|CACHACA|RUM|GIN|TEQUILA|CAIPIRINHA|CAIPIROSKA|CAIPIRA)\b/,posicoes:["2208"],descricao:"aguardente/destilado (posi\xE7\xE3o 22.08)"},{termo:/\b(REFRIGERANTE|COCA[ -]?COLA|GUARANA|SPRITE|FANTA|PEPSI)\b/,posicoes:["2202","2106"],descricao:"refrigerante (posi\xE7\xE3o 22.02)"},{termo:/\bAGUA MINERAL\b/,posicoes:["2201"],descricao:"\xE1gua mineral (posi\xE7\xE3o 22.01)"}],yd="TIPI (Decreto n\xBA 11.158/2022), Cap\xEDtulo 22"});function Ar(o){if(o===null)return null;let e=o.replace(/^0+/,"");return e===""?"0":e}function Je(o,e){return Ar(o)===Ar(e)}function $n(o,e,a){let t=a.slice(0,10);return o.regras.filter(r=>r.ncm===e&&r.vigenciaInicio<=t&&(r.vigenciaFim===null||r.vigenciaFim>=t))}function Sd(o,e,a){if(o.natureza)return o.natureza;let t=a?.get(o.cProd)??a?.get(o.xProd);return t||(e.barOuRestaurante?null:"mercadoria")}function wd(o,e,a){let t=(o??[]).filter(r=>r.ncm===e&&(r.cProd===a.cProd||r.cProd===a.xProd));return t[t.length-1]?.escolha??null}function xr(o){return`${Math.round(o*100)}%`}function Td(o,e,a,t){let r=t.length===8?`${t.slice(0,4)}.${t.slice(4,6)}.${t.slice(6)}`:t;return`Regra encontrada pelo NCM: CST ${o.cst} / cClassTrib ${o.cClassTrib} / Anexo ${o.anexo} / Item ${o.item||"?"}. Redu\xE7\xE3o prevista na regra: ${xr(o.reducaoAliquota)} IBS / ${xr(o.reducaoAliquota)} CBS. Resultado da valida\xE7\xE3o: N\xC3O APLIC\xC1VEL AO PRODUTO. Motivo: o benef\xEDcio do Item ${o.item||"?"} do Anexo ${o.anexo} \xE9 espec\xEDfico para ${e}. Embora o produto esteja classificado no NCM ${r}, a descri\xE7\xE3o informada \xE9 "${a}", que n\xE3o atende, por si s\xF3, \xE0 descri\xE7\xE3o legal da regra. A redu\xE7\xE3o de ${xr(o.reducaoAliquota)} N\xC3O deve ser aplicada.`}function _d(o){if(o.estado!=="INCORRETO_RISCO")return o;if(o.esperado===null)return{...o,estado:"REQUER_VALIDACAO"};let e=o.exposicao;return{...o,estado:"INCORRETO_ECONOMIA",economiaPotencial:e===null?null:-e,motivo:`Rec\xE1lculo de imposto: ${e===null?"valor a pagar n\xE3o calculado":`valor a pagar de ${e.toFixed(2)}`}. ${o.motivo}`}}function Er(o,e,a){return _d(Md(o,e,a))}function Md(o,e,a){let t=a.agora??new Date().toISOString(),r=[],i=[],n=!1,s=[],c=[...Un(e.ncm,o.dataEmissao??t).map(A=>`${A.texto} Fonte: ${A.fonte}.${A.emVigor?"":" Ainda n\xE3o vigente na data do documento."}`),...[kn(e.ncm,e.xProd)].filter(A=>!!A)],l=A=>c.length?{...A,motivo:`${A.motivo} ${c.join(" ")}`}:A,d=(A,D,Q={})=>l({documento:o.chave??o.arquivo,nItem:e.nItem,cProd:e.cProd,produto:e.xProd,ncm:e.ncm,informado:{cst:e.cst,cClassTrib:e.cClassTrib},esperado:null,estado:A,motivo:D,regraAplicada:null,regrasCandidatas:[],baseCalculo:e.baseCalculo??e.valorProduto-e.desconto,valorIBSInformado:e.valorIBSInformado??null,valorCBSInformado:e.valorCBSInformado??null,valorInformadoTotal:e.valorIBSInformado==null&&e.valorCBSInformado==null?null:Number(((e.valorIBSInformado??0)+(e.valorCBSInformado??0)).toFixed(2)),valorPago:null,valorCorreto:null,economiaPotencial:null,economiaSujeitaValidacao:null,exposicao:null,aliquotaUsada:[],dadosFaltantes:r,versaoBase:a.base.versao,calculadoEm:t,...Q,...n?{ncmACorrigir:!0}:{},...s.length?{regrasNaoAplicaveis:s}:{},...i.length?{regrasBloqueadas:i,motivo:D.includes(br)?D:`${D} ${br}: ${i.join(", ")}.`}:{}});if(o.dataEmissao||r.push("data de emiss\xE3o do documento"),e.ncm||r.push("NCM do item"),r.length>0)return d("REQUER_VALIDACAO",`Falta: ${r.join("; ")}. O enquadramento depende de valida\xE7\xE3o humana.`);let u=o.dataEmissao??t,p=e.ncm??"",f=e.cst!==null||e.cClassTrib!==null;if(!f){let A=Qo(o.modelo,a.empresa.regime,u);if(A===null)return r.push("modelo do documento ou regime do emitente"),d("REQUER_VALIDACAO","Grupo IBS/CBS ausente e n\xE3o d\xE1 para saber se o preenchimento j\xE1 era exigido: valida\xE7\xE3o humana.");if(!A.obrigatorio)return d("NAO_OBRIGATORIO",`Grupo IBS/CBS ainda n\xE3o exigido nesta data. ${A.fonte}`)}let v=wd(a.validacoes,p,e);n=v==="NCM_INCORRETO";let C=(a.validacoes??[]).some(A=>A.ncm===p&&(A.cProd===e.cProd||A.cProd===e.xProd)),S=v==="CONSUMO_NO_LOCAL"?"preparado_no_local":Sd(e,a.empresa,a.naturezaPorProduto)??(C?"mercadoria":null);if(S===null){r.push(`natureza do item ${e.cProd||e.xProd} (preparado no local, bebida alco\xF3lica ou mercadoria)`);let A=$n(a.base,p,u).filter(D=>!a.regrasBloqueadas?.has(`${D.id}|${D.ncm}`));return d("REQUER_VALIDACAO","Emitente atende consumo no local e a natureza do item n\xE3o foi informada: valida\xE7\xE3o humana (consumo no local, bebida alco\xF3lica ou mercadoria).",{regrasCandidatas:A.map(D=>D.id)})}let y=()=>{let A=[],D=0;for(let Q of["CBS","IBS"]){let re=wa(Q,u,a.aceitarProjecao??!1,a.aliquotas??na);re?(A.push({tributo:Q,aliquota:re.aliquota,fonte:re.fonte,tipo:re.tipo}),D+=re.aliquota):r.push(`al\xEDquota de refer\xEAncia de ${Q} vigente em ${u.slice(0,10)}`)}return{usadas:A,total:D}};if(S==="preparado_no_local"){let A={cst:W.cst,cClassTrib:W.cClassTrib},D=Je(e.cst,A.cst)&&Je(e.cClassTrib,A.cClassTrib),Q=`Regime espec\xEDfico de bares e restaurantes (${W.fundamento}): redu\xE7\xE3o de 40%.`,{usadas:re,total:Ge}=y(),je=e.baseCalculo??e.valorProduto-e.desconto,Ve=re.length===2?je*Ge:null,go={esperado:A,regraAplicada:W.fundamento,baseCalculo:je,aliquotaUsada:re};if(!f)return d("INCORRETO_RISCO",`Grupo IBS/CBS exigido e n\xE3o informado no documento. ${Q}`,go);if(D)return d("CORRETO",Q,{...go,valorPago:Ve,valorCorreto:Ve,economiaPotencial:0});if(Je(e.cClassTrib,sa.cClassTrib)){let ct=Ve===null?null:Ve*W.reducao;return d("INCORRETO_ECONOMIA",`${Q} O documento usa tributa\xE7\xE3o integral.`,{...go,valorPago:Ve,valorCorreto:Ve===null||ct===null?null:Ve-ct,economiaPotencial:ct})}let Hr=e.cClassTrib?a.base.catalogoCodigos[Ar(e.cClassTrib).padStart(6,"0")]:void 0,Bs=Ve!==null&&Hr?Ve*Math.max(0,Hr.reducao-W.reducao):null;return d("INCORRETO_RISCO",`C\xF3digo ${e.cClassTrib} informado no lugar do regime espec\xEDfico. ${Q}`,{...go,exposicao:Bs})}let T=S==="bebida_alcoolica"||S==="servico"?[]:$n(a.base,p,u),w=a.regrasBloqueadas?T.filter(A=>a.regrasBloqueadas.has(`${A.id}|${A.ncm}`)):[],_=w.length?T.filter(A=>!w.includes(A)):T;i=w.map(A=>A.id);let g=(a.validacoes??[]).filter(A=>A.ncm===p&&(A.cProd===e.cProd||A.cProd===e.xProd)),x=new Set(g.filter(A=>A.resposta==="NAO").map(A=>A.regraId)),b=new Set(g.filter(A=>A.resposta==="SIM").map(A=>A.regraId)),I=_.filter(A=>!x.has(A.id)),N=I.filter(A=>!b.has(A.id)).map(A=>({r:A,req:Do(e.xProd,A.descricaoLegal,A.descricaoNcmTipi)})).filter(A=>A.req!==null);s=N.map(({r:A,req:D})=>({regraId:A.id,cst:A.cst,cClassTrib:A.cClassTrib,anexo:A.anexo,item:A.item,fundamentoLegal:A.fundamentoLegal,reducaoPrevista:A.reducaoAliquota,designacaoLegal:D.designacaoLegal,motivo:Td(A,D.designacaoLegal,e.xProd,p)}));let B=I.filter(A=>!N.some(D=>D.r===A)),M=B.filter(A=>b.has(A.id)),X=s.map(A=>A.motivo).join(" "),Be=_.map(A=>A.id),Z=null,He=null,z="";if(B.length===0&&N.length>0)He="REQUER_VALIDACAO",z=`${X} Nenhuma outra regra de benef\xEDcio do NCM ${p} se aplica automaticamente: o enquadramento aguarda valida\xE7\xE3o humana (consumo no local pelo regime de bares e restaurantes, mercadoria sem benef\xEDcio ou NCM incorreto).`;else if(B.length===0)Z=null,z=_.length>0?"Todas as regras do NCM foram descartadas na valida\xE7\xE3o: o produto n\xE3o se enquadra na descri\xE7\xE3o legal."+(v==="MERCADORIA_SEM_BENEFICIO"?" Verificado na valida\xE7\xE3o: vendido como mercadoria, com o NCM informado correto; nenhuma outra regra de benef\xEDcio do NCM se aplica e o regime de bares e restaurantes (art. 275) n\xE3o vale para mercadoria.":v==="NCM_INCORRETO"?" A valida\xE7\xE3o indicou que o NCM informado est\xE1 errado: corrigir o NCM no ERP e reprocessar com as novas notas. Nenhum benef\xEDcio de outro NCM \xE9 aplicado ao NCM informado.":""):w.length>0?`Nenhuma regra de benef\xEDcio aplic\xE1vel: ${br} (${i.join(", ")}).`:"Nenhuma regra de benef\xEDcio cadastrada para este NCM nesta data.";else if(M.length===1)Z=M[0],z=`Benef\xEDcio confirmado na valida\xE7\xE3o: ${Z.rotulo} (${Z.fundamentoLegal}).`;else if(M.length>1)He="REQUER_VALIDACAO",z=`Mais de um benef\xEDcio confirmado para o mesmo item: ${M.map(A=>`${A.cClassTrib} (Anexo ${A.anexo})`).join(", ")}. \xC9 preciso escolher um.`;else{He="REQUER_VALIDACAO";let A=B.map(D=>`${D.cClassTrib} (Anexo ${D.anexo}, item ${D.item||"?"})`);z=B.length>1?`NCM com ${B.length} enquadramentos poss\xEDveis: ${A.join(", ")}. A composi\xE7\xE3o do produto decide qual vale.`:`Enquadramento poss\xEDvel em ${A[0]}, sujeito \xE0 confer\xEAncia da descri\xE7\xE3o legal.`}if(v==="NCM_INCORRETO")return d("INCORRETO_NCM",`AJUSTAR O NCM: a valida\xE7\xE3o indicou que o NCM ${p} informado para "${e.xProd}" est\xE1 errado. Corrigir o NCM no cadastro do produto no ERP e reprocessar com as novas notas. Nenhum enquadramento \xE9 proposto para o NCM informado e nenhum benef\xEDcio de outro NCM \xE9 aplicado.`,{regrasCandidatas:Be,baseCalculo:e.baseCalculo??e.valorProduto-e.desconto});N.length>0&&B.length>0&&(z=`${X} Reenquadramento entre as demais regras do NCM: ${z}`);let oe=Z?{cst:Z.cst,cClassTrib:Z.cClassTrib}:sa,{usadas:Y,total:K}=y(),te=e.baseCalculo??e.valorProduto-e.desconto,mo=Z?.reducaoAliquota??0,qa=Je(e.cst,oe.cst)&&Je(e.cClassTrib,oe.cClassTrib);if(!f){let A="Grupo IBS/CBS exigido e n\xE3o informado no documento.";if(He==="REQUER_VALIDACAO"){let Q=B.length?Math.max(...B.map(re=>re.reducaoAliquota)):0;return d("INCORRETO_RISCO",`${A} Enquadramento esperado: depende da valida\xE7\xE3o. ${z}`,{esperado:null,regrasCandidatas:Be,baseCalculo:te,exposicao:Y.length===2?te*K*(1-Q):null,aliquotaUsada:Y})}let D=Z?`${oe.cst}/${oe.cClassTrib} (${Z.rotulo}, ${Z.fundamentoLegal}).`:`${oe.cst}/${oe.cClassTrib} (regra geral, sem benef\xEDcio aplic\xE1vel).`;return d("INCORRETO_RISCO",`${A} Enquadramento esperado: ${D} ${z}`,{esperado:oe,regraAplicada:Z?.id??null,regrasCandidatas:Be,baseCalculo:te,exposicao:Y.length===2?te*K*(1-mo):null,aliquotaUsada:Y})}if(He==="REQUER_VALIDACAO"){let A=B.length?Math.min(...B.map(je=>je.reducaoAliquota)):0,D=Je(e.cClassTrib,sa.cClassTrib),Q=B.find(je=>Je(e.cClassTrib,je.cClassTrib)),re=Q?` O documento j\xE1 usa ${Q.cClassTrib}: falta confirmar que o produto atende \xE0 descri\xE7\xE3o legal e \xE0s veda\xE7\xF5es do Anexo ${Q.anexo}.`:"",Ge=Y.length===2?te*K:null;return d("REQUER_VALIDACAO",z+re,{esperado:null,regrasCandidatas:Be,baseCalculo:te,valorPago:Ge,valorCorreto:null,economiaPotencial:null,economiaSujeitaValidacao:D&&Ge!==null?Ge*A:null,aliquotaUsada:Y})}if(qa)return d("CORRETO",z||"C\xF3digos conferem com a regra aplic\xE1vel.",{esperado:oe,regraAplicada:Z?.id??null,regrasCandidatas:Be,baseCalculo:te,valorPago:Y.length===2?te*K:null,valorCorreto:Y.length===2?te*K:null,economiaPotencial:0,aliquotaUsada:Y});if(!Je(e.cClassTrib,sa.cClassTrib)&&!(Z!==null)){let A=Y.length===2?te*K:null;return d("INCORRETO_RISCO",`C\xF3digo ${e.cClassTrib} informado sem regra que o ampare para o NCM ${p}. ${z}`,{esperado:oe,regrasCandidatas:Be,baseCalculo:te,exposicao:A,aliquotaUsada:Y})}let Ie=Y.length===2?te*K:null,Ke=Ie===null?null:Ie*mo,Ba=Ie===null||Ke===null?null:Ie-Ke;return d("INCORRETO_ECONOMIA",z||"Benef\xEDcio aplic\xE1vel n\xE3o foi utilizado.",{esperado:oe,regraAplicada:Z?.id??null,regrasCandidatas:Be,baseCalculo:te,valorPago:Ie,valorCorreto:Ba,economiaPotencial:Ke,aliquotaUsada:Y})}function Wo(o,e){let a=[];for(let t of o)for(let r of t.itens)a.push(Er(t,r,e));return a}var sa,W,br,Ta=O(()=>{"use strict";m();Lt();Jo();sa={cst:"000",cClassTrib:"000001"},W={cst:"200",cClassTrib:"200047",reducao:.4,fundamento:"LC 214/2025, art. 275"},br="Regra bloqueada por incompatibilidade oficial do NCM com este enquadramento"});function We(o){if(o.toLowerCase()!=="sha256")throw new Error(`hash n\xE3o suportado no navegador: ${o}`);let e=za.create(),a={update(t){return e.update(typeof t=="string"?new TextEncoder().encode(t):t),a},digest(t){let r=e.digest();return t==="hex"?ka(r):zn.Buffer.from(r)}};return a}var zn,no=O(()=>{"use strict";m();zn=ce(Ao(),1);Et();$a()});function Ld(o){return o.situacaoNcmSvrs==="VEDADO"?o.ncmNaListaDoAnexoI===!0?"VEDADO_ANEXO_I":o.excluidoDoItemDaRegra?"VEDADO_EXCECAO_ITEM":"VEDADO_EXCECAO_LEI":o.status==="NAO_LOCALIZADA"&&o.excecaoNaLeiEmItens.length>0?"EXCLUSAO_LEGAL":null}function Ir(o){let e=new Map;for(let a of o.regras){let t=Ld(a);t&&e.set(so(a.regraId,a.ncm),{regraId:a.regraId,ncm:a.ncm,cClassTrib:a.cClassTrib,item:a.item,tipo:t,mensagem:Cr,motivo:Fd[t],motivosDaAuditoria:a.motivos,situacaoNcmSvrs:a.situacaoNcmSvrs,excecaoNaLeiEmItens:a.excecaoNaLeiEmItens,fatosF1:a.fatosF1,fatosF2:a.fatosF2,fontes:{F1:{url:o.entradas.F1.url??"",arquivo:o.entradas.F1.arquivo,sha256:o.entradas.F1.sha256},F2:{url:o.entradas.F2.url??"",arquivo:o.entradas.F2.arquivo,sha256:o.entradas.F2.sha256}}})}return e}function ca(o){let e=(0,Zo.join)((0,Zo.dirname)(o),"auditoria-oficial.json");if(!U(e))return new Map;let a=Gn(L(o)),t=L(e),r=`${a}|${Gn(t)}`,i=Hn.get(r);if(i)return i;let n=JSON.parse(t.toString("utf8"));if(n.entradas.base.sha256!==a)throw new Error(`${e} n\xE3o corresponde a ${o}: rode node scripts/auditoria_oficial.mjs antes de processar (os bloqueios oficiais dependem dela).`);let s=Ir(n);return Hn.set(r,s),s}function _a(o){return new Set(o.keys())}var Zo,Cr,so,Fd,Hn,Gn,Ma=O(()=>{"use strict";m();no();de();Zo=ce(Ae(),1),Cr="Regra bloqueada por incompatibilidade oficial do NCM com este enquadramento.",so=(o,e)=>`${o}|${e}`;Fd={VEDADO_ANEXO_I:'O SVRS lista o NCM como VEDADO para este c\xF3digo, com a ressalva "Produtos relacionados no Anexo I"; o NCM consta da lista oficial do Anexo I (200003).',VEDADO_EXCECAO_ITEM:"O SVRS lista o NCM como VEDADO para este c\xF3digo e o pr\xF3prio item da regra na LC 214/2025 exclui expressamente o NCM.",VEDADO_EXCECAO_LEI:"O SVRS lista o NCM como VEDADO para este c\xF3digo e a LC 214/2025 exclui expressamente o NCM no item do anexo que o abrange.",EXCLUSAO_LEGAL:"A LC 214/2025 exclui expressamente o NCM do item da regra, e o SVRS n\xE3o o lista para este c\xF3digo."};Hn=new Map,Gn=o=>We("sha256").update(o).digest("hex")});function et(o){let e=L(o.base),a=L(o.v2),t=JSON.parse(e.toString("utf8")),r=JSON.parse(a.toString("utf8")),i=L(o.matriz),n=JSON.parse(i.toString("utf8")),s=JSON.parse(L(o.empresa,"utf8")),c=[],l=null,d=r.fontes?.registros?.F2?.arquivos.find(p=>p.id==="F2.extracao");if(d?.caminho){let p=L(d.caminho);Yo(p)===d.sha256?l=JSON.parse(p.toString("utf8")).cst200.ClassificacoesTributarias:c.push("A extra\xE7\xE3o F2 n\xE3o confere com o hash registrado na v2; informa\xE7\xF5es do SVRS sobre condi\xE7\xF5es n\xE3o foram exibidas.")}else c.push("A extra\xE7\xE3o F2 n\xE3o est\xE1 registrada na v2; informa\xE7\xF5es do SVRS sobre condi\xE7\xF5es n\xE3o foram exibidas.");let u=Dd(o.auditoria??(0,Ko.join)((0,Ko.dirname)(o.v2),"auditoria-oficial.json"),Yo(e),Yo(a),r,c);return{base:t,v2:r,validacoes:s.validacoes??[],matriz:{versao:n.versao,hash:Yo(i)},f2:l,avisos:c,auditoria:u}}function Dd(o,e,a,t,r){if(!U(o))return null;let i=JSON.parse(L(o,"utf8")),n=l=>Object.values(t.fontes?.registros??{}).flatMap(d=>d.arquivos).find(d=>d.id===l)?.sha256;if(i.entradas.base.sha256!==e||i.entradas.v2.sha256!==a||i.entradas.F1.sha256!==n("F1.html")||i.entradas.F2.sha256!==n("F2.html"))return r.push("A auditoria oficial n\xE3o corresponde \xE0 base, \xE0 v2 ou aos snapshots atuais; a confer\xEAncia com as fontes oficiais n\xE3o foi exibida."),null;let s=l=>({url:i.entradas[l].url??"",arquivo:i.entradas[l].arquivo,sha256:i.entradas[l].sha256,natureza:i.entradas[l].natureza??""}),c=new Map;for(let l of i.lacunas)c.set(l.ncm,[...c.get(l.ncm)??[],l]);return{porIndice:new Map(i.regras.map(l=>[l.indice,l])),lacunasPorNcm:c,codigos:i.codigos,fontes:{F1:s("F1"),F2:s("F2")},bloqueios:Ir(i)}}function Pd(o,e,a,t){let r=o.auditoria?.porIndice.get(e);if(!o.auditoria||!r||r.regraId!==a||r.ncm!==t)return null;let{indice:i,regraId:n,ncm:s,item:c,...l}=r,d=o.auditoria.codigos[r.cClassTrib];return d?{...l,itemDaBase:c,codigo:d,fontes:o.auditoria.fontes}:null}function Vd(o){let e=Xn.get(o);if(e)return e;let a={porIdENcm:new Map,contagemId:new Map,vinculoPorIndice:new Map,codigo:new Map,lacunasPorNcm:new Map,codigosPorNcm:new Map,f2PorCodigo:new Map};o.base.regras.forEach((t,r)=>{let i=`${t.id}|${t.ncm}`;a.porIdENcm.set(i,[...a.porIdENcm.get(i)??[],r]),a.contagemId.set(t.id,(a.contagemId.get(t.id)??0)+1),a.codigosPorNcm.has(t.ncm)||a.codigosPorNcm.set(t.ncm,new Set),a.codigosPorNcm.get(t.ncm).add(t.cClassTrib)});for(let t of o.v2.vinculacoes?.regras??[])a.vinculoPorIndice.set(t.regra.indice,t);for(let t of[...o.v2.vinculacoes?.codigo??[],...o.v2.evidenciasOficiais?.codigo??[]]){if(a.codigo.has(t.id))throw new Error(`v\xEDnculo de c\xF3digo duplicado na v2: ${t.id}`);a.codigo.set(t.id,t)}for(let t of o.v2.vinculacoes?.ncmsOficiaisSemRegra??[])a.lacunasPorNcm.set(t.ncm,[...a.lacunasPorNcm.get(t.ncm)??[],t]);for(let t of o.f2??[])a.f2PorCodigo.set(t.CodClassTrib,t);return Xn.set(o,a),a}function Jn(o,e,a,t){let r=o.v2.fontes?.registros?.[e],i=r?.arquivos.find(n=>n.id===a);return!r||!i?null:{camada:"FONTE_DIZ",fonte:e,arquivo:a,sha256:i.sha256,natureza:t,versao:r.versao,dataConsulta:r.dataConsulta}}function Ud(o,e){let a=o.v2.regras[e]?.original,t=Jn(o,"PLANILHA","PLANILHA.base-de-dados","base interna da planilha V4.1; n\xE3o oficial");return!a||a.fonte!=="PLANILHA"||!t?[]:["Fundamento legal","Descri\xE7\xE3o legal do benef\xEDcio"].flatMap(r=>{let i=a.valores[r];return i==null?[]:[{...t,localizacao:{aba:"Base de dados",linha:a.linha,coluna:r},trecho:i}]})}function Nr(o,e,a){return{camada:"SISTEMA_INFERE",regra:o,premissas:e,conclusao:a}}function Rr(o){return{valor:null,origem:null,regraIndice:null,linhaPlanilha:null,evidencia:"nao_determinada",comparacao:null,fatos:[],motivo:o}}function $d(o,e,a,t){let r={valor:t.reducaoAliquota,origem:"base_normativa",regraIndice:e,linhaPlanilha:a},i=o.codigo.get(`C-${t.cClassTrib}-reducaoAliquota`),n=!!i&&(i.alcance??[]).some(d=>d.indice===e);if(!i||!n)return{...r,evidencia:"sem_evidencia_oficial",comparacao:null,fatos:[],motivo:i?`O v\xEDnculo ${i.id} n\xE3o alcan\xE7a esta regra; o percentual vem s\xF3 da base normativa.`:`O c\xF3digo ${t.cClassTrib} est\xE1 fora do escopo auditado; o percentual vem s\xF3 da base normativa, sem confer\xEAncia com fonte oficial.`};let s=i.fatos.map(La),c=typeof i.valorRegra!="number"||i.valorRegra===t.reducaoAliquota,l=i.comparacao.resultado==="concorda"&&c;return{...r,evidencia:l?"oficial_confirmada":"oficial_divergente",comparacao:i.comparacao.resultado,fatos:s,motivo:l?`O v\xEDnculo ${i.id} confere o percentual com as fontes oficiais (resultado "${i.comparacao.resultado}").`:`O v\xEDnculo ${i.id} n\xE3o confirma o percentual da regra (resultado "${i.comparacao.resultado}"${c?"":`; valor do v\xEDnculo ${String(i.valorRegra)}`}).`}}function co(o){return{status:"pendente",decisao:o}}function zd(o,e,a,t,r){let i=e.codigo.get(`C-${a}-anexo`)?.fatos.find(f=>f.fonte==="F1");if(!i||a!=="200033"&&a!=="200043")return{condicoes:[],fatosF2:[]};let n=[],s=e.f2PorCodigo.get(a),c=Jn(o,"F2","F2.extracao","tabela de apoio do portal da Conformidade F\xE1cil (SVRS); n\xE3o \xE9 texto legal"),l;if(s&&c){let f=s.Anexos.find(v=>v.CodNcmNbs===t);f?.DescCondicao&&(l={...c,localizacao:{cst:"200",cClassTrib:a,anexo:{CodIntProdServ:f.CodIntProdServ}},valor:{DescCondicao:f.DescCondicao}},n.push(l)),a==="200043"&&n.push({...c,localizacao:{cst:"200",cClassTrib:a,campo:"IndNfce"},valor:s.IndNfce})}let d=a==="200033"?{id:"COND-200033-DESTINACAO",cClassTrib:a,natureza:"destinacao",textoOficial:La(i),verificavelPeloXml:"nao",chaveDeValidacao:"produto"}:{id:"COND-200043-ADQUIRENTE",cClassTrib:a,natureza:"adquirente",textoOficial:La(i),verificavelPeloXml:"nao",chaveDeValidacao:"adquirente",combinacaoDosTipos:co("D2"),estadoSeContrariada:co("D4")};l&&(d.textoOperacional=l);let u=o.v2.regras[r]?.original,p=u?.fonte==="PLANILHA"?u.valores.Observa\u00E7\u00E3o:null;return a==="200043"&&u?.fonte==="PLANILHA"&&p&&(d.textoPlanilha={fonte:"PLANILHA",aba:"Base de dados",linha:u.linha,coluna:"Observa\xE7\xE3o",valor:p}),{condicoes:[d],fatosF2:n}}function Hd(o,e,a,t){let r=g=>({regraIdInformado:a,vinculo:g,referencia:null,statusNormativo:null,fonteDiz:[],sistemaInfere:[],sinalizadores:[],condicoes:[],divergencias:[]}),i=t.ncm??"",n=e.porIdENcm.get(`${a}|${i}`)??[];if(n.length>1){let g=r("ambiguo_regraid_duplicado");g.sinalizadores=["REGRAID_DUPLICADO"],g.reducao=Rr(`A regra n\xE3o p\xF4de ser identificada com seguran\xE7a: o regraId ${a} corresponde a ${n.length} regras da base.`);let x=n.map(b=>({indice:b,linha:o.v2.regras[b]?.original?.linha??-1,regraId:a,ncm:i}));return g.divergencias=[{id:`DIV-regraid_duplicado-${a}`,tipo:"regraid_duplicado",regras:x,valores:[{fonte:"BASE_ATUAL",valor:a}],impacto:"identificacao",status:"aberta",resolucao:null}],{explicacao:g,decisoes:["D7"],ausencias:["REGRA_NAO_LOCALIZADA_COM_SEGURANCA"],situacoes:[13],limitacoes:[`O regraId ${a} corresponde a ${n.length} regras da base (linhas ${x.map(b=>b.linha).join(" e ")}); nenhuma evid\xEAncia foi vinculada e nenhuma delas foi escolhida.`]}}let s=n[0],c=s===void 0?void 0:o.v2.regras[s],l=s===void 0?void 0:o.base.regras[s],d=!!c&&!!l&&jd.every(g=>JSON.stringify(c[g])===JSON.stringify(l[g]))&&!!c.original;if(s===void 0||!d||!l||!c?.original){let g=r("nao_localizado");return g.reducao=Rr(`A regra n\xE3o p\xF4de ser identificada com seguran\xE7a: o identificador ${a} n\xE3o corresponde, de forma conferida, a uma regra da base para a NCM ${i||"(sem NCM)"}.`),{explicacao:g,decisoes:[],ausencias:["REGRA_NAO_LOCALIZADA_COM_SEGURANCA"],situacoes:[],limitacoes:[s===void 0?`O identificador informado pelo motor (${a}) n\xE3o corresponde a uma regra da base para a NCM ${i||"(sem NCM)"}; nenhuma evid\xEAncia foi vinculada.`:`A regra ${a} (\xEDndice ${s}) n\xE3o confere entre a base atual e a v2; nenhuma evid\xEAncia foi vinculada.`]}}let u={indice:s,linha:c.original.linha,regraId:a,ncm:i},p=r("seguro");p.referencia=u,p.reducao=$d(e,s,u.linha,l),p.auditoriaOficial=Pd(o,s,a,i),p.bloqueio=o.auditoria?.bloqueios.get(so(a,i))??null;let f={explicacao:p,limitacoes:[],decisoes:[],ausencias:[],situacoes:[]},v=l.cClassTrib,C=e.vinculoPorIndice.get(s);if(p.fonteDiz.push(...Ud(o,s)),(e.codigosPorNcm.get(l.ncm)?.size??0)>1&&p.sinalizadores.push("NCM_EM_OUTROS_CODIGOS"),!C)return p.statusNormativo="SEM_EVIDENCIA_OFICIAL",f.ausencias.push("SEM_EVIDENCIA_OFICIAL"),!p.bloqueio&&!Qn(o,p,null)&&f.decisoes.push("D3"),f.situacoes.push(4),f.limitacoes.push(u.linha===null?`A regra ${a} foi inclu\xEDda pela decis\xE3o D5 a partir da LC 214/2025 e do SVRS; o c\xF3digo ${v} est\xE1 fora do escopo das vincula\xE7\xF5es (${o.v2.vinculacoes.escopo.join(", ")}), e a confer\xEAncia da regra est\xE1 na auditoria oficial.`:`A regra ${a} (linha ${u.linha}) s\xF3 tem a planilha como origem; o c\xF3digo ${v} est\xE1 fora do escopo auditado (${o.v2.vinculacoes.escopo.join(", ")}).`),f;let S=qd[C.comparacao.resultado];p.statusNormativo=S??null,S&&f.situacoes.push(Bd[S]);let y=C.fatos.map(La);p.fonteDiz.push(...y);let T=C.dadoExtraido,w=C.comparacao.resultado.startsWith("ncm_so_")?"comparacao_presenca_ncm":"comparacao_item";p.sistemaInfere.push(Nr(w,y,`O sistema comparou o item da regra (${l.item}) com as fontes: resultado "${C.comparacao.resultado}".`+(C.interpretacao?` Leitura do sistema: ${C.interpretacao}`:""))),T.coberturaF1.some(g=>!g.exata)&&p.sistemaInfere.push(Nr("cobertura_ncm_por_prefixo",y.filter(g=>g.fonte==="F1"),`O sistema considerou que ${T.coberturaF1.filter(g=>!g.exata).map(g=>`o c\xF3digo ${g.codigo} (item ${g.item})`).join(" e ")} cobre a NCM ${l.ncm} por prefixo.`)),T.itensF1QueCobremONcm.length>1&&(p.sinalizadores.push("DEPENDE_COMPOSICAO_PRODUTO"),f.situacoes.push(10));for(let g of["anexo","reducaoAliquota","fundamentoLegal","vigenciaInicio"]){let x=e.codigo.get(`C-${v}-${g}`);if(!x)continue;let b=x.fatos.map(La);for(let M of b)p.fonteDiz.some(X=>JSON.stringify(X.localizacao)===JSON.stringify(M.localizacao)&&X.arquivo===M.arquivo)||p.fonteDiz.push(M);let I=kd[g];I&&p.sistemaInfere.push(Nr(I,b,`O sistema comparou o campo ${g} da regra com as fontes: resultado "${x.comparacao.resultado}".`+(x.comparacao.detalhe?` ${x.comparacao.detalhe}`:"")+(x.interpretacao?` Leitura do sistema: ${x.interpretacao}`:"")));let N={fonte:"BASE_ATUAL",valor:l[g]},B=b.filter(M=>M.fonte!=="PLANILHA").map(M=>({fonte:M.fonte,valor:M.trecho??M.valor,fato:M}));if(g==="fundamentoLegal"&&(x.status==="conflito"||x.status==="ambiguo")){let M=x.status==="conflito";p.sinalizadores.push(M?"FUNDAMENTO_DIVERGENTE":"FUNDAMENTO_A_REVISAR"),p.divergencias.push({id:`DIV-${M?"fundamento_legal":"fundamento_a_revisar"}-${v}`,tipo:M?"fundamento_legal":"fundamento_a_revisar",cClassTrib:v,regras:[u],valores:[N,...B],impacto:"texto",status:M?"aberta":"a_revisar",resolucao:null}),f.situacoes.push(8)}g==="vigenciaInicio"&&x.status==="ambiguo"&&(p.sinalizadores.push("VIGENCIA_AMBIGUA"),p.divergencias.push({id:`DIV-vigencia-${v}`,tipo:"vigencia",cClassTrib:v,regras:[u],valores:[N,...B],impacto:"calculo",status:"a_revisar",resolucao:null}),f.situacoes.push(7))}if(C.comparacao.resultado==="item_divergente"){let g=y.filter(x=>x.fonte==="F1");p.divergencias.push({id:`DIV-item_divergente-${s}`,tipo:"item_divergente",cClassTrib:v,regras:[u],impacto:"enquadramento",status:"aberta",resolucao:null,valores:[{fonte:"BASE_ATUAL",valor:l.item},...g.map(x=>({fonte:x.fonte,valor:x.trecho,fato:x})),{fonte:"F2",valor:T.descricoesF2}]})}if(C.comparacao.resultado==="ncm_so_na_F1"||C.comparacao.resultado==="ncm_so_na_F2"){let g=C.comparacao.resultado==="ncm_so_na_F1",x=y.find(b=>b.fonte===(g?"F1":"F2"));p.divergencias.push({id:`DIV-${C.comparacao.resultado}-${v}-${l.ncm}`,tipo:g?"ncm_so_na_F1":"ncm_so_na_F2",cClassTrib:v,regras:[u],impacto:"enquadramento",status:"aberta",resolucao:null,valores:[{fonte:g?"F1":"F2",valor:"presente",...x?{fato:x}:{}},{fonte:g?"F2":"F1",valor:`ausente da lista do ${v}`}]}),f.limitacoes.push(`As fontes oficiais divergem sobre a NCM ${l.ncm} no ${v}; nenhuma fonte foi escolhida e a diverg\xEAncia n\xE3o foi resolvida.`)}let _=zd(o,e,v,l.ncm,s);return p.condicoes=_.condicoes,p.fonteDiz.push(..._.fatosF2),_.condicoes.length&&(p.sinalizadores.push("CONDICAO_NAO_VERIFICAVEL_NO_XML"),f.situacoes.push(10)),v==="200043"&&(f.decisoes.push("D2","D4"),f.situacoes.push(9)),(v==="200033"||v==="200043")&&!e.f2PorCodigo.size&&f.limitacoes.push(...o.avisos),!p.bloqueio&&!Qn(o,p,C)&&f.decisoes.push("D3"),f}function Qn(o,e,a){return o.auditoria?e.auditoriaOficial?.status==="CONFIRMADA":a?.comparacao.resultado==="concorda"}function Gd(o,e,a){return a.autor==="Sistema"?"autor_sistema_nao_e_confirmacao_humana":a.justificativa?(e.contagemId.get(a.regraId)??0)>1?"chave_por_regraid_duplicado":o.base.regras.some(t=>t.id===a.regraId&&t.cClassTrib==="200043")?"chave_por_produto_em_condicao_de_adquirente":a.autor.trim()!==""?"sem_hash_das_fontes_na_data":null:"autor_humano_sem_justificativa"}function Or(o,e,a){let t=Vd(e),r=o.regraAplicada&&o.regraAplicada!==W.fundamento?o.regraAplicada:null,n=[...new Set([...o.regrasCandidatas,...r&&!o.regrasCandidatas.includes(r)?[r]:[],...o.regrasBloqueadas??[]])].map(b=>Hd(e,t,b,o)),s=n.map(b=>b.explicacao),c=n.flatMap(b=>b.limitacoes),l=new Set(n.flatMap(b=>b.decisoes)),d=new Set(n.flatMap(b=>b.ausencias)),u=new Set(n.flatMap(b=>b.situacoes));o.regrasCandidatas.length===0&&d.add("SEM_REGRA_NA_BASE");let p=(t.lacunasPorNcm.get(o.ncm??"")??[]).map(b=>({id:b.id,status:"LACUNA_FONTE_SEM_REGRA",cClassTrib:b.cClassTrib,ncm:b.ncm,fatos:b.fatos.map(La),regrasDeOutrosCodigosComEstaNcm:b.regrasDeOutrosCodigosComEstaNcm,inclusaoComoRegra:co("D5")}));p.length&&(l.add("D5"),u.add(3),c.push(`A fonte oficial lista a NCM ${o.ncm} para ${p.map(b=>b.cClassTrib).join(", ")}, e a base atual n\xE3o tem regra correspondente. O estado ${o.estado} foi produzido pelo motor sem essa informa\xE7\xE3o e n\xE3o foi alterado.`));let f=e.validacoes.filter(b=>b.ncm===o.ncm&&(b.cProd===o.cProd||b.cProd===o.produto)),v=[];for(let b of f){let I=Gd(e,t,b);I?v.push({origem:"empresa.json",registro:b,classificacao:I,tratamento:co("D6")}):c.push(`Resposta do empresa.json sem autor identific\xE1vel (cProd ${b.cProd}, regraId ${b.regraId}): n\xE3o \xE9 HUMANO_CONFIRMOU e nenhuma classifica\xE7\xE3o de ValidacaoLegada se aplica a ela.`)}v.length&&l.add("D6"),v.some(b=>b.classificacao==="autor_sistema_nao_e_confirmacao_humana")&&c.push('Resposta do empresa.json com autor "Sistema": a tela de valida\xE7\xE3o envia o autor fixo "Sistema" (servidor.ts, fun\xE7\xE3o validar), e a rota /api/validar grava "Sistema" quando n\xE3o recebe autor (autor || "Sistema"). A autoria n\xE3o foi coletada e n\xE3o foi reconstru\xEDda: o registro n\xE3o indica decis\xE3o autom\xE1tica do sistema nem valida\xE7\xE3o humana comprovada.'),v.some(b=>b.classificacao==="sem_hash_das_fontes_na_data")&&c.push("Resposta do empresa.json com autor humano e justificativa, mas sem o hash das fontes na data da resposta: permanece ValidacaoLegada e n\xE3o \xE9 HUMANO_CONFIRMOU."),f.length&&(u.add(11),c.push("A rota /api/validar substitui a resposta anterior para a mesma chave; n\xE3o h\xE1 hist\xF3rico de respostas."));let C=s.some(b=>b.vinculo!=="nao_localizado");(C||f.length)&&(d.add("VALIDACAO_HUMANA_NAO_DISPONIVEL"),u.add(12));let S=null;if(C){let b=s.flatMap(N=>N.condicoes);S={status:"BENEFICIO_PENDENTE_VALIDACAO",pergunta:(b.length?`O produto e a opera\xE7\xE3o atendem \xE0 descri\xE7\xE3o do item e \xE0 condi\xE7\xE3o da norma (${[...new Set(b.map(N=>"dispositivo"in N.textoOficial.localizacao?`LC 214/2025, ${N.textoOficial.localizacao.dispositivo}`:N.id))].join("; ")})? Ver o texto literal nas evid\xEAncias.`+(b.some(N=>N.combinacaoDosTipos)?" A combina\xE7\xE3o dos tipos de adquirente depende da decis\xE3o D2, pendente.":""):"O produto atende \xE0 descri\xE7\xE3o legal da regra? Ver as evid\xEAncias.")+(f.length?" H\xE1 resposta registrada no empresa.json, mas ela n\xE3o comprova valida\xE7\xE3o humana.":"")}}a?.modelo==="65"&&s.some(b=>b.referencia&&e.base.regras[b.referencia.indice]?.cClassTrib==="200043")&&c.push("Documento modelo 65 (NFC-e) com regra do 200043; o SVRS registra IndNfce = false para o 200043. S\xF3 informa\xE7\xE3o: o tratamento depende da decis\xE3o D4, pendente."),o.aliquotaUsada.some(b=>b.tipo==="projecao")&&u.add(14);let y=b=>b==="NORMA_CONFIRMADA"||b==="NORMA_POSSIVEL_MULTIPLOS_ITENS"?"oficial":b==="SEM_EVIDENCIA_OFICIAL"?"planilha":"pendente",T=s.map(b=>b.statusNormativo),w=new Set(T.map(y)),_=T.some(b=>b==="CONFLITO_PLANILHA_FONTE"||b==="CONFLITO_ENTRE_FONTES")?"divergente":w.size===0?"pendente":w.size===1?[...w][0]:"misto",g=["D2","D3","D4","D5","D6","D7"],x={fase:"A_INFORMATIVA",regras:s,statusBeneficio:S,humanoConfirmou:[],ausencias:[...d],validacoesLegadas:v,lacunas:p,decisoesPendentes:g.filter(b=>l.has(b)).map(b=>co(b)),matriz:{versao:e.matriz.versao,hash:e.matriz.hash,situacoes:[...u].sort((b,I)=>b-I),efeito:"somente_explicacao"},nivelEvidencia:_,limitacoes:[...new Set(c)],reducaoDoItem:Qd(o,s),lacunasDeCobertura:e.auditoria?e.auditoria.lacunasPorNcm.get(o.ncm??"")??[]:[]};return{...o,explicacaoInformativa:x}}function Qd(o,e){let a=t=>{let r=e.find(i=>i.regraIdInformado===t);return{regraId:t,...r?.reducao??Rr(`A regra ${t} n\xE3o foi identificada pelo explicador.`)}};if(o.regraAplicada===W.fundamento)return{situacao:"regime_especifico",opcoes:[],coerenciaEconomia:null,regimeEspecifico:{valor:W.reducao,fundamento:W.fundamento,origem:"regime_especifico_motor"}};if(o.regraAplicada){let t=a(o.regraAplicada),r=null;return o.estado==="INCORRETO_ECONOMIA"&&t.valor!==null&&o.valorPago!==null&&o.economiaPotencial!==null&&(r=Math.abs(o.economiaPotencial-o.valorPago*t.valor)<=Xd),{situacao:"aplicada",opcoes:[t],regimeEspecifico:null,coerenciaEconomia:r}}if(o.estado==="REQUER_VALIDACAO"&&o.regrasCandidatas.length){let t=new Set((o.regrasNaoAplicaveis??[]).map(i=>i.regraId)),r=[...new Set(o.regrasCandidatas)].filter(i=>!t.has(i));return r.length?{situacao:"prevista",opcoes:r.map(a),regimeEspecifico:null,coerenciaEconomia:null}:null}return null}function Wn(o,e,a=[]){let t=new Map(a.map(r=>[r.chave??r.arquivo,r]));return o.map(r=>Or(r,e,t.get(r.documento)))}var Ko,Yo,qd,Bd,jd,Xn,La,kd,Xd,at=O(()=>{"use strict";m();no();de();Ko=ce(Ae(),1);Ta();Ma();Yo=o=>We("sha256").update(o).digest("hex");qd={concorda:"NORMA_CONFIRMADA",item_entre_varios:"NORMA_POSSIVEL_MULTIPLOS_ITENS",item_divergente:"CONFLITO_PLANILHA_FONTE",ncm_so_na_F1:"CONFLITO_ENTRE_FONTES",ncm_so_na_F2:"CONFLITO_ENTRE_FONTES"},Bd={NORMA_CONFIRMADA:1,NORMA_POSSIVEL_MULTIPLOS_ITENS:2,CONFLITO_PLANILHA_FONTE:5,CONFLITO_ENTRE_FONTES:6,SEM_EVIDENCIA_OFICIAL:4},jd=["id","ncm","cst","cClassTrib","tratamento","reducaoAliquota","anexo","item","fundamentoLegal","rotulo","descricaoLegal","descricaoNcmTipi","ncmCitadoNaLei","origemRegistro","observacao","vigenciaInicio","vigenciaFim","fonte"],Xn=new WeakMap;La=o=>({camada:"FONTE_DIZ",...o});kd={anexo:"anexo_arabico_romano",reducaoAliquota:"percentual_para_fracao",fundamentoLegal:"comparacao_fundamento",vigenciaInicio:"vigencia_art544_por_exclusao"};Xd=.005});function Kn(o){let e=o.valores.find(c=>c.fonte==="F2"&&typeof c.valor=="string")?.valor,a=e?.split("#")[1],t=o.valores.map(c=>c.fato).filter(c=>!!c&&c.fonte==="F1"),r=[...new Set(t.map(da).filter(c=>!!c))],i=t.find(c=>tu(c)===a),n=[e?`o SVRS apresenta o link ${e}`:"o SVRS n\xE3o apresenta link nas evid\xEAncias",r.length?`as evid\xEAncias da LC 214/2025 citam ${r.join("; ")}`:"n\xE3o h\xE1 dispositivo da LC 214/2025 nas evid\xEAncias"],s=i&&a?`O sistema relacionou a \xE2ncora "${a}" do link ao dispositivo ${da(i)} da LC 214/2025; o link, sozinho, n\xE3o identifica par\xE1grafo nem inciso.`:"O sistema n\xE3o relacionou o link a um dispositivo da LC 214/2025.";return{fonte:`Nas fontes, ${n.join(", e ")}.`,inferencia:s}}function ru(o){let e=o.explicacaoInformativa;if(!e)return[];let a=[],t=new Set,r=(n,s,c,l={})=>{let d=`${n}:${o.documento}:${o.nItem}:${s}`;if(t.has(d))return;t.add(d);let u=Wd[n];a.push({id:d,codigo:n,categoria:es[n],camada:as[n],titulo:Jd[n],mensagem:c,item:{documento:o.documento,nItem:o.nItem,cProd:o.cProd,ncm:o.ncm},estadoDoVeredito:o.estado,regras:l.regras??[],nivelEvidencia:e.nivelEvidencia,limitacao:l.limitacao??null,situacoesMatriz:u&&e.matriz.situacoes.includes(u)?[u]:[],origem:l.origem??[],...l.decisoes?{decisoes:l.decisoes}:{},efeito:"somente_exibicao"})};if(e.regras.length>1){let n=new Map;for(let c of e.regras){let l=Yn(c.regraIdInformado)??"c\xF3digo n\xE3o identificado";n.set(l,(n.get(l)??0)+1)}let s=[...n].map(([c,l])=>`${l} do ${c}`).join(" e ");r("MULTIPLAS_REGRAS_CANDIDATAS","regras",`H\xE1 ${e.regras.length} regras candidatas para este item (${s}).`,{regras:e.regras.map(Ce),origem:["regras"]})}if(e.regras.forEach((n,s)=>{let c=`regras[${s}]`;if(n.sinalizadores.includes("DEPENDE_COMPOSICAO_PRODUTO")){let l=[...new Set(n.fonteDiz.filter(p=>p.fonte==="F1").map(da).filter(p=>!!p&&p.startsWith("Anexo")))],d=l[0]?.match(/^Anexo (\S+),/)?.[1]??"",u=l.map(p=>p.replace(/^Anexo \S+, item /,""));r("MULTIPLOS_ITENS_DO_ANEXO",`anexo-${d}-${u.join(",")}`,`A NCM aparece em ${u.length} itens do Anexo ${d} (${u.join(", ")}); o item depende da composi\xE7\xE3o do produto.`,{regras:[Ce(n)],origem:[`${c}.fonteDiz`,`${c}.sinalizadores`]})}if(n.vinculo==="nao_localizado"&&r("REGRA_NAO_LOCALIZADA",n.regraIdInformado,`O identificador ${n.regraIdInformado} n\xE3o corresponde a uma \xFAnica regra da base; nenhuma evid\xEAncia foi vinculada.`,{regras:[Ce(n)],origem:[`${c}.vinculo`],limitacao:la(e,n.regraIdInformado)}),n.vinculo==="ambiguo_regraid_duplicado"){let l=n.divergencias.find(u=>u.tipo==="regraid_duplicado"),d=l?.regras.map(u=>u.linha)??[];r("REGRAID_AMBIGUO",n.regraIdInformado,`O identificador ${n.regraIdInformado} corresponde a ${d.length} regras (linhas ${d.join(" e ")}); nenhuma foi escolhida.`,{regras:l?.regras.map(u=>({regraId:u.regraId,indice:u.indice,linha:u.linha}))??[Ce(n)],origem:[`${c}.vinculo`,`${c}.divergencias`],limitacao:la(e,n.regraIdInformado)})}if(n.statusNormativo==="CONFLITO_ENTRE_FONTES"){let l=n.divergencias.find(d=>d.tipo==="ncm_so_na_F1"||d.tipo==="ncm_so_na_F2");r("CONFLITO_ENTRE_FONTES",n.regraIdInformado,`A LC 214 e o SVRS divergem sobre a NCM ${o.ncm} no ${l?.cClassTrib??Yn(n.regraIdInformado)??""}; nenhuma fonte foi escolhida.`,{regras:[Ce(n)],origem:[`${c}.statusNormativo`,`${c}.divergencias`],limitacao:la(e,"fontes oficiais divergem")})}n.divergencias.forEach((l,d)=>{let u=`${c}.divergencias[${d}]`,p=l.valores.find(f=>f.fonte==="BASE_ATUAL")?.valor;if(l.tipo==="item_divergente"){let f=[...new Set(l.valores.filter(v=>v.fonte==="F1"&&typeof v.valor=="string").map(v=>v.valor.split(" | ")[0]))].join(", ");r("CONFLITO_PLANILHA_FONTE",n.regraIdInformado,`LC 214 e SVRS associam a NCM ao item ${f}; a base (planilha) traz o item ${String(p)}.`,{regras:[Ce(n)],origem:[u]})}if(l.tipo==="fundamento_legal"){let f=Kn(l);r("FUNDAMENTO_DIVERGENTE",l.cClassTrib??n.regraIdInformado,`A base cita ${String(p)}. ${f.fonte} ${f.inferencia} Diferen\xE7a de texto do fundamento; nenhuma cita\xE7\xE3o foi escolhida.`,{regras:[Ce(n)],origem:[u]})}if(l.tipo==="fundamento_a_revisar"){let f=Kn(l);r("FUNDAMENTO_A_REVISAR",l.cClassTrib??n.regraIdInformado,`A base cita ${String(p)}. ${f.fonte} ${f.inferencia}`,{regras:[Ce(n)],origem:[u]})}if(l.tipo==="vigencia"){let f=l.valores.map(v=>v.fonte==="BASE_ATUAL"?`base: ${String(v.valor)}`:v.fonte==="F1"?`LC 214/2025${v.fato&&da(v.fato)?`, ${da(v.fato)}`:""}: \u201C${String(v.valor)}\u201D`:`SVRS, in\xEDcio do c\xF3digo: ${String(v.valor)}`);r("VIGENCIA_A_REVISAR",l.cClassTrib??n.regraIdInformado,`As fontes trazem datas diferentes para atributos diferentes (${f.join("; ")}).`,{regras:[Ce(n)],origem:[u]})}}),n.condicoes.forEach((l,d)=>{let u=da(l.textoOficial),p=`O benef\xEDcio depende de uma condi\xE7\xE3o da norma: \u201C${l.textoOficial.trecho??""}\u201D (${u?`LC 214/2025, ${u}`:l.id}). O XML n\xE3o comprova essa condi\xE7\xE3o.`;p+=" Isso importa porque o benef\xEDcio s\xF3 se aplica se a condi\xE7\xE3o for atendida, e s\xF3 uma pessoa pode confirmar isso.",l.textoPlanilha&&(p+=` Texto da planilha (linha ${l.textoPlanilha.linha}, ${l.textoPlanilha.coluna}): \u201C${l.textoPlanilha.valor}\u201D.`),l.combinacaoDosTipos?.status==="pendente"&&(p+=" A combina\xE7\xE3o dos tipos de comprador ainda n\xE3o foi definida (refer\xEAncia t\xE9cnica: D2)."),p+=` ${ts(o)?Yd:Kd}`,r("CONDICAO_NAO_COMPROVADA",l.id,p,{regras:e.regras.filter(f=>f.condicoes.some(v=>v.id===l.id)).map(Ce),origem:[`${c}.condicoes[${d}]`],...l.combinacaoDosTipos?.status==="pendente"?{decisoes:["D2"]}:{}})})}),e.lacunas.length?e.lacunas.forEach((n,s)=>{let c=[...new Set(n.fatos.filter(d=>d.fonte==="F1").map(da).filter(d=>!!d))],l=[...n.fatos.some(d=>d.fonte==="F2")?[`SVRS, lista do ${n.cClassTrib}`]:[],...c.map(d=>`LC 214/2025, ${d}`)];r("LACUNA_FONTE_SEM_REGRA",n.id,`A NCM ${n.ncm} consta da fonte oficial para o ${n.cClassTrib} (${l.join("; ")}), e a base n\xE3o tem regra correspondente. O estado ${o.estado} foi produzido pelo motor e n\xE3o foi alterado.`,{origem:[`lacunas[${s}]`],limitacao:la(e,"a base atual n\xE3o tem regra correspondente"),decisoes:["D5"]})}):e.ausencias.includes("SEM_REGRA_NA_BASE")&&o.informado.cst!=="000"&&r("SEM_REGRA_NA_BASE","ausencia","A base n\xE3o tem regra de benef\xEDcio para esta NCM.",{origem:["ausencias"]}),e.nivelEvidencia==="misto"){let n=[...new Set(e.regras.map(s=>s.statusNormativo==="SEM_EVIDENCIA_OFICIAL"?"s\xF3 planilha":s.statusNormativo?"oficial":"pendente"))];r("EVIDENCIA_MISTA","nivel",`As regras candidatas t\xEAm n\xEDveis de evid\xEAncia diferentes (${n.join(" e ")}).`,{regras:e.regras.map(Ce),origem:["nivelEvidencia"]})}e.validacoesLegadas.forEach((n,s)=>{let c=n.registro,l=o.regraAplicada===c.regraId||o.regrasCandidatas.includes(c.regraId),d=`Este item possui uma resposta hist\xF3rica ${c.resposta==="NAO"?"N\xC3O":"SIM"}, registrada em ${eu(c.data)}, `+(l?"que foi utilizada no c\xE1lculo deste resultado.":"que n\xE3o corresponde \xE0s regras candidatas deste item e n\xE3o foi utilizada no c\xE1lculo.");d+=` A resposta \xE9 mantida como registro hist\xF3rico e n\xE3o equivale a uma confirma\xE7\xE3o humana atual: n\xE3o h\xE1 confirma\xE7\xE3o humana com autoria registrada (${au[n.classificacao]??n.classificacao}).`,d+=" Para uma confirma\xE7\xE3o formal com autoria, ser\xE1 necess\xE1rio utilizar o fluxo de valida\xE7\xE3o humana quando essa funcionalidade estiver dispon\xEDvel.",d+=` ${Sr("D6")}`,r("VALIDACAO_LEGADA",`${c.ncm}|${c.cProd}|${c.regraId}`,d,{regras:e.regras.filter(u=>u.regraIdInformado===c.regraId).map(Ce),origem:[`validacoesLegadas[${s}]`],decisoes:["D6"],limitacao:n.classificacao==="autor_sistema_nao_e_confirmacao_humana"?la(e,'autor fixo "Sistema"'):n.classificacao==="sem_hash_das_fontes_na_data"?la(e,"sem o hash das fontes"):null})}),e.decisoesPendentes.forEach((n,s)=>{if(n.decisao==="D3")return;let c=yr[n.decisao];r("DECISAO_PENDENTE",n.decisao,`${c.situacao} ${c.motivo} ${os} ${Sr(n.decisao)}`,{origem:[`decisoesPendentes[${s}]`],decisoes:[n.decisao]})});let i=la(e,"IndNfce = false");return i&&r("INFORMACAO_OPERACIONAL_SVRS","IndNfce","O SVRS indica que o c\xF3digo 200043 n\xE3o \xE9 habilitado para NFC-e (IndNfce = false), e este documento \xE9 uma NFC-e (modelo 65). O tratamento desse caso ainda n\xE3o foi definido (refer\xEAncia t\xE9cnica: D4).",{limitacao:i,origem:["limitacoes"],decisoes:["D4"]}),e.matriz.situacoes.includes(14)&&r("ALIQUOTA_PROJETADA","aliquota","Valores calculados com al\xEDquota projetada, n\xE3o oficial.",{origem:["matriz.situacoes"]}),a.sort((n,s)=>Zn.indexOf(n.categoria)-Zn.indexOf(s.categoria))}function nu(o){let e=[{chave:"VALIDACAO_HUMANA_NAO_DISPONIVEL",codigo:"VALIDACAO_HUMANA_NAO_DISPONIVEL",titulo:"Lote: valida\xE7\xE3o humana n\xE3o registrada",filtro:t=>t.ausencias.includes("VALIDACAO_HUMANA_NAO_DISPONIVEL"),mensagem:(t,r)=>{let i=r.filter(ts).length,n=i?`A\xE7\xE3o dispon\xEDvel: ${i} destes itens aparecem na tela de Pend\xEAncias, onde \xE9 poss\xEDvel responder SIM ou N\xC3O para a regra; essa resposta passa a ser usada no c\xE1lculo, mas hoje \xE9 gravada sem autoria (autor fixo "Sistema") e n\xE3o equivale a confirma\xE7\xE3o humana. Para os demais ${t-i} itens, a interface n\xE3o permite concluir essa confirma\xE7\xE3o.`:"Nenhum destes itens aparece na tela de Pend\xEAncias, e a interface n\xE3o permite concluir essa confirma\xE7\xE3o; a situa\xE7\xE3o permanece pendente at\xE9 que o fluxo de valida\xE7\xE3o correspondente esteja dispon\xEDvel.";return`Alerta de lote (${t} itens): estes itens t\xEAm regra de benef\xEDcio que depende de o produto atender \xE0 descri\xE7\xE3o e \xE0s condi\xE7\xF5es da regra, mas n\xE3o h\xE1 valida\xE7\xE3o humana com autoria registrada para eles. Isso importa porque s\xF3 uma pessoa pode confirmar se o produto atende \xE0 regra. ${n}`}},{chave:"DECISAO_PENDENTE:D3",codigo:"DECISAO_PENDENTE",titulo:"Lote: pol\xEDtica pendente para regras com v\xEDnculo NCM \xD7 item n\xE3o CONFIRMADO",decisoes:["D3"],filtro:t=>t.decisoesPendentes.some(r=>r.decisao==="D3"),mensagem:(t,r)=>{let i=new Map;for(let s of r)i.set(s.explicacaoInformativa.nivelEvidencia,(i.get(s.explicacaoInformativa.nivelEvidencia)??0)+1);let n=[...i].sort((s,c)=>c[1]-s[1]).map(([s,c])=>`${c} ${iu[s]}`).join("; ");return`Alerta de lote (${t} itens): ${yr.D3.situacao} ${yr.D3.motivo} N\xEDvel de evid\xEAncia registrado nos itens: ${n}. ${os} ${Sr("D3")}`}},{chave:"SEM_REGRA_NA_BASE",codigo:"SEM_REGRA_NA_BASE",titulo:"Lote: sem regra de benef\xEDcio na base",filtro:t=>t.ausencias.includes("SEM_REGRA_NA_BASE")&&t.lacunas.length===0,mensagem:t=>`Alerta de lote (${t} itens): a base n\xE3o tem regra de benef\xEDcio para a NCM destes itens.`}],a=[];for(let t of e){if(!ou.has(t.chave))continue;let r=o.filter(n=>n.explicacaoInformativa&&t.filtro(n.explicacaoInformativa));if(!r.length)continue;let i=r.map(n=>({documento:n.documento,nItem:n.nItem}));a.push({codigo:t.codigo,categoria:es[t.codigo],camada:as[t.codigo],titulo:t.titulo,mensagem:t.mensagem(i.length,r),itens:i.length,exemplos:i.slice(0,5),itensAfetados:i,...t.decisoes?{decisoes:t.decisoes}:{},efeito:"somente_exibicao"})}return a}function ot(o){return{porItem:o.flatMap(ru),lote:nu(o)}}var Jd,es,as,Wd,Zd,yr,Sr,os,Yd,Kd,ts,eu,au,ou,Zn,Yn,da,tu,Ce,la,iu,wr=O(()=>{"use strict";m();Jd={MULTIPLAS_REGRAS_CANDIDATAS:"Mais de uma regra candidata",MULTIPLOS_ITENS_DO_ANEXO:"NCM em mais de um item do anexo",REGRA_NAO_LOCALIZADA:"Regra n\xE3o localizada com seguran\xE7a",REGRAID_AMBIGUO:"Identificador de regra repetido",SEM_REGRA_NA_BASE:"Sem regra de benef\xEDcio na base",LACUNA_FONTE_SEM_REGRA:"NCM na fonte oficial sem regra na base",CONFLITO_ENTRE_FONTES:"Fontes oficiais divergentes",CONFLITO_PLANILHA_FONTE:"Item da base diferente das fontes oficiais",FUNDAMENTO_DIVERGENTE:"Fundamento legal diferente das fontes oficiais",FUNDAMENTO_A_REVISAR:"Fundamento legal a revisar",VIGENCIA_A_REVISAR:"Datas de vig\xEAncia diferentes nas fontes",EVIDENCIA_MISTA:"N\xEDveis de evid\xEAncia diferentes entre as candidatas",VALIDACAO_LEGADA:"Resposta hist\xF3rica utilizada",VALIDACAO_HUMANA_NAO_DISPONIVEL:"Valida\xE7\xE3o humana n\xE3o registrada",DECISAO_PENDENTE:"Defini\xE7\xE3o pendente (a\xE7\xE3o ainda n\xE3o dispon\xEDvel)",CONDICAO_NAO_COMPROVADA:"Condi\xE7\xE3o da norma n\xE3o comprovada pelo XML",INFORMACAO_OPERACIONAL_SVRS:"Informa\xE7\xE3o operacional do SVRS",ALIQUOTA_PROJETADA:"Al\xEDquota projetada"},es={MULTIPLAS_REGRAS_CANDIDATAS:"ATENCAO",MULTIPLOS_ITENS_DO_ANEXO:"ATENCAO",REGRA_NAO_LOCALIZADA:"ATENCAO",REGRAID_AMBIGUO:"ATENCAO",SEM_REGRA_NA_BASE:"INFORMACAO",LACUNA_FONTE_SEM_REGRA:"LACUNA",CONFLITO_ENTRE_FONTES:"CONFLITO",CONFLITO_PLANILHA_FONTE:"CONFLITO",FUNDAMENTO_DIVERGENTE:"CONFLITO",FUNDAMENTO_A_REVISAR:"ATENCAO",VIGENCIA_A_REVISAR:"ATENCAO",EVIDENCIA_MISTA:"INFORMACAO",VALIDACAO_LEGADA:"ATENCAO",VALIDACAO_HUMANA_NAO_DISPONIVEL:"PENDENCIA",DECISAO_PENDENTE:"PENDENCIA",CONDICAO_NAO_COMPROVADA:"PENDENCIA",INFORMACAO_OPERACIONAL_SVRS:"INFORMACAO",ALIQUOTA_PROJETADA:"INFORMACAO"},as={MULTIPLAS_REGRAS_CANDIDATAS:"SISTEMA_INFERE",MULTIPLOS_ITENS_DO_ANEXO:"FONTE_DIZ",REGRA_NAO_LOCALIZADA:"SISTEMA_INFERE",REGRAID_AMBIGUO:"SISTEMA_INFERE",SEM_REGRA_NA_BASE:"SISTEMA_INFERE",LACUNA_FONTE_SEM_REGRA:"FONTE_DIZ",CONFLITO_ENTRE_FONTES:"FONTE_DIZ",CONFLITO_PLANILHA_FONTE:"FONTE_DIZ",FUNDAMENTO_DIVERGENTE:"FONTE_DIZ",FUNDAMENTO_A_REVISAR:"FONTE_DIZ",VIGENCIA_A_REVISAR:"FONTE_DIZ",EVIDENCIA_MISTA:"SISTEMA_INFERE",VALIDACAO_LEGADA:"SISTEMA_INFERE",VALIDACAO_HUMANA_NAO_DISPONIVEL:"SISTEMA_INFERE",DECISAO_PENDENTE:"SISTEMA_PODE_DECIDIR",CONDICAO_NAO_COMPROVADA:"FONTE_DIZ",INFORMACAO_OPERACIONAL_SVRS:"FONTE_DIZ",ALIQUOTA_PROJETADA:"FONTE_DIZ"},Wd={MULTIPLOS_ITENS_DO_ANEXO:2,LACUNA_FONTE_SEM_REGRA:3,CONFLITO_PLANILHA_FONTE:5,CONFLITO_ENTRE_FONTES:6,VIGENCIA_A_REVISAR:7,FUNDAMENTO_DIVERGENTE:8,FUNDAMENTO_A_REVISAR:8,INFORMACAO_OPERACIONAL_SVRS:9,CONDICAO_NAO_COMPROVADA:10,VALIDACAO_LEGADA:11,VALIDACAO_HUMANA_NAO_DISPONIVEL:12,REGRAID_AMBIGUO:13,ALIQUOTA_PROJETADA:14},Zd={D2:'combina\xE7\xE3o dos tipos de adquirente do 200043: "e" na lei, "ou" na planilha',D3:"pol\xEDtica para regras cujo v\xEDnculo NCM \xD7 item com a fonte oficial n\xE3o est\xE1 CONFIRMADO",D4:"tratamento do 200043 em NFC-e",D5:"inclus\xE3o ou n\xE3o das NCMs oficiais sem regra",D6:"tratamento das valida\xE7\xF5es legadas",D7:"formato da chave est\xE1vel da regra"},yr={D2:{situacao:"A lei e a planilha descrevem de forma diferente quem pode ser o comprador neste benef\xEDcio: a lei usa \u201Ce\u201D e a planilha usa \u201Cou\u201D ao listar administra\xE7\xE3o p\xFAblica direta, autarquias e funda\xE7\xF5es.",motivo:"Essa defini\xE7\xE3o determina quais compradores d\xE3o direito \xE0 redu\xE7\xE3o."},D3:{situacao:"estes itens t\xEAm ao menos uma regra candidata cujo v\xEDnculo NCM \xD7 item com a fonte oficial n\xE3o est\xE1 CONFIRMADO (a confer\xEAncia apontou diverg\xEAncia, mais de um item poss\xEDvel, aus\xEAncia nas fontes ou n\xE3o p\xF4de ser feita).",motivo:"Ainda n\xE3o foi definida a pol\xEDtica para esses casos, o que afeta a confian\xE7a nos resultados desses itens."},D4:{situacao:"Ainda n\xE3o foi definido como tratar este c\xF3digo quando usado em NFC-e: o SVRS indica que ele n\xE3o \xE9 habilitado para esse modelo de documento.",motivo:"Isso afeta apenas documentos modelo 65 (NFC-e)."},D5:{situacao:"A NCM consta da fonte oficial para este benef\xEDcio, mas a base n\xE3o tem regra correspondente.",motivo:"Sem uma regra na base, a avalia\xE7\xE3o deste item n\xE3o considera essa fonte oficial; falta definir se a regra deve ser inclu\xEDda."},D6:{situacao:"Existe uma resposta hist\xF3rica para este item, mas ela n\xE3o possui confirma\xE7\xE3o humana com autoria registrada.",motivo:"Falta definir como essas respostas hist\xF3ricas devem ser tratadas; hoje o c\xE1lculo usa as que correspondem \xE0s regras do item."},D7:{situacao:"Duas regras da base t\xEAm o mesmo identificador, e o sistema n\xE3o consegue saber a qual delas uma resposta se refere.",motivo:"Isso impede associar com seguran\xE7a uma resposta de valida\xE7\xE3o a uma \xFAnica regra."}},Sr=o=>`Refer\xEAncia t\xE9cnica: ${o} \u2014 ${Zd[o]}.`,os="No momento, a interface n\xE3o permite registrar essa defini\xE7\xE3o; a situa\xE7\xE3o permanece pendente at\xE9 que o fluxo correspondente esteja dispon\xEDvel.",Yd='A\xE7\xE3o dispon\xEDvel: este item aparece na tela de Pend\xEAncias, onde \xE9 poss\xEDvel responder SIM ou N\xC3O para a regra. Essa resposta passa a ser usada no c\xE1lculo, mas hoje \xE9 gravada sem autoria (autor fixo "Sistema") e n\xE3o equivale a confirma\xE7\xE3o humana.',Kd="No momento, a interface n\xE3o permite concluir essa confirma\xE7\xE3o para este item; a situa\xE7\xE3o permanece pendente at\xE9 que o fluxo de valida\xE7\xE3o correspondente esteja dispon\xEDvel.",ts=o=>o.estado==="REQUER_VALIDACAO"&&!!o.ncm,eu=o=>{let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(o);return e?`${e[3]}/${e[2]}/${e[1]}`:o},au={autor_sistema_nao_e_confirmacao_humana:'a tela de valida\xE7\xE3o envia o autor fixo "Sistema" e a rota tamb\xE9m grava "Sistema" quando n\xE3o recebe autor; a autoria n\xE3o foi coletada e n\xE3o foi reconstru\xEDda; o registro n\xE3o indica decis\xE3o autom\xE1tica do sistema nem valida\xE7\xE3o humana comprovada',sem_hash_das_fontes_na_data:"h\xE1 autor e justificativa, mas o registro n\xE3o guarda o hash das fontes na data da resposta",autor_humano_sem_justificativa:"h\xE1 autor, mas o registro n\xE3o tem justificativa",chave_por_regraid_duplicado:"o registro usa um identificador de regra que corresponde a mais de uma regra",chave_por_produto_em_condicao_de_adquirente:"o registro est\xE1 por produto, e a condi\xE7\xE3o do c\xF3digo \xE9 do adquirente"},ou=new Set(["VALIDACAO_HUMANA_NAO_DISPONIVEL","DECISAO_PENDENTE:D3","SEM_REGRA_NA_BASE"]),Zn=["CONFLITO","LACUNA","PENDENCIA","ATENCAO","INFORMACAO"],Yn=o=>/^\d{8}-(\d{6})-/.exec(o)?.[1]??null,da=o=>"dispositivo"in o.localizacao?o.localizacao.dispositivo:null,tu=o=>"ancora"in o.localizacao?o.localizacao.ancora:null,Ce=o=>({regraId:o.regraIdInformado,indice:o.referencia?.indice??null,linha:o.referencia?.linha??null}),la=(o,e)=>o.limitacoes.find(a=>a.includes(e))??null;iu={planilha:"s\xF3 planilha",misto:"misto (regras com evid\xEAncia oficial e regras s\xF3 da planilha)",oficial:"oficial",divergente:"divergente",pendente:"pendente"}});function ua(o){let e=Lo;if(e)return e(o);let a=We("sha256"),t=To(o,"r");try{let r=R.Buffer.alloc(rs),i;for(;(i=_o(t,r,0,rs,null))>0;)a.update(r.subarray(0,i))}finally{Mo(t)}return a.digest("hex")}function is(o,e,a=1024*1024){if(!U(o))return null;let t=To(o,"r");try{let r=R.Buffer.alloc(a),i=_o(t,r,0,a,0),n=r.subarray(0,i).toString("utf8"),s=n.indexOf(`"${e}"`);return s<0?null:JSON.parse(n.slice(0,s).replace(/,\s*$/,"")+"}")}catch{return null}finally{Mo(t)}}var rs,lo=O(()=>{"use strict";m();de();no();rs=4*1024*1024});function Tr(o){let e=[];for(let a of Oe(o)){let t=(0,ze.join)(o,a);if(Ha(t).isDirectory())e.push(...Tr(t));else if((0,ze.extname)(a).toLowerCase()===".xml")e.push(t);else if((0,ze.extname)(a).toLowerCase()===".zip"){let r=Ga((0,ze.join)(Bo(),"xmlzip-"));qo("unzip",["-qq","-o",t,"-d",r]),e.push(...Tr(r))}}return e}function _r(o,e){let a=r=>{let{calculadoEm:i,...n}=r;return delete n.explicacaoInformativa,JSON.stringify(n)},t=[];o.length!==e.length&&t.push(`quantidade de vereditos: ${o.length} \xD7 ${e.length}`);for(let r=0;r<Math.min(o.length,e.length);r++)a(o[r])!==a(e[r])&&t.push(`veredito ${r} (${o[r].documento}, item ${o[r].nItem})`);return t}function ns(o){let e=o.arquivoBase??"data/base-normativa.json",a=o.arquivoV2??"data/base-normativa.v2.json",t=o.arquivoMatriz??"docs/etapa6/matriz-decisao.json",r=(0,ze.join)(o.saida,"explicacoes.json"),i=(0,ze.join)(o.saida,"reducoes-exibicao.json"),n=(0,ze.join)(o.saida,"alertas.json"),s=()=>{Fe(n,{force:!0}),Fe(r,{force:!0})};o.limparAntes&&s();let c=JSON.parse(L(e,"utf8")),l=JSON.parse(L(o.arquivoEmpresa,"utf8")),d=Tr(o.pastaXml),u=d.map(x=>ro(L(x,"utf8"),x)),p=io(u),f=Wo(p.documentos,{base:c,empresa:l,validacoes:l.validacoes??[],naturezaPorProduto:new Map(Object.entries(l.naturezaPorProduto??{})),aceitarProjecao:l.aceitarProjecao??!1,regrasBloqueadas:_a(ca(e))});if(o.vereditosDeReferencia){let x=U(o.vereditosDeReferencia)?JSON.parse(L(o.vereditosDeReferencia,"utf8")):null,b=x?_r(x,f):["vereditos.json de refer\xEAncia ausente"];if(b.length)throw s(),new Error(`Alertas n\xE3o publicados: os vereditos desta execu\xE7\xE3o divergem do vereditos.json (${b.slice(0,3).join("; ")}${b.length>3?"; \u2026":""}).`)}let v=o.arquivoEmpresaExplicacao??o.arquivoEmpresa,C=et({base:e,v2:a,matriz:t,empresa:v}),S=Wn(f,C,p.documentos);ie(o.saida,{recursive:!0});let y={fase:"A_INFORMATIVA",aviso:"Explica\xE7\xE3o somente informativa. O estado de cada veredito foi produzido pelo motor atual e n\xE3o foi alterado. A matriz \xE9 s\xF3 citada.",entradas:{base:{caminho:e,sha256:uo(e)},v2:{caminho:a,sha256:uo(a)},matriz:{caminho:t,sha256:C.matriz.hash,versao:C.matriz.versao},empresa:{caminho:v,sha256:uo(v)}},avisos:C.avisos},T=S.map(x=>({documento:x.documento,nItem:x.nItem,ncm:x.ncm,cProd:x.cProd,produto:x.produto,estado:x.estado,exibicao:{reducao:x.explicacaoInformativa?.reducaoDoItem??null,auditoria:Object.fromEntries((x.explicacaoInformativa?.regras??[]).filter(b=>b.auditoriaOficial).map(b=>[b.regraIdInformado,b.auditoriaOficial])),lacunas:x.explicacaoInformativa?.lacunasDeCobertura??[],bloqueios:Object.fromEntries((x.explicacaoInformativa?.regras??[]).filter(b=>b.bloqueio).map(b=>[b.regraIdInformado,b.bloqueio]))}}));V(i,JSON.stringify(T),"utf8");let w=JSON.stringify(y,null,1).slice(0,-1)+`,
  "vereditos": [
`;V(r,w,"utf8");for(let x=0;x<S.length;x++){let b=JSON.stringify(S[x],null,1)+(x<S.length-1?`,
`:`
`);wo(r,b,"utf8")}wo(r,`  ]
}
`,"utf8");let _=ot(S),g=(x,b)=>x.reduce((I,N)=>(I[b(N)]=(I[b(N)]??0)+1,I),{});return V(n,JSON.stringify({fase:"B1_ALERTAS",aviso:"Alertas somente para exibi\xE7\xE3o, derivados de explicacoes.json. N\xE3o alteram o estado dos vereditos nem decidem pelo usu\xE1rio.",origem:{explicacoes:r,sha256:uo(r),...o.vereditosDeReferencia&&U(o.vereditosDeReferencia)?{vereditosSha256:uo(o.vereditosDeReferencia)}:{}},totais:{porItem:_.porItem.length,lote:_.lote.length,itensComAlertaDeItem:new Set(_.porItem.map(x=>`${x.item.documento}|${x.item.nItem}`)).size,porCategoria:g(_.porItem,x=>x.categoria),porCodigo:g(_.porItem,x=>x.codigo),lotePorCodigo:Object.fromEntries(_.lote.map(x=>[x.codigo+(x.decisoes?`:${x.decisoes.join(",")}`:""),x.itens]))},lote:_.lote,porItem:_.porItem},null,1)),{xmls:d.length,vereditos:S.length,arquivoExplicacoes:r,arquivoAlertas:n,alertasPorItem:_.porItem.length,alertasDeLote:_.lote.length,nivelEvidencia:g(S,x=>x.explicacaoInformativa.nivelEvidencia)}}var ze,uo,Mr=O(()=>{"use strict";m();de();ze=ce(Ae(),1);kt();$t();vr();Ta();Ma();at();wr();lo();uo=ua});function Ze(o){return String(o??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}function po(o){return o.map((e,a)=>[e,a]).sort((e,a)=>Lr.indexOf(e[0].categoria)-Lr.indexOf(a[0].categoria)||e[1]-a[1]).map(([e])=>e)}function cu(o){let e=new Map;for(let a of o){let t=Fr(a.item.documento,a.item.nItem);e.has(t)||e.set(t,[]),e.get(t).push(a)}for(let[a,t]of e)e.set(a,po(t));return e}function lu(o,e){let a=new Map;for(let r of e)r.estado!=="REQUER_VALIDACAO"||!r.ncm||a.set(Fr(r.documento,r.nItem),su(r.ncm,r.cProd,r.produto));let t=new Map;for(let r of o){let i=a.get(Fr(r.item.documento,r.item.nItem));if(!i)continue;t.has(i)||t.set(i,new Map);let n=t.get(i),s=`${r.codigo}\0${r.mensagem}`,c=n.get(s);c?(c.itens+=1,c.ocorrencias.push({documento:r.item.documento,nItem:r.item.nItem})):n.set(s,{codigo:r.codigo,categoria:r.categoria,titulo:r.titulo,mensagem:r.mensagem,itens:1,ocorrencias:[{documento:r.item.documento,nItem:r.item.nItem}],efeito:"somente_exibicao"})}return new Map([...t].map(([r,i])=>[r,po([...i.values()])]))}function du(o,e){return Lr.map(a=>({categoria:a,rotulo:ss[a],alertasDeItem:o.filter(t=>t.categoria===a).length,alertasDeLote:e.filter(t=>t.categoria===a).length}))}function uu(o){if(!o.length)return"";let e=po(o).map(a=>`<li>${rt(a.categoria)} <strong>${Ze(a.titulo)}</strong>: ${Ze(a.mensagem)}</li>`).join("");return`<details class="alertas-item"><summary>${o.length} alerta(s)</summary><ul>${e}</ul></details>`}function pu(o){return o.length?`<div class="alertas-cartao"><div class="small">Alertas (somente exibi\xE7\xE3o; n\xE3o alteram o resultado nem a valida\xE7\xE3o)</div><ul>${po(o).map(a=>`<li>${rt(a.categoria)} <strong>${Ze(a.titulo)}</strong>: ${Ze(a.mensagem)}`+(a.itens>1?` <span class="small">(em ${a.itens} itens)</span>`:"")+"</li>").join("")}</ul></div>`:""}function fu(o,e){let a=o.map(r=>`<tr><td>${rt(r.categoria)}</td><td>${r.alertasDeItem}</td><td>${r.alertasDeLote}</td></tr>`).join(""),t=po(e).map(r=>`<li>${rt(r.categoria)} <strong>${Ze(r.titulo)}</strong>: ${Ze(r.mensagem)}</li>`).join("");return`<h3>Alertas (somente exibi\xE7\xE3o)</h3><p class="small">Estes n\xFAmeros n\xE3o fazem parte dos indicadores acima e n\xE3o alteram nenhum resultado.</p><table class="alertas-totais"><thead><tr><th>Categoria</th><th>Alertas de item</th><th>Alertas de lote</th></tr></thead><tbody>${a}</tbody></table>`+(t?`<h4>Alertas de lote</h4><ul class="alertas-lote">${t}</ul>`:"")}function mu(o){return`<h3>Alertas (somente exibi\xE7\xE3o)</h3><p class="small">Alertas indispon\xEDveis: ${Ze(o)} Os resultados continuam v\xE1lidos e n\xE3o dependem dos alertas.</p>`}function gu(o,e){let a=cu(o.porItem),t=lu(o.porItem,e),r=du(o.porItem,o.lote);return{disponivel:!0,efeito:"somente_exibicao",origem:o.origem,totais:o.totais,totaisPorCategoria:r,porItemHtml:Object.fromEntries([...a].map(([i,n])=>[i,uu(n)])),porCartaoHtml:Object.fromEntries([...t].map(([i,n])=>[i,pu(n)])),painelHtml:fu(r,o.lote),lote:o.lote,porItem:o.porItem}}function cs(o){let e=(0,tt.join)(o,"alertas.json"),a=(0,tt.join)(o,"explicacoes.json"),t=(0,tt.join)(o,"vereditos.json");if(!U(e))return Fa("o arquivo alertas.json n\xE3o existe para os resultados atuais.");if(!U(a))return Fa("o arquivo explicacoes.json n\xE3o existe para os resultados atuais.");if(!U(t))return Fa("o arquivo vereditos.json n\xE3o existe.");try{let r=JSON.parse(L(e,"utf8"));if(ua(a)!==r.origem?.sha256)return Fa("o alertas.json n\xE3o corresponde ao explicacoes.json atual.");let i=Fa("os alertas foram gerados para resultados diferentes dos atuais.");if(r.origem.vereditosSha256){if(ua(t)!==r.origem.vereditosSha256)return i}else{let s=JSON.parse(L(a,"utf8")).vereditos;if(_r(JSON.parse(L(t,"utf8")),s).length)return i}let n=JSON.parse(L(t,"utf8"));return gu(r,n)}catch(r){return Fa(`n\xE3o foi poss\xEDvel ler os alertas (${r instanceof Error?r.message:String(r)}).`)}}var tt,Lr,ss,Fr,su,rt,Fa,ls=O(()=>{"use strict";m();de();tt=ce(Ae(),1);Mr();lo();Lr=["CONFLITO","LACUNA","PENDENCIA","ATENCAO","INFORMACAO"],ss={CONFLITO:"Conflito",LACUNA:"Lacuna",PENDENCIA:"Pend\xEAncia",ATENCAO:"Aten\xE7\xE3o",INFORMACAO:"Informa\xE7\xE3o"};Fr=(o,e)=>`${o}|${e}`,su=(o,e,a)=>`${o}|${e}|${a}`;rt=o=>`<span class="alerta-cat alerta-cat-${o}">${Ze(ss[o])}</span>`;Fa=o=>({disponivel:!1,motivo:o,painelHtml:mu(o)})});function ds(o){let e=Object.fromEntries(hu.map(N=>[N,{itens:0,base:0}])),a=0,t=0,r=0,i=0,n=0,s=0,c=0,l=0,d=!1,u=!1,p=0,f=0,v=new Map,C=new Map,S=new Map;for(let N of o){e[N.estado].itens+=1,e[N.estado].base+=N.baseCalculo,a+=N.baseCalculo,t+=N.economiaPotencial??0,(N.economiaPotencial??0)>0&&(n+=N.economiaPotencial),(N.economiaPotencial??0)<0&&(s-=N.economiaPotencial),r+=N.economiaSujeitaValidacao??0,i+=N.exposicao??0,N.valorIBSInformado!=null&&(c+=N.valorIBSInformado,d=!0),N.valorCBSInformado!=null&&(l+=N.valorCBSInformado,u=!0),p+=N.valorPago??0,f+=N.valorCorreto??0;for(let X of N.aliquotaUsada)v.set(`${X.tributo}|${X.aliquota}|${X.tipo}`,X);for(let X of N.dadosFaltantes)C.set(X,(C.get(X)??0)+1);let B=N.cProd||`${N.ncm}|${N.produto}`,M=S.get(B)??{correto:!1,incorreto:!1,ncm:!1,pendente:!1,avaliavel:!1};N.estado==="CORRETO"&&(M.correto=!0,M.avaliavel=!0),(N.estado==="INCORRETO_ECONOMIA"||N.estado==="INCORRETO_RISCO")&&(M.incorreto=!0,M.avaliavel=!0),N.estado==="INCORRETO_NCM"&&(M.ncm=!0,M.avaliavel=!0),N.estado==="REQUER_VALIDACAO"&&(M.pendente=!0,M.avaliavel=!0),S.set(B,M)}let y=0,T=0,w=0,_=0;for(let N of S.values())N.pendente?_+=1:N.ncm?w+=1:N.incorreto?T+=1:N.correto&&(y+=1);let g=w,x=y+T+w+_,b=e.CORRETO.itens+e.INCORRETO_ECONOMIA.itens+e.INCORRETO_RISCO.itens+e.INCORRETO_NCM.itens+e.REQUER_VALIDACAO.itens,I=[];for(let[N,B]of[...C].sort((M,X)=>X[1]-M[1]))I.push(`${B} ${B===1?"item depende":"itens dependem"} de: ${N}`);return[...v.values()].some(N=>N.tipo==="projecao")&&I.push("Ha valores calculados com aliquota de projecao, nao com aliquota publicada."),{itens:o.length,faturamento:Number(a.toFixed(2)),porEstado:e,itensAvaliados:b,codigosAvaliados:x,codigosCorretos:y,codigosIncorretos:g,codigosRecalculo:T,codigosNcmAjustar:w,codigosPendentes:_,valorIBSInformadoTotal:d?Number(c.toFixed(2)):null,valorCBSInformadoTotal:u?Number(l.toFixed(2)):null,valorInformadoTotal:d||u?Number((c+l).toFixed(2)):null,valorPagoTotal:Number(p.toFixed(2)),valorCorretoTotal:Number(f.toFixed(2)),percentualConformidade:x===0?null:y/x,economiaPotencial:Number(t.toFixed(2)),economiaRecalculo:Number(n.toFixed(2)),valorAPagarRecalculo:Number(s.toFixed(2)),economiaSujeitaValidacao:Number(r.toFixed(2)),exposicao:Number(i.toFixed(2)),pendentesDeValidacao:_,aliquotasUsadas:[...v.values()],alertas:I,versaoBase:o[0]?.versaoBase??null}}function us(o){let e=new Map;for(let a of o){let t=a.estado==="INCORRETO_RISCO"&&a.esperado===null&&a.regrasCandidatas.length>0;if(a.estado!=="REQUER_VALIDACAO"&&!t||!a.ncm)continue;let r=a.cProd,i=e.get(r);if(i){i.itens+=1,i.base=Number((i.base+a.baseCalculo).toFixed(2)),i.regras=[...new Set([...i.regras,...a.regrasCandidatas])];for(let n of a.regrasNaoAplicaveis??[])i.regrasNaoAplicaveis.some(s=>s.regraId===n.regraId)||i.regrasNaoAplicaveis.push(n)}else e.set(r,{ncm:a.ncm,cProd:a.cProd,produto:a.produto,itens:1,base:a.baseCalculo,regras:a.regrasCandidatas,regrasNaoAplicaveis:[...a.regrasNaoAplicaveis??[]],motivo:a.motivo})}return[...e.values()].sort((a,t)=>t.base-a.base)}var hu,ps=O(()=>{"use strict";m();hu=["CORRETO","INCORRETO_ECONOMIA","INCORRETO_RISCO","REQUER_VALIDACAO","NAO_OBRIGATORIO","INCORRETO_NCM","INDETERMINADO"]});function it(o){let e=[];for(let a of Oe(o)){let t=(0,Se.join)(o,a);if(Ha(t).isDirectory())e.push(...it(t));else if((0,Se.extname)(a).toLowerCase()===".xml")e.push(t);else if((0,Se.extname)(a).toLowerCase()===".zip"){let r=Ga((0,Se.join)(Bo(),"xmlzip-"));qo("unzip",["-qq","-o",t,"-d",r]),e.push(...it(r))}}return e}function fs(o){let a=o.filter(r=>U(r)).flatMap(it).map(r=>ro(L(r,"utf8"),r)),t=io(a).documentos.map(r=>We("sha256").update(`conformidade-ibs-cbs:${r.chave??`arquivo:${ua(r.arquivo)}`}`).digest("hex"));return[...new Set(t)]}function vu(o,e,a){let t=c=>c.split(/[\\/]/).pop()??c,r=e.flatMap((c,l)=>c.documentos.length===0&&c.cancelamentos.size>0?[{arquivo:t(o[l]),tipo:"evento de cancelamento (tpEvento 110111)",chaves:[...c.cancelamentos]}]:[]),i=e.flatMap(c=>c.ignorados.map(l=>({arquivo:t(l.arquivo),motivo:l.motivo}))),n=a.descartados.filter(c=>!i.some(l=>l.arquivo===t(c.documento))),s={};for(let c of n)s[c.motivo]=(s[c.motivo]??0)+1;return{arquivos:o.length,documentosLidos:e.reduce((c,l)=>c+l.documentos.length,0),documentosAnalisados:a.documentos.length,eventos:r,naoReconhecidos:i,descartados:n,descartadosPorMotivo:s}}function ms(o,e,a,t="data/base-normativa.json"){let r=JSON.parse(L(t,"utf8")),i=JSON.parse(L(e,"utf8")),n=it(o),s=n.map(p=>ro(L(p,"utf8"),p)),c=io(s),l=Wo(c.documentos,{base:r,empresa:i,validacoes:i.validacoes??[],naturezaPorProduto:new Map(Object.entries(i.naturezaPorProduto??{})),aceitarProjecao:i.aceitarProjecao??!1,regrasBloqueadas:_a(ca(t))}),d=ds(l),u=us(l);return ie(a,{recursive:!0}),V((0,Se.join)(a,"vereditos.json"),JSON.stringify(l,null,1),"utf8"),V((0,Se.join)(a,"indicadores.json"),JSON.stringify(d,null,1),"utf8"),V((0,Se.join)(a,"fila-validacao.json"),JSON.stringify(u,null,1),"utf8"),V((0,Se.join)(a,"descartados.json"),JSON.stringify(c.descartados,null,1),"utf8"),V((0,Se.join)(a,"composicao.json"),JSON.stringify(vu(n,s,c),null,1),"utf8"),{xmls:n.length,documentos:c.documentos.length,descartados:c.descartados.length,indicadores:d,fila:u}}var Se,Dr=O(()=>{"use strict";m();de();no();Se=ce(Ae(),1);kt();de();$t();vr();Ta();Ma();lo();ps()});function me(o){return{raiz:o,aguardando:(0,se.join)(o,"aguardando"),xmls:(0,se.join)(o,"xmls"),respostas:(0,se.join)(o,"respostas.json"),atividade:(0,se.join)(o,"atividade.json"),empresaAnalise:(0,se.join)(o,"empresa-analise.json"),empresaConfig:(0,se.join)(o,"empresa-config.json")}}function Pr(o,e){Fe(o,{recursive:!0,force:!0}),ie(me(o).xmls,{recursive:!0}),ie(me(o).aguardando,{recursive:!0});for(let a of gs)Fe((0,se.join)(e,a),{force:!0})}function hs(o,e){try{Rt(o,e)}catch{Ot(o,e),Fe(o,{force:!0})}}function vs(o,e){let a=me(o);ie(a.aguardando,{recursive:!0});for(let t of e)hs(t.caminho,(0,se.join)(a.aguardando,(0,se.basename)(t.nome)));return e.length}function bs(o){let e=me(o);if(!U(e.aguardando))return 0;ie(e.xmls,{recursive:!0});let a=Oe(e.aguardando);for(let t of a)hs((0,se.join)(e.aguardando,t),(0,se.join)(e.xmls,t));return a.length}function Da(o){let e=me(o);return U(e.xmls)?Oe(e.xmls).length:0}function nt(o){let e=me(o);return U(e.aguardando)?Oe(e.aguardando).length:0}function pa(o){let e=me(o);return U(e.respostas)?JSON.parse(L(e.respostas,"utf8")):[]}function xs(o,e){let a=me(o);ie(o,{recursive:!0});let t=pa(o).filter(r=>!(r.ncm===e.ncm&&r.cProd===e.cProd&&r.regraId===e.regraId));return t.push(e),V(a.respostas,JSON.stringify(t,null,2),"utf8"),t}function bu(o){let e=me(o);if(!U(e.atividade))return{};let a=JSON.parse(L(e.atividade,"utf8"));return typeof a.barOuRestaurante=="boolean"?{barOuRestaurante:a.barOuRestaurante}:{}}function As(o,e){ie(o,{recursive:!0}),V(me(o).atividade,JSON.stringify({barOuRestaurante:e.barOuRestaurante},null,2),"utf8")}function qr(o,e){let{validacoes:a,...t}=JSON.parse(L(e,"utf8"));return{...t,...bu(o)}}function xu(o,e){let a=me(o);ie(o,{recursive:!0});let t=qr(o,e);return V(a.empresaConfig,JSON.stringify({...t,validacoes:[]},null,2),"utf8"),V(a.empresaAnalise,JSON.stringify({...t,validacoes:pa(o)},null,2),"utf8"),{empresaAnalise:a.empresaAnalise,empresaConfig:a.empresaConfig}}function Es(o){let e=me(o.raiz);if(Da(o.raiz)===0){for(let n of gs)Fe((0,se.join)(o.pastaSaida,n),{force:!0});return{xmls:0,documentos:0,descartados:0,pendencias:0,indicadores:{},alertas:{disponivel:!1,motivo:"an\xE1lise sem XMLs"}}}let{empresaAnalise:a,empresaConfig:t}=xu(o.raiz,o.arquivoEmpresa),r=ms(e.xmls,a,o.pastaSaida,o.arquivoBase),i;try{ns({pastaXml:e.xmls,arquivoEmpresa:a,arquivoEmpresaExplicacao:t,saida:o.pastaSaida,arquivoBase:o.arquivoBase,arquivoV2:o.arquivoV2,arquivoMatriz:o.arquivoMatriz,limparAntes:!0,vereditosDeReferencia:(0,se.join)(o.pastaSaida,"vereditos.json")}),i={disponivel:!0}}catch(n){i={disponivel:!1,motivo:n instanceof Error?n.message:String(n)}}return{xmls:r.xmls,documentos:r.documentos,descartados:r.descartados,pendencias:r.fila.length,indicadores:r.indicadores,alertas:i}}var se,gs,Cs=O(()=>{"use strict";m();de();se=ce(Ae(),1);Dr();Mr();gs=["vereditos.json","indicadores.json","fila-validacao.json","descartados.json","composicao.json","explicacoes.json","alertas.json"]});function Is(o=""){return`<!DOCTYPE html>
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
<button class="perigo" onclick="iniciarNovaAnalise()">Nova an\xE1lise (limpar dados)</button>
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
<div class="aviso" id="avisoPendencias" hidden></div>
<div class="filters">
<input id="buscaPendenteProduto" placeholder="Pesquisar por produto">
<input id="buscaPendenteCprod" placeholder="Pesquisar por cProd">
<input id="buscaPendenteNcm" placeholder="Pesquisar por NCM">
</div>
<div class="barra"><button class="secondary" onclick="window.print()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/></svg>Imprimir</button><button class="secondary" onclick="exportarPendencias()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>Exportar CSV</button><span id="contagemPendencias" class="small"></span></div>
<div id="listaPendentes"></div>
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
const colunasRelatorio=()=>modoRelatorioFinal==='corretos'?COLUNAS_RELATORIO_IMPACTO:COLUNAS_RELATORIO_FINAL;
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
const TITULO_RELATORIO={com:'CORRETOS VALIDADOS',sem:'SEM VALIDA\xC7\xC3O',recal:'CORRETOS C/ RECAL IMPOSTOS',corretos:'CORRETOS'};
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

function abrirTela(id,botao){
 document.querySelectorAll('.tela').forEach(x=>x.classList.remove('active'));
 document.getElementById(id).classList.add('active');
 document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
 botao.classList.add('active');
 if(id==='importar') carregarAnalise();
 if(id==='dashboard'){ carregarDashboard(); carregarAlertas(); }
 if(id==='resultados') carregarResultados();
 if(id==='pendentes') carregarPendentes();
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
 const botoes={com:'btnRelatorioComValidacao',sem:'btnRelatorioSemValidacao',recal:'btnRelatorioRecal',corretos:'btnRelatorioCorretos'};
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

 const renderizar=(linhas,vazio)=>{
   if(modo!==modoRelatorioFinal) return;
   linhasRelatorioFinal=linhas;
   corpo.innerHTML=linhas.length
     ? linhas.map(l=>'<tr>'+l.map(c=>'<td>'+escaparRelatorio(c)+'</td>').join('')+'</tr>').join('')
     : '<tr><td colspan="'+ncol+'">'+vazio+'</td></tr>';
   contador.textContent=linhas.length+' produto(s)';
 };

 try{
   if(modo==='recal'||modo==='corretos'||modo==='com'){
     if(!Object.keys(regrasUI).length){ try{ regrasUI=await (await fetch('/api/regras')).json(); }catch(e){ regrasUI={}; } }
     const resultadosApi=await (await fetch('/api/resultados')).json();
     let respostas=[];
     if(modo==='com'){ try{ respostas=await (await fetch('/api/respostas')).json(); }catch(e){ respostas=[]; } }
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

   const fila=await (await fetch('/api/fila-validacao')).json();
   const mapa=new Map();

   if(Array.isArray(fila)){
     fila.forEach(p=>{
       if(!p.cProd) return;
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
   console.error(e);
   if(modo!==modoRelatorioFinal) return;
   corpo.innerHTML='<tr><td colspan="'+ncol+'">N\xE3o foi poss\xEDvel carregar o Relat\xF3rio Final.</td></tr>';
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
 const nome={com:'relatorio-final-corretos-validados',sem:'relatorio-final-sem-validacao',recal:'relatorio-final-corretos-recal-impostos',corretos:'relatorio-final-corretos'}[modoRelatorioFinal];
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
 const form=new FormData();
 for(const arquivo of input.files) form.append('arquivos',arquivo);
 const botao=document.getElementById('btnAdicionar');
 botao.disabled=true;
 status.textContent='Carregando XMLs...';
 try{
   const resposta=await fetch('/api/importar',{method:'POST',body:form});
   const dados=await resposta.json();
   if(!resposta.ok) throw new Error(dados.detalhe||dados.erro||'Erro ao carregar os XMLs.');
   status.textContent=dados.adicionados+' XML(s) adicionado(s) \xE0 an\xE1lise atual, ainda n\xE3o processado(s).';
   input.value='';
   atualizarSelecaoXml();
   await carregarAnalise();
 }catch(erro){
   status.textContent='Erro: '+erro.message;
 }
 botao.disabled=false;
}

async function iniciarNovaAnalise(){
 if(!confirm('Iniciar uma nova an\xE1lise? XMLs, resultados, pend\xEAncias e respostas da an\xE1lise atual ser\xE3o apagados.')) return;
 const status=document.getElementById('status');
 try{
   const r=await fetch('/api/nova-analise',{method:'POST'});
   const d=await r.json();
   if(!r.ok) throw new Error(d.erro||'Erro ao iniciar nova an\xE1lise.');
   status.textContent='Nova an\xE1lise iniciada. Adicione os XMLs.';
   await recarregarTudo();
 }catch(erro){
   status.textContent='Erro: '+erro.message;
 }
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

async function carregarResultados(){
 try{
   const r=await fetch('/api/resultados');
   resultados=await r.json();
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

document.addEventListener('click',e=>{
 const b=e.target.closest('[data-validar]');
 if(b){
 b.style.setProperty('background','#2C4233','important');
 b.style.setProperty('color','white','important');
}
},true);
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-validar]');
 if(b){
  b.classList.add('validacao-selecionada');

  requestAnimationFrame(()=>{
   requestAnimationFrame(()=>{
    validar(b.dataset.ncm,b.dataset.cprod,b.dataset.regra,b.dataset.validar);
   });
  });
 }
});

async function carregarPendentes(){
 try{
   const r=await fetch('/api/fila-validacao');
   pendentes=await r.json();
   renderPendentes();
 }catch(e){
   document.getElementById('listaPendentes').innerHTML='<p>N\xE3o foi poss\xEDvel carregar as pend\xEAncias.</p>';
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
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-escolha]');
 if(!b) return;
 b.classList.add('validacao-selecionada');
 b.disabled=true;
 if(b.dataset.escolha==='REGRA') validar(b.dataset.ncm,b.dataset.cprod,b.dataset.regra,'SIM');
 else validarEscolha(b.dataset.ncm,b.dataset.cprod,b.dataset.regras.split(',').filter(Boolean),b.dataset.escolha);
});
async function validarEscolha(ncm,cProd,regraIds,escolha){
 const r=await fetch('/api/validar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ncm,cProd,regraIds,resposta:'NAO',escolha,autor:'Sistema'})});
 const d=await r.json();
 if(!r.ok){alert(d.erro||'Erro ao validar.');return;}
 await recarregarTudo();
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
 document.getElementById('contagemPendencias').textContent=pendentesFiltradas.length+' pend\xEAncia(s)';
 document.getElementById('listaPendentes').innerHTML=pendentesFiltradas.length
  ?pendentesFiltradas.map(p=>{
    const regras=p.regrasDetalhe||(p.regras||[]).map(id=>({id}));
    return '<div class="pendente">'+
     '<div class="pend-topo">'+
      '<div><span class="rotulo">Valida\xE7\xE3o do benef\xEDcio</span>'+
       '<span class="rotulo">Produto</span><strong>'+esc(p.produto)+'</strong>'+
       '<div class="small">cProd '+esc(p.cProd)+' \xB7 '+p.itens+' item(ns) \xB7 base '+formatarNumero(p.base)+'</div></div>'+
      '<div class="pend-ncm"><span class="rotulo">NCM</span><span class="valor">'+esc(p.ncm)+'</span></div>'+
     '</div>'+
     alertaReducoesDiferentes(regras.map(g=>g.reducao&&g.reducao.evidencia!=='nao_determinada'?g.reducao.valor:null))+
     alertaLacunas(p.lacunasDeCobertura)+
     (regras.length>1
      ?selosDoProduto(p)+enquadramentosAgrupados(p,regras)
      :regras.map((g,i)=>blocoRegraCandidata(g,p,i,regras.length)).join(''))+
     perguntaMultiplaEscolha(p)+
     (p.regrasBloqueadasDetalhe||[]).map(blocoBloqueio).join('')+
     '<details class="nao-imprimir"><summary>Detalhes</summary>'+
      '<p class="small">'+esc(reformularMotivo(p.motivo))+'</p>'+
      regras.map(g=>'<p class="small"><strong>'+esc(g.id)+'</strong>'+(g.rotulo?': '+descricaoRegra(g):'')+'</p>').join('')+
      (alertasUI.porCartaoHtml[p.ncm+'|'+p.cProd+'|'+p.produto]||'')+
     '</details>'+
    '</div>';
  }).join('')
  :'<p>Nenhuma pend\xEAncia na an\xE1lise atual.</p>';
}

['buscaPendenteProduto','buscaPendenteCprod','buscaPendenteNcm'].forEach(id=>{
 document.getElementById(id).addEventListener('input',renderPendentes);
});

document.addEventListener('click',e=>{
 const b=e.target.closest('[data-validar-lote]');
 if(!b) return;
 b.classList.add('validacao-selecionada');
 b.disabled=true;
 validarLote(b.dataset.ncm,b.dataset.cprod,b.dataset.regras.split(','),'NAO');
});
async function validarLote(ncm,cProd,regraIds,resposta){
 const r=await fetch('/api/validar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ncm,cProd,regraIds,resposta,autor:'Sistema'})});
 const d=await r.json();
 if(!r.ok){alert(d.erro||'Erro ao validar.');return;}
 await recarregarTudo();
}
async function validar(ncm,cProd,regraId,resposta){
 const r=await fetch('/api/validar',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({ncm,cProd,regraId,resposta,autor:'Sistema'})
 });
 const d=await r.json();
 if(!r.ok){alert(d.erro||'Erro ao validar.');return;}
 await recarregarTudo();
}

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
</html>`}var Ns=O(()=>{"use strict";m()});function Cu(o){let e=String(o??"").trim();if(!e)return{ok:!1,erro:"Informe o NCM."};if(!/^[\d.\s-]+$/.test(e))return{ok:!1,erro:`NCM "${e}" inv\xE1lido: use somente n\xFAmeros, com ou sem pontos (ex.: 1901.20.90 ou 19012090).`};let a=e.replace(/[.\s-]/g,"");return a.length!==8?{ok:!1,erro:`NCM "${e}" inv\xE1lido: o NCM tem 8 d\xEDgitos (foram informados ${a.length}).`}:{ok:!0,ncm:a}}function Iu(o){let e=Rs.get(o);return e||(e={...o,validacoes:[]},Rs.set(o,e)),e}function Os(o,e){let a=Cu(o.ncm);if(!a.ok)return a;let t=o.modelo==null||o.modelo===""?"65":String(o.modelo);if(t!=="55"&&t!=="65")return{ok:!1,erro:"Modelo do documento inv\xE1lido: use 55 (NF-e) ou 65 (NFC-e)."};let r=o.natureza==null||o.natureza===""?null:String(o.natureza);if(r!==null&&!Eu.includes(r))return{ok:!1,erro:"Natureza do produto inv\xE1lida."};let i=e.agora??new Date().toISOString(),n={chave:null,modelo:t,numero:null,serie:null,dataEmissao:i,tipoOperacao:"saida",finalidade:"1",situacao:null,cancelado:!1,emitente:{cnpj:e.empresa.cnpj??null,crt:null,uf:e.empresa.uf??null},destinatario:{cnpj:null,cpf:null,uf:null,indIEDest:null},itens:[],arquivo:`consulta-ncm-${a.ncm}`,avisos:[]},s={nItem:1,cProd:Au,xProd:"",ncm:a.ncm,cfop:null,quantidade:null,valorProduto:0,desconto:0,baseCalculo:0,cst:null,cClassTrib:null,aliquotas:{},...r?{natureza:r}:{}};n.itens.push(s);let c=Er(n,s,{base:e.base,empresa:e.empresa,validacoes:[],agora:i,regrasBloqueadas:e.regrasBloqueadas}),l=Or(c,Iu(e.explicacao),n),d=ot([l]).porItem,u=["CBS","IBS"].map(I=>wa(I,i,!1,na)).filter(I=>!!I).map(I=>({tributo:I.tributo,aliquota:I.aliquota,fonte:I.fonte,tipo:I.tipo})),p=u.length===2?u.reduce((I,N)=>I+N.aliquota,0):null,f=e.base.regras.filter(I=>I.ncm===a.ncm),v=new Set(c.regrasBloqueadas??[]),C=I=>I.vigenciaInicio<=Br(i)&&(I.vigenciaFim===null||I.vigenciaFim>=Br(i)),S=I=>I.id===c.regraAplicada?"aplicada":v.has(I.id)?"bloqueada":c.regrasCandidatas.includes(I.id)?"candidata":C(I)?"nao_considerada":"fora_da_vigencia",y=f.map(I=>({id:I.id,cst:I.cst,cClassTrib:I.cClassTrib,anexo:I.anexo,item:I.item,rotulo:I.rotulo,fundamentoLegal:I.fundamentoLegal,descricaoLegal:I.descricaoLegal,descricaoNcmTipi:I.descricaoNcmTipi??null,observacao:I.observacao??null,reducaoAliquota:I.reducaoAliquota,vigenciaInicio:I.vigenciaInicio,vigenciaFim:I.vigenciaFim,fonte:I.fonte,origemRegistro:I.origemRegistro??null,situacao:S(I),aliquotaEfetiva:p===null?null:Number((p*(1-I.reducaoAliquota)).toFixed(6))})),T=r?"informada_na_consulta":e.empresa.barOuRestaurante?"nao_informada":"deduzida_pelo_motor",w=Qo(t,e.empresa.regime,i),_=l.explicacaoInformativa,g=(_?.lacunas.length??0)>0||(_?.lacunasDeCobertura?.length??0)>0,x=f.length>0||g||[...e.bloqueios.values()].some(I=>I.ncm===a.ncm),b;return c.estado==="INDETERMINADO"?b={tipo:"INDETERMINADO",texto:`O motor n\xE3o classificou: ${c.motivo}`}:c.estado==="NAO_OBRIGATORIO"?b={tipo:"NAO_OBRIGATORIO",texto:`Na data da consulta o grupo IBS/CBS ainda n\xE3o \xE9 exigido para este modelo e regime. ${c.motivo}`}:c.esperado===null?b={tipo:"REQUER_VALIDACAO_HUMANA",texto:`O motor encontrou ${c.regrasCandidatas.length} enquadramento(s) poss\xEDvel(is) e n\xE3o escolhe entre eles: a decis\xE3o depende de confirma\xE7\xE3o humana de que o produto atende \xE0 descri\xE7\xE3o legal.`}:c.regraAplicada?b={tipo:"ENQUADRAMENTO_DETERMINADO",texto:`Enquadramento determinado pelo motor: CST ${c.esperado.cst} e cClassTrib ${c.esperado.cClassTrib} (${c.regraAplicada}).`}:c.esperado.cst===sa.cst&&c.esperado.cClassTrib===sa.cClassTrib?b={tipo:"REGRA_GERAL_SEM_BENEFICIO",texto:`Nenhuma regra de benef\xEDcio aplic\xE1vel a este NCM na base, na data da consulta: o motor indica a regra geral, CST ${c.esperado.cst} e cClassTrib ${c.esperado.cClassTrib}.`+(g?" Aten\xE7\xE3o: a fonte oficial lista este NCM em c\xF3digo(s) sem regra correspondente na base (lacuna da fonte); nenhuma regra foi criada por isso.":"")}:b={tipo:"ENQUADRAMENTO_DETERMINADO",texto:`Enquadramento determinado pelo motor: CST ${c.esperado.cst} e cClassTrib ${c.esperado.cClassTrib}.`},{ok:!0,ncm:a.ncm,parametros:{data:Br(i),modelo:t,regime:e.empresa.regime,barOuRestaurante:!!e.empresa.barOuRestaurante,natureza:r,naturezaOrigem:T,entrada:String(o.ncm),versaoBase:e.base.versao},obrigatoriedade:w?{obrigatorio:w.obrigatorio,fonte:w.fonte}:null,conclusao:b,encontradoNaBase:x,descricaoNcm:[...new Set(f.map(I=>I.descricaoNcmTipi).filter(I=>!!I))],regras:y,veredito:l,alertas:d,aliquotas:u}}var Au,Eu,Br,Rs,ys=O(()=>{"use strict";m();Ta();at();wr();Jo();Au="CONSULTA-NCM",Eu=["mercadoria","preparado_no_local","bebida_alcoolica","servico"];Br=o=>o.slice(0,10),Rs=new WeakMap});function ws(o){let e=new Map,a=[];try{a=Oe(o).filter(t=>t.toLowerCase().endsWith(".xml"))}catch{return[]}for(let t of a){let r=L((0,Ss.join)(o,t),"utf8"),i=/<emit>([\s\S]*?)<\/emit>/.exec(r)?.[1],n=i?/<CNAE>(\d+)<\/CNAE>/.exec(i)?.[1]:void 0;n&&e.set(n,(e.get(n)??0)+1)}return[...e].map(([t,r])=>({cnae:t,xmls:r})).sort((t,r)=>r.xmls-t.xmls)}function Ts(o){let e=o.agora??new Date().toISOString(),a=g=>o.lei.artigos.find(x=>x.dispositivo===g),t=a("Art. 273"),r=a("Art. 275");if(!t||!r)throw new Error("Texto legal do regime de bares e restaurantes incompleto (arts. 273 e 275).");let i=o.cnaes.map(g=>({...g,formatado:Su(g.cnae),descricao:Ru[g.cnae]??null,corresponde:g.cnae.startsWith(Nu),excluido:g.cnae===Ou})),n=o.empresa.barOuRestaurante===!0,s=i.filter(g=>g.corresponde),c=i.filter(g=>g.excluido),l=i.filter(g=>!g.corresponde&&!g.excluido),d=/reduzidas em (\d+(?:,\d+)?)%/.exec(r.texto),u=d?Number(d[1].replace(",","."))/100:null,p=["CBS","IBS"].map(g=>wa(g,e,!1,na)).filter(g=>!!g).map(g=>({tributo:g.tributo,aliquota:g.aliquota,fonte:g.fonte})),f=p.length===2?Number(p.reduce((g,x)=>g+x.aliquota,0).toFixed(6)):null,v=g=>`${o.lei.fonte.url}#${g}`,C=g=>g.split(/\s(?=§ \d+º)/),S={atividadeDaLei:"Bares e restaurantes, inclusive lanchonetes",descricao:"Regime espec\xEDfico de incid\xEAncia do IBS e da CBS, com redu\xE7\xE3o das al\xEDquotas.",percentualReducao:W.reducao,percentualNaLei:u,aliquotas:p,aliquotaGeral:f,aliquotaAposReducao:f===null?null:Number((f*(1-W.reducao)).toFixed(6)),dataAliquotas:e.slice(0,10),fundamentoLegal:"LC 214/2025, arts. 273 a 276 (redu\xE7\xE3o: art. 275)",condicoes:C(t.texto).slice(1).map(g=>({dispositivo:`Art. 273, ${g.slice(0,4).trim()}`,texto:g})),textoLegal:o.lei.artigos.map(g=>({...g,url:v(g.ancora)}))},y=[];y.push(i.length?{camada:"FONTE_DIZ",texto:`CNAE do emitente nos XMLs da an\xE1lise (campo emit/CNAE): ${i.map(g=>`${g.formatado}${g.descricao?` (${g.descricao})`:""} em ${g.xmls} XML(s)`).join("; ")}.`}:{camada:"PENDENTE",texto:"Os XMLs da an\xE1lise n\xE3o informam o CNAE do emitente (ou a an\xE1lise n\xE3o tem XMLs)."}),y.push({camada:n?"HUMANO_CONFIRMOU":"PENDENTE",texto:n?"Atividade confirmada: a empresa atende consumo no local (bar, restaurante ou lanchonete), declarada nesta an\xE1lise ou no cadastro da empresa (barOuRestaurante = true).":"Atividade n\xE3o confirmada: a empresa n\xE3o foi declarada bar, restaurante ou lanchonete, nem nesta an\xE1lise nem no cadastro da empresa (barOuRestaurante ausente ou false)."}),s.length&&y.push({camada:"SISTEMA_INFERE",texto:`O sistema associou o CNAE ${s.map(g=>g.formatado).join(", ")} (classe 56.11-2, restaurantes e outros estabelecimentos de servi\xE7os de alimenta\xE7\xE3o e bebidas) \xE0 atividade "bares e restaurantes, inclusive lanchonetes" do art. 273. A lei n\xE3o lista CNAEs para o regime; o v\xEDnculo \xE9 do sistema.`}),c.length&&y.push({camada:"FONTE_DIZ",texto:'LC 214/2025, art. 273, \xA7 2\xBA, I: o fornecimento "por empresa classificada na posi\xE7\xE3o 5620-1/01 da Classifica\xE7\xE3o Nacional de Atividades Econ\xF4micas (CNAE)" n\xE3o est\xE1 sujeito ao regime.'}),y.push({camada:"FONTE_DIZ",texto:`LC 214/2025, art. 275: "${r.texto.replace(/^Art\. 275\.\s*/,"")}"`}),y.push(u===W.reducao?{camada:"SISTEMA_INFERE",texto:`O percentual do regime usado pelo motor (${W.reducao*100}%, ${W.fundamento}) confere com o texto do art. 275.`}:{camada:"PENDENTE",texto:`O percentual do motor (${W.reducao*100}%) n\xE3o p\xF4de ser conferido com o texto do art. 275.`}),y.push({camada:"PENDENTE",texto:"Condi\xE7\xF5es do art. 273, \xA7\xA7 1\xBA e 2\xBA, dependem de cada fornecimento (preparo no estabelecimento, bebida alco\xF3lica, produto de terceiros, alimenta\xE7\xE3o para pessoa jur\xEDdica sob contrato) e n\xE3o s\xE3o comprovadas pelo XML. A aplica\xE7\xE3o item a item continua com o motor, pela natureza do item; nada aqui altera a tributa\xE7\xE3o do produto."});let T,w;c.length&&!s.length&&!n?(T="NENHUM",w="O CNAE do emitente \xE9 5620-1/01, exclu\xEDdo do regime de bares e restaurantes pelo art. 273, \xA7 2\xBA, I."):n&&s.length&&!l.length&&!c.length?(T="CONFIRMADO",w="A atividade est\xE1 confirmada no cadastro da empresa e o CNAE dos XMLs corresponde a bares e restaurantes. O regime da atividade se aplica aos fornecimentos que atendem ao art. 273; cada item continua classificado pelo motor."):n||s.length?(T="REQUER_VALIDACAO",w=n?`A empresa foi declarada bar ou restaurante, mas ${i.length?`o CNAE dos XMLs (${l.concat(c).map(g=>g.formatado).join(", ")}) n\xE3o confirma a atividade`:"os XMLs n\xE3o informam o CNAE"}.`:`O CNAE dos XMLs (${s.map(g=>g.formatado).join(", ")}) indica bares e restaurantes, mas a atividade n\xE3o foi confirmada. Enquanto n\xE3o for confirmada (bot\xE3o "A empresa atende consumo no local"), o motor trata os itens como mercadoria.`):(T="NENHUM",w=i.length?`O CNAE dos XMLs (${i.map(g=>g.formatado).join(", ")}) n\xE3o corresponde a nenhum regime por atividade da base consultada (bares e restaurantes, arts. 273 a 276).`:"Sem CNAE nos XMLs e sem marca\xE7\xE3o de atividade no cadastro: nenhum regime por atividade da base consultada foi identificado.");let _=s.length?s.map(g=>`${g.formatado}${g.descricao?` \u2014 ${g.descricao}`:""}`).join("; "):i.length?i.map(g=>`${g.formatado}${g.descricao?` \u2014 ${g.descricao}`:""}`).join("; "):n?"Bar ou restaurante (declarado pela empresa)":"n\xE3o identificada";return{classificacao:T,rotulo:yu[T],atividade:{cnaes:i,declaradaNoCadastro:n,descricao:_},beneficio:T==="NENHUM"?null:S,motivo:w,auditoria:y,fonte:o.lei.fonte}}var Ss,Nu,Ru,Ou,yu,Su,_s=O(()=>{"use strict";m();de();Ss=ce(Ae(),1);Ta();Jo();Nu="5611",Ru={5611201:"Restaurantes e similares",5611203:"Lanchonetes, casas de ch\xE1, de sucos e similares",5611204:"Bares e outros estabelecimentos especializados em servir bebidas, sem entretenimento",5611205:"Bares e outros estabelecimentos especializados em servir bebidas, com entretenimento"},Ou="5620101",yu={CONFIRMADO:"BENEF\xCDCIO CONFIRMADO",REQUER_VALIDACAO:"BENEF\xCDCIO POTENCIALMENTE APLIC\xC1VEL \u2014 REQUER VALIDA\xC7\xC3O",NENHUM:"NENHUM BENEF\xCDCIO POR ATIVIDADE IDENTIFICADO"},Su=o=>/^\d{7}$/.test(o)?`${o.slice(0,4)}-${o.slice(4,5)}/${o.slice(5)}`:o});var Du={};function $r(){return Es({raiz:k,arquivoEmpresa:kr,pastaSaida:ae,arquivoBase:Pa,arquivoV2:q.default.join(E.cwd(),"data","base-normativa.v2.json"),arquivoMatriz:q.default.join(E.cwd(),"docs","etapa6","matriz-decisao.json")})}function zr(){try{return qr(k,kr)}catch{return{}}}function we(o,e=[]){try{return JSON.parse(De.readFileSync(o,"utf8"))}catch{return e}}function Ls(o,e){let a=we(Pa,{regras:[]});return e.map(t=>{let r=a.regras.filter(n=>n.id===t&&n.ncm===o),i=n=>{let s=[...new Set(r.map(c=>c[n]??null))];return s.length===1?s[0]:null};return{id:t,cst:i("cst"),cClassTrib:i("cClassTrib"),rotulo:i("rotulo"),anexo:i("anexo"),item:i("item"),descricaoLegal:i("descricaoLegal"),fundamentoLegal:i("fundamentoLegal"),reducao:i("reducao"),reducaoAliquota:i("reducaoAliquota"),descricaoNcmTipi:i("descricaoNcmTipi"),identificadorRepetido:r.length>1,regrasComEsteIdentificador:r.length,descricoesLegaisDivergentes:r.length>1&&i("descricaoLegal")===null?[...new Set(r.map(n=>n.descricaoLegal))]:[]}})}function Fs(o){let e=q.default.join(ae,"reducoes-exibicao.json"),a=q.default.join(ae,"vereditos.json"),t=q.default.join(ae,"vereditos.json");if(!De.existsSync(e)||!De.existsSync(t))return{disponivel:!1,motivo:"\xEDndice de redu\xE7\xF5es indispon\xEDvel para os resultados atuais"};let r=s=>{let c=De.statSync(s);return`${c.mtimeMs}:${c.size}`},i=`${r(e)}|${r(t)}`;if(jr?.chave===i)return jr.valor;let n;try{let s=JSON.parse(De.readFileSync(e,"utf8")),c=new Map(s.map(d=>[`${d.documento}|${d.nItem}`,d.exibicao])),l=new Map(s.filter(d=>d.estado==="REQUER_VALIDACAO").reverse().map(d=>[`${d.ncm}|${d.cProd}|${d.produto}`,d.exibicao]));n={disponivel:!0,porItem:c,porPendencia:l}}catch{n={disponivel:!1,motivo:"n\xE3o foi poss\xEDvel ler o \xEDndice de redu\xE7\xF5es"}}return jr={chave:i,valor:n},n}function Fu(o,e,a){if(!o||o.situacao!=="prevista")return o;let t=new Set(a.filter(r=>r.resposta==="NAO"&&r.ncm===e.ncm&&(r.cProd===e.cProd||r.cProd===e.produto)).map(r=>r.regraId));return{...o,opcoes:o.opcoes.filter(r=>!t.has(r.regraId))}}var q,H,Ms,wu,Tu,kr,ae,_u,k,Pa,Mu,Lu,jr,Vr,Ur,Ds=O(()=>{"use strict";m();Di();Tt();de();q=ce(Ae(),1);qi();ls();Cs();Dr();lo();Ns();Ma();ys();at();Ma();_s();H=Xa(),Ms=Number(E.env.PORT)||3e3;H.use(Xa.json());wu=1e4,Tu=Dt({dest:q.default.join(E.cwd(),"uploads")}),kr=q.default.join(E.cwd(),"empresa.json"),ae=q.default.join(E.cwd(),"saida-teste"),_u=q.default.join(ae,"fila-validacao.json"),k=q.default.join(E.cwd(),"analise-atual"),Pa=q.default.join(E.cwd(),"data","base-normativa.json");De.existsSync(k)||(Pr(k,ae),console.log("Nova an\xE1lise iniciada (sem dados de an\xE1lises anteriores)."));Mu=["CONSUMO_NO_LOCAL","MERCADORIA_SEM_BENEFICIO","NCM_INCORRETO"],Lu="NATUREZA_DO_ITEM";H.use("/vendor",Xa.static(q.default.join(E.cwd(),"public","vendor")));H.use("/marca",Xa.static(q.default.join(E.cwd(),"public","marca")));H.get("/",(o,e)=>{e.send(Is())});H.get("/api/analise",(o,e)=>{let a=Da(k),t=q.default.join(ae,"vereditos.json"),r=a>0&&De.existsSync(t),i={},n=new Set;if(r)for(let c of we(t,[]))i[c.estado]=(i[c.estado]??0)+1,n.add(c.documento);let s=c=>i[c]??0;e.json({processados:a,aguardando:nt(k),respostas:pa(k).length,processada:r,resumo:r?{xmls:a,documentos:n.size,itens:Object.values(i).reduce((c,l)=>c+l,0),corretos:s("CORRETO"),recalculo:s("INCORRETO_ECONOMIA")+s("INCORRETO_RISCO"),incorretos:s("INCORRETO_NCM"),ncmAAjustar:s("INCORRETO_NCM"),precisamValidar:s("REQUER_VALIDACAO"),naoObrigatorio:s("NAO_OBRIGATORIO"),indeterminado:s("INDETERMINADO"),porEstado:i}:null,indicadores:r?we(q.default.join(ae,"indicadores.json"),{}):null,composicao:r?we(q.default.join(ae,"composicao.json"),null):null})});H.post("/api/nova-analise",(o,e)=>{try{Pr(k,ae),e.json({sucesso:!0})}catch(a){console.error("Erro ao iniciar nova an\xE1lise:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel iniciar a nova an\xE1lise."})}});H.get("/api/respostas",(o,e)=>{e.json(pa(k))});H.post("/api/validar",(o,e)=>{try{let{ncm:a,cProd:t,regraId:r,regraIds:i,resposta:n,autor:s,justificativa:c,escolha:l}=o.body;if(l!==void 0&&(!Mu.includes(l)||n!=="NAO"))return e.status(400).json({erro:"Escolha de valida\xE7\xE3o inv\xE1lida."});let d=Array.isArray(i)&&i.length?i.map(String):r?[String(r)]:[];if(!d.length&&l!==void 0&&d.push(Lu),!a||!t||!d.length||!["SIM","NAO"].includes(n))return e.status(400).json({erro:"Dados de valida\xE7\xE3o inv\xE1lidos."});let u=ca(Pa);if(d.some(f=>u.has(so(f,a))))return e.status(400).json({erro:`${Cr} A valida\xE7\xE3o n\xE3o est\xE1 dispon\xEDvel para esta regra.`,bloqueada:!0});for(let f of d){let v={ncm:a,cProd:t,regraId:f,resposta:n,autor:s||"Sistema",data:new Date().toISOString().slice(0,10),...c?{justificativa:c}:{},...l?{escolha:l}:{}};xs(k,v)}let p=$r();e.json({sucesso:!0,mensagem:"Valida\xE7\xE3o gravada com sucesso.",pendencias:p.pendencias})}catch(a){console.error("Erro ao gravar valida\xE7\xE3o:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel gravar a valida\xE7\xE3o."})}});H.post("/api/importar",Tu.array("arquivos",wu),(o,e)=>{try{let a=o.files??[];if(a.length===0)return e.status(400).json({erro:"Nenhum arquivo XML foi enviado."});let t=vs(k,a.map(r=>({nome:r.originalname,caminho:r.path})));e.json({sucesso:!0,adicionados:t,aguardando:nt(k),processados:Da(k)})}catch(a){console.error("Erro ao adicionar XMLs:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel adicionar os XMLs.",detalhe:a instanceof Error?a.message:String(a)})}});H.get("/api/notas-da-analise",(o,e)=>{try{let a=me(k);e.json({notas:fs([a.xmls,a.aguardando])})}catch(a){console.error("Erro ao listar as notas da an\xE1lise:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel ler as notas da an\xE1lise.",detalhe:a instanceof Error?a.message:String(a)})}});H.post("/api/processar",(o,e)=>{try{if(Da(k)+nt(k)===0)return e.status(400).json({erro:"A an\xE1lise atual n\xE3o tem XMLs. Adicione XMLs antes de processar."});let a=bs(k),t=$r();e.json({sucesso:!0,incorporados:a,xmls:t.xmls,documentos:t.documentos,descartados:t.descartados,indicadores:t.indicadores,pendencias:t.pendencias,alertas:t.alertas})}catch(a){console.error("Erro ao processar a an\xE1lise:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel processar a an\xE1lise.",detalhe:a instanceof Error?a.message:String(a)})}});H.get("/api/dashboard",(o,e)=>{try{e.json({indicadores:we(q.default.join(ae,"indicadores.json"),{}),vereditos:we(q.default.join(ae,"vereditos.json"),[]),explicacoes:is(q.default.join(ae,"explicacoes.json"),"vereditos")??{}})}catch{e.status(500).json({erro:"N\xE3o foi poss\xEDvel carregar o dashboard."})}});jr=null;H.get("/api/resultados",(o,e)=>{try{let a=we(q.default.join(ae,"vereditos.json"),[]),t=Fs(a),r=pa(k);e.json(a.map(i=>{if(!t.disponivel)return{...i,reducaoExibicao:null,reducaoIndisponivel:t.motivo,auditoriaExibicao:null,lacunasDeCobertura:[],bloqueiosExibicao:{}};let n=t.porItem.get(`${i.documento}|${i.nItem}`);return{...i,reducaoExibicao:Fu(n?.reducao??null,i,r),auditoriaExibicao:n?.auditoria??{},lacunasDeCobertura:n?.lacunas??[],bloqueiosExibicao:n?.bloqueios??{}}}))}catch{e.status(500).json({erro:"N\xE3o foi poss\xEDvel carregar os resultados."})}});H.get("/api/regras",(o,e)=>{var r;let a=we(Pa,{regras:[]}),t={};for(let i of a.regras)t[r=`${i.id}|${i.ncm}`]??(t[r]={rotulo:i.rotulo??null,anexo:i.anexo??null,item:i.item??null,cClassTrib:i.cClassTrib??null,cst:i.cst??null,fundamentoLegal:i.fundamentoLegal??null,reducao:i.reducaoAliquota??null,vigenciaInicio:i.vigenciaInicio??null,fonte:i.fonte??null,descricaoLegal:i.descricaoLegal??null});e.json(t)});H.get("/api/fila-validacao",(o,e)=>{try{let a=we(_u,[]),t=we(q.default.join(ae,"vereditos.json"),[]),r=Fs(t),i=pa(k),n=zr().barOuRestaurante,s=new Map;for(let c of t){if(c.informado.cst!==null||c.informado.cClassTrib!==null)continue;let l=s.get(c.cProd)??{total:0,naoObrigatorios:0};l.total+=1,c.estado==="NAO_OBRIGATORIO"&&(l.naoObrigatorios+=1),s.set(c.cProd,l)}e.json(a.map(c=>{let l=r.disponivel?r.porPendencia.get(`${c.ncm}|${c.cProd}|${c.produto}`)??null:null;return{...c,regrasDetalhe:Ls(c.ncm,c.regras??[]).map(d=>({...d,reducao:l?.reducao?.opcoes.find(u=>u.regraId===d.id)??null,auditoria:l?.auditoria[d.id]??null})),lacunasDeCobertura:l?.lacunas??[],opcoesValidacao:Fi(c.ncm,c.produto,Ls(c.ncm,c.regras??[]).map(d=>({id:d.id,cst:d.cst,cClassTrib:d.cClassTrib,anexo:d.anexo,item:d.item,descricaoLegal:d.descricaoLegal,fundamentoLegal:d.fundamentoLegal,reducaoAliquota:typeof d.reducaoAliquota=="number"?d.reducaoAliquota:null,descricaoNcmTipi:typeof d.descricaoNcmTipi=="string"?d.descricaoNcmTipi:null})),{consumoNoLocal:n===!0}),regrasBloqueadasDetalhe:Object.values(l?.bloqueios??{}),reducaoIndisponivel:r.disponivel?null:r.motivo,respostasDestaAnalise:i.filter(d=>d.ncm===c.ncm&&(d.cProd===c.cProd||d.cProd===c.produto)),itensSemInformacaoTributaria:s.get(c.cProd)?.total??0,itensNaoObrigatoriosSemInformacao:s.get(c.cProd)?.naoObrigatorios??0}}))}catch(a){console.error("Erro ao ler fila-validacao.json:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel ler a fila de valida\xE7\xE3o."})}});H.get("/api/alertas",(o,e)=>{e.json(cs(ae))});Vr=null;H.post("/api/consulta-ncm",(o,e)=>{try{if(!Vr){let s=et({base:Pa,v2:q.default.join(E.cwd(),"data","base-normativa.v2.json"),matriz:q.default.join(E.cwd(),"docs","etapa6","matriz-decisao.json"),empresa:kr}),c=ca(Pa);Vr={base:s.base,explicacao:s,bloqueios:c,regrasBloqueadas:_a(c)}}let a=zr();if(!a.regime){e.status(400).json({erro:"empresa.json sem o regime do emitente: a consulta precisa dele para saber se o grupo IBS/CBS \xE9 exigido."});return}let{ncm:t,modelo:r,natureza:i}=o.body??{},n=Os({ncm:t,modelo:r,natureza:i},{...Vr,empresa:a});if(!n.ok){e.status(400).json({erro:n.erro});return}e.json(n)}catch(a){console.error("Erro na consulta por NCM:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel consultar o NCM."})}});Ur=null;H.get("/api/beneficio-atividade",(o,e)=>{try{let a=q.default.join(k,"xmls"),t=De.existsSync(a)?De.readdirSync(a).filter(s=>s.toLowerCase().endsWith(".xml")).sort():[],r=`${t.length}|${t[0]??""}|${t[t.length-1]??""}`;Ur?.chave!==r&&(Ur={chave:r,valor:ws(a)});let i=we(q.default.join(E.cwd(),"data","fontes","lc214","regime-bares-restaurantes.json"),null);if(!i){e.status(500).json({erro:"Texto legal do regime por atividade n\xE3o encontrado (data/fontes/lc214/regime-bares-restaurantes.json)."});return}let n=zr();e.json(Ts({empresa:n,cnaes:Ur.valor,lei:i}))}catch(a){console.error("Erro no benef\xEDcio por atividade:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel verificar o benef\xEDcio por atividade."})}});H.post("/api/atividade",(o,e)=>{try{let{barOuRestaurante:a}=o.body??{};if(typeof a!="boolean"){e.status(400).json({erro:"Informe barOuRestaurante: true ou false."});return}As(k,{barOuRestaurante:a});let t=Da(k)>0?$r():null;e.json({sucesso:!0,barOuRestaurante:a,pendencias:t?.pendencias??0})}catch(a){console.error("Erro ao gravar a atividade da empresa:",a),e.status(500).json({erro:"N\xE3o foi poss\xEDvel gravar a atividade da empresa."})}});H.listen(Ms,()=>{console.log(`Servidor iniciado em http://localhost:${Ms}`)})});m();de();Tt();var Pu="conformidade-ibs-cbs",fo="arquivos";function qu(){return new Promise(o=>{try{let e=indexedDB.open(Pu,1);e.onupgradeneeded=()=>e.result.createObjectStore(fo),e.onsuccess=()=>o(e.result),e.onerror=()=>o(null)}catch{o(null)}})}function Bu(o){return new Promise((e,a)=>{o.oncomplete=()=>e(),o.onerror=()=>a(o.error),o.onabort=()=>a(o.error)})}async function ju(o){let a=o.transaction(fo,"readonly").objectStore(fo);await new Promise((t,r)=>{let i=a.openCursor();i.onsuccess=()=>{let n=i.result;if(!n)return t();Si(String(n.key),n.value),n.continue()},i.onerror=()=>r(i.error)})}async function qs(o){let e=wi();if(!o||!e.length)return;let a=o.transaction(fo,"readwrite"),t=a.objectStore(fo);for(let[r,i]of e)i?t.put(i,r):t.delete(r);try{await Bu(a)}catch(r){console.error("N\xE3o foi poss\xEDvel salvar a an\xE1lise no navegador:",r)}}async function Vu(){let o=new URL("dados/",self.location.href),e=await(await fetch(new URL("manifesto.json",o))).json();await Promise.all(e.map(async a=>{let t=await fetch(new URL(a,o));if(!t.ok)throw new Error(`Falha ao baixar ${a}: HTTP ${t.status}`);yi("/app/"+a,new Uint8Array(await t.arrayBuffer()))}))}var Uu=(async()=>{let o=await qu();return o&&await ju(o),await Vu(),await Promise.resolve().then(()=>(Ds(),Du)),await qs(o),o})(),Ps=Promise.resolve();self.onmessage=o=>{let e=o.data;Ps=Ps.then(async()=>{let a;try{let t=await Uu;a=await _i(e.metodo,e.caminho,e.query,e.corpo,e.arquivos),await qs(t)}catch(t){console.error(t),a={status:500,corpo:JSON.stringify({erro:"Falha ao iniciar o sistema no navegador.",detalhe:t instanceof Error?t.message:String(t)}),tipo:"application/json; charset=utf-8"}}self.postMessage({id:e.id,...a})})};})();
