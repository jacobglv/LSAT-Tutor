import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardHeader, CardBody } from "@nextui-org/react";

export default function LogoutTemplate() {
    const navigate = useNavigate();
    const { setIsAuthorized } = useContext(SessionContext);

    const handleLogout = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/logout/', {
            method: 'POST',
            credentials: 'include',  // Include cookies in the request
        });
        if (response.ok) {
            setIsAuthorized(false);
            navigate('/login');  // Redirect after successful logout
        } else {
            console.error('Logout failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <Card>
                <CardHeader>
                    <h1>Logout</h1>
                </CardHeader>
                <CardBody>
                    <Button onClick={handleLogout}>Logout</Button>
                </CardBody>
            </Card>
        </div>
    );
}
