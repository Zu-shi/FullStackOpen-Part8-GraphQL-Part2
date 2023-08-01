import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ALL_GENRES } from "../queries"
import { useEffect, useState } from "react"

const Books = (props) => {
  const [selectedGenres, setSelectedGenres] = useState([])
  const books = useQuery(ALL_BOOKS,
    { variables: { genres: selectedGenres.filter((g) => g.selected).map(g => g.name) } })
  const allGenres = useQuery(ALL_GENRES)

  useEffect(() => {
    if (allGenres.isLoading || !allGenres.data) { return }
    const genreMap = allGenres.data.allGenres.map((g) => ({
      name: g,
      selected: g === props.recs
    }))
    setSelectedGenres(genreMap)
  }, [allGenres, props.token, props.recs])

  //const [genres, setGenres] = useState([]) // Array of true/false ordered alphabetically, for selection

  // let genresTempMap = {};
  // let genresTempArr = [];

  // useEffect(() => {
  //   if (books.data) {
  //     console.log(books.data)
  //     books.data.allBooks.forEach((b) => {
  //       b.genres.forEach((g) => {
  //         genresTempMap[g] = true;
  //       })
  //     })

  //     for (const [key,] of Object.entries(genresTempMap)) {
  //       genresTempArr.push(key)
  //     }

  //     // What happens if new genre is added? Need to map it w/ previous genres to figure it out.
  //     genresTempArr.sort()

  //     console.log("test")
  //     console.log(props.recs)
  //     console.log(genresTempArr)
  //     setGenres(genresTempArr.map((g, index) => {
  //       return { index, name: g, selected: g === props.recs ? true : false } // to update logic to keep in place on new
  //     }))
  //   }
  // }, [books, props.token])

  // The problem is that when books update, genres need to update, but updating genres causes a redraw
  // The useState is being used for two different things here:
  // 1: create the array where people can change state with
  // 2: store data used to create the states
  // What is the solution?

  if (!props.show) {
    return null
  }

  if (allGenres.loading || !allGenres.data) {
    return <div>genres are loading</div>
  }

  if (books.loading) {
    return <div>books are loading</div>
  }

  const handleChange = (evt) => {
    console.log("selected", selectedGenres)
    console.log(evt.target.checked)
    const selectedGenresCopy = JSON.parse(JSON.stringify(selectedGenres)) // this is a shallow copy
    const found = selectedGenresCopy.find((g) => (g.name === evt.target.id))
    console.log(evt)
    if (found) {
      console.log(evt.target.id, "found", evt.target.checked)
      found.selected = evt.target.checked
    }
    else {
      console.log(evt.target.id, "not found")
    }

    setSelectedGenres(
      selectedGenresCopy
    )

    books.refetch({ genres: selectedGenresCopy.filter((g) => g.selected).map(g => g.name) })
  }

  console.log(allGenres)
  const genreSelector =
    props.recs ? <></> :
      allGenres.data.allGenres.map((g) => {
        // console.log(g)
        return (
          <label key={g}><input
            type="checkbox"
            name={g}
            id={g}
            key={g}
            checked={selectedGenres.find((g2) => (g2.name === g)).selected}
            onChange={handleChange}
          />{g}</label>
        )
      })

  console.log("genreSelector", genreSelector)
  console.log("books", books)
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {
            /*
            books.data.allBooks.filter((b) => {
              for (const bookGenre of b.genres) {
                console.log("bookgenre", bookGenre)
                console.log(genres)
                const foundBook = genres.find((g) => g.name === bookGenre)
                if (foundBook && foundBook.selected) { console.log("foundGenre"); return true }
              }
              return false
            })*/
            books.data.allBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name} ({a.author.born})</td>
                <td>{a.published}</td>
                <td>{a.genres.map((g) => { return `${g}; ` })}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {genreSelector}
    </div>
  )
}

export default Books
