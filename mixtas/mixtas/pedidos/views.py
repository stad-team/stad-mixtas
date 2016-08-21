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

    def printCobrar(self):
        printFinal = ''

        qsFinal = self.request.data.get('qsFinal')
        qsTotal = self.request.data.get('qsTotal')
        import ipdb; ipdb.set_trace()
        qsFinal.pop(0)
        for orden in qsFinal:
            for platillo in orden:
                _platillo = platillo.get('platillo')
                if 'B-' in _platillo:
                    _platillo = 'Bebida {0}'.format(platillo.get('platillo').split('-')[1])
                elif 'Q-' in _platillo:
                    _platillo = 'Quesadilla {0}'.format(platillo.get('platillo').split('-')[1])

                printFinal += '{0} {1} {2} \n'.format(platillo.get('cantidad'), _platillo, platillo.get('precio'))

        # Epson Bebidas y Caja
        Epson = printer.Usb(0x04b8, 0x0e02, 5)
        Epson.set(align='center')
        # Epson.image('/Users/AntonioBermudez/.virtualenvs/project-resturant-mixtas/stad-mixtas/mixtas/mixtas/menu/static/src/img/logo-circle.png')
        Epson.text('\n')
        Epson.text('Mixtas El Costeno\n')
        Epson.text('----------------------\n')
        Epson.text('\n')
        Epson.set(width=2)
        Epson.set(height=2)
        Epson.set(align='center')
        Epson.text('------Ordenes-------\n')
        Epson.text(printFinal)
        Epson.text('------Total-------\n')
        Epson.text(str(qsTotal))
        Epson.cut()

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

        import ipdb; ipdb.set_trace()
        # Epson Bebidas y Caja
        EpsonBC = printer.Usb(0x04b8, 0x0e02, 5)
        EpsonBC.set(align='center')
        # EpsonBC.image('/Users/AntonioBermudez/.virtualenvs/project-resturant-mixtas/stad-mixtas/mixtas/mixtas/menu/static/src/img/logo-circle.png')
        EpsonBC.text('\n')
        EpsonBC.text('Mixtas El Costeno\n')
        EpsonBC.text('----------------------\n')
        EpsonBC.text('\n')
        EpsonBC.set(width=2)
        EpsonBC.set(height=2)
        EpsonBC.text('Mesa #{}'.format(mesa))
        EpsonBC.text('\n')
        EpsonBC.text('\n')
        EpsonBC.set(width=1)
        EpsonBC.set(height=1)
        EpsonBC.text('------REFRESCOS-------\n')
        EpsonBC.text(totalOrdenTomar)
        EpsonBC.cut()


        # Epson Taquero
        EpsonTq = printer.Usb(0x04b8, 0x0e02, 4)
        EpsonTq.set(align='center')
        # EpsonTq.image('/Users/AntonioBermudez/.virtualenvs/project-resturant-mixtas/stad-mixtas/mixtas/mixtas/menu/static/src/img/logo-circle.png')
        EpsonTq.text('\n')
        EpsonTq.text('Mixtas El Costeno\n')
        EpsonTq.text('----------------------\n')
        EpsonTq.text('\n')
        EpsonTq.set(width=2)
        EpsonTq.set(height=2)
        EpsonTq.text('Mesa #{}'.format(mesa))
        EpsonTq.text('\n')
        EpsonTq.text('\n')
        EpsonTq.set(width=1)
        EpsonTq.set(height=1)
        EpsonTq.text('Mesero: {0}'.format(mesero))
        EpsonTq.text('\n')
        EpsonTq.text('\n')
        EpsonTq.set(align='center')
        EpsonTq.text('--------TAQUERO--------\n')
        EpsonTq.text(totalOrdenTaquero)
        EpsonTq.cut()

        # Epson Tortillera
        EpsonTort = printer.Usb(0x04b8, 0x0e02, 6)
        EpsonTort.set(align='center')
        # EpsonTort.image('/Users/AntonioBermudez/.virtualenvs/project-resturant-mixtas/stad-mixtas/mixtas/mixtas/menu/static/src/img/logo-circle.png')
        EpsonTort.text('\n')
        EpsonTort.text('Mixtas El Costeno\n')
        EpsonTort.text('----------------------\n')
        EpsonTort.text('\n')
        EpsonTort.set(width=2)
        EpsonTort.set(height=2)
        EpsonTort.text('Mesa #{}'.format(mesa))
        EpsonTort.text('\n')
        EpsonTort.text('\n')
        EpsonTort.set(width=1)
        EpsonTort.set(height=1)
        EpsonTort.text('Mesero: {0}'.format(mesero))
        EpsonTort.text('\n')
        EpsonTort.text('\n')
        EpsonTort.set(align='center')
        EpsonTort.text('------TORTILLERA-------\n')
        EpsonTort.text(totalOrdenTotillera)
        EpsonTort.cut()

    def perform_create(self, serializer):
        self.printOrden()
        serializer.save()

    def perform_update(self, serializer):
        if not self.request.data.get('pagado'):
            self.printOrden()
        else:
            self.printCobrar()
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
