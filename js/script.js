const a_few_of_pi = "141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006";

const input = document.getElementById('user-input');
const keys = document.querySelectorAll('.key');
const message = document.getElementById('message');
const restart_message = document.getElementById('restart-message');
const restartButton = document.getElementById('restart-button');
const scoreBox = document.getElementById('score');
const popupImage = document.getElementById('popupimage');

const popUsImageInterval = 5;
const imagesPath = './assets/pis/';
const images = [
    'pi_archimedes.svg',
    'pi_Beta.svg',
    'pi_Cauchy_distrib.svg',
    'pi_circle.svg',
    'pi_cosmo_cte.svg',
    'pi_Coulomb.svg',
    'pi_Dirichlet_integral.svg',
    'pi_ellipse.svg',
    'pi_Euler.svg',
    'pi_exact_pendulum.svg',
    'pi_Fibonacci.svg',
    'pi_fraction.svg',
    'pi_Gaussian_integral.svg',
    'pi_heisenberg.svg',
    'pi_iterative.svg',
    'pi_Kepler3rd.svg',
    'pi_Leibniz.svg',
    'pi_muo.svg',
    'pi_Newton.svg',
    'pi_pendulum.svg',
    'pi_Ramanujan_class_invariants.svg',
    'pi_Ramanujan_lemniscate_cte.svg',
    'pi_ramanujan.svg',
    'pi_Rieman_unit_circle.svg',
    'pi_sphere.svg',
    'pi_sum2.svg',
    'pi_sum3.svg',
    'pi_sum.svg',
    'pi_Wallis.svg',
    'pi_Zeta.svg'
];

let failed = false; // Flag to track if an incorrect user input has occurred
let firstDigit = 0; // To restart automatically when user fails
let correctDigits = 0;

function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return imagesPath + images[randomIndex];
}

function showPopupImage() {
    const img = document.createElement('img');
    img.src = getRandomImage();
    img.classList.add('popup-image');

    const randomOffsetX = (Math.random() - 0.5) * 100; 
    const randomOffsetY = (Math.random() - 0.5) * 100;

    img.style.transform = `translate(calc(-100% + ${randomOffsetX}px), calc(-100% + ${randomOffsetY}px))`;

    const popupContainer = document.getElementById('popupimage');
    popupContainer.appendChild(img);

    setTimeout(() => {
        img.remove();
    }, 2000);
}


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
        failed = true;
        message.textContent = `The ${currentIndex + 1}-th digit is incorrect. Expected: ${referenceDigit}.\n\nRestart by entering the first digit...`;
        message.style.display = "block";
    } else {
        message.textContent = "";
        message.style.display = "none";
        correctDigits = currentIndex + 1;
        scoreBox.textContent = "π-streak: " + correctDigits
        if (correctDigits >0 && correctDigits % popUsImageInterval === 0) {
            showPopupImage();
        }
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

        if (digit !== referenceDigit) {
            message.textContent = `The ${currentIndex + 1}-th digit is incorrect. Expected: ${referenceDigit}.\n\nRestart by entering the first digit...`;
            failed = true;
            message.style.display = "block";
        } else {
            message.textContent = "";
            message.style.display = "none";
            correctDigits = currentIndex + 1;
            scoreBox.textContent = "π-streak: " + correctDigits
            if (correctDigits >0 && correctDigits % popUsImageInterval === 0) {
                showPopupImage();
            }
        }

        input.value += digit;

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
    message.style.display = "none";
    restart_message.textContent = "Restarting..."; 
    scoreBox.textContent = "π-streak: " + 0

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
    message.style.display = "none";
    restart_message.textContent = "Restarting..."; 
    scoreBox.textContent = "π-streak: " + 0

    setTimeout(() => {
        restart_message.textContent = '';
        message.textContent = '';
    }, 200); 

});

// Force cursor to the end if user clicks in the middle
restartButton.addEventListener('click', () => {
    setTimeout(() => {
        // Move cursor to the end
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
    }, 0);
});
