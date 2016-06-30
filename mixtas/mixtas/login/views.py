# -*- coding: utf-8 -*-
"""
STAD Team
~~~~~~~~~
"""
from __future__ import unicode_literals

from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .serializers import LoginSerializer


class LoginRetrieveView(ListModelMixin, GenericViewSet):
    model = User
    queryset = User.objects.all()
    serializer_class = LoginSerializer

    def get_queryset(self):
        user_name = self.request.query_params['name']
        user_password = self.request.query_params['password']

        # user = authenticate(username=user_name, password=user_password)
        return User.objects.filter(username=user_name)
