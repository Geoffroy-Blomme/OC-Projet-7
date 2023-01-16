import { recipeFactory } from "./factories/recipe.js";
import {
  returnCurrentTags,
  ingredientsSearchInputUpdateDropdown,
  appliancesSearchInputUpdateDropdown,
  ustensilsSearchInputUpdateDropdown,
  addAllDropdowns,
  ingredientsSearchInput,
  ustensilsSearchInput,
  appliancesSearchInput,
} from "./utils/tags.js";

import { recipeSearchInputKeyDown } from "./utils/main_search-bar.js";
import { recipes } from "../data/recipes.js";

const filterButtons = document.querySelectorAll(
  ".filter-buttons-container button"
);
const repiceSeachInput = document.querySelector("#repice-seach-input");

const recipeThumbs = document.querySelector(".recipe-thumbs");

const filterButtonIsClicked = (evt) => {
  const button = evt.currentTarget;
  button.parentNode.classList.toggle("opened");
  button.parentNode.querySelector("input").focus();
  const buttonSpan = button.querySelector(".filter-button__text");
  buttonSpan.classList.toggle("hidden");
};

// Genere les articles des recettes et les ajoutent dans recipeThumbs
export const generateRecipThumbs = (data) => {
  const recipeModel = recipeFactory();
  const allRecipes = recipeModel.getRecipesThumbDOM(data);
  recipeThumbs.innerHTML = allRecipes;
};

// Renvoie le nombre de tags actuellement selectionnes.
export const getNbOfTagsSelected = () => {
  let nbOfTags = 0;
  let keys = Object.keys(returnCurrentTags());
  let tagsArray = keys.map((tag) => returnCurrentTags()[tag]);
  for (let i = 0; i < tagsArray.length; i++) {
    nbOfTags += tagsArray[i].length;
  }
  return nbOfTags;
};

// Vide le container des recettes recipeThumbs
export const emptyRecipeContainer = () => {
  recipeThumbs.innerHTML = "";
};

// Affiche le message qui indique aux utilisateurs que leur recherche n'a pas porte fruit.
export const noRecipesFound = () => {
  recipeThumbs.innerHTML = `<p> Aucune recette ne correspond à votre critère… vous pouvez
chercher « tarte aux pommes », « poisson », etc.
</p>`;
};

const setupEventListeners = () => {
  filterButtons.forEach((button) => {
    button.addEventListener("click", (evt) => {
      filterButtonIsClicked(evt);
    });
  });
  repiceSeachInput.addEventListener("keyup", recipeSearchInputKeyDown);
  ingredientsSearchInput.addEventListener(
    "keyup",
    ingredientsSearchInputUpdateDropdown
  );
  appliancesSearchInput.addEventListener(
    "keyup",
    appliancesSearchInputUpdateDropdown
  );
  ustensilsSearchInput.addEventListener(
    "keyup",
    ustensilsSearchInputUpdateDropdown
  );
};
const init = () => {
  setupEventListeners();
  generateRecipThumbs(recipes);
  addAllDropdowns();
};

init();
