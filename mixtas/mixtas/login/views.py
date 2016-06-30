# -*- coding: utf-8 -*-
"""
STAD Team
~~~~~~~~~
"""
from __future__ import unicode_literals

from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import RetrieveModelMixin

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .serializers import LoginSerializer


class LoginRetrieveView(RetrieveModelMixin, GenericViewSet):
    model = User
    queryset = User.objects.all()
    serializer_class = LoginSerializer
    lookup_field = 'username'
