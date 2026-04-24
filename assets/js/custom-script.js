(function () {
  'use strict';

  if (window.__lunelCustomScriptLoaded) return;
  window.__lunelCustomScriptLoaded = true;

  const moveGallery = () => {
    const gallerySection = document.getElementById(
      'saji-photo-gallery-undefined',
    );
    const metadataDiv = document.getElementById('salla-metadata');

    if (gallerySection && metadataDiv) {
      metadataDiv.parentNode.insertBefore(
        gallerySection,
        metadataDiv.nextSibling,
      );
    }
  };

  // Retry until elements exist
  const interval = setInterval(() => {
    moveGallery();
    if (
      document.getElementById('saji-photo-gallery-undefined') &&
      document.getElementById('salla-metadata')
    ) {
      clearInterval(interval);
    }
  }, 300);
})();
