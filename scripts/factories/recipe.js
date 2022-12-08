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
            <span class="card-body__bottom-side__ingredient__quantity">
              ${ingredient.quantity || ""}${ingredient.unit || ""}
            </span>
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
  return { getRecipeThumbDOM, getRecipesThumbDOM };
}

/* <div class="recipe-thumb">
  <div class="card">
    <img class="card-img-top"></img>
    <div class="card-body">
      <div class="card-body__top-side">
        <div class="card-body__top-side__title">Limonade de Coco</div>
        <div class="card-body__top-side__time">
          <span class="fa-regular fa-clock card-body__top-side__time__icon"></span>
          <span class="card-body__top-side__time__text">10 min</span>
        </div>
      </div>
      <div class="card-body__bottom-side">
        <div class="card-body__bottom-side__ingredients">
          <span class="card-body__bottom-side__ingredient">
            <span class="card-body__bottom-side__ingredient__title">
              Lait de coco
            </span>
            <span class="card-body__bottom-side__ingredient__quantity">
              400ml
            </span>
          </span>
          <span class="card-body__bottom-side__ingredient">
            <span class="card-body__bottom-side__ingredient__title">
              Jus de citron
            </span>
            <span class="card-body__bottom-side__ingredient__quantity">2</span>
          </span>
          <span class="card-body__bottom-side__ingredient">
            <span class="card-body__bottom-side__ingredient__title">
              Créme de coco
            </span>
            <span class="card-body__bottom-side__ingredient__quantity">
              4 cuillères
            </span>
          </span>
          <span class="card-body__bottom-side__ingredient">
            <span class="card-body__bottom-side__ingredient__title">Sucre</span>
            <span class="card-body__bottom-side__ingredient__quantity">
              20g
            </span>
          </span>
          <span class="card-body__bottom-side__ingredient">
            <span class="card-body__bottom-side__ingredient__title">
              Glaçons
            </span>
            <span class="card-body__bottom-side__ingredient__quantity">2</span>
          </span>
        </div>
        <div class="card-body__bottom-side__description">
          Mettre les glaçons à votre goût dans le blender, ajouter le lait, la
          crème de coco, le jus de 2 citrons et le sucre. Mixer jusqu'à avoir la
          consistence désirée.
        </div>
      </div>
    </div>
  </div>
</div>; */
