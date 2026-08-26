/**
 * admin.js — Admin Panel JavaScript Engine for Filio.chavi Event Gallery Manager
 */

const STORAGE_KEY = 'portfolio_uploaded_gallery_items';

// Global state for pending upload image
let currentBase64Image = null;

document.addEventListener('DOMContentLoaded', () => {
  initCanvasBackground();
  initDropzone();
  initUploadForm();
  renderUploadedItems();
});

/* Canvas Background Initialization */
function initCanvasBackground() {
  const canvas = document.getElementById('animation-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.2
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 77, 21, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* Drag and Drop File Upload Handler */
function initDropzone() {
  const dropzone = document.getElementById('admin-dropzone');
  const fileInput = document.getElementById('admin-file-input');
  const placeholder = document.getElementById('admin-dropzone-placeholder');
  const previewContainer = document.getElementById('admin-preview-container');
  const previewImg = document.getElementById('admin-preview-img');
  const removeBtn = document.getElementById('admin-remove-preview-btn');

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', (e) => {
    if (e.target !== removeBtn) {
      fileInput.click();
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (fileInput.files && fileInput.files.length > 0) {
      handleFile(fileInput.files[0]);
    }
  });

  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentBase64Image = null;
    fileInput.value = '';
    previewImg.src = '';
    previewContainer.classList.add('hidden');
    placeholder.classList.remove('hidden');
  });

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      currentBase64Image = evt.target.result;
      previewImg.src = currentBase64Image;
      placeholder.classList.add('hidden');
      previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
}

/* Upload Form Submission Handler */
function initUploadForm() {
  const form = document.getElementById('admin-upload-form');
  const imageUrlInput = document.getElementById('admin-image-url');
  const titleInput = document.getElementById('admin-photo-title');
  const categoryInput = document.getElementById('admin-photo-category');
  const descInput = document.getElementById('admin-photo-desc');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const urlValue = imageUrlInput.value.trim();
    const imgSrc = currentBase64Image || urlValue;

    if (!imgSrc) {
      showToast('Please select an image file or enter an image URL.', true);
      return;
    }

    const newItem = {
      id: 'custom-' + Date.now(),
      src: imgSrc,
      title: titleInput.value.trim(),
      category: categoryInput.value,
      desc: descInput.value.trim(),
      description: descInput.value.trim(),
      date: new Date().toISOString()
    };

    saveItemToStorage(newItem);
    showToast('Photo uploaded and published to gallery!');

    // Reset Form
    form.reset();
    currentBase64Image = null;
    const placeholder = document.getElementById('admin-dropzone-placeholder');
    const previewContainer = document.getElementById('admin-preview-container');
    if (placeholder && previewContainer) {
      placeholder.classList.remove('hidden');
      previewContainer.classList.add('hidden');
    }

    renderUploadedItems();
  });
}

/* LocalStorage Helpers */
function getStorageItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse localStorage gallery items:', err);
    return [];
  }
}

function saveItemToStorage(item) {
  const items = getStorageItems();
  items.unshift(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function deleteItemFromStorage(id) {
  let items = getStorageItems();
  items = items.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  renderUploadedItems();
  showToast('Photo removed from gallery.');
}

/* Render Uploaded Gallery List */
function renderUploadedItems() {
  const container = document.getElementById('admin-uploaded-items-list');
  const countSpan = document.getElementById('admin-uploaded-count');
  if (!container) return;

  const items = getStorageItems();
  if (countSpan) countSpan.textContent = items.length;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: #64748b;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1rem; opacity: 0.5;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <p>No uploaded event photos yet. Use the form to upload your first event photo!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="admin-item-card" data-id="${item.id}">
      <button class="admin-item-delete-btn" data-delete-id="${item.id}" title="Delete Photo">&times;</button>
      <div class="admin-item-img-box">
        <img src="${item.src}" alt="${escapeHtml(item.title)}">
      </div>
      <div class="admin-item-body">
        <div class="admin-item-title">${escapeHtml(item.title)}</div>
        <div class="admin-item-sub">
          <span class="gallery-badge" style="position:static; padding: 2px 8px; font-size: 10px;">${escapeHtml(item.category)}</span>
          <span>${new Date(item.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Attach delete handlers
  container.querySelectorAll('[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-delete-id');
      if (confirm('Are you sure you want to delete this event photo from the gallery?')) {
        deleteItemFromStorage(id);
      }
    });
  });
}

function showToast(message, isError = false) {
  const toast = document.getElementById('admin-toast');
  const text = document.getElementById('admin-toast-text');
  if (!toast || !text) return;

  text.textContent = message;
  toast.style.borderColor = isError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.4)';
  toast.style.color = isError ? '#ef4444' : '#10b981';

  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
