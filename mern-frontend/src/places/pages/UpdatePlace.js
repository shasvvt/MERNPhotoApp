import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIComponents/Card";
import LoadingSpinner from "../../shared/components/UIComponents/LoadingSpinner";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";


const UpdatePlace = () => {
  const auth = useContext(AuthContext)
  const placeId = useParams().placeId;
  const [loadedPlace, setLoadedPlace] = useState();
  const history = useHistory();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const fetchPlace = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
      );
      console.log(responseData.place);
      setLoadedPlace(responseData.place);
      setFormData(
        {
          title: {
            value: responseData.place.title,
            isValid: true,
          },
          description: {
            value: responseData.place.description,
            isValid: true,
          },
        },
        true
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchPlace();
  }, [sendRequest, placeId]);

  const placeUpdateHandler = async (ev) => {
    ev.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        { "Content-Type": "application/json",
          "Authorization":  'Bearer ' +auth.token}
      );
    } catch (error) {

    };
    history.push('/')
    console.log(formState.inputs);
  };

  if (isLoading) {
    return <LoadingSpinner asOverlay />;
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place</h2>
        </Card>
      </div>
    );
  }

  //
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {loadedPlace && (
        <form className="place-form">
          <Input
            id="title"
            type="text"
            label="Title"
            element="input"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            onInput={inputChangeHandler}
            value={formState.inputs.title.value}
            valid={formState.inputs.title.isValid}
          />
          <Input
            id="description"
            label="Description"
            element="textarea"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputChangeHandler}
            value={formState.inputs.description.value}
            valid={formState.inputs.description.isValid}
          />
          <Button
            type="submit"
            disabled={!formState.isValid}
            onClick={placeUpdateHandler}
          >
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );

  // return <div>UpdatePlace</div>;
};

export default UpdatePlace;
