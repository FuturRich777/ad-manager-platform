const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabaseUrl = 'https://lmgqwgjdzrmufadfxezs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZ3F3Z2pkenJtdWZhZGZ4ZXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTY0NTIsImV4cCI6MjA5Mjg5MjQ1Mn0.blobh-NlDrT4uggvs-sg6pc8GB5KNk_eC2ooT_p03PU';
const ADMIN_PASSWORD = 'minexmedia2024';

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - Form Submissions</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; color: #333; }
    .login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #1F4D3F 0%, #2d6a52 100%); }
    .login-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); width: 100%; max-width: 400px; }
    .login-box h1 { color: #1F4D3F; margin-bottom: 10px; text-align: center; font-size: 28px; }
    .login-box p { color: #666; text-align: center; margin-bottom: 30px; font-size: 14px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; }
    .form-group input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
    .form-group input:focus { outline: none; border-color: #1F4D3F; box-shadow: 0 0 0 3px rgba(31, 77, 63, 0.1); }
    .login-btn { width: 100%; padding: 12px; background: #1F4D3F; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 16px; }
    .login-btn:hover { background: #163d32; }
    .error { color: #d32f2f; font-size: 13px; margin-top: 10px; }

    .dashboard { display: none; }
    .header { background: #1F4D3F; color: white; padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header h1 { font-size: 24px; }
    .logout-btn { background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; }
    .logout-btn:hover { background: rgba(255,255,255,0.3); }

    .container { max-width: 1400px; margin: 30px auto; padding: 0 20px; }
    .toolbar { display: flex; gap: 15px; margin-bottom: 20px; align-items: center; }
    .search-box { flex: 1; }
    .search-box input { width: 100%; padding: 10px 15px; border: 1px solid #ddd; border-radius: 6px; }
    .export-btn, .refresh-btn { padding: 10px 20px; background: #1F4D3F; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .export-btn:hover, .refresh-btn:hover { background: #163d32; }

    .table-wrapper { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f5f5f5; padding: 15px; text-align: left; font-weight: 600; border-bottom: 2px solid #eee; }
    td { padding: 15px; border-bottom: 1px solid #eee; }
    tr:hover { background: #fafafa; }

    .submission-name { color: #1F4D3F; font-weight: 600; }
    .submission-date { color: #666; font-size: 13px; }
    .view-btn { padding: 6px 12px; background: #1F4D3F; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .view-btn:hover { background: #163d32; }

    .modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 1000; padding: 20px; }
    .modal.active { display: flex; }
    .modal-content { background: white; padding: 40px; border-radius: 8px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; }
    .modal-close { float: right; background: none; border: none; font-size: 24px; cursor: pointer; color: #999; }
    .modal h2 { color: #1F4D3F; margin-bottom: 20px; margin-top: 0; }

    .field-row { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
    .field-row:last-child { border-bottom: none; }
    .field-label { font-weight: 600; color: #1F4D3F; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
    .field-value { color: #555; }

    .loading { text-align: center; padding: 40px; color: #999; }
    .no-data { text-align: center; padding: 40px; color: #999; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stat-number { font-size: 32px; font-weight: bold; color: #1F4D3F; }
    .stat-label { color: #666; font-size: 14px; margin-top: 5px; }
  </style>
</head>
<body>
  <div id="loginContainer" class="login-container">
    <div class="login-box">
      <h1>Admin Dashboard</h1>
      <p>Form Submissions Management</p>
      <form id="loginForm">
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="password" required placeholder="Enter admin password">
        </div>
        <button type="submit" class="login-btn">Login</button>
        <div id="loginError" class="error"></div>
      </form>
    </div>
  </div>

  <div id="dashboard" class="dashboard">
    <div class="header">
      <h1>📋 Form Submissions</h1>
      <button class="logout-btn" onclick="logout()">Logout</button>
    </div>

    <div class="container">
      <div class="stats" id="stats"></div>

      <div class="toolbar">
        <div class="search-box">
          <input type="text" id="searchInput" placeholder="Search by name, email, or business...">
        </div>
        <button class="refresh-btn" onclick="loadSubmissions()">Refresh</button>
        <button class="export-btn" onclick="exportCSV()">Export CSV</button>
      </div>

      <div class="table-wrapper">
        <table id="submissionsTable">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="submissionsBody">
            <tr><td colspan="5" class="loading">Loading submissions...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div id="modal" class="modal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal()">&times;</button>
      <h2>Submission Details</h2>
      <div id="modalBody"></div>
    </div>
  </div>

  <script>
    const ADMIN_PASSWORD = 'minexmedia2024';
    let allSubmissions = [];
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
      document.getElementById('loginContainer').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
    }

    function logout() {
      localStorage.removeItem('adminAuthenticated');
      location.reload();
    }

    async function loadSubmissions() {
      try {
        const response = await fetch('/api/submissions');
        const data = await response.json();
        allSubmissions = data;
        renderSubmissions(data);
        updateStats(data);
      } catch (error) {
        console.error('Error loading submissions:', error);
        document.getElementById('submissionsBody').innerHTML = '<tr><td colspan="5" class="no-data">Failed to load submissions</td></tr>';
      }
    }

    function updateStats(submissions) {
      document.getElementById('stats').innerHTML = \`
        <div class="stat-card">
          <div class="stat-number">\${submissions.length}</div>
          <div class="stat-label">Total Submissions</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">\${new Date().toLocaleDateString()}</div>
          <div class="stat-label">Today's Date</div>
        </div>
      \`;
    }

    function renderSubmissions(submissions) {
      if (submissions.length === 0) {
        document.getElementById('submissionsBody').innerHTML = '<tr><td colspan="5" class="no-data">No submissions yet</td></tr>';
        return;
      }

      const html = submissions.map(sub => \`
        <tr>
          <td><strong>\${sub.business_name || 'N/A'}</strong></td>
          <td>\${sub.full_name || 'N/A'}</td>
          <td>\${sub.email || 'N/A'}</td>
          <td class="submission-date">\${new Date(sub.created_at).toLocaleDateString()} \${new Date(sub.created_at).toLocaleTimeString()}</td>
          <td><button class="view-btn" onclick="viewSubmission(\${sub.id})">View</button></td>
        </tr>
      \`).join('');

      document.getElementById('submissionsBody').innerHTML = html;
    }

    function viewSubmission(id) {
      const submission = allSubmissions.find(s => s.id === id);
      if (!submission) return;

      currentSubmission = submission;
      const fields = ['full_name', 'business_name', 'email', 'phone', 'website', 'service_area', 'social_links', 'content_purpose', 'goals_30_90', 'success_picture', 'offers', 'ideal_customer', 'differentiator', 'brand_words', 'inspiration', 'brand_colors_hex', 'visual_style', 'brand_assets_link', 'script_topics', 'off_limits', 'content_prefs', 'oncamera_level', 'filming_availability', 'ad_budget', 'relationship', 'anything_else'];
      const labels = {'full_name': 'Full Name', 'business_name': 'Business Name', 'email': 'Email', 'phone': 'Phone', 'website': 'Website', 'service_area': 'Service Area', 'social_links': 'Social Links', 'content_purpose': 'Content Purpose', 'goals_30_90': '30-90 Day Goals', 'success_picture': 'Success Picture', 'offers': 'Main Offers', 'ideal_customer': 'Ideal Customer', 'differentiator': 'Differentiator', 'brand_words': 'Brand Words', 'inspiration': 'Inspiration', 'brand_colors_hex': 'Brand Colors', 'visual_style': 'Visual Style', 'brand_assets_link': 'Brand Assets', 'script_topics': 'Script Topics', 'off_limits': 'Off Limits', 'content_prefs': 'Content Prefs', 'oncamera_level': 'On Camera Level', 'filming_availability': 'Filming Availability', 'ad_budget': 'Ad Budget', 'relationship': 'Relationship', 'anything_else': 'Anything Else'};

      let html = '';
      for (const field of fields) {
        if (submission[field]) {
          html += \`<div class="field-row"><div class="field-label">\${labels[field] || field}</div><div class="field-value">\${submission[field]}</div></div>\`;
        }
      }

      document.getElementById('modalBody').innerHTML = html;
      document.getElementById('modal').classList.add('active');
    }

    function closeModal() {
      document.getElementById('modal').classList.remove('active');
    }

    document.getElementById('searchInput').addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      const filtered = allSubmissions.filter(sub =>
        (sub.business_name || '').toLowerCase().includes(query) ||
        (sub.full_name || '').toLowerCase().includes(query) ||
        (sub.email || '').toLowerCase().includes(query)
      );
      renderSubmissions(filtered);
    });

    function exportCSV() {
      if (allSubmissions.length === 0) {
        alert('No submissions to export');
        return;
      }

      const keys = Object.keys(allSubmissions[0]);
      const csv = [keys.join(','), ...allSubmissions.map(row => keys.map(k => JSON.stringify(row[k] || '')).join(','))].join('\\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`submissions-\${new Date().toISOString().split('T')[0]}.csv\`;
      a.click();
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
});

app.get('/api/submissions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

app.listen(PORT, () => {
  console.log(`Dashboard running at http://localhost:${PORT}`);
});
