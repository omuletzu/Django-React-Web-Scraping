import Form from "../components/Form"

function Login() {
    // TODO: Add button to redirect to register page
    return <Form route="/api/token/" method="login" />
}

export default Login