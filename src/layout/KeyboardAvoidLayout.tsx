import React from "react";
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";

// const TouchableWithoutFeedbackView = styled.TouchableWithoutFeedback`
//   flex:1;
// `;

const KeyboardAvoidingContainer = styled.KeyboardAvoidingView`
  flex:1;
  /* background-color: yellow; */
  /* justify-content: center;
  align-items: center; */
`;

const KeyboardAvoidLayout:React.FC = ({children}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingContainer
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {children}
      </KeyboardAvoidingContainer>
    </TouchableWithoutFeedback>
  )
};

export default KeyboardAvoidLayout;