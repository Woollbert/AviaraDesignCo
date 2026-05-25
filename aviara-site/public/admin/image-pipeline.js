/*
 * Pre-upload image pipeline for the Decap CMS admin.
 *
 * Intercepts every <input type="file"> change in capture phase, converts
 * HEIC/HEIF to JPEG, and downscales/re-encodes anything still over 1MB so
 * the gateway upload stays under DecapBridge's limit and the repo doesn't
 * collect 15MB iPhone originals.
 *
 * The conversion runs entirely in the editor's browser; we substitute a
 * fresh FileList on the input and re-dispatch the change event so Decap's
 * own widget code sees the JPEG version and never knows a HEIC existed.
 */
(function () {
  const MAX_DIMENSION = 2400;
  const MAX_SIZE = 1024 * 1024;
  const JPEG_QUALITY = 0.82;
  const HEIC_RE = /\.(heic|heif)$/i;
  const HEIC_TYPES = new Set(["image/heic", "image/heif"]);
  const PROCESSED_FLAG = "aviaraProcessed";

  // Progress overlay shown during HEIC decode / large-image resize. The
  // operations are CPU-bound on the main thread and can take 2-5 seconds on
  // a phone photo — without feedback the editor looks frozen.
  let overlayEl = null;
  let overlayCount = 0;

  function ensureOverlayStyles() {
    if (document.getElementById("aviara-overlay-styles")) return;
    const style = document.createElement("style");
    style.id = "aviara-overlay-styles";
    style.textContent = [
      ".aviara-overlay{position:fixed;inset:0;z-index:99999;display:flex;",
      "align-items:center;justify-content:center;background:rgba(28,24,21,0.55);",
      "backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);",
      "font-family:Georgia,serif;color:#fbf8f2;opacity:0;transition:opacity 160ms ease}",
      ".aviara-overlay.is-on{opacity:1}",
      ".aviara-overlay__card{background:#1c1815;border:1px solid #9a7b3d;",
      "padding:28px 36px;min-width:260px;text-align:center;",
      "box-shadow:0 12px 40px rgba(0,0,0,0.35)}",
      ".aviara-overlay__eyebrow{font-family:system-ui,sans-serif;font-size:0.7rem;",
      "letter-spacing:0.18em;text-transform:uppercase;color:#d9c394;margin:0 0 10px}",
      ".aviara-overlay__title{font-size:1.4rem;font-style:italic;margin:0 0 14px;color:#fbf8f2}",
      ".aviara-overlay__sub{font-family:system-ui,sans-serif;font-size:0.85rem;",
      "color:#a89a86;margin:0;line-height:1.4}",
      ".aviara-overlay__spinner{display:inline-block;width:18px;height:18px;",
      "margin-right:10px;border:2px solid #d9c394;border-top-color:transparent;",
      "border-radius:50%;vertical-align:-4px;animation:aviara-spin 0.9s linear infinite}",
      "@keyframes aviara-spin{to{transform:rotate(360deg)}}",
    ].join("");
    document.head.appendChild(style);
  }

  function showOverlay(label) {
    ensureOverlayStyles();
    overlayCount++;
    if (!overlayEl) {
      overlayEl = document.createElement("div");
      overlayEl.className = "aviara-overlay";
      overlayEl.setAttribute("role", "status");
      overlayEl.setAttribute("aria-live", "polite");
      overlayEl.innerHTML =
        '<div class="aviara-overlay__card">' +
          '<p class="aviara-overlay__eyebrow">Aviara</p>' +
          '<p class="aviara-overlay__title">' +
            '<span class="aviara-overlay__spinner" aria-hidden="true"></span>' +
            '<span data-label></span>' +
          '</p>' +
          '<p class="aviara-overlay__sub">A few seconds — keeping the file lean for the live site.</p>' +
        '</div>';
      document.body.appendChild(overlayEl);
    }
    overlayEl.querySelector("[data-label]").textContent = label;
    // Next frame so the transition fires.
    requestAnimationFrame(function () {
      if (overlayEl) overlayEl.classList.add("is-on");
    });
  }

  function hideOverlay() {
    overlayCount = Math.max(0, overlayCount - 1);
    if (overlayCount > 0 || !overlayEl) return;
    overlayEl.classList.remove("is-on");
    const el = overlayEl;
    overlayEl = null;
    setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 220);
  }

  function isHeic(file) {
    return HEIC_RE.test(file.name) || HEIC_TYPES.has(file.type);
  }

  function isImage(file) {
    return file.type.startsWith("image/") || isHeic(file);
  }

  function needsWork(file) {
    if (!isImage(file)) return false;
    return isHeic(file) || file.size > MAX_SIZE;
  }

  function loadImage(file) {
    return new Promise(function (resolve, reject) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function (e) { URL.revokeObjectURL(url); reject(e); };
      img.src = url;
    });
  }

  function renameToJpeg(name) {
    return name.replace(/\.(heic|heif|png|webp|gif|tiff?)$/i, ".jpeg");
  }

  function encode(img, w, h, name) {
    return new Promise(function (resolve, reject) {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(function (blob) {
        if (!blob) { reject(new Error("Canvas encode failed")); return; }
        resolve(new File([blob], renameToJpeg(name), {
          type: "image/jpeg",
          lastModified: Date.now(),
        }));
      }, "image/jpeg", JPEG_QUALITY);
    });
  }

  async function convertHeic(file) {
    if (typeof window.heic2any !== "function") {
      throw new Error("HEIC decoder not loaded");
    }
    const blob = await window.heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.92,
    });
    return new File([blob], renameToJpeg(file.name), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  }

  async function compressIfLarge(file) {
    if (file.size <= MAX_SIZE) return file;
    const img = await loadImage(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    return encode(img, w, h, file.name);
  }

  async function processFile(file, setLabel) {
    let f = file;
    if (isHeic(f)) {
      setLabel("Converting iPhone photo…");
      f = await convertHeic(f);
    }
    if (f.size > MAX_SIZE) {
      setLabel("Optimizing for the web…");
      f = await compressIfLarge(f);
    }
    return f;
  }

  async function onChange(e) {
    const input = e.target;
    if (!input || input.type !== "file") return;
    const files = input.files ? Array.from(input.files) : [];
    if (files.length === 0) return;

    if (input.dataset[PROCESSED_FLAG] === "1") {
      delete input.dataset[PROCESSED_FLAG];
      return;
    }
    if (!files.some(needsWork)) return;

    e.stopImmediatePropagation();
    e.preventDefault();

    const initialLabel = files.some(isHeic) ? "Converting iPhone photo…" : "Optimizing for the web…";
    showOverlay(initialLabel);

    try {
      const processed = [];
      for (let i = 0; i < files.length; i++) {
        const prefix = files.length > 1 ? "Photo " + (i + 1) + " of " + files.length + " — " : "";
        const setLabel = function (msg) {
          if (overlayEl) overlayEl.querySelector("[data-label]").textContent = prefix + msg;
        };
        processed.push(await processFile(files[i], setLabel));
      }
      const dt = new DataTransfer();
      processed.forEach(function (f) { dt.items.add(f); });
      input.files = dt.files;
      input.dataset[PROCESSED_FLAG] = "1";
      input.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (err) {
      console.error("[aviara] image pre-processing failed:", err);
      alert(
        "Couldn't process that image: " + (err && err.message ? err.message : err) +
        "\n\nTry a JPEG or PNG export, or pick a smaller version."
      );
      input.value = "";
    } finally {
      hideOverlay();
    }
  }

  document.addEventListener("change", onChange, true);

  // Decap renders file inputs with accept="image/*", which on iOS hides HEIC
  // from the Files picker. Append HEIC extensions so iPhone owners can pick
  // straight from Photos / Files without converting first.
  function extendAccept(root) {
    const inputs = root.querySelectorAll
      ? root.querySelectorAll('input[type="file"]')
      : [];
    inputs.forEach(function (input) {
      const accept = input.getAttribute("accept") || "";
      if (accept && accept.indexOf("image") !== -1 && accept.indexOf("heic") === -1) {
        input.setAttribute("accept", accept + ",image/heic,image/heif,.heic,.heif");
      }
    });
  }
  const obs = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType === 1) extendAccept(n);
      });
    });
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  extendAccept(document);
})();
