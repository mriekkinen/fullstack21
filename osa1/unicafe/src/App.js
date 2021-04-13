import React, { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticLine = ({ text, value, suffix }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value} {suffix}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const n = good + neutral + bad

  let stats = <div>No feedback given</div>
  if (n !== 0) {
    stats = (
      <table>
        <tbody>
          <StatisticLine text='good' value={good} />
          <StatisticLine text='neutral' value={neutral} />
          <StatisticLine text='bad' value={bad} />
          <StatisticLine text='all' value={n} />
          <StatisticLine text='average' value={(good - bad) / n} />
          <StatisticLine text='positive' value={good / n * 100} suffix='%' />
        </tbody>
      </table>
    )
  }

  return (
    <div>
      <h1>statistics</h1>
      {stats}
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
