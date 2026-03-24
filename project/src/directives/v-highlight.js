export default {
    // value can be a trigger key; when it changes, the highlight runs
    mounted(el, binding) {
        const run = () => {
            el.classList.add('v-highlight');
            window.setTimeout(() => el.classList.remove('v-highlight'), 1000);
        };
        // run initially only if binding value truthy
        if (binding.value) run();
        // store listener so unmount can remove if necessary
        el.__vhl_run = run;
    },
    updated(el, binding) {
        // when value changes (new id), trigger highlight
        if (binding.value && binding.value !== binding.oldValue) {
            el.classList.add('v-highlight');
            window.setTimeout(() => el.classList.remove('v-highlight'), 1000);
        }
    },
    unmounted(el) {
        delete el.__vhl_run;
    }
};