import {v1 as uuid} from 'uuid';
import patients from '../../data/patients';

import { Patient, NonSensitivePatient, NewPatient } from '../types';

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getEntry = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addEntry = (newPatient: NewPatient): Patient => {
  const id = uuid();
  const patient = { id, ...newPatient };

  patients.push(patient);
  return patient;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  getEntry,
  addEntry
};
