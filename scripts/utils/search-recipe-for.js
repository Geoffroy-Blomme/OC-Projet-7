const searchRecipeForUstensil = (recipe, keyword) => {
  let bool = false;
  for (let i = 0; i < recipe.ustensils.length; i++) {
    if (recipe.ustensils[i].toLowerCase().includes(keyword.toLowerCase())) {
      bool = true;
    }
  }

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
  for (let i = 0; i < recipe.ingredients.length; i++) {
    if (
      recipe.ingredients[i].ingredient
        .toLowerCase()
        .includes(keyword.toLowerCase())
    ) {
      bool = true;
    }
  }

  return bool;
};

export {
  searchRecipeForAppliance,
  searchRecipeForDescription,
  searchRecipeForIngredient,
  searchRecipeForUstensil,
};
