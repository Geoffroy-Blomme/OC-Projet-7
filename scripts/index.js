import { recipes } from "../data/recipes.js";

const filterButtons = document.querySelectorAll(
  ".filter-buttons-container button"
);

const setFilterButtonsInnerText = () => {
  filterButtons.forEach((button) => {
    console.log(button.innerText);
    //button.innerText = button.innerText + button.getAttribute("data-value");
  });
};

const filterButtonIsClicked = (evt) => {
  const button = evt.currentTarget;
  button.parentNode.classList.toggle("opened");
  const buttonSpan = button.querySelector(".filter-button__text");
  console.log(buttonSpan);
  buttonSpan.classList.toggle("hidden");
};

const setupEventListeners = () => {
  filterButtons.forEach((button) => {
    button.addEventListener("click", (evt) => {
      filterButtonIsClicked(evt);
    });
  });
  setFilterButtonsInnerText();
};
const init = () => {
  setupEventListeners();
  console.log(recipes);
};

init();
