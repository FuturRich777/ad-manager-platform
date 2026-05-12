export default function handler(req, res) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Form Submissions</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: #f5f5f5; color: #333; }
    .header { background: #1F4D3F; color: white; padding: 24px; text-align: center; }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .container { max-width: 1200px; margin: 24px auto; padding: 0 16px; }
    .toolbar { background: white; padding: 16px; border-radius: 8px; margin-bottom: 24px; display: flex; gap: 12px; flex-wrap: wrap; }
    .toolbar button { background: #1F4D3F; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; }
    .toolbar button:hover { background: #153a2e; }
    .toolbar input { padding: 10px 16px; border: 1px solid #ddd; border-radius: 4px; flex: 1; min-width: 200px; }
    .submissions-grid { display: grid; gap: 20px; }
    .submission-card { background: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .submission-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #eee; }
    .submission-title { font-size: 18px; font-weight: 600; color: #1F4D3F; }
    .submission-date { font-size: 12px; color: #999; }
    .submission-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
    .field { display: grid; gap: 4px; }
    .field-label { font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; }
    .field-value { font-size: 14px; color: #333; word-break: break-word; }
    .empty-state { text-align: center; padding: 48px 24px; background: white; border-radius: 8px; }
    .empty-state p { color: #999; font-size: 16px; }
    .stats { background: white; padding: 16px; border-radius: 8px; margin-bottom: 24px; display: flex; gap: 24px; }
    .stat { text-align: center; }
    .stat-number { font-size: 28px; font-weight: 600; color: #1F4D3F; }
    .stat-label { font-size: 12px; color: #999; margin-top: 4px; }
    .loading { text-align: center; padding: 24px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📋 Form Submissions</h1>
    <p>View all client intake form submissions</p>
  </div>
  <div class="container">
    <div class="stats">
      <div class="stat">
        <div class="stat-number" id="totalCount">0</div>
        <div class="stat-label">Total Submissions</div>
      </div>
      <div class="stat">
        <div class="stat-number" id="todayCount">0</div>
        <div class="stat-label">Today</div>
      </div>
    </div>
    <div class="toolbar">
      <input type="text" id="searchInput" placeholder="Search by name, email, or business...">
      <button onclick="loadSubmissions()">🔄 Refresh</button>
      <button onclick="exportCSV()">📥 Export CSV</button>
    </div>
    <div id="submissionsContainer" class="submissions-grid">
      <div class="loading">Loading submissions...</div>
    </div>
  </div>
  <script>
    let allSubmissions = [];
    async function loadSubmissions() {
      try {
        const response = await fetch('/api/submit-form');
        allSubmissions = await response.json();
        renderSubmissions(allSubmissions);
        updateStats();
      } catch (error) {
        console.error('Error loading submissions:', error);
        document.getElementById('submissionsContainer').innerHTML = '<div class="empty-state"><p>Error loading submissions</p></div>';
      }
    }
    function renderSubmissions(submissions) {
      const container = document.getElementById('submissionsContainer');
      if (submissions.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No submissions yet</p></div>';
        return;
      }
      container.innerHTML = submissions.map(sub => {
        const date = new Date(sub.created_at);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        return \`<div class="submission-card"><div class="submission-header"><div><div class="submission-title">\${sub.business_name || 'N/A'}</div><div class="submission-date">\${dateStr}</div></div></div><div class="submission-grid">\${sub.full_name ? \`<div class="field"><div class="field-label">Full Name</div><div class="field-value">\${sub.full_name}</div></div>\` : ''}\${sub.email ? \`<div class="field"><div class="field-label">Email</div><div class="field-value">\${sub.email}</div></div>\` : ''}\${sub.phone ? \`<div class="field"><div class="field-label">Phone</div><div class="field-value">\${sub.phone}</div></div>\` : ''}\${sub.website ? \`<div class="field"><div class="field-label">Website</div><div class="field-value">\${sub.website}</div></div>\` : ''}\${sub.service_area ? \`<div class="field"><div class="field-label">Service Area</div><div class="field-value">\${sub.service_area}</div></div>\` : ''}\${sub.content_purpose ? \`<div class="field"><div class="field-label">Content Purpose</div><div class="field-value">\${sub.content_purpose}</div></div>\` : ''}\${sub.ad_budget ? \`<div class="field"><div class="field-label">Ad Budget</div><div class="field-value">\${sub.ad_budget}</div></div>\` : ''}\${sub.goals_30_90 ? \`<div class="field"><div class="field-label">30-90 Day Goals</div><div class="field-value">\${sub.goals_30_90}</div></div>\` : ''}\${sub.offers ? \`<div class="field"><div class="field-label">Main Offers</div><div class="field-value">\${sub.offers}</div></div>\` : ''}\${sub.ideal_customer ? \`<div class="field"><div class="field-label">Ideal Customer</div><div class="field-value">\${sub.ideal_customer}</div></div>\` : ''}</div></div>\`;
      }).join('');
    }
    function updateStats() {
      const today = new Date().toDateString();
      const todayCount = allSubmissions.filter(s => new Date(s.created_at).toDateString() === today).length;
      document.getElementById('totalCount').textContent = allSubmissions.length;
      document.getElementById('todayCount').textContent = todayCount;
    }
    function filterSubmissions() {
      const search = document.getElementById('searchInput').value.toLowerCase();
      const filtered = allSubmissions.filter(s => { const text = JSON.stringify(s).toLowerCase(); return text.includes(search); });
      renderSubmissions(filtered);
    }
    function exportCSV() {
      if (allSubmissions.length === 0) { alert('No submissions to export'); return; }
      const headers = Object.keys(allSubmissions[0]);
      const csv = [headers.join(','), ...allSubmissions.map(row => headers.map(h => { const val = row[h]; const escaped = (val || '').toString().replace(/"/g, '""'); return \`"\${escaped}"\`; }).join(','))].join('\\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`submissions-\${new Date().toISOString().split('T')[0]}.csv\`;
      a.click();
    }
    document.getElementById('searchInput').addEventListener('input', filterSubmissions);
    loadSubmissions();
    setInterval(loadSubmissions, 5000);
  </script>
</body>
</html>\`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
