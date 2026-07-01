(function(){
  var lang = localStorage.getItem('sora-casas-lang') || 'en';
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-toggle button').forEach(function(b){
    b.classList.toggle('active', b.dataset.lang === lang);
    b.addEventListener('click', function(){
      lang = b.dataset.lang;
      document.documentElement.lang = lang;
      document.querySelectorAll('.lang-toggle button').forEach(function(x){
        x.classList.toggle('active', x.dataset.lang === lang);
      });
      localStorage.setItem('sora-casas-lang', lang);
    });
  });
})();
