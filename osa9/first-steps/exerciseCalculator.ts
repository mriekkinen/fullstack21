import { calculateExercises } from './exercise';

interface ExerciseValues {
  daily: number[];
  target: number;
}

const parseExArguments = (args: string[]): ExerciseValues => {
  if (args.length < 3) {
    throw new Error('too few arguments: expected at least 1');
  }

  const hours = args.slice(2).map(s => {
    const h = Number(s);
    if (isNaN(h)) {
      throw new Error(`Non-numeric argument: ${s}`);
    }

    return h;
  });

  const target = hours[0];
  const daily = hours.slice(1);
  return {
    daily, target
  };
};

try {
  const { daily, target } = parseExArguments(process.argv);
  const result = calculateExercises(daily, target);

  console.log(result);
} catch (error) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log(error.message);
}
