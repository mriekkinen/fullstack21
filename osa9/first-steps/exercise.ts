export type Rating = 1 | 2 | 3;

export type RatingDescription = 
  'bad' |
  'not too bad but could be better' |
  'you\'ve met your target!';

export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: RatingDescription;
  target: number;
  average: number;
}

export const calculateExercises = (daily: number[], target: number): ExerciseResult => {
  const trainingHours = daily.reduce((s, h) => s + h, 0);
  const trainingDays = daily.filter(h => h > 0).length;
  const periodLength = daily.length;
  const average = periodLength > 0 ? trainingHours / periodLength : 0;

  let rating: Rating;
  let ratingDescription: RatingDescription;
  if (average >= target) {
    rating = 3;
    ratingDescription = 'you\'ve met your target!';
  } else if (average >= 0.8 * target) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'bad';
  }

  return {
    periodLength,
    trainingDays,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average
  };
};
