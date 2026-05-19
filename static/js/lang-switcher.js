/**
 * Dil Değiştirici — Google Translate entegrasyonu
 * TR/EN toggle butonlarını yönetir
 */
(function () {
  'use strict';

  // Cookie helpers
  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + d.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }

  function getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  var _gtLoaded = false;

  function loadGoogleTranslate(callback) {
    if (_gtLoaded) { if (callback) callback(); return; }
    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement({
        pageLanguage: 'tr',
        includedLanguages: 'en',
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.NONE
      }, 'google_translate_element');
      _gtLoaded = true;
      if (callback) callback();
    };
    var s = document.createElement('script');
    s.src = '//translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.defer = true;
    document.head.appendChild(s);
  }

  // Google Translate cookie ile dil değiştir
  window.setLang = function (lang) {
    var trBtn = document.getElementById('lang-tr');
    var enBtn = document.getElementById('lang-en');

    if (lang === 'en') {
      loadGoogleTranslate(function() {
        setCookie('googtrans', '/tr/en', 1);
        if (trBtn) trBtn.classList.remove('active');
        if (enBtn) enBtn.classList.add('active');
        location.reload();
      });
    } else {
      // Çeviriyi sıfırla — TR'ye dön
      setCookie('googtrans', '', -1);
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
      if (trBtn) trBtn.classList.add('active');
      if (enBtn) enBtn.classList.remove('active');
      location.reload();
    }
  };

  // Sayfa yüklendiğinde mevcut dili oku, butonu güncelle ve gerekirse GT'yi yükle
  document.addEventListener('DOMContentLoaded', function () {
    var currentLang = getCookie('googtrans');
    var trBtn = document.getElementById('lang-tr');
    var enBtn = document.getElementById('lang-en');

    if (currentLang && currentLang.includes('/en')) {
      if (trBtn) trBtn.classList.remove('active');
      if (enBtn) enBtn.classList.add('active');
      loadGoogleTranslate();
    } else {
      if (trBtn) trBtn.classList.add('active');
      if (enBtn) enBtn.classList.remove('active');
    }
  });
})();
