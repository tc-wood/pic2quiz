import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Quiz = () => {
    const location = useLocation();
    const formRef = useRef(null);
    const [showQuiz, setShowQuiz] = useState(true);
    const [results, setResults] = useState(null);
    const data = location.state;
    const correctAnswers = data.questions.map((q) => q.correct);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData(formRef.current);
        const submission = [];
        for(const [key, value] of form.entries()){
            submission.push(value);
        }
        const feedback = data.questions.map((question, index) => {
            const isCorrect = correctAnswers[index] === submission[index];
            return {
                question: question.mcq,
                userAnswer: submission[index],
                correctAnswer: correctAnswers[index],
                isCorrect: isCorrect
            };
        });
        setResults(feedback);
        setShowQuiz(false);
    };

    const retakeQuiz = () => {
        setShowQuiz(true);
        setResults(null);
    };

    return (
        <div className="window">
            {showQuiz ? (
                <>
                    <h1>{data.title}</h1>
                    <form ref={formRef} onSubmit={handleSubmit}>
                        {data.questions.map((q, index) => (
                            <div key={index}>
                                <h3>{q.mcq}</h3>
                                {Object.entries(q.options).map(([key, value], i) => (
                                    <div key={i}>
                                        <label>
                                            <input type="radio" name={index} value={key} />{value}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button className='capture-button' type="submit">Submit Answers</button>
                    </form>
                </>
            ) : (
                <div>
                    <h2>Results:</h2>
                    {results && results.map((result, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <h3>{result.question}</h3>
                            <p>
                                Your answer: {data.questions[index].options[result.userAnswer]}
                                <br />
                                {result.isCorrect ? (
                                    <span style={{ color: 'green' }}>Correct!</span>
                                ) : (
                                    <>
                                        <span style={{ color: 'red' }}>Incorrect</span>
                                        <br />
                                        Correct answer: {data.questions[index].options[result.correctAnswer]}
                                    </>
                                )}
                            </p>
                        </div>
                    ))}
                    <p>You got {results.filter(result => result.isCorrect).length}/{data.questions.length} questions right!</p>
                    <button className="capture-button" onClick={retakeQuiz}>Retake Quiz</button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
