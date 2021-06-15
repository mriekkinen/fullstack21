import React from 'react';

// new types
interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends CoursePartWithDescription {
  type: "normal";
}

interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartWithDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CoursePartWithDescription {
  type: "special";
  requirements: string[];
}

type CoursePart = 
  CourseNormalPart
  | CourseProjectPart
  | CourseSubmissionPart
  | CourseSpecialPart;

// this is the new coursePart variable
const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is the leisured course part",
    type: "normal"
  },
  {
    name: "Advanced",
    exerciseCount: 7,
    description: "This is the harded course part",
    type: "normal"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    type: "groupProject"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
    type: "submission"
  },
  {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "jest"],
    type: "special"
  }
];

const Header = ({ name }: { name: string }) => (
  <h1>{name}</h1>
);

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  const title = <div><strong>{part.name} {part.exerciseCount}</strong></div>;
  const description = 'description' in part
    ? <div><i>{part.description}</i></div>
    : null;

  const styles = { marginBottom: '0.5em' };

  switch (part.type) {
    case 'normal':
      return (
        <div style={styles}>
          {title}
          {description}
        </div>
      );
    case 'groupProject':
      return (
        <div style={styles}>
          {title}
          <div>project exercises {part.groupProjectCount}</div>
        </div>
      );
    case 'submission':
      return (
        <div style={styles}>
          {title}
          {description}
          <div>submit to {part.exerciseSubmissionLink}</div>
        </div>
      )
    case 'special':
      return (
        <div style={styles}>
          {title}
          {description}
          <div>required skills: {part.requirements.join(', ')}</div>
        </div>
      )
    default:
      return assertNever(part);
  }
}

const Content = ({ parts }: { parts: CoursePart[] }) => (
  <div>
    {parts.map(part =>
      <Part key={part.name} part={part} />
    )}
  </div>
);

const Total = ({ parts }: { parts: CoursePart[] }) => (
  <p>
    Number of exercises{" "}
    {parts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </p>
);

const App = () => {
  const courseName = "Half Stack application development";

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total parts={courseParts} />
    </div>
  );
};

export default App;
