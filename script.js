const userIcon = document.querySelector('.user-icon');
const menu = document.querySelector('.side-menu');

userIcon.addEventListener('click', () => {
    menu.classList.toggle('open-menu');
});