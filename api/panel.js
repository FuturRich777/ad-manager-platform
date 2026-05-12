module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - Form Submissions</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; color: #333; }
    .login-screen { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #1F4D3F 0%, #2d6a52 100%); }
    .login-box { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); width: 100%; max-width: 400px; }
    .login-box h1 { color: #1F4D3F; margin-bottom: 30px; text-align: center; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; }
    .form-group input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
    .form-group input:focus { outline: none; border-color: #1F4D3F; box-shadow: 0 0 0 3px rgba(31, 77, 63, 0.1); }
    .login-button { width: 100%; padding: 12px; background: #1F4D3F; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 16px; }
    .login-button:hover { background: #163d32; }
    .error { color: #d32f2f; font-size: 14px; margin-top: 10px; }
    .dashboard { display: none; }
    .header { background: #1F4D3F; color: white; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-size: 24px; }
    .logout-btn { background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; }
    .logout-btn:hover { background: rgba(255,255,255,0.3); }
    .container { max-width: 1200px; margin: 30px auto; padding: 0 20px; }
    .submissions-grid { display: grid; gap: 20px; }
    .submission-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; border-left: 4px solid #1F4D3F; }
    .submission-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
    .submission-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
    .submission-header h3 { color: #1F4D3F; font-size: 18px; }
    .submission-date { color: #999; font-size: 12px; }
    .submission-detail { color: #666; font-size: 14px; margin-top: 5px; }
    .modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 1000; }
    .modal.active { display: flex; }
    .modal-content { background: white; padding: 40px; border-radius: 8px; max-width: 900px; width: 90%; max-height: 90vh; overflow-y: auto; position: relative; }
    .modal-close { position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #999; }
    .modal-close:hover { color: #333; }
    .modal h2 { color: #1F4D3F; margin-bottom: 20px; border-bottom: 2px solid #1F4D3F; padding-bottom: 10px; }
    .form-field { margin-bottom: 20px; }
    .form-field label { font-weight: 600; color: #1F4D3F; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
    .form-field-value { background: #f9f9f9; padding: 12px; border-left: 3px solid #1F4D3F; border-radius: 2px; color: #555; }
    .pdf-button { background: #1F4D3F; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600; margin-top: 20px; }
    .pdf-button:hover { background: #163d32; }
    .loading { text-align: center; padding: 40px; color: #999; }
    .no-submissions { text-align: center; padding: 40px; color: #999; }
  </style>
</head>
<body>
  <div id="loginScreen" class="login-screen">
    <div class="login-box">
      <h1>Admin Dashboard</h1>
      <form id="loginForm">
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="password" required placeholder="Enter admin password">
        </div>
        <button type="submit" class="login-button">Login</button>
        <div id="loginError" class="error"></div>
      </form>
    </div>
  </div>

  <div id="dashboard" class="dashboard">
    <div class="header">
      <h1>Form Submissions</h1>
      <button class="logout-btn" onclick="logout()">Logout</button>
    </div>
    <div class="container">
      <div id="submissionsList" class="submissions-grid">
        <div class="loading">Loading submissions...</div>
      </div>
    </div>
  </div>

  <div id="submissionModal" class="modal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal()">&times;</button>
      <h2>Submission Details</h2>
      <div id="submissionDetails"></div>
      <button class="pdf-button" onclick="downloadPDF()">Download as PDF</button>
    </div>
  </div>

  <script>
    const SUPABASE_URL = 'https://lmgqwgjdzrmufadfxezs.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZ3F3Z2pkenJtdWZhZGZ4ZXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTY0NTIsImV4cCI6MjA5Mjg5MjQ1Mn0.blobh-NlDrT4uggvs-sg6pc8GB5KNk_eC2ooT_p03PU';
    const ADMIN_PASSWORD = 'minexmedia2024';
    let currentSubmission = null;

    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const password = document.getElementById('password').value;
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminAuthenticated', 'true');
        showDashboard();
        loadSubmissions();
      } else {
        document.getElementById('loginError').textContent = 'Invalid password';
      }
    });

    function showDashboard() {
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
    }

    function logout() {
      localStorage.removeItem('adminAuthenticated');
      location.reload();
    }

    async function loadSubmissions() {
      try {
        const response = await fetch(\`\${SUPABASE_URL}/rest/v1/submissions?order=created_at.desc\`, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': \`Bearer \${SUPABASE_KEY}\`
          }
        });

        if (!response.ok) throw new Error('Failed to load submissions');
        const submissions = await response.json();

        if (submissions.length === 0) {
          document.getElementById('submissionsList').innerHTML = '<div class="no-submissions">No submissions yet</div>';
          return;
        }

        document.getElementById('submissionsList').innerHTML = submissions.map(sub => \`
          <div class="submission-card" onclick="viewSubmission(\${sub.id})">
            <div class="submission-header">
              <h3>\${sub.business_name || 'Unknown'}</h3>
              <span class="submission-date">\${new Date(sub.created_at).toLocaleDateString()}</span>
            </div>
            <div class="submission-detail"><strong>\${sub.full_name || 'N/A'}</strong></div>
            <div class="submission-detail">\${sub.email || 'N/A'}</div>
          </div>
        \`).join('');
      } catch (error) {
        console.error('Error loading submissions:', error);
        document.getElementById('submissionsList').innerHTML = '<div class="error">Failed to load submissions</div>';
      }
    }

    function viewSubmission(id) {
      fetch(\`\${SUPABASE_URL}/rest/v1/submissions?id=eq.\${id}\`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': \`Bearer \${SUPABASE_KEY}\`
        }
      }).then(r => r.json()).then(data => {
        currentSubmission = data[0];
        displaySubmissionModal();
        document.getElementById('submissionModal').classList.add('active');
      });
    }

    function displaySubmissionModal() {
      if (!currentSubmission) return;
      const fields = ['full_name', 'business_name', 'email', 'phone', 'website', 'service_area', 'social_links', 'content_purpose', 'goals_30_90', 'success_picture', 'offers', 'ideal_customer', 'differentiator', 'brand_words', 'inspiration', 'brand_colors_hex', 'visual_style', 'brand_assets_link', 'script_topics', 'off_limits', 'content_prefs', 'oncamera_level', 'filming_availability', 'ad_budget', 'relationship', 'anything_else'];
      const fieldLabels = {'full_name': 'Full Name', 'business_name': 'Business Name', 'email': 'Email', 'phone': 'Phone', 'website': 'Website', 'service_area': 'Service Area', 'social_links': 'Social Links', 'content_purpose': 'Content Purpose', 'goals_30_90': '30-90 Day Goals', 'success_picture': 'Success Picture', 'offers': 'Main Offers', 'ideal_customer': 'Ideal Customer', 'differentiator': 'Differentiator', 'brand_words': 'Brand Words', 'inspiration': 'Inspiration', 'brand_colors_hex': 'Brand Colors', 'visual_style': 'Visual Style', 'brand_assets_link': 'Brand Assets', 'script_topics': 'Script Topics', 'off_limits': 'Off Limits', 'content_prefs': 'Content Prefs', 'oncamera_level': 'On Camera Level', 'filming_availability': 'Filming Availability', 'ad_budget': 'Ad Budget', 'relationship': 'Relationship', 'anything_else': 'Anything Else'};
      let html = '';
      for (const field of fields) {
        if (currentSubmission[field]) {
          html += \`<div class="form-field"><label>\${fieldLabels[field] || field}</label><div class="form-field-value">\${currentSubmission[field]}</div></div>\`;
        }
      }
      document.getElementById('submissionDetails').innerHTML = html;
    }

    function closeModal() {
      document.getElementById('submissionModal').classList.remove('active');
    }

    function downloadPDF() {
      window.print();
    }

    window.addEventListener('load', function() {
      if (localStorage.getItem('adminAuthenticated') === 'true') {
        showDashboard();
        loadSubmissions();
      }
    });
  </script>
</body>
</html>`);
};
