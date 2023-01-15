const searchRecipeForUstensil = (recipe, keyword) => {
  let bool = false;
  recipe.ustensils.map((ustensilObject) => {
    if (ustensilObject.toLowerCase().includes(keyword.toLowerCase())) {
      bool = true;
    }
  });
  return bool;
};

const searchRecipeForAppliance = (recipe, keyword) => {
  return recipe.appliance.toLowerCase().includes(keyword.toLowerCase());
};

const searchRecipeForDescription = (recipe, keyword) => {
  if (recipe.description.toLowerCase().includes(keyword.toLowerCase())) {
    return true;
  } else {
    return false;
  }
};

const searchRecipeForIngredient = (recipe, keyword) => {
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

export {
  searchRecipeForAppliance,
  searchRecipeForDescription,
  searchRecipeForIngredient,
  searchRecipeForUstensil,
};
