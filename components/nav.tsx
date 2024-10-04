"use client";

import { Binoculars, Mountain } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ModeToggle } from "./ui/mode-toggle";
import { ComponentProps } from "react";
import Link from "next/link";

export default function Navbar() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 50], [1, 0]);

  const wiggleAnimation = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        repeat: 1,
        repeatType: "reverse" as const,
      },
    },
    hover: {
      rotate: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  return (
    <nav className="shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl bg-background mx-auto px-4 sm:px-6 lg:px-8 border-x">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Binoculars className="h-8 w-8" />
            <motion.span
              className="ml-2 text-xl font-semibold inline-block"
              style={{ opacity }}
              variants={wiggleAnimation}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              Scout
            </motion.span>
          </div>
          <div className="flex gap-4 items-center">
            <ModeToggle />
            <GithubIcon className="h-[1.2rem] w-[1.2rem] dark:invert"/>
          </div>
        </div>
      </div>
    </nav>
  );
}

const GithubIcon: React.FC<ComponentProps<"a">> = (props) => {
  return (
    <Link target="_blank" href={"https://github.com/dhruvvbhavsar"} {...props}>
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>GitHub</title>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    </Link>
  );
};