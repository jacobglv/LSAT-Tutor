import { useState, useContext } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card, CardHeader, CardBody } from "@nextui-org/react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Spinner } from "@nextui-org/react";
import { SessionContext } from "../SessionContext";

export default function Form({ route, method }) {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setName, setUser } = useContext(SessionContext);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const fetchUserData = async () => {
        try {
            const res = await api.get("/api/user/");
            setName(res.data.first_name);
            setUser(res.data.username);
            navigate("/");
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { first_name, last_name, username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                fetchUserData();
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <Card className="p-28">
                <CardHeader>
                    <h1>{name}</h1>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="form-container">
                        <div className="mb-4">
                            {method === 'register' ? (
                            <div className="flex gap-4 mb-4">
                                <Input 
                                className="form-input"
                                label="First Name"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                                />
                                <Input 
                                    className="form-input"
                                    label="Last Name"
                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Last Name"
                                />
                            </div>
                            ): null}
                            <Input 
                                className="form-input"
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                            />
                        </div>
                        <div className="mb-4">
                            <Input 
                                className="form-input"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>
                        {loading && <Spinner />}
                        <Button className="form-button" type="submit">{name}</Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
