import Login from "../../Components/Auth/login/HMLogin";
import Register from "../../Components/Auth/Register/Register";
import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? <Login /> : <Register />}

      <button onClick={() => setIsLogin(!isLogin)}>Switch</button>
    </>
  );
}
