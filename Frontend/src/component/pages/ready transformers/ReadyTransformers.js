
import React, { useState } from "react";

const ReadyTransformers = () => {
  const [value, setValue] = useState("");
  function handleChange1(event) {
    // Handle first onChange event here
    console.log("First handler called");
  }

  function handleChange2(event) {
    // Handle second onChange event here
    console.log("Second handler called");
  }

  function handleOnChange(event) {
    handleChange1(event);
    handleChange2(event);
    setValue(event.target.value);
  }
  return (
    <input type="text" value={value} onChange={handleOnChange} /> 
  )
}

export default ReadyTransformers
