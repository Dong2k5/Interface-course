import { ref } from 'vue';
import { usePets } from './usePets';

const STORAGE_KEY = 'adoptions';

export function useAdoptions() {
    const { pets, updatePet } = usePets();

    const loadAdoptions = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Failed to parse adoptions from localStorage', e);
            return [];
        }
    };

    const adoptions = ref(loadAdoptions());

    const saveAdoptions = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adoptions.value));
    };

    // CREATE
    const addAdoption = (item) => {
        const newItem = {
            ...item,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            status: 'Pending'
        };
        adoptions.value.push(newItem);
        saveAdoptions();
        return newItem;
    };

    // READ
    const findAdoptionById = (id) => adoptions.value.find(a => Number(a.id) === Number(id));

    // UPDATE
    const updateAdoption = (updated) => {
        const idx = adoptions.value.findIndex(a => Number(a.id) === Number(updated.id));
        if (idx !== -1) {
            adoptions.value[idx] = { ...updated };

            // If approved, update pet status
            if (updated.status === 'Approved') {
                const pet = pets.value.find(p => Number(p.id) === Number(updated.petId));
                if (pet) {
                    pet.status = 'Adopted';
                    updatePet(pet);
                }
            }

            saveAdoptions();
            return true;
        }
        return false;
    };

    // DELETE
    const deleteAdoption = (id) => {
        const before = adoptions.value.length;
        adoptions.value = adoptions.value.filter(a => Number(a.id) !== Number(id));
        if (adoptions.value.length !== before) {
            saveAdoptions();
            return true;
        }
        return false;
    };

    return {
        adoptions,
        addAdoption,
        findAdoptionById,
        updateAdoption,
        deleteAdoption,
        saveAdoptions
    };
}