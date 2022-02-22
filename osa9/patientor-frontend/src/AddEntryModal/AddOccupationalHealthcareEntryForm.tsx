import React from 'react';
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, FormikErrors } from "formik";

import { EntryFormValues, OccupationalHealthcareEntryFormValues } from '../types';
import { useStateValue } from '../state/state';
import {
  DiagnosisSelection, TextField
} from '../AddPatientModal/FormField';

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const AddOccupationHealthcareEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        date: "",
        specialist: "",
        diagnosisCodes: [],
        description: "",
        employerName: "",
        sickLeave: {
          startDate: "",
          endDate: "",
        }
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: FormikErrors<Required<OccupationalHealthcareEntryFormValues>> = {};

        if (!values.specialist) errors.specialist = requiredError;
        if (!values.description) errors.description = requiredError;
        if (!values.employerName) errors.employerName = requiredError;

        const validateDate = (date: string) => {
          if (!date) {
            return requiredError;
          } else if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) {
            return "Enter date as YYYY-MM-DD";
          } else if (!Date.parse(date)) {
            return "Invalid date";
          }

          return undefined;
        };

        const dateError = validateDate(values.date);
        const sickLeaveStartError = validateDate(values.sickLeave.startDate);
        const sickLeaveEndError = validateDate(values.sickLeave.endDate);

        if (dateError) errors.date = dateError;

        if (sickLeaveStartError || sickLeaveEndError) {
          errors.sickLeave = {
            startDate: sickLeaveStartError,
            endDate: sickLeaveEndError
          };
        }

        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {

        return (
          <Form className="form ui">
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />

            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />

            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />

            <Field
              label="Employer name"
              placeholder="Employer name"
              name="employerName"
              component={TextField}
            />

            <Field
              label="Sick leave start date"
              placeholder="YYYY-MM-DD"
              name="sickLeave.startDate"
              component={TextField}
            />

            <Field
              label="Sick leave end date"
              placeholder="YYYY-MM-DD"
              name="sickLeave.endDate"
              component={TextField}
            />

            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddOccupationHealthcareEntryForm;
