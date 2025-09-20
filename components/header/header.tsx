import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Burger, Box, Paper } from "@mantine/core";
import Button from "../tailwind/button";

export interface HeaderProps {
    logoUrl: string;
    navMap?: Array<{ href: string, label: string }>;
}

export const Header: React.FC<HeaderProps> = ({logoUrl, navMap = []}) => {
    const [opened, setOpened] = useState(false);
    const title = opened ? "Close navigation" : "Open navigation";

    const getHref = (href: string) => {
        if (href.startsWith("/")) {
            return href;
        }
        return `/${href}`;
    };

    return (
        <Box component="header" className="bg-brandMutedYellow-600 py-4 md:py-8 relative">
            <Box className="container flex justify-between items-center">
                <Link href="/">
                    <Image height={56} width={250} src={logoUrl} alt="Logo" priority />
                </Link>

                <Box className="hidden md:flex md:items-center space-x-2">
                    {navMap.length > 0 && navMap.map((item) => (
                        <Button variant="filled" key={item.href}>
                            <Link href={getHref(item.href)} passHref legacyBehavior>
                                <a className="text-white no-underline hover:text-gray-200 px-3 py-2 rounded-md text-sm font-bold">
                                    {item.label}
                                </a>
                            </Link>
                        </Button>
                    ))}
                </Box>

                <Box className="md:hidden ml-4">
                    <Burger
                        opened={opened}
                        onClick={() => setOpened((o) => !o)}
                        title={title}
                        color="white"
                    />
                </Box>
            </Box>

            {opened && (
                <Paper 
                    className="md:hidden absolute top-full left-0 right-0 z-20 shadow-lg"
                    bg="brandMutedYellow.6"
                    p="md" 
                    withBorder
                    radius={0}
                >
                    <ul className="flex flex-col space-y-2">
                        {navMap.length > 0 && navMap.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} passHref legacyBehavior>
                                    <a 
                                        className="block text-white no-underline hover:text-gray-200 px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setOpened(false)}
                                    >
                                        {item.label}
                                    </a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Paper>
            )}
        </Box>
    );
};