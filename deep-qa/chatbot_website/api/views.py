from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .chatbotmanager import ChatbotManager


@api_view(['POST'])
def call_bot(request):
    """
    Answer at question
    """
    if request.method == 'POST':
        data = request.data
        receiver = ChatbotManager.callBot(data["message"])
        data['receiver'] = receiver;
        return Response(data, status=status.HTTP_201_CREATED)