# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function


import win32print
import win32ui

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
        folio = self.request.data.get('folio')
        mesero = self.request.data.get('mesero')
        mesa = self.request.data.get('mesa')

        qsFinal.pop(0)
        for orden in qsFinal:
            for platillo in orden:
                _platillo = platillo.get('platillo')
                if 'B-' in _platillo:
                    _platillo = 'Bebida {0}'.format(platillo.get('platillo').split('-')[1])
                elif 'Q-' in _platillo:
                    _platillo = 'Quesadilla {0}'.format(platillo.get('platillo').split('-')[1])

                printFinal += '\n{0} {1} \n\t\t\t\t ${2}'.format(platillo.get('cantidad'), _platillo, platillo.get('precio'))


        print_final_caja = """
        \t FOLIO: {folio}
         MIXTAS EL COSTEÑO
         Mesero: {mesero}
         Mesa # {mesa}
        \r ----------------
        Ordenes:
        {printFinal}
        \t\t\t---- \t
            \t\t\t $ {total} \t

        \n\tDesarollado por TEAM-ANYOAN\n\t   anyoan-team@gmail.com
        """.format(
            folio=folio,
            mesero=mesero,
            mesa=mesa,
            printFinal=printFinal,
            total=qsTotal
        )

        # Epson Bebidas y Caja
        printer = win32print.OpenPrinter('EPSON TM-T88V 1')
        jid = win32print.StartDocPrinter(printer, 1, ('TEST DOC', None, 'RAW'))
        bytes = win32print.WritePrinter(printer, print_final_caja)
        win32print.EndDocPrinter(printer)
        win32print.ClosePrinter(printer)

        # Cortar
        hDC = win32ui.CreateDC()
        hDC.CreatePrinterDC('EPSON TM-T88V 1')
        hDC.StartDoc("Test doc")
        hDC.StartPage()
        hDC.EndPage()
        hDC.EndDoc()



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
                        totalOrdenTaquero += '\n{0} \n--------------\n'.format(platillo)
                    else:
                        totalOrdenTaquero += '\n{0}'.format(platillo)

                if 'Quesadilla' in platillo or 'Q' in platillo:
                    totalOrdenTotillera += '\n{0} totillas para Quesadillas'.format(cantidad)
                elif 'Taco' in platillo or 'Tacos' in platillo or 'T' in platillo:
                    totalOrdenTotillera += '\n{0} totillas para Tacos'.format(cantidad)
                elif 'B-' in platillo:
                    totalOrdenTomar += '\n{0}'.format(platillo)

        # Epson Bebidas y Caja
        if totalOrdenTomar != '':
            print_final_bebidas = """
            \t Mesero: {mesero}
             Mesa # {mesa}
            \r ----------------
            {totalOrdenTomar}




            """.format(
                mesero=mesero,
                mesa=mesa,
                totalOrdenTomar=totalOrdenTomar
            )

            printer = win32print.OpenPrinter('EPSON TM-T88V 1')
            jid = win32print.StartDocPrinter(printer, 1, ('TEST DOC', None, 'RAW'))
            bytes = win32print.WritePrinter(printer, print_final_bebidas)
            win32print.EndDocPrinter(printer)
            win32print.ClosePrinter(printer)

            # Cortar
            hDC = win32ui.CreateDC()
            hDC.CreatePrinterDC('EPSON TM-T88V 1')
            hDC.StartDoc("Test doc")
            hDC.StartPage()
            hDC.EndPage()
            hDC.EndDoc()


        if totalOrdenTaquero != '':
            print_final_taquero = """
            \t Mesero: {mesero}
             Mesa # {mesa}
            \r ----------------
            {totalOrdenTaquero}




            """.format(
                mesero=mesero,
                mesa=mesa,
                totalOrdenTaquero=totalOrdenTaquero
            )

            # Epson Taquero
            printer = win32print.OpenPrinter('EPSON TM-T88V 3')
            jid = win32print.StartDocPrinter(printer, 1, ('TEST DOC', None, 'RAW'))
            bytes = win32print.WritePrinter(printer, print_final_taquero)
            win32print.EndDocPrinter(printer)
            win32print.ClosePrinter(printer)

            # Cortar
            hDC = win32ui.CreateDC()
            hDC.CreatePrinterDC('EPSON TM-T88V 3')
            hDC.StartDoc("Test doc")
            hDC.StartPage()
            hDC.EndPage()
            hDC.EndDoc()


        if totalOrdenTotillera != '':
            print_final_tortillera = """
            \t Mesero: {mesero}
             Mesa # {mesa}
            \r ----------------
            {totalOrdenTotillera}




            """.format(
                mesero=mesero,
                mesa=mesa,
                totalOrdenTotillera=totalOrdenTotillera
            )
            # Epson Tortillera
            printer = win32print.OpenPrinter('EPSON TM-T88V 2')
            jid = win32print.StartDocPrinter(printer, 1, ('TEST DOC', None, 'RAW'))
            bytes = win32print.WritePrinter(printer, print_final_tortillera)
            win32print.EndDocPrinter(printer)
            win32print.ClosePrinter(printer)

            # Cortar
            hDC = win32ui.CreateDC()
            hDC.CreatePrinterDC('EPSON TM-T88V 2')
            hDC.StartDoc("Test doc")
            hDC.StartPage()
            hDC.EndPage()
            hDC.EndDoc()

    def perform_create(self, serializer):
        self.printOrden()
        serializer.save()

    def perform_update(self, serializer):
        if not self.request.data.get('pagado') and not self.request.data.get('print') == 'imprimir':
            self.printOrden()
        elif self.request.data.get('print') == 'imprimir':
            self.printCobrar()
        else:
            self.printCobrar()
        serializer.save()

    def get_queryset(self):
        qs = Folio.objects.all()

        date = self.request.query_params.get('date')
        if date:
            objDate = datetime.strptime(date, '%b-%d-%Y')
            qs = qs.filter(fecha__gte=objDate)

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
