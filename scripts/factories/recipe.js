export function recipeFactory() {
  function getRecipesThumbDOM(data) {
    const allRecipes = document.createDocumentFragment();
    allRecipes.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      const recipeDOM = getRecipeThumbDOM(data[i]);
      allRecipes.innerHTML += recipeDOM;
    }
    return allRecipes.innerHTML;
  }
  function getRecipeThumbDOM(recipe) {
    const {
      id,
      name,
      servings,
      ingredients,
      time,
      description,
      appliance,
      ustensils,
    } = recipe;
    function getIngrendientsDOM(ingredients) {
      let dom = ``;
      ingredients.map((ingredient) => {
        dom += `<span class="card-body__bottom-side__ingredient">
            <span class="card-body__bottom-side__ingredient__title">
              ${ingredient.ingredient || ""}
            </span>
            ${
              ingredient.quantity
                ? `: <span class="card-body__bottom-side__ingredient__quantity"> 
              ${ingredient.quantity || ""}${ingredient.unit || ""}
              </span>`
                : ""
            }
        </span>`;
      });
      return dom;
    }
    return `
    <div class="recipe-thumb">
  <div class="card">
    <img class="card-img-top"></img>
    <div class="card-body">
      <div class="card-body__top-side">
        <div class="card-body__top-side__title">${name || ""}</div>
        <div class="card-body__top-side__time">
          <span class="fa-regular fa-clock card-body__top-side__time__icon"></span>
          <span class="card-body__top-side__time__text">${time || ""} min</span>
        </div>
      </div>
      <div class="card-body__bottom-side">
        <div class="card-body__bottom-side__ingredients">
         ${getIngrendientsDOM(ingredients)}
        </div>
        <div class="card-body__bottom-side__description">
          <p class="card-body__bottom-side__description__text">${
            description || ""
          }</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
  }

  function getDropdownListDOM(array, tagType) {
    let dom = ``;

    array.forEach((elt) => {
      dom += `<li filtering="false" data-value="${tagType}"><span>${elt}</span></li>`;
    });
    return dom;
  }

  return { getRecipeThumbDOM, getRecipesThumbDOM, getDropdownListDOM };
}
