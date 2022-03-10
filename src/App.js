import React from "react";
import { useState, useEffect, useRef } from "react";
import { createApi } from "unsplash-js";
import "./App.css";

let defaultQuery = "people";

const App = () => {
  let searchRef = useRef("");
  let [photos, setPhotos] = useState([]);
  let [word, setWord] = useState("");
  let [pages, setPages] = useState(1);
  let [totalPages, setTotalPages] = useState(2);
  let [loading, setLoading] = useState(false);

  const accessKey = "VgOxJcWR2EZ7-vgUGZIITk6BgJf72J_mHo_ubRT-KPw";
  let a;
  let handleClick = () => {
    if (
      searchRef.current.value === undefined ||
      searchRef.current.value.length === 0
    ) {
      return;
    } else {
      a = searchRef.current.value;
      viewPhotos(a);
      setPages(0);
    }
    setWord(searchRef.current.value);
  };

  const unsplash = createApi({
    accessKey,
  });

  const viewPhotos = (query, page) => {
    console.log({ query, page });
    setLoading(true);
    return unsplash.search
      .getPhotos({
        query: query,
        page: page,
        perPage: 10,
        color: "green",
        orderBy: "latest",
        orientation: "portrait",
      })
      .then((res) => {
        let d = res.response.results;
        if (page === undefined) {
          setPhotos(res.response.results);
        } else {
          let newPhotos = [...photos, ...d];
          setPhotos(newPhotos);
        }
        console.log("totalpages:", res.response.total_pages);
        setTotalPages(res.response.total_pages);
        setLoading(false);
      });
  };

  useEffect(() => {
    viewPhotos(defaultQuery);
  }, []);

  let loadPage = () => {
    if (pages <= totalPages) {
      let current_page = pages;
      let next_page = current_page + 1;

      viewPhotos(searchRef.current.value || defaultQuery, next_page).then(
        () => {
          setPages(next_page);
        }
      );
    }
  };

  return (
    <div id="container" className="flex  flex-col">
      <header
        className="
      flex 
      bg-inherit 
      p-6
      flex-row 
        "
      >
        <nav
          className="
        justify-around 
        items-stretch 
        flex 
        bg-inherit 
        flex-row 
        justify-items-stretch
        "
        >
          <span id="logo" className="font-bold underline">
            <h2
              className="
            font-mono
            font-bold
            text-3xl
            decoration-sky-300
            text-sky-300
            "
            >
              PhotoView
            </h2>
          </span>
          <input
            type="search"
            ref={searchRef}
            className="
            p-2 
            rounded
            drop-shadow-md
            outline-none
            hover:shadow-md
            border
            border-black
            ml-32 
            w-80
            "
            name=""
            id=""
          />
          <button
            className="
          border-solid
          p-1
          bg-sky-300
          border
          rounded
          border-black
          tracking-wider
          "
            onClick={() => handleClick()}
          >
            SEARCH
          </button>
        </nav>
      </header>

      <div className="p-4">
        <span>
          <h1>Search results for: {word}</h1>
        </span>
        <div
          className="
        grid
        grid-cols-3
        "
        >
          {photos.length !== 0
            ? photos.map((val, i) => {
                return (
                  <div
                    className="
                  m-2"
                  >
                    <img
                      src={val.urls.small}
                      key={val.id}
                      alt={val.alt_description}
                    />
                  </div>
                );
              })
            : "loading..."}
        </div>

        <div
          style={{
            padding: 40,
          }}
        >
          <button
            className="
          border-solid
          p-1
          bg-sky-300
          border
          rounded
          border-black
          tracking-wider
          "
            disabled={loading}
            onClick={() => {
              return loadPage();
            }}
          >
            load more {pages}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
