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

ACCESS_CONTROL_ALLOW_HEADERS = 'Authorization,Content-Type'
ACCESS_CONTROL_ALLOW_METHODS = 'GET, POST, PUT, PATCH, HEAD, OPTIONS, DELETE'


class CORSAccessControlMixin(object):
    is_options_method_open = True

    def dispatch(self, request, *args, **kwargs):
        response = super(CORSAccessControlMixin, self).dispatch(request, *args, **kwargs)
        try:
            response['Access-Control-Allow-Origin'] = '*'
            response['Access-Control-Allow-Headers'] = ACCESS_CONTROL_ALLOW_HEADERS
            response['Access-Control-Allow-Methods'] = ACCESS_CONTROL_ALLOW_METHODS
        except TypeError:
            pass
        return response


class CrearUsuariosView(CORSAccessControlMixin, ModelViewSet):
    serializer_class = SerializadorUsuarios
    queryset = User.objects.all()
    permission_classes = (AllowAny,)

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            self.permission_denied(
                self.request, message="You have no permissions for creating a user"
            )
        serializer.save()
