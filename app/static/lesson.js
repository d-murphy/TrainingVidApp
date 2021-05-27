const media = document.querySelector('video');
const controls = document.querySelector('.controls');

const play = document.querySelector('.play');

const timerWrapper = document.querySelector('.timer');
const timer = document.querySelector('.timer span');
const timerBar = document.querySelector('.timer div');

media.removeAttribute('controls');

play.addEventListener('click', playPauseMedia);
media.addEventListener('ended', stopMedia);
media.addEventListener('timeupdate', setTime);

function playPauseMedia() {
    if(media.paused) {
      play.setAttribute('data-icon','u');
      media.play();
    } else {
      play.setAttribute('data-icon','P');
      media.pause();
    }
  }


function stopMedia() {
    media.pause();
    media.currentTime = 0;
    play.setAttribute('data-icon','P');
    document.querySelector('.button').classList.remove('disabled');
    document.querySelector('.disabled-wrapper').classList.remove('disabled-wrapper');
  }

  function setTime() {
    let minutes = Math.floor(media.currentTime / 60);
    let seconds = Math.floor(media.currentTime - minutes * 60);
    let minuteValue;
    let secondValue;
  
    if (minutes < 10) {
      minuteValue = '0' + minutes;
    } else {
      minuteValue = minutes;
    }
  
    if (seconds < 10) {
      secondValue = '0' + seconds;
    } else {
      secondValue = seconds;
    }
  
    let mediaTime = minuteValue + ':' + secondValue;
    timer.textContent = mediaTime;
  
    let barLength = timerWrapper.clientWidth * (media.currentTime/media.duration);
    timerBar.style.width = barLength + 'px';
  }

function showControls() {
  document.querySelector('.controls').classList.remove('hideControls');
}