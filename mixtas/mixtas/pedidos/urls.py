# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView

from rest_framework import routers

from .views import CrearObtenerMesasView, CrearPedidosView, ObtenerSimbolos, ObtenerMenu

router = routers.SimpleRouter()
router.register(r'mesas', CrearObtenerMesasView)
router.register(r'pedidos', CrearPedidosView)
router.register(r'simbolos', ObtenerSimbolos)
router.register(r'menu', ObtenerMenu)


# from .views import LoginRetrieveView

urlpatterns = patterns('',
    url(r'^mesas/$', TemplateView.as_view(template_name='pedidos/mesas.html')),
    url(r'^alta/(?P<id>[0-9]*)/$', TemplateView.as_view(template_name='pedidos/pedidos.html')),
    url(r'^api/', include(router.urls, namespace='api')),

)
