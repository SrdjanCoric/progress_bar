import React, { useState, useEffect, useCallback } from 'react';

const ProgressBar = ({ width, id, isRunning, onStopRunning }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress === 100 && isRunning) {
      onStopRunning(id);
    }
  }, [progress, isRunning, onStopRunning, id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 20;
        }
        clearInterval(interval);
        return prevProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const barWidth = (width / 100) * progress;

  return (
    <div className="progress-bar" style={{ width: `${width}px`, height: '20px', border: '1px solid #000' }}>
      <div
        className="progress"
        style={{ width: `${barWidth}px`, height: '100%', backgroundColor: '#00ff00' }}
      ></div>
    </div>
  );
};

const App = () => {
  const [progressBars, setProgressBars] = useState([]);
  const [lastId, setLastId] = useState(1);
  const [numInQueue, setNumInQueue] = useState(0);
  const MAXIMUM_RUNNING = 5
  const handleStopRunning = useCallback(
    (id) => {
      setProgressBars((prevProgressBars) =>
        prevProgressBars.map((bar) => (bar.id === id ? { ...bar, isRunning: false } : bar))
      );
    },
    []
  );
  const isMaximumRunning = progressBars.filter(bar => bar.isRunning).length === MAXIMUM_RUNNING
  useEffect(() => {
    if (isMaximumRunning || !numInQueue) {
      return
    }
    setProgressBars((prevProgressBars) => [...prevProgressBars, { id: lastId, width: 200, isRunning: true}]);
    setLastId(prevState => prevState + 1)
    setNumInQueue(prev => prev - 1)
  }, [isMaximumRunning, lastId, numInQueue])

  return (
    <div>
      <button onClick={() => setNumInQueue(prev => prev + 1)}>Add Progress Bar</button>
      <button onClick={() => {
        if (numInQueue > 0) {
          setNumInQueue(prev => prev - 1)
        }

      }
      }>Remove From Queue</button>
      {progressBars.map((progressBar) => <ProgressBar key={progressBar.id} {...progressBar} onStopRunning={handleStopRunning} />)}
    </div>
  );
};

export default App;
