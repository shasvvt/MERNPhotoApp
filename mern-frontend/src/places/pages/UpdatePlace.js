import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIComponents/Card";

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

  const [loading, setLoading] = useState(false);

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

const identifiedPlace = DUMMY_PLACES.find((p) => p.id == placeId);

useEffect(() => {
  if(identifiedPlace){
    setFormData(
      {
        title: {
          value: identifiedPlace.title,
          isValid: true,
        },
        description: {
          value: identifiedPlace.description,
          isValid: true,
        },
      },
      true
    );
  } 
  setLoading(true);
}, [setFormData, identifiedPlace]);

const placeUpdateHandler = (ev) => {
  ev.preventDefault();
  console.log(formState.inputs)
}

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
        <h2>Could not find place</h2>
        </Card>
      </div>
    );
  }

  if(!loading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    )
  }
    // 
    return (
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
      </form>
    );
  
  // return <div>UpdatePlace</div>;
};

export default UpdatePlace;
