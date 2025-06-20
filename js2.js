// For demo: syncs cart icon on homepage
(function(){
  const cartHomeCount = document.querySelector('.cart-count');
  let cart = JSON.parse(sessionStorage.getItem('cart')||'[]');
  if(cartHomeCount){
    cartHomeCount.textContent = cart.reduce((s, i) => s + (i.qty||1), 0);
  }
})();