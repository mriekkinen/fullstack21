interface BmiValues {
  height: number;
  weight: number;
}

type Category =
  'Very severely underweight' |
  'Severely underweight' |
  'Underweight' |
  'Normal (healthy weight)' |
  'Overweight' |
  'Obese Class I (Moderately obese)' |
  'Obese Class II (Severely obese)' |
  'Obese Class III (Very severely obese)';

const parseArguments = (arguments: string[]): BmiValues => {
  if (process.argv.length !== 4) {
    throw new Error('invalid number of arguments: expected 2 (height and weight)');
  }

  const height = Number(process.argv[2]);
  const weight = Number(process.argv[3]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error('invalid argument: height and weight should be numbers');
  }

  return {
    height, weight
  }
}

const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height / 100) ** 2);

  if (bmi < 15) {
    return 'Very severely underweight';
  } else if (bmi < 16) {
    return 'Severely underweight';
  } else if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25) {
    return 'Normal (healthy weight)';
  } else if (bmi < 30) {
    return 'Overweight';
  } else if (bmi < 35) {
    return 'Obese Class I (Moderately obese)';
  } else if (bmi < 40) {
    return 'Obese Class II (Severely obese)';
  } else {
    return 'Obese Class III (Very severely obese)	';
  }
}

try {
  const { height, weight } = parseArguments(process.argv);
  const result = calculateBmi(height, weight);

  console.log(result);
} catch (error) {
  console.log(error.message);
}
