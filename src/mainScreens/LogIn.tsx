import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useRef } from "react"
import { useForm } from "react-hook-form";
import { Image, TextInput } from "react-native"
import styled from "styled-components/native"
import { loggedUserIn } from "../client";
import KeyboardAvoidLayout from "../layout/KeyboardAvoidLayout";
import { login, loginVariables } from "../__generated__/login";


const UsernameInput = styled.TextInput`
  background-color: tomato;
  width: 90%;
  padding: 8px 18px;
  border-radius: 20px;
  margin-bottom: 10px;
  font-size: 17px;
`;
const PasswordInput = styled(UsernameInput)``;
const LogInButton = styled.TouchableOpacity`
  background-color: tomato;
  width: 90%;
  padding: 8px 18px;
  border-radius: 20px;
  margin-bottom: 10px;
`;
const LogInButtonText = styled.Text`
  font-size: 17px;
  text-align: center;
`;
const ErrorText = styled.Text`
  font-size: 17px;
  text-align: center;
`;

const LOGIN_MUTATION = gql`
  mutation login (
    $username:String!
    $password:String!
  ) {
    login (
    username:$username
    password:$password
  ) {
    ok
    error
    token
  }
  }
`;

type FormProp = {
  username:string
  password:string
  result:string
}

const LogIn = () => {
  const [login, {loading}] = useMutation<login,loginVariables>(LOGIN_MUTATION);
  // useReactiveVar 이게 있어야 하나? 글고 Apps 에 useReactiveVar 있으면 바뀌면 알아서 Profile 로 옮겨갈라나? 그럴 것 같진 않은데. 오 그러네


  const {register,setError,handleSubmit,clearErrors,setValue,formState:{errors}} = useForm<FormProp>({mode:"onChange"});

  useEffect(( ) => {
    register("username",{required:"Username"});
    register("password",{required:"Password"});
    register("result");
  }, [register] )	
  ////
  const onSubmit = async(data:FormProp) => {
    if(loading) return;
    const {username,password} = data;
    if(!username || !password) {
      return setError("result",{message:"username and password is required"});
    }
    const result = await login({
      variables:{
        username,
        password,
      }
    });
    if(result.data?.login?.token) {
      loggedUserIn(result.data.login.token);
      /// 화면 바꾸기. 근데 만약 Apps 의 useReactiveVar 가 바꿔주면 걍 이거만 하면 됨.
    }
    if(result.data?.login?.error) {
      setError("result",{message:result.data.login.error})
    }
  }
  const setFormValueWhichIs = (name:"username" | "password") => {
    return (text:string) => {
      setValue(name, text);
      clearErrors();
    }
  }
  const passwordInput = useRef<TextInput>(null);
  const onSubmitEditingEmail = () => {
    passwordInput?.current?.focus()
  }
  return (
    <KeyboardAvoidLayout>
      <>
        <Image source={require("../../assets/cup-coffee.png")}/>
        <UsernameInput placeholder="Username" autoCapitalize="none" onChangeText={(text) => setFormValueWhichIs("username")(text)} returnKeyType="next" autoCorrect={false} keyboardType="email-address" onSubmitEditing={onSubmitEditingEmail}/>
        <PasswordInput placeholder="Password" autoCapitalize="none" onChangeText={(text) => setFormValueWhichIs("password")(text)} secureTextEntry={true} returnKeyType="done" ref={passwordInput} onSubmitEditing={handleSubmit(onSubmit)}/>
        <LogInButton onPress={handleSubmit(onSubmit)}><LogInButtonText>Log In</LogInButtonText></LogInButton>
        {errors.result && <ErrorText>{errors.result.message}</ErrorText>}
        {(errors.username || errors.password) && <ErrorText>{`${errors?.username?.message ?? ""}${errors?.password?.message ? ` ${errors.password.message}`:""} is required`}</ErrorText>}
      </>
    </KeyboardAvoidLayout>
  );
};
export default LogIn;