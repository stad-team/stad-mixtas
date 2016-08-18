# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from escpos import printer
from datetime import datetime
from .models import Mesas, DetalleOrden, Simbolos, Menu, Folio

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

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

    def printOrden(self):
        numTortillas = ''
        cantidad = 0
        totalOrdenTaquero = ''
        totalOrdenTotillera = ''
        totalOrdenTomar = ''
        ordenes = self.request.data.get('ordenesImprimir')
        mesa = self.request.data.get('mesa')
        mesero = self.request.data.get('nombreMesero')

        for orden in ordenes:
            last = len(orden) - 1
            for index, platillo in enumerate(orden):
                cantidad = platillo.split(' ')[0]
                if not 'B-' in platillo:
                    if index == last:
                        totalOrdenTaquero += '{0} \n -------------- \n'.format(platillo)
                    else:
                        totalOrdenTaquero += '{0} \n'.format(platillo)

                if 'Quesadilla' in platillo or 'Q' in platillo:
                    totalOrdenTotillera += '{0} totillas para Quesadillas \n'.format(cantidad)
                elif 'Taco' in platillo or 'Tacos' in platillo or 'T' in platillo:
                    totalOrdenTotillera += '{0} totillas para Tacos \n'.format(cantidad)
                elif 'B-' in platillo:
                    totalOrdenTomar += '{0} \n'.format(platillo)


        #  Total Orden tortillera
        Epson = printer.Usb(0x04b8, 0x0e02)
        Epson.set(align='center')
        Epson.image('/Users/AntonioBermudez/.virtualenvs/project-resturant-mixtas/stad-mixtas/mixtas/mixtas/menu/static/src/img/logo-circle.png')
        Epson.text('\n')
        Epson.text('Mixtas El Costeno\n')
        Epson.text('----------------------\n')
        Epson.text('\n')
        Epson.set(width=2)
        Epson.set(height=2)
        Epson.text('Mesa #{}'.format(mesa))
        Epson.text('\n')
        Epson.text('\n')
        Epson.set(width=1)
        Epson.set(height=1)
        Epson.text('Mesero: {0}'.format(mesero))
        Epson.text('\n')
        Epson.text('\n')
        Epson.set(align='center')
        Epson.text('------TORTILLERA-------\n')
        Epson.text(totalOrdenTotillera)
        Epson.text('------REFRESCOS-------\n')
        Epson.text(totalOrdenTomar)
        Epson.text('--------TAQUERO--------\n')
        Epson.text(totalOrdenTaquero)
        Epson.cut()

    def perform_create(self, serializer):
        self.printOrden()
        serializer.save()

    def perform_update(self, serializer):
        if not self.request.data.get('pagado'):
            self.printOrden()
        serializer.save()

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
