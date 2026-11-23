window.__styleInventoryFixture = true;
window.addEventListener('load', () => {
  window.setTimeout(() => {
    const script = document.createElement('script');
    script.src = './style-inventory-deferred.js';
    document.head.append(script);
  }, 0);
});
