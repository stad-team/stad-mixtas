# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from django.conf.urls import patterns, url
from django.views.generic import TemplateView

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='caja/caja.html')),
    url(r'^detalle-caja/(?P<id>[0-9]*)/(?P<locacion>[A-Z,a-z,0-9]*)/(?P<idOrdenMesa>[0-9]*)/$', TemplateView.as_view(template_name='caja/detalle-caja.html')),
    url(r'^corte-caja/$', TemplateView.as_view(template_name='caja/corte-caja.html')),
)
