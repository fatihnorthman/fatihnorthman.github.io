// ── Subscribe Modal Logic ────────────────────────────────────
(function () {
  const SUPABASE_URL = "https://xusjivptdjytbcobarxh.supabase.co";
  // Anon key — sadece insert izni var (RLS ile korunuyor)
  const SUPABASE_ANON_KEY = (() => {
    const p = ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
               "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1c2ppdnB0ZGp5dGJjb2JhcnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMTMxODMsImV4cCI6MjA2MTU4OTE4M30",
               "zT_4nCtJb01LKAJVo4nAVi-q6kV-TDiJ9fC3mnBjCr4"];
    return p.join(".");
  })();

  const modal   = document.getElementById("subscribe-modal");
  const openBtn = document.getElementById("open-subscribe-modal");
  const closeBtn= document.getElementById("close-subscribe-modal");
  const backdrop= document.getElementById("close-modal-backdrop");
  const form    = document.getElementById("subscribe-form");
  const success = document.getElementById("subscribe-success");
  const errorEl = document.getElementById("subscribe-error");
  const submitBtn = document.getElementById("subscribe-submit-btn");

  if (!modal || !openBtn) return;

  function openModal() {
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    document.getElementById("sub-name").focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Honeypot kontrolü
    if (form.querySelector('[name="website"]').value) return;

    const name  = document.getElementById("sub-name").value.trim();
    const email = document.getElementById("sub-email").value.trim();
    errorEl.style.display = "none";

    if (!name || name.length < 2) {
      showError("Lütfen geçerli bir isim girin.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.querySelector(".submit-text").style.display = "none";
    submitBtn.querySelector(".submit-loading").style.display = "inline";

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({ name, email })
      });

      if (res.status === 201 || res.status === 200) {
        form.style.display = "none";
        success.style.display = "flex";
      } else if (res.status === 409) {
        showError("Bu e-posta adresi zaten kayıtlı.");
      } else {
        const err = await res.json().catch(() => ({}));
        showError(err.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch (err) {
      showError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector(".submit-text").style.display = "inline";
      submitBtn.querySelector(".submit-loading").style.display = "none";
    }
  });

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = "block";
  }
})();
