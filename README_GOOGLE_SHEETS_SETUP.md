# Google Sheets Integration Setup Guide

This guide explains how to set up Google Sheets integration for storing enrollment form data using Google Apps Script.

## Overview

The enrollment form collects the following data and stores it in Google Sheets:
- **Name** - Student's full name
- **Email** - Student's email address
- **Mobile** - Student's phone number
- **Mode** - Learning mode (online/offline)
- **Batch Month** - Preferred batch month
- **Time Slot** - Preferred time slot (if offline)
- **Payment Mode** - Selected payment option
- **Counselor** - Selected counselor name
- **Timestamp** - Submission date and time
- **Enrollment ID** - Unique identifier for the enrollment
- **Token Number** - Immutable token number starting from 1
- **Payment Status** - pending/paid (optional)
- **Day 5 Sent** - reminder status
- **Day 9 Sent** - reminder status
- **Day 10 Sent** - reminder status
- **Expiry Sent** - expiry status

## Setup Steps

### 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Enrollment Data" (or your preferred name)
4. In the first row, add these column headers:
   ```
   Name | Email | Mobile | Mode | Batch Month | Time Slot | Payment Mode | Counselor | Timestamp | Enrollment ID | Token Number | Payment Status | Day 5 Sent | Day 9 Sent | Day 10 Sent | Expiry Sent
   ```

### 2. Create Apps Script Webhook

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code and paste the following:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);

    // Handle reminder updates
    if (data.action === 'updateReminder') {
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var headerMap = {};
      headers.forEach(function(header, index) {
        headerMap[String(header).trim()] = index + 1;
      });

      var reminderColumns = {
        day5: 'Day 5 Sent',
        day9: 'Day 9 Sent',
        day10: 'Day 10 Sent',
        expiry: 'Expiry Sent'
      };

      var enrollmentCol = headerMap['Enrollment ID'];
      var reminderCol = reminderColumns[data.reminderType] ? headerMap[reminderColumns[data.reminderType]] : null;

      if (!enrollmentCol || !reminderCol) {
        return ContentService.createTextOutput(
          JSON.stringify({ success: false, message: 'Missing reminder columns' })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      var values = sheet.getRange(2, enrollmentCol, sheet.getLastRow() - 1, 1).getValues();
      var rowIndex = -1;
      for (var i = 0; i < values.length; i++) {
        if (String(values[i][0]) === String(data.enrollmentId)) {
          rowIndex = i + 2;
          break;
        }
      }

      if (rowIndex === -1) {
        return ContentService.createTextOutput(
          JSON.stringify({ success: false, message: 'Enrollment ID not found' })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      sheet.getRange(rowIndex, reminderCol).setValue(new Date().toISOString());

      return ContentService.createTextOutput(
        JSON.stringify({ success: true, message: 'Reminder status updated' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Generate immutable token number (starts at 1)
    var props = PropertiesService.getScriptProperties();
    var tokenNumber = parseInt(props.getProperty('enrollmentToken') || '0', 10) + 1;
    props.setProperty('enrollmentToken', String(tokenNumber));
    
    // Prepare row data
    var rowData = [
      data.name || '',
      data.email || '',
      data.mobile || '',
      data.mode || '',
      data.batch_month || '',
      data.time_slot || '',
      data.payment_mode || '',
      data.counselor || '',
      data.timestamp || new Date().toISOString(),
      data.enrollmentId || '',
      tokenNumber,
      'pending',
      '',
      '',
      '',
      ''
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: 'Data saved successfully',
        rowNumber: sheet.getLastRow(),
        tokenNumber: tokenNumber
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (💾 icon)
4. Click **Deploy** → **New deployment**
5. Click the gear icon (⚙️) next to "Select type"
6. Choose **Web app**
7. Configure deployment:
   - **Description**: "Enrollment Form Webhook"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
8. Click **Deploy**
9. **Copy the Web app URL** - this is your webhook URL

### 3. Configure Your Application

1. Open your `.env` file in the project root
2. Find or add this line:
   ```
   NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=your-apps-script-webhook-url-here
   ```
3. Replace `your-apps-script-webhook-url-here` with the URL you copied from Apps Script
4. Save the file
5. Restart your development server

### 4. Test the Integration

1. Navigate to the enrollment form in your application
2. Fill out all the form fields
3. Submit the form
4. Check your Google Sheet - a new row should appear with the submitted data

## Troubleshooting

### Common Issues

**"Google Sheets webhook URL is not configured"**
- Make sure you added the webhook URL to your `.env` file
- Restart your development server after adding the URL
- Verify the URL is correct and doesn't contain extra spaces

**"Failed to submit to Google Sheets: 403"**
- In Apps Script, ensure "Who has access" is set to "Anyone"
- Redeploy the script with the correct permissions

**"Failed to submit to Google Sheets: 404"**
- Verify the webhook URL is correct
- Make sure you copied the entire URL from the Apps Script deployment

**Data not appearing in sheets**
- Check if the Apps Script function name is `doPost` (case-sensitive)
- Verify column headers match the expected format
- Check the Apps Script execution logs for errors

### Viewing Apps Script Logs

1. Open your Apps Script project
2. Click **Executions** in the left sidebar
3. Click on any execution to see detailed logs

## Data Format

The webhook receives data in this JSON format:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "mode": "online",
  "batch_month": "February 2026",
  "time_slot": "N/A",
  "payment_mode": "Full Payment",
  "counselor": "Priya Sharma",
  "timestamp": "14/01/2026, 06:42:19 IST",
  "enrollmentId": "TMA20261234"
}
```

The Apps Script response includes a `tokenNumber` field that the app shows on the success screen.

The webhook also accepts reminder updates:

```json
{
  "action": "updateReminder",
  "enrollmentId": "TMA20261234",
  "reminderType": "day5"
}
```

## Security Considerations

- The webhook URL is public but requires knowing the exact URL
- Consider adding authentication if you need additional security
- The Apps Script runs with your Google account permissions
- Data is stored in your Google account, following Google's security practices

## Advanced Customization

### Adding More Fields

To capture additional form fields:

1. Add new columns to your Google Sheet
2. Update the Apps Script `rowData` array:
   ```javascript
   var rowData = [
     data.name || '',
     data.email || '',
     data.mobile || '',
     data.mode || '',
     data.batch_month || '',
     data.time_slot || '',
     data.payment_mode || '',
     data.counselor || '',
     data.newField || '',  // Add your new field
     data.timestamp || new Date().toISOString(),
     data.enrollmentId || ''
   ];
   ```
3. Update `src/utils/googleSheetsService.ts` to include the new field in the payload

## Counselor List via Google Sheet (Optional)

If counselor names change often, you can load them from a separate Google Sheet.

### 1. Create a Counselor Sheet

Create a new Google Sheet with these headers:

```
id | name | specialization | active
```

- `active` can be `true/false`, `yes/no`, or `1/0`

### 2. Publish as CSV

Publish the sheet to the web and copy the CSV URL:
```
https://docs.google.com/spreadsheets/d/XXXXXXX/export?format=csv
```

### 3. Configure the App

Add this to `.env`:
```
COUNSELORS_SHEET_CSV_URL=your-counselor-sheet-csv-url
```

The enrollment form will use the sheet list and automatically update without a deploy.

## Enrollment Sheet CSV (Reminders)

To enable automatic reminder scheduling, publish your **Enrollment Data** sheet as CSV and set:

```
ENROLLMENTS_SHEET_CSV_URL=your-enrollment-sheet-csv-url
```

You can use the same publish flow as the counselor sheet, but select the enrollment sheet tab.

### Email Notifications

Add this to your Apps Script to send email notifications:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // ... existing code ...
    
    // Send email notification
    MailApp.sendEmail({
      to: 'admin@trademaxacademy.com',
      subject: 'New Enrollment: ' + data.name,
      body: 'New enrollment received:\n\n' +
            'Name: ' + data.name + '\n' +
            'Email: ' + data.email + '\n' +
            'Mobile: ' + data.mobile + '\n' +
            'Mode: ' + data.mode + '\n' +
            'Batch Month: ' + data.batch_month + '\n' +
            'Time Slot: ' + data.time_slot + '\n' +
            'Payment Mode: ' + data.payment_mode + '\n' +
            'Counselor: ' + data.counselor
    });
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Data saved and notification sent' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your Apps Script deployment settings
3. Review the browser console for detailed error messages
4. Check Apps Script execution logs

For more information about Google Apps Script, visit:
https://developers.google.com/apps-script
