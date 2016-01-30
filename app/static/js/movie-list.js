(function ($) {
  // Initialize data from source
  $.get('/my-movies').then((data) => displayMovieList(data));

  // Interaction handlers.
  $(document).on('submit', '#add-movie', handleAddMovie);
  $('#movie-list').on('click', '[data-action="delete"]', handleDeleteMovie);
  $('#movie-list').on('click', '[data-action="edit"]', handleEditMovie);


  /**
   * Render the movie list from data.  Just render the whole thing instead of trying to render deltas.
   * clear the innerHTML ofthe movieList, build a fragment containing LIs, append the fragment and we are done.
   * Here we use the fact that appendChild returns the appended node so we can chain with appendChild(element).parentNode
   *
   * @param data
   * @returns {Element}
   */
  function displayMovieList(data) {
    const movieListElement = document.getElementById('movie-list');
    movieListElement.innerHTML = '';

    return movieListElement.appendChild(
      data.sort((one, two) => one.rating < two.rating)
        .map(dataToListElement)
        .reduce((fragment, elementToAdd) =>
          fragment.appendChild(elementToAdd).parentNode,
        document.createDocumentFragment())
    ).parentNode;
  }

  /**
   * Create one displayable list element that represents a movie
   * @param data
   * @returns {Element}
   */
  function dataToListElement(data) {
    const listElement = document.createElement('li');
    listElement.setAttribute('data-movie-id', data.id);
    listElement.innerHTML =
      `<div class="title"><h5>${data.name}</h5></div>
      <div class="rating">${Array.apply(null, {length: data.rating}).map(() => '*').join('')}</div>
      <div class="button"><button data-action="edit">edit</button><button data-action="delete">delete</button></div>`;
    return listElement;
  }

  function handleAddMovie(e) {
    e.preventDefault();
    const $form = $(e.target);

    $.post({
      url: $form.attr('action'),
      data: $form.serialize()
    }).then(displayMovieList);
  }

  function handleDeleteMovie(e) {
    return $.ajax({
      method: 'DELETE',
      url: `/my-movies/${getMovieIdFromButtonEvent(e)}`
    }).then(displayMovieList)
  }

  function handleEditMovie(e) {
    return $.ajax({
      method: 'PUT',
      data: $.param({ rating: window.prompt('Enter a new rating.') }),
      url: `/my-movies/${getMovieIdFromButtonEvent(e)}`
    }).then(displayMovieList)
  }

  function getMovieIdFromButtonEvent(e) {
    return parseInt($(e.target).parents('[data-movie-id]').first().attr('data-movie-id'), 10);
  }
}(window.jQuery));