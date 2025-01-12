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
let correctDigits = 0;

// Generate random number between -range y +range
function getRandomValue(range) {
    return (Math.random() - 0.5) * range * 2; 
}

// Animation of the pop-up images
function createKeyframes(name, scale, translateX, translateY, rotation) {
    const styleSheet = document.styleSheets[0];
    const keyframes = `
        @keyframes ${name} {
            0% {
                opacity: 0;
                transform: scale(0) translate(0, 0) rotate(0deg);
            }
            50% {
                opacity: 1;
                transform: scale(${scale}) translate(${translateX / 2}px, ${translateY / 2}px) rotate(${rotation / 2}deg);
            }
            100% {
                opacity: 0;
                transform: scale(${scale * 2}) translate(${translateX}px, ${translateY}px) rotate(${rotation}deg);
            }
        }
    `;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
}

function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return imagesPath + images[randomIndex];
}

function showPopupImage() {
    const img = document.createElement('img');
    img.src = getRandomImage();
    img.classList.add('popup-image');

    const randomTranslateX = getRandomValue(50);
    const randomTranslateY = getRandomValue(50);
    const randomRotation = getRandomValue(1) * 45; // random rotation from -45 to 45 º
    const animationName = `popupAnimation-${Date.now()}`; 

    createKeyframes(animationName, 2.5, randomTranslateX, randomTranslateY, randomRotation);

    img.style.animation = `${animationName} 5s ease-in-out forwards`;

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    img.style.left = `${startX}px`;
    img.style.top = `${startY}px`;

    popupimage.appendChild(img);

    setTimeout(() => {
        img.remove();
    }, 4000);
}

// Prevent copy, paste, and cut
input.addEventListener('copy', (event) => { event.preventDefault(); });
input.addEventListener('paste', (event) => { event.preventDefault(); });
input.addEventListener('cut', (event) => { event.preventDefault(); });

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
    if (!cursorAtEnd || failed) {
        event.preventDefault();
    }
});

// Restart function
function restart() {
    input.value = ''; 
    message.style.display = "none";
    restart_message.textContent = "Restarting..."; 
    scoreBox.textContent = "π-streak: " + 0;

    setTimeout(() => {
        restart_message.textContent = '';
        message.textContent = '';
        failed = false;
    }, 200); 
}

// Listen for "R" key press to restart
document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'r') {
        restart(); 
    }
})

// Add event listener to the restart button to reset the game
restartButton.addEventListener('click', () => {
    restart();
    
    // Move cursor to the end
    input.focus();
    input.selectionStart = input.selectionEnd = input.value.length;
});

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
});

// Input validation and game logic
input.addEventListener('input', () => {
    if (failed) return; // Prevent further inputs if failed

    const userValue = input.value;
    const currentIndex = userValue.length - 1;

    if (currentIndex >= a_few_of_pi.length) {
        message.textContent = "Input exceeds the reference length.";
        input.value = userValue.slice(0, a_few_of_pi.length);
        print("You won, I'm leaving...")
        window.close();
        return;
    }
    const currentDigit = userValue[currentIndex];
    const referenceDigit = a_few_of_pi[currentIndex];

    if (currentDigit !== referenceDigit) {
        failed = true;
        message.textContent = `The ${currentIndex + 1}-th digit is incorrect. Expected: ${referenceDigit}.\n\nPress Enter or Restart to try again.`;
        message.style.display = "block";
        correctDigits = 0;
    } else {
        message.textContent = "";
        message.style.display = "none";
        correctDigits = currentIndex + 1;
        scoreBox.textContent = "π-streak: " + correctDigits;
        if (correctDigits > 0 && correctDigits % popUsImageInterval === 0) {
            showPopupImage();
        }
    }
});

// Input validation and game logic
keys.forEach((key) => {
    key.addEventListener('click', () => {
        if (failed) return; // Prevent further inputs if failed

        const digit = key.textContent;
        const userValue = input.value;
        const currentIndex = userValue.length;

        if (currentIndex >= a_few_of_pi.length) {
            message.textContent = "Input exceeds the reference length.";
            input.value = userValue.slice(0, a_few_of_pi.length);
            print("You won, I'm leaving...")
            window.close();
            return;
        }

        const referenceDigit = a_few_of_pi[currentIndex];
        if (digit !== referenceDigit) {
            failed = true;
            message.textContent = `The ${currentIndex + 1}-th digit is incorrect. Expected: ${referenceDigit}.\n\nPress Restart to try again.`;
            message.style.display = "block";
            correctDigits = 0;
        } else {
            message.textContent = "";
            correctDigits = currentIndex + 1;
            scoreBox.textContent = "π-streak: " + correctDigits;
            input.value += digit;

            if (correctDigits > 0 && correctDigits % popUsImageInterval === 0) {
                showPopupImage();
            }
        }

        // Move cursor to the end
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
    });
});

// On load, focus the input but prevent editing with the keyboard
window.onload = () => {
    input.focus();
};
