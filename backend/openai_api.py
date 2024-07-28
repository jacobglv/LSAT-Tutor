import os
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("OPEN_AI_API_KEY")
)

response = client.chat.completions.create(
    model='gpt-4o-mini',
    messages=[
        {'role': 'user',
        'content': '''Give me an LSAT logical reasoning question with five answer choices and the correct answer.
                    If there is a passage, prepend it to the question. Use JSON to format it like this:
                    
                    question: 
                    1:
                    2:
                    3:
                    4:
                    5:
                    correct: (number)
                    explanation:
                    ''',
        }
    ]
)

message = response.choices[0].message.content

# Get JSON from GPT response. GPT responds with ```json {content} ```
json_str = message.split('```json')[1].strip().split('```')[0].strip()

try:
    data_dict = json.loads(json_str)
except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")
    
question = data_dict['question']
    
choices = [data_dict[str(choice)] for choice in range(1,6)]

answer = data_dict['correct']

explanation = data_dict['explanation']
