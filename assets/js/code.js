// Terminal theme code copy
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('pre').forEach(function(block) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Kopyala';
    block.style.position = 'relative';
    block.appendChild(btn);
    btn.addEventListener('click', function() {
      var code = block.querySelector('code');
      if (code) {
        navigator.clipboard.writeText(code.textContent).then(function() {
          btn.textContent = 'Kopyalandı!';
          setTimeout(function() { btn.textContent = 'Kopyala'; }, 2000);
        });
      }
    });
  });
});
