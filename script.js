const proteins = [
    { id: 'chicken-breast', name: 'Peito de frango', ratio: 0.318, correction: 1.35 },
    { id: 'chicken-gizzard', name: 'Moela de Galinha', ratio: 0.30, correction: 1.35 },
    { id: 'liver', name: 'Fígado', ratio: 0.30, correction: 1.40 },
    { id: 'pork-loin', name: 'Lombo', ratio: 0.28, correction: 1.30 },
    { id: 'ground-beef', name: 'Carne moída', ratio: 0.26, correction: 1.35 }
];

const inputs = proteins.map(p => document.getElementById(p.id));
const calculateBtn = document.getElementById('calculate-btn');
const clearBtn = document.getElementById('clear-btn');
const errorMessage = document.getElementById('error-message');
const proteinGoalInput = document.getElementById('protein-goal');

// Load saved values
inputs.forEach(input => {
    const saved = localStorage.getItem(input.id);
    if (saved) input.value = saved;
});

// Load saved protein goal
const savedGoal = localStorage.getItem('protein-goal');
if (savedGoal) proteinGoalInput.value = savedGoal;

// Save protein goal on change
proteinGoalInput.addEventListener('input', () => {
    localStorage.setItem('protein-goal', proteinGoalInput.value);
});

function calculateValues() {
    errorMessage.textContent = '';
    errorMessage.className = '';
    
    const proteinGoal = parseFloat(proteinGoalInput.value) || 938;
    const proteinLimit = proteinGoal * 1.05;
    
    // Get inputs with values > 0
    const filledInputs = inputs.filter(input => parseFloat(input.value) > 0);
    const emptyInputs = inputs.filter(input => !input.value || parseFloat(input.value) === 0);
    
    // Calculate total protein from filled inputs
    let totalProteinFromFilled = 0;
    filledInputs.forEach(input => {
        const protein = proteins.find(p => p.id === input.id);
        const rawValue = parseFloat(input.value);
        const cookedValue = rawValue / protein.correction;
        totalProteinFromFilled += cookedValue * protein.ratio;
    });
    
    if (totalProteinFromFilled > proteinLimit) {
        errorMessage.textContent = `Valores de proteína acima do esperado: ${totalProteinFromFilled.toFixed(1)}g`;
        errorMessage.className = 'error';
        return;
    }
    
    if (totalProteinFromFilled > proteinGoal) {
        errorMessage.textContent = `Aviso: Proteína ligeiramente acima da meta: ${totalProteinFromFilled.toFixed(1)}g`;
        errorMessage.className = 'warning';
    }
    
    if (emptyInputs.length === 0) return;
    
    const remainingProtein = proteinGoal - totalProteinFromFilled;
    
    if (remainingProtein <= 0) return;
    
    // Distribute remaining protein among empty inputs
    const proteinShare = remainingProtein / emptyInputs.length;
    
    emptyInputs.forEach(input => {
        const protein = proteins.find(p => p.id === input.id);
        const cookedGrams = proteinShare / protein.ratio;
        const rawGrams = cookedGrams * protein.correction;
        input.value = Math.max(0, rawGrams).toFixed(1);
    });
    
    // Save all values
    inputs.forEach(input => localStorage.setItem(input.id, input.value));
}

calculateBtn.addEventListener('click', calculateValues);
clearBtn.addEventListener('click', () => {
    inputs.forEach(input => {
        input.value = '';
        localStorage.removeItem(input.id);
    });
    errorMessage.textContent = '';
    errorMessage.className = '';
});