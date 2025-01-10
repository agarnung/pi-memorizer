const a_few_of_pi = "141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006";

const input = document.getElementById('user-input');
const keys = document.querySelectorAll('.key');
const message = document.getElementById('message');
const restart_message = document.getElementById('restart-message');
const restartButton = document.getElementById('restart-button');

let failed = false;  // Flag to track if an error has occurred
let firstDigit = 0; // To restart automatically when user fails

// Restrict writing and cursor movement
input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
        event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
        event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        return;
    }

    // Prevent input if cursor is not at the end
    const cursorAtEnd = input.selectionStart === input.value.length;
    if (!cursorAtEnd) {
        event.preventDefault();
    }
});

// Prevent copy, paste, and cut
input.addEventListener('copy', (event) => { event.preventDefault(); });
input.addEventListener('paste', (event) => { event.preventDefault(); });
input.addEventListener('cut', (event) => { event.preventDefault(); });

// Force cursor to the end if user clicks in the middle
input.addEventListener('click', () => {
    setTimeout(() => {
        input.selectionStart = input.selectionEnd = input.value.length;
    }, 0);
});

// Ensure cursor is always at the end after any input
input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g, ''); // Remove invalid characters
    input.selectionStart = input.selectionEnd = input.value.length; // Force cursor to the end

    if (failed)
    {
        failed = false; 
        firstDigit = input.value[input.value.length - 1]
        restart();
    }
});

// Check for input against pi sequence
input.addEventListener('input', () => {
    const userValue = input.value;

    // Get the current digit entered
    const currentIndex = userValue.length - 1;

    if (currentIndex >= a_few_of_pi.length) {
        // Prevent input if it exceeds the length of the reference string
        message.textContent = "Input exceeds the reference length.";
        input.value = userValue.slice(0, a_few_of_pi.length);
        return;
    }

    const currentDigit = userValue[currentIndex];
    const referenceDigit = a_few_of_pi[currentIndex];

    if (currentDigit !== referenceDigit) {
        // Show error message and set flag to true
        failed = true;
        message.textContent = `${input.value.length} decimals correct! The ${currentIndex + 1}-th digit is incorrect. Expected: ${referenceDigit}. Restart by entering the first digit...`;
    } else {
        // Clear the error message if the digit is correct
        message.textContent = "";
    }
});

// Handle virtual keyboard buttons
keys.forEach((key) => {
    key.addEventListener('click', () => {
        const digit = key.textContent;
        const userValue = input.value;
        const currentIndex = userValue.length;

        if (failed)
        {
            failed = false; 
            firstDigit = digit
            restart();
        }

        // Check if input exceeds the length of pi
        if (currentIndex >= a_few_of_pi.length) {
            message.textContent = "Input exceeds the reference length.";
            return;
        }

        const referenceDigit = a_few_of_pi[currentIndex];

        // If the clicked digit doesn't match the expected digit in pi, show error
        if (digit !== referenceDigit) {
            message.textContent = `${input.value.length} decimals correct! The ${currentIndex + 1}-th digit is incorrect. Expected: ${referenceDigit}. Restart by entering the first digit...`;
            failed = true;
        } else {
            // Append the digit to the input if it's correct
            input.value += digit;
            message.textContent = ""; // Clear the error message if it's correct
        }

        // Move cursor to the end
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
    });
});

// Focus the input and move cursor to the end on page load
window.onload = () => {
    input.focus();
    input.selectionStart = input.selectionEnd = input.value.length;
};

// Restart function
function restart() {
    input.value = ''; 
    restart_message.textContent = "Restarting..."; 

    setTimeout(() => {
        // After clearing the input, set it back to the first correct digit
        input.value = firstDigit;

        // Dispatch an input event to re-trigger the validation
        input.dispatchEvent(new Event('input'));

        restart_message.textContent = '';
        message.textContent = '';
    }, 1); 
}

// Add event listener to the restart button to reset the game
restartButton.addEventListener('click', () => {
    input.value = ''; 
    restart_message.textContent = "Restarting..."; 

    setTimeout(() => {
        restart_message.textContent = '';
        message.textContent = '';
    }, 1); 

});

// Force cursor to the end if user clicks in the middle
restartButton.addEventListener('click', () => {
    setTimeout(() => {
        // Move cursor to the end
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
    }, 0);
});