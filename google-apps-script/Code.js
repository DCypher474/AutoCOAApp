/**
 * Google Apps Script: save data from AutoCOA App to this spreadsheet
 *
 * COA List spreadsheet ID – data is always written here (replace if you use a different sheet):
 * https://docs.google.com/spreadsheets/d/1Z9KSgthbzvMatoGQqTLeEn06M8OyLvCmEBEdbODwqD8/edit
 *
 * Setup:
 * 1. Extensions → Apps Script (from any sheet or script.google.com). Paste this code and save.
 * 2. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → Deploy
 * 3. Copy the Web app URL (ends with /exec) into your app's .env as VITE_SHEETS_SCRIPT_URL
 */

var SPREADSHEET_ID = '1Z9KSgthbzvMatoGQqTLeEn06M8OyLvCmEBEdbODwqD8'

function doPost(e) {
  try {
    const body = e.postData?.contents ? JSON.parse(e.postData.contents) : {}
    const action = body.action || 'append'
    const data = body.data || {}

    // Always write to this exact spreadsheet (COA List) by ID
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    const sheet = spreadsheet.getSheets()[0]
    var rowNumber = null

    if (action === 'append') {
      const lastRow = sheet.getLastRow()
      const lastCol = sheet.getLastColumn()
      let headers

      if (lastRow === 0) {
        // Empty sheet: write headers in row 1, then insert data row at row 2
        headers = Object.keys(data)
        sheet.appendRow(headers)
      } else {
        headers = lastCol > 0
          ? sheet.getRange(1, 1, 1, lastCol).getValues()[0]
          : Object.keys(data)
      }

      const row = headers.map((h) => (data[h] != null ? String(data[h]) : ''))
      // Insert new row at row 2 (right after headers) so newest entries appear at the top
      sheet.insertRowAfter(1)
      sheet.getRange(2, 1, 1, row.length).setValues([row])
      rowNumber = 2
    }

    return createResponse({
      success: true,
      spreadsheetUrl: spreadsheet.getUrl(),
      spreadsheetName: spreadsheet.getName(),
      rowAdded: rowNumber
    })
  } catch (err) {
    return createResponse({ error: err.message }, 400)
  }
}

/** Open the script URL in a browser (GET) to verify which sheet it writes to. */
function doGet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    const url = spreadsheet.getUrl()
    const name = spreadsheet.getName()
    return ContentService.createTextOutput(
      'This script saves form data to: ' + name + '\n' + url
    ).setMimeType(ContentService.MimeType.TEXT)
  } catch (err) {
    return ContentService.createTextOutput('Error: ' + err.message)
      .setMimeType(ContentService.MimeType.TEXT)
  }
}

function createResponse(obj, statusCode) {
  statusCode = statusCode || 200
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
  return output
}
