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

  // Google Translate cookie ile dil değiştir
  window.setLang = function (lang) {
    var trBtn = document.getElementById('lang-tr');
    var enBtn = document.getElementById('lang-en');

    if (lang === 'en') {
      // Google Translate cookie'sini İngilizce'ye ayarla
      setCookie('googtrans', '/tr/en', 1);
      if (trBtn) trBtn.classList.remove('active');
      if (enBtn) enBtn.classList.add('active');
    } else {
      // Çeviriyi sıfırla — TR'ye dön
      setCookie('googtrans', '', -1);
      // googtrans cookie'sini tüm path varyantlarından sil
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
      if (trBtn) trBtn.classList.add('active');
      if (enBtn) enBtn.classList.remove('active');
    }

    // Sayfayı yenile — çeviri aktif olsun
    location.reload();
  };

  // Sayfa yüklendiğinde mevcut dili oku ve butonu güncelle
  document.addEventListener('DOMContentLoaded', function () {
    var currentLang = getCookie('googtrans');
    var trBtn = document.getElementById('lang-tr');
    var enBtn = document.getElementById('lang-en');

    if (currentLang && currentLang.includes('/en')) {
      if (trBtn) trBtn.classList.remove('active');
      if (enBtn) enBtn.classList.add('active');
    } else {
      if (trBtn) trBtn.classList.add('active');
      if (enBtn) enBtn.classList.remove('active');
    }
  });
})();
