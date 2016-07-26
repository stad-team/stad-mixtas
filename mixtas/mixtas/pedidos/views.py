# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from .models import Mesas, DetalleOrden

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

from .serializers import SerializadorMesas, SerializadorPedidos


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


class CrearPedidosView(ModelViewSet):
    serializer_class = SerializadorPedidos
    queryset = DetalleOrden.objects.all()
    permission_classes = (AllowAny,)

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            self.permission_denied(
                self.request, message="You have no permissions for creating a user"
            )
        serializer.save()
