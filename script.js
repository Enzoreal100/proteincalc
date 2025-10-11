const proteins = [
    { id: 'chicken-breast', name: 'Peito de frango', ratio: 0.318, correction: 1.35 },
    { id: 'chicken-gizzard', name: 'Moela de Galinha', ratio: 0.30, correction: 1.35 },
    { id: 'liver', name: 'Fígado', ratio: 0.30, correction: 1.40 },
    { id: 'pork-loin', name: 'Lombo', ratio: 0.28, correction: 1.30 },
    { id: 'ground-beef', name: 'Carne moída', ratio: 0.26, correction: 1.35 }
];

const PURE_PROTEIN_GOAL = 938;

const inputs = proteins.map(p => document.getElementById(p.id));

function updateValues(event) {
    const updatedId = event.target.id;
    const updatedRawValue = parseFloat(event.target.value) || 0;

    const updatedProtein = proteins.find(p => p.id === updatedId);

    // Convert raw weight input to cooked weight for calculation
    const cookedValue = updatedRawValue / updatedProtein.correction;
    const pureProteinFromSource = cookedValue * updatedProtein.ratio;

    if (pureProteinFromSource >= PURE_PROTEIN_GOAL) {
        inputs.forEach(input => {
            if (input.id !== updatedId) {
                input.value = 0;
            }
        });
        return;
    }

    const remainingProtein = PURE_PROTEIN_GOAL - pureProteinFromSource;
    const otherProteins = proteins.filter(p => p.id !== updatedId);
    const otherInputs = inputs.filter(input => input.id !== updatedId);

    const proteinShare = remainingProtein / otherProteins.length;

    otherInputs.forEach((input, index) => {
        const protein = otherProteins[index];
        // Calculate the cooked grams needed
        const cookedGrams = proteinShare / protein.ratio;
        // Convert back to raw grams for display in the input field
        const rawGrams = cookedGrams * protein.correction;
        input.value = Math.max(0, rawGrams).toFixed(1);
    });
}

inputs.forEach(input => {
    input.addEventListener('input', updateValues);
});