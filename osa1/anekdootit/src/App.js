import React, { useState } from 'react'

const rand = (n) => {
  return Math.floor(Math.random() * n)
}

// https://stackoverflow.com/questions/20222501/how-to-create-a-zero-filled-javascript-array-of-arbitrary-length/22209781
const zeros = (n) => {
  return Array.apply(null, new Array(n)).map(Number.prototype.valueOf, 0)
}

const MostVotes = ({ anecdotes, votes }) => {
  const imax = votes.indexOf(Math.max(...votes))

  if (votes[imax] === 0) {
    return <div>No votes cast, yet</div>
  }

  return (
    <div>
      {anecdotes[imax]} <br />
      has {votes[imax]} votes <br />
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(zeros(anecdotes.length))

  const next = () => {
    setSelected(rand(anecdotes.length));
  }

  const vote = () => {
    let copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]} <br />
      has {votes[selected]} votes <br />
      <button onClick={vote}>vote</button>
      <button onClick={next}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      <MostVotes anecdotes={anecdotes} votes={votes} />
    </div>
  )
}

export default App
