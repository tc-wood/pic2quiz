import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Quiz = () => {
    const location = useLocation();
    const data = location.state;

    return (
        <div className="window">
            <h1>Quiz</h1>
            {data && <p>{data}</p>}
        </div>
    );
};

export default Quiz;