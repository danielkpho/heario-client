// import React, { useState, useEffect } from 'react';

// import Button from '@mui/material/Button';

// const AnswerButton = (props) => {
//     const [isButtonClicked, setButtonClicked] = useState(false);

//     useEffect(() => {
//         // Reset the state when isButtonClicked changes
//         if (isButtonClicked) {
//           setButtonClicked(false);
//         }
//       }, [isButtonClicked]);

//     const handleButtonClick = (r) => {
//         setButtonClicked(true);
//         props.onClick();
//     }

//     return (
//         <Button
//             disabled={isButtonClicked}
//             color="inherit"
//             className="pitch-trainer-button"
//             style={{ textTransform: 'none' }}
//             onClick={handleButtonClick}
//         >
//             {props.label}
//         </Button>
//     );
// };

// export default AnswerButton;