const adventNames = {
  1: 'Laura',
  2: 'Erin',
  3: 'Julia',
  4: 'Laura',
  5: 'Lisa',
  6: 'Tobi',
  7: 'Sebastian',
  8: 'Dominic',
  9: 'Erin',
  10: 'Julia',
  11: 'Lisa',
  12: 'Laura',
  13: 'Tobi',
  14: 'Sebastian',
  15: 'Julia',
  16: 'Dominic',
  17: 'Erin',
  18: 'Tobi',
  19: 'Sebastian',
  20: 'Laura',
  21: 'Julia',
  22: 'Erin',
  23: 'Dominic',
  24: 'Lisa'
};

const adventSubtitles = {
  1: "Welcome to the Christmas calendar!",
  2: "This door needs to be opened under sterile conditions!",
  3: "All I want for Christmas is y... Ah, I'll take some positive colonies!",
  4: "May this advent calendar bring us all together like good 'ol T4 ligase!",
  5: "Silent night, holy night, all my cultures died overnight.",
  6: "Todays gift: 5 free PETAL runs!",
  7: "May all your PCRs run smoothly today!",
  8: "Ho Ho Ho! That's what Santa says when he reads your thesis!",
  9: "No volunteer? Then I'll draw from the jar!",
  10: "Jingle bells, PCR fails, funding went away!",
  11: "Wishing you golden hours in the lab.",
  12: "Hopefully seminar isn't too long today...",
  13: "Enjoy a CUP of Glühwein!",
  14: "Better use hand santa-tizer today!",
  15: "I really liked your slide design!",
  16: "Is this the scent of Christmas? No, it's Agrobacteria...",
  17: "Christmas Party Time!",
  18: "The Jores Lab Advent Calendar, the only reason to get up in the morning!",
  19: "The only thing growing faster than our Christmas spirit is the contamination.",
  20: "It's beginning to look a lot like Christmas!",
  21: "Is this the sound of Christmas bells? No, it's my primers crying (poorly designed maybe)",
  22: "My Christmas puns are tree-mendous!",
  23: "Put some Glühwein into your Agar plates, 10/10 experience!",
  24: "Merry Christmas everyone!"
};

let currentDate = new Date();
const dateText = document.getElementById('dateText');
const dayNumber = document.getElementById('dayNumber');
const nameText = document.getElementById('nameText');
const noticeText = document.getElementById('noticeText');
const subtitleText = document.getElementById('subtitleText');
const snowButton = document.getElementById('snowButton');
const weatherLayer = document.getElementById('weatherLayer');
const continuous = document.body.dataset.weather === 'continuous';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const testAdventInNovember = true; // Set to false to show the elves' message in November.

function updateCalendar() {
  const day = currentDate.getDate();
  const month = currentDate.getMonth();
  const isAdventDay = (month === 11 || (testAdventInNovember && month === 10)) && day <= 24;

  dateText.textContent = currentDate.toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  dayNumber.textContent = isAdventDay ? String(day).padStart(2, '0') : '✦';
  nameText.textContent = isAdventDay ? adventNames[day] : '—';
  subtitleText.textContent = isAdventDay ? adventSubtitles[day] : month === 10
    ? 'The Christmas elves are preparing the calendar!'
    : 'A little festive moment for every day of Advent.';
  noticeText.textContent = !isAdventDay && month === 11
    ? 'No name assigned for this December day.'
    : '';
}

function createParticle(type, fillScreen = false) {
  if (weatherLayer.childElementCount >= 160) return;
  const particle = document.createElement('span');
  const duration = type === 'rain' ? 1.1 + Math.random() * .7 : 5 + Math.random() * 4;
  particle.className = `particle ${type}`;
  if (type === 'snow') particle.textContent = Math.random() < .5 ? '✳' : '✻';
  particle.style.setProperty('--left', `${Math.random() * 100}%`);
  particle.style.setProperty('--size', type === 'rain'
    ? `${12 + Math.random() * 16}px`
    : `${10 + Math.random() * 14}px`);
  particle.style.setProperty('--duration', `${duration}s`);
  particle.style.setProperty('--drift', `${-70 + Math.random() * 140}px`);
  if (fillScreen) particle.style.animationDelay = `${-Math.random() * duration}s`;
  particle.addEventListener('animationend', () => particle.remove(), { once: true });
  weatherLayer.appendChild(particle);
}

let weatherTimer = null;
let weatherMode = 'idle';

function updateWeatherButton() {
  if (!continuous) return;
  snowButton.innerHTML = weatherMode === 'snow'
    ? '<span aria-hidden="true">✦</span> Stop snow'
    : '<span aria-hidden="true">❄</span> Ok, snow was better';
  if (weatherMode === 'idle') snowButton.innerHTML = '<span aria-hidden="true">❄</span> Let it snow';
}

function setWeather(mode) {
  clearInterval(weatherTimer);
  weatherLayer.replaceChildren();
  weatherMode = mode;
  updateWeatherButton();
  if (mode === 'idle') return;

  for (let i = 0; i < (mode === 'snow' ? 22 : 35); i++) createParticle(mode, true);
  weatherTimer = setInterval(() => createParticle(mode), mode === 'snow' ? 140 : 55);
}

function snowBurst() {
  const count = reducedMotion ? 12 : 75;
  for (let i = 0; i < count; i++) {
    setTimeout(() => createParticle('snow'), i * (reducedMotion ? 100 : 45));
  }
}

document.getElementById('prevDayButton').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 1);
  updateCalendar();
});

snowButton.addEventListener('click', () => {
  if (continuous) setWeather(weatherMode === 'snow' ? 'rain' : 'snow');
  else snowBurst();
});

updateCalendar();
if (continuous && !reducedMotion) setWeather('snow');
else updateWeatherButton();
