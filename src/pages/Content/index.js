import { printLine } from './modules/print';
import buildFilter from './at_stuff'

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

    searchInput.placeholder = 'NLP Search';

    function applyStyles() {
        if (searchInput.getAttribute('aria-expanded') === 'true') {
            const observer = new MutationObserver((mutations, observer) => {
                const options = document.querySelector('.search-global-typeahead__content');
                if (options) {
                    const escapeHatchElements = options.querySelectorAll('.search-global-typeahead-hit--escape-hatch');
                    escapeHatchElements.forEach(element => {
                        element.remove();
                    });
                    // Disable the last instance of basic-typeahead__selectable
                    const selectables = document.querySelectorAll('.basic-typeahead__selectable');
                    if (selectables.length > 0) {
                        selectables[selectables.length - 1].setAttribute('disabled', 'true');
                    }
                    // Check if the button already exists to prevent multiple buttons from being added
                    if (!document.getElementById('filterButton')) {
                        const normalButton = document.createElement('button');
                        normalButton.id = 'filterButton'; // Set an ID to prevent duplicates
                        normalButton.innerText = 'Perform Fuzzy Search';

                        // Apply CSS class for styling
                        normalButton.classList.add('filterButton');

                        options.appendChild(normalButton);

                        // Optionally, add an event listener to the button
                        normalButton.addEventListener('click', async () => {
                            event.preventDefault(); // Prevent the default search action
                            const searchURL = await buildFilter(searchInput.value);
                            window.location.href = searchURL;
                        });
                    }

                    // Stop observing once the button has been added
                    observer.disconnect();
                }
            });

            // Start observing the document for changes
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    applyStyles();


    // Observe changes to the aria-expanded attribute
    const observer = new MutationObserver(applyStyles);
    observer.observe(searchInput, { attributes: true, attributeFilter: ['aria-expanded'] });
}

applyStylesWhenExpanded();





