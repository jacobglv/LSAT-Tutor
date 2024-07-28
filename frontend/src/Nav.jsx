import React, {useContext, useEffect} from "react";
import { useNavigate, Navigate } from "react-router-dom";
import './output.css';
import { SessionContext } from "./SessionContext";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Avatar, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu} from "@nextui-org/react";


export default function Nav() {
    const { isAuthorized, setIsAuthorized, name, logout } = useContext(SessionContext);
    const navigate = useNavigate();

    const logoutHandler = () => {
        logout();
        navigate("/logout");
    }

    return (
        <>
            <Navbar isBordered isBlurred={false}>
                <NavbarBrand>
                    <Link className="font-bold text-inherit hover:cursor-pointer" href="/">LSAT Tutor</Link>
                </NavbarBrand>
                <NavbarContent justify="end">
                    {isAuthorized ? (
                        <Dropdown>
                            <DropdownTrigger>
                                <NavbarItem className="hidden lg:flex">
                                    <Avatar name={name} />
                                </NavbarItem>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem key="logout" color="danger" onClick={()=> {logoutHandler()}}>
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>      
                ) : (
                    <NavbarItem className="hidden lg:flex gap-4">
                        <Button color="primary" className="border-2 border-gray-400" onClick={()=> {navigate("/login")}}>Login</Button>
                        <Button size="md" className="" onClick={()=> {navigate("/register")}}>Register</Button>
                    </NavbarItem>
                )
                }
                </NavbarContent>
            </Navbar>
        </>
    );
  }