# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from .models import Mesas

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

from .serializers import SerializadorMesas


class CrearObtenerMesasView(ModelViewSet):
    serializer_class = SerializadorMesas
    queryset = Mesas.objects.all()
    permission_classes = (AllowAny,)

    def get_queryset(self):
        qs = Mesas.objects.all()

        floor = self.request.query_params.get('floor')
        if floor:
            qs = qs.filter(location=floor)

        return qs
