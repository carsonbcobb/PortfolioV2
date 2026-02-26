(function () {
  'use strict';

  var grid = document.getElementById('blog-grid');
  var filters = document.querySelectorAll('.blog-filters button[data-filter]');
  var toggle = document.querySelector('.blog-site-header__toggle');
  var drawer = document.querySelector('.blog-site-header__drawer');

  function filterPosts() {
    var activeFilter = document.querySelector('.blog-filters button.is-active');
    var value = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    var cards = grid ? grid.querySelectorAll('.blog-card') : [];

    cards.forEach(function (card) {
      var category = card.getAttribute('data-category') || '';
      var show = value === 'all' || category === value;
      card.style.display = show ? '' : 'none';
    });

    filters.forEach(function (btn) {
      var selected = btn.getAttribute('data-filter') === value;
      btn.classList.toggle('is-active', selected);
      btn.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  }

  if (filters.length) {
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-filter');
        var active = document.querySelector('.blog-filters button.is-active');
        if (active) active.classList.remove('is-active');
        if (active) active.setAttribute('aria-selected', 'false');
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        if (grid) {
          var cards = grid.querySelectorAll('.blog-card');
          cards.forEach(function (card) {
            var category = card.getAttribute('data-category') || '';
            card.style.display = (value === 'all' || category === value) ? '' : 'none';
          });
        }
      });
    });
  }

  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      toggle.classList.toggle('is-active', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }
})();
