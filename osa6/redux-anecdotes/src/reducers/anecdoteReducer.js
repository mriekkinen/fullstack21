import anecdoteService from '../services/anecdotes'

export const voteTo = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.vote(anecdote)
    dispatch({
      type: 'ANECDOTE/VOTE',
      data: updatedAnecdote
    })
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'ANECDOTE/CREATE',
      data: newAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'ANECDOTE/INIT',
      data: anecdotes
    })
  }
}

const compareVotes = (a, b) => b.votes - a.votes

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'ANECDOTE/VOTE':
      const id = action.data.id
      const updated = action.data

      return state
        .map(a => a.id !== id ? a : updated)
        .sort(compareVotes)
    case 'ANECDOTE/CREATE':
      return [...state, action.data]
    case 'ANECDOTE/INIT':
      return action.data.sort(compareVotes)
    default:
      return state
  }
}

export default reducer
