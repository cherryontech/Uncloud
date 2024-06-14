import React from "react";

interface ConfirmationMessageProps {
  userDisplayName: string;
  hideConfirmationMessage: () => void;
}

const ConfirmationMessage: React.FC<ConfirmationMessageProps> = ({
  userDisplayName,
  hideConfirmationMessage,
}) => {
return (
   <div className="absolute left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform border border-black p-8">
      <h1 className="text-3xl">Welcome, {userDisplayName}!</h1>
      <p>
        You can now start logging your reflections. Let’s get started with your
        first one!
      </p>
      <p>Select your current career emotion from the icons on our homepage.</p>
      <p>Explore prompts and content tailored to your chosen emotion.</p>
      <p>
        Gain clarity on your goals and identify areas for focus through these
        exercises.
      </p>
      <button
        className="w-1/2 rounded-full bg-slate-400 p-2"
        onClick={hideConfirmationMessage}
      >
        Get started
      </button>
    </div>
  );
}


export default ConfirmationMessage;
