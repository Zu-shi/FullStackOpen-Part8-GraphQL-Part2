import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { LOGIN, ME } from './queries'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useApolloClient, useQuery } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  // const navigate = useNavigate()
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error)
      console.log(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => setToken(window.localStorage.getItem("token")), [])

  useEffect(() => {
    if (result.data) {
      const tk = result.data.login.value
      setToken(tk)
      localStorage.setItem("token", tk)
      // navigate('books')
    }
  }, [result.data])

  const logout = () => {
    setToken(null)
    window.localStorage.clear()
    client.resetStore() // This is not stored in localStorage, but in Memory!
  }

  // const Logout = function () {
  //   const logout = () => {
  //     window.localStorage.clear()
  //   }

  //   return (
  //     <button onClick={logout}>Logout</button>
  //   )
  // }

  const Login = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onClickLogin = (evt) => {
      evt.preventDefault()
      login({ variables: { username, password } })
    }

    if (!props.show) {
      return null
    }

    if (token) {
      console.log("token", token)
      return <>Logged in</>
    }

    return (
      <form onSubmit={(e) => onClickLogin(e)}>
        <div>
          Username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
        </div>
        <div>
          Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <button type="submit">Login</button>
      </form>
    )

  }

  const Recs = (props) => {
    const user = useQuery(ME, {
      onError: (error) => {
        console.log(error)
      }
    })

    // useEffect(
    //   ,
    // [token])

    console.log(user)

    if (user.loading) {
      return <>User is loading</>
    }

    console.log("rendering books")
    return (
      <Books recs={user.data.me.favoriteGenre} token={token} show={props.show} />
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        {token ?
          <>
            <button onClick={logout}>logout</button>
            <button onClick={() => setPage('recs')}>recommendations</button>
          </>
          :
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} token={token} />

      <NewBook show={page === 'add'} />

      <Recs show={page === 'recs'} />

      <Login show={page === 'login'} />
    </div>
  )
}

export default App
