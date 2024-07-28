import React from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";

export default function Reflection({ reflection }) {
    return(
        <Card className="hover:scale-105">
        <CardHeader>
            <div className="flex gap-8">
                <i className="bi bi-pen"></i>
                <p className="text-lg mx-auto font-semibold">Your last reflection</p>
            </div>
        </CardHeader>
        <Divider />
        <CardBody>
            <p className="max-w-96">{ reflection }</p>
        </CardBody>
    </Card>
    );
}
