import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./Components/MoviesList";
import AddMovie from "./Components/AddMovie";
import "./App.css";

function App() {
  console.log("app.js");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const addMovieHandler = async (data) => {
    try {
      const response = await fetch(
        "https://react-http-6be32-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Something Went Wrong");
      }
      const responseData = await response.json();
      console.log(responseData);

      setMovies((prevState) => {
        return [...prevState, { ...data, id: responseData.name }];
      });
    } catch (e) {
      setError(e.message);
    }
  };
  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://react-http-6be32-default-rtdb.firebaseio.com/movies.json"
      );
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const data = await res.json();

      const transformedMovies = [];
      for (let key in data) {
        transformedMovies.push({
          id: key,
          title: data[key].title,
          releaseDate: data[key].releaseDate,
          openingText: data[key].openingText,
        });
      }

      setMovies(transformedMovies);
    } catch (e) {
      setError(e.message);
    }

    setIsLoading(false);
  }, []);
  useEffect(() => {
    console.log("in effect");
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {isLoading && <p>Loading ......</p>}
        {!error && !isLoading && movies.length === 0 && <p>Found No movies</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
