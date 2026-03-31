import { useNavigate } from "react-router-dom";

export default function BackLink({ text, to }) {
  const navigate = useNavigate();

  return (
    <p style={{ cursor: "pointer" }} onClick={() => navigate(to)}>
      ← {text}
    </p>
  );
}