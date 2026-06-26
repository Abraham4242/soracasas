/* Sora internal tools — lightweight ES/EN translator.
   Translates static chrome AND dynamically-rendered content via a MutationObserver.
   Strategy: each text node's original Spanish is stored once; English is produced by
   an exact-match dictionary (whole trimmed string) or, failing that, ordered substring
   fragment swaps (for strings built with interpolated numbers). Toggling back to ES
   restores the stored original, so translation is always idempotent. */
(function(){
  const SoraI18N = {
    lang:'es', dict:{}, frags:[], _store:new WeakMap(), _attr:new WeakMap(), _obs:null,

    init(dict, frags){
      this.dict = dict || {};
      this.frags = frags || [];
      let saved='es';
      try{ saved = localStorage.getItem('sora-casas-lang') || 'es'; }catch(e){}
      this.lang = saved==='en' ? 'en' : 'es';
      document.documentElement.setAttribute('data-lang', this.lang);
      this._obs = new MutationObserver(muts=>{
        if(this.lang!=='en') return;
        for(const m of muts){ if(m.addedNodes) m.addedNodes.forEach(n=>this._tree(n)); }
      });
      this._obs.observe(document.body, {childList:true, subtree:true});
      if(this.lang==='en') this.apply();
      return this;
    },

    set(lang){
      this.lang = lang==='en' ? 'en' : 'es';
      try{ localStorage.setItem('sora-casas-lang', this.lang); }catch(e){}
      document.documentElement.setAttribute('data-lang', this.lang);
      this.apply();
      document.querySelectorAll('[data-i18n-btn]').forEach(b=>b.classList.toggle('on', b.getAttribute('data-i18n-btn')===this.lang));
    },
    toggle(){ this.set(this.lang==='en'?'es':'en'); },

    apply(){ this._tree(document.body); },

    _tree(root){
      if(!root) return;
      if(root.nodeType===3){ this._text(root); return; }
      if(root.nodeType!==1) return;
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const arr=[]; let n; while(n=w.nextNode()) arr.push(n);
      arr.forEach(t=>this._text(t));
      this._attrs(root);
    },

    _text(node){
      const raw = node.nodeValue;
      if(!this._store.has(node)){
        if(!/[A-Za-zÀ-ÿ]/.test(raw)) return;       // skip pure numbers / symbols
        this._store.set(node, raw);
      }
      const es = this._store.get(node);
      if(this.lang!=='en'){ if(node.nodeValue!==es) node.nodeValue = es; return; }
      const en = this._toEN(es);
      if(node.nodeValue!==en) node.nodeValue = en;
    },

    _toEN(es){
      const trimmed = es.trim();
      if(this.dict[trimmed]!=null) return es.replace(trimmed, this.dict[trimmed]);
      let out = es;
      for(const [a,b] of this.frags){ if(out.indexOf(a)!==-1) out = out.split(a).join(b); }
      return out;
    },

    _attrs(root){
      if(root.nodeType!==1) return;
      const els = [root].concat(Array.from(root.querySelectorAll('[placeholder],[title]')));
      els.forEach(el=>{
        ['placeholder','title'].forEach(attr=>{
          if(!el.hasAttribute || !el.hasAttribute(attr)) return;
          let store = this._attr.get(el) || {};
          if(store[attr]==null){
            const v = el.getAttribute(attr);
            if(!/[A-Za-zÀ-ÿ]/.test(v)) return;
            store[attr]=v; this._attr.set(el, store);
          }
          const es = store[attr];
          el.setAttribute(attr, this.lang==='en' ? this._toEN(es) : es);
        });
      });
    },

    mountToggle(slotSel){
      const slot = document.querySelector(slotSel);
      if(!slot) return;
      slot.innerHTML = '<button data-i18n-btn="es">ES</button><button data-i18n-btn="en">EN</button>';
      slot.querySelectorAll('[data-i18n-btn]').forEach(b=>{
        b.classList.toggle('on', b.getAttribute('data-i18n-btn')===this.lang);
        b.addEventListener('click', ()=>this.set(b.getAttribute('data-i18n-btn')));
      });
    }
  };
  window.SoraI18N = SoraI18N;
})();
