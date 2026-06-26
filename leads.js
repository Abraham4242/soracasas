/* ════════════════════════════════════════════════════════════════════
   SORA CASAS · Shared lead capture + analytics
   Single source of truth for the whole property (main site + all funnels).
   Fill the IDs below to go fully live. Each analytics tool loads ONLY if set.
   ════════════════════════════════════════════════════════════════════ */
window.SORA_CONFIG = {
  whatsapp:    '50760003557',  // lead destination, digits only, country code first, no "+"
  leadEndpoint:'https://formsubmit.co/ajax/abe.e.eid@gmail.com',  // FormSubmit (no signup). First submit emails a one-time activation link to this inbox; click it to turn delivery on. TODO this week: move to hola@soracasas.com (+ consider Formspree).
  bookingUrl:  '',             // discovery-call booking, e.g. 'https://cal.com/sora/discovery'
  ga4:         'G-YPHDCVJNBL', // GA4 Measurement ID (soracasas.com)
  metaPixel:   '',             // '1234567890123456'
  clarity:     ''              // 'abcdefghij'
};

(function(C){
  if (C.ga4){ var s=document.createElement('script'); s.async=1; s.src='https://www.googletagmanager.com/gtag/js?id='+C.ga4; document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[]; window.gtag=function(){dataLayer.push(arguments)}; gtag('js',new Date()); gtag('config',C.ga4); }
  if (C.metaPixel){ !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init',C.metaPixel); fbq('track','PageView'); }
  if (C.clarity){ (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script',C.clarity); }
})(window.SORA_CONFIG);

// Attribution captured once per page load — every lead is traceable to its source.
window.LEAD_META = (function(){
  var p = new URLSearchParams(location.search), utm = {};
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){ if(p.get(k)) utm[k]=p.get(k); });
  return Object.assign(utm, { referrer: document.referrer || '', landing: location.pathname });
})();

window.track = function(ev, params){
  try{ if(window.gtag) gtag('event', ev, params||{}); }catch(_){}
  try{ if(window.fbq) fbq('trackCustom', ev, params||{}); }catch(_){}
};

// Persist a lead: server (Formspree-compatible) + local backup + analytics event.
// Never blocks the UX — resolves regardless of network.
window.captureLead = async function(type, data){
  var payload = Object.assign({ type: type }, data, window.LEAD_META, { ts: new Date().toISOString() });
  try{ var k='sora.casas.leads', a=JSON.parse(localStorage.getItem(k)||'[]'); a.push(payload); localStorage.setItem(k, JSON.stringify(a)); }catch(_){}
  window.track('lead', { lead_type: type });
  var C = window.SORA_CONFIG;
  if (C.leadEndpoint){
    try{ await fetch(C.leadEndpoint, { method:'POST', headers:{'Content-Type':'application/json', Accept:'application/json'}, body: JSON.stringify(payload) }); }catch(_){}
  }
  return payload;
};

// Open a pre-filled WhatsApp to the configured number.
window.soraWhatsApp = function(message){
  window.track('whatsapp_click', {});
  window.open('https://wa.me/' + window.SORA_CONFIG.whatsapp + '?text=' + encodeURIComponent(message||''), '_blank');
};
