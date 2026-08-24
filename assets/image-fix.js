(function () {
  'use strict';
  var HOST = 'https://xcimg.szwego.com/';
  var PROXY = 'https://images.weserv.nl/?url=';

  function proxify(url) {
    if (!url || typeof url !== 'string') return url;
    if (url.indexOf(PROXY) === 0) return url;
    if (url.indexOf(HOST) !== 0) return url;
    return PROXY + encodeURIComponent(url);
  }

  function fixImage(img) {
    if (!img || !img.getAttribute) return;
    var src = img.getAttribute('src');
    var fixed = proxify(src);
    if (fixed && fixed !== src) img.setAttribute('src', fixed);
    var srcset = img.getAttribute('srcset');
    if (srcset && srcset.indexOf(HOST) !== -1) {
      img.setAttribute('srcset', srcset.split(',').map(function (part) {
        var bits = part.trim().split(/\s+/);
        bits[0] = proxify(bits[0]);
        return bits.join(' ');
      }).join(', '));
    }
  }

  function fixElement(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.tagName === 'IMG') fixImage(el);
    if (el.tagName === 'SOURCE') {
      var ss = el.getAttribute('srcset');
      if (ss && ss.indexOf(HOST) !== -1) {
        el.setAttribute('srcset', ss.split(',').map(function (part) {
          var bits = part.trim().split(/\s+/);
          bits[0] = proxify(bits[0]);
          return bits.join(' ');
        }).join(', '));
      }
    }
    if (el.tagName === 'LINK' && el.getAttribute('rel') === 'preload') {
      var href = el.getAttribute('href');
      var fixed = proxify(href);
      if (fixed && fixed !== href) el.setAttribute('href', fixed);
    }
    if (el.style && el.style.backgroundImage && el.style.backgroundImage.indexOf(HOST) !== -1) {
      el.style.backgroundImage = el.style.backgroundImage.replace(/url\(["']?([^"')]+)["']?\)/g, function (_, url) {
        return 'url("' + proxify(url) + '")';
      });
    }
    var imgs = el.querySelectorAll ? el.querySelectorAll('img,source,link') : [];
    for (var i = 0; i < imgs.length; i++) fixElement(imgs[i]);
  }

  function scan() { fixElement(document.documentElement); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();

  var observer = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      if (r.type === 'attributes') fixElement(r.target);
      else if (r.addedNodes) for (var j = 0; j < r.addedNodes.length; j++) fixElement(r.addedNodes[j]);
    }
  });
  observer.observe(document.documentElement, {subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'srcset', 'href', 'style']});
})();
