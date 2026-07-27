/* SORA article enhancer — drop-in floating section nav (scroll-spy) for any
   article page that isn't generator-driven. Include once, before </body>:
     <script src="/assets/article-enhance.js" defer></script>
   It finds the page's <article> H2s, gives them ids, and renders a floating
   left-margin table of contents that highlights the current section as you
   scroll (hidden < 1200px so it never crowds the reading column or mobile).
   No dependencies. Matches the SORA article.css palette. */
(function () {
  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  }
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    var article = document.querySelector("article") || document.body;
    var hs = [].slice.call(article.querySelectorAll("h2"));
    if (hs.length < 3) return; // not worth a TOC

    // inject styles once
    if (!document.getElementById("sora-toc-css")) {
      var css = document.createElement("style");
      css.id = "sora-toc-css";
      css.textContent =
        ".sora-toc{position:fixed;top:110px;left:max(20px,calc((100vw - 760px)/2 - 220px));" +
        "width:190px;z-index:20;max-height:78vh;overflow:auto;font-family:'Inter',-apple-system,sans-serif}" +
        ".sora-toc .lab{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:2px;" +
        "text-transform:uppercase;color:#807761;margin-bottom:12px}" +
        ".sora-toc a{display:block;color:#807761;font-size:12.5px;line-height:1.35;padding:5px 0 5px 13px;" +
        "border-left:2px solid rgba(20,17,12,.10);text-decoration:none;border-bottom:none;transition:all .15s}" +
        ".sora-toc a:hover{color:#14110c}" +
        ".sora-toc a.active{color:#b85439;border-left-color:#b85439;font-weight:600}" +
        "@media(max-width:1200px){.sora-toc{display:none}}";
      document.head.appendChild(css);
    }

    var nav = document.createElement("nav");
    nav.className = "sora-toc";
    nav.setAttribute("aria-label", "On this page");
    nav.innerHTML = '<div class="lab">On this page</div>';
    var used = {}, map = {};
    hs.forEach(function (h) {
      var txt = (h.textContent || "").trim();
      if (!txt) return;
      var id = h.id || slug(txt);
      while (used[id]) id += "-x";
      used[id] = 1; h.id = id;
      var a = document.createElement("a");
      a.href = "#" + id; a.textContent = txt;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: h.getBoundingClientRect().top + window.pageYOffset - 90, behavior: "smooth" });
      });
      nav.appendChild(a); map[id] = a;
    });
    document.body.appendChild(nav);

    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(map).forEach(function (k) { map[k].classList.remove("active"); });
          if (map[en.target.id]) map[en.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-80px 0px -70% 0px" });
    hs.forEach(function (h) { obs.observe(h); });
  });
})();
