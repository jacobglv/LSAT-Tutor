import React, { useState, useEffect, useContext } from "react";
import Nav from "./Nav";
import api from "./api";
import { SessionContext } from "./SessionContext";
import { useNavigate } from "react-router-dom";
import './output.css';
import {Card, CardBody, CardFooter, Skeleton, Input, Button, Image, CardHeader, Divider, Spinner, Link, Tabs, Tab, TableRow, TableCell, TableHeader, Table, TableColumn, TableBody, Chip, Textarea, spinner} from "@nextui-org/react";

export default function ChatTemplate({}) {
    // states to store
    const [numCorrect, setNumCorrect] = useState(0);
    const [selfEvaluationCorrect, setSelfEvaluationCorrect] = useState(0);

    const [timeLimit, setTimeLimit] = useState(0);
    const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
    const [question, setQuestion] = useState("");
    const [answerChoices, setAnswerChoices] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [explanation, setExplanation] = useState("");
    const { goal, numberOfQuestions, isTimed, type, reflection, setReflection, session, setIsTimed, setSession, setNumberOfQuestions} = useContext(SessionContext);
    const [selection, setSelection] = useState(Array(5).fill(false)); // answer choice
    const [selfEvaluateTrue, setSelfEvaluateTrue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sessionOver, setSessionOver] = useState(false); // used to activate self reflection
    const [explanationMode, setExplanationMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { // initial render loads the first question
        if (isTimed) {
            startTimer()
        }
        getQuestion();
    }, [])

    const startTimer = () => {
        setTimeLimit(numberOfQuestions * 60);
        const timer = setInterval(() => {
            setTimeLimit(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }

    const submitAnswer = () => {
        const mySelection = selection.findIndex(value => value === true);
        if (correctAnswer === mySelection + 1) { // checking if answer is correct
            setNumCorrect(numCorrect + 1);
            if (selfEvaluateTrue === true) {
                setSelfEvaluationCorrect(selfEvaluationCorrect + 1);
            }
        } else if (selfEvaluateTrue === false) {
            setSelfEvaluationCorrect(selfEvaluationCorrect + 1);
        }
        setExplanationMode(true);
        setSelfEvaluateTrue(null);
    }

    const nextQuestion = () => {
        setCurrentQuestionNum(currentQuestionNum + 1);
        setExplanationMode(false);
        setSelection(Array(5).fill(false))
        getQuestion();
    }

    const getQuestion = () => {
        setLoading(true); // loading circle until first question is generated
        api
            .get(`/api/question/?type=${session}`)
            .then((res) => res.data)
            .then((data) => {
                data = typeof data === 'string' ? JSON.parse(data) : data;
                console.log(data);
                setQuestion(data['question']);
                setAnswerChoices(Array.from({ length: 5 }, (_, i) => data[(i + 1).toString()]));
                setCorrectAnswer(data['correct'])
                setExplanation(data['explanation'])
                console.log(data['question']);
                setLoading(false);
            })
            .catch((err) => console.log(err))
    }

    const getCurrentScore = () => {
        if (currentQuestionNum > 1) {
            return `${(numCorrect / (currentQuestionNum - 1)) * 100}%`                      
        } else {
            return 'Answer more questions!'
        }
    }

    const makeASelection = (select) => {
        const selections = Array(5).fill(false);
        selections[select] = true;
        setSelection(selections);
        console.log(selections);
    }

    const finishSession = () => {
        // update score, reflection, self evaluation score, type in database
        let type = session;
        if (type == 'logic') {
            type = 'LR';
        } else if (type == 'reading') {
            type = 'RC';
        } else {
            type = 'S';
        }
        const self_evaluation = (selfEvaluationCorrect / numberOfQuestions) * 100;
        const score = (numCorrect / numberOfQuestions) * 100;
        api
        .post("/api/sessions/", { goal, reflection, self_evaluation, score, type})
        .then((res) => {
            setIsTimed(null);
            setSession('');
            setNumberOfQuestions(0);
            navigate('/');
        })
        .catch((err) => alert(err));
    }

    return(
    <div>
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-col flex-grow p-10 gap-5">
                <div className="flex gap-3">
                <Card className="hover:scale-105">
                    <CardHeader>
                        <div className="flex gap-8 mx-auto">
                            <i className="bi bi-bullseye"></i>
                            <p className="text-lg mx-auto font-semibold">Your session goal</p>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <p className="max-w-96">{goal}</p>
                    </CardBody>
                </Card>
                <Card className="hover:scale-105 mr-auto">
                    <CardHeader>
                        <div className="flex gap-8 mx-auto">
                            <p className="text-lg mx-auto font-semibold">Current Score</p>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <p className="max-w-96 mx-auto">{getCurrentScore()}</p>
                    </CardBody>
                </Card>
                <div>
                    {isTimed ? <p>Time left: {Math.floor(timeLimit / 60)}:{timeLimit % 60 < 10 ? `0${timeLimit % 60}` : timeLimit % 60}</p> : null}
                </div>
                </div>
                {loading ? (<Card className="mx-auto p-5">
                    <Skeleton className="rounded-lg w-2/5"><CardHeader>
                        <p className="font-bold">{numberOfQuestions} Question Practice Test</p>
                    </CardHeader></Skeleton>
                    <Skeleton className="rounded-lg"><CardBody>
                        <p className=" max-w-6xl">{currentQuestionNum}) {question}</p>
                    </CardBody></Skeleton>
                    <CardFooter>
                        <div className="flex flex-col gap-4">
                        <Skeleton className="rounded-lg w-3/5">
                        <div className="flex gap-2 hover:cursor-pointer p-2 rounded-md">
                                <Chip size="lg"  onClick={()=>{makeASelection(0)}}>A</Chip>
                                <p>{answerChoices[0]}</p>
                        </div> 
                        </Skeleton>
                        <Skeleton className="rounded-lg w-3/5">
                            <div className="flex gap-2 hover:cursor-pointer p-2 rounded-md">
                                <Chip size="lg"  onClick={()=>{makeASelection(1)}}>B</Chip>
                                <p>{answerChoices[1]}</p>
                            </div>
                            </Skeleton>
                            <Skeleton className="rounded-lg w-3/5">
                            <div className="flex gap-2 hover:cursor-pointer p-2 rounded-md">
                                <Chip size="lg"  onClick={()=>{makeASelection(2)}}>C</Chip>
                                <p>{answerChoices[2]}</p>
                            </div>
                            </Skeleton>
                            <Skeleton className="rounded-lg w-3/5">
                            <div className="flex gap-2 hover:cursor-pointer p-2 rounded-md">
                                <Chip size="lg" onClick={()=>{makeASelection(3)}}>D</Chip>
                                <p>{answerChoices[3]}</p>
                            </div>
                            </Skeleton>
                            <Skeleton className="rounded-lg w-3/5">
                            <div className="flex gap-2 hover:cursor-pointer p-2 rounded-md">
                                <Chip size="lg" onClick={()=>{makeASelection(4)}}>E</Chip>
                                <p>{answerChoices[4]}</p>
                            </div>
                            </Skeleton>
                            <br/>
                            {selection.includes(true) ? (
                            <>
                                <div><span className="font-bold">Evaluation: </span>Do you think you answered correctly?</div>
                                <div>
                                    <i className="bi bi-hand-thumbs-up text-4xl text-green-600 hover:cursor-pointer" onClick={()=>{setSelfEvaluateTrue(true)}}></i>
                                    <i className="bi bi-hand-thumbs-down text-4xl text-red-600 ml-2 hover:cursor-pointer" onClick={()=>{setSelfEvaluateTrue(false)}}></i>
                                </div>
                            </>
                            ) : null
                            }
                            {selfEvaluateTrue != null ? (
                                <Button color="primary" className="w-1/5 mr-auto">Submit Answer</Button>
                            ) : null}
                        </div>
                    </CardFooter>
                </Card>) : !sessionOver ?
                (<Card className="mx-auto p-5">
                    <CardHeader>
                        <p className="font-bold">{numberOfQuestions} Question Practice Test</p>
                    </CardHeader>
                    <CardBody>
                        <p className=" max-w-6xl">{currentQuestionNum}) {question}</p>
                    </CardBody>
                    <CardFooter>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2 hover:cursor-pointer p-2">
                                {explanationMode && correctAnswer === 1 ? (
                                    <Chip className="text-xl bg-green-600" size="lg"  onClick={()=>{makeASelection(0)}}>A</Chip>
                                ) : explanationMode && correctAnswer != 1 && selection[0] ? (
                                    <Chip className="text-xl bg-red-600" size="lg"  onClick={()=>{makeASelection(0)}}>A</Chip>
                                ): selection[0] ? (
                                    <Chip className="text-xl bg-blue-500" size="lg"  onClick={()=>{makeASelection(0)}}>A</Chip>
                                ):
                                (
                                    <Chip className="text-xl" size="lg"  onClick={()=>{makeASelection(0)}}>A</Chip>
                                )
                                } 
                                <p>{answerChoices[0]}</p>
                            </div> 
                            <div className="flex gap-2 hover:cursor-pointer p-2">
                                {explanationMode && correctAnswer === 2 ? (
                                    <Chip className="text-xl bg-green-600" size="lg"  onClick={()=>{makeASelection(1)}}>B</Chip>
                                ) : explanationMode && correctAnswer != 2 && selection[1] ? (
                                    <Chip className="text-xl bg-red-600" size="lg"  onClick={()=>{makeASelection(1)}}>B</Chip>
                                ): 
                                selection[1] ? (
                                    <Chip className="text-xl bg-blue-500" size="lg"  onClick={()=>{makeASelection(1)}}>B</Chip>
                                ):(
                                    <Chip className="text-xl" size="lg"  onClick={()=>{makeASelection(1)}}>B</Chip>
                                )
                                } 
                                <p>{answerChoices[1]}</p>
                            </div>
                            <div className="flex gap-2 hover:cursor-pointer p-2">
                                {explanationMode && correctAnswer === 3 ? (
                                    <Chip className="text-xl bg-green-600" size="lg"  onClick={()=>{makeASelection(2)}}>C</Chip>
                                ) : explanationMode && correctAnswer != 3 && selection[2] ? (
                                    <Chip className="text-xl bg-red-600" size="lg"  onClick={()=>{makeASelection(2)}}>C</Chip>
                                ): selection[2] ? (
                                    <Chip className="text-xl bg-blue-500" size="lg"  onClick={()=>{makeASelection(2)}}>C</Chip>
                                ):
                                (
                                    <Chip className="text-xl" size="lg"  onClick={()=>{makeASelection(2)}}>C</Chip>
                                )
                                } 
                                <p>{answerChoices[2]}</p>
                            </div>
                            <div className="flex gap-2 hover:cursor-pointer p-2">
                                {explanationMode && correctAnswer === 4 ? (
                                    <Chip className="text-xl bg-green-600" size="lg"  onClick={()=>{makeASelection(3)}}>D</Chip>
                                ) : explanationMode && correctAnswer != 4 && selection[3] ? (
                                    <Chip className="text-xl bg-red-600" size="lg"  onClick={()=>{makeASelection(3)}}>D</Chip>
                                ): selection[3] ? (
                                    <Chip className="text-xl bg-blue-500" size="lg"  onClick={()=>{makeASelection(3)}}>D</Chip>
                                ):
                                (
                                    <Chip className="text-xl" size="lg"  onClick={()=>{makeASelection(3)}}>D</Chip>
                                )
                                } 
                                <p>{answerChoices[3]}</p>
                            </div>
                            <div className="flex gap-2 hover:cursor-pointer p-2">
                                {explanationMode && correctAnswer === 5 ? (
                                    <Chip className="text-xl bg-green-600" size="lg"  onClick={()=>{makeASelection(4)}}>E</Chip>
                                ) : explanationMode && correctAnswer != 5 && selection[4] ? (
                                    <Chip className="text-xl bg-red-600" size="lg"  onClick={()=>{makeASelection(4)}}>E</Chip>
                                ): selection[4] ? (
                                    <Chip className="text-xl bg-blue-500" size="lg"  onClick={()=>{makeASelection(4)}}>E</Chip>
                                ):
                                (
                                    <Chip className="text-xl" size="lg"  onClick={()=>{makeASelection(4)}}>E</Chip>
                                )
                                } 
                                <p>{answerChoices[4]}</p>
                            </div>
                            <br/>
                            {selection.includes(true) && explanationMode === false ? (
                            <>
                                <div><span className="font-bold">Evaluation: </span>Do you think you answered correctly?</div>
                                <div>
                                    <i className="bi bi-hand-thumbs-up text-4xl text-green-600 hover:cursor-pointer" onClick={()=>{setSelfEvaluateTrue(true)}}></i>
                                    <i className="bi bi-hand-thumbs-down text-4xl text-red-600 ml-2 hover:cursor-pointer" onClick={()=>{setSelfEvaluateTrue(false)}}></i>
                                </div>
                            </>
                            ) : null
                            }
                            {selfEvaluateTrue != null && explanationMode === false ? (
                                <Button color="primary" className=" w-40 mr-auto" onClick={()=>{submitAnswer()}}>Submit Answer</Button>
                            ) : null}
                            {explanationMode ? 
                            (
                            <>
                            <p className="font-bold">Explanation:</p>
                            <p className=" max-w-5xl">{explanation}</p>

                            {currentQuestionNum == numberOfQuestions ? (
                                <Button color="primary" className="w-1/5 mr-auto" onClick={()=>{setSessionOver(true)}}>End test</Button>
                            ): 
                                (<Button color="primary" className="w-1/5 mr-auto" onClick={()=>{nextQuestion()}}>Next question</Button>)}
                            </>)
                             : null}
                            
                        </div>
                    </CardFooter>
                </Card>) : null}
                {sessionOver ? (    
                    <div className="flex flex-col gap-3 mx-auto">                    
                    <Card className="hover:scale-105">
                            <CardHeader>
                                <div className="flex gap-3">
                                    <i className="bi bi-bullseye"></i>
                                    <p className="text-lg mx-auto font-semibold">Reflect on your session</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="flex flex-col gap-5">
                                    <Textarea value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="Write your reflection..." />
                                        <p>Hint: Did you improve this session? What did you struggle with?</p>
                                </div>
                            </CardBody>
                    </Card>
                    <Button className="w-1/2" onClick={()=>{finishSession()}}>Done!</Button>
                    </div>) 
                    : null}
            </div>
        </div>
    </div>);
}
