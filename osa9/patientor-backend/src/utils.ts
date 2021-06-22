import {
  Diagnose, Discharge, Gender, HealthCheckRating,
  Entry, NewEntry, NewPatient, SickLeave
} from './types';

type Fields = {
  name: unknown,
  dateOfBirth: unknown,
  ssn: unknown,
  gender: unknown,
  occupation: unknown
};

export const toNewPatient = (
  { name, dateOfBirth, ssn, gender, occupation }: Fields
) : NewPatient => {
  const newPatient: NewPatient = {
    name: parseName(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseSsn(ssn),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation),
    entries: []
  };

  return newPatient;
};

type EntryFields = {
  description: unknown;
  date: unknown;
  specialist: unknown;
  diagnosisCodes: unknown;
  type: unknown;
  healthCheckRating: unknown;
  employerName: unknown;
  sickLeave: unknown;
  discharge: unknown;
};

export const toNewEntry = (
  {
    description, date, specialist, diagnosisCodes,
    type, healthCheckRating, employerName, sickLeave, discharge
  }: EntryFields
) : NewEntry => {
  const newBaseEntry = {
    description: parseDescription(description),
    date: parseDate(date),
    specialist: parseSpecialist(specialist),
    diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
  };

  const parsedType = parseType(type);

  switch (parsedType) {
    case 'HealthCheck':
      return {
        ...newBaseEntry,
        type: parsedType,
        healthCheckRating: parseHealthCheckRating(healthCheckRating)
      };
    case 'OccupationalHealthcare':
      return {
        ...newBaseEntry,
        type: parsedType,
        employerName: parseEmployerName(employerName),
        sickLeave: parseSickLeave(sickLeave)
      };
    case 'Hospital':
      return {
        ...newBaseEntry,
        type: parsedType,
        discharge: parseDischarge(discharge)
      };
    default:
      return assertNever(parsedType);
  }
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name: ' + name);
  }

  return name;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }

  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn: ' + ssn);
  }

  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }

  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation: ' + occupation);
  }

  return occupation;
};

const parseType = (type: unknown): Entry['type'] => {
  if (!type || !isString(type) || !isType(type)) {
    throw new Error('Unknown or missing type: ' + type);
  }

  return type;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (rating === undefined || rating === null || !isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing health check rating: ' + rating);
  }

  return rating;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description: ' + description);
  }

  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist: ' + specialist);
  }

  return specialist;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown): Array<Diagnose['code']> | undefined => {
  // NB: this property is optional
  if (!diagnosisCodes) {
    return undefined;
  }

  if (!Array.isArray(diagnosisCodes)
      || !diagnosisCodes.every(isDiagnosisCode)) {
    throw new Error('Incorrect or missing diagnosis codes: ' + diagnosisCodes);
  }

  return diagnosisCodes;
};

const isDiagnosisCode = (code: unknown): code is Diagnose['code'] => {
  // TODO: refer to Diagnose['code']
  return typeof code === 'string';
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Incorrect or missing employer name: ' + employerName);
  }

  return employerName;
};

const parseSickLeave = (sickLeave: unknown): SickLeave | undefined => {
  // NB: this property is optional
  if (!sickLeave) {
    return undefined;
  }

  if (!isSickLeave(sickLeave)) {
    throw new Error('Incorect or missing sick leave: ' + sickLeave);
  }

  return sickLeave;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || !isDischarge(discharge)) {
    throw new Error('Incorrect or missing discharge entry: ' + discharge);
  }

  return discharge;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const isSickLeave = (sickLeave: unknown): sickLeave is SickLeave => {
  return typeof sickLeave === 'object' && sickLeave !== null
    && (sickLeave as SickLeave).startDate !== undefined
    && (sickLeave as SickLeave).endDate !== undefined
    && isDate((sickLeave as SickLeave).startDate)
    && isDate((sickLeave as SickLeave).endDate);
};

const isDischarge = (discharge: unknown): discharge is Discharge => {
  return typeof discharge === 'object' && discharge !== null
    && (discharge as Discharge).criteria !== undefined
    && (discharge as Discharge).date !== undefined
    && isString((discharge as Discharge).criteria)
    && isDate((discharge as Discharge).date);
};

const isType = (type: string): type is Entry['type'] => {
  // NB: A more elegent solution probably exists
  const types = ['HealthCheck', 'OccupationalHealthcare', 'Hospital'];
  return types.includes(type);
};
