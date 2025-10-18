const proteins = [
    { id: 'chicken-breast', name: 'Peito de frango', ratio: 0.318, correction: 1.35 },
    { id: 'chicken-gizzard', name: 'Moela de Galinha', ratio: 0.30, correction: 1.35 },
    { id: 'liver', name: 'Fígado', ratio: 0.30, correction: 1.40 },
    { id: 'pork-loin', name: 'Lombo', ratio: 0.28, correction: 1.30 },
    { id: 'ground-beef', name: 'Carne moída', ratio: 0.26, correction: 1.35 }
];

const PURE_PROTEIN_GOAL = 938;

const inputs = proteins.map(p => document.getElementById(p.id));
const calculateBtn = document.getElementById('calculate-btn');
const clearBtn = document.getElementById('clear-btn');

function calculateValues() {
    // Get inputs with values > 0
    const filledInputs = inputs.filter(input => parseFloat(input.value) > 0);
    const emptyInputs = inputs.filter(input => !input.value || parseFloat(input.value) === 0);
    
    if (emptyInputs.length === 0) return; // No empty fields to fill
    
    // Calculate total protein from filled inputs
    let totalProteinFromFilled = 0;
    filledInputs.forEach(input => {
        const protein = proteins.find(p => p.id === input.id);
        const rawValue = parseFloat(input.value);
        const cookedValue = rawValue / protein.correction;
        totalProteinFromFilled += cookedValue * protein.ratio;
    });
    
    const remainingProtein = PURE_PROTEIN_GOAL - totalProteinFromFilled;
    
    if (remainingProtein <= 0) return; // Goal already met
    
    // Distribute remaining protein among empty inputs
    const proteinShare = remainingProtein / emptyInputs.length;
    
    emptyInputs.forEach(input => {
        const protein = proteins.find(p => p.id === input.id);
        const cookedGrams = proteinShare / protein.ratio;
        const rawGrams = cookedGrams * protein.correction;
        input.value = Math.max(0, rawGrams).toFixed(1);
    });
}

calculateBtn.addEventListener('click', calculateValues);
clearBtn.addEventListener('click', () => inputs.forEach(input => input.value = ''));