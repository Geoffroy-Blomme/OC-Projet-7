import {
  searchRecipeForIngredient,
  searchRecipeForAppliance,
  searchRecipeForUstensil,
} from "./search-recipe-for.js";
import { recipes } from "../../data/recipes.js";
import { recipeFactory } from "../factories//recipe.js";
import { recipeSearchInputKeyDown } from "./main_search-bar.js";
// Va contenir les tags qui ont ete choisi par l'utilisateur
let currentTags = { ingredients: [], appliances: [], ustensils: [] };

const dropdownListIngredients = document.querySelector(
  "#dropdownlist-ingredients"
);

const dropdownListAppliances = document.querySelector(
  "#dropdownlist-appliances"
);

const dropdownListUstensils = document.querySelector("#dropdownlist-ustensils");

const filterTags = document.querySelector(".filter-tags");

export const ingredientsSearchInput = document.querySelector(
  "#ingredients-search-input"
);
export const appliancesSearchInput = document.querySelector(
  "#appliance-search-input"
);

export const ustensilsSearchInput = document.querySelector(
  "#ustensils-search-input"
);

// va contenir les ingredients qui sont actuellement affiches dans le dropdown.
let currentlyShownIngredients = [];

let currentlyShownAppliances = [];

let currentlyShownUstensils = [];

export const returnCurrentTags = () => {
  return currentTags;
};
export const searchRepicesThatContainsTags = (arrayToSearchIn) => {
  let finalArray = [];
  for (let i = 0; i < arrayToSearchIn.length; i++) {
    const bool =
      checkIfRecipeHasAllIngredients(arrayToSearchIn[i]) &&
      checkIfRecipeHasAllAppliances(arrayToSearchIn[i]) &&
      checkIfRecipeHasAllUstensils(arrayToSearchIn[i]);
    if (bool) {
      //On ajoute seulement si l'element n'est pas deja present dans l'array
      if (finalArray.indexOf(arrayToSearchIn[i]) === -1) {
        finalArray.push(arrayToSearchIn[i]);
      }
    }
  }
  return finalArray;
};

const checkIfRecipeHasAllAppliances = (recipe) => {
  if (currentTags["appliances"].length === 0) {
    return true;
  }
  for (let i = 0; i < currentTags["appliances"].length; i++) {
    if (!searchRecipeForAppliance(recipe, currentTags["appliances"][i])) {
      return false;
    }
  }
  return true;
};

const checkIfRecipeHasAllIngredients = (recipe) => {
  if (currentTags["ingredients"].length === 0) {
    return true;
  }
  for (let i = 0; i < currentTags["ingredients"].length; i++) {
    if (!searchRecipeForIngredient(recipe, currentTags["ingredients"][i])) {
      return false;
    }
  }
  return true;
};

const checkIfRecipeHasAllUstensils = (recipe) => {
  if (currentTags["ustensils"].length === 0) {
    return true;
  }
  for (let i = 0; i < currentTags["ustensils"].length; i++) {
    if (!searchRecipeForUstensil(recipe, currentTags["ustensils"][i])) {
      return false;
    }
  }
  return true;
};

// Retourne l'array mis en argument avec l'elt pousser dans l'array si l'elt n'a pas de doublon present dans l'array, en etant sensible a la casse.
// ainsi, addEltIfNotInArrayCaseInsensitive("tmp",["Tmp"]) retournera ["Tmp"]
const addEltIfNotInArrayCaseInsensitive = (elt, array) => {
  let arrayLowerCase = [];
  let eltLowerCase = elt.toLowerCase();
  array.map((elt) => {
    arrayLowerCase.push(elt.toLowerCase());
  });
  // L'element en minuscule ne se trouve pas dans l'array avec tous ses elements en minuscules, donc on ajoute l'element de base dans l'array
  if (!arrayLowerCase.includes(eltLowerCase)) {
    array.push(elt);
  }
  return array;
};

export const addAllDropdowns = () => {
  const allUstensil = allUstensils(recipes);
  ustensilsDropDownAdd(allUstensil);
  const allAppliance = allAppliances(recipes);
  appliancesDropDownAdd(allAppliance);
  const allIngredient = allIngredients(recipes);
  ingredientsDropDownAdd(allIngredient);
};

export const allAppliances = (arrayOfRecipes) => {
  let finalArray = [];
  arrayOfRecipes.map((recipe) => {
    addEltIfNotInArrayCaseInsensitive(recipe.appliance, finalArray);
  });

  return finalArray;
};

export const ingredientsDropDownAdd = (arrayToSearchIn) => {
  const dropdownListDOM = generateDropdownListDOM(
    arrayToSearchIn,
    "ingredients"
  );
  dropdownListIngredients.innerHTML = dropdownListDOM;
  const dropdownListElements = dropdownListIngredients.querySelectorAll("li");
  Array.from(dropdownListElements).map((element) => {
    const value = element.querySelector("span").innerText;
    // On n'ajoute seulement l'eventListenre si l'element ne se trouve pas deja dans la liste des ingredients
    if (returnCurrentTags()["ingredients"].indexOf(value) === -1) {
      element.addEventListener("click", addTag);
    }
  });
  currentlyShownIngredients = arrayToSearchIn;
};

export const appliancesDropDownAdd = (arrayToSearchIn) => {
  const dropdownListDOM = generateDropdownListDOM(
    arrayToSearchIn,
    "appliances"
  );
  dropdownListAppliances.innerHTML = dropdownListDOM;
  const dropdownListElements = dropdownListAppliances.querySelectorAll("li");
  Array.from(dropdownListElements).map((element) => {
    const value = element.querySelector("span").innerText;
    // On n'ajoute seulement l'eventListener si l'element ne se trouve pas deja dans la liste des appliances
    if (returnCurrentTags()["appliances"].indexOf(value) === -1) {
      element.addEventListener("click", addTag);
    }
  });

  currentlyShownAppliances = arrayToSearchIn;
};

const generateDropdownListDOM = (arrayToSearchIn, tagType) => {
  const recipeModal = recipeFactory();
  const finalDom = recipeModal.getDropdownListDOM(arrayToSearchIn, tagType);
  return finalDom;
};

export const ustensilsDropDownAdd = (arrayToSearchIn) => {
  const dropdownListDOM = generateDropdownListDOM(arrayToSearchIn, "ustensils");
  dropdownListUstensils.innerHTML = dropdownListDOM;
  const dropdownListElements = dropdownListUstensils.querySelectorAll("li");
  for (let i = 0; i < dropdownListElements.length; i++) {
    const value = dropdownListElements[i].querySelector("span").innerText;
    // On n'ajoute seulement l'eventListenre si l'element ne se trouve pas deja dans la liste des ingredients
    if (returnCurrentTags()["ustensils"].indexOf(value) === -1) {
      dropdownListElements[i].addEventListener("click", addTag);
    }
  }
  currentlyShownUstensils = arrayToSearchIn;
};

const makeFilterTag = (tag, value) => {
  const tagtext = tag.getAttribute("data-value");
  const filterTag = document.createElement("div");
  filterTag.classList.add("filter-tag", `filter-tag-${tagtext}`);
  const filterTagIcon = document.createElement("span");
  filterTagIcon.classList.add(
    "fa-regular",
    "fa-circle-xmark",
    "fa-xl",
    "filter-tag__icon"
  );

  filterTag.innerHTML = `<span class="filter-tag__text">${value}</span> 
  <span class="   "></span>`;
  filterTag.appendChild(filterTagIcon);
  filterTags.appendChild(filterTag);
  filterTagIcon.addEventListener("click", () => {
    removeFilterTag(tag, filterTag);
  });
};

const removeFilterTag = (tag, filterTag) => {
  filterTags.removeChild(filterTag);
  tag.setAttribute("filtering", "false");
  toggleTagValue(
    tag.getAttribute("data-value"),
    tag.querySelector("span").innerText
  );
  recipeSearchInputKeyDown();
  ingredientsSearchInputUpdateDropdown();
  appliancesSearchInputUpdateDropdown();
  ustensilsSearchInputUpdateDropdown();
};

const addTag = (evt) => {
  const dataValue = evt.currentTarget.getAttribute("data-value");
  const value = evt.currentTarget.querySelector("span").innerText;
  toggleTagValue(dataValue, value);
  makeFilterTag(evt.currentTarget, value);
  recipeSearchInputKeyDown();
  ingredientsSearchInputUpdateDropdown();
  ingredientsSearchInput.value = "";
  appliancesSearchInputUpdateDropdown();
  appliancesSearchInput.value = "";
  ustensilsSearchInputUpdateDropdown();
  ustensilsSearchInput.value = "";
};

const toggleTagValue = (dataValue, value) => {
  if (!returnCurrentTags()[dataValue].includes(value)) {
    returnCurrentTags()[dataValue].push(value);
  } else {
    const index = returnCurrentTags()[dataValue].indexOf(value);
    returnCurrentTags()[dataValue].splice(index, 1);
  }
};

//Va mettre a jour les ingredients qui sont affiches dans le dropdown en fonction de se que l'utilisateur a saisi dans la barre de recherche des ingredients.
export const ustensilsSearchInputUpdateDropdown = (evt) => {
  if (evt) {
    // Si l'utilisateur supprime un caractere, il faut refaire une recherche
    if (evt.keyCode == "8") {
      recipeSearchInputKeyDown();
    }
  }
  let finalArray = [];

  currentlyShownUstensils.map((ustensil) => {
    const ustensilsSearchValueLowerCase =
      ustensilsSearchInput.value.toLowerCase();
    const currentlyShownUstensilsLowerCase = ustensil.toLowerCase();
    if (
      currentlyShownUstensilsLowerCase.includes(ustensilsSearchValueLowerCase)
    ) {
      finalArray.push(ustensil);
    }
  });

  ustensilsDropDownAdd(finalArray);
};

// Renvoie tous les ustensils qui se trouvent dans les recettes contenues dans l'array mis en parametre, sans doublons
export const allUstensils = (arrayOfRecipes) => {
  let finalArray = [];
  arrayOfRecipes.map((recipe) => {
    recipe.ustensils.map((ustensil) => {
      addEltIfNotInArrayCaseInsensitive(ustensil, finalArray);
    });
  });
  return finalArray;
};

//Va mettre a jour les ingredients qui sont affiches dans le dropdown en fonction de se que l'utilisateur a saisi dans la barre de recherche des ingredients.
export const appliancesSearchInputUpdateDropdown = (evt) => {
  if (evt) {
    // Si l'utilisateur supprime un caractere, il faut refaire une recherche
    if (evt.keyCode == "8") {
      recipeSearchInputKeyDown();
    }
  }
  let finalArray = [];

  currentlyShownAppliances.map((appliance) => {
    const appliancesSearchValueLowerCase =
      appliancesSearchInput.value.toLowerCase();
    const currentlyShownApplianceLowerCase = appliance.toLowerCase();
    if (
      currentlyShownApplianceLowerCase.includes(appliancesSearchValueLowerCase)
    ) {
      finalArray.push(appliance);
    }
  });

  appliancesDropDownAdd(finalArray);
};

// Renvoie un array contenant tous les ingredients presents dans l'array en argument, sans doublons.
export const allIngredients = (arrayOfRecipes) => {
  let finalArray = [];
  arrayOfRecipes.map((recipe) => {
    recipe.ingredients.map((ingredientObject) => {
      addEltIfNotInArrayCaseInsensitive(
        ingredientObject.ingredient,
        finalArray
      );
    });
  });
  return finalArray;
};

//Va mettre a jour les ingredients qui sont affiches dans le dropdown en fonction de se que l'utilisateur a saisi dans la barre de recherche des ingredients.
export const ingredientsSearchInputUpdateDropdown = (evt) => {
  if (evt) {
    // Si l'utilisateur supprime un caractere, il faut refaire une recherche
    if (evt.keyCode == "8") {
      recipeSearchInputKeyDown();
    }
  }
  let finalArray = [];
  currentlyShownIngredients.map((ingredient) => {
    const ingredientsSearchValueLowerCase =
      ingredientsSearchInput.value.toLowerCase();
    const currentlyShownIngredientLowerCase = ingredient.toLowerCase();
    if (
      currentlyShownIngredientLowerCase.includes(
        ingredientsSearchValueLowerCase
      )
    ) {
      finalArray.push(ingredient);
    }
  });
  ingredientsDropDownAdd(finalArray);
};
