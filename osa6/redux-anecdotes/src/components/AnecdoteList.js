import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteTo } from '../reducers/anecdoteReducer'
import { clearNotification, createNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleVote }) => (
  <div>
    <div>
      {anecdote.content}
    </div>
    <div>
      has {anecdote.votes}
      <button onClick={handleVote}>vote</button>
    </div>
  </div>
)

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    filter = filter.toLowerCase()
    return anecdotes.filter(a => a.content.toLowerCase().includes(filter))
  })

  const vote = (anecdote) => {
    dispatch(voteTo(anecdote.id))
    dispatch(createNotification(`you voted '${anecdote.content}'`))
    setTimeout(() => dispatch(clearNotification()), 5000)
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={() => vote(anecdote)} />
      )}
    </div>
  )
}

export default AnecdoteList
