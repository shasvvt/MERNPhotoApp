import React, { useState, useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MIN,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import Card from "../../shared/components/UIComponents/Card";
import { useForm } from "../../shared/hooks/form-hook";
import "./Auth.css";
import { AuthContext } from "../../shared/context/auth-context";

const Auth = () => {
  const authContext = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
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
    if (isLoginMode) {
    } else {
      try {
        const response = await fetch("http://localhost:5001/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            username: formState.inputs.username.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
        });

        const responseDate = await response.json();
        console.log(responseDate);
      } catch (err) {
        console.log(err);
      }
    }
    authContext.login();
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          username: undefined,
          name: undefined,
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
          }
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <Card className="authentication">
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
          validators={[VALIDATOR_EMAIL()]}
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
  );
};

export default Auth;
