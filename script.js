(function() {
  'use strict';

  const state = {
    lang: null,
    config: { players: 4, undercover: 1, mrwhite: 0 },
    names: [],
    players: [], // {id, name, role, word, eliminated}
    civilianWord: '',
    undercoverWord: '',
    revealIndex: 0,
    revealOrder: [],
    eliminatedThisRound: null,
    winner: null,
  };

  // ---------- Utilities ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || key;

  // ---------- Language ----------
  function setLanguage(lang) {
    state.lang = lang;
    localStorage.setItem('ethok_lang', lang);
    document.documentElement.lang = lang;
    applyI18n();
  }

  function applyI18n() {
    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val) el.textContent = val;
    });
    const howto = $('#howto-content');
    if (howto) howto.innerHTML = t('howtoContent');
  }

  // ---------- Screen navigation ----------
  function show(screenId) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(screenId);
    if (el) {
      el.classList.add('active');
      window.scrollTo(0, 0);
    }
  }

  // ---------- Setup ----------
  function updateStepperBounds() {
    const { players, undercover, mrwhite } = state.config;
    const totalImpostors = undercover + mrwhite;
    const civilians = players - totalImpostors;
    const hint = $('#setup-hint');

    if (players < 3) {
      hint.textContent = t('setupHintMin');
      hint.classList.add('error');
      $('#btn-start-game').disabled = true;
    } else if (civilians <= totalImpostors || civilians < 1) {
      hint.textContent = t('setupHintMax');
      hint.classList.add('error');
      $('#btn-start-game').disabled = true;
    } else {
      hint.textContent = t('setupHintOk');
      hint.classList.remove('error');
      $('#btn-start-game').disabled = false;
    }
  }

  function renderStepperValues() {
    $('#val-players').textContent = state.config.players;
    $('#val-undercover').textContent = state.config.undercover;
    $('#val-mrwhite').textContent = state.config.mrwhite;
  }

  function renderPlayerInputs() {
    const container = $('#player-inputs');
    const n = state.config.players;
    const current = container.querySelectorAll('input');
    const values = Array.from(current).map(i => i.value);
    container.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'text-input';
      input.placeholder = `${t('playerPlaceholder')} ${i + 1}`;
      input.value = values[i] || '';
      input.maxLength = 20;
      container.appendChild(input);
    }
  }

  function stepConfig(key, delta) {
    const maxPlayers = 20;
    const newVal = state.config[key] + delta;
    if (key === 'players') {
      state.config.players = Math.max(3, Math.min(maxPlayers, newVal));
    } else {
      state.config[key] = Math.max(0, Math.min(state.config.players - 1, newVal));
    }
    renderStepperValues();
    if (key === 'players') renderPlayerInputs();
    updateStepperBounds();
  }

  // ---------- Game start ----------
  function startGame() {
    const inputs = $('#player-inputs').querySelectorAll('input');
    state.names = Array.from(inputs).map((i, idx) => (i.value.trim() || `${t('playerPlaceholder')} ${idx + 1}`));

    const pair = shuffle(WORDS[state.lang])[0];
    // Randomize which side is civilian vs undercover
    if (Math.random() < 0.5) {
      state.civilianWord = pair[0];
      state.undercoverWord = pair[1];
    } else {
      state.civilianWord = pair[1];
      state.undercoverWord = pair[0];
    }

    const roles = [];
    for (let i = 0; i < state.config.undercover; i++) roles.push('undercover');
    for (let i = 0; i < state.config.mrwhite; i++) roles.push('mrwhite');
    while (roles.length < state.config.players) roles.push('civilian');
    const shuffled = shuffle(roles);

    state.players = state.names.map((name, i) => ({
      id: i,
      name,
      role: shuffled[i],
      word: shuffled[i] === 'civilian' ? state.civilianWord
        : shuffled[i] === 'undercover' ? state.undercoverWord
        : '',
      eliminated: false,
    }));

    state.revealOrder = shuffle(state.players.map(p => p.id));
    state.revealIndex = 0;
    state.winner = null;
    renderReveal();
    show('screen-reveal');
  }

  // ---------- Reveal ----------
  function updateRevealContent() {
    const total = state.revealOrder.length;
    const idx = state.revealIndex;
    const player = state.players[state.revealOrder[idx]];
    $('#reveal-step').textContent = `${idx + 1} / ${total}`;
    $('#reveal-name').textContent = player.name;

    const roleLabel = $('#role-label');
    const word = $('#secret-word');
    const hint = $('#word-hint');

    if (player.role === 'civilian') {
      roleLabel.textContent = t('roleCivilian');
      word.textContent = player.word;
      hint.textContent = t('wordHintCivilian');
    } else if (player.role === 'undercover') {
      roleLabel.textContent = t('roleUndercover');
      word.textContent = player.word;
      hint.textContent = t('wordHintUndercover');
    } else {
      roleLabel.textContent = t('roleMrWhite');
      word.textContent = '???';
      hint.textContent = t('wordHintMrWhite');
    }
  }

  function renderReveal() {
    const flip = $('#card-flip');
    flip.classList.remove('flipped');
    updateRevealContent();
    $('#btn-next-reveal').style.visibility = 'hidden';
  }

  function onCardTap() {
    const flip = $('#card-flip');
    if (!flip.classList.contains('flipped')) {
      flip.classList.add('flipped');
      $('#btn-next-reveal').style.visibility = 'visible';
    }
  }

  function nextReveal() {
    state.revealIndex++;
    if (state.revealIndex >= state.revealOrder.length) {
      startDiscussion();
      return;
    }
    const flip = $('#card-flip');
    flip.classList.remove('flipped');
    $('#btn-next-reveal').style.visibility = 'hidden';
    // Wait for the flip-back animation to finish before swapping content,
    // so the outgoing player's word never bleeds into the next card.
    setTimeout(updateRevealContent, 650);
  }

  // ---------- Discussion ----------
  function startDiscussion() {
    const alive = state.players.filter(p => !p.eliminated);
    const order = shuffle(alive.map(p => p.id));
    const list = $('#speaking-order');
    list.innerHTML = '';
    order.forEach((pid, i) => {
      const p = state.players[pid];
      const li = document.createElement('li');
      li.innerHTML = `<span class="num">${i + 1}</span><span>${escapeHtml(p.name)}</span>`;
      list.appendChild(li);
    });
    show('screen-discuss');
  }

  // ---------- Voting ----------
  function startVoting() {
    const container = $('#vote-buttons');
    container.innerHTML = '';
    const alive = state.players.filter(p => !p.eliminated);
    alive.forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'btn vote-btn';
      btn.textContent = p.name;
      btn.onclick = () => eliminatePlayer(p.id);
      container.appendChild(btn);
    });
    show('screen-vote');
  }

  function eliminatePlayer(pid) {
    const player = state.players[pid];
    player.eliminated = true;
    state.eliminatedThisRound = pid;

    $('#elim-name').textContent = player.name;
    let roleText = '';
    if (player.role === 'civilian') roleText = t('roleCivilian');
    else if (player.role === 'undercover') roleText = t('roleUndercover');
    else roleText = t('roleMrWhite');
    $('#elim-role').textContent = roleText;

    const mrwhiteWrap = $('#mrwhite-guess');
    if (player.role === 'mrwhite') {
      mrwhiteWrap.classList.remove('hidden');
      $('#mrwhite-input').value = '';
      $('#btn-continue').classList.add('hidden');
    } else {
      mrwhiteWrap.classList.add('hidden');
      $('#btn-continue').classList.remove('hidden');
    }

    show('screen-elim');
  }

  function submitMrWhiteGuess() {
    const guess = $('#mrwhite-input').value.trim().toLowerCase();
    if (!guess) return;
    const correct = state.civilianWord.trim().toLowerCase();
    if (guess === correct) {
      state.winner = 'mrwhite';
      endGame();
    } else {
      $('#mrwhite-guess').classList.add('hidden');
      $('#btn-continue').classList.remove('hidden');
      continueAfterElim();
    }
  }

  function continueAfterElim() {
    const alive = state.players.filter(p => !p.eliminated);
    const impostorsAlive = alive.filter(p => p.role === 'undercover' || p.role === 'mrwhite');
    const civiliansAlive = alive.filter(p => p.role === 'civilian');

    if (impostorsAlive.length === 0) {
      state.winner = 'civilian';
      endGame();
      return;
    }
    if (impostorsAlive.length >= civiliansAlive.length) {
      if (impostorsAlive.some(p => p.role === 'undercover')) {
        state.winner = 'undercover';
      } else {
        state.winner = 'mrwhite';
      }
      endGame();
      return;
    }
    if (alive.length <= 2) {
      state.winner = impostorsAlive[0].role;
      endGame();
      return;
    }
    startDiscussion();
  }

  // ---------- End ----------
  function endGame() {
    let title = '', desc = '';
    if (state.winner === 'civilian') { title = t('winCivilians'); desc = t('descCivilians'); }
    else if (state.winner === 'undercover') { title = t('winUndercover'); desc = t('descUndercover'); }
    else if (state.winner === 'mrwhite') { title = t('winMrWhite'); desc = t('descMrWhite'); }
    $('#winner-title').textContent = title;
    $('#winner-desc').textContent = desc;
    $('#end-civ-word').textContent = state.civilianWord;
    $('#end-und-word').textContent = state.undercoverWord;

    const list = $('#end-roles');
    list.innerHTML = '';
    state.players.forEach((p, i) => {
      const li = document.createElement('li');
      const tagClass = p.role === 'civilian' ? 'civilian' : p.role === 'undercover' ? 'undercover' : 'mrwhite';
      const tagLabel = p.role === 'civilian' ? t('roleCivilian') : p.role === 'undercover' ? t('roleUndercover') : t('roleMrWhite');
      li.className = p.eliminated ? 'eliminated' : '';
      li.innerHTML = `<span class="num">${i + 1}</span><span>${escapeHtml(p.name)}</span><span class="role-tag ${tagClass}">${tagLabel}</span>`;
      list.appendChild(li);
    });
    show('screen-end');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  // ---------- Init ----------
  function init() {
    const saved = localStorage.getItem('ethok_lang');
    if (saved && I18N[saved]) {
      setLanguage(saved);
      show('screen-home');
    } else {
      show('screen-lang');
    }

    $$('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setLanguage(btn.getAttribute('data-lang'));
        show('screen-home');
      });
    });

    $('#btn-change-lang').addEventListener('click', () => show('screen-lang'));
    $('#btn-how-to').addEventListener('click', () => { applyI18n(); show('screen-howto'); });

    $$('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => show(btn.getAttribute('data-back')));
    });

    $('#btn-new-game').addEventListener('click', () => {
      renderStepperValues();
      renderPlayerInputs();
      updateStepperBounds();
      show('screen-setup');
    });

    $$('.btn-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-step') === 'mrwhite' ? 'mrwhite' : btn.getAttribute('data-step');
        stepConfig(key, parseInt(btn.getAttribute('data-delta'), 10));
      });
    });

    $('#btn-start-game').addEventListener('click', startGame);

    $('#card-flip').addEventListener('click', onCardTap);
    $('#btn-next-reveal').addEventListener('click', nextReveal);

    $('#btn-start-vote').addEventListener('click', startVoting);
    $('#btn-skip-vote').addEventListener('click', () => startDiscussion());

    $('#btn-continue').addEventListener('click', continueAfterElim);
    $('#btn-mrwhite-guess').addEventListener('click', submitMrWhiteGuess);

    $('#btn-play-again').addEventListener('click', () => {
      state.players = [];
      renderStepperValues();
      renderPlayerInputs();
      updateStepperBounds();
      show('screen-setup');
    });
    $('#btn-home').addEventListener('click', () => show('screen-home'));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
