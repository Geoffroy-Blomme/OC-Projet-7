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
const filterTags = document.querySelector(".filter-tags");

// Va contenir les recettes qui sont actuellement affichees.
let currentRecipes = recipes;

// Va contenir les tags qui ont ete choisi par l'utilisateur
const tags = { ingredients: [], appliances: [], ustensils: [] };
let currentTags = tags;

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

const repiceSearchInputKeyDown = (evt) => {
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

  ingredientsDropDownAdd(arrayContainKeyword);

  if (arrayContainKeyword.length === 0) {
    noRecipesFound();
  } else {
    generateRecipThumbs(arrayContainKeyword);
  }
  return arrayContainKeyword;
};

const searchRepicesThatContainsTags = (arrayToSearchIn) => {
  let finalArray = [];
  for (let i = 0; i < arrayToSearchIn.length; i++) {
    // bool va verifier que la recette va contenir chaque tag.
    let bool = true;
    for (let t = 0; t < currentTags["ingredients"].length; t++) {
      if (
        searchRecipeForIngredient(
          arrayToSearchIn[i],
          currentTags["ingredients"][t]
        )
      ) {
        bool = true;
      } else {
        bool = false;
      }
    }
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

const emptyRecipeContainer = () => {
  recipeThumbs.innerHTML = "";
};

const noRecipesFound = () => {
  recipeThumbs.innerHTML = `<p>« Aucune recette ne correspond à votre critère… vous pouvez
chercher « tarte aux pommes », « poisson », etc.
</p>`;
};

const ingredientsDropdownListDOM = (arrayToSearchIn) => {
  const recipeModal = recipeFactory();
  const allIngredient = allIngredients(arrayToSearchIn);
  const finalDom = recipeModal.getDropdownListDOM(allIngredient, "ingredients");
  return finalDom;
};

// Renvoie un array contenant tous les ingredients presents dans l'array en argument, sans doublons.
const allIngredients = (arrayOfRecipes) => {
  let finalArray = [];
  for (let i = 0; i < arrayOfRecipes.length; i++) {
    for (let t = 0; t < arrayOfRecipes[i].ingredients.length; t++) {
      addEltIfNotInArrayCaseInsensitive(
        arrayOfRecipes[i].ingredients[t].ingredient,
        finalArray
      );
    }
  }

  return finalArray;
};

const ustensilsGenerateDropdownList = () => {
  const recipeModal = recipeFactory();
  const allUstensil = allUstensils(currentRecipes);
  const finalDom = recipeModal.getDropdownListDOM(allUstensil, "ustensils");
  return finalDom;
};

const allUstensils = (arrayOfRecipes) => {
  let finalArray = [];
  for (let i = 0; i < arrayOfRecipes.length; i++) {
    for (let t = 0; t < arrayOfRecipes[i].ustensils.length; t++) {
      addEltIfNotInArrayCaseInsensitive(
        arrayOfRecipes[i].ustensils[t],
        finalArray
      );
    }
  }
  return finalArray;
};

const appliancesGenerateDropdownList = () => {
  const recipeModal = recipeFactory();
  const allAppliance = allAppliances(currentRecipes);
  const finalDom = recipeModal.getDropdownListDOM(allAppliance, "appliances");
  return finalDom;
};

const allAppliances = (arrayOfRecipes) => {
  let finalArray = [];
  for (let i = 0; i < arrayOfRecipes.length; i++) {
    addEltIfNotInArrayCaseInsensitive(arrayOfRecipes[i].appliance, finalArray);
  }
  return finalArray;
};

const addTag = (evt) => {
  const dataValue = evt.currentTarget.getAttribute("data-value");
  const value = evt.currentTarget.querySelector("span").innerText;
  toggleTagValue(dataValue, value);
  makeFilterTag(evt.currentTarget, value);
  repiceSearchInputKeyDown();
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
  repiceSearchInputKeyDown();
};

const ingredientsDropDownAdd = (arrayToSearchIn) => {
  const dropdownListDOM = ingredientsDropdownListDOM(arrayToSearchIn);
  const dropdownList = document.querySelector("#dropdownlist-ingredients");
  dropdownList.innerHTML = dropdownListDOM;
  const dropdownListElements = dropdownList.querySelectorAll("li");
  for (let i = 0; i < dropdownListElements.length; i++) {
    const value = dropdownListElements[i].querySelector("span").innerText;
    // On n'ajoute seulement l'eventListenre si l'element ne se trouve pas deja dans la liste des ingredients
    if (currentTags["ingredients"].indexOf(value) === -1) {
      dropdownListElements[i].addEventListener("click", addTag);
    }
  }
};

const ustensilsDropDownAdd = () => {
  const dropdownListDOM = ustensilsGenerateDropdownList();
  const dropdownList = document.querySelector("#dropdownlist-ustensils");
  dropdownList.innerHTML = dropdownListDOM;
  const dropdownListElements = dropdownList.querySelectorAll("li");
  for (let i = 0; i < dropdownListElements.length; i++) {
    dropdownListElements[i].addEventListener("click", addTag);
  }
};

const appliancesDropDownAdd = () => {
  const dropdownListDOM = appliancesGenerateDropdownList();
  const dropdownList = document.querySelector("#dropdownlist-appliances");
  dropdownList.innerHTML = dropdownListDOM;
  const dropdownListElements = dropdownList.querySelectorAll("li");
  for (let i = 0; i < dropdownListElements.length; i++) {
    dropdownListElements[i].addEventListener("click", addTag);
  }
};

const addAllDropdowns = () => {
  ustensilsDropDownAdd(recipes);
  appliancesDropDownAdd(recipes);
  ingredientsDropDownAdd(recipes);
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
  repiceSeachInput.addEventListener("keyup", repiceSearchInputKeyDown);
};
const init = () => {
  setupEventListeners();
  generateRecipThumbs(recipes);
  addAllDropdowns();
};

init();
