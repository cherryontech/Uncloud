export default function ConfirmationMessage({
	userDisplayName,
	hideConfirmationMessage,
}) {
	return (
		<div className=' border border-black'>
			<h1>Welcome {userDisplayName} </h1>
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
			<button onClick={hideConfirmationMessage}>Get started</button>
		</div>
	);
}
