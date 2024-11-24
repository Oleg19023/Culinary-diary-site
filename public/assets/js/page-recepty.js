// Завантаження рецептів з JSON
function loadRecipes() {
    fetch('./recipes.json')
      .then(response => response.json())
      .then(recipes => renderRecipes(recipes))
      .catch(error => console.error('Помилка завантаження рецептів:', error));
}
  
// Рендеринг рецептів
function renderRecipes(recipes) {
    const container = document.getElementById('recipeContainer');
    container.innerHTML = recipes.map(createRecipeCard).join('');
}
  
// Створення картки рецепта
function createRecipeCard(recipe) {
    const { title, image, ingredients, steps, cuisineFlag } = recipe;

    return `
      <div class="card mb-4 shadow">
        <img src="${image}" alt="${title}" class="card-img-top" style="max-height: 300px; object-fit: cover;">
        <div class="card-body">
          <h2 class="card-title">
            <span class="fi fi-${cuisineFlag} me-2"></span> 
            ${title}
          </h2>
          <h5 class="mt-3">Інгредієнти</h5>
          <ul>
            ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
          </ul>
          <h5 class="mt-3">Як готувати</h5>
          <ol>
            ${steps.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>
      </div>
    `;
}   

// Завантаження рецептів при завантаженні сторінки
document.addEventListener('DOMContentLoaded', loadRecipes);

  












