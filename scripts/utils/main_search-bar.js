import { recipes } from "../../data/recipes.js";
import {
  searchRecipeForDescription,
  searchRecipeForIngredient,
} from "./search-recipe-for.js";
import {
  searchRepicesThatContainsTags,
  allAppliances,
  allUstensils,
  allIngredients,
  ustensilsDropDownAdd,
  appliancesDropDownAdd,
  ingredientsDropDownAdd,
} from "./tags.js";

import {
  emptyRecipeContainer,
  noRecipesFound,
  getNbOfTagsSelected,
  generateRecipThumbs,
} from "../index.js";

// Va contenir les recettes qui sont actuellement affichees.
let currentRecipes = recipes;

const repiceSeachInput = document.querySelector("#repice-seach-input");

export const recipeSearchInputKeyDown = (evt) => {
  let inputValue = repiceSeachInput.value;
  const nbOfCharacters = parseInt(inputValue.length);

  // On va utiliser cette constante pour savoir si l'utilisateur a supprimer un caractere
  const deleteKeyCode = "8";
  if (evt) {
    if (evt.keyCode == deleteKeyCode) {
      // L'utilisateur a supprimer un caractere, nous devons faire la recherche a partir de tous les recettes.
      resetCurrentRecipes();
      // On va seulement re-generer la totalite des recettes lorsqu'on passe de 3 caracteres a 2, car si on passe de 2 a 1, rien ne change.
      if (nbOfCharacters === 2) {
        currentRecipes = startRecipeSearch(currentRecipes, "");
      }
    }
  }

  if (nbOfCharacters >= 3) {
    currentRecipes = startRecipeSearch(currentRecipes, inputValue);
  } else {
    currentRecipes = startRecipeSearch(currentRecipes, "");
  }
};

// Rend sa valeur initialle a currentRecipes (elle contenira toutes les recettes).
export const resetCurrentRecipes = () => {
  currentRecipes = recipes;
};

// Lance la recherche.
export const startRecipeSearch = (arrayToSearchIn, inputValue) => {
  emptyRecipeContainer();
  let nbOfTagsSelected = getNbOfTagsSelected();
  let arrayContainTags;
  if (nbOfTagsSelected !== 0) {
    arrayContainTags = searchRepicesThatContainsTags(arrayToSearchIn);
  } else {
    arrayContainTags = recipes;
  }
  const arrayContainKeyword = searchRecipesThatContainsKeyword(
    arrayContainTags,
    inputValue
  );
  const allIngredient = allIngredients(arrayContainKeyword);
  ingredientsDropDownAdd(allIngredient);

  const allAppliance = allAppliances(arrayContainKeyword);
  appliancesDropDownAdd(allAppliance);

  const allUstensil = allUstensils(arrayContainKeyword);
  ustensilsDropDownAdd(allUstensil);

  if (arrayContainKeyword.length === 0) {
    noRecipesFound();
  } else {
    generateRecipThumbs(arrayContainKeyword);
  }
  return arrayContainKeyword;
};

// Renvoie un array contenant les elements de arrayToSearchIn qui contiennent dans leur titre, ingredients ou description le mot-cle mis en argument
const searchRecipesThatContainsKeyword = (arrayToSearchIn, keyword) => {
  let finalArray = [];
  for (let i = 0; i < arrayToSearchIn.length; i++) {
    if (searchRecipeForName(arrayToSearchIn[i], keyword)) {
      finalArray.push(arrayToSearchIn[i]);
    } else if (searchRecipeForDescription(arrayToSearchIn[i], keyword)) {
      finalArray.push(arrayToSearchIn[i]);
    } else if (searchRecipeForIngredient(arrayToSearchIn[i], keyword)) {
      finalArray.push(arrayToSearchIn[i]);
    }
  }
  return finalArray;
};

// Renvoie vrai si la recette contient le nom mis en parametre.
const searchRecipeForName = (recipe, keyword) => {
  if (recipe.name.toLowerCase().includes(keyword.toLowerCase())) {
    return true;
  } else {
    return false;
  }
};
