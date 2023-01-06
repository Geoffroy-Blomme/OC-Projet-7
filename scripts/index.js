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
const appliancesSearchInput = document.querySelector("#appliance-search-input");

const ustensilsSearchInput = document.querySelector("#ustensils-search-input");

const dropdownListIngredients = document.querySelector(
  "#dropdownlist-ingredients"
);

const dropdownListAppliances = document.querySelector(
  "#dropdownlist-appliances"
);

const dropdownListUstensils = document.querySelector("#dropdownlist-ustensils");

const filterTags = document.querySelector(".filter-tags");

// va contenir les ingredients qui sont actuellement affiches dans le dropdown.
let currentlyShownIngredients = [];

let currentlyShownAppliances = [];

let currentlyShownUstensils = [];

// Va contenir les recettes qui sont actuellement affichees.
let currentRecipes = recipes;

// Va contenir les tags qui ont ete choisi par l'utilisateur
let currentTags = { ingredients: [], appliances: [], ustensils: [] };

const filterButtonIsClicked = (evt) => {
  const button = evt.currentTarget;
  button.parentNode.classList.toggle("opened");
  button.parentNode.querySelector("input").focus();
  const buttonSpan = button.querySelector(".filter-button__text");
  buttonSpan.classList.toggle("hidden");
};

const generateRecipThumbs = (data) => {
  const recipeModel = recipeFactory();
  const allRecipes = recipeModel.getRecipesThumbDOM(data);
  recipeThumbs.innerHTML = allRecipes;
};

const recipeSearchInputKeyDown = (evt) => {
  let inputValue = repiceSeachInput.value;
  const nbOfCharacters = parseInt(inputValue.length);

  // On va utiliser cette constante pour savoir si l'utilisateur a supprimer un caractere
  const deleteKeyCode = "8";
  if (evt) {
    if (evt.keyCode == deleteKeyCode) {
      // L'utilisateur a supprimer un caractere, nous devons faire la recherche a partir de tous les recettes.
      currentRecipes = recipes;
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

const startRecipeSearch = (arrayToSearchIn, inputValue) => {
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

const searchRepicesThatContainsTags = (arrayToSearchIn) => {
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

const getNbOfTagsSelected = () => {
  let nbOfTags = 0;
  let keys = Object.keys(currentTags);
  let tagsArray = keys.map((tag) => currentTags[tag]);
  for (let i = 0; i < tagsArray.length; i++) {
    nbOfTags += tagsArray[i].length;
  }
  return nbOfTags;
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

const searchRecipeForIngredient = (recipe, keyword) => {
  for (let i = 0; i < recipe.ingredients.length; i++) {
    if (
      recipe.ingredients[i].ingredient
        .toLowerCase()
        .includes(keyword.toLowerCase())
    ) {
      return true;
    }
  }
  return false;
};

const searchRecipeForUstensil = (recipe, keyword) => {
  for (let i = 0; i < recipe.ustensils.length; i++) {
    if (recipe.ustensils[i].toLowerCase().includes(keyword.toLowerCase())) {
      return true;
    }
  }
  return false;
};

const searchRecipeForAppliance = (recipe, keyword) => {
  return recipe.appliance.toLowerCase().includes(keyword.toLowerCase());
};

const emptyRecipeContainer = () => {
  recipeThumbs.innerHTML = "";
};

const noRecipesFound = () => {
  recipeThumbs.innerHTML = `<p> Aucune recette ne correspond à votre critère… vous pouvez
chercher « tarte aux pommes », « poisson », etc.
</p>`;
};

//Va mettre a jour les ingredients qui sont affiches dans le dropdown en fonction de se que l'utilisateur a saisi dans la barre de recherche des ingredients.
const ingredientsSearchInputUpdateDropdown = (evt) => {
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

const generateDropdownListDOM = (arrayToSearchIn, tagType) => {
  const recipeModal = recipeFactory();
  const finalDom = recipeModal.getDropdownListDOM(arrayToSearchIn, tagType);
  return finalDom;
};

// Renvoie un array contenant tous les ingredients presents dans l'array en argument, sans doublons.
const allIngredients = (arrayOfRecipes) => {
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
const ustensilsSearchInputUpdateDropdown = (evt) => {
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
const allUstensils = (arrayOfRecipes) => {
  let finalArray = [];
  arrayOfRecipes.map((recipe) => {
    recipe.ustensils.map((ustensil) => {
      addEltIfNotInArrayCaseInsensitive(ustensil, finalArray);
    });
  });
  return finalArray;
};

//Va mettre a jour les ingredients qui sont affiches dans le dropdown en fonction de se que l'utilisateur a saisi dans la barre de recherche des ingredients.
const appliancesSearchInputUpdateDropdown = (evt) => {
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

const allAppliances = (arrayOfRecipes) => {
  let finalArray = [];
  arrayOfRecipes.map((recipe) => {
    addEltIfNotInArrayCaseInsensitive(recipe.appliance, finalArray);
  });

  return finalArray;
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
  if (!currentTags[dataValue].includes(value)) {
    currentTags[dataValue].push(value);
  } else {
    const index = currentTags[dataValue].indexOf(value);
    currentTags[dataValue].splice(index, 1);
  }
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
  currentRecipes = recipes;
  recipeSearchInputKeyDown();
  ingredientsSearchInputUpdateDropdown();
  appliancesSearchInputUpdateDropdown();
  ustensilsSearchInputUpdateDropdown();
};

const ingredientsDropDownAdd = (arrayToSearchIn) => {
  const dropdownListDOM = generateDropdownListDOM(
    arrayToSearchIn,
    "ingredients"
  );
  dropdownListIngredients.innerHTML = dropdownListDOM;
  const dropdownListElements = dropdownListIngredients.querySelectorAll("li");
  Array.from(dropdownListElements).map((element) => {
    const value = element.querySelector("span").innerText;
    // On n'ajoute seulement l'eventListenre si l'element ne se trouve pas deja dans la liste des ingredients
    if (currentTags["ingredients"].indexOf(value) === -1) {
      element.addEventListener("click", addTag);
    }
  });
  currentlyShownIngredients = arrayToSearchIn;
};

const appliancesDropDownAdd = (arrayToSearchIn) => {
  const dropdownListDOM = generateDropdownListDOM(
    arrayToSearchIn,
    "appliances"
  );
  dropdownListAppliances.innerHTML = dropdownListDOM;
  const dropdownListElements = dropdownListAppliances.querySelectorAll("li");
  Array.from(dropdownListElements).map((element) => {
    const value = element.querySelector("span").innerText;
    // On n'ajoute seulement l'eventListener si l'element ne se trouve pas deja dans la liste des appliances
    if (currentTags["appliances"].indexOf(value) === -1) {
      element.addEventListener("click", addTag);
    }
  });

  currentlyShownAppliances = arrayToSearchIn;
};

const ustensilsDropDownAdd = (arrayToSearchIn) => {
  const dropdownListDOM = generateDropdownListDOM(arrayToSearchIn, "ustensils");
  dropdownListUstensils.innerHTML = dropdownListDOM;
  const dropdownListElements = dropdownListUstensils.querySelectorAll("li");
  for (let i = 0; i < dropdownListElements.length; i++) {
    const value = dropdownListElements[i].querySelector("span").innerText;
    // On n'ajoute seulement l'eventListenre si l'element ne se trouve pas deja dans la liste des ingredients
    if (currentTags["ustensils"].indexOf(value) === -1) {
      dropdownListElements[i].addEventListener("click", addTag);
    }
  }
  currentlyShownUstensils = arrayToSearchIn;
};

const addAllDropdowns = () => {
  const allUstensil = allUstensils(recipes);
  ustensilsDropDownAdd(allUstensil);
  const allAppliance = allAppliances(recipes);
  appliancesDropDownAdd(allAppliance);
  const allIngredient = allIngredients(recipes);
  ingredientsDropDownAdd(allIngredient);
};

// Retourne l'array mis en argument avec l'elt pousser dans l'array si l'elt n'a pas de doublon present dans l'array, en etant sensible a la casse.
// ainsi, addEltIfNotInArrayCaseInsensitive("tmp",["Tmp"]) retournera ["Tmp"]
const addEltIfNotInArrayCaseInsensitive = (elt, array) => {
  let arrayLowerCase = [];
  let eltLowerCase = elt.toLowerCase();
  for (let i = 0; i < array.length; i++) {
    arrayLowerCase.push(array[i].toLowerCase());
  }
  // L'element en minuscule ne se trouve pas dans l'array avec tous ses elements en minuscules, donc on ajoute l'element de base dans l'array
  if (!arrayLowerCase.includes(eltLowerCase)) {
    array.push(elt);
  }
  return array;
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
