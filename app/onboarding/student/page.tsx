"use client";

import { useState } from "react";
import LevelSelector from "../components/levelSelector";
import SubjectSelector from "../components/subjectsSelector";
import { ProgramLevelId } from "@/types/types";

export default function StudentOnboarding() {

    // state controlling level selection
    const [levelOpen , setLevelOpen] = useState<boolean>(true) 

    // state controlling subject selection
    const [subjectOpen , setSubjectOpen] = useState<boolean>(false)  

    const [selectedLevel, setSelectedLevel] = useState<ProgramLevelId | null>(null);

    const handleLevelClick = () => {

        // making the level component to hide
        setLevelOpen(false)

        // set the subject selection component to open
        setSubjectOpen(true) 

    }
    
    return (
        <>
            {levelOpen && (
                <LevelSelector 
                    selectedLevel={selectedLevel}
                    setSelectedLevel={setSelectedLevel}
                    handleLevelClick={handleLevelClick}
                />
            )}

            {subjectOpen && (
                <SubjectSelector 
                  selectedLevel={selectedLevel}
                  onBack={() => {
                    setLevelOpen(true) 
                    setSubjectOpen(false) 
                  }}

                />
            )}
        </>
    );
} 