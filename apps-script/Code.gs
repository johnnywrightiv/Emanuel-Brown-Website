/**
 * Paste this into your Google Sheet: Extensions → Apps Script.
 * Set Script Property: SIGNUP_SECRET (same value as in js/main.js).
 * Deploy as Web app: Execute as Me, Who has access: Anyone.
 */

function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  // Apps Script Web App always returns 200; success/error is in the JSON body.

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return output.setContent(JSON.stringify({ ok: false, error: 'Bad request' }));
    }

    var body = JSON.parse(e.postData.contents);
    var email = typeof body.email === 'string' ? body.email.trim() : '';
    var token = typeof body.token === 'string' ? body.token : '';

    var secret = PropertiesService.getScriptProperties().getProperty('SIGNUP_SECRET');
    if (!secret || token !== secret) {
      return output.setContent(JSON.stringify({ ok: false, error: 'Unauthorized' }));
    }

    if (!email) {
      return output.setContent(JSON.stringify({ ok: false, error: 'Email is required.' }));
    }
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return output.setContent(JSON.stringify({ ok: false, error: 'Invalid email address.' }));
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([email, new Date().toISOString()]);

    return output.setContent(JSON.stringify({ ok: true }));
  } catch (err) {
    return output.setContent(JSON.stringify({ ok: false, error: err.message || 'Server error' }));
  }
}
