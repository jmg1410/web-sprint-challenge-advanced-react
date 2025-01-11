
import React, {useState} from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

//STATE

const [position, setPosition] = useState(initialIndex);
const [steps, setSteps] = useState(initialSteps);
const [email, setEmail] = useState(initialEmail)
const [message, setMessage] = useState(initialMessage)

  function getXY() {
    const x = (position % 3) + 1;
    const y = Math.floor(position / 3) + 1;
    return {x, y};
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  function getXYMessage() {
    const {x, y} = getXY();
    return `Coordinates (${x}, ${y})`
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
   setPosition(initialIndex); 
   setSteps(initialSteps);
   setEmail(initialEmail);
   setMessage('');// Use this helper to reset all states to their initial values.
  }

  function getNextIndex(direction) {
    const row = Math.floor(position / 3);
    const col = position % 3;

    switch(direction) {
      case 'up':
        return row === 0 ? position : position - 3;
      case 'down':
        return row === 2 ? position : position + 3;
      case 'left':
        return col === 0 ? position : position -1;
      case 'right':
        return col === 2 ? position : position + 1;
        default:
          return position    
    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(evt) {
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);
    
      if (nextIndex === position) {
     switch (direction) {
      case 'up':
        setMessage("You can't go up");
        break;
        case 'down':
          setMessage("You can't go down");
          break;
        case 'left':
          setMessage("You can't go left")
          break;
         case 'right':
          setMessage("You can't go right");
          break;
          default:
            break; 
     }
    } else {
      setPosition(nextIndex);
      setSteps(steps + 1);
      setMessage('')
    }
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    setEmail(evt.target.value)// You will need this to update the value of the input.
  }

  async function onSubmit(evt) {
    evt.preventDefault();

    if (!email.trim()) {
      setMessage('Ouch: email is required'); // Handle missing email
      return;
    }
  
    const { x, y } = getXY();
    const payload = { x, y, steps, email };
  
    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage(data.message); // Success message from API
      } else {
        setMessage(data.message || 'Error submitting data'); // Handle server-side validation errors
      }
    } catch (error) {
      setMessage('Error submitting data'); // Fallback error message
    }
  
    setEmail(''); // Clear email input after submission
  
}

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
        
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === position ? ' active' : ''}`}>
              {idx === position ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right"onClick={move}>RIGHT</button>
        <button id="down"onClick={move}>DOWN</button>
        <button id="reset"onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
      }
