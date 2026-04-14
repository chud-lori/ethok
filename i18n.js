const I18N = {
  en: {
    tagline: 'Find the impostor among you',
    chooseLanguage: 'Choose Language',
    changeLanguage: 'Change Language',
    newGame: 'New Game',
    howToPlay: 'How to Play',
    gameSetup: 'Game Setup',
    totalPlayers: 'Total Players',
    undercoverCount: 'Undercover',
    mrWhite: 'Mr. White',
    playerNames: 'Player Names',
    playerPlaceholder: 'Player',
    startGame: 'Start Game',
    tapToReveal: 'Tap to reveal',
    pass: 'Pass to next player',
    roleCivilian: 'Civilian',
    roleUndercover: 'Undercover',
    roleMrWhite: 'Mr. White',
    wordHintCivilian: 'Describe your word without saying it',
    wordHintUndercover: 'You have a different word. Blend in!',
    wordHintMrWhite: 'You have no word. Fake it until you make it!',
    discussion: 'Discussion',
    roundInfo: 'Each player describes their word in one short sentence without saying it.',
    speakingOrder: 'Speaking Order',
    startVoting: 'Start Voting',
    vote: 'Vote',
    voteInfo: 'Select the player to eliminate.',
    skipRound: 'Skip (No Elimination)',
    eliminated: 'Eliminated',
    continue: 'Continue',
    mrWhiteGuessPrompt: 'Mr. White, guess the civilian word to steal the win!',
    submitGuess: 'Submit Guess',
    civilianWordLabel: 'Civilian word',
    undercoverWordLabel: 'Undercover word',
    roles: 'Roles',
    playAgain: 'Play Again',
    backToHome: 'Back to Home',
    winCivilians: 'Civilians Win!',
    winUndercover: 'Undercover Wins!',
    winMrWhite: 'Mr. White Wins!',
    descCivilians: 'All impostors have been eliminated.',
    descUndercover: 'The undercover survived!',
    descMrWhite: 'Mr. White guessed the civilian word!',
    setupHintMin: 'Minimum 3 players.',
    setupHintMax: 'Civilians must outnumber impostors.',
    setupHintOk: 'Ready to start!',
    howtoContent: `
      <h3>About Ethok-Ethok</h3>
      <p>Ethok-Ethok is a social deduction party game for 3 or more players. Pass the phone between players so each one can secretly see their role and word.</p>
      <h3>Roles</h3>
      <ul>
        <li><strong>Civilians</strong> — share a common secret word.</li>
        <li><strong>Undercover</strong> — get a similar but different word.</li>
        <li><strong>Mr. White</strong> — gets no word and must bluff.</li>
      </ul>
      <h3>Gameplay</h3>
      <ul>
        <li>Each player describes their word in one short sentence without saying it.</li>
        <li>After everyone speaks, players vote to eliminate one suspected impostor.</li>
        <li>The eliminated player's role is revealed.</li>
        <li>If Mr. White is eliminated, they get one chance to guess the civilian word.</li>
        <li>Repeat rounds until a team wins.</li>
      </ul>
      <h3>Winning</h3>
      <ul>
        <li><strong>Civilians</strong> win by eliminating all impostors.</li>
        <li><strong>Undercover</strong> wins by surviving until they outnumber or equal the civilians.</li>
        <li><strong>Mr. White</strong> wins by correctly guessing the civilian word when eliminated.</li>
      </ul>
      <h3>Tips</h3>
      <ul>
        <li>Be vague but not too vague — suspicious players get voted out.</li>
        <li>Listen carefully: the undercover's clue often describes a slightly different thing.</li>
      </ul>
    `
  },
  id: {
    tagline: 'Temukan penyamar di antara kalian',
    chooseLanguage: 'Pilih Bahasa',
    changeLanguage: 'Ganti Bahasa',
    newGame: 'Game Baru',
    howToPlay: 'Cara Bermain',
    gameSetup: 'Pengaturan Game',
    totalPlayers: 'Jumlah Pemain',
    undercoverCount: 'Penyamar',
    mrWhite: 'Mr. White',
    playerNames: 'Nama Pemain',
    playerPlaceholder: 'Pemain',
    startGame: 'Mulai Game',
    tapToReveal: 'Ketuk untuk melihat',
    pass: 'Oper ke pemain berikutnya',
    roleCivilian: 'Warga',
    roleUndercover: 'Penyamar',
    roleMrWhite: 'Mr. White',
    wordHintCivilian: 'Deskripsikan katamu tanpa mengucapkannya',
    wordHintUndercover: 'Katamu berbeda. Menyamarlah!',
    wordHintMrWhite: 'Kamu tidak punya kata. Ngebluff sampai menang!',
    discussion: 'Diskusi',
    roundInfo: 'Setiap pemain mendeskripsikan katanya dalam satu kalimat tanpa mengucapkannya.',
    speakingOrder: 'Urutan Bicara',
    startVoting: 'Mulai Voting',
    vote: 'Voting',
    voteInfo: 'Pilih pemain yang akan dieliminasi.',
    skipRound: 'Lewati (Tanpa Eliminasi)',
    eliminated: 'Tereliminasi',
    continue: 'Lanjut',
    mrWhiteGuessPrompt: 'Mr. White, tebak kata warga untuk memenangkan game!',
    submitGuess: 'Kirim Tebakan',
    civilianWordLabel: 'Kata warga',
    undercoverWordLabel: 'Kata penyamar',
    roles: 'Peran',
    playAgain: 'Main Lagi',
    backToHome: 'Kembali ke Beranda',
    winCivilians: 'Warga Menang!',
    winUndercover: 'Penyamar Menang!',
    winMrWhite: 'Mr. White Menang!',
    descCivilians: 'Semua penyamar berhasil dieliminasi.',
    descUndercover: 'Penyamar berhasil bertahan!',
    descMrWhite: 'Mr. White berhasil menebak kata warga!',
    setupHintMin: 'Minimal 3 pemain.',
    setupHintMax: 'Jumlah warga harus lebih banyak dari penyamar.',
    setupHintOk: 'Siap dimulai!',
    howtoContent: `
      <h3>Tentang Ethok-Ethok</h3>
      <p>Ethok-Ethok adalah game pesta deduksi sosial untuk 3 pemain atau lebih. Oper HP antar pemain agar setiap orang dapat melihat peran dan katanya secara rahasia.</p>
      <h3>Peran</h3>
      <ul>
        <li><strong>Warga</strong> — berbagi kata rahasia yang sama.</li>
        <li><strong>Penyamar</strong> — mendapat kata yang mirip tapi berbeda.</li>
        <li><strong>Mr. White</strong> — tidak mendapat kata dan harus ngebluff.</li>
      </ul>
      <h3>Alur Permainan</h3>
      <ul>
        <li>Setiap pemain mendeskripsikan katanya dalam satu kalimat singkat tanpa mengucapkannya.</li>
        <li>Setelah semua selesai, pemain melakukan voting untuk mengeliminasi satu orang yang dicurigai.</li>
        <li>Peran pemain yang tereliminasi akan terungkap.</li>
        <li>Jika Mr. White tereliminasi, ia mendapat satu kesempatan menebak kata warga.</li>
        <li>Ulangi ronde hingga salah satu tim menang.</li>
      </ul>
      <h3>Cara Menang</h3>
      <ul>
        <li><strong>Warga</strong> menang dengan mengeliminasi semua penyamar.</li>
        <li><strong>Penyamar</strong> menang dengan bertahan hingga jumlahnya sama atau melebihi warga.</li>
        <li><strong>Mr. White</strong> menang dengan menebak kata warga dengan benar saat tereliminasi.</li>
      </ul>
      <h3>Tips</h3>
      <ul>
        <li>Jangan terlalu jelas, tapi jangan terlalu samar — pemain yang mencurigakan akan dicoret.</li>
        <li>Dengarkan baik-baik: petunjuk penyamar biasanya mendeskripsikan hal yang sedikit berbeda.</li>
      </ul>
    `
  }
};
