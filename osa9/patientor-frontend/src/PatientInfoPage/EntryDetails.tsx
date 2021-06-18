import React from 'react';
import { Segment, Icon, SemanticCOLORS } from 'semantic-ui-react';
import { useStateValue } from '../state';
import {
  Entry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HospitalEntry,
  HealthCheckRating
} from '../types';

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const HealthCheckEntryDetails = (
  { entry }: { entry: HealthCheckEntry }
) => {
  const colors = new Map<HealthCheckRating, SemanticCOLORS>([
    [HealthCheckRating.Healthy, "green"],
    [HealthCheckRating.LowRisk, "yellow"],
    [HealthCheckRating.HighRisk, "orange"],
    [HealthCheckRating.CriticalRisk, "red"]
  ]);

  return (
    <Segment>
      <div>
        <strong>{entry.date}</strong>{" "}
        <Icon name="user md" size="big" />
      </div>
      <div>
        <i>{entry.description}</i>
      </div>
      <div>
        <Icon
          name="heart"
          color={colors.get(entry.healthCheckRating)} />
      </div>
      <DiagnosisCodes entry={entry} />
    </Segment>
  );
};

const OccupationalHealthcareEntryDetails = (
  { entry }: { entry: OccupationalHealthcareEntry }
) => {
  return (
    <Segment>
      <div>
        <strong>{entry.date}</strong>{" "}
        <Icon name="stethoscope" size="big" />{" "}
        <strong>{entry.employerName}</strong>
      </div>
      <div>
        <i>{entry.description}</i>
      </div>
      <DiagnosisCodes entry={entry} />
      {entry.sickLeave &&
        <div>
          Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </div>
      }
    </Segment>
  );
};

const HospitalEntryDetails = (
  { entry }: { entry: HospitalEntry }
) => {
  return (
    <Segment>
      <div>
        <strong>{entry.date}</strong>{" "}
        <Icon name="hospital outline" size="big" />
      </div>
      <div>
        <i>{entry.description}</i>
      </div>
      <DiagnosisCodes entry={entry} />
      <div>
        <div>Discharge date: {entry.discharge.date}</div>
        <div>Discharge criteria: {entry.discharge.criteria}</div>
      </div>
    </Segment>
  );
};

const DiagnosisCodes = ({ entry }: { entry: Entry }) => {
  const [{ diagnoses }] = useStateValue();

  if (!entry.diagnosisCodes) {
    return null;
  }

  return (
    <ul>
      {entry.diagnosisCodes.map(code =>
        <li key={code}>
          {code} {diagnoses[code]?.name}
        </li>
      )}
    </ul>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export default EntryDetails;
