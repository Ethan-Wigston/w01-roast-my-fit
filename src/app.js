const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const preview = document.getElementById('preview');
const previewImg = document.getElementById('preview-img');
const roastBtn = document.getElementById('roast-btn');
const slider = document.getElementById('brutality-slider');
const sliderFill = document.getElementById('slider-fill');
const sliderVal = document.getElementById('slider-val');
const sliderEmoji = document.getElementById('slider-emoji');
const uploadHint = document.getElementById('upload-hint');
const sliderLabels = document.querySelectorAll('#slider-labels span');
const output = document.getElementById('output');
const OUTPUT_ORIGINAL_HTML = output.innerHTML;
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('error-msg');

let imageBase64 = null;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

// ── Slider color ──────────────────────────────────────────────────────────────
const SLIDER_COLORS = [
  '#a3e635', // 1 – lime
  '#facc15', // 2 – yellow
  '#fb923c', // 3 – orange
  '#ef4444', // 4 – red
  '#FF4500', // 5 – inferno
];

const NUMBER_COLORS = ['#a3e635', '#facc15', '#fb923c', '#ef4444', '#dc2626'];

function updateSlider() {
  const val = parseInt(slider.value);
  const pct = ((val - 1) / 4) * 100;
  const color = SLIDER_COLORS[val - 1];
  sliderFill.style.width = pct + '%';
  sliderFill.style.backgroundSize = sliderFill.parentElement.offsetWidth + 'px 100%';
  slider.style.setProperty('--thumb-color', color);
  sliderLabels.forEach((label, i) => {
    label.style.color = i + 1 === val ? color : '#555';
  });
  sliderVal.style.color = NUMBER_COLORS[val - 1];
  sliderEmoji.src = `/Images/Slider%20Images/level${val}.png`;
  sliderEmoji.style.filter = `drop-shadow(0 0 10px ${NUMBER_COLORS[val - 1]})`;

}

slider.addEventListener('input', updateSlider);
window.addEventListener('resize', updateSlider);
updateSlider();

// ── Upload helpers ────────────────────────────────────────────────────────────
function resizeToBase64(dataUrl, maxWidth = 800) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = dataUrl;
  });
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showFileTypeError() {
  const el = document.createElement('p');
  el.className = 'float-toast';
  el.textContent = 'Please upload an image file (JPG, PNG, GIF, or WEBP)';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function loadFile(file) {
  fileInput.value = '';
  if (!file) return;
  if (!ALLOWED_TYPES.has(file.type)) { showFileTypeError(); return; }
  const reader = new FileReader();
  reader.onload = async (e) => {
    imageBase64 = await resizeToBase64(e.target.result); // full data URL; backend strips prefix
    previewImg.src = imageBase64;
    preview.classList.remove('hidden');
    dropZone.classList.add('has-image');
    roastBtn.disabled = false;
    uploadHint.classList.remove('hidden');
    hideOutput();
  };
  reader.readAsDataURL(file);
}

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => loadFile(e.target.files[0]));

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  loadFile(e.dataTransfer.files[0]);
});

// ── Roast ─────────────────────────────────────────────────────────────────────
roastBtn.addEventListener('click', async () => {
  if (!imageBase64) return;

  showLoading();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch('/api/index', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_base64: imageBase64,
        brutality_level: parseInt(slider.value),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || 'Something went wrong.');
      return;
    }

    if (data.error) {
      loading.classList.add('hidden');
      output.innerHTML =
        `<div>` +
        `<p style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.06em;color:#fff;margin-bottom:0.5rem;">Oops...</p>` +
        `<p style="font-size:0.8125rem;color:#fff;line-height:1.625;">${escHtml(data.error)}</p>` +
        `</div>`;
      output.classList.remove('hidden');
      roastBtn.disabled = false;
      dropZone.classList.remove('uploading');
      fileInput.disabled = false;
      slider.disabled = false;
      slider.style.opacity = '';
      slider.style.pointerEvents = '';
      sliderFill.style.opacity = '';
      return;
    }

    showResult(data.roast, data.feedback);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      showError('Request timed out — try again.');
    } else {
      showError('Couldn\'t connect — check your internet and try again.');
    }
  }
});

// ── UI state helpers ──────────────────────────────────────────────────────────
function showLoading() {
  loading.classList.remove('hidden');
  output.classList.add('hidden');
  errorMsg.classList.add('hidden');
  roastBtn.disabled = true;
  dropZone.classList.add('uploading');
  fileInput.disabled = true;
  slider.disabled = true;
  slider.style.opacity = '0.4';
  slider.style.pointerEvents = 'none';
  sliderFill.style.opacity = '0.4';
}

function showResult(roast, feedback) {
  loading.classList.add('hidden');
  if (!document.getElementById('roast-text')) {
    output.innerHTML = OUTPUT_ORIGINAL_HTML;
  }
  document.getElementById('roast-text').textContent = roast;
  document.getElementById('feedback-text').textContent = feedback;
  output.classList.remove('hidden');
  errorMsg.classList.add('hidden');
  roastBtn.disabled = false;
  dropZone.classList.remove('uploading');
  fileInput.disabled = false;
  slider.disabled = false;
  slider.style.opacity = '';
  slider.style.pointerEvents = '';
  sliderFill.style.opacity = '';
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(msg) {
  loading.classList.add('hidden');
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
  roastBtn.disabled = false;
  dropZone.classList.remove('uploading');
  fileInput.disabled = false;
  slider.disabled = false;
  slider.style.opacity = '';
  slider.style.pointerEvents = '';
  sliderFill.style.opacity = '';
}

function hideOutput() {
  output.classList.add('hidden');
  errorMsg.classList.add('hidden');
  loading.classList.add('hidden');
}
