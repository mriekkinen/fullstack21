import React from 'react'

const Header = ({ name }) => (
  <h2>
    {name}
  </h2>
)

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Content = ({ parts }) => (
  <div>
    {parts.map(part =>
      <Part key={part.id} part={part} />
    )}
  </div>
)

const Total = ({ parts }) => {
  const total = parts.reduce((sum, x) => sum + x.exercises, 0)
  return (
    <p>
      <b>
        total of {total} exercises
      </b>
    </p>
)}

const Course = ({ course }) => (
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course
