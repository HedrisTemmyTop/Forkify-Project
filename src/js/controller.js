import * as model from './module.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import paginationView from './views/paginationView.js';

///////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    //  0.)
    resultsView.update(model.getSearchResultsPage());

    // 1.) Load a spinner
    recipeView.renderSpiner();

    // 2.) Loading recipe
    await model.loadRecipe(id);

    // 3.) Rendering reipe
    recipeView.render(model.state.recipe);

    // 4.) Bookmarks

    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  //1.) Get search query
  const query = searchView.getQuery();
  if (!query) return;
  resultsView.renderSpiner();

  // 2.) Load search results
  await model.loadSearchResult(query);

  // 3.) Render Search results
  resultsView.render(model.getSearchResultsPage(1));

  // 4.) Render initial pagination buttons
  PaginationView.render(model.state.search);

  try {
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3.) Render NEW Search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4.) Render initial pagination buttons
  PaginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servigns (in servings)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1.) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2.) update recipe view
  recipeView.update(model.state.recipe);

  // 3.) Render bookmarks

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlerAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpiner();
    // Upload recipe
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`Err 💥`, err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpadateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlerAddRecipe);
};

init();

// const clearBookmarks = function(){
//   localStorage.clear("bookmarks")
// }
// clearBookmarks();
