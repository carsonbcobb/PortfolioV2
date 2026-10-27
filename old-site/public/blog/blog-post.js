(function () {
  'use strict';

  var toc = document.getElementById('blog-toc');
  var tocList = document.getElementById('blog-toc-list');
  var toggle = document.querySelector('.blog-toc-mobile-toggle');
  var postBody = document.querySelector('.post-body');

  if (!tocList || !postBody) return;

  function getHeadingId(el) {
    var id = el.id;
    if (id) return id;
    id = el.textContent.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase();
    if (id) el.id = id;
    return id;
  }

  function buildToc() {
    var headings = postBody.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      if (toc) toc.style.display = 'none';
      return;
    }
    var ul = document.createElement('ul');
    ul.className = 'blog-toc__list';
    var stack = [ul];
    headings.forEach(function (h) {
      var id = getHeadingId(h);
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = h.textContent;
      a.addEventListener('click', function (e) {
        if (window.innerWidth <= 960 && toggle) {
          toc.setAttribute('aria-hidden', 'true');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
      li.appendChild(a);
      if (h.tagName === 'H2') {
        stack[0].appendChild(li);
        stack = [ul];
      } else {
        var last = stack[0].lastElementChild;
        if (!last) {
          stack[0].appendChild(li);
        } else {
          var nested = last.querySelector('ul');
          if (!nested) {
            nested = document.createElement('ul');
            last.appendChild(nested);
          }
          nested.appendChild(li);
        }
      }
    });
    tocList.innerHTML = '';
    if (ul.firstChild) tocList.appendChild(ul);
    tocList.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', smoothScroll);
    });
  }

  function smoothScroll(e) {
    var href = e.currentTarget.getAttribute('href');
    if (href && href.charAt(0) === '#') {
      var target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function setActiveTocLink() {
    var headings = postBody.querySelectorAll('h2[id], h3[id]');
    var scrollY = window.scrollY || window.pageYOffset;
    var inner = window.innerHeight;
    var current = null;
    headings.forEach(function (h) {
      var top = h.getBoundingClientRect().top + scrollY;
      if (scrollY >= top - inner / 3) current = h.id;
    });
    tocList.querySelectorAll('a').forEach(function (a) {
      var id = a.getAttribute('href');
      if (id && id.charAt(0) === '#') id = id.slice(1);
      a.classList.toggle('is-active', id === current);
    });
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var expanded = toc.getAttribute('aria-hidden') !== 'true';
      toc.setAttribute('aria-hidden', expanded ? 'true' : 'false');
      toggle.setAttribute('aria-expanded', !expanded);
    });
  }

  buildToc();
  setActiveTocLink();
  window.addEventListener('scroll', setActiveTocLink);
})();
