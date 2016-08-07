# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from .models import Mesas, DetalleOrden, Simbolos, Menu, Folio

from rest_framework import serializers


class SerializadorMesas(serializers.ModelSerializer):
    class Meta:
        model = Mesas


class SerializadorOrden(serializers.ModelSerializer):
    class Meta:
        model = DetalleOrden


class SerializadorSimbolos(serializers.ModelSerializer):
    class Meta:
        model = Simbolos


class SerializadorMenu(serializers.ModelSerializer):
    class Meta:
        model = Menu


class SerializadorFolio(serializers.ModelSerializer):
    class Meta:
        model = Folio


