import {createContext, useState} from 'react'

const SearchContext = createContext()

export const SearchProvider = ({children}) => {
  const [searchInput, setSearchInput] = useState('')

  const updatedSearchInput = value => {
    setSearchInput(value)
  }

  return (
    <SearchContext.Provider
      value={{
        searchInput,
        updatedSearchInput,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export default SearchContext
