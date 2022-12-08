import { recipes } from "../data/recipes.js";
import { recipeFactory } from "./factories/recipe.js";
const filterButtons = document.querySelectorAll(
  ".filter-buttons-container button"
);
const recipeThumbs = document.querySelector(".recipe-thumbs");

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

const setupEventListeners = () => {
  filterButtons.forEach((button) => {
    button.addEventListener("click", (evt) => {
      filterButtonIsClicked(evt);
    });
  });
};
const init = () => {
  setupEventListeners();
  console.log(recipes);
  const recipeModal = recipeFactory();
  const recipeDOM = recipeModal.getRecipeThumbDOM(recipes[0]);
  console.log(recipeDOM);
  generateRecipThumbs(recipes);
};

init();
