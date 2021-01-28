import React, { useState, useEffect } from 'react'
import './App.css'
import placeholderImg from './placeholder.png'
import { ReactComponent as ChevronLeft } from './chevron-left.svg'
import { ReactComponent as ChevronRight } from './chevron-right.svg'

function App() {
  const [searchResult, setSearchResult] = useState()
  const [counter, setCounter] = useState({})
  const [films, setFilms] = useState("");
  const [newSearch, setNewSearch] = useState()

  useEffect(() => {
    if (counter.page) {
      setNewSearch(false)

      const search = async () => {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=a461e386&s=${films}&page=${counter.page}`,
        )
        const filmData = await response.json()
        setSearchResult(filmData)
      }
      try {
        search()
      }
      catch (error) { console.log(error) }
    }
  }, [counter.page, newSearch])


  const handleSubmit = e => {
    
    e.preventDefault()
    setNewSearch(true)
    setCounter({ page: 1 })
  }

  const changePage = (num) => {

    setCounter({ page: counter.page + num })

  }

  return (
    <div className="App">
      <div className="search">
        <input type="text" placeholder="Search..." onChange={e => setFilms(e.target.value)} />
        <button onClick={handleSubmit}>Search</button>
      </div>
      {searchResult === undefined ? (
        <p className="p-msg">Search your favourite films</p>
      ) : (
          searchResult.Search !== undefined ?
            <div className="search-results">
              <div className="chevron">
                <ChevronLeft onClick={counter.page > 1 ? () => changePage(-1) : null} />
              </div>
              <div className="search-results-list">
                {searchResult.Search.map(result => (
                  <div key={result.imdbID} className="search-item">
                    <img
                      src={result.Poster === 'N/A' ? placeholderImg : result.Poster}
                      alt="poster"
                    />
                    <div className="search-item-data">
                      <div className="title">{result.Title}</div>
                      <div className="meta">{`${result.Type} | ${result.Year}`}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chevron">
                <ChevronRight onClick={() => changePage(1)} />
              </div>
            </div>
            :
            counter.page > 1 ? <>
              <p className="p-msg">There isnt' more films</p>
              <div className="chevron">
                <button className="back" onClick={counter.page > 1 ? () => changePage(-1) : null} > Go back</button>
              </div>            </>
              :
              <p className="p-msg">There are no films by that name</p>

        )}
    </div>
  )
}

export default App
