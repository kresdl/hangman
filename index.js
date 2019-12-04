'use strict';

var dictionary, guessesLeft, word, used, end, spans;

const MAX_GUESSES = 8,
em = query => document.querySelector(query),
alphabet = em('#alphabet'),
letters = em('#letters'),
count = em('#count'),
next = em('#next'),
wrapper = em('#wrapper'),

init = async () => {
  const res = await fetch('assets/words.txt'),
  words = await res.text();
  dictionary =  words.split('\r\n');

  spans = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ'].reduce((acc, e) => ({
    ...acc,
    [e]: document.createElement('span')
  }), {});

  Object.entries(spans).forEach(([letter, span]) => {
    span.innerText = letter;
    alphabet.append(span, document.createTextNode(' '));
  });
  
  refresh();
},

refresh = () => {
  updateGuessesLeft(MAX_GUESSES);
  const rnd = 1000 * Math.random() >> 0;
  word = dictionary[rnd].toUpperCase();
  letters.innerText = '_'.repeat(word.length);
  alphabet.childNodes.forEach(e => { e.className = ''; });
  wrapper.className = '';
  used = [];
  end = false;
},

success = () => {
  wrapper.className = 'success end';
  end = true;
  next.focus();
},

fail = () => {
  letters.innerText = word;
  wrapper.className = 'fail end';
  end = true;
  next.focus();
},

updateGuessesLeft = amount => {
  if (guessesLeft = amount) {
    count.innerText = guessesLeft === 1 ? 'Last guess' : guessesLeft + ' guesses left';
  } else {
    count.innerText = 'No guesses left';
  }
},

guess = letter => {
  if (used.includes(letter)) return;
  used.push(letter);
  spans[letter].className = 'dim';
  const { innerText } = letters;
  letters.innerText = innerText.replace(/_/g, (e, i) => word[i] === letter ? letter : e);

  if (letters.innerText === word) {
    success();
  } else if (letters.innerText === innerText) {
    updateGuessesLeft(guessesLeft - 1);
    guessesLeft || fail();
  }
};

next.onclick = refresh;

window.onkeydown = ({ key }) => {
  !end && key.match(/^[a-öA-Ö]$/) && guess(key.toUpperCase())
};

alphabet.onclick = ({ target }) => {
  target.tagName === 'SPAN' && guess(target.innerText);
};

init();