const fs = require('fs');
const path = require('path');

// Load .env.local for local dev (Vercel injects env at build time)
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(function (line) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });
}

const mainPath = path.join(__dirname, 'js', 'main.js');
let main = fs.readFileSync(mainPath, 'utf8');
main = main.replace('__SIGNUP_ENDPOINT__', process.env.SIGNUP_ENDPOINT || '');
main = main.replace('__SIGNUP_SECRET__', process.env.SIGNUP_SECRET || '');
fs.writeFileSync(mainPath, main);
