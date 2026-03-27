import Login from "../../Components/Auth/login/HMLogin";
import Register from "../../Components/Auth/Register/Register";
import { useState } from "react";

export default function AuthPage() {
  const [isLogin] = useState(true);

  return (
    <>
      {isLogin ? <Login /> : <Register />}
    </>
  );
}
