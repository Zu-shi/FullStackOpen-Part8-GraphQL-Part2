import { useQuery } from "@apollo/client"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"
import { useMutation } from "@apollo/client"
import { useState } from "react"

const Authors = (props) => {
  const authors = useQuery(ALL_AUTHORS)
  const [editAuthor, result] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log("error:", error)
      console.log(error)
      const messages = error.graphQLErrors[0].message
    }
  })


  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  if (!props.show) {
    return null
  }

  let authorsToSelect = []
  if (authors.loading) {
    return <div>loading...</div>
  } else {
    // console.log(authors)
    authorsToSelect = authors.data.allAuthors.map((a) => {
      return <option value={a.name} key={a.name}>{a.name}</option>
    })
  }

  const onSubmitEditAuthor = async (e) => {
    e.preventDefault()
    console.log("editAuthor", editAuthor)
    editAuthor({ variables: { name: name, setBornTo: parseInt(born) } })
    //setName('')
    //setBorn('')
  }

  const handleSelectChange = (e) => {
    console.log("handleSelectChange, ", e.target.value)
    setName(e.target.value)
  }

  const AuthorSelect = () => {
    if (authors.loading) {
      return <div>loading...</div>
    }

    return (
      <div>
        <label name="Author">Choose author:</label>
        <select name="Author" id="Author" onChange={handleSelectChange} value={name}>
          {authorsToSelect}
        </select>
      </div>
    )
  }

  console.log("authors", authors)
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={onSubmitEditAuthor}>
        {/* <div>name:<input value={name} onChange={(e) => setName(e.target.value)} /></div> */}
        <AuthorSelect />
        <div>born:<input value={born} onChange={(e) => setBorn(e.target.value)} /></div>
        <div><button type="submit">Submit</button></div >
      </form>
    </div>
  )
}

export default Authors
