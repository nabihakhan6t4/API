const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");

// Event listeners for click and enter key search
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
// Listen for the 'Enter' key press
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getMealList();
  }
});

// Get meal list that matches with the ingredient
function getMealList() {
  let searchInputTxt = searchInput.value.trim();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `<div class="meal-item" data-id="${meal.idMeal}">
                <div class="meal-img">
                  <img
                    src="${meal.strMealThumb}"
                    alt="Meal Image"
                    class="img-fluid"
                  />
                </div>
                <div class="meal-name">
                  <h3>${meal.strMeal}</h3>
                  <a href="#" class="recipe-btn">Get Recipe</a>
                </div>
              </div>`;
        });
        mealList.classList.remove("notFound");
      } else {
        html = `No meals found. Please try a different ingredient.`;
        mealList.classList.add("notFound");
      }
      mealList.innerHTML = html; // Assign the generated HTML to the meal container
    })
    .catch((error) => {
      console.error("Error fetching meal data:", error);
    });
}

// Get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        mealRecipeModal(data.meals);
      })
      .catch((error) => {
        console.error("Error fetching meal recipe:", error);
      });
  }
}

// Create a modal to display recipe details
function mealRecipeModal(meal) {
  meal = meal[0]; // Get the first meal from the array
  let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
          <h3>Instructions:</h3>
          <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
          <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
          <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>`;

  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe"); // Show the modal
}

// Close the recipe modal
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});
