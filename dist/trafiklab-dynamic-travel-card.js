/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const R=globalThis,W=R.ShadowRoot&&(R.ShadyCSS===void 0||R.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol(),et=new WeakMap;let ft=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==G)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(W&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=et.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&et.set(e,t))}return t}toString(){return this.cssText}};const At=r=>new ft(typeof r=="string"?r:r+"",void 0,G),yt=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,o)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[o+1],r[0]);return new ft(e,r,G)},zt=(r,t)=>{if(W)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=R.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},it=W?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return At(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Et,defineProperty:Mt,getOwnPropertyDescriptor:Ct,getOwnPropertyNames:Tt,getOwnPropertySymbols:Pt,getPrototypeOf:It}=Object,b=globalThis,st=b.trustedTypes,Ot=st?st.emptyScript:"",Lt=b.reactiveElementPolyfillSupport,T=(r,t)=>r,U={toAttribute(r,t){switch(t){case Boolean:r=r?Ot:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},J=(r,t)=>!Et(r,t),ot={attribute:!0,type:String,converter:U,reflect:!1,useDefault:!1,hasChanged:J};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),b.litPropertyMetadata??(b.litPropertyMetadata=new WeakMap);let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ot){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Mt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=Ct(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){const a=s?.call(this);o?.call(this,n),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ot}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;const t=It(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){const e=this.properties,i=[...Tt(e),...Pt(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(it(s))}else t!==void 0&&e.push(it(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return zt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){const o=(i.converter?.toAttribute!==void 0?i.converter:U).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const o=i.getPropertyOptions(s),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:U;this._$Em=s;const a=n.fromAttribute(e,o.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(t!==void 0){const n=this.constructor;if(s===!1&&(o=this[t]),i??(i=n.getPropertyOptions(t)),!((i.hasChanged??J)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,o]of i){const{wrapped:n}=o,a=this[s];n!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[T("elementProperties")]=new Map,A[T("finalized")]=new Map,Lt?.({ReactiveElement:A}),(b.reactiveElementVersions??(b.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const P=globalThis,nt=r=>r,H=P.trustedTypes,rt=H?H.createPolicy("lit-html",{createHTML:r=>r}):void 0,vt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,$t="?"+$,Dt=`<${$t}>`,S=document,O=()=>S.createComment(""),L=r=>r===null||typeof r!="object"&&typeof r!="function",K=Array.isArray,Nt=r=>K(r)||typeof r?.[Symbol.iterator]=="function",j=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,at=/-->/g,lt=/>/g,k=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),dt=/'/g,ct=/"/g,bt=/^(?:script|style|textarea|title)$/i,Rt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),l=Rt(1),E=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),ht=new WeakMap,w=S.createTreeWalker(S,129);function xt(r,t){if(!K(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return rt!==void 0?rt.createHTML(t):t}const Ut=(r,t)=>{const e=r.length-1,i=[];let s,o=t===2?"<svg>":t===3?"<math>":"",n=C;for(let a=0;a<e;a++){const d=r[a];let h,_,p=-1,y=0;for(;y<d.length&&(n.lastIndex=y,_=n.exec(d),_!==null);)y=n.lastIndex,n===C?_[1]==="!--"?n=at:_[1]!==void 0?n=lt:_[2]!==void 0?(bt.test(_[2])&&(s=RegExp("</"+_[2],"g")),n=k):_[3]!==void 0&&(n=k):n===k?_[0]===">"?(n=s??C,p=-1):_[1]===void 0?p=-2:(p=n.lastIndex-_[2].length,h=_[1],n=_[3]===void 0?k:_[3]==='"'?ct:dt):n===ct||n===dt?n=k:n===at||n===lt?n=C:(n=k,s=void 0);const v=n===k&&r[a+1].startsWith("/>")?" ":"";o+=n===C?d+Dt:p>=0?(i.push(h),d.slice(0,p)+vt+d.slice(p)+$+v):d+$+(p===-2?a:v)}return[xt(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class D{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const a=t.length-1,d=this.parts,[h,_]=Ut(t,e);if(this.el=D.createElement(h,i),w.currentNode=this.el.content,e===2||e===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=w.nextNode())!==null&&d.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const p of s.getAttributeNames())if(p.endsWith(vt)){const y=_[n++],v=s.getAttribute(p).split($),x=/([.?@])?(.*)/.exec(y);d.push({type:1,index:o,name:x[2],strings:v,ctor:x[1]==="."?qt:x[1]==="?"?jt:x[1]==="@"?Zt:q}),s.removeAttribute(p)}else p.startsWith($)&&(d.push({type:6,index:o}),s.removeAttribute(p));if(bt.test(s.tagName)){const p=s.textContent.split($),y=p.length-1;if(y>0){s.textContent=H?H.emptyScript:"";for(let v=0;v<y;v++)s.append(p[v],O()),w.nextNode(),d.push({type:2,index:++o});s.append(p[y],O())}}}else if(s.nodeType===8)if(s.data===$t)d.push({type:2,index:o});else{let p=-1;for(;(p=s.data.indexOf($,p+1))!==-1;)d.push({type:7,index:o}),p+=$.length-1}o++}}static createElement(t,e){const i=S.createElement("template");return i.innerHTML=t,i}}function M(r,t,e=r,i){if(t===E)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl;const o=L(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=s:e._$Cl=s),s!==void 0&&(t=M(r,s._$AS(r,t.values),s,i)),t}class Ht{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??S).importNode(e,!0);w.currentNode=s;let o=w.nextNode(),n=0,a=0,d=i[0];for(;d!==void 0;){if(n===d.index){let h;d.type===2?h=new N(o,o.nextSibling,this,t):d.type===1?h=new d.ctor(o,d.name,d.strings,this,t):d.type===6&&(h=new Bt(o,this,t)),this._$AV.push(h),d=i[++a]}n!==d?.index&&(o=w.nextNode(),n++)}return w.currentNode=S,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class N{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=M(this,t,e),L(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==E&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Nt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=D.createElement(xt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const o=new Ht(s,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=ht.get(t.strings);return e===void 0&&ht.set(t.strings,e=new D(t)),e}k(t){K(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new N(this.O(O()),this.O(O()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const i=nt(t).nextSibling;nt(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(o===void 0)t=M(this,t,e,0),n=!L(t)||t!==this._$AH&&t!==E,n&&(this._$AH=t);else{const a=t;let d,h;for(t=o[0],d=0;d<o.length-1;d++)h=M(this,a[i+d],e,d),h===E&&(h=this._$AH[d]),n||(n=!L(h)||h!==this._$AH[d]),h===c?t=c:t!==c&&(t+=(h??"")+o[d+1]),this._$AH[d]=h}n&&!s&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class qt extends q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}}class jt extends q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}}class Zt extends q{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=M(this,t,e,0)??c)===E)return;const i=this._$AH,s=t===c&&i!==c||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==c&&(i===c||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Bt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}}const Vt=P.litHtmlPolyfillSupport;Vt?.(D,N),(P.litHtmlVersions??(P.litHtmlVersions=[])).push("3.3.2");const Ft=(r,t,e)=>{const i=e?.renderBefore??t;let s=i._$litPart$;if(s===void 0){const o=e?.renderBefore??null;i._$litPart$=s=new N(t.insertBefore(O(),o),o,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=globalThis;class z extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ft(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}}z._$litElement$=!0,z.finalized=!0,I.litElementHydrateSupport?.({LitElement:z});const Wt=I.litElementPolyfillSupport;Wt?.({LitElement:z});(I.litElementVersions??(I.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Gt={attribute:!0,type:String,converter:U,reflect:!1,hasChanged:J},Jt=(r=Gt,t,e)=>{const{kind:i,metadata:s}=e;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),i==="setter"&&((r=Object.create(r)).wrapped=!0),o.set(e.name,r),i==="accessor"){const{name:n}=e;return{set(a){const d=t.get.call(this);t.set.call(this,a),this.requestUpdate(n,d,r,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,r,a),a}}}if(i==="setter"){const{name:n}=e;return function(a){const d=this[n];t.call(this,a),this.requestUpdate(n,d,r,!0,a)}}throw Error("Unsupported decorator location: "+i)};function kt(r){return(t,e)=>typeof e=="object"?Jt(r,t,e):((i,s,o)=>{const n=s.hasOwnProperty(o);return s.constructor.createProperty(o,i),n?Object.getOwnPropertyDescriptor(s,o):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function m(r){return kt({...r,state:!0,attribute:!1})}const Kt=yt`
  :host {
    display: block;
  }
  ha-card {
    padding: 12px 12px 8px 12px;
  }
  .card-header {
    font-weight: 600;
    font-size: 1.1em;
    margin-bottom: 12px;
    color: var(--primary-text-color);
  }

  /* ── Search form ── */
  .search-box {
    background: var(--secondary-background-color, rgba(128,128,128,0.08));
    border-radius: 10px;
    padding: 10px 12px;
  }
  .search-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .section-label {
    font-size: 0.8em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-text-color);
    margin-bottom: 2px;
  }
  .quick-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .quick-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    border-radius: 20px;
    border: 1px solid var(--divider-color, rgba(128,128,128,0.18));
    background: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--primary-text-color);
    font-size: 0.85em;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    white-space: nowrap;
  }
  .quick-btn:hover {
    background: var(--secondary-background-color, rgba(128,128,128,0.10));
  }
  .quick-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .quick-btn ha-icon {
    --mdc-icon-size: 16px;
  }

  .text-input-wrap {
    position: relative;
  }
  .stop-input,
  select.stop-input {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, rgba(128,128,128,0.18));
    background: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--primary-text-color);
    font-size: 0.9em;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
  }
  .stop-input:focus,
  select.stop-input:focus {
    border-color: var(--primary-color);
  }
  .suggestions {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 2px);
    z-index: 100;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, rgba(128,128,128,0.18));
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    max-height: 200px;
    overflow-y: auto;
  }
  .suggestion-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 0.88em;
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-bottom: 1px solid var(--divider-color, rgba(128,128,128,0.12));
  }
  .suggestion-item:last-child {
    border-bottom: none;
  }
  .suggestion-item:hover {
    background: var(--secondary-background-color, rgba(128,128,128,0.08));
  }
  .suggestion-name {
    font-weight: 500;
  }
  .suggestion-meta {
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }

  /* ── Swap row ── */
  .action-row {
    display: flex;
    align-items: center;
    margin: 6px 0;
  }
  /* ── Search row ── */
  .search-row {
    display: flex;
    margin: 12px 0 8px 0;
  }
  .swap-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex: 1;
    width: 100%;
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid var(--primary-color);
    background: transparent;
    color: var(--primary-color);
    font-size: 0.95em;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
    font-family: inherit;
  }
  .swap-btn:hover {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .swap-btn ha-icon {
    --mdc-icon-size: 18px;
  }
  .search-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    justify-content: center;
    width: 100%;
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    font-size: 0.95em;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
    font-family: inherit;
  }
  .search-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .search-btn ha-icon {
    --mdc-icon-size: 18px;
  }

  /* ── Status ── */
  .status-row {
    text-align: center;
    padding: 12px;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
  .error-row {
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--error-color, #db4437);
    color: var(--text-primary-color, #fff);
    font-size: 0.88em;
    margin-bottom: 8px;
  }

  /* ── Results ── */
  .results-header {
    font-weight: 600;
    font-size: 0.85em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
  }
  .trip-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .trip {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--tl-trip-gap, 4px);
    padding: 8px 10px;
    border-radius: 10px;
    background: var(--secondary-background-color, rgba(128,128,128,0.08));
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
  }
  .trip:hover {
    background: var(--secondary-background-color, rgba(128,128,128,0.12));
  }
  .trip--expanded {
    background: var(--secondary-background-color, rgba(128,128,128,0.10));
  }
  .leg {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: var(--tl-pill-padding-y, 4px) var(--tl-pill-padding-x, 8px);
    border-radius: var(--tl-pill-radius, 12px);
    background: var(--tl-leg-pill-bg, var(--ha-card-background, rgba(128,128,128,0.12)));
    box-shadow: inset 0 0 0 1px var(--divider-color, rgba(128,128,128,0.15));
    font-size: var(--tl-font-size-leg, 0.85em);
  }
  .leg ha-icon {
    --mdc-icon-size: var(--tl-icon-size, 16px);
  }
  .leg .line {
    font-weight: 600;
  }
  .leg-endpoint {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: var(--tl-pill-padding-y, 4px) var(--tl-pill-padding-x, 8px);
    border-radius: var(--tl-pill-radius, 12px);
    font-size: var(--tl-font-size-leg, 0.85em);
    font-weight: 500;
  }
  .leg-endpoint.start {
    background: var(--tl-start-pill-bg, var(--success-color, #43a047));
    color: var(--text-primary-color, #fff);
  }
  .leg-endpoint.end {
    background: var(--tl-end-pill-bg, var(--primary-color));
    color: var(--text-primary-color, #fff);
  }
  .leg-endpoint ha-icon {
    --mdc-icon-size: var(--tl-icon-size, 16px);
  }
  .arrow {
    color: var(--tl-arrow-color, var(--secondary-text-color));
    display: inline-flex;
    align-items: center;
  }
  .arrow ha-icon {
    --mdc-icon-size: 16px;
  }
  .trip-time {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-size: var(--tl-font-size-leg, 0.85em);
    font-weight: 600;
    color: var(--secondary-text-color);
    padding: 0 2px;
  }
  .trip-time ha-icon {
    --mdc-icon-size: 13px;
    opacity: 0.65;
  }
  .trip-time--dep ha-icon {
    color: var(--success-color, #43a047);
    opacity: 0.8;
  }
  .trip-time--arr ha-icon {
    color: var(--primary-color);
    opacity: 0.8;
  }
  .trip-meta {
    width: 100%;
    font-size: var(--tl-font-size-details, 0.8em);
    color: var(--secondary-text-color);
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .trip-chevron {
    display: inline-flex;
    align-items: center;
    color: var(--secondary-text-color);
    opacity: 0.6;
    transition: transform 0.2s ease;
    margin-left: auto;
  }
  .trip-chevron ha-icon {
    --mdc-icon-size: 16px;
  }
  .trip-chevron.open {
    transform: rotate(180deg);
  }
  .trip-stops {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0px 1px;
    font-size: 0.78em;
    color: var(--secondary-text-color);
    margin-top: 5px;
    line-height: 1.5;
  }
  .trip-stops-sep {
    color: var(--secondary-text-color);
    opacity: 0.45;
    padding: 0 2px;
    flex-shrink: 0;
  }
  .trip-stop-name {
    white-space: nowrap;
  }
  .trip-stop-endpoint {
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .trip-detail {
    margin-top: 6px;
    font-size: var(--tl-font-size-details, 0.8em);
    color: var(--secondary-text-color);
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .muted {
    opacity: 0.7;
  }
  .map-link a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px dotted currentColor;
  }
  .no-trips {
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 0.9em;
    padding: 8px;
  }

  /* ── Trip expanded timeline ── */
  .trip-expand {
    width: 100%;
    margin-top: 8px;
    padding-top: 10px;
    border-top: 1px solid var(--divider-color, rgba(128,128,128,0.15));
    animation: tl-slide-in 0.18s ease;
    overflow: hidden;
  }
  @keyframes tl-slide-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .tl {
    display: grid;
    grid-template-columns: 42px 14px 1fr;
  }
  .tl-time {
    font-size: 0.78em;
    font-weight: 600;
    color: var(--primary-text-color);
    text-align: right;
    padding-right: 7px;
    padding-top: 4px;
    line-height: 1;
  }
  .tl-node {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .tl-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 3px;
  }
  .tl-dot-start {
    background: var(--success-color, #43a047);
  }
  .tl-dot-end {
    background: var(--primary-color);
  }
  .tl-dot-mid {
    background: var(--secondary-text-color);
    opacity: 0.5;
    width: 8px;
    height: 8px;
    margin-top: 4px;
  }
  .tl-line-seg {
    width: 2px;
    flex: 1;
    background: var(--divider-color, rgba(128,128,128,0.30));
    min-height: 8px;
  }
  .tl-stop-cell {
    padding: 1px 0 7px 8px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
  }
  .tl-stop-name {
    font-size: 0.88em;
    font-weight: 500;
    line-height: 1.3;
    color: var(--primary-text-color);
  }
  .tl-leg-cell {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 2px 0 2px 8px;
    font-size: 0.8em;
    color: var(--secondary-text-color);
  }
  .tl-leg-cell ha-icon {
    --mdc-icon-size: 15px;
  }
  .tl-leg-line {
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .tl-leg-meta {
    color: var(--secondary-text-color);
  }
  .tl-leg-dir {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 160px;
  }
  .tl-transfer-badge {
    display: inline-block;
    font-size: 0.78em;
    font-weight: 500;
    color: var(--secondary-text-color);
    background: var(--secondary-background-color, rgba(128,128,128,0.12));
    border-radius: 10px;
    padding: 1px 7px;
  }
  .tl-platform-badge {
    display: inline-block;
    font-size: 0.78em;
    font-weight: 500;
    color: var(--primary-text-color);
    background: var(--secondary-background-color, rgba(128,128,128,0.12));
    border-radius: 10px;
    padding: 1px 7px;
  }
`;function pt(r){const t=(r||"").toLowerCase();return/(walk|foot|gå)/.test(t)?"mdi:walk":/(bus|buss)/.test(t)?"mdi:bus":/(train|tå|rail)/.test(t)?"mdi:train":/(metro|subway|tunnelbana)/.test(t)?"mdi:subway":/(tram|spårvagn)/.test(t)?"mdi:tram":/(ferry|boat|båt)/.test(t)?"mdi:ferry":/(car|bil|taxi)/.test(t)?"mdi:car":"mdi:map-marker-path"}const Yt="mdi:chevron-right",Qt="mdi:swap-vertical",_t="mdi:home",Z="mdi:account",gt="mdi:map-marker",B="mdi:magnify",ut="mdi:map-marker",V="mdi:loading";function Xt(r){const t=document.createElement("ha-icon");return t.setAttribute("icon",r),t}const te={title:"Trafiklab Dynamic Travel"},ee={config_entry_id:"Resrobot config entry ID",api_key:"Resrobot API key",my_location_entity:"My Location entity",home_zone:"Home zone entity",persons:"Person entities (comma-separated)",zones:"Zone entities (comma-separated)",max_items:"Max trips",max_legs:"Max legs per trip",max_walking_distance:"Max walking distance (m)",include_platform:"Include platform/stop info",help_config_entry_id:"Config entry ID of a Resrobot travel sensor (provides the API key)",help_api_key:"Direct Resrobot API key (alternative to config entry ID)",help_my_location_entity:"Person or device_tracker entity used for 'My Location' button",help_home_zone:"Zone entity for the Home button (default: zone.home)",help_persons:"Person entities shown as quick destination buttons",help_zones:"Zone entities shown as quick destination buttons",help_max_items:"Maximum number of trips to display",help_max_legs:"Maximum number of legs rendered per trip",help_max_walking_distance:"Maximum walking distance in metres at origin and destination",help_include_platform:"Request platform/stop designator from the search service"},ie={origin_label:"From",destination_label:"To",my_location:"My Location",home:"Home",gps_location:"My Location",get_gps:"Get my location",zone:"Zone",select_zone:"Select zone…",type_stop:"Type stop…",search_btn:"Search",searching:"Searching…",swap_btn:"Swap",swap_tooltip:"Swap origin and destination",placeholder_origin:"Enter stop name or address…",placeholder_destination:"Enter stop name or address…",no_results:"No trips found",results_title:"Available trips"},se={mode_walk:"Walk",mode_bus:"Bus",mode_train:"Train",mode_metro:"Metro",mode_tram:"Tram",mode_boat:"Ferry",mode_taxi:"Taxi",transfer:"Transfer",platform:"Platform/Stop",start:"Start",end:"End",duration:"{h}h {m}min",duration_min:"{m}min"},oe={search_failed:"Search failed: {message}",no_api_key:"No Resrobot API key configured. Set config_entry_id or api_key in card config.",origin_required:"Please specify an origin",destination_required:"Please specify a destination",my_location_not_configured:"No location entity configured. Set my_location_entity in card config.",my_location_unavailable:"Location of '{entity}' is not available",gps_unavailable:"Could not get your device location. Please allow location access and try again."},ne={card:te,editor:ee,search:ie,label:se,error:oe},re={title:"Trafiklab Dynamisk Resa"},ae={config_entry_id:"Resrobot konfigurations-ID",api_key:"Resrobot API-nyckel",my_location_entity:"Min plats-entitet",home_zone:"Hem-zon entitet",persons:"Person-entiteter (kommaseparerade)",zones:"Zon-entiteter (kommaseparerade)",max_items:"Max antal resor",max_legs:"Max antal delresor",max_walking_distance:"Max gångavstånd (m)",include_platform:"Inkludera plattform/lägeinfo",help_config_entry_id:"Konfigurations-ID för en Resrobot-sensor (ger API-nyckeln)",help_api_key:"Direkt Resrobot API-nyckel (alternativ till konfigurations-ID)",help_my_location_entity:"Person- eller device_tracker-entitet för knappen 'Min plats'",help_home_zone:"Zon-entitet för Hem-knappen (standard: zone.home)",help_persons:"Person-entiteter som visas som snabb destinationsknapp",help_zones:"Zon-entiteter som visas som snabb destinationsknapp",help_max_items:"Maximalt antal resor som visas",help_max_legs:"Maximalt antal delresor per resa",help_max_walking_distance:"Maximalt gångavstånd i meter vid origin och destination",help_include_platform:"Begär plattform/lägesbeteckning från söktjänsten"},le={origin_label:"Från",destination_label:"Till",my_location:"Min plats",home:"Hem",gps_location:"Min Plats",get_gps:"Hämta min plats",zone:"Zon",select_zone:"Välj zon…",type_stop:"Skriv hållplats…",search_btn:"Sök",searching:"Söker…",swap_btn:"Byt",swap_tooltip:"Byt origin och destination",placeholder_origin:"Ange hållplats eller adress…",placeholder_destination:"Ange hållplats eller adress…",no_results:"Inga resor hittades",results_title:"Tillgängliga resor"},de={mode_walk:"Gång",mode_bus:"Buss",mode_train:"Tåg",mode_metro:"Tunnelbana",mode_tram:"Spårvagn",mode_boat:"Båt",mode_taxi:"Taxi",transfer:"Byte",platform:"Plattform/Läge",start:"Start",end:"Slut",duration:"{h}t {m}min",duration_min:"{m}min"},ce={search_failed:"Sökning misslyckades: {message}",no_api_key:"Ingen Resrobot API-nyckel konfigurerad. Ange config_entry_id eller api_key i kortets inställningar.",origin_required:"Ange en origin",destination_required:"Ange en destination",my_location_not_configured:"Ingen plats-entitet konfigurerad. Ange my_location_entity i kortets inställningar.",my_location_unavailable:"Platsen för '{entity}' är inte tillgänglig",gps_unavailable:"Kunde inte hämta enhetens plats. Tillåt platsåtkomst och försök igen."},he={card:re,editor:ae,search:le,label:de,error:ce};function wt(r,t,e){const i=r?.locale?.language||r?.language||"en",s=String(i).toLowerCase().startsWith("sv")?he:ne,o=t.split(".").reduce((n,a)=>n?n[a]:void 0,s)||t;return e?Object.entries(e).reduce((n,[a,d])=>n.replaceAll(`{${a}}`,String(d)),o):o}const Q=class Q extends z{setConfig(t){const e={type:"custom:trafiklab-dynamic-travel-card",home_zone:"zone.home",max_items:3,max_legs:12,include_platform:!1,max_walking_distance:1e3};this._config={...e,...t}}_valueChanged(t){if(!this._config)return;const e=t.currentTarget,i=t.detail,s=e?.configValue??e?.dataset?.configValue;if(!s)return;const o={...this._config};let n=i?.value??e.value??e.checked;if(e?.type==="checkbox")n=e.checked;else if(s==="max_legs"||s==="max_items"||s==="max_walking_distance"){const a=Number(n);Number.isNaN(a)||(n=a)}else(s==="persons"||s==="zones")&&(n=String(n).split(",").map(a=>a.trim()).filter(Boolean));n!==void 0&&(o[s]=n),JSON.stringify(o)!==JSON.stringify(this._config)&&(this._config=o,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o}})))}_haFormValueChanged(t){const e=t.detail?.value||{},i={...this._config||{type:"trafiklab-dynamic-travel-card"},title:e.title,config_entry_id:e.config_entry_id,api_key:e.api_key,my_location_entity:e.my_location_entity,home_zone:e.home_zone||"zone.home",max_legs:typeof e.max_legs=="number"?e.max_legs:Number(e.max_legs)||12,include_platform:!!e.include_platform,max_items:typeof e.max_items=="number"?e.max_items:Number(e.max_items)||3,max_walking_distance:typeof e.max_walking_distance=="number"?e.max_walking_distance:Number(e.max_walking_distance)||1e3};JSON.stringify(i)!==JSON.stringify(this._config)&&(this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i}})))}render(){const t=a=>wt(this.hass,a),e=this._config;if(!e)return l``;const i=!!customElements.get("ha-form"),s=!!customElements.get("ha-textfield"),o=Array.isArray(e.persons)?e.persons.join(", "):e.persons??"",n=Array.isArray(e.zones)?e.zones.join(", "):e.zones??"";if(i){const a=[{name:"title",selector:{text:{}}},{name:"config_entry_id",selector:{config_entry:{integration:"trafiklab"}}},{name:"my_location_entity",selector:{entity:{domain:["person","device_tracker"]}}},{name:"home_zone",selector:{entity:{domain:"zone"}}},{name:"max_items",selector:{number:{min:1,max:10,mode:"box"}}},{name:"max_legs",selector:{number:{min:1,max:20,mode:"box"}}},{name:"max_walking_distance",selector:{number:{min:0,max:5e3,step:100,mode:"slider",unit_of_measurement:"m"}}},{name:"include_platform",selector:{boolean:{}}}],d={title:e.title??"",config_entry_id:e.config_entry_id??"",my_location_entity:e.my_location_entity??"",home_zone:e.home_zone??"zone.home",max_items:e.max_items??3,max_legs:e.max_legs??12,max_walking_distance:e.max_walking_distance??1e3,include_platform:e.include_platform??!1};return l`
        <ha-form
          .hass=${this.hass}
          .data=${d}
          .schema=${a}
          .computeLabel=${h=>{switch(h.name){case"title":return"Card title";case"config_entry_id":return t("editor.config_entry_id");case"my_location_entity":return t("editor.my_location_entity");case"home_zone":return t("editor.home_zone");case"max_items":return t("editor.max_items");case"max_legs":return t("editor.max_legs");case"max_walking_distance":return t("editor.max_walking_distance");case"include_platform":return t("editor.include_platform");default:return String(h.name)}}}
          .computeHelper=${h=>{switch(h.name){case"config_entry_id":return t("editor.help_config_entry_id");case"my_location_entity":return t("editor.help_my_location_entity");case"home_zone":return t("editor.help_home_zone");case"max_items":return t("editor.help_max_items");case"max_legs":return t("editor.help_max_legs");case"max_walking_distance":return t("editor.help_max_walking_distance");case"include_platform":return t("editor.help_include_platform");default:return}}}
          @value-changed=${this._haFormValueChanged}
        ></ha-form>

        <!-- Person and zone lists cannot be represented with ha-form entity-list selector easily,
             so we fall back to text fields for those even in ha-form mode -->
        <div class="extra-fields">
          <div class="field">
            <label class="lbl">
              ${t("editor.persons")}
              <input
                type="text"
                .value=${o}
                placeholder="person.john, person.jane"
                data-config-value="persons"
                @input=${h=>this._valueChanged(h)}
              />
            </label>
            <div class="help">${t("editor.help_persons")}</div>
          </div>
          <div class="field">
            <label class="lbl">
              ${t("editor.zones")}
              <input
                type="text"
                .value=${n}
                placeholder="zone.work, zone.gym"
                data-config-value="zones"
                @input=${h=>this._valueChanged(h)}
              />
            </label>
            <div class="help">${t("editor.help_zones")}</div>
          </div>
        </div>
      `}return l`
      <div class="card-config">
        <div class="field">
          <label class="lbl">Card title
            <input type="text" .value=${e.title??""} data-config-value="title" @input=${a=>this._valueChanged(a)} />
          </label>
        </div>
        <div class="field">
          <label class="lbl">${t("editor.config_entry_id")}
            <input type="text" .value=${e.config_entry_id??""} data-config-value="config_entry_id" @input=${a=>this._valueChanged(a)} />
          </label>
          <div class="help">${t("editor.help_config_entry_id")}</div>
        </div>
        <div class="field">
          <label class="lbl">${t("editor.my_location_entity")}
            <input type="text" .value=${e.my_location_entity??""} placeholder="person.john" data-config-value="my_location_entity" @input=${a=>this._valueChanged(a)} />
          </label>
          <div class="help">${t("editor.help_my_location_entity")}</div>
        </div>
        <div class="field">
          <label class="lbl">${t("editor.home_zone")}
            <input type="text" .value=${e.home_zone??"zone.home"} data-config-value="home_zone" @input=${a=>this._valueChanged(a)} />
          </label>
          <div class="help">${t("editor.help_home_zone")}</div>
        </div>
        <div class="field">
          <label class="lbl">${t("editor.persons")}
            <input type="text" .value=${o} placeholder="person.john, person.jane" data-config-value="persons" @input=${a=>this._valueChanged(a)} />
          </label>
          <div class="help">${t("editor.help_persons")}</div>
        </div>
        <div class="field">
          <label class="lbl">${t("editor.zones")}
            <input type="text" .value=${n} placeholder="zone.work, zone.gym" data-config-value="zones" @input=${a=>this._valueChanged(a)} />
          </label>
          <div class="help">${t("editor.help_zones")}</div>
        </div>
        <div class="field">
          ${s?l`<ha-textfield .label=${t("editor.max_items")} .value=${String(e.max_items??3)} .configValue=${"max_items"} type="number" min="1" max="10" @value-changed=${this._valueChanged} @input=${this._valueChanged}></ha-textfield>`:l`<label class="lbl">${t("editor.max_items")}<input type="number" min="1" max="10" .value=${String(e.max_items??3)} data-config-value="max_items" @input=${a=>this._valueChanged(a)} /></label>`}
        </div>
        <div class="field">
          ${s?l`<ha-textfield .label=${t("editor.max_legs")} .value=${String(e.max_legs??12)} .configValue=${"max_legs"} type="number" min="1" max="20" @value-changed=${this._valueChanged} @input=${this._valueChanged}></ha-textfield>`:l`<label class="lbl">${t("editor.max_legs")}<input type="number" min="1" max="20" .value=${String(e.max_legs??12)} data-config-value="max_legs" @input=${a=>this._valueChanged(a)} /></label>`}
        </div>
        <div class="field">
          ${s?l`<ha-textfield .label=${t("editor.max_walking_distance")} .value=${String(e.max_walking_distance??1e3)} .configValue=${"max_walking_distance"} type="number" min="0" max="5000" @value-changed=${this._valueChanged} @input=${this._valueChanged}></ha-textfield>`:l`<label class="lbl">${t("editor.max_walking_distance")}<input type="number" min="0" max="5000" .value=${String(e.max_walking_distance??1e3)} data-config-value="max_walking_distance" @input=${a=>this._valueChanged(a)} /></label>`}
        </div>
        <div class="field">
          <label class="lbl"><input type="checkbox" ?checked=${e.include_platform??!1} data-config-value="include_platform" @change=${a=>this._valueChanged(a)} /> ${t("editor.include_platform")}</label>
          <div class="help">${t("editor.help_include_platform")}</div>
        </div>
      </div>
    `}};Q.styles=yt`
    .card-config, .extra-fields { display: grid; gap: 12px; margin-top: 8px; }
    .field { display: grid; gap: 4px; }
    .lbl { display: grid; gap: 4px; font: inherit; color: var(--primary-text-color); }
    .help { font-size: 0.8em; color: var(--secondary-text-color); }
    input[type="text"], input[type="number"] {
      padding: 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      width: 100%;
      box-sizing: border-box;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
  `;let F=Q;customElements.define("trafiklab-dynamic-travel-card-editor",F);var pe=Object.defineProperty,u=(r,t,e,i)=>{for(var s=void 0,o=r.length-1,n;o>=0;o--)(n=r[o])&&(s=n(t,e,s)||s);return s&&pe(t,e,s),s};const Y="trafiklab-dynamic-travel-card",_e="Trafiklab Dynamic Travel Search",ge="Dynamically search for public transport journeys using the Trafiklab integration.";function mt(r,t){let e;return(...i)=>{clearTimeout(e),e=setTimeout(()=>r(...i),t)}}var f;const g=(f=class extends z{constructor(){super(...arguments),this._originMode="my_location",this._originText="",this._originStopId=null,this._originZoneEntity="",this._originSuggestions=[],this._originSuggestionsOpen=!1,this._destMode="home",this._destPersonEntity="",this._destZoneEntity="",this._destText="",this._destStopId=null,this._destSuggestions=[],this._destSuggestionsOpen=!1,this._gpsCoords=null,this._gpsLoading=!1,this._gpsInitDone=!1,this._trips=[],this._loading=!1,this._error=null,this._hasSearched=!1,this._expandedTripIndex=null,this._originLabel="",this._destLabel="",this._originLookup=mt(t=>this._stopLookup(t,"origin"),500),this._destLookup=mt(t=>this._stopLookup(t,"dest"),500)}setConfig(t){if(!t)throw new Error("Configuration required");this._config={home_zone:"zone.home",max_items:3,max_legs:12,include_platform:!1,max_walking_distance:1e3,...t},this._config.persons?.length&&(this._destPersonEntity=this._config.persons[0]),this._config.zones?.length&&(this._destZoneEntity=this._config.zones[0])}getCardSize(){return 4}static getConfigElement(){return document.createElement("trafiklab-dynamic-travel-card-editor")}static getStubConfig(){return{type:Y,home_zone:"zone.home",max_items:3,max_legs:12,include_platform:!1,max_walking_distance:1e3}}connectedCallback(){super.connectedCallback()}updated(t){if(super.updated(t),!t.has("hass")||!this.hass||this._gpsInitDone)return;this._gpsInitDone=!0;const e=this._coordsFromEntity();if(e){this._gpsCoords=e,(this._originMode==="my_location"||this._originMode==="gps")&&(this._originMode="gps");return}typeof navigator>"u"||!navigator.permissions||navigator.permissions.query({name:"geolocation"}).then(i=>{i.state==="granted"&&navigator.geolocation.getCurrentPosition(s=>{this._gpsCoords={lat:s.coords.latitude,lon:s.coords.longitude},(this._originMode==="my_location"||this._originMode==="gps")&&(this._originMode="gps")},()=>{})}).catch(()=>{})}t(t,e){return wt(this.hass,t,e)}_renderIconEl(t){return customElements?.get?.("ha-icon")?Xt(t):l`<span class="icon-fallback">${t}</span>`}_renderIcon(t){return l`${this._renderIconEl(t)}`}_entityName(t){return this.hass?.states?.[t]?.attributes?.friendly_name||t.split(".").pop()||t}_zoneName(t){return this._entityName(t)}_coordsFromEntity(){const t=this._config?.my_location_entity||this._findCurrentUserEntity();if(!t||!this.hass?.states?.[t])return null;const{latitude:e,longitude:i}=this.hass.states[t].attributes;return typeof e=="number"&&typeof i=="number"?{lat:e,lon:i}:null}_findCurrentUserEntity(){const t=this.hass?.user?.id;return!t||!this.hass?.states?null:Object.keys(this.hass.states).find(i=>i.startsWith("person.")&&this.hass.states[i].attributes?.user_id===t)??null}_hasGeolocation(){return this._config?.my_location_entity||this._findCurrentUserEntity()?!0:typeof navigator<"u"&&!!navigator.geolocation}_requestGps(t){const e=()=>{t==="origin"?this._originMode="gps":this._destMode="gps"},i=this._coordsFromEntity();if(i){this._gpsCoords=i,e();return}if(!navigator?.geolocation){this._error=this.t("error.gps_unavailable");return}if(this._gpsCoords){e();return}this._gpsLoading=!0,navigator.geolocation.getCurrentPosition(s=>{this._gpsCoords={lat:s.coords.latitude,lon:s.coords.longitude},this._gpsLoading=!1,e()},()=>{this._gpsLoading=!1,this._error=this.t("error.gps_unavailable")},{timeout:15e3})}async _stopLookup(t,e){if(t.length<2){e==="origin"?(this._originSuggestions=[],this._originSuggestionsOpen=!1):(this._destSuggestions=[],this._destSuggestionsOpen=!1);return}try{const i={search_query:t};this._config.config_entry_id&&(i.config_entry_id=this._config.config_entry_id),this._config.api_key&&(i.api_key=this._config.api_key);const s=await this.hass.connection.sendMessagePromise({type:"call_service",domain:"trafiklab",service:"stop_lookup",service_data:i,return_response:!0}),o=s?.response?.stops_found||s?.stops_found||[];e==="origin"?(this._originSuggestions=o.slice(0,8),this._originSuggestionsOpen=o.length>0):(this._destSuggestions=o.slice(0,8),this._destSuggestionsOpen=o.length>0)}catch{}}_selectOriginSuggestion(t){this._originText=t.name,this._originStopId=t.id,this._originSuggestions=[],this._originSuggestionsOpen=!1}_selectDestSuggestion(t){this._destText=t.name,this._destStopId=t.id,this._destSuggestions=[],this._destSuggestionsOpen=!1}_swap(){const t=this._originMode,e=this._originText,i=this._originStopId,s=this._originZoneEntity,o=this._destMode,n=this._destText,a=this._destStopId,d=this._destPersonEntity,h=this._destZoneEntity;o==="text"?(this._originMode="text",this._originText=n,this._originStopId=a):o==="zone"?(this._originMode="zone",this._originZoneEntity=h):o==="home"?this._originMode="home":o==="gps"?this._originMode="gps":this._originMode="my_location",this._originSuggestions=[],this._originSuggestionsOpen=!1,t==="text"?(this._destMode="text",this._destText=e,this._destStopId=i):t==="zone"?(this._destMode="zone",this._destZoneEntity=s):t==="home"?this._destMode="home":t==="gps"?this._destMode="gps":this._destMode="my_location",this._destSuggestions=[],this._destSuggestionsOpen=!1,this._destPersonEntity=d}async _search(){this._error=null;let t,e;if(this._originMode==="my_location"){const o=this._config.my_location_entity;if(!o){this._error=this.t("error.my_location_not_configured");return}t=o,e="person"}else if(this._originMode==="home")t=this._config.home_zone||"zone.home",e="zone";else if(this._originMode==="gps"){const o=this._coordsFromEntity();if(o&&(this._gpsCoords=o),!this._gpsCoords){this._error=this.t("error.gps_unavailable");return}t=`${this._gpsCoords.lat},${this._gpsCoords.lon}`,e="coordinates"}else if(this._originMode==="zone"){if(!this._originZoneEntity){this._error=this.t("error.origin_required");return}t=this._originZoneEntity,e="zone"}else{if(!this._originText.trim()){this._error=this.t("error.origin_required");return}this._originStopId?(t=this._originStopId,e="stop_id"):(t=this._originText.trim(),e="name")}let i,s;if(this._destMode==="home")i=this._config.home_zone||"zone.home",s="zone";else if(this._destMode==="my_location"){const o=this._config.my_location_entity;if(!o){this._error=this.t("error.my_location_not_configured");return}i=o,s="person"}else if(this._destMode==="gps"){const o=this._coordsFromEntity();if(o&&(this._gpsCoords=o),!this._gpsCoords){this._error=this.t("error.gps_unavailable");return}i=`${this._gpsCoords.lat},${this._gpsCoords.lon}`,s="coordinates"}else if(this._destMode==="person"){if(!this._destPersonEntity){this._error=this.t("error.destination_required");return}i=this._destPersonEntity,s="person"}else if(this._destMode==="zone"){if(!this._destZoneEntity){this._error=this.t("error.destination_required");return}i=this._destZoneEntity,s="zone"}else{if(!this._destText.trim()){this._error=this.t("error.destination_required");return}this._destStopId?(i=this._destStopId,s="stop_id"):(i=this._destText.trim(),s="name")}this._originMode==="my_location"?this._originLabel=this.t("search.my_location"):this._originMode==="home"?this._originLabel=this._zoneName(this._config.home_zone||"zone.home"):this._originMode==="gps"?this._originLabel=this.t("search.gps_location"):this._originMode==="zone"?this._originLabel=this._zoneName(this._originZoneEntity):this._originLabel=this._originText.trim(),this._destMode==="home"?this._destLabel=this._zoneName(this._config.home_zone||"zone.home"):this._destMode==="my_location"?this._destLabel=this.t("search.my_location"):this._destMode==="gps"?this._destLabel=this.t("search.gps_location"):this._destMode==="person"?this._destLabel=this._entityName(this._destPersonEntity):this._destMode==="zone"?this._destLabel=this._zoneName(this._destZoneEntity):this._destLabel=this._destText.trim(),this._loading=!0,this._trips=[],this._hasSearched=!1,this._expandedTripIndex=null;try{const o={origin:t,origin_type:e,destination:i,destination_type:s,max_walking_distance:this._config.max_walking_distance??1e3};this._config.include_platform&&(o.include_platform=!0),this._config.config_entry_id&&(o.config_entry_id=this._config.config_entry_id),this._config.api_key&&(o.api_key=this._config.api_key);const n=await this.hass.connection.sendMessagePromise({type:"call_service",domain:"trafiklab",service:"travel_search",service_data:o,return_response:!0}),a=n?.response??n??{};if(a.error)this._error=this.t("error.search_failed",{message:a.error});else{const d=a.trips??[];this._trips=d.slice(0,this._config.max_items??3)}}catch(o){this._error=this.t("error.search_failed",{message:String(o?.message??o)})}finally{this._loading=!1,this._hasSearched=!0}}_availableZones(){return this.hass?.states?Object.keys(this.hass.states).filter(t=>t.startsWith("zone.")).map(t=>({entity_id:t,name:this.hass.states[t].attributes?.friendly_name||t.split(".").pop()||t})).sort((t,e)=>t.name.localeCompare(e.name)):[]}render(){const t=(e,i)=>this.t(e,i);return l`
      <ha-card>
        ${this._config.title?l`<div class="card-header">${this._config.title}</div>`:c}

        <div class="search-box">
          ${this._renderOriginSection()}
        </div>

        <div class="action-row">
          <button
            class="swap-btn"
            title="${t("search.swap_tooltip")}"
            @click=${this._swap}
          >${this._renderIcon(Qt)} ${t("search.swap_btn")}</button>
        </div>

        <div class="search-box">
          ${this._renderDestinationSection()}
        </div>

        <div class="search-row">
          <button
            class="search-btn"
            ?disabled=${this._loading}
            @click=${this._search}
          >
            ${this._renderIcon(this._loading?V:B)}
            ${this._loading?t("search.searching"):t("search.search_btn")}
          </button>
        </div>

        ${this._error?l`<div class="error-row">${this._error}</div>`:c}

        ${this._hasSearched?this._renderResults():c}
      </ha-card>
    `}_renderOriginSection(){const t=s=>this.t(s),e=!!this._config.my_location_entity,i=this._availableZones();return l`
      <div class="search-section">
        <div class="section-label">${t("search.origin_label")}</div>
        <div class="quick-buttons">
          ${e?l`<button
                class="quick-btn ${this._originMode==="my_location"?"active":""}"
                @click=${()=>{this._originMode="my_location"}}
              >${this._renderIcon(Z)} ${t("search.my_location")}</button>`:c}
          ${this._hasGeolocation()?l`<button
                class="quick-btn ${this._originMode==="gps"?"active":""}"
                ?disabled=${this._gpsLoading}
                @click=${()=>this._requestGps("origin")}
              >${this._renderIcon(this._gpsLoading?V:ut)}
              ${this._gpsCoords?t("search.gps_location"):t("search.get_gps")}</button>`:c}
          <button
            class="quick-btn ${this._originMode==="home"?"active":""}"
            @click=${()=>{this._originMode="home"}}
          >${this._renderIcon(_t)} ${t("search.home")}</button>
          <button
            class="quick-btn ${this._originMode==="zone"?"active":""}"
            @click=${()=>{this._originMode="zone"}}
          >${this._renderIcon(gt)} ${t("search.zone")}</button>
          <button
            class="quick-btn ${this._originMode==="text"?"active":""}"
            @click=${()=>{this._originMode="text"}}
          >${this._renderIcon(B)} ${t("search.type_stop")}</button>
        </div>

        ${this._originMode==="zone"?l`
            <select
              class="stop-input"
              @change=${s=>{this._originZoneEntity=s.target.value}}
            >
              <option value="" ?selected=${!this._originZoneEntity}>${t("search.select_zone")}</option>
              ${i.map(s=>l`
                <option value=${s.entity_id} ?selected=${this._originZoneEntity===s.entity_id}>${s.name}</option>
              `)}
            </select>`:c}

        ${this._originMode==="text"?l`
            <div class="text-input-wrap">
              <input
                class="stop-input"
                type="text"
                .value=${this._originText}
                placeholder="${t("search.placeholder_origin")}"
                autocomplete="off"
                @input=${s=>{const o=s.target.value;this._originText=o,this._originStopId=null,this._originLookup(o)}}
                @blur=${()=>setTimeout(()=>{this._originSuggestionsOpen=!1},200)}
                @focus=${()=>{this._originSuggestions.length&&(this._originSuggestionsOpen=!0)}}
              />
              ${this._originSuggestionsOpen&&this._originSuggestions.length?l`<div class="suggestions">
                    ${this._originSuggestions.map(s=>l`
                      <div class="suggestion-item" @mousedown=${()=>this._selectOriginSuggestion(s)}>
                        <span class="suggestion-name">${s.name}</span>
                        ${s.transport_modes?.length?l`<span class="suggestion-meta">${s.transport_modes.join(", ")}</span>`:c}
                      </div>
                    `)}
                  </div>`:c}
            </div>`:c}
      </div>
    `}_renderDestinationSection(){const t=o=>this.t(o),e=!!this._config.my_location_entity,i=this._config.persons??[],s=this._availableZones();return l`
      <div class="search-section">
        <div class="section-label">${t("search.destination_label")}</div>
        <div class="quick-buttons">
          ${e?l`<button
                class="quick-btn ${this._destMode==="my_location"?"active":""}"
                @click=${()=>{this._destMode="my_location"}}
              >${this._renderIcon(Z)} ${t("search.my_location")}</button>`:c}
          ${this._hasGeolocation()?l`<button
                class="quick-btn ${this._destMode==="gps"?"active":""}"
                ?disabled=${this._gpsLoading}
                @click=${()=>this._requestGps("dest")}
              >${this._renderIcon(this._gpsLoading?V:ut)}
              ${this._gpsCoords?t("search.gps_location"):t("search.get_gps")}</button>`:c}
          <button
            class="quick-btn ${this._destMode==="home"?"active":""}"
            @click=${()=>{this._destMode="home"}}
          >${this._renderIcon(_t)} ${t("search.home")}</button>

          ${i.map(o=>l`
            <button
              class="quick-btn ${this._destMode==="person"&&this._destPersonEntity===o?"active":""}"
              @click=${()=>{this._destMode="person",this._destPersonEntity=o}}
            >${this._renderIcon(Z)} ${this._entityName(o)}</button>
          `)}

          <button
            class="quick-btn ${this._destMode==="zone"?"active":""}"
            @click=${()=>{this._destMode="zone"}}
          >${this._renderIcon(gt)} ${t("search.zone")}</button>

          <button
            class="quick-btn ${this._destMode==="text"?"active":""}"
            @click=${()=>{this._destMode="text"}}
          >${this._renderIcon(B)} ${t("search.type_stop")}</button>
        </div>

        ${this._destMode==="zone"?l`
            <select
              class="stop-input"
              @change=${o=>{this._destZoneEntity=o.target.value}}
            >
              <option value="" ?selected=${!this._destZoneEntity}>${t("search.select_zone")}</option>
              ${s.map(o=>l`
                <option value=${o.entity_id} ?selected=${this._destZoneEntity===o.entity_id}>${o.name}</option>
              `)}
            </select>`:c}

        ${this._destMode==="text"?l`
            <div class="text-input-wrap">
              <input
                class="stop-input"
                type="text"
                .value=${this._destText}
                placeholder="${t("search.placeholder_destination")}"
                autocomplete="off"
                @input=${o=>{const n=o.target.value;this._destText=n,this._destStopId=null,this._destLookup(n)}}
                @blur=${()=>setTimeout(()=>{this._destSuggestionsOpen=!1},200)}
                @focus=${()=>{this._destSuggestions.length&&(this._destSuggestionsOpen=!0)}}
              />
              ${this._destSuggestionsOpen&&this._destSuggestions.length?l`<div class="suggestions">
                    ${this._destSuggestions.map(o=>l`
                      <div class="suggestion-item" @mousedown=${()=>this._selectDestSuggestion(o)}>
                        <span class="suggestion-name">${o.name}</span>
                        ${o.transport_modes?.length?l`<span class="suggestion-meta">${o.transport_modes.join(", ")}</span>`:c}
                      </div>
                    `)}
                  </div>`:c}
            </div>`:c}
      </div>
    `}_renderResults(){const t=(i,s)=>this.t(i,s);if(this._trips.length===0)return l`<div class="no-trips">${t("search.no_results")}</div>`;const e=this._config.max_legs??12;return l`
      <div>
        <div class="results-header">${t("search.results_title")}</div>
        <div class="trip-list">
          ${this._trips.map((i,s)=>this._renderTrip(i,e,s))}
        </div>
      </div>
    `}_renderTrip(t,e,i){const s=(t.legs??[]).filter(Boolean),o=s.length>e?[...s.slice(0,Math.ceil(e/2)),null,...s.slice(s.length-Math.floor(e/2))]:s,n=s[0],a=s[s.length-1],d=n?n.departure||n.origin_time:void 0,h=a?a.arrival||a.dest_time:void 0,_=this._expandedTripIndex===i;return l`
      <div class="trip ${_?"trip--expanded":""}" @click=${()=>this._toggleTripExpand(i)}>
        ${o.map((p,y)=>p===null?l`<span class="arrow">${this._renderIcon("mdi:dots-horizontal")}</span>`:y===0?l`
              ${d?l`<span class="trip-time trip-time--dep">${this._renderIcon("mdi:clock-start")}${this._shortTime(d)}</span>`:c}
              ${this._renderLeg(p)}
            `:l`
            <span class="arrow">${this._renderIcon(Yt)}</span>
            ${this._renderLeg(p)}
          `)}

        ${h?l`<span class="trip-time trip-time--arr">${this._renderIcon("mdi:clock-end")}${this._shortTime(h)}</span>`:c}

        <div class="trip-meta">
          ${(t.duration??t.duration_total)!=null?l`<span>${this._formatDuration(t.duration??t.duration_total)}</span>`:c}
          <span class="trip-chevron ${_?"open":""}">${this._renderIcon("mdi:chevron-down")}</span>
        </div>

        ${_?this._renderTripExpanded(s):c}
      </div>
    `}_toggleTripExpand(t){this._expandedTripIndex=this._expandedTripIndex===t?null:t}_renderTripStops(t){if(!t.length)return c;const e=[],i=f._fromStop(t[0]);i?.name&&e.push(i.name);for(const o of t){const n=f._toStop(o);n?.name&&e.push(n.name)}if(e.length<2)return c;const s=e.length-1;return l`
      <div class="trip-stops">
        ${e.map((o,n)=>l`
          ${n>0?l`<span class="trip-stops-sep">›</span>`:c}
          <span class="trip-stop-name ${n===0||n===s?"trip-stop-endpoint":""}">${o}</span>
        `)}
      </div>
    `}_renderLeg(t){const e=f._legType(t),i=f._legLine(t),s=[this._prettyType(e),i?` ${i}`:void 0].filter(Boolean).join("");return l`
      <span class="leg">
        ${this._renderIcon(pt(e))}
        <span class="line">${s||"—"}</span>
      </span>
    `}_renderTripExpanded(t){if(!t.length)return c;const e=t[0],i=f._fromStop(e),s=e.departure||e.origin_time;return l`
      <div class="trip-expand">
        <div class="tl">
          <!-- start stop -->
          <div class="tl-time">${s?this._shortTime(s):""}</div>
          <div class="tl-node">
            <div class="tl-dot tl-dot-start"></div>
            <div class="tl-line-seg"></div>
          </div>
          <div class="tl-stop-cell">
            <span class="tl-stop-name">${this._resolveStopDisplay(i?.name,"origin")}</span>
            ${this._config.include_platform&&e.platform?l`<span class="tl-platform-badge">${this.t("label.platform")} ${e.platform}</span>`:c}
          </div>

          ${t.map((o,n)=>{const a=n===t.length-1,d=f._toStop(o),h=o.arrival||o.dest_time,_=a?void 0:t[n+1],p=_?_.departure||_.origin_time:void 0,y=a?null:this._calcTransfer(h,p),v=f._legType(o),x=f._legLine(o),St=/walk|foot|gå/.test(v),X=o.distance,tt=o.duration;return l`
              <!-- leg connector -->
              <div class="tl-time"></div>
              <div class="tl-node tl-node-line">
                <div class="tl-line-seg"></div>
              </div>
              <div class="tl-leg-cell">
                ${this._renderIcon(pt(v))}
                ${x?l`<span class="tl-leg-line">${x}</span>`:c}
                ${o.direction?l`<span class="tl-leg-meta tl-leg-dir">→ ${o.direction}</span>`:c}
                ${St&&X?l`<span class="tl-leg-meta">${this._formatDistance(X)}</span>`:c}
                ${tt!=null?l`<span class="tl-leg-meta">${this._formatDuration(tt)}</span>`:c}
              </div>

              <!-- arrival / intermediate stop -->
              <div class="tl-time">${h?this._shortTime(h):""}</div>
              <div class="tl-node">
                <div class="tl-dot ${a?"tl-dot-end":"tl-dot-mid"}"></div>
                ${a?c:l`<div class="tl-line-seg"></div>`}
              </div>
              <div class="tl-stop-cell">
                <span class="tl-stop-name">${this._resolveStopDisplay(d?.name,a?"dest":void 0)}</span>
                ${y!=null&&y>0?l`<span class="tl-transfer-badge">${this.t("label.transfer")} · ${this._formatDuration(y)}</span>`:c}
                ${this._config.include_platform&&_?.platform?l`<span class="tl-platform-badge">${this.t("label.platform")} ${_.platform}</span>`:c}
              </div>
            `})}
        </div>
      </div>
    `}_resolveStopDisplay(t,e){if(!t)return"—";if(/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(t.trim())){if(e==="origin")return this._originLabel||t;if(e==="dest")return this._destLabel||t}return t}_calcTransfer(t,e){if(!t||!e)return null;try{const i=new Date(t).getTime(),s=new Date(e).getTime();if(isNaN(i)||isNaN(s))return null;const o=Math.round((s-i)/6e4);return o>0?o:null}catch{return null}}_formatDistance(t){return t>=1e3?`${(t/1e3).toFixed(1)} km`:`${Math.round(t)} m`}static _stop(t){if(!t||typeof t!="object")return;const e=t;return{name:e.name??e.stop_name??e.stop??void 0,id:e.id??e.stop_id??void 0,lat:e.lat??e.latitude??void 0,lon:e.lon??e.lng??e.longitude??void 0}}static _legType(t){return(t.category||t.type||t.mode||t.product?.category||t.product?.mode||"").toString().toLowerCase()}static _legLine(t){const e=t.line??t.line_number??t.number??t.product?.line;return e!=null?String(e):void 0}static _fromStop(t){const e=t.from||t.origin;if(e&&typeof e=="object")return f._stop(e);if(t.origin_name)return{name:t.origin_name}}static _toStop(t){const e=t.to||t.destination;if(e&&typeof e=="object")return f._stop(e);if(t.dest_name)return{name:t.dest_name}}_prettyType(t){if(!t)return"";const e=t.toLowerCase();return/walk|foot|gå/.test(e)?this.t("label.mode_walk"):/bus|buss/.test(e)?this.t("label.mode_bus"):/train|tå|rail/.test(e)?this.t("label.mode_train"):/metro|subway|tunnelbana/.test(e)?this.t("label.mode_metro"):/tram|spårvagn/.test(e)?this.t("label.mode_tram"):/ferry|boat|båt/.test(e)?this.t("label.mode_boat"):/car|bil|taxi/.test(e)?this.t("label.mode_taxi"):/transfer|byte/.test(e)?this.t("label.transfer"):t.charAt(0).toUpperCase()+t.slice(1)}_shortTime(t){if(!t)return"";try{const e=new Date(t);if(!isNaN(e.getTime()))return e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});const i=/(\d{2}:\d{2})/.exec(t);if(i)return i[1]}catch{}return t}_formatDuration(t){const e=Math.floor(t/60),i=t%60;return e>0?this.t("label.duration",{h:e,m:i}):this.t("label.duration_min",{m:i})}},f.styles=Kt,f);u([kt({attribute:!1})],g.prototype,"hass");u([m()],g.prototype,"_config");u([m()],g.prototype,"_originMode");u([m()],g.prototype,"_originText");u([m()],g.prototype,"_originStopId");u([m()],g.prototype,"_originZoneEntity");u([m()],g.prototype,"_originSuggestions");u([m()],g.prototype,"_originSuggestionsOpen");u([m()],g.prototype,"_destMode");u([m()],g.prototype,"_destPersonEntity");u([m()],g.prototype,"_destZoneEntity");u([m()],g.prototype,"_destText");u([m()],g.prototype,"_destStopId");u([m()],g.prototype,"_destSuggestions");u([m()],g.prototype,"_destSuggestionsOpen");u([m()],g.prototype,"_gpsCoords");u([m()],g.prototype,"_gpsLoading");u([m()],g.prototype,"_trips");u([m()],g.prototype,"_loading");u([m()],g.prototype,"_error");u([m()],g.prototype,"_hasSearched");u([m()],g.prototype,"_expandedTripIndex");u([m()],g.prototype,"_originLabel");u([m()],g.prototype,"_destLabel");let ue=g;customElements.define(Y,ue);window.customCards=window.customCards||[];window.customCards.push({type:Y,name:_e,description:ge,preview:!0});
//# sourceMappingURL=trafiklab-dynamic-travel-card.js.map
