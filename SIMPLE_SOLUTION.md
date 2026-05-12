# Simple Google Sheets Solution for Form Submissions

## Option 1: Use Google Sheets (Fastest)

1. Create a new Google Sheet for form submissions
2. Use this Google Apps Script as a webhook:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  // Add header row if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Full Name', 'Business Name', 'Email', 'Phone', 'Website',
      'Service Area', 'Social Links', 'Content Purpose', 'Ad Budget'
    ]);
  }
  
  // Add data row
  sheet.appendRow([
    new Date(),
    data.full_name,
    data.business_name,
    data.email,
    data.phone,
    data.website,
    data.service_area,
    data.social_links,
    data.content_purpose,
    data.ad_budget
  ]);
  
  return ContentService.createTextOutput('Success');
}
```

3. Deploy as web app and get the URL
4. Update form to POST to this URL

---

## Option 2: Use Airtable (Also Simple)

1. Create Airtable base
2. Generate API token
3. Form POSTs to Airtable API
4. View submissions in Airtable

---

## Option 3: Use Webhook.site

1. Go to webhook.site
2. Get your unique webhook URL
3. Update form to POST there
4. View submissions in real-time

Choose one and I'll help you set it up!
