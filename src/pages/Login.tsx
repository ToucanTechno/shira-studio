import {useState} from "react";
import {useNavigate} from "react-router";
import {Box, Input} from "@chakra-ui/react";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e: any) => setEmail(e.target.value);
    const handlePasswordChange = (e: any) => setPassword(e.target.value);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        // Validate inputs
        if (!email || !password) {
            setError('Both fields are required.');
            return;
        }

        // Simulate successful login
        console.log('Logging in:', { email, password });

        // On successful login, navigate to home page
        navigate('/home');
    };

    return (
        <div className="login-container">
            <h2>Login</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <Box>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        required
                    />
                    <Field.Label>Email</Field.Label>
                </Box>

                <Box>
                    <Field.Label>Password</Field.Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                        required
                    />
                </Box>

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;