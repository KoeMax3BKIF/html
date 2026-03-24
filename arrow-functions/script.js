const students = [
    { id: 1, name: "Lukas Huber",    alter: 28, groesse: 182, geburtsdatum: "1997-05-12", herkunft: "Österreich",  gewicht: 78.5, note: 1 },
    { id: 2, name: "Sarah Meyer",    alter: 34, groesse: 165, geburtsdatum: "1991-11-20", herkunft: "Deutschland", gewicht: 62.0, note: 5 },
    { id: 3, name: "Mateo Rossi",    alter: 19, groesse: 175, geburtsdatum: "2006-02-28", herkunft: "Italien",     gewicht: 70.2, note: 4 },
    { id: 4, name: "Elena Fischer",  alter: 45, groesse: 170, geburtsdatum: "1980-08-05", herkunft: "Schweiz",     gewicht: 65.8, note: 2 },
    { id: 5, name: "Julian Novak",   alter: 22, groesse: 190, geburtsdatum: "2003-12-15", herkunft: "Österreich",  gewicht: 85.3, note: 3 },
    { id: 6, name: "Sophie Dubois",  alter: 31, groesse: 168, geburtsdatum: "1994-03-10", herkunft: "Frankreich",  gewicht: 59.5, note: 1 },
    { id: 7, name: "Erik Lindström", alter: 52, groesse: 185, geburtsdatum: "1973-10-22", herkunft: "Schweden",    gewicht: 92.1, note: 5 },
];

const solutions = {
    1: "const passed = students.filter(s => s.note <= 4);",
    2: "const labels = students.map(s => `${s.name} (${s.alter})`);",
    3: "const passedNames = students\n    .filter(s => s.note <= 4)\n    .map(s => s.name);",
    4: "const averageGrade = students.reduce((sum, s) => sum + s.note, 0) / students.length;",
    5: "const result = students\n    .filter(s => s.alter >= 17)\n    .filter(s => s.note <= 4)\n    .map(s => s.name)\n    .join(', ');"
};

const validators = {
    1(code) {
        const fn = new Function('students', code + '; return passed;');
        const res = fn(students);
        if (!Array.isArray(res)) return { ok: false, msg: "Fehler: passed muss ein Array sein." };
        const exp = students.filter(s => s.note <= 4);
        const ok = JSON.stringify(res) === JSON.stringify(exp);
        return {
            ok,
            msg: ok
                ? `Richtig! passed = [${res.map(s => s.name).join(', ')}]`
                : `Falsch: ${res.length} Einträge erhalten, ${exp.length} erwartet. Prüfe deine Bedingung.`
        };
    },
    2(code) {
        const fn = new Function('students', code + '; return labels;');
        const res = fn(students);
        if (!Array.isArray(res)) return { ok: false, msg: "Fehler: labels muss ein Array sein." };
        const exp = students.map(s => `${s.name} (${s.alter})`);
        const ok = JSON.stringify(res) === JSON.stringify(exp);
        return {
            ok,
            msg: ok
                ? `Richtig! labels = ["${res[0]}", "${res[1]}", ...]`
                : `Falsch: Erster Wert: "${res[0]}", erwartet: "${exp[0]}"`
        };
    },
    3(code) {
        const fn = new Function('students', code + '; return passedNames;');
        const res = fn(students);
        if (!Array.isArray(res)) return { ok: false, msg: "Fehler: passedNames muss ein Array sein." };
        const exp = students.filter(s => s.note <= 4).map(s => s.name);
        const ok = JSON.stringify(res) === JSON.stringify(exp);
        return {
            ok,
            msg: ok
                ? `Richtig! passedNames = [${res.map(n => `"${n}"`).join(', ')}]`
                : `Falsch: [${res.join(', ')}] erhalten, [${exp.join(', ')}] erwartet`
        };
    },
    4(code) {
        const fn = new Function('students', code + '; return averageGrade;');
        const res = fn(students);
        const exp = students.reduce((s, x) => s + x.note, 0) / students.length;
        const ok = Math.abs(res - exp) < 0.001;
        return {
            ok,
            msg: ok
                ? `Richtig! averageGrade = ${res}`
                : `Falsch: ${res} erhalten, ${exp} erwartet`
        };
    },
    5(code) {
        const fn = new Function('students', code + '; return result;');
        const res = fn(students);
        const exp = students
            .filter(s => s.alter >= 17)
            .filter(s => s.note <= 4)
            .map(s => s.name)
            .join(', ');
        const ok = res === exp;
        return {
            ok,
            msg: ok
                ? `Richtig! result = "${res}"`
                : `Falsch:\nErhalten:  "${res}"\nErwartet: "${exp}"`
        };
    }
};

let solved = new Set();

function updateProgress() {
    const pct = (solved.size / 5) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressLabel').textContent = `Fortschritt: ${solved.size} / 5`;
}

function runTask(id) {
    const code = document.getElementById(`code-${id}`).value.trim();
    const box  = document.getElementById(`result-${id}`);

    if (!code) {
        box.className = 'output-box info';
        box.textContent = 'Schreibe deinen Code oben in das Feld und klicke dann auf Ausführen.';
        return;
    }

    try {
        const { ok, msg } = validators[id](code);
        box.className = `output-box ${ok ? 'pass' : 'fail'}`;
        box.textContent = msg;
        if (ok) solved.add(id);
    } catch (e) {
        box.className = 'output-box fail';
        box.textContent = `Fehler: ${e.message}`;
    }

    updateProgress();
}

function toggleHint(id) {
    document.getElementById(`hint-${id}`).classList.toggle('show');
}

function showSolution(id) {
    document.getElementById(`code-${id}`).value = solutions[id];
    const box = document.getElementById(`result-${id}`);
    box.className = 'output-box info';
    box.textContent = 'Lösung angezeigt – klicke auf Ausfuhren zum Uberprüfen.';
}

function scrollToTop() {
    document.getElementById('top').scrollIntoView({ behavior: 'smooth' });
}

// Tab-Unterstutzung in allen Textareas
document.querySelectorAll('textarea').forEach(ta => {
    ta.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const s = ta.selectionStart;
            ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(ta.selectionEnd);
            ta.selectionStart = ta.selectionEnd = s + 2;
        }
        // Ctrl+Enter oder Cmd+Enter fuhrt den Code aus
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const id = parseInt(ta.id.split('-')[1]);
            runTask(id);
        }
    });
});

updateProgress();
