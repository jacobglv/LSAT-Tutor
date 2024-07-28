import React from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";

export default function Goal({ goal }) {
    return(
    <Card className="hover:scale-105">
        <CardHeader>
            <div className="flex gap-8">
                <i className="bi bi-bullseye"></i>
                <p className="text-lg font-semibold">Your last goal</p>
            </div>
        </CardHeader>
        <Divider />
        <CardBody>
            <p className="max-w-96">{ goal }</p>
        </CardBody>
    </Card>
    );
}
