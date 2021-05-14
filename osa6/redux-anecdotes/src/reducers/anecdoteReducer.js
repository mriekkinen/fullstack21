export const voteTo = (id) => {
  return {
    type: 'ANECDOTE/VOTE',
    data: { id }
  }
}

export const createAnecdote = (data) => {
  return {
    type: 'ANECDOTE/CREATE',
    data
  }
}

export const initializeAnecdotes = (anecdotes) => {
  return {
    type: 'ANECDOTE/INIT',
    data: { anecdotes }
  }
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'ANECDOTE/VOTE':
      const id = action.data.id
      const original = state.find(a => a.id === id)
      const updated = {
        ...original,
        votes: original.votes + 1
      }

      return state
        .map(a => a.id !== id ? a : updated)
        .sort((a, b) => b.votes - a.votes)
    case 'ANECDOTE/CREATE':
      return state.concat(action.data)
    case 'ANECDOTE/INIT':
      return action.data.anecdotes
    default:
      return state
  }
}

export default reducer
