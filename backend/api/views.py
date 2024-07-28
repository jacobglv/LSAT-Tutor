from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, SessionSerializer
from .models import Session
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import os
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()

MAX_RETRIES = 3  # Maximum number of retries

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def fetch_question(request):
    question_type = request.query_params.get('type', None)
    if question_type == 'logic':
        question_type = 'logical reasoning'
    elif question_type == 'reading':
        question_type = 'reading comprehension'
    elif question_type == 'shuffle':
        question_type = 'reading comprehension or logical reasoning (at random)'
    
    client = OpenAI(
        api_key=os.environ.get("OPEN_AI_API_KEY")
    )
    
    attempt = 0
    while attempt < MAX_RETRIES:
        try:
            response = client.chat.completions.create(
                model='gpt-4o-mini',
                messages=[
                    {
                        'role': 'user',
                        'content': f'''
                        Give me an LSAT {question_type} question with five answer choices and the correct answer. 
                        Make sure the question does not reference a passage unless the passage is explicitly included in the question itself. 
                        If the question is a passage-based question, integrate the passage directly into the question field. 
                        Otherwise, ensure there is no mention of a passage in the question. Format the response in JSON like this:
                        
                        {{
                            "question": "Question text here",
                            "1": "Answer choice A",
                            "2": "Answer choice B",
                            "3": "Answer choice C",
                            "4": "Answer choice D",
                            "5": "Answer choice E",
                            "correct": (number),
                            "explanation": "Explanation text here"
                        }}
                        '''
                    }
                ]
            )

            message = response.choices[0].message.content
            print(message)

            # Get JSON from GPT response. GPT responds with ```json {content} ```
            if '```json' in message:
                json_str = message.split('```json')[1].strip().split('```')[0].strip()
            else:
                json_str = message
            
            # Remove any leading or trailing characters that are not part of the JSON
            json_str = json_str.strip('```').strip()
            
            # Parse the JSON string
            parsed_json = json.loads(json_str)
            return JsonResponse(parsed_json, safe=False)
        
        except IndexError as e:
            print(f"IndexError encountered: {e}. Retrying... ({attempt + 1}/{MAX_RETRIES})")
            attempt += 1
        except json.JSONDecodeError as e:
            print(f"JSONDecodeError encountered: {e}. Retrying... ({attempt + 1}/{MAX_RETRIES})")
            attempt += 1
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return JsonResponse({"error": "An unexpected error occurred"}, status=500)
    
    return JsonResponse({"error": "Failed to fetch question after multiple attempts"}, status=500)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def fetch_summary(request):
    user = request.user
    # Retrieve the last three sessions
    sessions = Session.objects.filter(user=user).order_by('-date')[:3]
    print(sessions)
    if not sessions:
        return JsonResponse({"error": "No session data available"}, status=404)
    
    # Format the data for GPT-4 API
    session_data = []
    for session in sessions:
        session_data.append({
            'date': session.date.strftime('%Y-%m-%d'),
            'goal': session.goal,
            'reflection': session.reflection,
            'self_evaluation': session.self_evaluation,
            'score': session.score,
            'type': session.type
        })
    
    client = OpenAI(api_key=os.environ.get("OPEN_AI_API_KEY"))

    attempt = 0
    while attempt < MAX_RETRIES:
        try:
            response = client.chat.completions.create(
                model='gpt-4o-mini',
                messages=[
                    {
                        'role': 'user',
                        'content': f'''
                        Give me a summary (3 HTML list items, each with a bolded intro) for users who want to improve 
                        their metacognitive self-evaluation.
                        Use the data provided from the user's last three sessions to offer constructive criticism.
                        If their score is above 80%, they are doing great; else, they need to keep working.
                        Here is the data:
                        {json.dumps(session_data, indent=2)}
                        '''
                    }
                ]
            )

            message = response.choices[0].message.content
            print(message)

            # Get HTML from GPT response. GPT responds with ```html {content} ```
            if '```html' in message:
                html_content = message.split('```html')[1].strip().split('```')[0].strip()
            else:
                html_content = message
            return Response({"html_content": html_content}, content_type='text/html')
        
        except IndexError as e:
            print(f"IndexError encountered: {e}. Retrying... ({attempt + 1}/{MAX_RETRIES})")
            attempt += 1
        except json.JSONDecodeError as e:
            print(f"JSONDecodeError encountered: {e}. Retrying... ({attempt + 1}/{MAX_RETRIES})")
            attempt += 1
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return JsonResponse({"error": "An unexpected error occurred"}, status=500)
    
    return JsonResponse({"error": "Failed to fetch summary after multiple attempts"}, status=500)

class SessionListCreate(generics.ListCreateAPIView):
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Session.objects.filter(user=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)
            
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    