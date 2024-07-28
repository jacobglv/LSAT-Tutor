// src/HomeTemplate.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "./SessionContext";
import Goal from "./components/Goal";
import Reflection from "./components/Reflection";
import './output.css';
import api from "./api";
import {Card, CardBody, CardFooter, Input, Button, Image, CardHeader, Divider, Link, Tabs, Tab, TableRow, TableCell, TableHeader, Table, TableColumn, TableBody, Chip} from "@nextui-org/react";

export default function HomeTemplate() {
    const navigate = useNavigate();
    const [dates, setDates] = useState([]);
    const [selfEvaluations, setSelfEvaluations] = useState([]);
    const [scores, setScores] = useState([]);
    const [types, setTypes] = useState([]);
    const [sessionData, setSessionData] = useState([{}]);
    const [summary, setSummary] = useState([])
    const { setSession, name, lastGoal, lastReflection, setLastGoal, setLastReflection, user } = useContext(SessionContext);

    const setSessionBuffer = (session) => {
        setSession(session);
        navigate('/session');
    };

    useEffect(() => {
        getSessions();
        getSummary();
    }, []) // get last session on initial render

    const getSummary = () => {
        api
        .get(`/api/summary/?user=${user}`)
        .then((res) => res.data)
        .then((data) => {
            setSummary(data.html_content);
            console.log(data);
        })
        .catch((err) => console.log(err))
    }

    const getSessions = () => {
        api
            .get("/api/sessions/")
            .then((res) => res.data)
            .then((data) => {
                const keys = Object.keys(data);
                const lastIndex = keys[keys.length - 1];
                setLastGoal(data[lastIndex]['goal']);
                setLastReflection(data[lastIndex]['reflection']);
                setSessionData(data.reverse()); // dates need to be descending
                console.log(data);
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-col flex-grow mx-auto">
                <div className="mx-auto pt-5 text-center">
                    <p className="font-bold text-[3em]">Hello, {name}</p>
                    <p className=" font-medium text-[2em]">Ready for a new session?</p>
                </div>
                <div className="p-16 flex flex-col gap-7">
                    <div>
                        <div className="flex flex-col gap-3 mx-auto">
                            <div className="flex gap-3 mx-auto">
                                <Card isPressable isHoverable onClick={() => setSessionBuffer('logic')}
                                    className="min-h-32 bg-blue-200 border-1 border-black">
                                    <CardBody>
                                        <div className="flex flex-col gap-3">
                                            <span className="text-2xl font-semibold text-center px-12 max-w-56">Logical Reasoning</span>
                                            <i className="bi bi-lightbulb text-2xl mx-auto"></i>
                                        </div>
                                    </CardBody>
                                </Card>
                                <Card isPressable isHoverable onClick={() => setSessionBuffer('reading')}
                                    className="min-h-32 bg-green-200 border-1 border-black">
                                    <CardBody>
                                        <div className="flex flex-col gap-3">
                                            <span className="text-2xl font-semibold text-center max-w-48">Reading Comprehension</span>
                                            <i className="bi bi-book text-2xl mx-auto"></i>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                            <Card isPressable isHoverable onClick={() => setSessionBuffer('shuffle')}
                                className="min-h-32 max-w-72 mx-auto bg-yellow-200 border-1 border-black">
                                <CardBody>
                                    <div className="flex flex-col gap-3">
                                        <span className="text-2xl font-semibold text-center px-8 mx-auto">Shuffle Mode</span>
                                        <i className="bi bi-shuffle text-2xl mx-auto"></i>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                    <Divider />
                    <div className="flex gap-3">
                        <Card className="hover:scale-105">
                            <CardHeader>
                                <i className="bi bi-graph-up-arrow"></i>
                                <p className="text-lg mx-auto font-semibold">Recent scores</p>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <Table aria-label="table">
                                    <TableHeader>
                                        <TableColumn>DATE</TableColumn>
                                        <TableColumn>SUBJECT</TableColumn>
                                        <TableColumn>TEST SCORE</TableColumn>
                                        <TableColumn>SELF-EVALUATION</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {sessionData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell>{item.score}%</TableCell>
                                                <TableCell>{item.self_evaluation}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>
                        <Card className="hover:scale-105">
                            <CardHeader>
                                <i className="bi bi-stars"></i>
                                <p className="text-lg mx-auto font-semibold">Your self-evaluation</p>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="max-w-96">
                                    <div dangerouslySetInnerHTML={{ __html: summary }} />
                                </div>
                            </CardBody>
                            <CardFooter>
                                <i className="bi bi-exclamation-circle mr-2"></i>
                                Remember, it is important to have an accurate self-evaluation!
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="flex gap-3 mx-auto">
                        <Goal goal={ lastGoal }/>
                        <Reflection reflection={ lastReflection } />
                    </div>
                </div>
            </div>
        </div>
    );
}
