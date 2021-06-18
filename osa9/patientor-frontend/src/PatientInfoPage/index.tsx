import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Icon, SemanticICONS } from 'semantic-ui-react';
import { useStateValue, updatePatient } from '../state';
import { apiBaseUrl } from "../constants";
import { Gender, Patient } from '../types';

const genderIconName = new Map<Gender, SemanticICONS>([
  [Gender.Male, "mars"],
  [Gender.Female, "venus"],
  [Gender.Other, "genderless"]
]);

const PatientInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients, diagnoses }, dispatch] = useStateValue();

  const fetchFullPatientInfo = async () => {
    try {
      const { data: patient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
      dispatch(updatePatient(patient));
      return patient;
    } catch (e) {
      console.error(e);
    }
  };

  const patient = patients[id];
  if (!patient?.ssn) {
    void fetchFullPatientInfo();
    return null;  // postpone rendering
  }

  const genderIcon = <Icon name={genderIconName.get(patient.gender)} />;

  return (
    <div>
      <h2>{patient.name} {genderIcon}</h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      <h3>entries</h3>
      {patient.entries?.map(entry =>
        <div key={entry.date}>
          {entry.date} <i>{entry.description}</i>
          <ul>
            {entry.diagnosisCodes?.map(code =>
              <li key={code}>
                {code} {diagnoses[code]?.name}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PatientInfoPage;
