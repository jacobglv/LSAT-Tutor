# LSAT_Tutor

## Overview
LSAT Tutor is an application built using OpenAI’s API with access to their state-of-the-art language model, ChatGPT-4o, to quickly deliver LSAT practice questions,
answers, and explanations. It also challenges the user metacognitively by encouraging them to set goals, self-evaluate, and reflect on their learning. Because
metacognition is essential for students’ success and critical thinking skills, and critical thinking skills are important to develop to take the LSAT, this implementation should improve student outcomes. It seems to be a knowledgeable tutor, having scored 85% (17/20) on logical reasoning questions with varying difficulties and 100% (12/12) on reading comprehension questions during my evaluation.

## Key Features
- Metacognitive Approach: Encourages users to set goals, self-evaluate, and reflect on their learning, improving their metacognitive skills.
- Multiple Sections: Provides practice sessions for Logical Reasoning, Reading Comprehension, and a Shuffle Mode that combines both.
- AI-Powered Questions: Uses GPT-4o to dynamically generate LSAT questions and explanations.
- Session Summaries: Generates a personalized summary after each session based on the user's goals, reflections, and performance in the last three sessions.
- Affordable Tutoring: Aims to provide a cost-effective alternative to expensive private tutoring, which can be prohibitive for students from lower-income backgrounds.

## Technology Stack

### Frontend:

- React.JS with React Router for page navigation
- Local Storage to maintain authentication tokens and session data
- Axios for communication with the backend
- Context API for state management across sessions

### Backend:

- Django for handling user sessions, generating LSAT questions, and processing metacognitive data
- SQLite as the database for storing user data, session statistics, goals, reflections, and evaluations
- OpenAI API (GPT-4o) for generating questions, answers, and summaries

## Installation and Setup
### Prerequisites
- Node.js (v14 or higher)
-Python (v3.8 or higher)
- Django
- OpenAI API key (you need to sign up for OpenAI access)

### Steps
- Clone the Repository
```
bash
git clone https://github.com/jacobglv/LSAT-Tutor
cd lsat-tutor
```
- Navigate to the backend folder:
```
cd backend
```

- Create and activate a Python virtual environment:
```
python -m venv env
source env/bin/activate  # On Windows, use `env\Scripts\activate`
```

- Install dependencies:
```
pip install -r requirements.txt
```

- Set up the database:
```
python manage.py migrate
```

- Create a .env file with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

- Start the backend server:
```
python manage.py runserver
```

- Navigate to the frontend folder:
```
cd ../frontend
```

- Install dependencies:
```
npm install
```

- Start the frontend server:
```
npm start
```

- Access the Application:

On your browser, navigate to the link in the terminal.

## Features Breakdown
1. Session Configuration
Users choose between Logical Reasoning, Reading Comprehension, or Shuffle Mode.
They set a goal, choose the number of questions, and select whether the session should be timed.
2. Question Answering and Feedback
Users are presented with AI-generated questions.
After selecting an answer, the correct response is displayed along with an explanation.
The user can self-evaluate their understanding.
3. Metacognitive Reflection
After each session, users can reflect on their learning experience, documenting their difficulties and improvements. These reflections help users engage with the material at a deeper level.
4. Dynamic Summary
A personalized summary is generated using data from the last three sessions. It offers feedback based on performance, self-evaluation, and metacognitive reflections, guiding users in their future learning efforts.

## Evaluation
In an initial evaluation of LSAT Tutor using 32 free LSAT questions:

GPT-4o scored:
85% (17/20) on logical reasoning questions
100% (12/12) on reading comprehension questions

The evaluation showed that GPT-4o is an effective provider for LSAT Tutor. It scored 90.6% on the thirty-two given questions, with two out of three missed questions being the most challenging difficulty. Based on this small evaluation, GPT-4o would have scored around 170 on the LSAT. For reference, a score of 170 on the LSAT is in the 96th percentile according to the Law School Admission Council (2023).


## Contributing
If you'd like to contribute to LSAT Tutor, submit pull requests or report issues. I welcome any contributions!
