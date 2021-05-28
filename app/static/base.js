document.querySelectorAll('.flashMessages').forEach(el => {
  el.classList.add('fadeout');
});

function confirm(url) {
  if (confirm("Confirm Delete?")) {
    window.location = url;
  } 
}