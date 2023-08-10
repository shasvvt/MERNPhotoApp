import React, { useState, useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";
import LoadingSpinner from "../../shared/components/UIComponents/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MIN,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import Card from "../../shared/components/UIComponents/Card";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";
import { AuthContext } from "../../shared/context/auth-context";

const Auth = () => {
  const authContext = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (ev) => {
    ev.preventDefault();
    console.log(formState.inputs);
    if (isLoginMode) {
      try{
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`, 
          'POST',
          JSON.stringify({
            username: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            "Content-Type": "application/json",
          }
          );
        authContext.login(responseData.userId, responseData.token)
      }
      catch (err) {

      }
    } else {
      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('username', formState.inputs.username.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          "POST",
          formData
        );
        authContext.login(responseData.userId);
      } catch (err) {

      }
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          username: undefined,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          username: {
            value: "",
            isValid: false,
          },
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <React.Fragment>
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <div>
              <Input
                id="name"
                type="text"
                label="Name"
                element="input"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter name"
                onInput={inputChangeHandler}
              />
              <ImageUpload center id='image' onInput={inputChangeHandler}/>
              <Input
                id="username"
                type="text"
                label="Username"
                element="input"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter username"
                onInput={inputChangeHandler}
              />
            </div>
          )}
          <Input
            id="email"
            type="text"
            label="E-Mail"
            element="input"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter valid email"
            onInput={inputChangeHandler}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            element="input"
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText="Please enter valid password (min. 8 characters)"
            onInput={inputChangeHandler}
          />
          <Button type="Submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {isLoginMode ? "Switch to Signup" : "Switch to Login"}{" "}
        </Button>
      </Card>
      <ErrorModal error={error} onClear={clearError} />
    </React.Fragment>
  );
};

export default Auth;
