import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIComponents/Card";
import LoadingSpinner from "../../shared/components/UIComponents/LoadingSpinner";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";

const DUMMY_PLACES = [
  {
    id: 1,
    title: "Marine Drive - Patna",
    imageUrl:
      "https://gumlet.assettype.com/swarajya%2F2022-06%2Fd086ebcd-bd3b-4659-85dc-f5edb68e5ea5%2FFWBQbv9WYAAF2Xr.jpg",
    description: "Infamouse marine drive of Patna",
    address: "Patna, Bihar",
    creator: "Shaswat",
    location: {
      lat: 25.6197898,
      lng: 85.1797413,
    },
  },
  {
    id: 2,
    title: "India Gate - Patna",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/90/Sabhyata_Dwar_%2Cpatna.jpg",
    description: "India Gate of Patna",
    address: "Patna, Bihar",
    creator: "Shaswat1",
    location: {
      lat: 25.6219088,
      lng: 85.1417289,
    },
  },
];

const UpdatePlace = () => {
  const placeId = useParams().placeId;

  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const [loadedPlace, setLoadedPlace] = useState();


const [formState, inputChangeHandler, setFormData] = useForm(
  {
    title: {
      value: '',
      isValid: false,
    },
    description: {
      value: '',
      isValid: false,
    },
  },
  false
);

const fetchPlace = () => {
  try{
    const responseData = sendRequest(`http://localhost:5001/api/places/${placeId}`);
    console.log(responseData.place)
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
  }
  catch (err) {
    console.log(err.message)
  }
}

useEffect(() => {
  fetchPlace()
}, [sendRequest, placeId])


const placeUpdateHandler = (ev) => {
  ev.preventDefault();
  console.log(formState.inputs)
}

if(isLoading) {
  return (<LoadingSpinner asOverlay />
  )
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
        <ErrorModal error = {error} onClear={clearError} />
        {loadedPlace &&
        <form className="place-form">
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
          onInput={inputChangeHandler}
          value = {formState.inputs.title.value}
          valid = {formState.inputs.title.isValid}
        />
        <Input
          id="description"
          label="Description"
          element="textarea"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputChangeHandler}
          value = {formState.inputs.description.value}
          valid = {formState.inputs.description.isValid}
        /> 
        <Button type="submit" disabled={!formState.isValid} onClick={placeUpdateHandler}>
          UPDATE PLACE
        </Button>
      </form>}
      </React.Fragment>
      
    );
  
  // return <div>UpdatePlace</div>;
};

export default UpdatePlace;
