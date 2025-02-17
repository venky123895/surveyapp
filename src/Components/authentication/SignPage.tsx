import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  useToast,
  Box,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import CustomInput from "../../Design/Atoms/Input/CustomInput";
import CustomButton from "../../Design/Atoms/Button/CustomButton";

interface SignPageProps {}

const SignPage: React.FC<SignPageProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [passowrd, setPassword] = useState<string>("");
  const toast = useToast();

  const FormTypes = ["Email", "Password"];

  const handleSubmit = async () => {
    if (!email || !passowrd) {
      toast({
        title: "Email and password does not match",
        description: "Enter valid email and password",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, passowrd);

      toast({
        title: "Login Successfull",
        description: `welcome ${result.user.email}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      let errorMessage = "An unexpected error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChangeInput = (e: any, type: string) => {
    if (type === "Email") {
      return setEmail(e.target.value);
    }
    return setPassword(e.target.value);
  };

  return (
    <FormControl isRequired>
      {FormTypes.map((type: string) => {
        const isEmail = type === "Email";
        return (
          <Box key={type}>
            <FormLabel mb="8px">{`Enter ${type}`}</FormLabel>
            <CustomInput
              type={`${type.toLowerCase()}`}
              placeholder={`Enter ${type}`}
              value={isEmail ? email : passowrd}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeInput(e, type)
              }
            />
          </Box>
        );
      })}
      <CustomButton w="100%" mt="10px" onClick={handleSubmit}>
        Login
      </CustomButton>
    </FormControl>
  );
};

export default SignPage;
