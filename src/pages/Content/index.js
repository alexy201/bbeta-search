import { printLine } from './modules/print';
import buildFilter from './at_stuff'
import icon from '../../assets/img/icon-128'

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

function applyStylesWhenExpanded() {
    const searchInput = document.querySelector('input.search-global-typeahead__input');
    const searchContainer = document.querySelector('.search-global-typeahead__search-icon-container');

    if (!searchInput) {
        console.log('Search input not found.');
        return;
    }

    if (!searchContainer) {
        console.log('Search container not found.');
        return;
    }

    const options = document.querySelector('.search-global-typeahead__content');

    if (!options) {
        console.log('options not found.');
        return;
    }

    function applyStyles() {
        console.log("OPENED")
        const iconButton = document.createElement('button');
        iconButton.innerHTML = `<img src="${icon}" alt="Filter Icon" style="width: 24px; height: 24px;">`;
        iconButton.style.border = 'none';
        iconButton.style.background = 'none';
        iconButton.style.cursor = 'pointer';
        iconButton.title = 'Apply Filters';
        options.appendChild(iconButton);
    }

    applyStyles();

    // Observe changes to the aria-expanded attribute
    const observer = new MutationObserver(() => {
        if (searchInput.getAttribute('aria-expanded') === 'true') {
            applyStyles();
        }
    });

    observer.observe(searchInput, { attributes: true, attributeFilter: ['aria-expanded'] });


    searchInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default search action
            const searchURL = await buildFilter(searchInput.value);
            window.location.href = searchURL;
        }
    });
}

applyStylesWhenExpanded();





