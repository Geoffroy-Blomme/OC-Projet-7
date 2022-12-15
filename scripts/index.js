import { recipes } from "../data/recipes.js";
import { recipeFactory } from "./factories/recipe.js";
const filterButtons = document.querySelectorAll(
  ".filter-buttons-container button"
);
const recipeThumbs = document.querySelector(".recipe-thumbs");
const repiceSeachInput = document.querySelector("#repice-seach-input");
const ingredientsSearchInput = document.querySelector(
  "#ingredients-search-input"
);
const filterButtonIsClicked = (evt) => {
  const button = evt.currentTarget;
  button.parentNode.classList.toggle("opened");
  const buttonSpan = button.querySelector(".filter-button__text");
  buttonSpan.classList.toggle("hidden");
};

const generateRecipThumbs = (data) => {
  const recipeModel = recipeFactory();
  const allRecipes = recipeModel.getRecipesThumbDOM(data);
  recipeThumbs.innerHTML = allRecipes;
};

const repiceSearchInputKeyDown = (evt) => {
  const nbOfCharacters = parseInt(evt.currentTarget.value.length);
  if (nbOfCharacters >= 3) {
    startRecipeSearch();
  }
};

const startRecipeSearch = () => {};

const setupEventListeners = () => {
  filterButtons.forEach((button) => {
    button.addEventListener("click", (evt) => {
      filterButtonIsClicked(evt);
    });
  });
  repiceSeachInput.addEventListener("keyup", repiceSearchInputKeyDown);
};
const init = () => {
  setupEventListeners();
  console.log(recipes);
  const recipeModal = recipeFactory();
  const recipeDOM = recipeModal.getRecipeThumbDOM(recipes[0]);
  generateRecipThumbs(recipes);
};

init();
