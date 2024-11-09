import Form from "../components/Form"
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const handleNotRegistered = () => {
        navigate("/register");
    }
    return (
        <div>
            <Form route="/api/token/" method="login" />
            Don't have an account yet? Register
            <button 
                onClick={handleNotRegistered}
                style={{
                    backgroundColor: "transparent",
                    padding: "0 0 0 0.3em",
                    margin: "1",
                }}>
                    here</button>
        </div>
    )
}

export default Login