# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from django.db import models


class Mesas(models.Model):

    status = models.BooleanField()
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    description = models.CharField(max_length=50)
    n_chairs = models.IntegerField()
    n_people = models.IntegerField()


class Carta(models.Model):

    status = models.BooleanField()
    nombre = models.CharField(max_length=100)
    costo = models.IntegerField()


class Orden(models.Model):

    nombreMesero = models.CharField(max_length=50)
    fecha = models.DateField()
    hora = models.TimeField()


class DetalleOrden(models.Model):

    cantidad = models.IntegerField()
    platillo = models.CharField(max_length=50)
    precio = models.IntegerField()


class Simbolos(models.Model):

    simbolo = models.CharField(max_length=10)
    claseColor = models.CharField(max_length=15, null=True, blank=True)
