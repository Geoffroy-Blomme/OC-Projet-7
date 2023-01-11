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

export const generateRecipThumbs = (data) => {
  const recipeModel = recipeFactory();
  const allRecipes = recipeModel.getRecipesThumbDOM(data);
  recipeThumbs.innerHTML = allRecipes;
};

export const getNbOfTagsSelected = () => {
  let nbOfTags = 0;
  let keys = Object.keys(returnCurrentTags());
  let tagsArray = keys.map((tag) => returnCurrentTags()[tag]);
  for (let i = 0; i < tagsArray.length; i++) {
    nbOfTags += tagsArray[i].length;
  }
  return nbOfTags;
};

// Renvoie un array contenant les elements de arrayToSearchIn qui contiennent dans leur titre, ingredients ou description le mot-cle mis en argument
export const searchRecipesThatContainsKeyword = (arrayToSearchIn, keyword) => {
  let finalArray = [];
  arrayToSearchIn.map((elt) => {
    if (searchRecipeForName(elt, keyword)) {
      finalArray.push(elt);
    } else if (searchRecipeForDescription(elt, keyword)) {
      finalArray.push(elt);
    } else if (searchRecipeForIngredient(elt, keyword)) {
      finalArray.push(elt);
    }
  });

  return finalArray;
};

const searchRecipeForName = (recipe, keyword) => {
  if (recipe.name.toLowerCase().includes(keyword.toLowerCase())) {
    return true;
  } else {
    return false;
  }
};

const searchRecipeForDescription = (recipe, keyword) => {
  if (recipe.description.toLowerCase().includes(keyword.toLowerCase())) {
    return true;
  } else {
    return false;
  }
};

export const searchRecipeForIngredient = (recipe, keyword) => {
  let bool = false;
  recipe.ingredients.map((ingredientObject) => {
    if (
      ingredientObject.ingredient.toLowerCase().includes(keyword.toLowerCase())
    ) {
      bool = true;
    }
  });

  return bool;
};

export const emptyRecipeContainer = () => {
  recipeThumbs.innerHTML = "";
};

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
