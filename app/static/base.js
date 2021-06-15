// using timeout to apply css class after render
setTimeout(document.querySelectorAll('.flashMessages').forEach(el => {
  el.classList.add('fadeout');
}), 1000)