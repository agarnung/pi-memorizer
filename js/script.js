const a_few_of_pi = "141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006";

const input = document.getElementById('user-input');
const keys = document.querySelectorAll('.key');
const message = document.getElementById('message');
const restart_message = document.getElementById('restart-message');
const restartButton = document.getElementById('restart-button');
const scoreBox = document.getElementById('score');
const popupImage = document.getElementById('popupimage');

// const popUsImageInterval = 5;
// const imagesPath = './assets/pis/;'

let failed = false; // Flag to track if an error has occurred
let firstDigit = 0; // To restart automatically when user fails
let correctDigits = 0;

// const fs = require('fs');
// const path = require('path');

// function getImagesFromDirectory() {
//     const directoryPath = path.join(__dirname, imagesPath);
//     const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

//     const images = fs.readdirSync(directoryPath)
//         .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
//         .map(file => path.join(directoryPath, file));

//     return images;
// }

// const _images = getImagesFromDirectory();

// function getRandomImage() {
//     const randomIndex = Math.floor(Math.random() * _images.length);
//     return imagesPath + _images[randomIndex]; 
// }

// function showPopupImage() {
//     const img = document.createElement('img');
//     img.src = getRandomImage();
//     img.classList.add('popup-image');

//     // Set random positions for the image
//     const randomX = Math.random() * window.innerWidth;
//     const randomY = Math.random() * window.innerHeight;

//     img.style.left = `${randomX}px`;
//     img.style.top = `${randomY}px`;

//     const popupContainer = document.getElementById('popupimage');
//     popupContainer.appendChild(img);
//     img.style.display = 'block';

//     // Remove the image after 1 second
//     setTimeout(() => {
//         img.style.display = 'none';
//         img.remove();
//     }, 1000);
// }

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
        // if (decimalCount % popUsImageInterval === 0) {
        //     showPopupImage();
        // }
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
            // if (decimalCount % popUsImageInterval === 0) {
            //     showPopupImage();
            // }
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
