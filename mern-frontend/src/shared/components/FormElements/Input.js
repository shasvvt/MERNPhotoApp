import React, { useReducer, useEffect } from "react";

import { validate } from "../../utils/validators";
import "./Input.css";

const Input = (props) => {
  const inputReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE":
        return {
          ...state,
          value: action.val,
          isValid: validate(action.val, action.validators),
        };
      case "TOUCH":
        return {
          ...state,
          isTouched: true,
        };
      default:
        return state;
    }
  };

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || "",
    isTouched: false,
    isValid: props.valid || false,
  });

  const { value, isValid } = inputState;
  const { id, onInput } = props;

  useEffect(() => {
    props.onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <input
        type={props.type}
        name={props.name}
        id={props.id}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
