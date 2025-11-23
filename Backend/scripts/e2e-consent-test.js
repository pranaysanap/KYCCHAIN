/*
Simple end-to-end test script for consent flow.
Usage:
  node scripts/e2e-consent-test.js

Environment variables (or edit below):
  API_BASE - default http://localhost:5000/api
  USER_EMAIL, USER_PW - credentials for an individual user
  BANK_EMAIL, BANK_PW - credentials for a bank account (must have institutionName set)

This script will:
  1. Login as USER_EMAIL
  2. Grant consent to the institutionName of your choice
  3. Login as BANK_EMAIL
  4. Fetch verification logs for the bank and print matching entries

Note: Node 18+ has global fetch. If not available, the script will attempt to load node-fetch.
*/

const API_BASE = process.env.API_BASE || 'http://localhost:5000/api';
const USER_EMAIL = process.env.USER_EMAIL || 'user@example.com';
const USER_PW = process.env.USER_PW || 'password';
const BANK_EMAIL = process.env.BANK_EMAIL || 'bank@example.com';
const BANK_PW = process.env.BANK_PW || 'bankpassword';
const INSTITUTION_TO_GRANT = process.env.INSTITUTION_TO_GRANT || 'HDFC Bank';

async function ensureFetch() {
  if (typeof fetch !== 'undefined') return fetch;
  try {
    const nodeFetch = await import('node-fetch');
    return nodeFetch.default;
  } catch (e) {
    console.error('Fetch is not available and node-fetch is not installed. Please run on Node 18+ or install node-fetch.');
    process.exit(1);
  }
}

(async () => {
  const _fetch = await ensureFetch();

  async function post(path, body, token) {
    const res = await _fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: `Bearer ${token}` } : {}),
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { throw new Error(`Invalid JSON response: ${text}`); }
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status} ${JSON.stringify(data)}`);
    return data;
  }

  async function get(path, token) {
    const res = await _fetch(`${API_BASE}${path}`, {
      method: 'GET',
      headers: Object.assign({}, token ? { Authorization: `Bearer ${token}` } : {}),
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { throw new Error(`Invalid JSON response: ${text}`); }
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status} ${JSON.stringify(data)}`);
    return data;
  }

  try {
    console.log('1) Logging in as user:', USER_EMAIL);
    const userLogin = await post('/auth/login', { email: USER_EMAIL, password: USER_PW });
    const userToken = userLogin.token;
    console.log('   -> user token length:', userToken ? userToken.length : 'none');

    console.log(`2) Granting consent to ${INSTITUTION_TO_GRANT} as user`);
    const grantResp = await post('/consent/consents', { institutionName: INSTITUTION_TO_GRANT }, userToken);
    console.log('   -> Grant response:', grantResp);

    console.log('3) Logging in as bank:', BANK_EMAIL);
    const bankLogin = await post('/auth/login', { email: BANK_EMAIL, password: BANK_PW });
    const bankToken = bankLogin.token;
    console.log('   -> bank token length:', bankToken ? bankToken.length : 'none');

    console.log('4) Fetching verification logs as bank');
    const logs = await get('/consent/verification-logs', bankToken);
    console.log('   -> Logs total:', logs.total);

    // Print entries that mention the user
    const matches = logs.items.filter(item => item.userId && item.userId.toLowerCase().includes(USER_EMAIL.toLowerCase()));
    console.log('   -> Matching log entries for user:', matches.length);
    console.log(JSON.stringify(matches, null, 2));

    console.log('\nE2E consent test completed.');
  } catch (err) {
    console.error('E2E test failed:', err.message || err);
    process.exit(2);
  }
})();
