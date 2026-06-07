let expr = '';
let justCalc = false;

const resultEl = document.getElementById('result');
const exprEl = document.getElementById('expression');

function updateDisplay(val, exp = '') {
  resultEl.classList.remove('error');
  resultEl.textContent = val;
  exprEl.textContent = exp;
}

function inputNum(n) {
  if (justCalc) { expr = ''; justCalc = false; }
  if (expr.length >= 20) return;
  expr += n;
  updateDisplay(expr);
}

function inputOp(op) {
  justCalc = false;
  if (expr === '' && op !== '-') return;
  const lastChar = expr.slice(-1);
  if (['+', '-', '*', '/'].includes(lastChar)) {
    expr = expr.slice(0, -1);
  }
  expr += op;
  updateDisplay(expr);
}

function inputDot() {
  if (justCalc) { expr = '0'; justCalc = false; }
  const parts = expr.split(/[\+\-\*\/]/);
  const last = parts[parts.length - 1];
  if (last.includes('.')) return;
  if (last === '') expr += '0';
  expr += '.';
  updateDisplay(expr);
}

function backspace() {
  if (justCalc) { clearAll(); return; }
  expr = expr.slice(0, -1);
  updateDisplay(expr || '0');
}

function clearAll() {
  expr = '';
  justCalc = false;
  updateDisplay('0', '');
}

function percent() {
  if (!expr) return;
  try {
    const val = eval(expr) / 100;
    exprEl.textContent = expr + '%';
    expr = String(val);
    resultEl.textContent = val;
    justCalc = true;
  } catch { showError(); }
}

function calculate() {
  if (!expr) return;
  try {
    const safeExpr = expr.replace(/[^0-9+\-*/.()]/g, '');
    const ans = Function('"use strict"; return (' + safeExpr + ')')();
    if (!isFinite(ans)) { showError('Cannot ÷ by 0'); return; }
    exprEl.textContent = expr + ' =';
    const formatted = parseFloat(ans.toFixed(10));
    resultEl.textContent = formatted;
    expr = String(formatted);
    justCalc = true;
  } catch { showError(); }
}

function showError(msg = 'Error') {
  resultEl.classList.add('error');
  resultEl.textContent = msg;
  expr = '';
  justCalc = false;
}

// Keyboard support
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') inputNum(e.key);
  else if (e.key === '+') inputOp('+');
  else if (e.key === '-') inputOp('-');
  else if (e.key === '*') inputOp('*');
  else if (e.key === '/') { e.preventDefault(); inputOp('/'); }
  else if (e.key === '.') inputDot();
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') backspace();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === '%') percent();
});