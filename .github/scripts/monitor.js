const fs = require('fs');
const https = require('https');
const http = require('http');

const ENDPOINTS = [
  { id: 'frontend', name: 'Mapa Beskidu (Frontend)', url: 'https://mapabeskidu.pl', critical: true },
  { id: 'backend', name: 'API PHP (Backend)', url: 'https://mapabeskidu.pl/api/get-alerts.php', critical: false },
  { id: 'imgw', name: 'API IMGW (Alerty)', url: 'https://meteo.imgw.pl/api/meteo/messages/2/osmet/latest/json', critical: false }
];

const HISTORY_FILE = './history.json';
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

function fetchUrl(url, timeoutMs = 15000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const lib = url.startsWith('https') ? https : http;
    
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    
    const req = lib.get(options, (res) => {
      resolve({
        status: res.statusCode,
        time: Date.now() - start,
        success: res.statusCode >= 200 && res.statusCode < 400
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, time: Date.now() - start, success: false, error: err.message });
    });

    req.setTimeout(timeoutMs, () => {
      req.destroy();
      resolve({ status: 0, time: timeoutMs, success: false, error: 'Timeout' });
    });
  });
}

async function sendDiscordNotification(endpoint, result) {
  if (!DISCORD_WEBHOOK) {
    console.log('DISCORD_WEBHOOK is not set, skipping notification.');
    return;
  }
  
  const payload = {
    content: `🚨 **AWARIA:** Usługa **${endpoint.name}** nie odpowiada!\n*URL:* ${endpoint.url}\n*Kod błędu:* ${result.status}\n*Czas:* ${new Date().toISOString()}`
  };

  const urlObj = new URL(DISCORD_WEBHOOK);
  const options = {
    hostname: urlObj.hostname,
    port: 443,
    path: urlObj.pathname,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => resolve(res.statusCode));
    req.on('error', () => resolve(0));
    req.write(JSON.stringify(payload));
    req.end();
  });
}

async function main() {
  let history = { lastUpdate: '', endpoints: {} };
  
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (e) {
      console.warn("Could not parse existing history.json, starting fresh.");
    }
  }

  // Initialize missing endpoints in history
  for (const ep of ENDPOINTS) {
    if (!history.endpoints[ep.id]) {
      history.endpoints[ep.id] = { name: ep.name, logs: [] };
    }
  }

  const now = new Date();
  let hasCriticalError = false;

  console.log(`Starting checks at ${now.toISOString()}`);

  for (const ep of ENDPOINTS) {
    console.log(`Checking ${ep.id}...`);
    const result = await fetchUrl(ep.url);
    
    console.log(`Result for ${ep.id}: ${result.status} (Time: ${result.time}ms)`);
    
    // Zapamiętaj log
    history.endpoints[ep.id].logs.push({
      timestamp: now.toISOString(),
      status: result.status,
      time: result.time,
      success: result.success
    });

    // Powiadomienia Discord
    if (!result.success && ep.critical) {
      hasCriticalError = true;
      console.log(`CRITICAL ERROR DETECTED FOR ${ep.id}. Notifying Discord...`);
      await sendDiscordNotification(ep, result);
    }
    
    // Czyszczenie starej historii (zatrzymujemy maks 1000 wpisów, ok. 10 dni przy checku co 15min)
    if (history.endpoints[ep.id].logs.length > 1000) {
      history.endpoints[ep.id].logs = history.endpoints[ep.id].logs.slice(-1000);
    }
  }

  history.lastUpdate = now.toISOString();

  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  console.log("History saved.");

  if (hasCriticalError) {
    console.log("Exiting with error due to critical failure.");
    process.exit(1);
  }
}

main();
