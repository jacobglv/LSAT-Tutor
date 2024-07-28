import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import './output.css';
import Nav from "./Nav";
import Goal from "./components/Goal";
import Reflection from "./components/Reflection";
import api from "./api";
import { SessionContext } from "./SessionContext";
import { Card, CardBody, CardFooter, Input, Button, Image, CardHeader, Divider, Link, Tabs, Tab, TableRow, TableCell, TableHeader, Table, TableColumn, TableBody, Chip, Textarea } from "@nextui-org/react";

export default function SessionTemplate() {
    const navigate = useNavigate();
    const { session, goal, numberOfQuestions, isTimed, setGoal, setNumberOfQuestions, setIsTimed, lastGoal, lastReflection } = useContext(SessionContext);

    const startSessionHandler = (goal) => {
        navigate('/chat')
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-col flex-grow mx-auto">
                <div className="p-16 flex flex-col gap-7">
                    <i className="bi bi-arrow-left-circle text-4xl cursor-pointer" onClick={() => navigate('/')}></i>
                    <Divider />
                    <p className="font-medium text-[2em] my-auto">{session === 'logic' ? 'Logical Reasoning' : session === 'reading' ? 'Reading Comprehension' : 'Shuffle Mode'}</p>
                    <div className="flex gap-3">
                        <Card className="hover:scale-105">
                            <CardHeader>
                                <div className="flex gap-3">
                                    <i className="bi bi-bullseye"></i>
                                    <p className="text-lg mx-auto font-semibold">Session Goal</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="flex flex-col gap-5">
                                    <Textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Write your goal..." />
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="hover:scale-105">
                            <CardHeader>
                                <i className="bi bi-question text-2xl"></i>
                                <p className="text-lg mx-auto font-semibold">Number of Questions</p>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="flex flex-col gap-2 max-w-5 ml-16">
                                    <Button className={numberOfQuestions === 5 ? "bg-blue-300" : "primary"} onClick={() => setNumberOfQuestions(5)}>5</Button>
                                    <Button className={numberOfQuestions === 10 ? "bg-blue-300" : "primary"} onClick={() => setNumberOfQuestions(10)}>10</Button>
                                    <Button className={numberOfQuestions === 15 ? "bg-blue-300" : "primary"} onClick={() => setNumberOfQuestions(15)}>15</Button>
                                    <Button className={numberOfQuestions === 20 ? "bg-blue-300" : "primary"} onClick={() => setNumberOfQuestions(20)}>20</Button>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="hover:scale-105 px-4">
                            <CardHeader>
                                <i className="bi bi-clock text-2xl mr-2"></i>
                                <p className="text-lg mx-auto font-semibold">Timed?</p>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="flex flex-col gap-2 max-w-5 ml-2">
                                    <Button className={isTimed === true ? "bg-blue-300" : "primary"} onClick={() => setIsTimed(true)}>Yes</Button>
                                    <Button className={isTimed === false ? "bg-blue-300" : "primary"} onClick={() => setIsTimed(false)}>No</Button>
                                </div>
                            </CardBody>
                        </Card>
                        {isTimed!= null && numberOfQuestions && goal ? (
                            <Button className="m-auto bg-green-200" size="lg" onClick={() => startSessionHandler(goal)}>Let's go!</Button>
                        ) : (
                            <Button className="m-auto" size="lg" isDisabled>Let's go!</Button>
                        )}
                    </div>
                    <p className="font-medium text-[1.5em] mt-5">Don't forget...</p>
                    <div className="flex gap-3 mx-auto">
                        <Goal goal={lastGoal} />
                        <Reflection reflection={lastReflection} />
                    </div>
                </div>
            </div>
        </div>
    );
}
