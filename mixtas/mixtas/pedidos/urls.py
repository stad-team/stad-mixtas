# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView

from rest_framework import routers
# from .views import LoginRetrieveView

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='pedidos/pedidos.html')),
)
