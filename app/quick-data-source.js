/**
 * A simple data provider.  Returns promises to demonstrate that it could easily be replaced
 * with some asynchronous i/o operations.
 */
export default class {
  constructor() {
    this.data = [
      {id: 0, name: 'The Lord of the Rings', rating: 4, isVisible: true},
      {id: 1, name: 'Star Wars: The Empire Strikes Back', rating: 5, isVisible: true},
      {id: 2, name: 'The Room', rating: 1, isVisible: true}
    ];

    this.currentId = 2;
  }

  get() {
    return Promise.resolve(this.visibleData);
  }

  /**
   * Post a new movie, but only if the title is unique.  If the title isn't unique,
   * just use the put method to update the rating.
   * @param req
   * @returns {Promise.<T>}
   */
  post(req) {
    let movieFromRequest = getMovieFromRequest(req),
      visibleActiveMovies = this.visibleData.filter(movie => movie.name === movieFromRequest.name);

    if (visibleActiveMovies.length === 0) {
      this.data.push(createNewMovie(movieFromRequest.name, movieFromRequest.rating, this.getNewId(), true));
    }

    // If there were matching movies, update the ratings with the put method,
    // if there were no matching movies this also works because Promise.all will immediately resolve
    return Promise.all(visibleActiveMovies.map(movie => this.put(movie.id, req)))
      .then(() => this.visibleData);
  }

  put(id, req) {
    this.visibleData
      .filter(movie => movie.id === id)
      .map(movie => movie.rating = getValidRatingFromRequest(req));
    return Promise.resolve(this.visibleData);
  }

  /**
   * Remove a movie.
   * @param id
   * @returns {Promise.<*>}
   */
  delete(id) {
    this.visibleData.filter(movie => movie.id === parseInt(id, 10)).forEach(movie => movie.isVisible = false);
    return Promise.resolve(this.visibleData);
  }

  get visibleData() {
    return this.data.filter(movie => movie.isVisible);
  }

  getNewId() {
    return ++this.currentId;
  }
}

function getMovieFromRequest(req) {
  return {
    name: req.body.name || 'Error Handling is Cool',
    rating: req.body.rating || 1
  }
}

function createNewMovie(name, rating, id, isVisible = true) {
  return {
    name,
    rating,
    id,
    isVisible
  }
}

function getValidRatingFromRequest(req) {
  let rating = parseInt(req.body.rating, 10);

  if(!isNaN(rating)) {
    rating = Math.max(Math.min(rating, 5), 1);
  } else {
    rating = 1;
  }
  return rating;
}