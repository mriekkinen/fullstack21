interface ExerciseValues {
  daily: number[];
  target: number;
}

type Rating = 1 | 2 | 3;

type RatingDescription = 
  'room for improvement' |
  'not too bad but could be better' |
  'you\'ve met your target!';

interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: RatingDescription;
  target: number;
  average: number;
}

const parseExArguments = (args: string[]): ExerciseValues => {
  if (args.length < 3) {
    throw new Error('too few arguments: expected at least 1');
  }

  const hours = args.slice(2).map(s => {
    const h = Number(s)
    if (isNaN(h)) {
      throw new Error(`Non-numeric argument: ${s}`);
    }

    return h;
  });

  const target = hours[0];
  const daily = hours.slice(1);
  return {
    daily, target
  }
}

const calculateExercises = (daily: number[], target: number): ExerciseResult => {
  const trainingHours = daily.reduce((s, h) => s + h, 0);
  const trainingDays = daily.filter(h => h > 0).length;
  const periodLength = daily.length;
  const average = periodLength > 0 ? trainingHours / periodLength : 0;

  let rating: Rating;
  let ratingDescription: RatingDescription;
  if (average >= target) {
    rating = 1;
    ratingDescription = 'you\'ve met your target!';
  } else if (average >= 0.8 * target) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 3;
    ratingDescription = 'room for improvement';
  }

  return {
    periodLength,
    trainingDays,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average
  }
}

try {
  const { daily, target } = parseExArguments(process.argv);
  const result = calculateExercises(daily, target);

  console.log(result);
} catch (error) {
  console.log(error.message);
}
