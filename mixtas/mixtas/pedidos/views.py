# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from datetime import datetime
from .models import Mesas, DetalleOrden, Simbolos, Menu, Folio

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

from .serializers import SerializadorMesas, SerializadorSimbolos, SerializadorMenu, SerializadorFolio, \
    SerializadorOrden


class CrearObtenerMesasView(ModelViewSet):
    serializer_class = SerializadorMesas
    queryset = Mesas.objects.all()
    permission_classes = (AllowAny,)

    def get_queryset(self):
        qs = Mesas.objects.all()

        floor = self.request.query_params.get('floor')
        caja = self.request.query_params.get('caja')
        if floor:
            qs = qs.filter(location=floor)

        if caja:
            qs = qs.filter(status=True)

        return qs


# class CrearPedidosView(ModelViewSet):
#     serializer_class = SerializadorPedidos
#     queryset = DetalleOrden.objects.all()
#     permission_classes = (AllowAny,)

#     def perform_create(self, serializer):
#         if not self.request.user.is_staff:
#             self.permission_denied(
#                 self.request, message="You have no permissions for creating a user"
#             )
#         serializer.save()


class ObtenerSimbolos(ModelViewSet):
    serializer_class = SerializadorSimbolos
    queryset = Simbolos.objects.all()
    permission_classes = (AllowAny,)


class ObtenerMenu(ModelViewSet):
    serializer_class = SerializadorMenu
    queryset = Menu.objects.all()
    permission_classes = (AllowAny,)


class CrearFolio(ModelViewSet):
    serializer_class = SerializadorFolio
    queryset = Folio.objects.all()
    permission_classes = (AllowAny,)

    def get_queryset(self):
        qs = Folio.objects.all()

        date = self.request.query_params.get('date')
        if date:
            objDate = datetime.strptime(date, '%b-%d-%Y')
            qs = qs.filter(fecha__day=objDate.day, fecha__month=objDate.month, fecha__year=objDate.year)

        return qs


class CrearOrden(ModelViewSet):
    serializer_class = SerializadorOrden
    queryset = DetalleOrden.objects.all()
    permission_classes = (AllowAny,)

    def get_queryset(self):
        qs = DetalleOrden.objects.all()

        idOrden = int(self.request.query_params.get('idOrdenMesa'))
        if idOrden:
            qs = qs.filter(idOrden__id=idOrden).order_by('cliente')

        return qs
