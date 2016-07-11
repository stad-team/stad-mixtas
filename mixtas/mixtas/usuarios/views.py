# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from django.contrib.auth.models import User

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

from .serializers import SerializadorUsuarios


class CrearUsuariosView(ModelViewSet):
    serializer_class = SerializadorUsuarios
    queryset = User.objects.all()
    permission_classes = (AllowAny,)

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            self.permission_denied(
                self.request, message="You have no permissions for creating a user"
            )
        serializer.save()
