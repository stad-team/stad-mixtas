# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from datetime import datetime

from django.db import models


class Folio(models.Model):

    nombreMesero = models.CharField(max_length=50)
    fecha = models.DateTimeField(default=datetime.now)
    pagado = models.BooleanField(default=False)
    total = models.FloatField(null=True, blank=True)


class Mesas(models.Model):

    status = models.BooleanField(default=False)
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    description = models.CharField(max_length=50)
    n_chairs = models.IntegerField()
    n_people = models.IntegerField()
    idOrdenMesa = models.ForeignKey(Folio, null=True, blank=True)


class Carta(models.Model):

    status = models.BooleanField()
    nombre = models.CharField(max_length=100)
    costo = models.IntegerField()


class DetalleOrden(models.Model):
    idOrden = models.ForeignKey(Folio)
    cantidad = models.IntegerField()
    platillo = models.CharField(max_length=50)
    precio = models.IntegerField()
    cliente = models.CharField(max_length=500)


class Simbolos(models.Model):

    simbolo = models.CharField(max_length=10)
    claseColor = models.CharField(max_length=15, null=True, blank=True)


class Menu(models.Model):
    tipo = models.CharField(max_length=50)
    nombre = models.CharField(max_length=100)
    nombreCorto = models.CharField(max_length=50)
    precio = models.IntegerField()
