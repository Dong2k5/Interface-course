import { ref } from 'vue';

const STORAGE_KEY = 'pets';

export function usePets() {
    const defaultPets = [
        { id: 1, name: 'Buddy', type: 'Dog', status: 'Available', city: 'Melbourne', description: '', rescueDate: '' },
        { id: 2, name: 'Mittens', type: 'Cat', status: 'Adopted', city: 'Sydney', description: '', rescueDate: '' },
        { id: 3, name: 'Tweety', type: 'Bird', status: 'Available', city: 'Brisbane', description: '', rescueDate: '' },
        { id: 4, name: 'Rex', type: 'Dog', status: 'Available', city: 'Melbourne', description: '', rescueDate: '' },
        { id: 5, name: 'Whiskers', type: 'Cat', status: 'Adopted', city: 'Perth', description: '', rescueDate: '' },
        { id: 6, name: 'Goldie', type: 'Dog', status: 'Available', city: 'Sydney', description: '', rescueDate: '' },
        { id: 7, name: 'Shadow', type: 'Cat', status: 'Available', city: 'Brisbane', description: '', rescueDate: '' },
        { id: 8, name: 'Chirpy', type: 'Bird', status: 'Adopted', city: 'Melbourne', description: '', rescueDate: '' },
        { id: 9, name: 'Max', type: 'Dog', status: 'Available', city: 'Perth', description: '', rescueDate: '' },
        { id: 10, name: 'Luna', type: 'Cat', status: 'Available', city: 'Sydney', description: '', rescueDate: '' }
    ];

    const loadPets = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : defaultPets;
        } catch (e) {
            console.error('Failed to parse pets from localStorage', e);
            return defaultPets;
        }
    };

    const pets = ref(loadPets());

    const savePets = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pets.value));
    };

    // CREATE
    const addPet = (pet) => {
        const newPet = { ...pet, id: Date.now() };
        pets.value.push(newPet);
        savePets();
        return newPet;
    };

    // Find pet by ID
    const findPetById = (id) => pets.value.find(p => Number(p.id) === Number(id));

    // UPDATE
    const updatePet = (updated) => {
        const idx = pets.value.findIndex(p => Number(p.id) === Number(updated.id));
        if (idx !== -1) {
            pets.value[idx] = { ...updated };
            savePets();
            return true;
        }
        return false;
    };

    // DELETE
    const deletePet = (id) => {
        const before = pets.value.length;
        pets.value = pets.value.filter(p => Number(p.id) !== Number(id));
        if (pets.value.length !== before) {
            savePets();
            return true;
        }
        return false;
    };

    // Expose
    return {
        pets,
        addPet,
        findPetById,
        updatePet,
        deletePet,
        savePets
    };
}