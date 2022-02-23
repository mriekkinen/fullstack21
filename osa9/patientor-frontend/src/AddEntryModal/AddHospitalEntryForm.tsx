import React from 'react';
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, FormikErrors } from "formik";

import { EntryFormValues, HospitalEntryFormValues } from '../types';
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
        discharge: {
          date: "",
          criteria: "",
        }
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: FormikErrors<Required<HospitalEntryFormValues>> = {};

        if (!values.specialist) errors.specialist = requiredError;
        if (!values.description) errors.description = requiredError;

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
        const dcDateError = validateDate(values.discharge.date);
        const dcCriteriaError = !values.discharge.criteria ? requiredError : undefined;

        if (dateError) errors.date = dateError;

        if (dcDateError || dcCriteriaError) {
          errors.discharge = {
            date: dcDateError,
            criteria: dcCriteriaError
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
              label="Discharge date"
              placeholder="YYYY-MM-DD"
              name="discharge.date"
              component={TextField}
            />

            <Field
              label="Discharge criteria"
              placeholder="Discharge criteria"
              name="discharge.criteria"
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
