// ========================================
// GradeCalc India - Main Application Logic
// ========================================

// ---- Theme Management ----
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  updateThemeIcon();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
}

// ---- Mobile Menu ----
function toggleMenu() {
  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.toggle('open');
}

// ---- Toast Notifications ----
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- University Selector ----
function populateUniversitySelect(selectId, callback) {
  const select = document.getElementById(selectId);
  if (!select) return;

  // Clear existing
  select.innerHTML = '';

  // Group universities
  const popular = ['cbcs_ugc', 'vtu', 'anna', 'jntuh', 'mumbai', 'sppu', 'aktu'];
  const others = Object.keys(UNIVERSITIES).filter(k => !popular.includes(k) && k !== 'generic_10' && k !== 'generic_4');

  // Add generic options first
  const genericGroup = document.createElement('optgroup');
  genericGroup.label = 'General';
  ['generic_10', 'cbcs_ugc', 'generic_4'].forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = UNIVERSITIES[key].name;
    genericGroup.appendChild(opt);
  });
  select.appendChild(genericGroup);

  // Popular universities
  const popularGroup = document.createElement('optgroup');
  popularGroup.label = 'Popular Universities';
  popular.filter(k => k !== 'cbcs_ugc').forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = UNIVERSITIES[key].name;
    popularGroup.appendChild(opt);
  });
  select.appendChild(popularGroup);

  // Other universities
  const otherGroup = document.createElement('optgroup');
  otherGroup.label = 'Other Universities';
  others.forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = UNIVERSITIES[key].name;
    otherGroup.appendChild(opt);
  });
  select.appendChild(otherGroup);

  // Load saved preference
  const saved = localStorage.getItem('selectedUniversity');
  if (saved && UNIVERSITIES[saved]) {
    select.value = saved;
  }

  // Add change handler
  select.addEventListener('change', () => {
    localStorage.setItem('selectedUniversity', select.value);
    if (callback) callback(select.value);
  });

  // Trigger initial callback
  if (callback) callback(select.value);
}

// ---- Grade Reference Display ----
function showGradeReference(containerId, uniKey) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const uni = UNIVERSITIES[uniKey];
  let html = '<div class="grade-ref">';
  uni.grades.forEach(g => {
    html += `
      <div class="grade-chip">
        <div class="grade-letter">${g.letter}</div>
        <div class="grade-point">${g.point} pts</div>
      </div>`;
  });
  html += '</div>';
  html += `<div class="info-box mt-1"><strong>Formula:</strong> ${uni.formula}</div>`;
  container.innerHTML = html;
}

// ---- Populate Grade Dropdowns ----
function populateGradeSelect(select, uniKey) {
  const uni = UNIVERSITIES[uniKey];
  select.innerHTML = '<option value="">-- Grade --</option>';
  uni.grades.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g.point;
    opt.textContent = `${g.letter} (${g.point})`;
    select.appendChild(opt);
  });
}

// ---- SGPA Calculator ----
let sgpaSubjects = [];

function initSGPA() {
  populateUniversitySelect('uniSelect', (uniKey) => {
    showGradeReference('gradeRef', uniKey);
    updateAllGradeDropdowns(uniKey);
  });

  // Add initial subjects
  for (let i = 0; i < 6; i++) addSubject();
}

function addSubject() {
  const id = Date.now() + Math.random();
  sgpaSubjects.push(id);
  renderSubjectTable();
}

function removeSubject(id) {
  if (sgpaSubjects.length <= 1) {
    showToast('At least one subject is required', 'error');
    return;
  }
  sgpaSubjects = sgpaSubjects.filter(s => s !== id);
  renderSubjectTable();
}

function renderSubjectTable() {
  const tbody = document.getElementById('subjectBody');
  if (!tbody) return;

  const uniKey = document.getElementById('uniSelect')?.value || 'generic_10';
  const uni = UNIVERSITIES[uniKey];

  // Save existing values
  const existingValues = {};
  tbody.querySelectorAll('tr').forEach(row => {
    const id = row.dataset.id;
    existingValues[id] = {
      name: row.querySelector('.subject-name')?.value || '',
      credit: row.querySelector('.subject-credit')?.value || '',
      grade: row.querySelector('.subject-grade')?.value || ''
    };
  });

  let html = '';
  sgpaSubjects.forEach((id, index) => {
    const saved = existingValues[id] || {};
    let gradeOptions = '<option value="">-- Grade --</option>';
    uni.grades.forEach(g => {
      const selected = saved.grade == g.point ? 'selected' : '';
      gradeOptions += `<option value="${g.point}" ${selected}>${g.letter} (${g.point})</option>`;
    });

    html += `
      <tr data-id="${id}">
        <td class="sno">${index + 1}</td>
        <td class="subject-name-col"><input type="text" class="subject-name" placeholder="Subject name" value="${saved.name || ''}"></td>
        <td class="credit-col"><input type="number" class="subject-credit" placeholder="Credits" min="1" max="20" value="${saved.credit || ''}"></td>
        <td class="grade-col"><select class="subject-grade">${gradeOptions}</select></td>
        <td class="action-col"><button class="btn btn-danger" onclick="removeSubject(${id})" title="Remove">&times;</button></td>
      </tr>`;
  });
  tbody.innerHTML = html;
}

function updateAllGradeDropdowns(uniKey) {
  renderSubjectTable();
}

function calculateSGPA() {
  const tbody = document.getElementById('subjectBody');
  const rows = tbody.querySelectorAll('tr');
  const uniKey = document.getElementById('uniSelect').value;
  const uni = UNIVERSITIES[uniKey];

  let totalCredits = 0;
  let totalPoints = 0;
  let hasError = false;
  let subjectCount = 0;

  rows.forEach(row => {
    const credit = parseFloat(row.querySelector('.subject-credit')?.value);
    const grade = parseFloat(row.querySelector('.subject-grade')?.value);

    if (isNaN(credit) || isNaN(grade)) {
      hasError = true;
      return;
    }

    if (credit <= 0) {
      hasError = true;
      return;
    }

    totalCredits += credit;
    totalPoints += credit * grade;
    subjectCount++;
  });

  if (hasError || subjectCount === 0) {
    showToast('Please fill in all credits and grades for each subject.', 'error');
    return;
  }

  const sgpa = totalPoints / totalCredits;
  const maxPoint = getMaxGradePoint(uniKey);
  const classification = getGradeClassification(sgpa, maxPoint);
  const percentage = uni.cgpaToPercentage(sgpa);

  // Display result
  const panel = document.getElementById('sgpaResult');
  panel.classList.add('visible');

  document.getElementById('sgpaValue').textContent = sgpa.toFixed(2);
  document.getElementById('sgpaClassification').textContent = classification.class;
  document.getElementById('sgpaPercentage').textContent = percentage.toFixed(2) + '%';
  document.getElementById('sgpaTotalCredits').textContent = totalCredits;
  document.getElementById('sgpaSubjectCount').textContent = subjectCount;

  // Scroll to result
  panel.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Save to history
  saveToHistory('sgpa', {
    university: uni.name,
    sgpa: sgpa.toFixed(2),
    percentage: percentage.toFixed(2),
    totalCredits,
    subjectCount,
    date: new Date().toLocaleDateString()
  });

  showToast('SGPA calculated successfully!');

  // Trigger confetti for great scores!
  if (sgpa >= maxPoint * 0.85) {
    triggerConfetti();
  }
}

function resetSGPA() {
  sgpaSubjects = [];
  for (let i = 0; i < 6; i++) addSubject();
  const panel = document.getElementById('sgpaResult');
  if (panel) panel.classList.remove('visible');
  showToast('Calculator reset!');
}

// ---- CGPA Calculator ----
let cgpaSemesters = [];

function initCGPA() {
  populateUniversitySelect('uniSelectCGPA', (uniKey) => {
    showGradeReference('gradeRefCGPA', uniKey);
  });

  for (let i = 0; i < 4; i++) addSemester();
}

function addSemester() {
  const id = Date.now() + Math.random();
  cgpaSemesters.push(id);
  renderSemesterRows();
}

function removeSemester(id) {
  if (cgpaSemesters.length <= 1) {
    showToast('At least one semester is required', 'error');
    return;
  }
  cgpaSemesters = cgpaSemesters.filter(s => s !== id);
  renderSemesterRows();
}

function renderSemesterRows() {
  const container = document.getElementById('semesterContainer');
  if (!container) return;

  // Save existing values
  const existingValues = {};
  container.querySelectorAll('.semester-row').forEach(row => {
    const id = row.dataset.id;
    existingValues[id] = {
      sgpa: row.querySelector('.sem-sgpa')?.value || '',
      credits: row.querySelector('.sem-credits')?.value || ''
    };
  });

  let html = '';
  cgpaSemesters.forEach((id, index) => {
    const saved = existingValues[id] || {};
    html += `
      <div class="semester-row" data-id="${id}">
        <div class="semester-num">${index + 1}</div>
        <div>
          <input type="number" class="form-input sem-sgpa" placeholder="SGPA" min="0" max="10" step="0.01" value="${saved.sgpa || ''}">
        </div>
        <div>
          <input type="number" class="form-input sem-credits" placeholder="Total Credits" min="1" max="50" value="${saved.credits || ''}">
        </div>
        <div>
          <button class="btn btn-danger" onclick="removeSemester(${id})" title="Remove">&times;</button>
        </div>
      </div>`;
  });
  container.innerHTML = html;
}

function calculateCGPA() {
  const container = document.getElementById('semesterContainer');
  const rows = container.querySelectorAll('.semester-row');
  const uniKey = document.getElementById('uniSelectCGPA').value;
  const uni = UNIVERSITIES[uniKey];

  let totalWeightedPoints = 0;
  let totalCredits = 0;
  let semesterCount = 0;
  let hasError = false;

  const labels = [];
  const chartData = [];

  rows.forEach((row, index) => {
    const sgpa = parseFloat(row.querySelector('.sem-sgpa')?.value);
    const credits = parseFloat(row.querySelector('.sem-credits')?.value);

    if (isNaN(sgpa) || isNaN(credits)) {
      hasError = true;
      return;
    }

    const maxPoint = getMaxGradePoint(uniKey);
    if (sgpa < 0 || sgpa > maxPoint) {
      hasError = true;
      return;
    }

    labels.push(`Sem ${index + 1}`);
    chartData.push(sgpa);

    totalWeightedPoints += sgpa * credits;
    totalCredits += credits;
    semesterCount++;
  });

  if (hasError || semesterCount === 0) {
    showToast('Please fill in all SGPA and credit values correctly.', 'error');
    return;
  }

  const cgpa = totalWeightedPoints / totalCredits;
  const maxPoint = getMaxGradePoint(uniKey);
  const classification = getGradeClassification(cgpa, maxPoint);
  const percentage = uni.cgpaToPercentage(cgpa);

  // Display
  const panel = document.getElementById('cgpaResult');
  panel.classList.add('visible');

  document.getElementById('cgpaValue').textContent = cgpa.toFixed(2);
  document.getElementById('cgpaClassification').textContent = classification.class;
  document.getElementById('cgpaPercentage').textContent = percentage.toFixed(2) + '%';
  document.getElementById('cgpaTotalCredits').textContent = totalCredits;
  document.getElementById('cgpaSemesterCount').textContent = semesterCount;

  panel.scrollIntoView({ behavior: 'smooth', block: 'center' });

  saveToHistory('cgpa', {
    university: uni.name,
    cgpa: cgpa.toFixed(2),
    percentage: percentage.toFixed(2),
    totalCredits,
    semesterCount,
    date: new Date().toLocaleDateString()
  });

  if (typeof renderCGPAChart === 'function') {
    renderCGPAChart(labels, chartData, maxPoint);
  }

  showToast('CGPA calculated successfully!');

  // Trigger confetti for great scores!
  if (cgpa >= maxPoint * 0.85) {
    triggerConfetti();
  }
}

function resetCGPA() {
  cgpaSemesters = [];
  for (let i = 0; i < 4; i++) addSemester();
  const panel = document.getElementById('cgpaResult');
  if (panel) panel.classList.remove('visible');
  showToast('Calculator reset!');
}

// ---- Converter ----
function initConverter() {
  populateUniversitySelect('uniSelectConv', (uniKey) => {
    showGradeReference('gradeRefConv', uniKey);
    clearConverterResults();
  });
}

function convertCGPAToPercentage() {
  const uniKey = document.getElementById('uniSelectConv').value;
  const uni = UNIVERSITIES[uniKey];
  const cgpa = parseFloat(document.getElementById('inputCGPA').value);

  const maxPoint = getMaxGradePoint(uniKey);
  if (isNaN(cgpa) || cgpa < 0 || cgpa > maxPoint) {
    showToast(`Please enter a valid CGPA (0 to ${maxPoint})`, 'error');
    return;
  }

  const percentage = uni.cgpaToPercentage(cgpa);
  const classification = getGradeClassification(cgpa, maxPoint);

  const resultDiv = document.getElementById('convResult1');
  resultDiv.innerHTML = `
    <div class="result-panel visible" style="margin:0">
      <div class="result-label">Your Percentage</div>
      <div class="result-value">${percentage.toFixed(2)}%</div>
      <div class="result-sublabel">${classification.class} | ${uni.shortName}</div>
      <div class="result-sublabel mt-1" style="opacity:0.7">${uni.formula}</div>
    </div>`;

  showToast('Converted successfully!');
}

function convertPercentageToGPA() {
  const uniKey = document.getElementById('uniSelectConv').value;
  const uni = UNIVERSITIES[uniKey];
  const pct = parseFloat(document.getElementById('inputPercentage').value);

  if (isNaN(pct) || pct < 0 || pct > 100) {
    showToast('Please enter a valid percentage (0 to 100)', 'error');
    return;
  }

  const cgpa = uni.percentageToCgpa(pct);
  const maxPoint = getMaxGradePoint(uniKey);
  const classification = getGradeClassification(cgpa, maxPoint);

  const resultDiv = document.getElementById('convResult2');
  resultDiv.innerHTML = `
    <div class="result-panel visible" style="margin:0">
      <div class="result-label">Your CGPA</div>
      <div class="result-value">${cgpa.toFixed(2)}</div>
      <div class="result-sublabel">${classification.class} | ${uni.shortName}</div>
      <div class="result-sublabel mt-1" style="opacity:0.7">${uni.formula}</div>
    </div>`;

  showToast('Converted successfully!');
}

function clearConverterResults() {
  const r1 = document.getElementById('convResult1');
  const r2 = document.getElementById('convResult2');
  if (r1) r1.innerHTML = '';
  if (r2) r2.innerHTML = '';
}

// ---- Target CGPA Calculator ----
function initTarget() {
  populateUniversitySelect('uniSelectTarget', (uniKey) => {
    showGradeReference('gradeRefTarget', uniKey);
  });
}

function calculateTarget() {
  const uniKey = document.getElementById('uniSelectTarget').value;
  const uni = UNIVERSITIES[uniKey];
  const maxPoint = getMaxGradePoint(uniKey);

  const currentCGPA = parseFloat(document.getElementById('currentCGPA').value);
  const completedCredits = parseFloat(document.getElementById('completedCredits').value);
  const targetCGPA = parseFloat(document.getElementById('targetCGPA').value);
  const nextCredits = parseFloat(document.getElementById('nextCredits').value);

  // Validation
  if (isNaN(currentCGPA) || currentCGPA < 0 || currentCGPA > maxPoint) {
    showToast(`Enter valid current CGPA (0 to ${maxPoint})`, 'error');
    return;
  }
  if (isNaN(completedCredits) || completedCredits <= 0) {
    showToast('Enter valid completed credits', 'error');
    return;
  }
  if (isNaN(targetCGPA) || targetCGPA < 0 || targetCGPA > maxPoint) {
    showToast(`Enter valid target CGPA (0 to ${maxPoint})`, 'error');
    return;
  }
  if (isNaN(nextCredits) || nextCredits <= 0) {
    showToast('Enter valid next semester credits', 'error');
    return;
  }

  // Calculate required SGPA
  const totalPointsNeeded = targetCGPA * (completedCredits + nextCredits);
  const currentPoints = currentCGPA * completedCredits;
  const requiredSGPA = (totalPointsNeeded - currentPoints) / nextCredits;

  const panel = document.getElementById('targetResult');
  panel.classList.add('visible');

  if (requiredSGPA > maxPoint) {
    document.getElementById('targetValue').textContent = 'N/A';
    document.getElementById('targetMessage').textContent = `Not achievable! Required SGPA (${requiredSGPA.toFixed(2)}) exceeds maximum (${maxPoint}).`;
    document.getElementById('targetMessage').style.opacity = '1';
    document.getElementById('targetDetails').innerHTML = `
      <div class="result-detail-item">
        <div class="value">${requiredSGPA.toFixed(2)}</div>
        <div class="label">Required SGPA</div>
      </div>
      <div class="result-detail-item">
        <div class="value">${maxPoint}</div>
        <div class="label">Max Possible</div>
      </div>
      <div class="result-detail-item">
        <div class="value">${(requiredSGPA - maxPoint).toFixed(2)}</div>
        <div class="label">Gap</div>
      </div>
    `;
    showToast('Target is not achievable with current parameters', 'error');
  } else if (requiredSGPA < 0) {
    document.getElementById('targetValue').textContent = '0.00';
    document.getElementById('targetMessage').textContent = 'You have already surpassed your target CGPA!';
    document.getElementById('targetMessage').style.opacity = '1';
    document.getElementById('targetDetails').innerHTML = '';
    showToast('You already exceeded your target!');
  } else {
    const classification = getGradeClassification(requiredSGPA, maxPoint);
    const difficulty = requiredSGPA > maxPoint * 0.9 ? 'Very Hard' :
                       requiredSGPA > maxPoint * 0.7 ? 'Challenging' :
                       requiredSGPA > maxPoint * 0.5 ? 'Moderate' : 'Easy';

    document.getElementById('targetValue').textContent = requiredSGPA.toFixed(2);
    document.getElementById('targetMessage').textContent = `You need ${requiredSGPA.toFixed(2)} SGPA in next semester (${difficulty})`;
    document.getElementById('targetMessage').style.opacity = '1';
    document.getElementById('targetDetails').innerHTML = `
      <div class="result-detail-item">
        <div class="value">${difficulty}</div>
        <div class="label">Difficulty</div>
      </div>
      <div class="result-detail-item">
        <div class="value">${uni.cgpaToPercentage(targetCGPA).toFixed(1)}%</div>
        <div class="label">Target %</div>
      </div>
      <div class="result-detail-item">
        <div class="value">${(completedCredits + nextCredits)}</div>
        <div class="label">Total Credits</div>
      </div>
    `;
    showToast('Target calculated!');
  }

  panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetTarget() {
  document.getElementById('currentCGPA').value = '';
  document.getElementById('completedCredits').value = '';
  document.getElementById('targetCGPA').value = '';
  document.getElementById('nextCredits').value = '';
  const panel = document.getElementById('targetResult');
  if (panel) panel.classList.remove('visible');
  showToast('Calculator reset!');
}

// ---- History / Save ----
function saveToHistory(type, data) {
  try {
    let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    history.unshift({ type, ...data, timestamp: Date.now() });
    if (history.length > 20) history = history.slice(0, 20);
    localStorage.setItem('calcHistory', JSON.stringify(history));
  } catch (e) {
    // Silently fail
  }
}

// ---- History UI & Modal ----
function injectHistoryUI() {
  const headerActions = document.querySelector('.header-actions');
  if (headerActions) {
    const historyBtn = document.createElement('button');
    historyBtn.className = 'history-toggle';
    historyBtn.innerHTML = '&#128338;'; // Clock icon
    historyBtn.title = 'View Recent Calculations';
    historyBtn.onclick = toggleHistory;
    headerActions.insertBefore(historyBtn, headerActions.firstChild);
  }

  const modalHTML = `
    <div id="historyModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--text);">Saved Calculations</h3>
          <button class="modal-close" onclick="toggleHistory()">&times;</button>
        </div>
        <div class="modal-body" id="historyList"></div>
        <div class="modal-footer" style="text-align: right; padding-top: 10px;">
          <button class="btn btn-secondary btn-sm" onclick="clearHistory()">Clear History</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function toggleHistory() {
  const modal = document.getElementById('historyModal');
  if (modal) {
    modal.classList.toggle('show');
    if (modal.classList.contains('show')) {
      renderHistory();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

function renderHistory() {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;

  let history = [];
  try { history = JSON.parse(localStorage.getItem('calcHistory') || '[]'); } catch(e) {}

  if (history.length === 0) {
    historyList.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-muted);">No recent calculations found.</div>';
    return;
  }

  let html = '';
  history.forEach(item => {
    const isSgpa = item.type === 'sgpa';
    const tagColor = isSgpa ? 'var(--primary)' : 'var(--secondary)';
    const tagBg = isSgpa ? 'var(--primary-light)' : 'var(--bg-input)';
    const val = isSgpa ? item.sgpa : item.cgpa;
    
    html += `
      <div class="history-item">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <div>
            <span style="background: ${tagBg}; color: ${tagColor}; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
              ${item.type}
            </span>
            <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">${item.date}</span>
          </div>
          <div style="font-size: 1.2rem; font-weight: 800; color: var(--text);">${val}</div>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          <strong>${item.university}</strong> &bull; ${item.percentage}% &bull; ${item.totalCredits} Credits
        </div>
      </div>
    `;
  });
  
  historyList.innerHTML = html;
}

function clearHistory() {
  localStorage.removeItem('calcHistory');
  renderHistory();
  showToast('History cleared');
}

// ---- Print Result ----
function printResult() {
  window.print();
}

// ---- Share Result ----
function shareResult(type) {
  let text = '';
  if (type === 'sgpa') {
    const val = document.getElementById('sgpaValue')?.textContent;
    const pct = document.getElementById('sgpaPercentage')?.textContent;
    text = `My SGPA: ${val} (${pct}) - Calculated on GradeCalc India`;
  } else if (type === 'cgpa') {
    const val = document.getElementById('cgpaValue')?.textContent;
    const pct = document.getElementById('cgpaPercentage')?.textContent;
    text = `My CGPA: ${val} (${pct}) - Calculated on GradeCalc India`;
  }

  if (navigator.share) {
    navigator.share({ title: 'My Grade Result', text: text }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Result copied to clipboard!');
    });
  }
}

// ---- Confetti Effect ----
function triggerConfetti() {
  if (typeof confetti === 'function') {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4f46e5', '#0ea5e9', '#d946ef', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4f46e5', '#0ea5e9', '#d946ef', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}

// ---- Chart Rendering ----
let cgpaChartInstance = null;
function renderCGPAChart(labels, data, maxPoint) {
  const ctx = document.getElementById('cgpaChart');
  if (!ctx || typeof Chart === 'undefined') return;

  if (cgpaChartInstance) {
    cgpaChartInstance.destroy();
  }

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';

  const card = document.getElementById('cgpaChartCard');
  if (card) card.style.display = 'block';

  cgpaChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'SGPA',
        data: data,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderWidth: 3,
        pointBackgroundColor: '#d946ef',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#fff',
          titleColor: isDark ? '#f1f5f9' : '#1e293b',
          bodyColor: isDark ? '#cbd5e1' : '#64748b',
          borderColor: isDark ? '#334155' : '#e2e8f0',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) { return `SGPA: ${context.parsed.y}`; }
          }
        }
      },
      scales: {
        y: { 
          beginAtZero: false, 
          min: Math.max(0, Math.floor(Math.min(...data) - 1)), 
          max: maxPoint,
          grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
          ticks: { color: textColor }
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor }
        }
      }
    }
  });
}

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  // Inject Confetti script dynamically
  const confettiScript = document.createElement('script');
  confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
  document.body.appendChild(confettiScript);

  // Inject History UI
  injectHistoryUI();

  // Register PropellerAds Service Worker for push notifications
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.log('SW registration successful with scope: ', registration.scope);
      }, function(err) {
        console.log('SW registration failed: ', err);
      });
    });
  }
});
