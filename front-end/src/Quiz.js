import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Quiz = () => {
    const location = useLocation();
    const formRef = useRef(null);
    const [correct, setCorrect] = useState(null)
    const data = location.state;
    const correctAnswers = data.questions.map((q) => q.correct)
    console.log(correctAnswers)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        const form = new FormData(formRef.current);
        const submission = []
        for(const [key, value] of form.entries()){
            submission.push(value)
        }
        const correctSubmissions = correctAnswers.reduce((acc, answer, index) => {
            const studentAnswer = submission[index];
            if(answer === studentAnswer) {
                return acc + 1;
            }
         
            return acc;
        }, 0);
        setCorrect(correctSubmissions)
    }
    return (
        <div className="window">
            <h1>{data.title}</h1>
            <form ref={formRef} onSubmit={handleSubmit}>
                {data.questions.map((q, index) => (
                    <div key={index}>
                        <h3>{q.mcq}</h3>
                        {Object.entries(q.options).map(([key, value], i) => (
                            <div key={i}>
                                <label><input type="radio" name={index} value={key} />{value}</label>
                            </div>
                        ))}
                    </div>
                ))}
                <button className='capture-button' type="submit">Submit Answers</button>
            </form>
            {typeof correct == "number" && <p>You got {correct}/{data.questions.length} questions right!</p>}
        </div>
    );
};

export default Quiz;