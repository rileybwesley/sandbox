/* ============================================
   PAPA BEAR POWER — Gallery Lightbox
   Loaded only on projects.html
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
});

function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  if (!galleryItems.length || !lightbox) return;

  const img = lightbox.querySelector('.lightbox__img');
  const caption = lightbox.querySelector('.lightbox__caption');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav--next');

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  // Build image data array
  const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    // Use large version for lightbox
    srcFull: item.querySelector('img').dataset.full || item.querySelector('img').src,
    title: item.querySelector('h4')?.textContent || '',
    desc: item.querySelector('.gallery-item__overlay p')?.textContent || ''
  }));

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('lightbox--active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const data = images[currentIndex];
    img.src = data.srcFull;
    img.alt = data.title;
    caption.textContent = data.title + (data.desc ? ' — ' + data.desc : '');
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  // Click handlers
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', prevImage);
  nextBtn.addEventListener('click', nextImage);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('lightbox--active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Touch/swipe support
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  }, { passive: true });
}
