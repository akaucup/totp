let tokens = [];

function saveTokens() {
  const simplified = tokens.map(t => ({
    label: t.label,
    secret: t.secret
  }));
  localStorage.setItem('otp-tokens', JSON.stringify(simplified));
}

function exportTokens() {
  const simplified = tokens.map(t => ({
    label: t.label,
    secret: t.secret
  }));

  const blob = new Blob([JSON.stringify(simplified, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'otp-tokens.json';
  a.click();

  URL.revokeObjectURL(url);
}

document.getElementById('import-file').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      if (!Array.isArray(data)) throw new Error("Format tidak valid");

      let added = 0;

      data.forEach(({ label, secret }) => {
        if (!tokens.find(t => t.label === label)) {
          tokens.push({
            label,
            secret,
            totp: new OTPAuth.TOTP({
              issuer: 'MyApp',
              label,
              algorithm: 'SHA1',
              digits: 6,
              period: 30,
              secret: OTPAuth.Secret.fromBase32(secret)
            })
          });
          added++;
        }
      });

      if (added > 0) {
        saveTokens();
        renderTokens();
        alert(`${added} token berhasil diimpor.`);
      } else {
        alert('Tidak ada token baru yang ditambahkan.');
      }
    } catch (err) {
      alert('File JSON tidak valid.');
    }

    this.value = ''; // reset file input
  };

  reader.readAsText(file);
});


function loadTokens() {
  const saved = JSON.parse(localStorage.getItem('otp-tokens')) || [];
  tokens = saved.map(({ label, secret }) => ({
    label,
    secret,
    totp: new OTPAuth.TOTP({
      issuer: 'MyApp',
      label,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret)
    })
  }));
}

function renderTokens() {
  const list = document.getElementById('token-list');
  list.innerHTML = '';

  const searchQuery = document.getElementById('search-input').value.toLowerCase();

  const now = Math.floor(Date.now() / 1000);

  [...tokens]
    .reverse()
    .filter(t => t.label.toLowerCase().includes(searchQuery))
    .forEach(({ label, totp }, i) => {
      const index = tokens.length - 1 - i;

      const li = document.createElement('li');
      const code = totp.generate();

      li.dataset.code = code;

      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      labelSpan.className = 'label-text';

      const tokenSpan = document.createElement('span');
      tokenSpan.textContent = code;
      tokenSpan.className = 'token-text';

      const del = document.createElement('button');
      del.textContent = '❌';
      del.onclick = (e) => {
        e.stopPropagation();
        tokens.splice(index, 1);
        saveTokens();
        renderTokens();
      };

      li.appendChild(labelSpan);
      li.appendChild(tokenSpan);
      li.appendChild(del);

      li.addEventListener('click', () => {
        navigator.clipboard.writeText(code);
        tokenSpan.textContent = 'Copied!';
        setTimeout(renderTokens, 1000);
      });

      list.appendChild(li);
    });
}




function updateProgressBar() {
  const now = Math.floor(Date.now() / 1000);
  const period = 30;
  const timeLeft = period - (now % period);
  const percent = (timeLeft / period) * 100;

  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = percent + '%';

  const countdown = document.getElementById('countdown-text');
  if (countdown) countdown.textContent = `${timeLeft}s`;
}


document.getElementById('token-form').addEventListener('submit', e => {
  e.preventDefault();

  const label = document.getElementById('label').value.trim();
  const secret = document.getElementById('secret').value.trim();

  if (!label || !secret) return;

  const totp = new OTPAuth.TOTP({
    issuer: 'MyApp',
    label,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret)
  });

  tokens.push({ label, secret, totp });
  saveTokens();
  renderTokens();

  e.target.reset();
  document.getElementById('search-input').value = '';

});


loadTokens();
renderTokens();
updateProgressBar();

setInterval(() => {
  renderTokens();
  updateProgressBar();
}, 1000);

